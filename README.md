# ARC — Assisted Routing & Coordination

An explainable emergency-response coordination simulation for **Toronto and Seattle**.
ARC prepares and refreshes response plans automatically, explains the evidence,
and leaves assignment approval to the dispatcher.

Built by **NorthStar** for the Open Agent Hackathon 2026, under **The Agent That Can Explain Why**.

## What you need

| Dependency | Required setup |
| --- | --- |
| **Python 3.11+** | Available as `python3` on Mac or `py -3` on Windows. |
| **Node.js 24+** | Available as `node`; runs the bundled Meterless World Model. |
| **Docker Desktop or OrbStack + Zetaris** | Install the separate Zetaris distribution and obtain its organization ID and API key. Zetaris software/registry access is not included in this repo. |
| **Nightshift Runtime + NVIDIA Nemotron** | Install the native Runtime, configure a working NVIDIA provider/model, and obtain a Nightshift Runtime token. Provider credentials belong in Nightshift. |
| **Internet access** | Used for public feeds, maps, route requests and cloud inference. |
| **TomTom API key — optional** | Enable Traffic and Routing access for live traffic observations and traffic-aware routes. Without a key, ARC uses OSRM static driving estimates. |

**To run ARC, you do not need `pip install`, `pnpm install`, a frontend build, or
a separate World Model service/key.** Compiled React assets and the World Model
reference implementation are included. Sponsor services and credentials are separate.

Mac setup has been exercised. Windows launch instructions are provided, but a full
Windows installation has not been verified. See the [setup guide](docs/SETUP.md)
for service installation, networking and troubleshooting.

## Set up and run

### 1. Get the code

```sh
git clone https://github.com/raiyanjaz/north-star.git
cd north-star
```

Or download and extract the repository ZIP from GitHub.

### 2. Start the sponsor services

Start Zetaris through its own Docker Compose installation, then open Nightshift
and test its configured NVIDIA model. Keep both services running while using ARC.
The launchers check these services; they do not install or start them.

### 3. Add your credentials

Copy [`.env.example`](.env.example) to `.env` **if you do not already have one**.
Edit it locally:

| Variable | Value |
| --- | --- |
| `ZETARIS_REST_URL` | Zetaris API URL; default `http://localhost:8888/api/v1.0`. |
| `ZETARIS_ORG_ID` | Your actual organization ID, matching the API key. |
| `ZETARIS_API_KEY` | Your Zetaris API token. |
| `METERLESS_BASE_URL` | Nightshift Runtime URL; default `http://127.0.0.1:8088/v1`. |
| `METERLESS_RUNTIME_TOKEN` | Nightshift Runtime token. **This is not the NVIDIA provider key.** |
| `METERLESS_MODEL` | A model enabled in Nightshift. The template contains the tested Nemotron request ID. |
| `TOMTOM_API_KEY` | Optional TomTom key; leave blank for static OSRM routing. |

Environment variables override `.env`. Never commit or share your `.env`.
Public incident feeds, station geography, OpenFreeMap and OSRM require no keys in ARC.
Nightshift may reroute a model request; the receipt identifies the actual model used.

### 4. Launch ARC

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

Open **[ARC](http://127.0.0.1:4317/)**. Keep the startup terminal open; Ctrl+C stops
ARC. The launcher registers the city-specific Zetaris sources when starting a new
instance. `--check` verifies service connectivity, not a complete AI assessment.

For later use, start Zetaris and Nightshift, then double-click **Start ARC.command**
(Mac) or **Start ARC.bat** (Windows).

## Try the workflow

1. Choose a city and a response case with confirmed requirements. ARC prepares a plan automatically; public reports need intake confirmation first.
2. Review the unit, destination and driving estimates. Open **Why this plan?** or **Compare options** for details.
3. Use **Workspace controls → Hospital unavailable** to trigger a reassessment. The old plan becomes unapprovable; review the replacement.
4. **Approve plan** to reserve a unit and receiving slot. Exercise journeys progress automatically and release resources after handover. Their speed is configurable in Workspace controls.
5. Open **System details** to inspect the actual Zetaris query, Nightshift/NVIDIA receipt and Meterless entities/history.

Toronto and Seattle have separate resources, assignments and history. Resetting a
city clears its exercise state. Pausing the assessment agent does not pause
already-approved exercise journeys.

## Real integrations and exercise data

Zetaris federates the resource feeds; Nightshift/Nemotron selects allowed tools and
supporting evidence; the actual Meterless World Model reference persists entities
and prior state. Application rules enforce eligibility, freshness and approval.

Public feeds, maps and routing are real integrations. Fleet availability, hospital
receiving operations, prepared cases and journeys are simulated. ARC does not
contact real crews or hospitals. See [data boundaries](docs/SIMULATION-NOTES.md).

## Development and checks

Frontend development additionally requires **pnpm 11**:

```sh
pnpm install --frozen-lockfile
pnpm build       # TypeScript check + build frontend/ into web/
pnpm test        # Display-policy tests
pnpm test:ui     # Isolated browser tests; requires Google Chrome
```

On Mac/Linux, `./scripts/check.sh` runs backend tests, syntax/type checks, display
policy tests, World Model conformance and secret scanning. Browser tests use a
separate fixture server and do not modify your app state.

Edit `frontend/`, then rebuild and commit `web/app.js` and `web/style.css` with your
source changes. Python backend code lives in `backend/`. Local state is stored in
ignored `data/`; this repository does not provide shared hosting.

[Setup & troubleshooting](docs/SETUP.md) · [Architecture](docs/ARCHITECTURE.md) ·
[Demo walkthrough](docs/DEMO.md) · [Validation](docs/VALIDATION.md)
