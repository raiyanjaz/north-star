#!/bin/sh
set -eu
cd "$(dirname "$0")"
export NODE_BIN="${NODE_BIN:-$(scripts/node-path.sh)}"
exec "$(scripts/python-path.sh)" app.py "$@"
