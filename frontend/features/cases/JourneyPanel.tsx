import {
  assignmentLabel,
  durationLabel,
  localTime,
  nextAssignmentPhase,
} from "../../policy";
import type { Assignment } from "../../types";
import type { Workspace } from "../../useWorkspace";
import { caseSections } from "./sections";
import type { CaseSections } from "./types";
export function JourneyPanel({
  workspace: w,
  assignment: a,
  details,
  onDetail,
}: CaseSections & { workspace: Workspace; assignment: Assignment }) {
  const disabled = w.busy || !w.connected,
    detail = caseSections({ details, onDetail });
  return (
    <>
      <section className="journey-progress">
        <h3>Journey progress</h3>
        <ol className="journey-stages">
          {[
            "assigned",
            "responding",
            "on_scene",
            "transporting",
            "handover",
            "completed",
          ].map((phase) => (
            <li
              key={phase}
              className={a.phase === phase ? "current" : ""}
              aria-current={a.phase === phase ? "step" : undefined}
            >
              {assignmentLabel(phase)}
            </li>
          ))}
        </ol>
        {a.hold_reason ? (
          <p className="notice warning">{a.hold_reason}</p>
        ) : ["completed", "cancelled"].includes(a.phase) ? (
          <p className="quiet">
            Ended {a.completed_at ? localTime(a.completed_at) : ""} · resources
            released.
          </p>
        ) : a.automatic ? (
          <p className="quiet">
            Next stage in{" "}
            {durationLabel(
              Math.max(0, Math.ceil((a.phase_ends_epoch || 0) - w.now / 1000)),
            )}{" "}
            · {a.speed}× exercise clock
          </p>
        ) : (
          <p className="quiet">
            Earlier assignment · advance stages manually in Journey controls.
          </p>
        )}
        <p className="micro">
          Progress follows assessed routes and exercise timing, not live crew
          updates.
        </p>
      </section>
      {!["completed", "cancelled"].includes(a.phase) &&
        detail(
          "journey-controls",
          "Journey controls",
          <>
            <p className="quiet">
              Advance one exercise stage, or end this assignment and release its
              resources at the current position.
            </p>
            <div className="button-row">
              <button
                disabled={disabled || !!a.hold_reason}
                onClick={() =>
                  void w
                    .mutate(
                      "/api/assignments/progress",
                      { id: a.id, revision: a.revision, action: "advance" },
                      "Assignment progress advanced.",
                    )
                    .catch(() => {})
                }
              >
                Advance to{" "}
                {assignmentLabel(nextAssignmentPhase(a.phase)).toLowerCase()}
              </button>
              <button
                disabled={disabled}
                onClick={() =>
                  void w
                    .mutate(
                      "/api/assignments/progress",
                      { id: a.id, revision: a.revision, action: "cancel" },
                      "Exercise assignment ended; resources released.",
                    )
                    .catch(() => {})
                }
              >
                End exercise assignment
              </button>
            </div>
          </>,
        )}
      {detail(
        "journey-history",
        "Journey history",
        <ol className="trace">
          {a.history.map((event, n) => (
            <li key={n}>
              {assignmentLabel(event.phase)} · {localTime(event.at, true)}
            </li>
          ))}
        </ol>,
      )}
    </>
  );
}
