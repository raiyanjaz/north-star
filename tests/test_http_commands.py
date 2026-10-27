"""Exercise the real HTTP/service/repository boundary with temporary local data."""

import json
import tempfile
import threading
import time
import unittest
from pathlib import Path
from types import SimpleNamespace
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from backend.application import ARC
from backend.http import ARCServer, Handler
from backend.workspace import Simulation
from cities import city_config
from decision import evaluate


class Routes:
    def get(self, a, b):
        return {
            "duration_s": 120,
            "distance_m": 1000,
            "coordinates": [[a["lon"], a["lat"]], [b["lon"], b["lat"]]],
            "mode": "cached",
            "source": "test route",
        }


class HttpCommandTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.arc = ARC.__new__(ARC)
        self.arc.sim = Simulation(Path(self.tmp.name) / "workspace.sqlite")
        self.arc.directory = Path(self.tmp.name)
        self.arc.city = "toronto"
        self.arc.config = city_config("toronto")
        self.arc.public_context = SimpleNamespace(snapshot=lambda: {})
        self.arc.prepare_demo = True
        self.arc.world = SimpleNamespace(
            call=lambda *args, **kwargs: {"prior": {}, "events": 0}
        )
        self.arc.engine_error = None
        self.server = ARCServer(("127.0.0.1", 0), Handler)
        self.server.feed_only = False
        self.server.arc = self.arc
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.base = "http://127.0.0.1:" + str(self.server.server_port)

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.arc.sim.db.close()
        self.tmp.cleanup()

    def post(self, path, body, **headers):
        request = Request(
            self.base + path,
            data=json.dumps(body).encode(),
            headers={"Content-Type": "application/json", **headers},
        )
        with urlopen(request) as response:
            return response.status, json.load(response)

    def proposal(self):
        state = self.arc.sim.read()
        groups = {
            kind: self.arc.sim.feed(kind)["records"]
            for kind in ("fleet", "hospitals", "roads")
        }
        result = evaluate(state["incidents"][0], groups, Routes())
        record = dict(
            result,
            id="proposal",
            version=state["version"],
            incident_id=state["incidents"][0]["id"],
            simulation_epoch=state["epoch"],
            decision="pending",
            approvable=True,
            created_epoch=time.time(),
        )
        self.arc.sim.store_rec(record)
        return record

    def test_approval_round_trip_preserves_atomic_reservation(self):
        record = self.proposal()
        status, response = self.post(
            "/api/decision?city=toronto", {"id": record["id"], "action": "approve"}
        )
        self.assertEqual(status, 200)
        self.assertEqual(response["decision"], "approved")
        state = self.arc.sim.read()
        self.assertEqual(len(state["assignments"]), 1)
        self.assertEqual(state["incidents"][0]["status"], "assigned")
        unit = next(
            a for a in state["fleet"] if a["id"] == record["selected"]["ambulance_id"]
        )
        self.assertEqual(unit["status"], "assigned")
        status, readback = self.get("/api/recommendations/" + record["incident_id"])
        self.assertEqual(status, 200)
        self.assertEqual(readback["decision"], "approved")

    def get(self, path):
        with urlopen(self.base + path) as response:
            return response.status, json.load(response)

    def test_changed_proposal_rejection_preserves_resources(self):
        record = self.proposal()
        self.post(
            "/api/scenario",
            {"name": "fleet-busy", "incident_id": record["incident_id"]},
        )
        before = self.arc.sim.read()
        with self.assertRaises(HTTPError) as error:
            self.post("/api/decision", {"id": record["id"], "action": "approve"})
        self.assertEqual(error.exception.code, 409)
        self.assertEqual(self.arc.sim.read(), before)
        self.assertEqual(self.arc.sim.get_rec(record["id"])["decision"], "pending")

    def test_intake_keeps_revision_checks_and_response_shape(self):
        self.arc.sim.load_demo_intake()
        incident = next(
            i for i in self.arc.sim.read()["incidents"] if i.get("prepared_intake")
        )
        body = {
            key: incident[key]
            for key in ("priority", "service", "equipment", "lat", "lon")
        }
        body.update(
            incident_id=incident["id"],
            revision=incident["incident_revision"],
            pickup_label=incident["name"],
            notes="Confirmed",
        )
        status, response = self.post("/api/incidents/details", body)
        self.assertEqual(status, 200)
        self.assertEqual(
            response,
            {
                "incident_id": incident["id"],
                "revision": incident["incident_revision"] + 1,
            },
        )
        with self.assertRaises(HTTPError) as error:
            self.post("/api/incidents/details", body)
        self.assertEqual(error.exception.code, 409)

    def test_transport_still_rejects_other_origins_and_feed_mutations(self):
        with self.assertRaises(HTTPError) as error:
            self.post("/api/reset", {}, Origin="https://untrusted.example")
        self.assertEqual(error.exception.code, 403)
        self.server.feed_only = True
        with self.assertRaises(HTTPError) as error:
            self.post("/api/reset", {})
        self.assertEqual(error.exception.code, 405)
