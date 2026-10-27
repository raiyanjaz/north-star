# ARC — Assisted Routing & Coordination

NorthStar's Open Agent Hackathon 2026 application. Primary track: **The Agent That
Can Explain Why**. A Toronto and Seattle dispatcher decision-support simulation with real
Zetaris federation, Nightshift/NVIDIA Nemotron inference and Meterless World Model.

## Start here — teammates and coding agents

This guide is for a fresh Mac or Windows computer. Open this project folder in
your coding agent and paste the following request:

> Read README.md and help me set up and run the full ARC app on this computer.
> Detect my OS, processor, installed tools and existing services first. Follow
> the Mac or Windows instructions below. Install missing prerequisites using
> official sources, preserving existing installations and data. Help me obtain
> the Zetaris distribution and choose a compatible Nightshift edition; tell me
> clearly if either is unavailable for my machine. Ask me to enter credentials
> privately, without printing or committing them. Configure .env, start the real
> services, run the checks, and verify an assessment, explanation, changed-condition
> reassessment and approval in the browser. Do not substitute mocks or report
> success just because the page opens. Finish with exact steps I can repeat to
> open the app next time, and explain any remaining blocker in plain language.

**First setup needs software installations, sponsor access and credentials.** The
launchers simplify daily use after setup; they do not install the sponsor services.
Mac has been exercised in the original workspace. Windows commands and a launcher
are provided, but the full Windows installation has not been verified on Windows.

### Prerequisites

