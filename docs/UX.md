# ARC dispatcher workspace

## Working user model
Primary: trained ambulance dispatcher reviewing already-triaged incidents while
monitoring other calls and resources. Secondary: destination coordination staff.
Call taking, ambulance assignment and destination coordination are distinct roles /
stages in Toronto's published workflow. This prototype shows a destination preview
based on predefined requirements; it does not establish a real clinical destination.

Desk research informed the design. No dispatcher interviews or operational
validation have been completed. Reference sources:
- Toronto 2024 Auditor General report, Exhibit 1, pp.43–44:
  https://www.toronto.ca/legdocs/mmis/2024/au/bgrd/backgroundfile-247124.pdf
- Toronto Paramedic Association communications description (undated):
  https://www.torontoparamedic.com/communications/
- Emergency-dispatch display experiment (2011):
  https://aisel.aisnet.org/thci/vol3/iss1/2/
- Specialist dispatch contextual inquiry (2026 preprint; Wales, not Toronto):
  https://arxiv.org/html/2609.07705v1
- Transferable display guidance, not an ambulance-specific standard:
  https://www.nasa.gov/reference/appendix-f-vol-2/
- Human–AI interaction:
  https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/
- Contrast and keyboard baseline:
  https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
  https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html

## Implemented decisions
- Queue ordered by simulation priority, then arrival time. Waiting timers are
  separate from evidence age. Reserved plans follow open incidents.
- Persistent unit and receiving-facility statuses. Operational data stays visible
  without opening a modal. Queue scrolls independently when space is constrained.
- Response ETA is primary. Transport ETA is a separate destination preview. No
  combined time is presented as time-to-care or time-to-handover.
- The selected case, current status, affected conditions and next action are
  grouped. Data age is visible next to the plan, before approval.
- Assessment runs in the background. Users can browse other cases/resources.
  Results remain bound to the initiating incident and simulation epoch. One
  inference job runs at a time; parallel inference is not promised.
- Eligible alternatives show response and transport times. Choosing one creates a
  fresh assessment, deterministic eligibility check, evidence ledger and Nemotron
  explanation. It cannot force an unavailable or incompatible pair into a plan.
- Changed / expired / failed / infeasible cases have persistent queue and case
  indicators. Routine updates do not take focus. Modal controls are limited to
  simulation setup and integration details.
- Case scroll position and expanded details survive switches and background
  refresh. Background job completion never selects another incident automatically.
- Map serves spatial review. It does not cover the decision panel or refit during
  routine background refresh. Keyboard buttons and queue arrow navigation work.
- Text uses darker colors; actual source age, simulation labels and estimate limits
  remain explicit. No whole-product WCAG certification is claimed.

## Simulation boundary
The review separates response and destination information visually, but approval
still atomically reserves both a unit and a receiving slot in the simulation.
Reserved does not mean acknowledged, en route, on scene or accepted by real staff.
The UI explicitly says crew communication is not connected. Do not invent those
operational states or imply real destination authorization from a preview.

## Validation and next research
Automated checks cover queue ordering, expiry, source-age validity, background
result ownership, eligible alternative selection and incident-targeted scenarios.
Browser verification exercises case switching during inference, correct result
placement, alternative reassessment and approval.

Next: observe dispatch/destination coordination roles and test competing calls,
interruption recovery, stale information, exceptions and handoffs. Measure wrong
assignments, missed changes, time to identify the next action and unnecessary
navigation. Current public descriptions are not a substitute for local interviews.

## Public queue intake

The incident queue now includes automatically ingested Toronto Fire activity and
selected Police calls. Source filters keep workspace cases and public cases easy
to find without deleting either. Cards show published category/location, source,
reported age and a Needs triage indicator where priority is absent. Reported age
is not a claim of ambulance waiting time. Feed-health indicators remain visible.

Public cases expose an inline Incident details form. Missing requirements and
pickup coordinates are left empty; an operator chooses priority, required service
and equipment. Pickup can be entered as coordinates or selected on the map, with
an unsaved-point marker until the form is saved. Dispatcher notes and pickup
entries remain distinct from the published facts. Existing source text and Fire
unit/alarm details remain visible. A stale form offers an explicit reload action.

Source disappearance/failure remains a review condition, not a resolved incident.
The interface and server both prevent assessment of incomplete/stale public cases.
New arrivals preserve selection, current draft and existing plans for other calls.

## Workflow hierarchy revision

The selected incident now reads in this order: incident identity, four-step
progress (Details → Assessment → Review → Reserved), next-action guidance, then
assignment or intake. Response unit and receiving hospital have distinct compact
cards, with response and transport estimates kept separate. Maps and live context
use a quieter supporting panel. A reserved assignment is consistently labeled
Reserved rather than Proposed; its evidence remains available as historical source
evidence.

The queue is grouped into Assess & review, Needs details, Feed review and Reserved.
Stage-count buttons filter those groups, independently of the source selector.
Feed-review and reserved groups collapse by default unless they contain the selected
case. Priorities remain ordered inside each group. The overview now distinguishes
work ready for assessment from missing details and unavailable public feeds instead
of describing every stored call as awaiting action. Resources remain visible.

