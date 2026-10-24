# ARC — Assisted Routing & Coordination

NorthStar's Open Agent Hackathon 2026 application. Primary track: **The Agent That
Can Explain Why**. A Toronto dispatcher decision-support simulation with real
Zetaris federation, Nightshift/NVIDIA Nemotron inference and Meterless World Model.

## Quick start

### Opening ARC with the team

After the computer has been configured, double-click **Start ARC.command** on Mac
or **Start ARC.bat** on Windows. The launcher checks Python, Node.js, Zetaris and
Nightshift, starts ARC, registers its feeds on first use, and opens your browser.
Keep its window open while using ARC. If ARC is already running, it reuses it.

**A download from GitHub alone is not a complete installation.** Each computer
still needs Python 3.11+, Node.js 24+, a configured Zetaris installation, Nightshift
with a working model provider, and its own private `.env` credentials. Never put
those credentials in GitHub. Windows launch is provided but has not been tested
on a Windows computer. See [team setup](docs/TEAM-SETUP.md).

For teammates who should only open a browser, use one centrally configured host
with HTTPS and access control. Hosting has not been configured in this repository;
the current application listens on this computer only. A private GitHub repository
stores code and does not host this Python application.

### Developer setup

Requirements: Python **3.11+**, Node **24+**, running Zetaris and Nightshift Runtime.
No Python or Node application packages need installing. Leaflet and Meterless's
Apache-2.0 World Model reference are vendored. No build step is needed.

1. Preserve your existing `.env`, or copy `.env.example` and supply your own secrets.
   The NVIDIA provider key belongs in Nightshift, never this project or the browser.
2. Keep OrbStack and Zetaris running. Existing installation:
   `cd /Users/raiyanjaz/Developer/zetaris-platform && docker compose start`.
   Never use `docker compose down -v`: it deletes platform data and encryption keys.
3. Open Nightshift and confirm the NVIDIA provider and Nemotron model work.
4. From this folder, start ARC:

   ```sh
   ./run.sh
   ```

5. In a second terminal, register ARC's additive Zetaris sources (first installation):

   ```sh
   "$(scripts/python-path.sh)" scripts/register-sources.py
   ```

6. Open **http://127.0.0.1:4317**. Select an incident and **Assess response plan**.

`run.sh` uses a supported Python/Node on PATH, or the available Codex bundled runtime
on this machine. For another installation, set `PYTHON_BIN` and `NODE_BIN` to your
executables. You can also launch `python3 app.py` directly with Python 3.11+ and
Node 24+ on PATH. The older macOS system Python 3.9 is unsupported.

### Configuration

Private `.env` keys: `ZETARIS_REST_URL`, `ZETARIS_ORG_ID`, `ZETARIS_API_KEY`,
`METERLESS_BASE_URL`, `METERLESS_RUNTIME_TOKEN`, `METERLESS_MODEL`.
Environment variables override the file. Use the actual configured organization ID.
Requested tested model: `nvidia/nemotron-3.5-super-vl-120b-a12b`. Nightshift can reroute it; actual product receipts have identified both Super VL and NVIDIA Nemotron Ultra. Inspect the winning receipt.
The existing local tokens expire October 29, 2026 per the setup handoff. Rotate
in the respective applications if expired; never include values in source or logs.

Main UI/API listens on **127.0.0.1:4317**. A separate **read-only synthetic feed**
listener uses **0.0.0.0:4318**, allowing Zetaris's Docker network to read through
`host.docker.internal`. This feed contains only the demo's synthetic records.
No private operational or patient data belongs on this demo server.

If ports are occupied: `./run.sh --port 4327 --feed-port 4328`. For source registration,
set `ARC_FEED_HOST=host.docker.internal:4328`. Existing registered sources retain their
original URL; choose normal ports for the prepared demo. Do not overwrite or delete
existing sources to change ports. On Linux Docker, configure a host-gateway mapping
for `host.docker.internal`, or use a reachable `ARC_FEED_HOST` during first registration.

Stop ARC with Ctrl+C. SQLite simulation state and World Model history persist under
ignored `data/`. Reset restores baseline synthetic resources without deleting history.

## Main workflow

1. Choose Queen & University (general), College & Spadina (neuro + advanced), or
   King & Church (pediatric). Requirements are predefined simulation labels.
2. Assess. Nemotron selects allowed evidence tools. Zetaris returns fleet, hospital
   operations and closure feeds. ARC calculates both route legs and checks constraints.
3. Review the response unit and time to incident, then the separate destination preview and transport estimate. Expand **Why this plan & what was excluded** for citations and exclusions. **Compare eligible alternatives** can request a freshly assessed alternative.
4. Open **Scenario controls** and choose **Hospital unavailable**, **Close approach road**, or **Unit becomes busy**.
   The old proposal becomes unapprovable. Choose **Reassess changed conditions** and review the changed condition.
5. Approve the fresh proposal. ARC atomically reserves the ambulance and a receiving
   slot and marks the incident assigned. Rejecting reserves nothing.
6. Open **Scenario controls** and use **Reset simulation** to restore all incidents/resources and start another demo.

The source feed freshness limit is 120 seconds. Approval expires with the evidence
or any scenario version change. Changes during inference discard the assessment.
**Scenario controls → Failure scenarios** exposes stale feed, no destination, data failure and AI
failure. **Restore feeds** clears stale/failure flags, not resource changes; Reset
restores resources. These are explicit injected failure scenarios.

## Sponsor evidence

Open **System details** (the header’s ⋯ button) after an assessment to inspect the product SQL query,
row count, Nightshift request/receipt ID and winning NVIDIA route, and World Model
entities/events. Refresh optional Toronto road-restriction context there.

