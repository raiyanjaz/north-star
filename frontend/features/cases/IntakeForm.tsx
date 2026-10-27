import { useState } from "react";
import { durationLabel, elapsedSeconds, makeDraft } from "../../policy";
import { caseSections } from "./sections";
import type { IntakeProps } from "./types";
export function IntakeForm({
  workspace: w,
  incident: i,
  draft,
  setDraft,
  picking,
  onPick,
  details,
  onDetail,
}: IntakeProps) {
  const s = w.state!,
    d = draft || makeDraft(i),
    disabled = w.busy || !w.connected;
  const canEdit = Boolean(
      (i.public_source || i.prepared_intake) && i.status === "open",
    ),
    intakeNeeded = Boolean(i.assessment_blockers?.length);
  const [intakeError, setIntakeError] = useState("");
  const detail = caseSections({ details, onDetail });
  return canEdit
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
}
