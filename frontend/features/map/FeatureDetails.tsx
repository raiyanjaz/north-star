import { Icon } from "../../components/Icon";
import {
  assignmentLabel,
  hasPickup,
  localTime,
  proposedUnits,
} from "../../policy";
import type { Feature, PublicRecord, Snapshot } from "../../types";
import { resolveFeature } from "./features";
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
