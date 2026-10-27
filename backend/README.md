# Backend boundaries

The application remains one process. `runtime.py` wires each city's `ARC` service
into the HTTP and read-only feed servers. Importing these modules does not start
servers or background workers.

1. `http.py` handles HTTP validation, city routing, static assets and encoding.
2. `application.py` composes services and orchestrates multi-step commands.
3. `assessment.py` runs the evidence, route, eligibility and model pipeline.
4. `workspace.py` exposes the existing `Simulation` API and delegates domain
   operations to `domain/` (intake, proposals, journeys, scenarios).
5. `storage.py` owns SQLite schema/query code and transaction commit/rollback.

Domain rules never bypass the repository with SQL. `Simulation.db` is retained
for existing diagnostic/test consumers, not for new application code. Services
share the repository's reentrant lock; transaction scopes preserve the existing
atomic reservation, progression, and audit boundaries.

The pure decision/coordination/journey policies and provider adapters remain in
the focused root modules. `common.py` supplies paths/timestamps without coupling
those modules to the workspace service. The root `app.py` and `simulation.py`
are compatibility entry points for existing launchers and scripts.
