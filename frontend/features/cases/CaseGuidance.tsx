import {
  assignmentLabel,
  caseQuestion,
  describeChange,
  friendlyStage,
  inboxGroup,
  proposalState,
} from "../../policy";
import type { CaseProps } from "./types";
export function CaseGuidance({
  workspace: w,
  incident: i,
  onDetail,
}: CaseProps) {
  const s = w.state!,
    r = w.rec,
    status = proposalState(r, s.version, w.now, i),
    group = inboxGroup(i),
    question = caseQuestion(i),
    assignment = s.assignments.find((a) => a.incident_id === i.id);
  let title = "",
    description = "",
    action = "";
  if (group === "reserved" || group === "completed") {
    title = assignment?.hold_reason
      ? "This journey needs review"
      : assignmentLabel(assignment?.phase);
    description =
      assignment?.hold_reason ||
      (["completed", "cancelled"].includes(assignment?.phase || "")
        ? "The unit and receiving slot were released. The unit stays at its last journey location."
        : assignment?.automatic
          ? "ARC is progressing this exercise along the approved route."
          : "This earlier assignment uses manual progress controls.");
  } else if (group === "reports" || group === "history") {
    title =
      group === "history"
        ? "Earlier public report"
        : "Is this a response case?";
    description =
      "This is a public report, not a confirmed request to ARC. " +
      question.body;
    action = "intake";
  } else if (group === "input") {
    title = question.title;
    description = question.body;
    action = question.target;
  } else if (status === "ready") {
    title = "ARC has a plan ready";
    description =
      "Review the unit, destination and explanation below. Resources stay available until you approve.";
  } else if (status === "changed" || status === "expired") {
    title = "ARC is reviewing this plan";
    description =
      status === "changed"
        ? describeChange(r, s)
        : "The previous evidence has aged. ARC will check current conditions before another approval.";
  } else if (i.agent_state === "working") {
    title = "ARC is checking this case";
    description = friendlyStage(i.agent_reason);
  } else if (i.agent_state === "waiting") {
    title = i.agent_reason?.includes("unit")
      ? "ARC is waiting for a unit"
      : i.agent_reason?.includes("receiving")
        ? "ARC is waiting for a receiving facility"
        : "ARC is monitoring this case";
    description = i.agent_reason || "";
  } else {
    title = "ARC will prepare a plan";
    description =
      "ARC will check eligible units, receiving facilities and routes, then bring you a recommendation.";
  }
  if (!s.agent.enabled && group === "working") {
    title = "ARC is paused";
    description = "Resume ARC to continue preparing and refreshing plans.";
  }
  return (
    <section className="case-guidance">
      <span className="eyebrow">ARC</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <button
          onClick={() => {
            const target = action === "intake" ? "intake" : "manual";
            onDetail(target, true);
            requestAnimationFrame(() =>
              document
                .querySelector<HTMLDetailsElement>(
                  `.case-content details[open]`,
                )
                ?.scrollIntoView({ block: "nearest" }),
            );
          }}
        >
          {group === "reports"
            ? "Confirm this response case"
            : group === "history"
              ? "Review report details"
              : question.action}
        </button>
      )}
    </section>
  );
}
