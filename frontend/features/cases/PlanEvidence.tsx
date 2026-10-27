import { operationalCopy } from "../../policy";
import type { Workspace } from "../../useWorkspace";
import { caseSections } from "./sections";
import type { CaseSections } from "./types";
export function PlanEvidence({
  workspace: w,
  details,
  onDetail,
}: CaseSections & { workspace: Workspace }) {
  const s = w.state!,
    r = w.rec!,
    p = r.selected,
    detail = caseSections({ details, onDetail });
  return (
    <>
      {" "}
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
  );
}
