"""Intake operations; use the workspace repository and existing guards."""

import json
import time

from backend.common import ROOT, stamp
from incident_intake import public_key, relevant_call, valid_pickup
from station_locations import stage_available_units


def sync_public(workspace, sources):
    with workspace.lock:
        s = workspace.read()
        changed = False
        staged = (
            stage_available_units(s, sources.get("stations", {}))
            if workspace.city == "toronto"
            else []
        )
        if staged:
            s["version"] += 1
            changed = True
            workspace.log(
                "station-based-staging",
                {
                    "unit_ids": staged,
                    "basis": "Scenario units staged at official Toronto ambulance stations; not live vehicle locations",
                },
            )
        for kind in ["fire"] if workspace.city == "seattle" else ["fire", "police"]:
            source = sources.get(kind, {})
            fresh = source.get("mode") == "live" and not source.get("stale", True)
            seen = set()
            for row in source.get("records", []):
                try:
                    key = public_key(kind, row, workspace.city)
                except (ValueError, KeyError, TypeError):
                    continue
                seen.add(key)
                incident = next(
                    (i for i in s["incidents"] if i.get("public_key") == key), None
                )
                # Preserve older manually imported reviews when the same call is ingested.
                if incident is None and kind == "police":
                    incident = next(
                        (
                            i
                            for i in s["incidents"]
                            if i.get("public_source") == "Toronto Police Service"
                            and i.get("public_observed_at") == row.get("observed_at")
                            and (i.get("public_location") or i["name"])
                            == row.get("location")
                        ),
                        None,
                    )
                if incident is None:
                    if not fresh or not relevant_call(kind, row):
                        continue
                    incident = {
                        "id": "LIVE-" + key,
                        "city": workspace.city,
                        "public_key": key,
                        "public_kind": kind,
                        "public_source": workspace.config["fire_name"]
                        if kind == "fire"
                        else workspace.config["police_name"],
                        "name": row.get("location") or "Location not published",
                        "status": "open",
                        "received_at": row.get("observed_at") or stamp(),
                        "priority": None,
                        "service": None,
                        "equipment": None,
                        "lat": row.get("lat"),
                        "lon": row.get("lon"),
                        "pickup_source": "public"
                        if valid_pickup(row.get("lat"), row.get("lon"), workspace.city)
                        else None,
                        "location_precision": "public mapped address"
                        if workspace.city == "seattle"
                        else "public mapped intersection"
                        if kind == "police"
                        else "public street / postal area",
                        "incident_revision": 0,
                        "requirements_source": None,
                        "notes": "",
                        "source_review_required": False,
                    }
                    s["incidents"].append(incident)
                    changed = True
                incoming = {
                    "public_key": key,
                    "public_kind": kind,
                    "public_call_type": row.get("name"),
                    "public_location": row.get("location"),
                    "public_observed_at": row.get("observed_at"),
                    "public_lat": row.get("lat"),
                    "public_lon": row.get("lon"),
                    "public_units": row.get("units", ""),
                    "public_alarm_level": row.get("alarm_level"),
                    "public_source_url": source.get("source_url"),
                    "public_feed_status": "present" if fresh else "stale",
                }
                important = [
                    "public_call_type",
                    "public_location",
                    "public_lat",
                    "public_lon",
                    "public_alarm_level",
                    "public_observed_at",
                ]
                edited = any(
                    field in incident and incident[field] != incoming[field]
                    for field in important
                )
                if edited:
                    incident["source_review_required"] = True
                    # Preserve dispatcher pickup overrides even when the source moves.
                    if incident.get("pickup_source") != "dispatcher":
                        incident["lat"] = row.get("lat")
                        incident["lon"] = row.get("lon")
                        incident["name"] = (
                            row.get("location") or "Location not published"
                        )
                material = (
                    edited
                    or incident.get("public_feed_status")
                    != incoming["public_feed_status"]
                )
                if any(incident.get(k) != v for k, v in incoming.items()) or material:
                    incident.update(incoming)
                    if material:
                        incident["incident_revision"] = (
                            incident.get("incident_revision", 0) + 1
                        )
                    changed = True
            for incident in s["incidents"]:
                if incident.get("public_kind") != kind:
                    continue
                status = (
                    ("missing" if incident.get("public_key") not in seen else "present")
                    if fresh
                    else "stale"
                )
                if incident.get("public_feed_status") != status:
                    incident["public_feed_status"] = status
                    incident["incident_revision"] = (
                        incident.get("incident_revision", 0) + 1
                    )
                    changed = True
        if changed:
            # Feed arrivals and case edits have their own revisions; they must not expire
            # unrelated assessments by bumping the resource version on every poll.
            workspace.save(s)
        return changed


