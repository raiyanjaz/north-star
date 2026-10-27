"""Compatibility imports for scripts using the original workspace module."""

from backend.common import ROOT, stamp
from backend.workspace import Simulation
from backend.domain.seeds import FLEET, HOSPITALS, INCIDENTS

__all__ = ["Simulation", "ROOT", "stamp", "FLEET", "HOSPITALS", "INCIDENTS"]
