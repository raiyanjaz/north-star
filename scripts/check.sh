#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
PY="$(scripts/python-path.sh)"
NODE="$(scripts/node-path.sh)"
"$PY" -m unittest discover -s tests -v
"$PY" -m py_compile cities.py assignment_lifecycle.py station_locations.py app.py launch.py simulation.py decision.py integrations.py agent.py meterless_client.py zetaris_client.py public_context.py network.py incident_intake.py coordination.py agent_control.py
"$NODE" --check web/app.js
"$NODE" --test tests/test-dispatch-model.mjs
WORLD_MODEL_IMPL="$PWD/vendor/world-model/src/index.ts" "$NODE" --experimental-transform-types vendor/world-model-conformance/runner.ts
"$PY" scripts/secret-check.py
