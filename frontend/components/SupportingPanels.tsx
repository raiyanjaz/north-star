import { useEffect, useState } from "react";
import type { Feature, Layers, PublicRecord, Snapshot } from "../types";
import type { Workspace } from "../useWorkspace";
import { api } from "../api";
import {
  assignmentLabel,
  proposedUnits,
  hasPickup,
  localTime,
  elapsedSeconds,
  durationLabel,
} from "../policy";
import { Icon } from "./Icon";
export function Resources({
  state: s,
  onSelect,
}: {
  state: Snapshot;
  onSelect: (feature: Feature) => void;
}) {
  const proposed = proposedUnits(s);
  return (
    <>
      <p className="quiet">
        Units and receiving facilities across this workspace.
      </p>
      {s.city.id === "toronto" && (
        <p className="micro">
          Station-based positions use official Toronto geography. Unit staging
          and availability are scenario data.
        </p>
      )}
      <h3 className="section-title">
        Response units{" "}
        <span>
          {
            s.fleet.filter(
              (a) => a.status === "available" && !proposed.has(a.id),
            ).length
          }{" "}
          free
        </span>
      </h3>
      {s.fleet.map((a) => (
        <button
          className="resource-row"
          key={a.id}
          onClick={() => onSelect({ kind: "unit", id: a.id })}
        >
          <span className="resource-icon">
            <Icon name="unit" />
          </span>
          <span className="resource-copy">
            <strong>{a.name}</strong>
            <small>{a.equipment.replaceAll(",", " · ")}</small>
            {a.station_reference && (
              <small>Base: {a.station_reference.name}</small>
            )}
          </span>
          <span
            className={`status-label ${a.status === "available" ? "success" : ""}`}
          >
            {a.status === "assigned"
              ? assignmentLabel(
                  s.assignments.find((j) => j.id === a.active_assignment_id)
                    ?.phase,
                )
              : proposed.has(a.id)
                ? "Proposed"
                : a.status}
          </span>
        </button>
      ))}
      <h3 className="section-title">Receiving facilities</h3>
      {s.hospitals.map((h) => (
        <button
          className="resource-row"
          key={h.id}
          onClick={() => onSelect({ kind: "hospital", id: h.id })}
        >
          <span className="resource-icon hospital">
            <Icon name="hospital" />
          </span>
          <span className="resource-copy">
            <strong>{h.name}</strong>
            <small>{h.capabilities.replaceAll(",", " · ")}</small>
          </span>
          <span
            className={`status-label ${h.accepting && h.slots > 0 ? "success" : "warning"}`}
          >
            {h.accepting && h.slots > 0 ? h.slots + " slots" : "Unavailable"}
          </span>
        </button>
      ))}
    </>
  );
}
export function resolveFeature(s: Snapshot, f: Feature | null) {
  if (!f) return null;
  if (f.kind === "incident")
    return s.incidents.find((i) => i.id === f.id) || null;
  if (f.kind === "unit") return s.fleet.find((i) => i.id === f.id) || null;
  if (f.kind === "hospital")
    return s.hospitals.find((i) => i.id === f.id) || null;
  if (f.kind === "closure")
    return s.closures.find((i, n) => (i.id || String(n)) === f.id) || null;
  return s.public_context[f.kind]?.records.find((i) => i.id === f.id) || null;
}
export const featureLabels: Record<string, string> = {
  unit: "RESPONSE UNIT",
  hospital: "RECEIVING FACILITY",
  incident: "CASE DETAILS",
  closure: "SCENARIO CLOSURE",
  fire: "PUBLIC FIRE REPORT",
  police: "PUBLIC POLICE REPORT",
  roads: "ROAD RESTRICTION",
  traffic: "TRAFFIC OBSERVATION",
  stations: "AMBULANCE STATION",
};
export function FeatureDetails({
  state: s,
  feature: f,
  onCase,
}: {
  state: Snapshot;
  feature: Feature;
  onCase: (id: string) => void;
}) {
  const item = resolveFeature(s, f);
  if (!item)
    return (
      <p className="notice warning">
        This feature is no longer in the current picture.
      </p>
    );
  const rows: [string, React.ReactNode][] = [];
  let note = "";
  if (f.kind === "unit") {
    const unit = s.fleet.find((a) => a.id === f.id)!;
    const a = s.assignments.find((a) => a.id === unit.active_assignment_id);
    rows.push(
      [
        "Status",
        a
          ? assignmentLabel(a.phase)
          : proposedUnits(s).has(unit.id)
            ? "Proposed"
            : unit.status,
      ],
      ["Equipment", unit.equipment.replaceAll(",", " · ")],
    );
    if (unit.station_reference)
      rows.push(
        ["Base", unit.station_reference.name],
        ["Address", unit.station_reference.address],
      );
    if (a)
      rows.push([
        "Assignment",
        <button className="text-button" onClick={() => onCase(a.incident_id)}>
          Open assigned case
        </button>,
      ]);
    note =
      "Unit availability and movement are exercise data, not live vehicle tracking.";
  } else if (f.kind === "hospital") {
    const h = s.hospitals.find((h) => h.id === f.id)!;
    rows.push(
      [
        "Receiving status",
        h.accepting && h.slots > 0 ? "Accepting" : "Unavailable",
      ],
      ["Available slots", h.slots],
      ["Services", h.capabilities.replaceAll(",", " · ")],
    );
    note =
      "Receiving availability is workspace exercise data, separate from public hospital waits.";
  } else if (f.kind === "closure") {
    rows.push([
      "Radius",
      String("radius_m" in item ? item.radius_m : "") + " m",
    ]);
    note = "This scenario closure participates in route eligibility checks.";
  } else {
    const r = item as PublicRecord;
    for (const [label, key] of [
      ["Address", "address"],
      ["Location", "location"],
      ["Description", "description"],
      ["Published units", "units"],
      ["Observed speed", "speed_kph"],
      ["Free-flow speed", "free_flow_kph"],
      ["Confidence", "confidence"],
    ] as const) {
      const value = r[key];
      if (value != null)
        rows.push([label, `${value}${key.includes("kph") ? " km/h" : ""}`]);
    }
    if (r.observed_at)
      rows.push([
        "Source updated",
        new Date(r.observed_at).toLocaleString("en-CA", {
          timeZone: s.city.timezone,
        }),
      ]);
    if (r.updated_ms)
      rows.push([
        "Source updated",
        new Date(Number(r.updated_ms)).toLocaleString("en-CA", {
          timeZone: s.city.timezone,
        }),
      ]);
    const source = s.public_context[f.kind];
    rows.push([
      "Feed status",
      source?.stale
        ? "Stale"
        : source?.mode === "live"
          ? "Connected"
          : source?.mode || "Unavailable",
    ]);
    if (source?.fetched_at)
      rows.push(["Retrieved", localTime(source.fetched_at)]);
    if (source?.source_url)
      rows.push([
        "Source",
        <a href={source.source_url} target="_blank" rel="noreferrer">
          Official source ↗
        </a>,
      ]);
    note =
      f.kind === "stations"
        ? "Official station location. The catalogue contains no live vehicles, staffing or availability."
        : f.kind === "roads"
          ? "Public restriction context. These points do not automatically block routes or alter travel estimates."
          : "Published context does not establish a confirmed response case or resource availability.";
    const queued = s.incidents.find(
      (i) =>
        i.public_source &&
        i.public_observed_at === r.observed_at &&
        i.public_location === r.location,
    );
    if (queued)
      rows.push([
        "ARC case",
        <button className="text-button" onClick={() => onCase(queued.id)}>
          Open queued call
        </button>,
      ]);
  }
  if (hasPickup(item))
    rows.push([
      "Coordinates",
      `${item.lat.toFixed(5)}, ${item.lon.toFixed(5)}`,
    ]);
  return (
    <>
      <div className={`feature-symbol ${f.kind}`}>
        <Icon
          name={
            f.kind === "unit"
              ? "unit"
              : f.kind === "hospital"
                ? "hospital"
                : "pin"
          }
          size={26}
        />
      </div>
      <dl className="attributes">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="quiet feature-note">{note}</p>
    </>
  );
}
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
function Camera({ record, city }: { record: PublicRecord; city: string }) {
  const [url, setUrl] = useState(""),
    [error, setError] = useState(false);
  return (
    <details className="review-details">
      <summary>
        Camera {record.id} · {record.name}
      </summary>
      <button
        onClick={() => {
          setError(false);
          setUrl(
            `/api/cameras/${encodeURIComponent(record.id)}?city=${city}&t=${Date.now()}`,
          );
        }}
      >
        {url ? "Refresh snapshot" : "Load camera snapshot"}
      </button>
      {error ? (
        <p role="status">Camera image unavailable.</p>
      ) : (
        url && (
          <img
            className="camera-image"
            alt={`${city} traffic camera snapshot`}
            src={url}
            onError={() => setError(true)}
          />
        )
      )}
    </details>
  );
}
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
export function Evidence({ workspace: w }: { workspace: Workspace }) {
  const [world, setWorld] = useState<{
      entities: unknown[];
      events: unknown[];
    } | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    api<{ entities: unknown[]; events: unknown[] }>(
      "/api/world",
      undefined,
      controller.signal,
    )
      .then(setWorld)
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      });
    return () => controller.abort();
  }, []);
  const s = w.state!;
  return (
    <>
      {error ? (
        <p className="notice error">{error}</p>
      ) : !world ? (
        <p>Loading integration evidence…</p>
      ) : (
        <>
          {[
            [
              "Zetaris · federated product query",
              w.rec?.zetaris ||
                s.integrations.zetaris ||
                "Assess an incident first.",
            ],
            [
              "Nightshift → NVIDIA Nemotron",
              w.rec?.ai || "No completed AI assessment yet.",
            ],
            [
              "Meterless World Model",
              {
                entities: world.entities.length,
                recent_events_returned: world.events.length,
                events: world.events.slice(-8),
              },
            ],
          ].map(([label, value]) => (
            <section className="integration-block" key={String(label)}>
              <h3>{String(label)}</h3>
              <pre>{JSON.stringify(value, null, 2)}</pre>
            </section>
          ))}
        </>
      )}
      <h3 className="section-title">
        {s.city.name} road context · {s.public_roads.mode}
      </h3>
      <p className="quiet">
        {s.public_roads.note ||
          s.public_roads.error ||
          "Public point restrictions are contextual, not validated closure polygons."}
      </p>
      <p className="micro">
        {s.public_roads.fetched_at || "Not fetched"} ·{" "}
        {s.public_roads.records.length} records
      </p>
      <button
        disabled={w.busy || !w.connected}
        onClick={() =>
          void w
            .mutate("/api/roads/refresh", {}, "Public road context refreshed.")
            .catch(() => {})
        }
      >
        Refresh public road context
      </button>
    </>
  );
}
