import { Icon } from "../../components/Icon";
import { assignmentLabel, proposedUnits } from "../../policy";
import type { Feature, Snapshot } from "../../types";
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
