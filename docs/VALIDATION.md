# Validation record

## Automated
`./scripts/check.sh` passes 19 application tests, Python compile and JavaScript
syntax checks. The actual Meterless World Model reference passes its upstream
8/8 conformance suite. `artifacts/checks.txt` contains the result. No separate
frontend build or application TypeScript type check applies to this buildless stack.

Tests cover baseline eligibility and stable ranking, specialist requirements,
stale/missing timestamps, unavailable hospital, missing fleet, no destination,
routing failure without invented ETA, segment-crossing closure detection,
approval resource changes, rejection, changed/expired proposals, concurrent
reservation, monotonic reset version, real engine persistence and prior-state
recall, allowlisted tools and evidence citation validation.

## Real service acceptance
`artifacts/live-validation.json` records the successful product API sequence:
- Baseline: Medic 12 to St. Michael’s, 0.9 min pickup + 3.1 min transport = 4.0 min.
- A simulated approach closure invalidates old approval. Reassessment selects
  Medic 12 to Toronto General, 4.2 combined static driving minutes.
- Approval reserves ambulance, decrements receiving slot and assigns incident.
- Stale data produces no feasible assignment and disables approval.
- No destination produces concrete exclusions and no proposal.
- Explicit injected Zetaris and Nightshift failures block new output.
- Actual World Model entity/history events are present and persistent.

These are scenario estimates and functionality results, not clinical or operational
performance measurements. Cached OSRM route geometry and timestamps are retained.
The baseline/reassessment took about 58 / 35 seconds in this acceptance run.
Other assessments took about 25–84 seconds. Nightshift inference latency varies.

Actual receipt: requested Nemotron 3.5 Super VL, but Nightshift routed the baseline
acceptance request to NVIDIA Nemotron 3 Ultra. Both are Nemotron; the stored winning
route is the evidence. Never infer the underlying model from the requested ID.
Earlier product responses identified Super VL. NVIDIA award evidence must show
actual receipts, not merely configuration. No API keys are in these artifacts.

## Browser
Browser verification details and screenshots are completed in docs/HANDOFF.md.

## Issues discovered and repaired
- macOS Python 3.9 could not establish TLS with OSRM. Use Python 3.11+;
  the available bundled Python 3.12 works with certificate validation enabled.
- Structured model output could truncate before JSON. Increased the bounded
  output budget, requested JSON, and supplied the non-thinking directive at the
  user-message boundary. Unknown tools/citations still fail closed.
- External tile services returned access/key placeholders. Replaced them with a
  locally rendered, attributed City of Toronto street extract.
- Fixed approval expiry to refer to the evidence timestamp rather than the end of
  inference. Condition changes during inference discard the result.
- Added simulation epochs so a reset does not compare proposals from an old run.

## Limits
Browser functionality and API checks do not establish production suitability.
Public feed context is optional and partial. Closure rerouting is exclusion-based.
The engine is the upstream reference, appropriate for small local state. No real
fleet, patient records, live receiving status or dispatch network is connected.

## Final browser result
Passed baseline, reset isolation, map/route display, rejection, hospital change,
approval invalidation, reassessment with engine-backed prior-state explanation,
approval/state update, integration evidence modal and approved proposal restoration
after reload. Verified public road refresh with actual source data after fixing
IS_CURRENT='Y'. Source timestamps are available in expanded source evidence.

Deck: 8 slides, rendered and inspected, package and geometry checks pass with no
findings; embedded product screenshot confirmed. No PowerPoint execution claimed.

Reproducibility: source ZIP extracted into a clean directory; all 19 tests,
syntax/compile checks and 8 engine conformance checks passed there.

## Simplified UI verification
Verified incident switching, a new specialist assessment through the live sponsor
path, compact assignment summary, on-demand resource and simulation dialogs,
restored approved assignment, and access to full reasoning/alternatives. Backend
checks remain 19 application tests plus 8 upstream conformance checks. JavaScript
syntax passes. No backend decision logic changed in this revision.

Latest deck: artifacts/arc-deck-workspace.pptx, updated with the operational
workspace screenshot and 29 application/workspace checks. Changed slides rendered
and visually inspected; package, layout and reimport validation passed. Original
arc-deck.pptx is retained as the earlier version.

## Current workspace acceptance
21 Python tests and 8 workspace behavior tests pass, alongside the upstream 8/8
engine suite. Actual browser verification: priority queue and waiting timers,
persistent resources, case switching during live inference, correct result
placement, eligible alternative reassessment with grounded evidence, approval,
changed destination status and blocked approval. The scenario affected the selected
incident's destination, rather than another incident's latest result.
Evidence: artifacts/workspace-validation.json. No user interviews or full WCAG
certification are claimed. Both workstation and default in-app layouts were checked.

Latest source archive was extracted into a clean directory and all 21 Python,
8 workspace and 8 upstream engine checks passed. Keyboard queue navigation and
changed-route labeling were also verified in the browser.

## Toronto live-information revision — October 23, 2026

