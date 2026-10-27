import type { Incident, Recommendation, Job } from "../frontend/types";
export function elapsedSeconds(
  iso: string | undefined,
  now?: number,
): number | null;
export function durationLabel(seconds: number | null): string;
export function priorityNumber(incident: Incident): number;
export function sortedIncidents(incidents: Incident[]): Incident[];
export function proposalState(
  proposal: Recommendation | null,
  version: number,
  now?: number,
  incident?: Incident | null,
): string;
export function belongsToSelection(
  job: Job,
  incidentId: string | null,
  epoch: string,
): boolean;
export function nextAction(status: string): string | null;
export function workflowBucket(incident: Incident): string;
export function inboxGroup(incident: Incident): string;
export function assignmentLabel(phase?: string | null): string;
export function nextAssignmentPhase(phase: string): string | null;
export function defaultInboxSelection(
  incidents: Incident[],
  savedId: string | null,
): string | null;
export function caseQuestion(incident: Incident): {
  title: string;
  body: string;
  action: string;
  target: string;
};
