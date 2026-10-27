import {
  assignmentLabel,
  belongsToSelection,
  durationLabel,
  operationalCopy,
  proposalState,
} from "../../policy";
import { PlanEvidence } from "./PlanEvidence";
import { caseSections } from "./sections";
import type { CaseProps } from "./types";
export function PlanReview({
  workspace: w,
  incident: i,
  details,
  onDetail,
}: CaseProps) {
  const s = w.state!,
    r = w.rec!,
    p = r.selected,
    status = proposalState(r, s.version, w.now, i),
    assignment = s.assignments.find((a) => a.incident_id === i.id),
    disabled = w.busy || !w.connected,
    detail = caseSections({ details, onDetail });
  return (
    <>
      {p ? (
        <>
          {r.decision === "pending" && status === "ready" && (
            <p className="plan-explanation">
              {operationalCopy(
                p.reasons?.[0] ||
                  "These resources meet the confirmed requirements.",
              ).replace(
                "Lowest total driving time among eligible pairs; ties prefer more receiving slots, then stable ID.",
                "This is the shortest combined driving time among eligible plans.",
              )}
            </p>
          )}
          <section className="plan-section">
            <div className="plan-label">
              <span>RESPONSE UNIT</span>
              <span>
                {r.decision === "approved"
                  ? assignmentLabel(assignment?.phase)
                  : ["changed", "expired"].includes(status)
                    ? "Previous plan"
                    : "Proposed"}
              </span>
            </div>
            <div className="plan-main">
              <div>
                <strong>
                  {r.source_rows.fleet.find((a) => a.id === p.ambulance_id)
                    ?.name || p.ambulance_id}
                </strong>
                <p>Meets the {i.equipment} equipment requirement</p>
              </div>
              {r.decision !== "approved" && (
                <div className="eta">
                  <strong>~{p.pickup_min}</strong>
                  <small>min to pickup</small>
                </div>
              )}
            </div>
          </section>
          <section className="plan-section">
            <div className="plan-label">
              {r.decision === "approved"
                ? "RECEIVING FACILITY"
                : "DESTINATION PREVIEW"}
            </div>
            <div className="plan-main">
              <div>
                <strong>
                  {r.source_rows.hospitals.find((h) => h.id === p.hospital_id)
                    ?.name || p.hospital_id}
                </strong>
                <p>Meets the {i.service} service requirement</p>
              </div>
              {r.decision !== "approved" && (
                <div className="eta transport">
                  <strong>~{p.transport_min}</strong>
                  <small>min from pickup</small>
                </div>
              )}
            </div>
          </section>
          {r.decision !== "approved" && (
            <p className="micro">
              Driving estimates exclude time on scene and hospital handover.
            </p>
          )}
        </>
      ) : (
        <p className="notice warning">
          <strong>No suitable plan yet</strong>
          <br />
          ARC could not match the current requirements, available resources and
          routes.
        </p>
      )}
      {r.decision === "rejected" && (
        <p className="notice warning">
          Plan rejected. Review the requirements or request another assessment
          when ready.
        </p>
      )}
      {!!r.changes.length && status === "ready" && (
        <div className="notice">
          <strong>What changed</strong>
          {r.changes.map((c, n) => (
            <p key={n}>{operationalCopy(c.text)}</p>
          ))}
        </div>
      )}
      {r.decision === "pending" && (
        <div
          className={`evidence-quality ${["changed", "expired"].includes(status) ? "attention" : ""}`}
        >
          <span>{status === "expired" ? "Evidence expired" : "Checked"}</span>
          <span>
            {durationLabel(
              Math.max(
                0,
                Math.floor(
                  w.now / 1000 - (r.evidence_epoch || r.created_epoch),
                ),
              ),
            )}{" "}
            ago
          </span>
        </div>
      )}
      {status === "ready" && p && (
        <div className="approval-area">
          <div className="decision-actions">
            <button
              id="approve"
              className="primary approve"
              disabled={
                disabled ||
                !!(
                  w.job &&
                  !w.job.automatic &&
                  belongsToSelection(w.job, i.id, s.epoch)
                )
              }
              onClick={() => void w.decide("approve")}
            >
              Approve plan
            </button>
            <button
              disabled={
                disabled ||
                !!(
                  w.job &&
                  !w.job.automatic &&
                  belongsToSelection(w.job, i.id, s.epoch)
                )
              }
              onClick={() => void w.decide("reject")}
            >
              Reject plan
            </button>
          </div>
          <p className="micro">
            Approval reserves this unit and one receiving slot.
          </p>
        </div>
      )}
      {!!r.alternatives.filter(
        (a) => a.type === "assignment" && a.eligible && a.id !== p?.id,
      ).length &&
        detail(
          "alternatives",
          status === "ready"
            ? "Compare options"
            : "Other options at assessment",
          <>
            {r.alternatives
              .filter(
                (a) => a.type === "assignment" && a.eligible && a.id !== p?.id,
              )
              .sort(
                (a, b) =>
                  a.pickup_min - b.pickup_min ||
                  a.transport_min - b.transport_min,
              )
              .map((a) => (
                <div className="alternative-row" key={a.id}>
                  <strong>{a.name}</strong>
                  <p>
                    ~{a.pickup_min} min response · ~{a.transport_min} min
                    transport
                  </p>
                  {status === "ready" && (
                    <button
                      disabled={disabled || !!w.job}
                      onClick={() => void w.assess(a.id)}
                    >
                      Ask ARC to review this option
                    </button>
                  )}
                </div>
              ))}
          </>,
        )}
      <PlanEvidence workspace={w} details={details} onDetail={onDetail} />
    </>
  );
}
