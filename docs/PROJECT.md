# ARC — Assisted Routing & Coordination

Owner: NorthStar. Primary track: The Agent That Can Explain Why.

## Product contract
Toronto dispatcher decision-support simulation. Predefined incidents and service
requirements, simulated operational hospital/fleet APIs, actual road geography.
No diagnosis, automatic dispatch, or claims of clinical validation.

Acceptance: evidence-backed ambulance + hospital + two route legs; rejected
alternatives; source provenance and freshness; scenario changes invalidate approval;
atomic reservation; explicit unavailable integrations; repeatable reset; browser QA.

## Architecture decision
Python standard-library HTTP server and existing sponsor clients; buildless JS/CSS
UI with Leaflet; SQLite transactional simulation state. Separate read-only feed
listener for Zetaris's Docker network. Zetaris joins distinct REST sources in the
recommendation path. Meterless World Model upstream reference runs in a persistent
Node subprocess, persists typed entities/facts/relationships, and supplies prior
context for reassessment. SQLite is not claimed as a sponsor engine.
Nightshift/Nemotron generates structured evidence explanations; deterministic
rules own resource eligibility, route costs, and approval decisions.

## Milestones
- [x] Inspect existing setup: Zetaris SELECT 1 and catalog, fresh Nemotron response.
- [x] Select product, track, architecture. Confirm empty non-Git starter.
- [x] Integrate feeds, Zetaris, routing and actual World Model reference.
- [x] Implement decision engine and atomic approval lifecycle.
- [x] Complete dispatcher UI and scenario controls.
- [x] Automated checks and full browser verification.
- [x] Submission deck, demo script, documentation and reproducible source packaging.
- [ ] Human: Cursor clarification, video recording, authorized publication and submission.

## Rules verified 2026-10-22 (Toronto)
Event: https://hackathon.genai.works/event/open-agent-hackathon-2026
Guide (updated October 21): https://docs.google.com/document/d/1_d3osxbXZRpp4Ln80w6Obc5xx06SmkIMrgp6BOj0Ofc/edit
Engines: https://meterless.ai/engines.html
Deadline: October 27, 23:45 UTC / 19:45 Toronto. Demo 1–4 minutes. Slides,
GitHub source and setup README, sponsor integration explanation required.
Data: Zetaris. Build: at least one actual Meterless Engine. Power: Nightshift
primary provider; useful Nemotron feature through Nightshift for NVIDIA award.
Cursor conflict: event rules 5 require Cursor and submission asks how it was used;
guide Build section explicitly says Cursor optional. Organizer clarification is
still needed. Do not claim development here satisfies Cursor requirement.
Pre-existing work: two connection clients and configuration setup only; declare it.

## Validation / commands
Recorded as implementation progresses. No publication is authorized.

## Open items
- Resolve Cursor discrepancy with organizer before submission (human action).
- Public-road data is not a verified ambulance routing feed. Simulated capacity
  and service rules must stay visibly labelled.

## Final validation
29 application/workspace checks, Python compile and JS syntax checks passed. Upstream engine
conformance 8/8 passed. Real sponsor acceptance and full browser assessment/change/
approval workflow passed. See docs/VALIDATION.md and artifacts/live-validation.json.
Exact launch: ./run.sh. Test: ./scripts/check.sh. Full service acceptance:
"$(scripts/python-path.sh)" scripts/live-check.py (resets simulation).
Demo and remaining human actions: docs/DEMO.md and docs/HANDOFF.md.


## Current dispatcher workspace
Persistent priority/waiting queue, visible fleet and hospital status, separate
response and destination-preview sections, visible evidence age and persistent
incident-specific change alerts. Background results stay with their incident;
operators can switch cases during inference. Eligible alternative selection
triggers fresh checks and a grounded explanation. Scenario targeting is tied to
the selected incident. Details and scroll positions survive background refresh.
See docs/UX.md for the user model, research sources and limits.

Current validation: 21 Python + 8 workspace behavior tests + 8 upstream engine
checks. Browser verified background case switching, result ownership, alternative
reassessment/approval, persistent change alerts and workstation/narrow layouts.
Latest deck: artifacts/arc-deck-workspace.pptx.

## Operator-facing wording
Removed repeated prototype/simulation badges and disclosures from the dispatcher
workspace at the user's request. Normal assignment and availability wording is
used. Source boundaries, disconnected crew/hospital communication and synthetic
feeds are tracked in docs/SIMULATION-NOTES.md and submission documentation.
Evidence age, failed services and travel-estimate limits remain operationally
visible. No external integration or operational capability changed.
