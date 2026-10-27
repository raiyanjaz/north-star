# Internal simulation register

ARC's operator-facing language describes the workflow without repeating prototype
implementation disclosures. This register and the submission documentation retain
the exact data boundaries. UI wording does not change any underlying integration,
source provenance, state transition, or actual external connection.

## Simulated
- Incoming incidents, arrival times, priorities and service/equipment requirements.
  These are predefined scenario fixtures, not patient diagnoses or actual 911 calls.
- Ambulance / crew identifiers, coordinates, equipment and availability.
- Hospital capabilities, acceptance state and receiving-slot counts. Real facility
  names / approximate coordinates do not make these operational values real.
- Controlled circular road closures, busy-unit changes and hospital unavailability.
- Stale feeds and data/AI failures triggered from workspace controls.
- Assignment approval / rejection, ambulance reservation and slot allocation.
  Changes affect local transactional state only. No dispatch message is delivered,
  crew acknowledgment is obtained, patient is transported, or hospital contacted.
- The 120-second evidence validity window is an application simulation policy,
  not a claimed Toronto dispatch standard.

## Real integrations / public or cached data
- Product SQL requests run through the configured Zetaris organization and combine
  three distinct REST feeds. Their operational rows are the simulated feeds above.
- Model planning and explanations use Nightshift Runtime. Actual winning receipts
  identify the underlying NVIDIA Nemotron model; requested model IDs can be rerouted.
- Meterless World Model is the actual pinned upstream reference implementation,
  with persistent entities, provenance and recommendation relationships.
- OSRM / OpenStreetMap supplies actual ordinary-driving route geometry and static
  estimates. Routes may be served from the labelled seven-day cache. They do not
  include current traffic, emergency driving privileges or validated entrances.
- Basemap is a cached public City of Toronto street-centreline extract.
- Optional City road restrictions are public, partial contextual records with
  source/fetch timestamps. They are not validated closure polygons for routing.

## Operator-facing wording
Use ordinary terms such as unit availability, receiving facilities, response plan,
assignment, evidence age and reserved. Keep uncertainty, stale evidence and estimate
limitations visible because they affect decisions. Do not claim a crew was notified,
a hospital accepted a transfer, or a unit acknowledged dispatch: those connections
are absent. Underlying source metadata remains accurate in APIs and technical
integration evidence; it is not rewritten to claim live operational feeds.

## Presentation and submission
Disclose the above boundaries in the README, sponsor-integration explanation and
submission materials. The operator screen is a product walkthrough, not evidence
of connection to Toronto emergency operations. No operational or clinical
validation has been performed.

## Toronto public context added October 23, 2026

The workspace now polls official Toronto Police calls, official Toronto Fire active
incidents, City road restrictions v3, the City traffic-camera catalog, and public
ER Watch hospital readings. These are read-only contextual feeds, separate from
Zetaris-federated scenario resource availability. Public updates do not reserve
resources or silently change hospital acceptance, slots, clinical requirements,
or route exclusions. Optional TomTom flow observations use a server-side key.

A dispatcher can create a local review case from a fresh mapped police call by
explicitly choosing priority, service and equipment. Published coordinates are
approximate intersections; medical distress is excluded by the police publisher.
Toronto Fire medical calls expose postal areas only; ARC does not manufacture
precise pickup coordinates for them. Public call disappearance is not resolution.
Review-case arrival is the time added to ARC; original occurrence time is retained.
A new case increments the operational version, invalidating pending approvals.

ER Watch is an independent aggregator, not a hospital connection. Source reading
timestamps and unavailable/stale readings are visible. Posted waiting times and
patient counts never stand in for hospital acceptance or available receiving slots.
Its public server-rendered data may change format; parser failures are explicit.

Traffic cameras are on-demand still images, not video or speed measurements.
The publisher does not supply capture time; images may be stale despite retrieval.
TomTom flow covers sampled segments near three downtown locations, with speed,
free-flow speed, closure and confidence. With a configured key, fresh assessments use TomTom traffic-informed routes instead of OSRM. Without it, OSRM estimates remain static.
No traffic readings are invented when a key is absent or a request fails.

## Automatic public incident intake

Fire active incidents and selected Police safety calls now enter the incident
queue automatically. Their published category, occurrence/dispatch time, location,
fire-unit list and alarm level are public observations, not scenario fixtures.
The original three workspace cases and existing reservations remain intact.

