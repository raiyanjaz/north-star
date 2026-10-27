import { useMemo, useState } from "react";
import { storageKey } from "../../api";
import { FloatingPanel } from "../../components/FloatingPanel";
import {
  assignmentLabel,
  caseQuestion,
  durationLabel,
  elapsedSeconds,
  inboxGroup,
  sortedIncidents,
} from "../../policy";
import type { Incident, Snapshot } from "../../types";
const names: Record<string, string> = {
  approval: "Review plans",
  input: "Questions for you",
  working: "With ARC",
  reserved: "Active assignments",
  completed: "Completed",
  reports: "Public reports",
  history: "Earlier reports",
};
const groups = [
  "approval",
  "input",
  "working",
  "reserved",
  "completed",
  "reports",
  "history",
];
function label(i: Incident, s: Snapshot) {
  const group = inboxGroup(i);
  if (group === "reports") return "Confirm response requirements";
  if (group === "history") return "Earlier public report";
  if (group === "completed") return "View completed assignment";
  if (group === "reserved") {
    const a = s.assignments.find((a) => a.incident_id === i.id);
    return a?.hold_reason ? "Journey needs review" : assignmentLabel(a?.phase);
  }
  if (group === "approval") return "Review ARC’s plan";
  if (group === "input") return caseQuestion(i).title;
  if (i.agent_state === "waiting")
    return i.agent_reason?.includes("receiving")
      ? "Waiting for a receiving facility"
      : i.agent_reason?.includes("unit")
        ? "Waiting for a unit"
        : i.agent_reason?.includes("paused")
          ? "ARC is paused"
          : "ARC is monitoring availability";
  return i.agent_state === "working"
    ? "ARC is checking this call"
    : "ARC will prepare a plan";
}
export function Inbox({
  state,
  selected,
  onSelect,
  onClose,
  now,
  bucket,
  setBucket,
}: {
  state: Snapshot;
  selected: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
  now: number;
  bucket: string;
  setBucket: (bucket: string) => void;
}) {
  const [source, setSource] = useState(
    () => sessionStorage.getItem(storageKey("arc.queueSource")) || "all",
  );
  const counts = useMemo(
    () =>
      Object.fromEntries(
        groups.map((group) => [
          group,
          state.incidents.filter((i) => inboxGroup(i) === group).length,
        ]),
      ),
    [state.incidents],
  );
  const reports = ["reports", "history"].includes(bucket);
  const rows = useMemo(
    () =>
      sortedIncidents(
        state.incidents.filter(
          (i) =>
            (bucket === "all"
              ? !["reports", "history", "completed"].includes(inboxGroup(i))
              : inboxGroup(i) === bucket) &&
            (!reports ||
              source === "all" ||
              (source === "public" && !!i.public_source) ||
              (source === "workspace" && !i.public_source) ||
              (source === "prepared" && i.prepared_intake) ||
              i.public_kind === source),
        ),
      ),
    [state.incidents, bucket, reports, source],
  );
  return (
    <FloatingPanel
      title="Work with ARC"
      eyebrow="DISPATCH INBOX"
      className="inbox-panel"
      onClose={onClose}
    >
      <div className="queue-stages">
        {["approval", "working", "input"].map((key) => (
          <button
            key={key}
            data-queue-bucket={key}
            className={key}
            aria-pressed={bucket === key}
            onClick={() => setBucket(bucket === key ? "all" : key)}
          >
            <b>{counts[key]}</b>
            <span>{names[key]}</span>
          </button>
        ))}
      </div>
      <div className="queue-aux">
        {["reserved", "completed", "reports", "history"].map((key) => (
          <button
            key={key}
            aria-pressed={bucket === key}
            onClick={() => setBucket(bucket === key ? "all" : key)}
          >
            {names[key]} <b>{counts[key]}</b>
          </button>
        ))}
      </div>
      {reports ? (
        <>
          <label className="field-label">
            Incident source
            <select
              aria-label="Incident source"
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                sessionStorage.setItem(
                  storageKey("arc.queueSource"),
                  e.target.value,
                );
              }}
            >
              <option value="all">All sources</option>
              <option value="public">Public calls</option>
              <option value="fire">{state.city.name} Fire</option>
              {state.city.id === "toronto" && (
                <option value="police">Toronto Police</option>
              )}
              <option value="workspace">Workspace cases</option>
              <option value="prepared">Prepared intake</option>
            </select>
          </label>
          <p className="quiet">
            Public reports need confirmed requirements before ARC can plan.
          </p>
          <p className="micro">
            {(state.city.id === "seattle" ? ["fire"] : ["fire", "police"])
              .map(
                (k) =>
                  `${k === "fire" ? "Fire" : "Police"}: ${state.public_context[k]?.stale ? "stale" : state.public_context[k]?.mode === "live" ? "connected" : "unavailable"}`,
              )
              .join(" · ")}
          </p>
        </>
      ) : (
        <p className="quiet inbox-note">
          {counts.approval || counts.input
            ? "Review a plan or answer a question. ARC follows up on the other cases."
            : "ARC is following your cases. The next decision will appear here."}
        </p>
      )}
      <div className="incident-list">
        {groups.map((group) => {
          const members = rows.filter((i) => inboxGroup(i) === group);
          return members.length ? (
            <details
              key={group}
              className="queue-group"
              open={
                bucket === group ||
                ["approval", "input", "working"].includes(group) ||
                members.some((i) => i.id === selected)
              }
            >
              <summary>
                {names[group]} <span>{members.length}</span>
              </summary>
              {members.map((i) => (
                <button
                  key={i.id}
                  className={`incident-card ${selected === i.id ? "selected" : ""}`}
                  data-incident={i.id}
                  aria-pressed={selected === i.id}
                  onClick={() => onSelect(i.id)}
                  onKeyDown={(e) => {
                    if (!["ArrowUp", "ArrowDown"].includes(e.key)) return;
                    e.preventDefault();
                    const next =
                      rows[
                        (rows.indexOf(i) +
                          (e.key === "ArrowDown" ? 1 : -1) +
                          rows.length) %
                          rows.length
                      ];
                    onSelect(next.id);
                    document
                      .querySelector<HTMLButtonElement>(
                        `[data-incident="${CSS.escape(next.id)}"]`,
                      )
                      ?.focus();
                  }}
                >
                  <span className="incident-top">
                    <span
                      className={`priority ${i.priority === "Priority 1" ? "urgent" : ""}`}
                    >
                      {i.status === "open"
                        ? i.priority || i.public_call_type || "Public report"
                        : i.status === "assigned"
                          ? "Approved"
                          : "Ended"}
                    </span>
                    {i.status === "open" && (
                      <span>
                        {durationLabel(
                          elapsedSeconds(
                            i.public_source
                              ? i.public_observed_at
                              : i.received_at || state.epoch,
                            now,
                          ),
                        )}
                      </span>
                    )}
                  </span>
                  <strong>{i.name}</strong>
                  <span
                    className={`queue-state ${group === "input" ? "attention" : ""}`}
                  >
                    {label(i, state)}
                  </span>
                </button>
              ))}
            </details>
          ) : null;
        })}
        {!rows.length && (
          <div className="empty-state">
            <strong>
              {bucket === "approval"
                ? "No plans waiting for review"
                : bucket === "input"
                  ? "No questions for you"
                  : "Nothing in this view"}
            </strong>
            <p>
              {reports
                ? "Try another source or view current reports."
                : "ARC will bring the next decision here."}
            </p>
          </div>
        )}
      </div>
    </FloatingPanel>
  );
}
