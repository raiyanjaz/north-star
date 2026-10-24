#!/bin/sh
cd "$(dirname "$0")" || exit 1
if PY="$(scripts/python-path.sh)"; then
  "$PY" launch.py
fi
echo ""
printf 'Press Enter to close this window… '
read -r answer
