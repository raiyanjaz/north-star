# Data sources and comparable products

## Integrated
- Synthetic REST feeds: /feeds/fleet, /feeds/hospitals, /feeds/roads (port 4318).
  Rows include source=simulated, observed_at and version. The stale scenario sets
  timestamps 20 minutes back. Read-only views expose no private records.
- City Toronto Centreline, cached downtown display geometry:
  https://gis.toronto.ca/arcgis/rest/services/cot_geospatial/MapServer/2
  Filtered road classes and bounding box, capped at 6,000 features. Fetch metadata
  in web/toronto-map.geojson. Open Government Licence Toronto.
- City Current Road Restriction, optional public context:
  https://gis.toronto.ca/arcgis/rest/services/cot_geospatial2/MapServer/5
  Partial fetch up to 100 records. INFO_UPDATED is retained alongside fetch time.
  Precise closure extent is not established by a point record.
- OSRM public demo routing API: https://project-osrm.org/docs/v5.24.0/api/
  OpenStreetMap road network, ordinary driving profile. No current traffic,
  emergency exemptions, hospital entrance validation, or guaranteed availability.

## Researched but not required
- UHN public ER wait estimates:
  https://www.uhn.ca/PatientsFamilies/Visit_UHN/Emergency/Pages/ED_wait_times.aspx
- Hamilton hospital wait dashboard, updates every 15 minutes:
  https://www.hamiltonemergencywaittimes.ca/
  Public estimates do not establish ambulance acceptance or receiving capacity.
  Neither website was assumed to expose a supported public API.
- Juvare EMResource: https://www.juvare.ca/emresource/
  Operational precedent for EMS visibility into hospital bed/service availability.
  Customer data/API access was not assumed or obtained. ARC does not claim the
  general hospital-status dashboard concept is new. Its hackathon focus is cited
  assignment comparison, explicit constraints and explained reassessment.

## Replaceable adapters
Federation.snapshot returns typed resource groups; Routes.get supplies geometry,
distance, duration and provenance; refresh_public_roads supplies contextual records.
A real feed adapter must preserve source timestamps, explicit provenance, and the
same eligibility/freshness contracts. A real deployment requires domain validation,
authentication, least-privilege source access, protected feed endpoints and proper
clinical/dispatch governance. Those are outside this simulation's scope.

## Current Toronto live picture (October 23, 2026)

`public_context.py` refreshes sources independently in a background worker, normally
once per minute. Failures preserve last successful data as cached, with stale/error
indicators; the operational Zetaris path is unchanged. `/api/public` exposes the
same snapshot as the workspace. Provider credentials never enter responses.

- Toronto Police C4S public layer: https://services.arcgis.com/S9th0jAJ7bqgIRjw/arcgis/rest/services/C4S_Public_NoGO/FeatureServer/0
  Public query, no key. Five-minute publishing cadence; four-hour display is not
  incident status. Coordinates, type, cross streets, division, occurrence time;
  no durable CAD identifier, priority, ambulance need or unit availability. Review
  cases deduplicate by occurrence time/type/location, not mutable OBJECTID.
  Contains information licensed under the Open Government Licence – Ontario;
  TPS item terms also prohibit identification attempts and misrepresentation.
- Toronto Fire: https://www.toronto.ca/data/fire/livecad.xml
  Includes publisher timestamp, event number, dispatch time, category, alarm level
  and fire unit list. Medical locations are postal areas. Five-minute publication.
- **Road adapter replaced:** https://secure.toronto.ca/opendata/cart/road_restrictions/v3?format=csv
  This replaces the older ArcGIS MapServer/5 source above, which returned only two
  old restrictions at inspection. V3 returned roughly 2,000 records within their
  date ranges. Includes ID, modification/date range, impact, type, direction and
  polyline. Work-hour schedules remain descriptive; these are contextual restrictions,
  not automatic route blocks. CSV is used because live JSON contained an invalid
  escape. Verified TLS uses the system trust plus installed Homebrew CA bundle,
  where available; verification is never disabled.
- City camera catalog: https://opendata.toronto.ca/transportation/tmc/rescucameraimages/Data/tmcearthcameras.json
  JSONP parsed as data, not executed. Downtown camera positions; fixed-origin JPEG
  proxy validates IDs against the catalog. Snapshot capture time is unavailable.
- ER Watch: https://www.er-watch.ca/
  Public server-rendered hospital data, Toronto-area entries only. Independent
  aggregator; original reading timestamps, missing/online state retained. Readings
  older than two hours or without a timestamp are marked stale/unverified. A fetch
  timestamp never substitutes for a reading timestamp. Not capacity or acceptance.
- Optional TomTom Traffic Flow Segment Data: https://docs.tomtom.com/traffic-api/documentation/tomtom-maps/v1/traffic-flow/flow-segment-data
  Configure `TOMTOM_API_KEY` in private `.env` or environment. Three downtown samples
  per refresh (at most 180 requests/hour). Flow is contextual. With the key configured, assessments use TomTom traffic-informed routing, a 30-second memory cache and the same 120-second approval window measured from the oldest operational or selected traffic-route evidence. Provider failure blocks routing; no silent static fallback.
  Account registration is complete and a dedicated key is configured. Live flow and routing were verified on October 23, 2026.

ARC makes no claim that these public feeds form a complete emergency dispatch
picture. No private dispatch or patient systems are connected.

## Map background

The map-led workspace uses standard interactive OpenStreetMap tiles with visible
attribution, normal browser caching and an origin referrer. It does not prefetch or
bulk download tiles. Cached City downtown geometry remains an explicit fallback
when map tiles fail. Tiles are display geography; TomTom provides current routing
and sampled traffic flow, independently. Policy:
https://operations.osmfoundation.org/policies/tiles/

### Basemap update — October 23

The primary map background is now [OpenFreeMap Positron](https://openfreemap.org/quick_start/), using OpenStreetMap/OpenMapTiles data. OpenFreeMap's public instance requires no account or API key. Visible map attribution credits the provider and data sources. The basemap is cartographic context, not live traffic. TomTom observations and route estimates remain separate overlays/data.

If vector rendering or its network requests fail, ARC falls back to standard OSM raster tiles; cached Toronto centreline geometry remains the last background fallback. Background status is shown above the map. This does not fabricate missing route/traffic data.

Vendored browser dependencies (no application package installation or build): MapLibre GL JS **5.6.2**, and `@maplibre/maplibre-gl-leaflet` **0.1.3**, distributed from their npm/unpkg packages. License files reside beside the assets in `web/`. Existing Leaflet markers, routes, pickup selection and map controls remain in use.
