"""Backward-compatible ARC launcher and public application imports."""

from backend.application import ARC
from backend.http import ARCServer, Handler
from backend.runtime import main

__all__ = ["ARC", "ARCServer", "Handler", "main"]

if __name__ == "__main__":
    main()