31 Python tests, 8 workspace behavior tests and 8 upstream World Model checks
passed, plus compilation, JavaScript syntax and configured-secret checks. New
coverage includes source parsing, postal-area precision, invalid coordinates,
missing hospital readings, date-filtered roads, stale/failing feeds, explicit
review requirements and deduplication, traffic route geometry/cache, and configured
traffic-provider failure without a hidden static substitute.

Actual source verification retrieved official Police JSON, Fire XML, City camera
catalog and JPEG, roughly 1,979 date-range road restrictions from official v3 CSV,
and 19 Toronto-area ER Watch directory entries (only some have current readings).
Counts vary. The public Police layer's publisher timestamp became stale during
verification; ARC correctly marked it stale and disabled public-review creation.
The City JSON road response contained malformed escaping; official CSV succeeded.

Browser verified source switching, road list/overlay, explicit missing hospital
waits and source age, disabled review on stale police data, and camera failure
handling. One nearby camera was unavailable; another camera's JPEG returned HTTP
200. Traffic route tests use provider-shaped fixtures: no live TomTom success is
claimed before account registration and key setup are completed.

The existing state stayed at version 23, epoch 2026-10-23T04:30:57.685275+00:00,
with three incidents and one reservation. No reset or live-check.py was run.
No publication, commit or source-archive/deck regeneration was performed.

## TomTom activation — October 23, 2026

Created dedicated `ARC Toronto traffic` key with only Routing API and Traffic API
products. Stored in private `.env` with owner-only permissions; never in frontend,
API responses, source artifacts or logs. Account is on the existing evaluation
plan; no upgrade or payment was performed.

Actual Traffic API returned three downtown flow readings. Actual Routing API
returned route geometry, distance, traffic-aware travel time and delay. The full
ARC assessment for INC-1042 completed through Zetaris, TomTom, Nightshift/Nemotron
and the actual World Model. Both selected route legs report TomTom Routing and
traffic_aware=true. At completion the plan was fresh and approvable, selecting
Medic 12 to Toronto General with 2.3-minute response and 8.6-minute transport
estimates. These are time-specific ordinary-driving estimates, not measured EMS
response performance. The actual AI receipt identified Nemotron 3 Ultra.

Browser verified the connected traffic panel, speed/free-flow/confidence values,
map overlays and traffic-at-assessment-time route labeling. Evidence is in
artifacts/traffic-validation.json and artifacts/live-traffic-verified.png.
All 31 Python + 8 workspace + 8 upstream checks passed after activation, alongside
configured-secret checks on deliverables and live APIs. State remained version 23
with three incidents and one existing reservation; no reset or approval occurred.

## Automatic Toronto incident queue — October 23, 2026

43 Python tests, 12 workspace behavior tests and 8 upstream World Model checks
passed, alongside compilation/syntax and configured-secret checks. New coverage:
idempotent ingestion, rebuilt Police IDs, reclassification, source changes while
preserving dispatcher input, missing/stale feeds without auto-resolution, rejection
of incomplete intake before AI, stale-form conflicts, revisions at approval,
discarding a case edited during inference, unrelated arrivals preserving another
case's plan, and restart persistence.

Actual Toronto Fire calls appeared automatically in the main queue with missing
priority, service, equipment and pickup fields left empty. Original workspace
cases and the existing reservation were retained. Police ingestion honors the
publisher freshness guard; stale snapshots are shown as stale and create no cases.

A separate temporary SQLite copy/server was used for browser write testing. An
actual public Fire record with a postal-area-only location was opened, blocked
from assessment, given explicitly labeled QA dispatcher requirements/notes and a
map-selected pickup, then assessed through the full Zetaris/TomTom/Nemotron/World
Model path. The resulting recommendation was fresh and approvable at completion.
No approval was performed. Draft persistence across case switching was verified.
The temporary server was stopped and its temporary data removed. The main queue
was not given the QA pickup/requirements. Evidence: incident-intake-validation.json.

Resource state remained version 23 with the original reservation; public intake
adds cases without changing the resource version or resetting the simulation.
A private pre-intake SQLite backup is under ignored data/. Nothing was committed,
pushed or published; submission artifacts were not regenerated.

## Workspace hierarchy revision

43 Python + 13 workspace + 8 upstream checks passed (64 total), plus syntax and
secret checks. Browser verification covered stage filtering, preserved reserved
assignments, consistent Reserved labels, the four-step indicator and next-action
copy, and incomplete-intake assessment blocking. Checked the layout at 1440×900
and the in-app browser's narrow layout. No assessment, approval or reset was issued
for this visual revision. Screenshot: artifacts/workspace-hierarchy.png.

## Autonomous map workspace — October 23, 2026

59 Python + 14 workspace + 8 upstream World Model checks passed (81 total), with
Python/JavaScript validation and configured-secret checks. New tests cover automatic
priority scheduling, duplicate-work prevention, missing-input blocking, no-unit
waiting/resumption, evidence refresh, resource-change triggers, pause, service
backoff, request budgets, rejection handling, competing unit/slot commitments,
superseded-plan approval rejection, approval during background refresh and additive
prepared intake. A rejection during an automatic refresh is not overwritten.

