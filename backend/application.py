"""City workspace composition, snapshots and assessment job ownership."""

import json
import threading
import time
import uuid

from agent_control import AgentCoordinator
from cities import city_config
from incident_intake import incident_issues
from integrations import Routes, World, refresh_public_roads
from public_context import PublicContext, refresh_seattle_roads

from .assessment import assess
from .common import stamp
from .workspace import Simulation


class ARC:
    def __init__(
        self,
        directory,
        start_agent=True,
        prepare_demo=True,
        city="toronto",
        analysis_lock=None,
    ):
        self.city = city
        self.config = city_config(city)
        directory.mkdir(parents=True, exist_ok=True)
        self.roads_fetch = (
            refresh_seattle_roads if city == "seattle" else refresh_public_roads
        )
        self.directory = directory
        self.sim = Simulation(directory / "arc.sqlite", city)
        self.world = World(directory)
        self.routes = Routes(directory / "routes.json")
        self.jobs = {}
        self.jobs_lock = threading.Lock()
        self.analysis_lock = analysis_lock or threading.Lock()
        self.public_context = PublicContext(
            self.roads_fetch, directory, on_update=self.sim.sync_public, city=city
        )
        self.public_roads = {
            "mode": "unavailable",
            "records": [],
            "note": "Refresh public roads to load city context.",
        }
        self.last_integration = {}
        self.engine_error = None
        if (directory / "public-roads.json").exists():
            self.public_roads = dict(
                json.loads((directory / "public-roads.json").read_text()), mode="cached"
            )
        self.prepare_demo = prepare_demo
        if prepare_demo:
            self.sim.load_demo_intake()
        self.coordinator = AgentCoordinator(self, start=start_agent)

    def sync_world(self, s):
        items = [
            {
                "type": kind,
                "id": r["id"],
                "name": r["name"],
                "attrs": dict(r, simulation_epoch=s["epoch"]),
            }
            for key, kind in [
                ("fleet", "ambulance"),
                ("hospitals", "hospital"),
                ("incidents", "incident"),
            ]
            for r in s[key]
        ]
        return self.world.call(
            "record", items=items, runId="version-" + str(s["version"])
        )

    def view(self):
        self.sim.sync_public(self.public_context.snapshot())
        with self.sim.lock:
            s = self.sim.read()
            latest = self.sim.latest_recommendations()
        agent_state = self.coordinator.snapshot(state=s, recs=latest)
        for incident in s["incidents"]:
            incident["assessment_blockers"] = incident_issues(incident)
            incident["agent_state"] = (
                agent_state["states"].get(incident["id"], {}).get("state", "queued")
            )
            incident["agent_reason"] = (
                agent_state["states"].get(incident["id"], {}).get("reason", "")
            )
        proposals = {}
        for iid, r in latest.items():
            if iid not in proposals and r.get("simulation_epoch") == s["epoch"]:
                proposals[iid] = {
                    k: r.get(k)
                    for k in [
                        "id",
                        "version",
                        "incident_revision",
                        "decision",
                        "approvable",
                        "evidence_epoch",
                        "created_epoch",
                        "status",
                    ]
                }
                proposals[iid].update(
                    ambulance_id=(r.get("selected") or {}).get("ambulance_id"),
                    hospital_id=(r.get("selected") or {}).get("hospital_id"),
                )
        assessments = [
            {
                k: j.get(k)
                for k in [
                    "id",
                    "incident_id",
                    "status",
                    "stage",
                    "error",
                    "simulation_epoch",
                    "automatic",
                ]
            }
            for j in list(self.jobs.values())
            if j.get("simulation_epoch") == s["epoch"] and j["status"] == "running"
        ]
        s["assignments"] = [
            {
                k: v
                for k, v in assignment.items()
                if k not in ("pickup_route", "transport_route", "durations")
            }
            for assignment in s["assignments"]
        ]
        return dict(
            s,
            server_epoch=time.time(),
            city=self.config,
            agent=agent_state,
            proposals=proposals,
            assessments=assessments,
            public_context=self.public_context.snapshot(),
            public_roads=self.public_roads,
            integrations=self.last_integration,
            engine_error=self.engine_error,
            simulation=True,
        )

    def start_analysis(
        self,
        incident_id,
        request,
        preferred_id=None,
        automatic=False,
        trigger=None,
        fingerprint=None,
    ):
        if fingerprint is None:
            s = self.sim.read()
            incident = next((i for i in s["incidents"] if i["id"] == incident_id), None)
            if not incident:
                raise ValueError("Incident not found")
            fingerprint = (
                s["epoch"],
                s["version"],
                incident.get("incident_revision", 0),
                self.sim.coordination(incident_id)["signature"],
            )
        if not self.analysis_lock.acquire(blocking=False):
            raise ValueError("An assessment is already running. Please wait.")
        id = str(uuid.uuid4())
        job = {
            "id": id,
            "status": "running",
            "stage": "Planning evidence tools",
            "started_at": stamp(),
            "incident_id": incident_id,
            "simulation_epoch": self.sim.read()["epoch"],
            "automatic": automatic,
            "trigger": trigger,
            "fingerprint": fingerprint,
        }
        with self.jobs_lock:
            self.jobs[id] = job

        def run():
            try:
                job["result"] = self.analyze(incident_id, request, job, preferred_id)
                job["status"] = "done"
            except Exception as e:
                job["status"] = "error"
                job["error"] = (
                    str(e)
                    if isinstance(e, (ValueError, RuntimeError))
                    else "Assessment failed. Check services and retry."
                )
            finally:
                try:
                    if hasattr(self, "coordinator"):
                        self.coordinator.finished(job)
                finally:
                    self.analysis_lock.release()

        if automatic and hasattr(self, "coordinator"):
            self.coordinator.log(
                incident_id, "Started " + (trigger or "automatic assessment") + "."
            )
        threading.Thread(target=run, daemon=True).start()
        return job

    def analyze(self, incident_id, request, job, preferred_id=None):
        return assess(self, incident_id, request, job, preferred_id)

    def review_alternative(self, body):
        prior = self.sim.get_rec(str(body.get("recommendation_id", "")))
        if (
            not prior
            or prior["version"] != self.sim.read()["version"]
            or prior["decision"] != "pending"
        ):
            raise ValueError("Refresh the proposal before choosing an alternative.")
        pair = str(body.get("pair_id", ""))
        if not any(
            a["id"] == pair and a["type"] == "assignment" and a["eligible"]
            for a in prior["alternatives"]
        ):
            raise ValueError("Only an eligible alternative may be selected.")
        return self.start_analysis(
            prior["incident_id"],
            "Review this dispatcher-selected alternative and explain its eligibility.",
            pair,
        )

    def confirm_incident_details(self, body):
        self.sim.sync_public(self.public_context.snapshot())
        return self.sim.update_incident_details(body.get("incident_id"), body)

    def review_public_call(self, body):
        source = self.public_context.snapshot().get("police", {})
        if source.get("stale", True):
            raise ValueError(
                "Public incident feed is unavailable or stale. Wait for a fresh update."
            )
        incident = next(
            (r for r in source.get("records", []) if r["id"] == body.get("id")), None
        )
        if not incident:
            raise ValueError("Public call is no longer in the current feed")
        return self.sim.add_public_review(
            incident, body.get("service"), body.get("equipment"), body.get("priority")
        )

    def reset_workspace(self):
        workspace = self
        with workspace.sim.lock:
            workspace.sim.reset()
            if workspace.prepare_demo:
                workspace.sim.load_demo_intake()
            result = workspace.sim.read()
        return result

    def decide(self, body):
        self.sim.sync_public(self.public_context.snapshot())
        r = self.sim.decide(body.get("id"), body.get("action"))
        try:
            self.sync_world(self.sim.read())
        except Exception:
            self.engine_error = "Assignment saved, but World Model sync failed. Reassess after restoring engine."
        return r

    def refresh_roads(self):
        self.public_roads = self.roads_fetch(self.directory / "public-roads.json")
        return self.public_roads
