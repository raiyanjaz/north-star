#!/bin/sh
if command -v node >/dev/null 2>&1; then command -v node
elif [ -x /Users/raiyanjaz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ]; then
  printf '%s\n' /Users/raiyanjaz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node
else echo 'Node.js 24+ required' >&2; exit 1; fi