## Map-led agent workspace and comparable interfaces

The primary desktop layout keeps an incident inbox on the left, the operational map
in the centre, and the selected decision on the right. Unit/facility status remains
visible under the map. The inbox emphasizes Awaiting your approval, Agent working
and Needs your input; untriaged stale feed history and reserved cases are secondary.
Map incident pins select the corresponding case. Background changes do not recenter
the map; Focus selected and Overview are explicit controls. Missing pickup locations
are counted rather than given invented positions. Live context is available from a
map drawer. The decision panel shows a short grounded rationale, route estimates,
source age, and approval; manual reassessment is a secondary exception control.

Design references (desk research, not dispatcher validation):
- Motorola CommandCentral Aware pairs a unified operational map with an event list
  and event-triggered workflows:
  https://www.motorolasolutions.com/en_us/products/command-center-software/real-time-intelligence-operations/commandcentral-aware.html
- Hexagon OnCall describes a decluttered dynamic map with supplementary information
  available on demand:
  https://hexagon.com/company/newsroom/press-releases/2017/hexagon-safety-infrastructure-launches-new-computer-aided-dispatch-application
- Esri's emergency dashboard tutorial uses maps and linked displays to track incoming
  calls and response resources:
  https://learn.arcgis.com/en/projects/monitor-real-time-emergencies/

The layout adapts to stacked map/decision panes on narrower screens. Existing
assessment/approval constraints remain server-enforced. No claim of operational
usability validation or certification follows from these references.

### Navigation map refinement — October 23

Replaced standard raster streets with OpenFreeMap Positron vector cartography, rendered by a vendored MapLibre layer inside the existing Leaflet map. Muted streets, sharp labels, solid blue/teal routes with white casings, and a metric scale prioritize the operating picture. Invalid routes retain dashed amber styling. Existing map interactions and traffic calculations are unchanged.

Removed the decorative left accent borders and tinted containers from recommendation rationale and case guidance, plus the activity rail and selected-incident accent. Typographic hierarchy and spacing carry the explanation; semantic colors remain for status and routes. The short rationale summarizes the ranking; the full evidence and tie-breaking policy remain in the expanded evidence section.

Research references: [Uber Base](https://base.uber.com/) for coherent visual hierarchy; [Mapbox map design](https://www.mapbox.com/insights/map-design-process) for restrained palettes and feature emphasis; [OpenFreeMap quick start](https://openfreemap.org/quick_start/) for vector integration. This is an ARC design adaptation, not a copy of Uber's proprietary map style or a claim that callout borders are uniquely AI-generated.


## Decision inbox iteration — October 27

The default inbox shows operational response cases under Review plans, Questions
for you, With ARC, and Active assignments. Untriaged public reports are available
through Public reports and Earlier reports. They do not count as human questions
until a dispatcher supplies response requirements. Previously confirmed cases
with missing/stale source information remain actionable questions, never hidden
as raw feed history. Resource waits stay with ARC rather than becoming questions.

Cards show the location and next action, with identifiers retained in supporting
evidence rather than as primary labels. Reopening a workspace prioritizes an
operational case over an old saved public-report selection. The selected case
explains the current decision or specific information gap, with an intake/retry
control. Requirements remain explicit dispatcher inputs; no diagnosis is inferred.

The map defaults to the selected plan's unit and destination, and focuses the
case on deliberate selection. Routine polling does not recenter it. Other units,
facilities, reports, restrictions and sampled traffic overlays can be enabled in
Map & source details. Resource counts and unavailability remain visible beneath
the map; complete inventories open in Resources. Source context and activity are
available in a dialog. No conversational model or fabricated dialogue is added:
case messages describe actual state, and Why this plan / Compare options use the
existing evidence and assessment pipeline.


### React map workspace — October 27

The viewport is now a continuous map with floating navigation, inbox, contextual
details and an agent status dock. Existing light typography, Positron cartography,
blue response routes, teal destination routes and amber review states remain.
Clicking an incident opens its case review; unit, hospital, station, restriction
and public-call features open contextual detail cards with Zoom to, collapse and
close controls. Resource details use current workspace values; public context
retains source freshness and simulation distinctions.

One contextual panel is open at a time. The inbox can remain open alongside it
on desktop. On phones, inbox and details share a bottom-sheet position so the
map remains reachable. Pickup selection collapses the phone sheet until a point
is selected. Closing a panel or browsing another case preserves unsaved intake
and expanded case details. Background updates do not recenter the map.

React owns all interface rendering and state. The map is an imperative Leaflet
component with a stable lifetime, overlay updates, keyboard-selectable features,
and viewport padding for deliberate focus actions. The backend endpoints,
assessment rules, reservation checks and journey lifecycle have not changed.

Automated browser validation uses isolated API fixtures for existing endpoint
payloads and verifies panel geometry at 320, 390, 768, 1024, 1440 and 1920 pixels.
The Python suite remains the check for backend behavior. Live visual checks use
the running Toronto and Seattle workspaces without resetting their data.
