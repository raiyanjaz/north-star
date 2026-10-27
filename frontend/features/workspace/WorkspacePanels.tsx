import { FloatingPanel } from "../../components/FloatingPanel";
import { Icon } from "../../components/Icon";
import { CaseDetails } from "../cases/CaseDetails";
import { Context } from "../context/Context";
import { Inbox } from "../inbox/Inbox";
import { FeatureDetails } from "../map/FeatureDetails";
import { featureLabels, resolveFeature } from "../map/features";
import { Resources } from "../resources/Resources";
import { Controls } from "./Controls";
import { Evidence } from "./Evidence";
import { hasPickup } from "../../policy";

import type { Workspace } from "../../useWorkspace";
import type { WorkspaceLayout } from "./useWorkspaceLayout";
export function WorkspacePanels({
  workspace: w,
  layout,
}: {
  workspace: Workspace;
  layout: WorkspaceLayout;
}) {
  const {
    s,
    mobile,
    inboxOpen,
    setInboxOpen,
    queueBucket,
    setQueueBucket,
    instructions,
    setInstructions,
    panel,
    collapsed,
    setCollapsed,
    layers,
    setLayers,
    setFocus,
    picking,
    setPicking,
    drafts,
    incident,
    currentFeature,
    item,
    selectFeature,
    openCase,
    closePanel,
    setDraft,
    details,
    onDetail,
    panelTitle,
  } = layout;
  return (
    <>
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
            <p className="quiet">Select a case on the map or in your inbox.</p>
          )}
        </FloatingPanel>
      )}
    </>
  );
}
