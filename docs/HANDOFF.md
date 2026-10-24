# ARC handoff — current workspace

## Run
`./run.sh`, then http://127.0.0.1:4317. Preserve private .env and keep Zetaris /
OrbStack and Nightshift running. First installation only, while ARC is running:
`"$(scripts/python-path.sh)" scripts/register-sources.py`.
Zetaris UI stays on port 3000. No data volumes or encryption keys were removed.

## Dispatcher experience
Persistent incident queue ordered by simulation priority, then arrival. Waiting
time, assessment status and changed conditions are visible. Unit availability and
receiving-facility status stay on screen. The queue scrolls independently when
space is constrained.

The selected case separates the response unit / estimated arrival from the
hospital destination preview / transport estimate. Evidence age is visible before
approval. Expired or changed proposals cannot be approved. Previously assessed
routes become dashed amber with a review-required label.

Assessments stay attached to their incident while other incidents remain usable.
One inference job runs at a time. Eligible alternatives can be requested explicitly;
each receives fresh source checks, deterministic eligibility and routing checks,
and a new Nemotron explanation before approval. Case scroll position and expanded
reasoning survive case switching and background refresh.

Approval atomically reserves a simulated unit and receiving slot. It does not
contact staff, establish crew acknowledgment, or authorize a real clinical
hospital destination. The UI states this explicitly. Scenario controls are in the
header; System details is the header's ⋯ button. Reset is under Scenario controls.

## Real integrations
Zetaris combines three distinct REST feeds in product assessments. Nightshift is
the primary AI provider; actual receipts identify the winning NVIDIA Nemotron
model. The pinned upstream Meterless World Model reference persists typed
resources, provenance and recommendation relationships and recalls prior state.
SQLite is separate transactional application storage, not a sponsor engine.

## Verification
21 Python tests + 8 workspace behavior tests + 8 upstream engine conformance
checks pass. Python compilation and JavaScript syntax pass. Actual browser
verification covered background case switching, result ownership, alternative
reassessment and approval, priority/waiting display, source age, scenario targeting,
and persistent change alerts. Tested 1440×900 workstation and default in-app
layouts. Source and API responses passed configured-secret checks.

Results: artifacts/checks.txt, artifacts/workspace-validation.json. Earlier full
service acceptance: artifacts/live-validation.json. Research and design limits:
docs/UX.md. No dispatcher interviews or whole-product WCAG audit are claimed.

## Deliverables
- App and README with reproducible setup and usage.
- docs/ARCHITECTURE.md, docs/DATA-SOURCES.md, docs/REQUIREMENTS.md, docs/UX.md.
- docs/DEMO.md: recording sequence and narration.
- docs/SUBMISSION.md: draft entry and checklist.
- artifacts/arc-deck-workspace.pptx: latest 8-slide deck. Changed slides rendered
  and inspected; package, layout and reimport validation pass. Original
  arc-deck.pptx is the earlier version. No PowerPoint execution is claimed.
- artifacts/arc-source.zip: source package without .env, runtime state or secrets.
- docs/assets/arc-workspace.png: latest workstation screenshot.

## Remaining human steps
1. Resolve the Cursor contradiction: event rules require Cursor; current setup
   guide calls it optional. Confirm with organizers, or do meaningful Cursor work
   and record its use truthfully. This chat's work uses Codex.
2. Review with the team. Private GitHub repository creation is authorized; public release is separate.
3. Record/upload the narrated 1–4 minute demo. No video file is claimed; the
   toolchain had screenshots but no ready encoder or dedicated recording tool.
4. Confirm HackOS team / track, attach source/video/deck, and submit before
   October 27, 2026 at 23:45 UTC / 7:45 p.m. Toronto.
5. Replace expiring tokens if continuing beyond their validity window.

## Limits
Synthetic operations and clinical requirements, approximate coordinates, static
OSRM driving estimates, no live traffic or emergency privileges. Closure scenarios
exclude affected legs rather than calculate a detour. Public road restrictions
are optional partial context. Nightshift may reroute a requested model: use the
winning receipt. Local, single-user application; no real dispatch connection or
production authentication. Inference is serialized and has variable latency.

Source is managed in a private GitHub repository. No hackathon submission is claimed.
The local application is left running. Prior source-package extraction passed
checks; the latest package includes the workspace changes and their checks.

Operator wording now avoids repeated simulation labels. The complete internal
register is docs/SIMULATION-NOTES.md. Workspace controls contains scenario/reset
actions. Approval remains a local reservation, not a delivered dispatch message.

## October 23 live-information revision

Toronto live picture is below the map: Fire/medical assists, Police calls, road
restrictions, ER Watch waits and traffic observations/cameras. Public map overlays
are optional and do not recenter the map. Police call review requires explicit
priority/service/equipment and creates a local case with source provenance.
It does not infer patient needs. Existing state is preserved on launch.

Optional `TOMTOM_API_KEY` enables sampled downtown flow speeds and traffic-informed
routing on fresh assessments. TomTom registration completed; dedicated ARC Toronto traffic key is configured
for Routing and Traffic APIs. Live flow and the full assessment path were verified. Keep credentials only in `.env` or server environment. No key is exposed
in the UI or logs. See DATA-SOURCES and SIMULATION-NOTES for updated boundaries.

## Automatic Toronto queue revision

Public calls are now automatically persisted in the main queue (Fire plus selected
Police safety categories). Source filters and an inline intake form replace the
need to manually import each mapped call. Fill explicit requirements and confirm
a pickup using coordinates or the map. Missing/cached/stale calls remain review
items and never auto-resolve. Dispatcher entries survive source refreshes.

incident_intake.py owns identity/readiness policy. Per-case incident_revision
protects assessments and approval while allowing unrelated feed arrivals. Resource
version, atomic reservations and the full sponsor path remain in place. The old
source archive/decks predate this revision; they were not regenerated or published.

## Autonomous map workspace — latest

Launching now adds three prepared exercise intakes and two standby units once per
epoch, preserving existing reservations. AgentCoordinator automatically assesses
complete incidents, refreshes aging plans and responds to input/resource changes.
The map-led screen has an approvals/work/input inbox, persistent resource statuses,
and a decision panel. The Pause agent / Resume agent control is on the map toolbar.
Manual reassessment and alternative selection remain available for exceptions.

Prepared intake fields are authored demo data, explicitly labeled and documented;
public calls are not silently given clinical facts or precise medical addresses.
Advisory pending-plan commitments avoid competing proposals for the same unit and
account for receiving slots. Only human approval reserves resources. Rejection
halts automatic resubmission on unchanged input. Service failures back off and
surface for input; automatic starts are rate-limited. See ARCHITECTURE for exact
policy limits. Current files include agent_control.py, coordination.py and
web/agent-workspace.css. Old source archive and slide decks predate these changes.