- Zetaris actually combines three separately registered REST sources in product requests.
- Nightshift is the primary AI provider. Nemotron chooses tool requests and selects
  grounded evidence for explanations. Unknown citations block output.
- The actual upstream **Meterless World Model reference** persists typed entities,
  source provenance and relationships and recalls prior state for reassessment.
  SQLite is separate transactional application storage, not a sponsor engine.

See [architecture](docs/ARCHITECTURE.md), [sources](docs/DATA-SOURCES.md),
[verified requirements](docs/REQUIREMENTS.md), and [progress/specification](docs/PROJECT.md).

## Real, cached and simulated

Operational data, capabilities, incidents and controlled closure zones are synthetic.
Coordinates approximate Toronto sites. OSRM supplies actual road-network geometries
and ordinary static driving estimates, with **no live traffic or ambulance privileges**.
Public route fixtures are labelled cached and usable for 7 days after their fetch
time. Expired routes are fetched again; routing failure without valid cache blocks
the affected assignment. There is no invented straight-line fallback.

The basemap is a cached Toronto Centreline extract, not a live tile map. Optional City
road restrictions retain source-update and fetch timestamps but are partial context,
not validated closure polygons. Scenario closures are checked against every route
segment; ARC excludes affected routes and compares other pairs rather than computing
a closure-aware detour. This is not a clinically validated or real dispatch product.

Refresh public geography / route fixtures when needed:

```sh
"$(scripts/python-path.sh)" scripts/fetch-map.py
"$(scripts/python-path.sh)" scripts/warm-routes.py
```

Do not warm routes while the app is assessing, because these share a cache file.
Current fixture routes are public data under `fixtures/routes.json`. Runtime cache
and simulation history stay private under `data/`. External endpoints are best effort.

## Verification

```sh
./scripts/check.sh
# Real sponsor acceptance test; app must be running. Resets the simulation.
"$(scripts/python-path.sh)" scripts/live-check.py
```

Checks cover eligibility, stale/missing data, missing routing, segment-crossing
closures, expired/changed proposals, rejection, concurrent reservations and real
World Model persistence/recall. The upstream conformance runner checks 8 invariants.
JS syntax and Python compilation checks apply; this buildless stack has no separate
TypeScript app build. Actual engine TypeScript is executed by Node 24 and tested by
its upstream runner. See `artifacts/` and `docs/VALIDATION.md` for recorded results.

Existing smoke clients remain usable:

```sh
python3 zetaris_client.py
python3 zetaris_client.py 'SHOW LIGHTNING DATABASES'
python3 meterless_client.py --models
python3 meterless_client.py 'Reply with one short sentence.'
```

## Submission materials

- `docs/DEMO.md`: 3-minute script and exact recording sequence.
- `docs/SUBMISSION.md`: draft entry and final checklist.
- `artifacts/arc-deck-workspace.pptx`: submission slide deck (when final build completes).
- `docs/HANDOFF.md`: final status, limitations and remaining human actions.
- `vendor/NOTICE.md`: upstream attribution and licenses.

Before submission, resolve the contradictory Cursor rule and record/upload the
actual video. The source repository is private; public release is separate. Declare pre-existing
connection helpers and upstream libraries. Deadline: October 27, 2026, 23:45 UTC /
7:45 p.m. Toronto. Official video requirement: 1–4 minutes.

### Dispatcher workspace
Incident priority, waiting time, unit availability and receiving facilities remain
visible. An assessment stays attached to its incident while you review other calls.
One inference job runs at a time. Plans show evidence age and persistent changed /
expired / blocked states. An eligible alternative receives fresh checks before it
can be approved. Approval still reserves a complete simulated plan; crew
acknowledgment and real dispatch are not connected. See docs/UX.md for research,
workflow decisions and validation limits.

Internal prototype/data boundary register: [SIMULATION-NOTES](docs/SIMULATION-NOTES.md).

### Toronto public information

The live picture panel automatically refreshes public Police/Fire activity, road
restrictions and ER Watch hospital wait context. Traffic camera snapshots load on
demand. Mapped police calls can become local review cases after the dispatcher
chooses their priority and requirements. Public information does not establish
ambulance availability or hospital acceptance. Existing assignment checks remain.

For optional downtown traffic-flow speeds, set `TOMTOM_API_KEY` in the private
`.env` after creating a developer account. It stays server-side. Without a key,
traffic observations show unavailable and City camera snapshots remain usable.
Without the key, OSRM travel estimates remain static. With it, fresh assessments use TomTom traffic-informed routes; existing proposals retain their original source and expiry.

The incident queue now ingests public Fire calls and selected Police safety calls
automatically. Source filters, deduplication, published updates and missing/stale
indicators are built in. Open a call's Incident details form to supply priority,
service, equipment and a pickup point where missing; optional dispatcher notes
stay distinct from public facts. No patient or clinical details are invented.
New calls do not invalidate unrelated pending plans; edits/source changes invalidate
only the affected case. Existing workspace cases and reservations are preserved.

### Automatic coordination and prepared intake

ARC now starts assessment automatically for complete incidents and prepares fresh
plans when conditions change or evidence ages. The dispatcher reviews approvals
and handles exceptions. Pause/resume the agent from the map toolbar; reassessment
is still available as a manual override. No assignment is approved automatically.

On launch, three clearly labeled prepared exercise intakes and two standby units
are added once per epoch so the complete workflow can run without releasing old
reservations. Their clinical requirements and pickups are authored demo inputs;
public incident references remain separate. Read docs/SIMULATION-NOTES.md for the
full boundary. The map-led workspace keeps the inbox, map, resources and selected
decision visible together. Live background maps use OpenStreetMap; the City street
extract remains the fallback.
