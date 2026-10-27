import type { Feature, Snapshot } from "../../types";
export function resolveFeature(s: Snapshot, f: Feature | null) {
  if (!f) return null;
  if (f.kind === "incident")
    return s.incidents.find((i) => i.id === f.id) || null;
  if (f.kind === "unit") return s.fleet.find((i) => i.id === f.id) || null;
  if (f.kind === "hospital")
    return s.hospitals.find((i) => i.id === f.id) || null;
  if (f.kind === "closure")
    return s.closures.find((i, n) => (i.id || String(n)) === f.id) || null;
  return s.public_context[f.kind]?.records.find((i) => i.id === f.id) || null;
}
export const featureLabels: Record<string, string> = {
  unit: "RESPONSE UNIT",
  hospital: "RECEIVING FACILITY",
  incident: "CASE DETAILS",
  closure: "SCENARIO CLOSURE",
  fire: "PUBLIC FIRE REPORT",
  police: "PUBLIC POLICE REPORT",
  roads: "ROAD RESTRICTION",
  traffic: "TRAFFIC OBSERVATION",
  stations: "AMBULANCE STATION",
};
