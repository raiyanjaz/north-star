import { useEffect, useRef, useState, Component, type ReactNode } from "react";
import type { Map as LeafletMap } from "leaflet";
import { useWorkspace } from "./useWorkspace";
import { MapView, type MapFocus } from "./components/MapView";
import { Inbox } from "./components/Inbox";
import { FloatingPanel } from "./components/FloatingPanel";
import { CaseDetails } from "./components/CaseDetails";
import {
  Resources,
  Context,
  Controls,
  Evidence,
  FeatureDetails,
  resolveFeature,
  featureLabels,
} from "./components/SupportingPanels";
import { Icon } from "./components/Icon";
import {
  friendlyStage,
  proposedUnits,
  hasPickup,
  makeDraft,
  proposalState,
  localTime,
  inboxGroup,
} from "./policy";
import type { Feature, Layers, IntakeDraft } from "./types";
type Panel =
  "feature" | "resources" | "context" | "controls" | "evidence" | null;
function useMobile() {
  const [mobile, setMobile] = useState(
    () => matchMedia("(max-width: 760px)").matches,
  );
  useEffect(() => {
    const mq = matchMedia("(max-width: 760px)"),
      change = () => setMobile(mq.matches);
    mq.addEventListener("change", change);
    return () => mq.removeEventListener("change", change);
  }, []);
  return mobile;
}
export function App() {
  const w = useWorkspace(),
    s = w.state,
    mobile = useMobile(),
    [inboxOpen, setInboxOpen] = useState(!mobile),
    [queueBucket, setQueueBucket] = useState("all"),
    [instructions, setInstructions] = useState<Record<string, string>>({}),
    [panel, setPanel] = useState<Panel>(mobile ? null : "feature"),
    [feature, setFeature] = useState<Feature | null>(null),
    [collapsed, setCollapsed] = useState(false),
    [layers, setLayers] = useState<Layers>({
      resources: true,
      calls: false,
      roads: false,
      traffic: false,
      stations: false,
    }),
    [focus, setFocus] = useState<MapFocus>({ serial: 0, mode: "selected" }),
    [picking, setPicking] = useState<string | null>(null),
    [drafts, setDrafts] = useState<Record<string, IntakeDraft>>({}),
    [detailStates, setDetailStates] = useState<Record<string, Set<string>>>({});
  const map = useRef<LeafletMap | null>(null),
    epoch = useRef(""),
    scrolls = useRef<Record<string, number>>({});
  const incident = s?.incidents.find((i) => i.id === w.selected),
    currentFeature =
      feature ||
      (w.selected ? { kind: "incident" as const, id: w.selected } : null),
    item = s ? resolveFeature(s, currentFeature) : null;
  useEffect(() => {
    if (!s) return;
    if (epoch.current && epoch.current !== s.epoch) {
      setDrafts({});
      setQueueBucket("all");
      setInstructions({});
      setDetailStates({});
      setPicking(null);
      setFeature(null);
      scrolls.current = {};
    }
    epoch.current = s.epoch;
  }, [s?.epoch]);
  const saveScroll = () => {
    if (currentFeature) {
      const body = document.querySelector(".detail-panel .panel-body");
      if (body)
        scrolls.current[currentFeature.kind + currentFeature.id] =
          body.scrollTop;
    }
  };
  useEffect(() => {
    const body = document.querySelector(".detail-panel .panel-body");
    if (body && currentFeature)
      body.scrollTop =
        scrolls.current[currentFeature.kind + currentFeature.id] || 0;
  }, [currentFeature?.kind, currentFeature?.id, panel, collapsed]);
  const open = (next: Panel) => {
    saveScroll();
    setPanel(next);
    setCollapsed(false);
    setPicking(null);
    if (mobile) setInboxOpen(false);
  };
  const selectFeature = async (f: Feature) => {
    saveScroll();
    setFeature(f);
    setPicking(null);
    setPanel("feature");
    setCollapsed(false);
    if (mobile) setInboxOpen(false);
    if (f.kind === "incident") {
      const target = s?.incidents.find((i) => i.id === f.id);
      if (
        target &&
        ["reports", "history", "completed"].includes(inboxGroup(target))
      )
        setQueueBucket(inboxGroup(target));
      await w.select(f.id);
      setFocus((previous) => ({
        serial: previous.serial + 1,
        mode: "selected",
      }));
    }
  };
  const openCase = (id: string) => void selectFeature({ kind: "incident", id });
  const closePanel = () => {
    saveScroll();
    setPanel(null);
    setPicking(null);
    document.getElementById("show-selected")?.focus({ preventScroll: true });
  };
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (picking) {
        setPicking(null);
        setCollapsed(false);
      } else if (panel) {
        setPanel(null);
        setCollapsed(false);
      } else setInboxOpen(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [panel, picking]);
  const setDraft = (id: string, draft: IntakeDraft | undefined) =>
    setDrafts((previous) => {
      const next = { ...previous };
      if (draft) next[id] = draft;
      else delete next[id];
      return next;
    });
  const details = detailStates[w.selected || ""] || new Set<string>();
  const onDetail = (name: string, expanded: boolean) => {
    if (!w.selected) return;
    const id = w.selected;
    setDetailStates((previous) => {
      const next = new Set(previous[id] || []);
      if (next.has(name) === expanded) return previous;
      if (expanded) next.add(name);
      else next.delete(name);
      return { ...previous, [id]: next };
    });
  };
  const counts = s
    ? {
        approval: s.incidents.filter((i) => inboxGroup(i) === "approval")
          .length,
        input: s.incidents.filter((i) => inboxGroup(i) === "input").length,
      }
    : null;
  const free = s
    ? s.fleet.filter(
        (a) => a.status === "available" && !proposedUnits(s).has(a.id),
      ).length
    : 0;
  const busyIncident = s?.incidents.find((i) => i.id === w.job?.incident_id),
    status = s
      ? proposalState(w.rec, s.version, w.now, incident)
      : "unassessed";
  const reviewing =
    !!s?.assignments.find((a) => a.incident_id === w.selected)?.hold_reason ||
    (w.rec?.decision === "pending" && status !== "ready");
  const panelTitle =
    panel === "feature"
      ? item?.name || "Case details"
      : panel === "resources"
        ? "Resources"
        : panel === "context"
          ? "Map & source details"
          : panel === "controls"
            ? "Workspace controls"
            : "System details";
  return (
    <main
      className={`arc-workspace ${inboxOpen ? "inbox-open" : ""} ${panel ? "detail-open" : ""} ${picking ? "picking-location" : ""}`}
    >
      <MapView
        state={s}
        rec={w.rec}
        selected={w.selected}
        feature={currentFeature}
        layers={layers}
        focus={focus}
        ready={w.connected}
        picking={!!picking}
        draftPoint={
          incident &&
          drafts[incident.id] &&
          drafts[incident.id].lat &&
          drafts[incident.id].lon &&
          (Number(drafts[incident.id].lat) !== incident.lat ||
            Number(drafts[incident.id].lon) !== incident.lon)
            ? {
                lat: Number(drafts[incident.id].lat),
                lon: Number(drafts[incident.id].lon),
              }
            : null
        }
        onSelect={(f) => void selectFeature(f)}
        onPick={(lat, lon) => {
          if (!picking || !s) return;
          const target = s.incidents.find((i) => i.id === picking);
          if (!target) return;
          setDraft(target.id, {
            ...(drafts[target.id] || makeDraft(target)),
            lat: lat.toFixed(6),
            lon: lon.toFixed(6),
          });
          setPicking(null);
          setCollapsed(false);
          w.notify("Pickup point selected. Save response details to confirm.");
        }}
        onMapReady={(m) => {
          map.current = m;
        }}
        notify={w.notify}
      />
      <div className="workspace-ui">
        <header className="workspace-header">
          <a
            className="brand"
            href={"/?city=" + window.ARC_CITY.id}
            aria-label="ARC home"
          >
            <span className="logo">
              <Icon name="arrow" size={23} />
            </span>
            <span>ARC</span>
          </a>
          <span className="header-divider" />
          <label className="city-choice">
            <span className="sr-only">City workspace</span>
            <select
              aria-label="City workspace"
              value={window.ARC_CITY.id}
              onChange={(e) => {
                window.location.href =
                  "/?city=" + encodeURIComponent(e.target.value);
              }}
            >
              <option value="toronto">Toronto dispatch</option>
              <option value="seattle">Seattle dispatch</option>
            </select>
          </label>
        </header>
        <div className="workspace-utilities">
          <span
            className={`connection ${w.connected ? "" : "offline"}`}
            role="status"
          >
            <i />
            {w.connected
              ? "Workspace connected"
              : s
                ? "Connection lost"
                : "Connecting…"}
          </span>
          <time>{localTime(w.now)}</time>
          <button
            aria-label="Workspace controls"
            title="Workspace controls"
            onClick={() => open(panel === "controls" ? null : "controls")}
            aria-pressed={panel === "controls"}
          >
            <Icon name="settings" />
            <span>Workspace controls</span>
          </button>
          <button
            className="icon-button"
            aria-label="System details"
            title="System details"
            onClick={() => open(panel === "evidence" ? null : "evidence")}
          >
            <Icon name="more" />
          </button>
        </div>
        <nav className="workspace-nav" aria-label="Workspace panels">
          <button
            aria-expanded={inboxOpen}
            onClick={() => {
              setInboxOpen(!inboxOpen);
              if (mobile && !inboxOpen) setPanel(null);
            }}
          >
            <Icon name="inbox" />
            <span>Inbox</span>
            {!!counts && counts.approval + counts.input > 0 && (
              <b>{counts.approval + counts.input}</b>
            )}
          </button>
          <button
            id="show-selected"
            onClick={() => {
              setFeature(
                w.selected ? { kind: "incident", id: w.selected } : null,
              );
              open("feature");
            }}
          >
            <Icon name="pin" />
            <span>Selected case</span>
          </button>
          <button
            aria-pressed={panel === "resources"}
            onClick={() => open(panel === "resources" ? null : "resources")}
          >
            <Icon name="unit" />
            <span>Resources</span>
          </button>
          <button
            aria-pressed={panel === "context"}
            onClick={() => open(panel === "context" ? null : "context")}
          >
            <Icon name="layers" />
            <span>Layers</span>
          </button>
        </nav>
        {!w.connected && s && (
          <div className="connection-warning" role="alert">
            Connection lost. The displayed picture may be out of date; approvals
            are unavailable.
          </div>
        )}
        {s && inboxOpen && (!mobile || !panel) && (
          <Inbox
            bucket={queueBucket}
            setBucket={setQueueBucket}
            state={s}
            selected={w.selected}
            now={w.now}
            onSelect={openCase}
            onClose={() => setInboxOpen(false)}
          />
        )}
        {s && panel && (
          <FloatingPanel
            title={panelTitle}
            eyebrow={
              panel === "feature"
                ? featureLabels[currentFeature?.kind || "incident"]
                : panel === "context"
                  ? "OPERATIONAL PICTURE"
                  : panel === "resources"
                    ? "WORKSPACE AVAILABILITY"
                    : "ARC WORKSPACE"
            }
            className="detail-panel"
            collapsed={collapsed}
            onCollapse={() => {
              setCollapsed(!collapsed);
              if (picking) setPicking(null);
            }}
            onClose={closePanel}
            tools={
              panel === "feature" && item && hasPickup(item) ? (
                <>
                  <button
                    onClick={() =>
                      setFocus((previous) => ({
                        serial: previous.serial + 1,
                        mode:
                          currentFeature?.kind === "incident"
                            ? "selected"
                            : "feature",
                        point: item,
                      }))
                    }
                  >
                    <Icon name="focus" size={15} />
                    Zoom to
                  </button>
                  {currentFeature?.kind !== "incident" && (
                    <button onClick={() => openCase(w.selected!)}>
                      <Icon name="back" size={15} />
                      Back to case
                    </button>
                  )}
                </>
              ) : undefined
            }
          >
            {panel === "feature" &&
            currentFeature?.kind === "incident" &&
            incident ? (
              <CaseDetails
                key={s.epoch + incident.id}
                workspace={w}
                request={
                  instructions[incident.id] ??
                  "Assess available resources and explain the best feasible assignment."
                }
                setRequest={(request) =>
                  setInstructions((previous) => ({
                    ...previous,
                    [incident.id]: request,
                  }))
                }
                incident={incident}
                draft={drafts[incident.id]}
                setDraft={(d) => setDraft(incident.id, d)}
                picking={picking === incident.id}
                onPick={() => {
                  setPicking(picking ? null : incident.id);
                  if (!picking && mobile) setCollapsed(true);
                }}
                details={details}
                onDetail={onDetail}
              />
            ) : panel === "feature" && currentFeature ? (
              <FeatureDetails
                state={s}
                feature={currentFeature}
                onCase={openCase}
              />
            ) : panel === "resources" ? (
              <Resources
                state={s}
                onSelect={(f) => {
                  void selectFeature(f);
                  const point = resolveFeature(s, f);
                  if (point)
                    setFocus((previous) => ({
                      serial: previous.serial + 1,
                      mode: "feature",
                      point,
                    }));
                }}
              />
            ) : panel === "context" ? (
              <Context
                workspace={w}
                layers={layers}
                setLayers={setLayers}
                onSelect={(f) => {
                  void selectFeature(f);
                  const point = resolveFeature(s, f);
                  if (point)
                    setFocus((previous) => ({
                      serial: previous.serial + 1,
                      mode: "feature",
                      point,
                    }));
                }}
                onCase={openCase}
              />
            ) : panel === "controls" ? (
              <Controls workspace={w} onClose={closePanel} />
            ) : panel === "evidence" ? (
              <Evidence workspace={w} />
            ) : (
              <p className="quiet">
                Select a case on the map or in your inbox.
              </p>
            )}
          </FloatingPanel>
        )}
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
          <button
            className="resource-summary"
            onClick={() => open("resources")}
          >
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

        {w.toast && (
          <div className="toast" role="status" aria-live="polite">
            {w.toast}
          </div>
        )}
      </div>
    </main>
  );
}
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="fatal-error">
        <h1>ARC couldn’t display this workspace</h1>
        <p>Reload to reconnect to the current workspace.</p>
        <button onClick={() => window.location.reload()}>Reload ARC</button>
      </div>
    ) : (
      this.props.children
    );
  }
}
