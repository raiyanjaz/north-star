# Draft submission

## Name
ARC — Assisted Routing & Coordination

## Team and primary track
NorthStar. The Agent That Can Explain Why.

## Short description
An explainable emergency-response coordination simulation for Toronto dispatchers.
ARC compares available ambulances, predefined destination requirements and road
routes. It presents a cited recommendation, explains excluded alternatives, and
reassesses when conditions change. Dispatchers approve assignments within the
simulation, with atomic resource reservation and renewed approval after changes.

## Problem and intended user
Dispatchers need to reconcile resource availability, receiving-facility operations
and road conditions before approving an assignment. ARC demonstrates how a common
evidence layer and explicit constraints can support this comparison, while retaining
human approval. It does not diagnose patients or operate a real dispatch service.

## Sponsor integration
Zetaris is in the actual assessment data path: it reads three distinct REST sources
and returns one federated snapshot with consistent scenario version and timestamps.
Nightshift is ARC's primary AI provider. NVIDIA Nemotron chooses allowlisted evidence
tools and selects cited evidence for the recommendation and reassessment explanation.
Runtime receipts identify the provider and winning model. ARC rejects unknown
citations and renders measured facts from the evidence ledger.

Meterless World Model is a pinned, vendored upstream reference implementation,
executed in a persistent Node subprocess. It records typed resource entities,
provenance and recommendation relationships. Prior entity state informs change
explanations. The upstream eight-case conformance suite and product persistence /
recall test verify behavior. SQLite handles reservations separately and is not
represented as a Meterless engine.

## What is distinctive
The demo makes a recommendation obsolete, blocks its approval, then explains the
replacement from fresh evidence. Public road geography and calculated routes combine
with replaceable simulated operational feeds. AI output remains grounded in a
verifiable evidence ledger, while deterministic rules enforce resource constraints.

## Real vs simulated
Real: sponsor services, model inference, road-network route geometry and calculations,
public Toronto basemap extract and optional road-restriction context.
Simulated: incidents, requirements, fleet positions/status, hospital service labels,
acceptance/slots, and controlled closure zones. Public ER wait times do not stand in
for acceptance status. No clinical or operational outcome claims are made.

## Limitations and next work
Validate with dispatchers, connect authorized operational feeds, validate destination
entrances and clinical protocols, use a suitable traffic-aware routing service, and
add multi-user authentication and deployment controls. Current routing excludes a
leg crossing a simulated closure rather than computing a detour around it.

## Prior work and development tools
Idea discussed before the build. Existing setup included two connectivity helpers,
configuration and vendor installations. Declare these and the upstream libraries.
Development in this chat used Codex. Cursor use remains unconfirmed: official event
rules require it while the current setup guide says it is optional. Resolve that
contradiction before completing the final submission's tool declaration.

## Final checklist
- [ ] Organizer confirms Cursor eligibility, or team completes and documents meaningful Cursor work.
- [ ] Review final app and limitations with team.
- [ ] Confirm team membership and selected track in HackOS.
- [ ] Authorize and publish GitHub repository, verify clean-machine instructions.
- [ ] Record/upload actual 1–4 minute demo video, with no visible keys.
- [ ] Attach final deck and repo URL.
- [ ] Add actual demo/video/repository links to submission.
- [ ] Include prior-work disclosure and sponsor explanations.
- [ ] Submit before October 27, 2026 at 23:45 UTC / 7:45 p.m. Toronto.

Nothing is published by this build task. This text is a draft, not a submitted entry.
