"""Journeys operations; use the workspace repository and existing guards."""

import time

from assignment_lifecycle import (
    SPEEDS,
    next_phase,
    release,
)
from assignment_lifecycle import advance_assignments as advance_journeys
from backend.common import stamp


def advance_assignments(workspace, now=None):
    from integrations import blocked

    now = time.time() if now is None else now
    with workspace.lock:
        with workspace.store.transaction():
            s = workspace.read()
            changed, events = advance_journeys(s, now, blocked)
            if changed:
                workspace.save(s)
            for event in events:
                workspace.log("assignment-progress", event)
            return events


def progress_assignment(workspace, id, revision, action, now=None):
    if action not in ("advance", "cancel"):
        raise ValueError("Unknown assignment action")
    if isinstance(revision, bool) or not isinstance(revision, int):
        raise ValueError("Assignment revision is required")
    now = time.time() if now is None else now
    with workspace.lock:
        workspace.advance_assignments(now)
        with workspace.store.transaction():
            s = workspace.read()
            assignment = next((a for a in s["assignments"] if a["id"] == id), None)
            if not assignment:
                raise ValueError("Assignment not found in this workspace")
            if assignment["phase"] in ("completed", "cancelled"):
                raise ValueError("This assignment has already ended")
            if assignment["revision"] != revision:
                raise ValueError(
                    "Assignment progress changed. Review the current stage."
                )
            if action == "cancel":
                release(s, assignment, now, cancelled=True)
                assignment["revision"] += 1
                assignment["history"].append({"phase": "cancelled", "at": stamp(now)})
            else:
                if assignment.get("hold_reason"):
                    raise ValueError(assignment["hold_reason"])
                next_phase(s, assignment, now)
            workspace.save(s)
            workspace.log(
                "assignment-progress",
                {
                    "assignment_id": id,
                    "incident_id": assignment["incident_id"],
                    "phase": assignment["phase"],
                    "at": stamp(now),
                },
            )
            return assignment


def set_journey_speed(workspace, speed, now=None):
    if isinstance(speed, bool) or speed not in SPEEDS:
        raise ValueError("Choose a journey speed of 1, 10 or 30")
    now = time.time() if now is None else now
    with workspace.lock:
        workspace.advance_assignments(now)
        s = workspace.read()
        for assignment in s["assignments"]:
            if not assignment["automatic"] or assignment["phase"] in (
                "completed",
                "cancelled",
            ):
                continue
            anchor = assignment.get("hold_since_epoch", now)
            span = assignment["phase_ends_epoch"] - assignment["phase_started_epoch"]
            fraction = (
                max(0, min(1, (anchor - assignment["phase_started_epoch"]) / span))
                if span
                else 1
            )
            duration = assignment["durations"][assignment["phase"]] / speed
            assignment.update(
                speed=speed,
                phase_started_epoch=now - fraction * duration,
                phase_ends_epoch=now + (1 - fraction) * duration,
            )
            if assignment.get("hold_reason"):
                assignment["hold_since_epoch"] = now
            assignment["revision"] += 1
        s["journey_speed"] = speed
        workspace.save(s)
        workspace.log("journey-speed", {"speed": speed})
        return {"journey_speed": speed}
