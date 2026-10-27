import { Icon } from "../../components/Icon";
import { friendlyStage } from "../../policy";

import type { Workspace } from "../../useWorkspace";
import type { WorkspaceLayout } from "./useWorkspaceLayout";
export function MapDock({
  workspace: w,
  layout,
}: {
  workspace: Workspace;
  layout: WorkspaceLayout;
}) {
  const {
    s,
    setCollapsed,
    setFocus,
    picking,
    setPicking,
    open,
    counts,
    free,
    busyIncident,
    reviewing,
    map,
  } = layout;
  return (
    <>
      {picking && (
        <div className="pickup-prompt" role="status">
          <Icon name="pin" />
          <span>Click a pickup point on the map</span>
          <button
            onClick={() => {
              setPicking(null);
              setCollapsed(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}
      <div className="map-controls" aria-label="Map controls">
        <button
          aria-label="Focus selected case"
          title="Focus selected"
          onClick={() =>
            setFocus((previous) => ({
              serial: previous.serial + 1,
              mode: "selected",
            }))
          }
        >
          <Icon name="focus" />
        </button>
        <button
          aria-label="Show overview"
          title="Overview"
          onClick={() =>
            setFocus((previous) => ({
              serial: previous.serial + 1,
              mode: "overview",
            }))
          }
        >
          <Icon name="overview" />
        </button>
        <span />
        <button
          aria-label="Zoom in"
          title="Zoom in"
          onClick={() => map.current?.zoomIn()}
        >
          <Icon name="plus" />
        </button>
        <button
          aria-label="Zoom out"
          title="Zoom out"
          onClick={() => map.current?.zoomOut()}
        >
          <Icon name="minus" />
        </button>
      </div>
      <div className="map-caption">
        {w.rec?.selected && (
          <div className="map-legend">
            {reviewing ? (
              <span>
                <i className="review" />
                Previous plan · review required
              </span>
            ) : (
              <>
                <span>
                  <i />
                  Unit to incident
                </span>
                <span>
                  <i className="transport" />
                  Incident to hospital
                </span>
              </>
            )}
          </div>
        )}
        <p>
          {w.rec?.decision === "approved"
            ? "Approved route · exercise progress"
            : w.rec?.selected?.transport_route.traffic_aware
              ? "Traffic at assessment time · ordinary driving"
              : w.rec?.selected
                ? "Static driving estimates · no live traffic"
                : "Operational picture"}
        </p>
        <button className="resource-summary" onClick={() => open("resources")}>
          {s ? (
            <>
              <i className={free ? "" : "unavailable"} />
              {free} {free === 1 ? "unit" : "units"} free<span>·</span>
              {
                s.hospitals.filter((h) => h.accepting && h.slots > 0).length
              }{" "}
              receiving facilities
            </>
          ) : (
            "Loading workspace…"
          )}
        </button>
      </div>
      <section className="agent-bar" aria-label="ARC agent status">
        <span className={`agent-orb ${w.job ? "running" : ""}`} />
        <div className="agent-copy">
          <strong>
            {s
              ? s.agent.enabled
                ? w.job
                  ? "ARC is assessing"
                  : "ARC is monitoring"
                : "ARC is paused"
              : "Connecting to ARC"}
          </strong>
          <p>
            {s?.agent.error ||
              (w.job
                ? (busyIncident?.name || "Current case") +
                  " · " +
                  friendlyStage(w.job.stage)
                : counts && (counts.approval || counts.input)
                  ? `${counts.approval} plans to review · ${counts.input} questions for you`
                  : s?.agent.enabled
                    ? "Following your cases and checking availability."
                    : "Resume ARC to continue preparing plans.")}
          </p>
        </div>
        {s && (
          <button
            className="agent-toggle"
            disabled={w.busy || !w.connected}
            aria-label={s.agent.enabled ? "Pause agent" : "Resume agent"}
            onClick={() =>
              void w
                .mutate("/api/agent/control", { enabled: !s.agent.enabled })
                .catch(() => {})
            }
          >
            <Icon name={s.agent.enabled ? "pause" : "play"} size={16} />
            <span>{s.agent.enabled ? "Pause" : "Resume"}</span>
          </button>
        )}
      </section>
    </>
  );
}
