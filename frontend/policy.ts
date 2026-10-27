export {
  assignmentLabel,
  belongsToSelection,
  caseQuestion,
  defaultInboxSelection,
  durationLabel,
  elapsedSeconds,
  inboxGroup,
  nextAssignmentPhase,
  proposalState,
  sortedIncidents,
} from "./domain/dispatch-model.mjs";
import type {
  Incident,
  IntakeDraft,
  Location,
  Recommendation,
  Snapshot,
} from "./types";
export const hasPickup = (
  p?: Location | null,
): p is Location & { lat: number; lon: number } =>
  !!p &&
  p.lat != null &&
  p.lon != null &&
  Number.isFinite(Number(p.lat)) &&
  Number.isFinite(Number(p.lon));
export function proposedUnits(state: Snapshot) {
  return new Set(
    Object.entries(state.proposals || {})
      .filter(
        ([id, p]) =>
          p.decision === "pending" &&
          p.approvable &&
          p.version === state.version &&
          state.agent.states[id]?.state === "awaiting_approval",
      )
      .map(([, p]) => p.ambulance_id),
  );
}
export function friendlyStage(stage = "") {
  if (stage.includes("Planning")) return "Reviewing the request…";
  if (stage.includes("Federating"))
    return "Checking unit and hospital availability…";
  if (stage.includes("Calculating"))
    return "Comparing eligible resources and routes…";
  if (stage.includes("Recalling")) return "Checking what changed…";
  return "Preparing the evidence explanation…";
}
export const operationalCopy = (text: string) =>
  String(text)
    .replace(/\bsimulated\s+/gi, "")
    .replace(/\bsynthetic\s+/gi, "")
    .replace(/\bpredefined\s+/gi, "required ");
export function describeChange(r: Recommendation | null, s: Snapshot) {
  const a = s.fleet.find((a) => a.id === r?.selected?.ambulance_id),
    h = s.hospitals.find((h) => h.id === r?.selected?.hospital_id);
  if (a && a.status !== "available")
    return a.name + " is now " + a.status + ".";
  if (h && (!h.accepting || h.slots < 1))
    return h.name + " is no longer available to receive this transfer.";
  if (s.closures.length) return "A road closure may affect this plan’s routes.";
  return "The operational picture changed after this plan was assessed.";
}
export function makeDraft(i: Incident): IntakeDraft {
  return {
    priority: i.priority || "",
    service: i.service || "",
    equipment: i.equipment || "",
    lat: i.lat == null ? "" : String(i.lat),
    lon: i.lon == null ? "" : String(i.lon),
    pickup_label: i.pickup_label || i.name,
    notes: i.notes || "",
    revision: i.incident_revision || 0,
  };
}
export const localTime = (value: string | number, seconds = false) =>
  new Date(value).toLocaleTimeString("en-CA", {
    timeZone: window.ARC_CITY.timezone,
    hour: "2-digit",
    minute: "2-digit",
    ...(seconds ? { second: "2-digit" } : {}),
  });