Priority, required service/equipment, dispatcher notes and a confirmed pickup
when no coordinates are published are dispatcher entries. ARC does not manufacture
patient ages, diagnoses, ambulance needs, exact medical-call addresses or clinical
priorities. Postal areas are never converted to precise pickup points automatically.
Operator-entered positions have pickup_source=dispatcher; original public fields
are retained separately. Notes are local review details, not clinical rules.

Disappearance from a feed means missing/review required, never resolved. Cached,
stale or unavailable feeds block assessment and approval for affected public calls.
A dispatcher may still prepare details while awaiting a current source. Automatic
source changes preserve dispatcher input and flag material changes for review.
Public calls are already agency response activity; ARC's queue is a local review
queue, not access to an unassigned 911 dispatch queue.

## Prepared intake and autonomous demo

fixtures/demo-intake.json supplies three exercise cases (DEMO-201–203), complete
priority/service/equipment/pickup values, and two standby units (Medic 51 and 52).
They are added once per simulation epoch. Existing cases, reservations and hospital
slots are preserved; no unit is released and no existing assignment is reset.
Public references may be attached as context, but the prepared clinical requirements
and pickup coordinates are authored exercise data, not inferred public facts.
Prepared records carry prepared_intake=true and requirements_source/pickup_source
=prepared_demo, and the UI identifies them as Prepared intake.

Automatic assessment is real orchestration through the sponsor services and traffic
routing. It is not autonomous dispatch. Advisory commitments to pending plans do
not change fleet availability or consume slots. Only dispatcher approval makes the
existing local reservation. No crew notification, acknowledgment, travel or hospital
contact is invented. Agent refresh/rate-limit settings are application policies,
not Toronto clinical or dispatch standards.


## Seattle workspace

- Live: official Seattle Fire/EMS reported calls, source timestamps, approximate
  published coordinates; TomTom traffic samples and directed routing; WSDOT
  state-road closure context within Seattle coverage.
- Public calls cover the last four hours, not a complete active/unassigned EMS
  queue. No active/closed status or clinical priority is inferred from call type.
- Exercise inputs: all Seattle response units, positions/equipment/availability;
  hospital capabilities/acceptance/slots; three SEA-DEMO prepared intake profiles;
  controlled disruptions and reservations. Hospital names and approximate locations
  use public geography; operational resource records are not live hospital data.
- No live Seattle hospital waits, acceptance, police or camera adapter is connected.
- Live-call requirements stay blank until explicitly entered by the dispatcher.
  Prepared cases are separate from public cases and labeled as prepared intake.
- Cached Seattle street geometry: OpenStreetMap via Overpass, fetched October 27,
  2026; partial coverage 47.585..47.675 N, -122.36..-122.28 E. Standard map layers
  cover the broader city when online. Attribution: OpenStreetMap contributors,
  ODbL https://www.openstreetmap.org/copyright.
- Approvals reserve only city-local exercise resources. No real crews, dispatch
  centers or hospitals receive messages.


## Toronto station-based scenario positions

Toronto's official Ambulance Service Facility ArcGIS catalogue supplies station
names, addresses and coordinates. PublicContext retrieves this reference source
hourly and marks retrievals stale after a day. On the first fresh catalogue,
available scenario units without a station reference are staged at nearby actual
stations, preferring distinct sites. This proximity mapping is a scenario choice;
unit names, capabilities, availability and unit-to-station membership are not
provided by the catalogue. Assigned and busy units retain their positions, and
already anchored units are not moved by catalogue refreshes. References persist
with the unit state. Resource-version changes invalidate old proposals before
approval. A workspace reset can seed staging again from a fresh catalogue.

The Resources view identifies each staged unit's station and address; Details →
Ambulance stations shows the source catalogue and retrieval status. The synthetic
fleet still passes through Zetaris, including its separate location provenance.
A failed station request leaves existing positions intact and does not invent
station locations or claim live vehicle tracking.

Source: https://gis.toronto.ca/arcgis/rest/services/cot_geospatial25/FeatureServer/1


## Automatic assignment journeys

New approved assignments use the assessed route geometry and driving duration
for estimated journey progress. Departure (15 seconds), on-scene time (3 minutes)
and hospital handover (5 minutes) are scenario assumptions, scaled by the exercise
clock (default 10×; 1× and 30× are available in Workspace controls). This is not
live vehicle tracking or confirmation of patient treatment or crew activity.
Completion releases the local unit and receiving slot once; the unit remains at
the hospital-side route endpoint. Ending an exercise releases it at its current
position and closes that exercise case. Old saved assignments retain manual
progress so an upgrade does not guess they have finished. Timed journeys continue
from persisted deadlines across restarts; paused assessment does not pause them.
