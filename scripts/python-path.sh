#!/bin/sh
if [ -n "$PYTHON_BIN" ]; then printf '%s\n' "$PYTHON_BIN"
elif python3 -c 'import sys; assert sys.version_info >= (3,11)' >/dev/null 2>&1; then command -v python3
elif [ -x /Users/raiyanjaz/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 ]; then printf '%s\n' /Users/raiyanjaz/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3
else echo 'Python 3.11+ required. Set PYTHON_BIN to a supported interpreter.' >&2; exit 1; fi
