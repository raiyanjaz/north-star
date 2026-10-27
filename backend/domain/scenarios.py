"""Scenarios operations; use the workspace repository and existing guards."""

import json
import time

from backend.common import ROOT, stamp

from .seeds import FLEET, HOSPITALS, INCIDENTS


def reset(workspace):
    with workspace.lock:
        old = workspace.read() if workspace.store.has_state() else {"version": 0}
        profile = (
            json.loads((ROOT / "fixtures/seattle.json").read_text())
            if workspace.city == "seattle"
            else {"fleet": FLEET, "hospitals": HOSPITALS, "incidents": INCIDENTS}
        )
        initial = (
            [
                dict(
                    i,
                    prepared_intake=True,
                    incident_revision=0,
                    requirements_source="prepared_demo",
                    pickup_source="prepared_demo",
                    notes="Prepared Seattle exercise intake; not facts supplied by the public feed.",
                )
                for i in profile["incidents"]
            ]
            if workspace.city == "seattle"
            else profile["incidents"]
        )
        s = {
            "city": workspace.city,
            "version": old["version"] + 1,
            "epoch": stamp(),
            "fleet": profile["fleet"],
            "hospitals": profile["hospitals"],
            "incidents": [
                dict(
                    i,
                    city=workspace.city,
                    status="open",
                    received_at=stamp(time.time() - 120 + n * 45),
                )
                for n, i in enumerate(initial)
            ],
            "scenario": "baseline",
            "feed_stale": False,
            "zetaris_offline": False,
            "ai_offline": False,
            "closures": [],
            "assignments": [],
            "journey_speed": old.get("journey_speed", 10),
        }
        workspace.save(s)
        workspace.log("reset", {"version": s["version"]})
        return workspace.read()


def scenario(workspace, name, incident_id=None):
    allowed = [
        "hospital-unavailable",
        "road-closure",
        "fleet-busy",
        "stale-feed",
        "no-destination",
        "zetaris-offline",
        "ai-offline",
        "refresh",
    ]
    if name not in allowed:
        raise ValueError("Unknown scenario")
    with workspace.lock:
        s = workspace.read()
        s["version"] += 1
        s["scenario"] = name
        rec = (
            workspace.store.latest(incident_id, s["epoch"])
            if incident_id
            else workspace.store.latest()
        ) or {}
        selected = rec.get("selected") or {}
        hid = selected.get("hospital_id", s["hospitals"][0]["id"])
        aid = selected.get("ambulance_id", s["fleet"][0]["id"])
        if name == "hospital-unavailable":
            for h in s["hospitals"]:
                if h["id"] == hid:
                    h["accepting"] = 0
        if name == "road-closure":
            coords = selected.get("transport_route", {}).get("coordinates", [])
            p = (
                coords[max(0, len(coords) - 3)]
                if coords
                else [s["hospitals"][0]["lon"], s["hospitals"][0]["lat"]]
            )
            s["closures"] = [
                {
                    "id": "SIM-C1",
                    "name": "Simulated destination approach closure",
                    "lon": p[0],
                    "lat": p[1],
                    "radius_m": 100,
                    "active": 1,
                }
            ]
        if name == "fleet-busy":
            for a in s["fleet"]:
                if a["id"] == aid:
                    a["status"] = "busy"
        if name == "no-destination":
            for h in s["hospitals"]:
                h["accepting"] = 0
        s["feed_stale"] = name == "stale-feed"
        s["zetaris_offline"] = name == "zetaris-offline"
        s["ai_offline"] = name == "ai-offline"
        workspace.save(s)
        workspace.log("scenario", {"name": name, "version": s["version"]})
        return s
