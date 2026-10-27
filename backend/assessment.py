"""Assessment pipeline: evidence collection, deterministic evaluation and explanation."""

import time
import uuid

from agent import Agent
from coordination import proposal_conflict
from decision import evaluate
from incident_intake import incident_issues
from integrations import Federation

from .common import stamp


def assess(workspace, incident_id, request, job, preferred_id=None):
    workspace.sim.sync_public(workspace.public_context.snapshot())
    s = workspace.sim.read()
    incident = next((x for x in s["incidents"] if x["id"] == incident_id), None)
    if not incident or incident["status"] != "open":
        raise ValueError("Choose an open incident")
    if incident_issues(incident):
        raise ValueError("; ".join(incident_issues(incident)))
    previous_at_start = workspace.sim.latest_recommendations().get(incident_id)
    if s["ai_offline"]:
        raise RuntimeError(
            "Nightshift failure scenario active. No AI explanation generated."
        )
    agent = Agent()
    tools, plan_receipt = agent.plan(request)
    trace = [
        {"tool": "Nemotron tool plan", "status": "complete", "detail": ", ".join(tools)}
    ]
    if "refresh_public_roads" in tools:
        job["stage"] = "Refreshing public road context"
        workspace.public_roads = workspace.roads_fetch(
            workspace.directory / "public-roads.json"
        )
    job["stage"] = "Federating fleet, hospitals and roads through Zetaris"
    if s["zetaris_offline"]:
        raise RuntimeError(
            "Zetaris failure scenario active. No direct-feed substitution was used."
        )
    groups, z = Federation(workspace.city).snapshot()
    workspace.last_integration["zetaris"] = z
    if z["version"] != s["version"]:
        raise RuntimeError("Conditions changed while evidence was collected. Reassess.")
    trace.append(
        {
            "tool": "federate_resources",
            "status": "complete",
            "detail": str(z["rows"])
            + " rows from three REST sources; "
            + str(z["duration_ms"])
            + " ms",
        }
    )
    job["stage"] = "Calculating eligible assignments and road-network routes"
    coordination = workspace.sim.coordination(incident_id)
    job["fingerprint"] = (
        s["epoch"],
        s["version"],
        incident.get("incident_revision", 0),
        coordination["signature"],
    )
    result = evaluate(incident, groups, workspace.routes, preferred_id, coordination)
    trace.append(
        {
            "tool": "calculate_routes",
            "status": "complete",
            "detail": "Explicit service, equipment, acceptance, availability, freshness and closure checks",
        }
    )
    job["stage"] = "Recalling resource history from Meterless World Model"
    # Prior context is obtained from the actual engine before ingesting this assessment.
    memory = workspace.sync_world(s)
    changes = []
    for key, kind in [("fleet", "ambulance"), ("hospitals", "hospital")]:
        for r in s[key]:
            old = memory["prior"].get(r["id"])
            if old and old.get("simulation_epoch") == s["epoch"]:
                for field in ["status", "accepting", "slots"]:
                    if field in r and old.get(field) != r[field]:
                        changes.append(
                            {
                                "id": "C" + str(len(changes) + 1),
                                "text": r["name"]
                                + ": "
                                + field
                                + " changed from "
                                + str(old.get(field))
                                + " to "
                                + str(r[field])
                                + ".",
                                "source": "Meterless World Model prior entity → current evidence",
                            }
                        )
    previous = workspace.sim.store.latest(incident_id)
    if previous and previous.get("simulation_epoch") == s["epoch"]:
        prev = previous
        old = prev.get("selected")
        new = result.get("selected")
        if (
            old
            and new
            and old["id"] == new["id"]
            and any(
                abs(old.get(k, 0) - new.get(k, 0)) >= 1
                for k in ["pickup_min", "transport_min"]
            )
        ):
            changes.append(
                {
                    "id": "C" + str(len(changes) + 1),
                    "text": "Route estimates changed: response "
                    + str(old["pickup_min"])
                    + " to "
                    + str(new["pickup_min"])
                    + " min; transport "
                    + str(old["transport_min"])
                    + " to "
                    + str(new["transport_min"])
                    + " min.",
                    "source": "Previous recommendation vs current route estimates",
                }
            )
        if old and (not new or new["id"] != old["id"]):
            changes.append(
                {
                    "id": "C" + str(len(changes) + 1),
                    "text": "Assignment revised from "
                    + old["name"]
                    + " to "
                    + (new["name"] if new else "no feasible assignment")
                    + ". Fresh approval required.",
                    "source": "Previous recommendation vs current constrained calculation",
                }
            )
    if s["closures"]:
        changes.append(
            {
                "id": "C" + str(len(changes) + 1),
                "text": "Simulated destination approach closure is active. Routes crossing its 100 m zone are excluded.",
                "source": "Zetaris simulated roads",
            }
        )
    trace.append(
        {
            "tool": "recall_world_history",
            "status": "complete",
            "detail": str(memory["events"])
            + " persistent engine events; "
            + str(len(changes))
            + " relevant changes",
        }
    )
    job["stage"] = "Nemotron composing a cited explanation"
    explanation, receipt = agent.explain(result["evidence"], changes)
    evidence_epoch = min(
        __import__("datetime").datetime.fromisoformat(r["observed_at"]).timestamp()
        for rows in groups.values()
        for r in rows
    )
    if result.get("selected"):
        traffic_epochs = [
            result["selected"][leg]["fetched_epoch"]
            for leg in ["pickup_route", "transport_route"]
            if result["selected"][leg].get("traffic_aware")
        ]
        if traffic_epochs:
            evidence_epoch = min(evidence_epoch, *traffic_epochs)
    result["fresh"] = result["fresh"] and time.time() - evidence_epoch <= 120
    rec = dict(
        result,
        automatic=job.get("automatic", False),
        trigger=job.get("trigger"),
        coordination_signature=coordination["signature"],
        coordination=coordination,
        incident_revision=incident.get("incident_revision", 0),
        simulation_epoch=s["epoch"],
        evidence_epoch=evidence_epoch,
        id=str(uuid.uuid4()),
        incident_id=incident_id,
        version=s["version"],
        created_at=stamp(),
        created_epoch=time.time(),
        decision="pending",
        changes=changes,
        explanation=explanation,
        trace=trace,
        zetaris=z,
        ai={"status": "online", "plan": plan_receipt, "explanation": receipt},
        source_rows=groups,
        request=request[:500],
    )
    rec["approvable"] = (
        bool(rec["selected"])
        and rec["fresh"]
        and workspace.sim.read()["version"] == s["version"]
    )
    if workspace.sim.read()["version"] != s["version"]:
        raise RuntimeError(
            "Conditions changed during analysis. Results discarded; reassess."
        )
    workspace.sim.sync_public(workspace.public_context.snapshot())
    latest = next(
        i for i in workspace.sim.read()["incidents"] if i["id"] == incident_id
    )
    if latest.get("incident_revision", 0) != incident.get(
        "incident_revision", 0
    ) or incident_issues(latest):
        raise RuntimeError(
            "Incident details or public feed changed during analysis. Results discarded; review and reassess."
        )
    if proposal_conflict(
        rec, workspace.sim.coordination(incident_id), workspace.sim.read()
    ):
        raise RuntimeError(
            "Competing resource proposals changed during analysis. ARC will reassess."
        )
    current_decision = workspace.sim.latest_recommendations().get(incident_id)
    if (
        job.get("automatic")
        and previous_at_start
        and previous_at_start.get("decision") == "pending"
        and current_decision
        and current_decision["id"] == previous_at_start["id"]
        and current_decision.get("decision") == "rejected"
    ):
        raise RuntimeError(
            "Dispatcher rejected the plan during refresh. Update intake or retry when ready."
        )
    p = rec["selected"] or {}
    workspace.world.call(
        "record",
        items=[],
        assignment={
            "id": rec["id"],
            "incident": incident_id,
            "ambulance": p.get("ambulance_id"),
            "hospital": p.get("hospital_id"),
            "version": s["version"],
            "status": rec["status"],
        },
    )
    workspace.sim.store_rec(rec)
    workspace.last_integration["nightshift"] = receipt
    return rec
