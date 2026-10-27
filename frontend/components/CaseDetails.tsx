import { useState, type ReactNode } from "react";
import type { Workspace } from "../useWorkspace";
import type { Incident, IntakeDraft, Assignment } from "../types";
import {
  assignmentLabel,
  nextAssignmentPhase,
  proposalState,
  inboxGroup,
  caseQuestion,
  friendlyStage,
  describeChange,
  operationalCopy,
  durationLabel,
  elapsedSeconds,
  makeDraft,
  localTime,
  belongsToSelection,
} from "../policy";
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
}: {
  workspace: Workspace;
  request: string;
  setRequest: (request: string) => void;
  incident: Incident;
  draft: IntakeDraft | undefined;
  setDraft: (draft: IntakeDraft | undefined) => void;
  picking: boolean;
  onPick: () => void;
  details: Set<string>;
  onDetail: (name: string, open: boolean) => void;
}) {
  const s = w.state!,
    r = w.rec,
    status = proposalState(r, s.version, w.now, i),
    group = inboxGroup(i),
    question = caseQuestion(i),
    assignment = s.assignments.find((a) => a.incident_id === i.id);
  const [intakeError, setIntakeError] = useState("");
  const disabled = w.busy || !w.connected;
  const detail = (id: string, title: string, children: ReactNode) => (
    <details
      className="review-details"
      open={details.has(id)}
      onToggle={(e) => onDetail(id, e.currentTarget.open)}
    >
      <summary>{title}</summary>
      {children}
    </details>
  );
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
  const d = draft || makeDraft(i),
    p = r?.selected,
    canEdit = Boolean(
      (i.public_source || i.prepared_intake) && i.status === "open",
    ),
    intakeNeeded = Boolean(i.assessment_blockers?.length);
  const intake = canEdit
    ? detail(
        "intake",
        `Response details · ${intakeNeeded ? "review required" : "ready"}`,
        <>
          <details className="source-details">
            <summary>Published information</summary>
            <p className="quiet">
              {i.prepared_intake
                ? "Prepared demo profile. Priority, requirements and pickup are supplied for this exercise."
                : `Published: ${i.public_call_type || "Call"} · ${i.public_location || "Location unavailable"} · ${durationLabel(elapsedSeconds(i.public_observed_at, w.now))} ago. ${i.public_kind === "fire" ? `Published fire units: ${i.public_units || "not supplied"} · alarm level ${i.public_alarm_level ?? "not supplied"}. ` : ""}${i.pickup_source === "dispatcher" ? "Pickup entered by dispatcher." : "Public positions are approximate."}`}
            </p>
          </details>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIntakeError("");
              const owner = i.id;
              try {
                await w.mutate(
                  "/api/incidents/details",
                  { ...d, incident_id: owner, revision: d.revision },
                  "Incident details saved.",
                );
                setDraft(undefined);
              } catch (error) {
                setIntakeError(
                  error instanceof Error
                    ? error.message
                    : "Could not save details",
                );
              }
            }}
          >
            <div className="form-grid">
              {(["priority", "service", "equipment"] as const).map((field) => (
                <label key={field}>
                  {field === "priority"
                    ? "Priority"
                    : field === "service"
                      ? "Required service"
                      : "Required equipment"}
                  <select
                    required
                    value={d[field]}
                    onChange={(e) =>
                      setDraft({ ...d, [field]: e.target.value })
                    }
                  >
                    <option value="">Choose {field}</option>
                    {(field === "priority"
                      ? ["Priority 1", "Priority 2", "Priority 3"]
                      : field === "service"
                        ? ["general", "cardiac", "trauma", "neuro", "pediatric"]
                        : ["general", "advanced"]
                    ).map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <label>
              Pickup address or intersection
              <input
                maxLength={200}
                value={d.pickup_label}
                onChange={(e) =>
                  setDraft({ ...d, pickup_label: e.target.value })
                }
              />
            </label>
            <div className="form-grid coordinates">
              <label>
                Pickup latitude
                <input
                  aria-label="Pickup latitude"
                  type="number"
                  required
                  step="any"
                  min={s.city.bounds[0] + 0.000001}
                  max={s.city.bounds[2] - 0.000001}
                  value={d.lat}
                  onChange={(e) => setDraft({ ...d, lat: e.target.value })}
                />
              </label>
              <label>
                Pickup longitude
                <input
                  aria-label="Pickup longitude"
                  type="number"
                  required
                  step="any"
                  min={s.city.bounds[1] + 0.000001}
                  max={s.city.bounds[3] - 0.000001}
                  value={d.lon}
                  onChange={(e) => setDraft({ ...d, lon: e.target.value })}
                />
              </label>
            </div>
            <button
              type="button"
              className="text-button"
              aria-pressed={picking}
              onClick={() => {
                setDraft(d);
                onPick();
              }}
            >
              {picking ? "Cancel map pickup" : "Choose pickup on map"}
            </button>
            <p className="micro">
              {picking
                ? "Click a confirmed pickup point on the map."
                : "Confirm the pickup point. A street or postal area alone is not an exact pickup."}
            </p>
            <label>
              Dispatcher notes
              <textarea
                rows={3}
                maxLength={1000}
                value={d.notes}
                onChange={(e) => setDraft({ ...d, notes: e.target.value })}
              />
            </label>
            <p className="micro">
              Priority, requirements and notes are dispatcher entries, separate
              from public facts.
            </p>
            {(intakeError || d.revision !== (i.incident_revision || 0)) && (
              <div className="notice warning" role="alert">
                <p>
                  {intakeError ||
                    "This case changed while you were editing. Your draft has been preserved."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(makeDraft(i));
                    setIntakeError("");
                  }}
                >
                  Discard draft and load current details
                </button>
              </div>
            )}
            <button className="primary" type="submit" disabled={disabled}>
              Confirm & let ARC continue
            </button>
          </form>
        </>,
      )
    : null;
  const journey = (a: Assignment) => (
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
      {assignment && (!r || r.decision === "approved") && journey(assignment)}
      {r && (
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
                      {r.source_rows.hospitals.find(
                        (h) => h.id === p.hospital_id,
                      )?.name || p.hospital_id}
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
              ARC could not match the current requirements, available resources
              and routes.
            </p>
          )}
          {r.decision === "rejected" && (
            <p className="notice warning">
              Plan rejected. Review the requirements or request another
              assessment when ready.
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
              <span>
                {status === "expired" ? "Evidence expired" : "Checked"}
              </span>
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
                    (a) =>
                      a.type === "assignment" && a.eligible && a.id !== p?.id,
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
          {detail(
            "reasoning",
            "Why this plan?",
            <>
              {r.explanation.evidence_ids.map((id) => {
                const e = r.evidence.find((e) => e.id === id);
                return e ? (
                  <div className="evidence-item" key={id}>
                    <span className="eid">{id}</span>
                    <p>{operationalCopy(e.text)}</p>
                  </div>
                ) : null;
              })}
              {r.alternatives
                .filter((a) => !a.eligible)
                .map((a) => (
                  <div className="alternative-row" key={a.id}>
                    <strong>{a.name} · excluded</strong>
                    <p>{operationalCopy(a.reasons.join(" "))}</p>
                  </div>
                ))}
            </>,
          )}
          {detail(
            "sources",
            "Evidence & activity",
            <>
              <p className="quiet">
                Routes:{" "}
                {p
                  ? `${p.transport_route.mode} ${p.transport_route.source}`
                  : "unavailable or ineligible"}{" "}
                ·{" "}
                {p?.transport_route.traffic_aware
                  ? "Traffic at assessment time"
                  : "Static estimates; no live traffic"}
                <br />
                Assessed{" "}
                {new Date(r.created_at).toLocaleString("en-CA", {
                  timeZone: s.city.timezone,
                })}
              </p>
              {r.changes.map((c, n) => (
                <p className="notice" key={n}>
                  {operationalCopy(c.text)}
                </p>
              ))}
              <ol className="trace">
                {r.trace.map((t, n) => (
                  <li key={n}>
                    <strong>{t.tool}</strong>
                    <br />
                    {operationalCopy(t.detail)}
                  </li>
                ))}
              </ol>
              {Object.entries(r.source_rows).map(([key, rows]) => (
                <p className="micro" key={key}>
                  {key} · observed{" "}
                  {(rows[0] as { observed_at?: string })?.observed_at ||
                    "missing timestamp"}
                </p>
              ))}
            </>,
          )}
        </>
      )}
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
