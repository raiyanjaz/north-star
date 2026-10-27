"""Shared paths and timestamps without importing application services."""

import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def stamp(t=None):
    return datetime.fromtimestamp(t or time.time(), timezone.utc).isoformat()