| Prerequisite | What to prepare |
| --- | --- |
| Private repository access | Ask the repo owner for access to [raiyanjaz/north-star](https://github.com/raiyanjaz/north-star). Sign in to GitHub to clone or download it. |
| Python 3.11+ | Install from [python.org](https://www.python.org/downloads/). On Windows, make Python available to the terminal; the examples use `py -3`. |
| Node.js 24 | Install a current **24.x** release from [nodejs.org](https://nodejs.org/en/download). It executes the vendored World Model TypeScript. |
| Container runtime | [Docker Desktop for Mac](https://docs.docker.com/desktop/setup/install/mac-install/) or [Windows](https://docs.docker.com/desktop/setup/install/windows-install/). Existing OrbStack on Mac also works. On Windows, use Linux containers with the WSL 2 backend and follow Docker's virtualization requirements. |
| Zetaris platform | Obtain the hackathon/platform distribution and private image-registry access from the team or Zetaris. It is **not included in this repo**. Keep its own Compose files, configuration and volumes in a separate folder. |
| Nightshift / Meterless Runtime | Obtain the appropriate [Mac](https://meterless.ai/mac.html) or [Windows](https://meterless.ai/windows.html) edition. Verify its current hardware requirements before installing. The original machine uses the M1–M4 Mac edition; do not assume the other editions support the same hardware. The browser-only edition does not supply ARC's required runtime API. |
| NVIDIA model access | Configure the NVIDIA provider and a working Nemotron model **inside Nightshift**. A runtime token alone is insufficient. The tested requested model is `nvidia/nemotron-3.5-super-vl-120b-a12b`; inspect the actual winning route because Nightshift may reroute it. |
| Internet | Needed for sponsor downloads, cloud inference, live Toronto information and route refreshes. Optional TomTom traffic requires a separate API key. |

Plan for **at least 16 GB of system RAM** as a practical starting point for this
combined setup. This is a planning recommendation, not a tested minimum for every
machine. The supplied Zetaris distribution recommends 4 CPUs and 8 GB available
to its container engine, with at least 15 GB of free disk for that platform.
Leave additional resources for the OS, ARC and Nightshift. Local AI models may
require substantially more memory or a supported GPU; follow the selected edition's
requirements. ARC currently sends inference through Nightshift's configured cloud
provider, rather than downloading Nemotron weights into this repository.

No Python application packages, npm install, frontend build or separate World
Model service are needed to run the checked-in app. Python uses its standard
library; the World Model, conformance runner and map libraries are vendored.
The React frontend is supplied as compiled assets. Frontend development requires
the build tools described below.

### 1. Get the project

Clone the private repository with Git if installed:

```sh
git clone https://github.com/raiyanjaz/north-star.git
cd north-star
```

Alternatively, sign in to GitHub, choose **Code → Download ZIP**, extract it,
and open the extracted folder in your coding agent. Commands below run from
that folder unless a step explicitly says otherwise. Git is optional for ZIP use.

### 2. Prepare Zetaris and Nightshift

In the **separate Zetaris distribution folder**, follow its included README and
platform checks. Authenticate to its private image registry using credentials
provided to you; do not copy someone else's platform .env or encryption keys.
For a fresh installation, its documented Compose workflow is:

```sh
docker compose version
docker compose pull
docker compose up -d
docker compose ps -a
```

On Mac, use that distribution's `./preflight.sh` before installation and
`./verify.sh` after startup if supplied. Those are Bash scripts; on Windows use
the distribution's supported Bash/WSL instructions, not PowerShell syntax for
`.sh` files. Keep ARC and Nightshift on the Windows host for the native Windows
steps below; WSL has its own filesystem, executables and localhost networking.
Do not move just one component into WSL without checking the resulting connections.

The first startup can take several minutes. In the supplied distribution,
`postgres`, `driver`, `api` and `ui` are persistent services; `init` and `bootstrap`
finishing with exit code 0 is expected. For later starts of an existing stack,
use `docker compose start`. Never run `docker compose down -v` to troubleshoot:
it deletes platform volumes, including data and encryption keys.

Open the Zetaris UI at its configured address (normally http://localhost:3000).
Obtain an API key for the actual organization ID. Separately open Nightshift,
configure its NVIDIA provider, test a model request there, and obtain the
**runtime API token**. Do not place the NVIDIA provider key in ARC's .env.
If the download, registry access, edition or model is unavailable, ask the owner
for the missing access and report the blocker instead of simulating the service.

### 3. Configure this project's private .env

Preserve an existing .env. Only if it does not already exist, copy the template:

**Mac — Terminal**

```sh
[ -f .env ] || cp .env.example .env
python3 --version
node --version
```

**Windows — PowerShell**

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
py -3 --version
node --version
```

If Windows has `python` but no `py`, verify `python --version` is 3.11+ and use
`python` in place of `py -3` throughout this guide. Reopen your terminal and
coding agent after installing tools so they pick up the new PATH.

Edit .env locally with these settings:

| Variable | Meaning |
| --- | --- |
| `ZETARIS_REST_URL` | Local REST API URL, normally `http://localhost:8888/api/v1.0`. |
| `ZETARIS_ORG_ID` | Actual organization ID associated with the API key; template `1` is only a starting value. |
| `ZETARIS_API_KEY` | Your valid Zetaris API bearer token. |
| `METERLESS_BASE_URL` | Nightshift API URL, normally `http://127.0.0.1:8088/v1`. |
| `METERLESS_RUNTIME_TOKEN` | Actual Nightshift runtime token, not a placeholder or NVIDIA provider key. |
| `METERLESS_MODEL` | A model supported by your Nightshift configuration; the template contains the tested request ID above. |
| `TOMTOM_API_KEY` | Optional: enables live traffic flow and traffic-aware routing. Leave blank for OSRM static estimates. |

Environment variables override .env. Check for stale terminal overrides if a
correct file seems to be ignored. Keys/tokens can expire: obtain replacements
from the corresponding service rather than relying on the original machine's
credentials. Never paste credentials into agent output, screenshots, Git commits
or this README. .env and local runtime data are ignored by Git.

### 4. Check connections, then start ARC

**Mac — Terminal**

```sh
python3 launch.py --check
python3 launch.py
```

**Windows — PowerShell**

```powershell
py -3 launch.py --check
py -3 launch.py
```

The launcher checks Python, Node, a real Zetaris SQL request and Nightshift's
model-list endpoint. When starting ARC, it registers ARC's additive Zetaris
sources and checks their federated query before opening the browser at
**http://127.0.0.1:4317**. Keep the startup window open. Press Ctrl+C to stop.
`--check` alone does not run inference or prove a complete assessment works.

If ARC was already running, the launcher reuses it and checks its sources;
it does not perform source registration in that branch. If those sources are
missing, run `python3 scripts/register-sources.py` on Mac or
`py -3 scripts/register-sources.py` on Windows **while ARC is running**, then retry.
The registration script preserves existing source definitions. Do not drop
sources as a troubleshooting shortcut.

After setup, daily startup is: open the container runtime, start the Zetaris stack,
open Nightshift, then double-click **Start ARC.command** (Mac) or **Start ARC.bat**
(Windows). On Mac, if executable permission was lost when downloading a ZIP,
run `chmod +x "Start ARC.command"` from the project folder, or use
`python3 launch.py`. Follow macOS's normal review/open flow for downloaded files.
Windows users can run `.\Start ARC.bat` from PowerShell. The launcher checks
services; it does not start Docker, Zetaris or Nightshift for you.

### 5. Confirm the full app works

Before handing the computer back to your teammate, the coding agent should:

1. Open ARC and confirm the map, incidents, resources and agent controls load.
2. Select a prepared exercise incident with complete intake. Let the agent assess
   it, or request assessment manually. Wait for a completed plan and explanation.
3. Inspect System details: confirm a real Zetaris query, an actual Nightshift
   inference receipt/winning model route, and World Model entities/events.
4. Change a condition using Scenario controls. Confirm the old plan cannot be
   approved and a fresh assessment reflects the change.
5. Approve a fresh eligible plan and verify the simulated unit, receiving slot
   and incident update. Reset only when the teammate is ready to discard the
   current exercise reservations; reset affects the local simulation.
6. Stop and reopen ARC, confirming that the normal daily-start steps work.

A page load or `/api/health` response is not proof that federation, routing and
inference work. Report exactly which checks passed and any remaining issue.
The acceptance script under Verification resets simulation state; use it on an
exercise workspace when that reset is intended.

### Troubleshooting for coding agents

| Symptom | Check / action |
| --- | --- |
| Python or Node not found / unsupported | Verify Python 3.11+ and Node 24.x in the same terminal that launches ARC. On Mac, avoid the old system Python. On Windows, try the Python launcher or correct the PATH. Do not assume Codex's bundled runtimes exist on a teammate's machine. |
| Node exists but World Model fails | Check `node --version` and the process selected by `NODE_BIN`. Node must execute the vendored TypeScript with `--experimental-transform-types`. |
| Cannot reach Zetaris | Check Docker/OrbStack is running, the platform services are healthy, API port 8888 is reachable and the configured REST path is correct. Inspect platform logs without publishing credential values. |
| Zetaris unauthorized | Obtain a valid API key and matching organization ID; check expiry and environment overrides. |
| Nightshift offline / unauthorized | Open the correct edition, confirm its runtime port, replace the runtime token if needed, and test `meterless_client.py --models`. Then test a real prompt: advertised models alone do not prove inference. |
| Models list works but assessment fails | Test the NVIDIA provider inside Nightshift, check the requested model and receipt, provider quota and network. Do not replace a required real integration with a stub. |
| Missing ARC tables / federation fails | Keep ARC running, register its three sources using the command above, then check that Zetaris can fetch `http://host.docker.internal:4318/feeds/fleet` from its containers. |
| Docker cannot reach ARC feeds | Default source URLs use `host.docker.internal:4318`. On Windows check Docker's WSL 2 networking and firewall; allow only the synthetic feed port on the appropriate private/Docker network. Never broadly disable the firewall. |
| Ports already occupied | Identify the owning process; reuse an existing ARC or stop only the intended process. The launcher uses fixed ports 4317/4318. See custom-port instructions below for manual startup. |
| Routing fails | Check internet access and route-fixture freshness (7 days). If TomTom is configured, verify its key and routing access. ARC deliberately blocks failed routes rather than inventing travel times. |
| HTTPS/certificate error | Repair the Python/system CA trust setup; for python.org's Mac installer, use its supplied certificate-install instructions. Never disable TLS verification. |
| Public call cannot be assessed | Supply explicit priority, service, equipment and pickup where missing. Public data does not supply those clinical facts automatically. |

### Manual startup and custom ports

On Mac, `./run.sh` is also available. It uses PATH or the original machine's
bundled runtimes; its hard-coded fallback paths are not portable installation
instructions. The platform-independent manual entry point is `app.py`:

```sh
# Mac
python3 app.py --port 4327 --feed-port 4328
```

```powershell
# Windows
py -3 app.py --port 4327 --feed-port 4328
```

For first-time source registration against the custom feed port, in a second
terminal at the project folder:

```sh
# Mac
ARC_FEED_HOST=host.docker.internal:4328 python3 scripts/register-sources.py
```

```powershell
# Windows
$env:ARC_FEED_HOST = 'host.docker.internal:4328'
py -3 scripts/register-sources.py
Remove-Item Env:ARC_FEED_HOST
```

Existing source definitions retain their original URLs. Custom ports require
checking those definitions rather than assuming registration rewrites them.
Prefer the default ports for normal teammate setup.

The UI/API binds to **127.0.0.1:4317**. The separate synthetic feed listener binds
to **0.0.0.0:4318** so Zetaris containers can read it. Do not put private data in
those feeds. SQLite state, cached public data and World Model history persist
under ignored `data/`; do not delete this folder to fix an unrelated setup issue.

Each local installation has separate state and must keep its own services running.
A private GitHub repo stores source; it does not host the app. Shared hosting is
not configured. See [team setup](docs/TEAM-SETUP.md) for the local/shared distinction.

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

Run from the project folder. These automated checks do not replace the browser
acceptance steps above or require a running Zetaris/Nightshift instance.

**Mac**

```sh
./scripts/check.sh
```

**Windows — PowerShell** (equivalent checks without the Unix shell wrapper)

```powershell
py -3 -m unittest discover -s tests -v
if ($LASTEXITCODE -ne 0) { throw 'Python tests failed' }
py -3 -m compileall -q -x '[/\\](data|artifacts|vendor|[.]git|[.]venv|[.]deck-build|[.]codex-finalizer)[/\\]' .
if ($LASTEXITCODE -ne 0) { throw 'Python compilation failed' }
node --check web/app.js
if ($LASTEXITCODE -ne 0) { throw 'JavaScript syntax check failed' }
node --test tests/test-dispatch-model.mjs
if ($LASTEXITCODE -ne 0) { throw 'Interface behavior tests failed' }
$env:WORLD_MODEL_IMPL = (Join-Path (Get-Location).Path 'vendor/world-model/src/index.ts')
try {
    node --experimental-transform-types vendor/world-model-conformance/runner.ts
    if ($LASTEXITCODE -ne 0) { throw 'World Model conformance failed' }
} finally {
    Remove-Item Env:WORLD_MODEL_IMPL
}
py -3 scripts/secret-check.py
if ($LASTEXITCODE -ne 0) { throw 'Configured-secret check failed' }
```

Checks cover eligibility, stale/missing data, missing routing, segment-crossing
closures, expired/changed proposals, rejection, concurrent reservations, automatic
coordination, public intake, and actual World Model persistence/recall. The upstream
conformance runner checks 8 invariants. There is no separate frontend build.

For live service diagnostics, use the appropriate Python command for your OS:

```sh
# Mac; on Windows substitute py -3 for python3
python3 zetaris_client.py
python3 meterless_client.py --models
python3 meterless_client.py 'Reply with one short sentence.'
python3 scripts/secret-check.py --live
```

The browser acceptance steps above are the primary full-app setup check.
`scripts/live-check.py` is an older, state-resetting sponsor test. It predates the
current automatic coordinator and can compete with background assessments; each
reset also restores automatic-agent behavior. Do not use that legacy script as an
unattended pass/fail gate for teammate installation until it is adapted to the
current workflow.

See `artifacts/` and [validation notes](docs/VALIDATION.md) for historical results;
they do not establish that a new computer has passed its own setup checks.

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


### Toronto and Seattle workspaces

Use **City workspace** in the header to switch between Toronto and Seattle, or
open [Seattle](http://127.0.0.1:4317/?city=seattle) directly. Both start with the
same launcher. On upgrade, restart ARC and run the source registration script
once if using `run.sh`; the guided launcher registers sources automatically.

Seattle has its own SQLite state, route cache and Meterless history under
`data/seattle/`, plus additive Zetaris namespace `ARC_SEATTLE`. Toronto keeps
its existing `data/arc.sqlite`, history and `ARC_DISPATCH` sources. Approvals,
resets, scenarios, pause/resume and intake edits apply only to the selected city.

Seattle ingests the official Seattle Fire Department's reported calls from the
last four hours, refreshes every minute, deduplicates by incident number, and
checks the publisher's update timestamp. This is a public dispatch-history feed;
listed calls are not established to be active or unassigned. Missing priority,
service and equipment requirements require explicit dispatcher input.
Three separate prepared exercise intakes let ARC demonstrate automatic operation.

TomTom supplies Seattle traffic observations and both directed route legs.
WSDOT Seattle-area state-road closures provide optional context; an empty response
means the source returned no matching records. No live Seattle police, camera,
hospital-wait or hospital-acceptance feed is claimed. Seattle hospital receiving
operations and response-unit availability remain exercise data. The offline
street extract comes from OpenStreetMap, with attribution in the map.

Validation: `./scripts/check.sh`. Real sponsor acceptance testing of **only the
Seattle exercise workspace**: `"$(scripts/python-path.sh)" scripts/live-check-seattle.py --reset`.
This explicitly resets Seattle, exercises intake/reassessment/reservation, then
leaves a fresh Seattle workspace with automatic assessment enabled. It checks that
Toronto's reservations remain unchanged. Do not run it during a Seattle demo.


### Assignment journeys

After approval, ARC advances a new assignment through response, scene time,
transport and handover. The map shows estimated movement along the assessed route.
Once completed, the unit becomes available at its last location and the receiving
slot is released. Completed cases move to **Completed** in the inbox.

**Workspace controls → Exercise journey speed** chooses 1×, 10× (default), or 30×.
Driving durations use the approved routes; departure, scene and handover timing
are documented exercise assumptions. These are simulated journeys, not live crew
updates. Pausing ARC's assessment agent does not pause journeys already approved.
**Journey controls** on an approved case can advance one stage or end that
exercise assignment. Existing assignments from older versions use manual progress
and keep their reservations until explicitly progressed or ended.


### React frontend development

ARC uses React and TypeScript for its map-first workspace, with Vite compiling
`frontend/` into the existing `web/app.js` and `web/style.css` routes. The Python
API and its city-specific configuration injection are unchanged. Leaflet and the
MapLibre Positron basemap remain mounted while React manages floating panels.
`web/dispatch-model.mjs` remains the shared, tested display policy.

The normal launchers use committed build output and do not require a frontend
server. To edit the frontend, install Node.js 24 and pnpm 11, then run:

```sh
pnpm install --frozen-lockfile
pnpm build
```

`pnpm dev` rebuilds on source changes; run the normal Python launcher alongside
it and refresh the browser. Commit rebuilt `web/app.js` and `web/style.css` with
source changes. Do not edit those generated files directly.

Validation:

```sh
pnpm typecheck
pnpm test
pnpm test:ui
```

Browser tests require ARC running at `http://127.0.0.1:4317` and Google Chrome.
They intercept API calls with isolated fixtures, so approvals, scenarios and
reset tests do not mutate the running workspace. They cover the frontend API
contract, stale/expired/offline approval protection, draft preservation,
background assessment ownership, map selection and responsive geometry.
`./scripts/check.sh` continues to run the real Python/backend tests and World
Model checks, plus TypeScript checks when developer dependencies are installed.

The map now fills the viewport. Use Inbox, Selected case, Resources and Layers
to open floating panels. Map markers open contextual details; panels can be
collapsed or closed. Zoom to keeps a selected route clear of the open panels.
On phones, details open in a bottom sheet, with pickup selection temporarily
collapsing the sheet. The bottom agent bar retains pause/resume controls.
