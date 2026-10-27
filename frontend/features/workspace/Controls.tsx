import { useState } from "react";
import type { Workspace } from "../../useWorkspace";
export function Controls({
  workspace: w,
  onClose,
}: {
  workspace: Workspace;
  onClose: () => void;
}) {
  const s = w.state!,
    [resetConfirm, setResetConfirm] = useState(false);
  const scenario = async (name: string) => {
    try {
      await w.mutate(
        "/api/scenario",
        { name, incident_id: w.selected },
        "Workspace conditions updated.",
      );
      onClose();
    } catch {}
  };
  return (
    <>
      <p className="quiet">
        Changes apply to the selected case’s proposed resources.
      </p>
      <div className="scenario-buttons">
        {[
          [
            "hospital-unavailable",
            "Hospital unavailable",
            "Proposed destination stops accepting transfers.",
          ],
          [
            "road-closure",
            "Close approach road",
            "Block the current destination approach.",
          ],
          [
            "fleet-busy",
            "Unit becomes busy",
            "Proposed unit becomes unavailable.",
          ],
        ].map(([name, label, note]) => (
          <button
            key={name}
            disabled={w.busy || !w.connected || !w.selected}
            onClick={() => void scenario(name)}
          >
            <strong>{label}</strong>
            <span>{note}</span>
          </button>
        ))}
      </div>
      <details className="review-details">
        <summary>Service conditions</summary>
        <div className="button-row">
          {[
            ["stale-feed", "Stale feed"],
            ["no-destination", "No destination"],
            ["zetaris-offline", "Data failure"],
            ["ai-offline", "AI failure"],
            ["refresh", "Restore feeds"],
          ].map(([name, label]) => (
            <button
              key={name}
              disabled={w.busy || !w.connected}
              onClick={() => void scenario(name)}
            >
              {label}
            </button>
          ))}
        </div>
      </details>
      <label className="field-label">
        Exercise journey speed
        <select
          value={s.journey_speed || 10}
          disabled={w.busy || !w.connected}
          onChange={(e) =>
            void w
              .mutate(
                "/api/journeys/speed",
                { speed: Number(e.target.value) },
                "Exercise journey speed changed.",
              )
              .catch(() => {})
          }
        >
          <option value={1}>Real time (1×)</option>
          <option value={10}>10×</option>
          <option value={30}>30×</option>
        </select>
      </label>
      <p className="micro">
        New approvals progress automatically using assessed driving times, plus
        3 minutes on scene and 5 minutes for handover. Movement is simulated.
      </p>
      <button
        disabled={w.busy || !w.connected}
        onClick={() =>
          void w
            .mutate<{ loaded: boolean }>("/api/demo/intake", {})
            .then((r) =>
              w.notify(
                r.loaded
                  ? "Prepared intake loaded. ARC will assess automatically."
                  : "Prepared intake is already loaded.",
              ),
            )
            .catch(() => {})
        }
      >
        Load prepared demo intake
      </button>
      <p className="quiet">
        {s.scenario === "baseline"
          ? "Baseline scenario"
          : s.scenario.replaceAll("-", " ")}
      </p>
      <div className="reset-section">
        {resetConfirm ? (
          <>
            <p>Reset this city’s exercise cases, plans and reservations?</p>
            <div className="button-row">
              <button
                className="danger"
                disabled={w.busy || !w.connected}
                onClick={() =>
                  void w
                    .mutate("/api/reset", {}, "Workspace reset.")
                    .then(onClose)
                    .catch(() => {})
                }
              >
                Confirm reset
              </button>
              <button onClick={() => setResetConfirm(false)}>
                Keep workspace
              </button>
            </div>
          </>
        ) : (
          <button
            className="text-button danger"
            onClick={() => setResetConfirm(true)}
          >
            Reset workspace
          </button>
        )}
      </div>
    </>
  );
}
