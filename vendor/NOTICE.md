# Third-party components

Meterless World Model reference and conformance runner: Apache-2.0,
https://github.com/Meterless/Meterless/tree/1742dec56a66e58eef9dda2d2b865823758ca8cd/engines/world-model
Copied reference source and conformance unmodified. ARC adapter: scripts/world-model.mjs.
Root license: METERLESS-LICENSE. No runtime package installation required on Node 24.

Leaflet 1.9.4: BSD-2-Clause, https://github.com/Leaflet/Leaflet/blob/v1.9.4/LICENSE
Vendored JS/CSS in web/. See LEAFLET-LICENSE.

Basemap: cached City of Toronto Centreline geometry, Open Government Licence Toronto.
The current frontend uses OpenFreeMap Positron vector tiles, with OpenStreetMap
raster tiles and the cached local streets as fallbacks. OSRM routes retain OpenStreetMap attribution.
Routes: OSRM public demo service, OpenStreetMap road network. Best-effort availability.
Public road restrictions: City of Toronto Open Government Licence,
https://open.toronto.ca/open-data-licence/ . Context only, partial feed.


The compiled ARC frontend includes React and React DOM (MIT license). Exact
versions and transitive dependencies are recorded in `pnpm-lock.yaml`; license
notices are retained in `web/app.js`. Vite, TypeScript and Playwright are build
and test dependencies, not additional backend services.
