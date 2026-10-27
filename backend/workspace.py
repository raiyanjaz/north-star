"""Transactional workspace resources, public incident intake and local reservations."""

import time

from assignment_lifecycle import (
    migrate_assignments,
)
from cities import city_config
from coordination import commitments

from .common import stamp
from .domain import intake, journeys, proposals, scenarios
from .storage import WorkspaceRepository


class Simulation:
    def __init__(self, path, city="toronto"):
        self.city = city
        self.config = city_config(city)
        self.store = WorkspaceRepository(path)
        # Compatibility for existing diagnostics; application code uses the repository.
        self.db = self.store.db
        self.lock = self.store.lock
        if not self.store.has_state():
            self.reset()
        with self.lock:
            state = self.read()
            if migrate_assignments(state, time.time()):
                self.save(state)

    def read(self):
        return self.store.read()

    def save(self, s):
        self.store.save(s)

    def log(self, event, payload):
        self.store.log(event, payload)

    def reset(self):
        return scenarios.reset(self)

    def feed(self, kind):
        s = self.read()
        now = stamp(time.time() - 1200 if s["feed_stale"] else None)
        rows = (
            s[kind]
            if kind != "roads"
            else s["closures"]
            or [
                {
                    "id": "CLEAR",
                    "name": "No simulated closure",
                    "lat": 0.0,
                    "lon": 0.0,
                    "radius_m": 0,
                    "active": 0,
                }
            ]
        )
        # Keep the registered REST table shape stable; rich station provenance lives
        # in /api/state while the established source field describes mixed geography.
        return {
            "records": [
                dict(
                    {
                        k: v
                        for k, v in r.items()
                        if kind != "fleet"
                        or k in ("id", "name", "lat", "lon", "equipment", "status")
                    },
                    version=s["version"],
                    source="simulated_journey"
                    if r.get("location_source") == "simulated_journey"
                    else "simulated_unit_at_official_station"
                    if r.get("station_reference")
                    else "simulated",
                    observed_at=now,
                )
                for r in rows
            ]
        }

    def scenario(self, name, incident_id=None):
        return scenarios.scenario(self, name, incident_id)

    def sync_public(self, sources):
        return intake.sync_public(self, sources)

    def update_incident_details(self, id, body):
        return intake.update_incident_details(self, id, body)

    def add_public_review(self, call, service, equipment, priority):
        return intake.add_public_review(self, call, service, equipment, priority)

    def latest_recommendations(self):
        with self.lock:
            return self.store.latest_for_epoch(self.read()["epoch"])

    def latest_recommendation(self, incident_id):
        with self.lock:
            return self.store.latest(incident_id, self.read()["epoch"])

    def coordination(self, incident_id):
        with self.lock:
            s = self.read()
            incident = next(i for i in s["incidents"] if i["id"] == incident_id)
            return commitments(incident, s, self.latest_recommendations())

    def load_demo_intake(self):
        return intake.load_demo_intake(self)

    def store_rec(self, rec):
        return proposals.store_rec(self, rec)

    def get_rec(self, id):
        return self.store.get_recommendation(id)

    def advance_assignments(self, now=None):
        return journeys.advance_assignments(self, now)

    def progress_assignment(self, id, revision, action, now=None):
        return journeys.progress_assignment(self, id, revision, action, now)

    def set_journey_speed(self, speed, now=None):
        return journeys.set_journey_speed(self, speed, now)

    def decide(self, id, action):
        return proposals.decide(self, id, action)
