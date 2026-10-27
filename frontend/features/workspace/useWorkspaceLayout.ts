import type { Map as LeafletMap } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { resolveFeature } from "../map/features";
import { type MapFocus } from "../map/MapView";
import { inboxGroup, proposalState, proposedUnits } from "../../policy";
import type { Feature, IntakeDraft, Layers } from "../../types";

import type { Workspace } from "../../useWorkspace";
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
export function useWorkspaceLayout(w: Workspace) {
  const s = w.state,
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
  return {
    s,
    mobile,
    inboxOpen,
    setInboxOpen,
    queueBucket,
    setQueueBucket,
    instructions,
    setInstructions,
    panel,
    setPanel,
    feature,
    setFeature,
    collapsed,
    setCollapsed,
    layers,
    setLayers,
    focus,
    setFocus,
    picking,
    setPicking,
    drafts,
    incident,
    currentFeature,
    item,
    open,
    selectFeature,
    openCase,
    closePanel,
    setDraft,
    details,
    onDetail,
    counts,
    free,
    busyIncident,
    status,
    reviewing,
    panelTitle,
    map,
  };
}
export type WorkspaceLayout = ReturnType<typeof useWorkspaceLayout>;
