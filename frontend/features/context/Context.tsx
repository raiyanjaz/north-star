import { useState } from "react";
import {
  durationLabel,
  elapsedSeconds,
  hasPickup,
  localTime,
} from "../../policy";
import type { Feature, Layers, PublicRecord } from "../../types";
import type { Workspace } from "../../useWorkspace";
import { Camera } from "./Camera";
const notices: Record<string, string> = {
  fire: "Public fire dispatch activity. Published positions may be approximate. Feed disappearance does not establish resolution.",
  police:
    "Public calls near mapped intersections. Reports may remain published after they have been handled.",
  roads:
    "Partial and scheduled restrictions provide context; these points do not automatically block routes.",
  hospitals:
    "Posted waits are not ambulance acceptance or available receiving slots.",
  traffic:
    "Sampled speeds describe nearby segments. Route estimates identify whether traffic was included.",
  stations:
    "Official Toronto station locations. No live staffing or vehicle availability is supplied.",
};
export function Context({
  workspace: w,
  layers,
  setLayers,
  onSelect,
  onCase,
}: {
  workspace: Workspace;
  layers: Layers;
  setLayers: (layers: Layers) => void;
  onSelect: (feature: Feature) => void;
  onCase: (id: string) => void;
}) {
  const s = w.state!,
    [kind, setKind] = useState("fire"),
    source = s.public_context[kind],
    rows = source?.records || [],
    current = s.incidents.find((i) => i.id === w.selected);
  const distance = (r: PublicRecord) =>
    hasPickup(r) && hasPickup(current)
      ? Math.hypot((r.lat - current.lat) * 111, (r.lon - current.lon) * 80)
      : Infinity;
  const display =
    kind === "police"
      ? [...rows]
          .sort((a, b) =>
            String(b.observed_at).localeCompare(String(a.observed_at)),
          )
          .slice(0, 30)
      : kind === "roads"
        ? [...rows].sort((a, b) => distance(a) - distance(b)).slice(0, 20)
        : rows;
  return (
    <>
      <h3 className="section-title first">Map layers</h3>
      <div className="layer-list">
        {(
          [
            ["resources", "All units and facilities"],
            ["calls", "Public calls"],
            ["roads", "Road restrictions"],
            ["traffic", "Sampled traffic speeds"],
            ...(s.city.id === "toronto"
              ? [["stations", "Ambulance stations"]]
              : []),
          ] as [keyof Layers, string][]
        ).map(([key, label]) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={layers[key]}
              onChange={(e) =>
                setLayers({ ...layers, [key]: e.target.checked })
              }
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      <p className="micro">
        {
          s.incidents.filter(
            (i) => i.status === "open" && i.service && !hasPickup(i),
          ).length
        }{" "}
        response cases need a pickup location.
      </p>
      <h3 className="section-title">Live context</h3>
      <label className="field-label">
        Source
        <select
          aria-label="Source"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option value="fire">Fire & medical assists</option>
          {s.city.id === "toronto" && (
            <option value="police">Police calls</option>
          )}
          <option value="roads">Road restrictions</option>
          <option value="hospitals">Hospital wait context</option>
          <option value="traffic">Traffic conditions</option>
          {s.city.id === "toronto" && (
            <option value="stations">Ambulance stations</option>
          )}
        </select>
      </label>
      <p className="quiet">
        {kind === "hospitals" && s.city.id === "seattle"
          ? "No live Seattle hospital waits or acceptance feed is connected."
          : notices[kind]}
      </p>
      <p className={`micro ${source?.stale ? "attention" : ""}`}>
        {source?.mode === "live"
          ? source.stale
            ? "Last retrieval is stale"
            : "Connected"
          : source?.mode === "cached"
            ? "Cached · refresh failed"
            : "Unavailable"}
        {source?.fetched_at
          ? " · retrieved " + localTime(source.fetched_at)
          : ""}
        {source?.error ? " · " + source.error : ""}
      </p>
      <div className="public-list">
        {display.map((r) => (
          <div className="public-row" key={r.id}>
            <strong>{r.name || r.id}</strong>
            {(kind === "fire" || kind === "police") && (
              <>
                <p>
                  {r.location} ·{" "}
                  {durationLabel(elapsedSeconds(r.observed_at, w.now))} ago
                  {r.units ? " · " + r.units : ""}
                </p>
                {(() => {
                  const queued = s.incidents.find(
                    (i) =>
                      i.public_source &&
                      i.public_observed_at === r.observed_at &&
                      i.public_location === r.location,
                  );
                  return queued ? (
                    <button onClick={() => onCase(queued.id)}>
                      Open queued call
                    </button>
                  ) : null;
                })()}
              </>
            )}
            {kind === "stations" && <p>{r.address}</p>}
            {kind === "roads" && <p>{r.description}</p>}
            {kind === "hospitals" && (
              <>
                <p>
                  {r.wait_min != null
                    ? `${r.wait_min} min posted wait`
                    : "Wait unavailable"}
                  {r.patients_waiting != null
                    ? ` · ${r.patients_waiting} waiting`
                    : ""}
                </p>
                <p>
                  {durationLabel(elapsedSeconds(r.observed_at, w.now))} ago
                  {(elapsedSeconds(r.observed_at, w.now) ?? Infinity) > 7200
                    ? " · stale / unverified"
                    : ""}
                </p>
              </>
            )}
            {kind === "traffic" && (
              <p>
                {r.speed_kph} km/h observed · {r.free_flow_kph} km/h free flow ·{" "}
                {r.closed ? "road closed" : "no closure reported"}
              </p>
            )}
            {hasPickup(r) && kind !== "hospitals" && (
              <button
                className="text-button"
                onClick={() =>
                  onSelect({ kind: kind as Feature["kind"], id: r.id })
                }
              >
                Inspect on map ↗
              </button>
            )}
          </div>
        ))}
        {!display.length && (
          <p className="quiet">
            {source?.mode === "live"
              ? "No records returned by this source."
              : "Waiting for available source data."}
          </p>
        )}
      </div>
      {source?.source_url && (
        <p className="micro">
          <a href={source.source_url} target="_blank" rel="noreferrer">
            Official source ↗
          </a>
        </p>
      )}
      {kind === "traffic" && s.city.id === "toronto" && (
        <>
          <p className="quiet">
            City traffic cameras · on-demand snapshots. Image capture time is
            not supplied; images may be old.
          </p>
          {[...(s.public_context.cameras?.records || [])]
            .sort((a, b) => distance(a) - distance(b))
            .slice(0, 3)
            .map((r) => (
              <Camera key={r.id} record={r} city={s.city.id} />
            ))}
        </>
      )}
      <h3 className="section-title">Recent activity</h3>
      {[
        ...w.activities,
        ...s.agent.events.map((e) => ({
          text: (e.incident_id ? e.incident_id + " · " : "") + e.text,
          at: e.at,
        })),
      ]
        .sort((a, b) => b.at.localeCompare(a.at))
        .slice(0, 6)
        .map((a, n) => (
          <p className="activity-row" key={n}>
            <time>{localTime(a.at)}</time>
            {a.text}
          </p>
        ))}
    </>
  );
}
