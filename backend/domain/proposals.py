"""Proposals operations; use the workspace repository and existing guards."""

import time

from assignment_lifecycle import (
    make_assignment,
)
from coordination import commitments, current_proposal, proposal_conflict
from incident_intake import incident_issues


def store_rec(workspace, rec):
    with workspace.lock:
        workspace.store.insert_recommendation(rec)
        for old in workspace.store.other_recommendations(rec["id"]):
            if (
                old.get("incident_id") == rec["incident_id"]
                and old.get("simulation_epoch") == rec.get("simulation_epoch")
                and old.get("decision") == "pending"
                and not old.get("superseded_by")
            ):
                old.update(
                    approvable=False,
                    superseded_by=rec["id"],
                    invalidation_reason="A newer assessment supersedes this plan.",
                )
                workspace.store.update_recommendation(old)
        s = workspace.read()
        latest = workspace.latest_recommendations()
        for incident in s["incidents"]:
            other = latest.get(incident["id"])
            if not current_proposal(other, incident, s):
                continue
            coord = commitments(incident, s, latest)
            if proposal_conflict(other, coord, s):
                other["approvable"] = False
                other["coordination_invalidated"] = True
                other["invalidation_reason"] = (
                    "Higher-priority pending proposals changed. ARC is coordinating a fresh plan."
                )
                workspace.store.update_recommendation(other)


def decide(workspace, id, action):
    if action not in ["approve", "reject"]:
        raise ValueError("Unknown decision")
    with workspace.lock:
        with workspace.store.transaction():
            r = workspace.get_rec(id)
            s = workspace.read()
            if not r:
                raise ValueError("Recommendation not found")
            if r.get("superseded_by"):
                raise ValueError(
                    "A newer plan is available. Review the latest assessment."
                )
            if r["decision"] != "pending":
                raise ValueError("This recommendation has already been decided")
            if r["version"] != s["version"]:
                raise ValueError("Conditions changed. Reassess before deciding.")
            incident = next(x for x in s["incidents"] if x["id"] == r["incident_id"])
            if r.get("incident_revision", 0) != incident.get("incident_revision", 0):
                raise ValueError("Incident details changed. Reassess before deciding.")
            if action == "approve":
                if proposal_conflict(r, workspace.coordination(incident["id"]), s):
                    raise ValueError(
                        "Competing resource proposals changed. Wait for ARC to reassess."
                    )
                if incident_issues(incident):
                    raise ValueError("; ".join(incident_issues(incident)))
                if (
                    not r.get("approvable")
                    or time.time() - r.get("evidence_epoch", r["created_epoch"]) > 120
                ):
                    raise ValueError("Recommendation is blocked or expired. Reassess.")
                p = r["selected"]
                a = next(x for x in s["fleet"] if x["id"] == p["ambulance_id"])
                h = next(x for x in s["hospitals"] if x["id"] == p["hospital_id"])
                incident = next(
                    x for x in s["incidents"] if x["id"] == r["incident_id"]
                )
                if (
                    a["status"] != "available"
                    or not h["accepting"]
                    or h["slots"] < 1
                    or incident["status"] != "open"
                ):
                    raise ValueError("Resource or incident is no longer available")
                a["status"] = "assigned"
                h["slots"] -= 1
                incident["status"] = "assigned"
                s["assignments"].append(make_assignment(r, s, time.time()))
                s["version"] += 1
                workspace.save(s)
            r["decision"] = "approved" if action == "approve" else "rejected"
            workspace.store.update_recommendation(r)
            workspace.log(r["decision"], {"recommendation": id})
            return r