def update_incident_details(workspace, id, body):
    with workspace.lock:
        s = workspace.read()
        incident = next((i for i in s["incidents"] if i["id"] == id), None)
        if not incident or not (
            incident.get("public_source") or incident.get("prepared_intake")
        ):
            raise ValueError("Choose a public incident")
        if incident["status"] != "open":
            raise ValueError("A reserved case cannot be edited")
        if body.get("revision") != incident.get("incident_revision", 0):
            raise ValueError(
                "Call details changed. Reload and review the latest details."
            )
        service = body.get("service")
        equipment = body.get("equipment")
        priority = body.get("priority")
        if (
            service not in ["general", "cardiac", "trauma", "neuro", "pediatric"]
            or equipment not in ["general", "advanced"]
            or priority not in ["Priority 1", "Priority 2", "Priority 3"]
        ):
            raise ValueError("Choose a priority, service and equipment requirement")
        if not valid_pickup(body.get("lat"), body.get("lon"), workspace.city):
            raise ValueError(
                "Confirm a valid pickup location within " + workspace.config["name"]
            )
        lat = float(body["lat"])
        lon = float(body["lon"])
        label = str(body.get("pickup_label", "")).strip()[:200]
        pickup_source = incident.get("pickup_source")
        if (
            lat != incident.get("lat")
            or lon != incident.get("lon")
            or label != (incident.get("pickup_label") or incident["name"])
        ):
            pickup_source = "dispatcher"
        incident.update(
            service=service,
            equipment=equipment,
            priority=priority,
            lat=lat,
            lon=lon,
            pickup_label=label or incident["name"],
            name=label or incident["name"],
            pickup_source=pickup_source or "dispatcher",
            requirements_source="dispatcher",
            notes=str(body.get("notes", "")).strip()[:1000],
            source_review_required=False,
            incident_revision=incident.get("incident_revision", 0) + 1,
        )
        workspace.save(s)
        workspace.log(
            "incident-details-updated",
            {"incident_id": id, "revision": incident["incident_revision"]},
        )
        return {"incident_id": id, "revision": incident["incident_revision"]}


def add_public_review(workspace, call, service, equipment, priority):
    if (
        service not in ["general", "cardiac", "trauma", "neuro", "pediatric"]
        or equipment not in ["general", "advanced"]
        or priority not in ["Priority 1", "Priority 2", "Priority 3"]
    ):
        raise ValueError("Choose a priority, service and equipment requirement")
    # Public police records do not publish a durable call identifier. A content key
    # avoids treating their periodically rebuilt OBJECTID as an incident identity.
    import hashlib

    identity = call["observed_at"] + "|" + call["name"] + "|" + call["location"]
    iid = "PUBLIC-" + hashlib.sha256(identity.encode()).hexdigest()[:12]
    with workspace.lock:
        s = workspace.read()
        queued = next(
            (
                i
                for i in s["incidents"]
                if i.get("public_key") == public_key("police", call)
            ),
            None,
        )
        if queued:
            workspace.update_incident_details(
                queued["id"],
                {
                    "revision": queued.get("incident_revision", 0),
                    "service": service,
                    "equipment": equipment,
                    "priority": priority,
                    "lat": queued.get("lat"),
                    "lon": queued.get("lon"),
                    "pickup_label": queued["name"],
                    "notes": queued.get("notes", ""),
                },
            )
            return {"incident_id": queued["id"], "created": False}
        if any(i["id"] == iid for i in s["incidents"]):
            return {"incident_id": iid, "created": False}
        incident = {
            "id": iid,
            "name": call["location"] or call["name"],
            "lat": call["lat"],
            "lon": call["lon"],
            "service": service,
            "equipment": equipment,
            "priority": priority,
            "status": "open",
            "received_at": stamp(),
            "description": call["name"] + " · dispatcher-defined review requirements",
            "public_source": "Toronto Police Service",
            "public_observed_at": call["observed_at"],
            "public_call_type": call["name"],
            "requirements_source": "dispatcher",
            "location_precision": "public mapped intersection",
        }
        s["incidents"].append(incident)
        s["version"] += 1
        workspace.save(s)
        workspace.log(
            "public-review-created",
            {"incident_id": iid, "source": "Toronto Police Service"},
        )
        return {"incident_id": iid, "created": True}


def load_demo_intake(workspace):
    with workspace.lock:
        s = workspace.read()
        if s.get("demo_intake_loaded"):
            return False
        profile = json.loads(
            (
                ROOT
                / (
                    "fixtures/seattle.json"
                    if workspace.city == "seattle"
                    else "fixtures/demo-intake.json"
                )
            ).read_text()
        )
        public = [i for i in s["incidents"] if i.get("public_feed_status") == "present"]
        for n, case in enumerate(profile["incidents"]):
            if any(i["id"] == case["id"] for i in s["incidents"]):
                continue
            reference = public[n % len(public)] if public else None
            s["incidents"].append(
                dict(
                    case,
                    city=workspace.city,
                    status="open",
                    received_at=stamp(time.time() + n * 0.001),
                    incident_revision=0,
                    prepared_intake=True,
                    requirements_source="prepared_demo",
                    pickup_source="prepared_demo",
                    location_precision="prepared exercise location",
                    notes="Prepared exercise intake; clinical requirements and pickup are supplied by the demo profile.",
                    public_reference={
                        k: reference.get(k)
                        for k in [
                            "public_source",
                            "public_key",
                            "public_call_type",
                            "public_location",
                            "public_observed_at",
                        ]
                    }
                    if reference
                    else None,
                )
            )
        for unit in profile["fleet"]:
            if not any(a["id"] == unit["id"] for a in s["fleet"]):
                s["fleet"].append(unit)
        s["demo_intake_loaded"] = True
        s["version"] += 1
        workspace.save(s)
        workspace.log(
            "prepared-intake-loaded",
            {"cases": [i["id"] for i in profile["incidents"]]},
        )
        return True
