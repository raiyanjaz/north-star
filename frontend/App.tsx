import { MapView } from "./features/map/MapView";
import { MapDock } from "./features/workspace/MapDock";
import { useWorkspaceLayout } from "./features/workspace/useWorkspaceLayout";
import { WorkspaceHeader } from "./features/workspace/WorkspaceHeader";
import { WorkspacePanels } from "./features/workspace/WorkspacePanels";
import { makeDraft } from "./policy";
import { useWorkspace } from "./useWorkspace";
export function App() {
  const w = useWorkspace(),
    layout = useWorkspaceLayout(w);
  const {
    s,
    inboxOpen,
    panel,
    setCollapsed,
    layers,
    focus,
    picking,
    setPicking,
    drafts,
    incident,
    currentFeature,
    selectFeature,
    setDraft,
    map,
  } = layout;
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
        <WorkspaceHeader workspace={w} layout={layout} />
        <WorkspacePanels workspace={w} layout={layout} />
        <MapDock workspace={w} layout={layout} />
        {w.toast && (
          <div className="toast" role="status" aria-live="polite">
            {w.toast}
          </div>
        )}
      </div>
    </main>
  );
}