Actual runtime verification: ARC automatically created DEMO-201 and DEMO-202 plans
through Zetaris, TomTom, Nightshift/Nemotron and the World Model. They selected
separate units A-51 and A-52. DEMO-202's coordination evidence included A-51's
higher-priority pending proposal. Later recommendations had automatic=true and
trigger=evidence refresh without manual assessment requests. DEMO-203 waited on
resource commitments instead of repeatedly invoking inference. Older proposals
were verified superseded and unapprovable. Existing reservations remained two;
no approval or reset was performed during this revision.

Browser verified the approval inbox, enabled human approval on a fresh plan,
proposed/free unit status, agent pause/resume, error-free rendering and the central
map. Checked 1440×900 and 1024×900 viewport requests with no horizontal page overflow;
the narrower layout keeps map and decision in stacked panes alongside the inbox.
Evidence: artifacts/autonomous-validation.json and artifacts/arc-autonomous-map.png.
The agent is left enabled. Prepared profiles are documented scenario data, and
live public calls still require missing intake facts before assessment.

### Map and decision styling — October 23

59 Python tests, 14 workspace tests, 8 upstream World Model checks and configured-secret scan passed following the vector basemap addition. Browser verification confirmed OpenFreeMap rendered Toronto streets and labels, with route overlays and visible attribution; rationale and guidance no longer use left-accent callouts. Verified desktop and narrow workspace layouts. Existing two reservations survived the app restart; automatic assessment resumed. No approvals or resets were performed.


### Seattle second workspace — October 27

- Automated: 68 Python tests, 14 workspace tests, 8 upstream World Model checks;
  Python compilation, JavaScript syntax, configured-secret scan and diff checks.
- New tests cover city-specific pickup validation, Seattle timezone and identity,
  duplicate rows, malformed/truncated snapshots, missing coordinates, cached-feed
  handling, preserved dispatcher edits after restart, city-isolated reservations
  and reset, namespaced federation, HTTP workspace/feed routing, and synchronous
  demo setup during reset.
- Real sponsor flow: Seattle baseline through ARC_SEATTLE; both TomTom legs;
  Nightshift receipt identifies NVIDIA Nemotron Ultra. A hospital disruption
  invalidated the old proposal and changed the destination from Swedish First Hill
  to Harborview. Revised approval reserved the unit and receiving slot atomically.
- A real SFD call completed explicit dispatcher intake, assessment and rejection.
  Seattle Meterless entities/events were verified. Reset then automatic assessment
  produced a fresh proposal without an automatic reservation.
- All live checks passed in artifacts/seattle-live-validation.json. The script
  explicitly resets only Seattle exercise data. The original Toronto epoch,
  fleet, hospitals and both reservations matched the pre-implementation snapshot.
- Browser: Seattle source labels, Pacific clock, street map, Seattle pickup inputs,
  map selection, Toronto/Seattle selector navigation, desktop and 390px layout.
- No live Seattle hospital waits/receiving status or fleet GPS is claimed. Public
  calls do not establish active/unassigned status or clinical requirements.


### City-switch loading — October 27

95 automated checks passed (73 Python, 14 workspace, 8 engine), including new
regressions for 1,000 unassessed history calls, latest-case/epoch selection, static
ETag invalidation, gzip negotiation, and non-cacheable live state.

Measured Toronto state latency before the fix: 3.216 seconds. After the fix,
three requests took 104, 64 and 65 ms including compressed body transfer. Seattle
requests took 47, 49 and 4 ms. Browser city switches reached incident/proposal
readiness in 426, 207, 309 and 193 ms. Additional checks measured complete online
map readiness at 370 ms for Toronto and 200 ms for Seattle. These are local measured
results, not latency guarantees for external map providers.

Browser responses confirmed 304 revalidation for unchanged scripts/styles and
fresh 200 gzip responses for state/proposals. With both remote map providers
blocked, cached Seattle street labels and the incident queue still appeared.
Both cities' epochs, fleet/hospital resources and reservations matched the
pre-change snapshot. Evidence: artifacts/city-switch-validation.json.


### Decision inbox iteration — October 27

102 checks passed (73 Python, 21 workspace behavior checks, 8 upstream engine
checks), plus JavaScript syntax and configured-secret scanning. New behavior tests
cover public reports vs confirmed questions, resource waits, prepared and approved
cases, focused pickup/source/requirements prompts, rejection/retry prompts, and
opening an operational case instead of an old saved report.

Browser verified Toronto pending plans and Seattle approved assignments, separate
public reports, focused intake with explicit requirements, resource and context
dialogs, explanation and alternative disclosure, and a 390px mobile layout with
no horizontal page overflow. Existing assignments were inspected without approval,
rejection, reset or scenario mutations. This iteration changes the frontend only.
