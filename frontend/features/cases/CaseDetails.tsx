import {
  assignmentLabel,
  belongsToSelection,
  friendlyStage,
  inboxGroup,
  proposalState,
} from "../../policy";
import { CaseGuidance } from "./CaseGuidance";
import { IntakeForm } from "./IntakeForm";
import { JourneyPanel } from "./JourneyPanel";
import { PlanReview } from "./PlanReview";
import { caseSections } from "./sections";
import type { CaseDetailsProps } from "./types";
export function CaseDetails({
  workspace: w,
  incident: i,
  draft,
  setDraft,
  picking,
  onPick,
  details,
  onDetail,
  request,
  setRequest,
}: CaseDetailsProps) {
  const s = w.state!,
    r = w.rec,
    status = proposalState(r, s.version, w.now, i),
    group = inboxGroup(i),
    assignment = s.assignments.find((a) => a.incident_id === i.id),
    intakeNeeded = Boolean(i.assessment_blockers?.length),
    disabled = w.busy || !w.connected;
  const common = { workspace: w, incident: i, details, onDetail },
    detail = caseSections({ details, onDetail });
  const intake = (
    <IntakeForm
      {...common}
      draft={draft}
      setDraft={setDraft}
      picking={picking}
      onPick={onPick}
    />
  );
  return (
    <div className="case-content">
      <div className="case-meta">
        <span
          className={`priority ${i.priority === "Priority 1" ? "urgent" : ""}`}
        >
          {i.priority || "Needs triage"}
        </span>
        <span>
          {i.prepared_intake
            ? "Prepared intake"
            : i.public_source || "Response case"}
        </span>
      </div>
      <p className="quiet requirements">
        {i.public_source && !i.prepared_intake
          ? i.public_call_type
          : `${i.service || "Unconfirmed"} service · ${i.equipment || "unconfirmed"} equipment`}
      </p>
      <CaseGuidance {...common} />
      {w.errors[i.id] && (
        <p className="notice error" role="alert">
          {w.errors[i.id]}
        </p>
      )}
      {w.job && belongsToSelection(w.job, i.id, s.epoch) && (
        <p className="assessment-progress" role="status">
          <span className="agent-orb running" />
          {friendlyStage(w.job.stage)}
        </p>
      )}
      {intakeNeeded && intake}
      {(r || assignment) && (
        <div className="decision-heading">
          <h3>
            {group === "completed"
              ? "Completed assignment"
              : group === "reserved"
                ? "Approved plan"
                : status === "ready"
                  ? "Your decision"
                  : "Response plan"}
          </h3>
          <span
            className={`status-label ${status === "ready" ? "success" : ""}`}
          >
            {
              (
                {
                  ready: "Ready for review",
                  changed: "Review required",
                  expired: "Evidence expired",
                  approved: assignmentLabel(assignment?.phase),
                  rejected: "Rejected",
                  blocked: "Blocked",
                  incomplete: "Details required",
                } as Record<string, string>
              )[status]
            }
          </span>
        </div>
      )}
      {assignment && (!r || r.decision === "approved") && (
        <JourneyPanel
          workspace={w}
          assignment={assignment}
          details={details}
          onDetail={onDetail}
        />
      )}
      {r && <PlanReview {...common} />}
      {!intakeNeeded && intake}
      {i.status === "open" &&
        !intakeNeeded &&
        !["working", "queued"].includes(i.agent_state || "") &&
        detail(
          "manual",
          "Ask ARC to review this case",
          <>
            <label>
              Add an instruction
              <textarea
                rows={3}
                value={request}
                onChange={(e) => setRequest(e.target.value)}
              />
            </label>
            <button
              className="secondary-action"
              disabled={disabled || !!w.job}
              onClick={() => void w.assess(undefined, request)}
            >
              {w.job
                ? "Another assessment is running"
                : i.agent_state === "needs_input"
                  ? "Retry assessment"
                  : "Reassess now"}
            </button>
          </>,
        )}
    </div>
  );
}
