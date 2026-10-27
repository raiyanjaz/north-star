import { useCallback, useEffect, useRef, useState } from "react";
import { api, storageKey } from "./api";
import { defaultInboxSelection } from "./policy";
import type { Job, Recommendation, Snapshot } from "./types";
export function useWorkspace() {
  const [state, setState] = useState<Snapshot | null>(null),
    [selected, setSelected] = useState<string | null>(() =>
      sessionStorage.getItem(storageKey("arc.selected")),
    ),
    [records, setRecords] = useState<Record<string, Recommendation>>({}),
    [connected, setConnected] = useState(false),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [job, setJob] = useState<Job | null>(null),
    [busy, setBusy] = useState(false),
    [toast, setToast] = useState(""),
    [now, setNow] = useState(Date.now()),
    [activities, setActivities] = useState<{ text: string; at: string }[]>([]);
  const refs = useRef({
    selected,
    epoch: "",
    sequence: 0,
    first: true,
    alive: true,
    controller: new AbortController(),
  });
  const notify = useCallback((message: string) => setToast(message), []);
  const log = useCallback(
    (text: string) =>
      setActivities((a) =>
        [{ text, at: new Date().toISOString() }, ...a].slice(0, 7),
      ),
    [],
  );
  const refresh = useCallback(async () => {
    const ctx = refs.current,
      sequence = ++ctx.sequence;
    try {
      const initial = window.ARC_INITIAL_STATE;
      window.ARC_INITIAL_STATE = undefined;
      const next =
        (initial ? await initial : null) ||
        (await api<Snapshot>("/api/state", undefined, ctx.controller.signal));
      if (!ctx.alive || sequence !== ctx.sequence) return;
      if (ctx.epoch && ctx.epoch !== next.epoch) {
        setRecords({});
        setErrors({});
        setJob(null);
        setActivities([]);
      }
      ctx.epoch = next.epoch;
      let target = ctx.selected;
      if (ctx.first || !next.incidents.some((i) => i.id === target))
        target = defaultInboxSelection(next.incidents, target);
      ctx.first = false;
      ctx.selected = target;
      setSelected(target);
      setState(next);
      if (target) {
        const recommendation = await api<Recommendation | null>(
          "/api/recommendations/" + encodeURIComponent(target),
          undefined,
          ctx.controller.signal,
        );
        if (!ctx.alive || sequence !== ctx.sequence) return;
        setRecords((previous) => {
          const copy = { ...previous };
          if (recommendation?.simulation_epoch === next.epoch)
            copy[target!] = recommendation;
          else delete copy[target!];
          return copy;
        });
      }
      setConnected(true);
    } catch (e) {
      if (
        ctx.alive &&
        sequence === ctx.sequence &&
        !(e instanceof DOMException && e.name === "AbortError")
      )
        setConnected(false);
    }
  }, []);
  const select = useCallback(
    (id: string) => {
      refs.current.selected = id;
      setSelected(id);
      sessionStorage.setItem(storageKey("arc.selected"), id);
      return refresh();
    },
    [refresh],
  );
  useEffect(() => {
    const ctx = refs.current;
    ctx.alive = true;
    ctx.controller = new AbortController();
    let poll: ReturnType<typeof setTimeout>;
    const pollState = async () => {
      await refresh();
      if (ctx.alive) poll = setTimeout(pollState, 2000);
    };
    void pollState();
    const clock = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      ctx.alive = false;
      ctx.sequence++;
      ctx.controller.abort();
      clearTimeout(poll);
      clearInterval(clock);
    };
  }, [refresh]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(timer);
  }, [toast]);
  const running = job || state?.assessments?.[0] || null;
  useEffect(() => {
    if (!running) return;
    setErrors((previous) =>
      previous[running.incident_id]
        ? { ...previous, [running.incident_id]: "" }
        : previous,
    );
    let cancelled = false;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    const check = async () => {
      try {
        const result = await api<Job>(
          "/api/jobs/" + running.id,
          undefined,
          controller.signal,
        );
        if (cancelled) return;
        if (result.status === "running") {
          setJob(result);
          timer = setTimeout(check, 850);
          return;
        }
        setJob(null);
        if (result.simulation_epoch !== refs.current.epoch) return;
        if (result.result) {
          setRecords((r) => ({ ...r, [result.incident_id]: result.result! }));
          setErrors((previous) =>
            previous[result.incident_id]
              ? { ...previous, [result.incident_id]: "" }
              : previous,
          );
          if (
            result.incident_id !== refs.current.selected &&
            (!result.automatic ||
              result.trigger === "new incident" ||
              result.result.changes.some((change) =>
                /^(Assignment revised|Route estimates changed)/.test(
                  change.text,
                ),
              ))
          ) {
            notify(
              result.incident_id +
                (result.result.approvable
                  ? " · plan ready for approval"
                  : " · assessment needs attention"),
            );
          }
          if (!result.automatic)
            log(result.incident_id + " · assessment complete");
        }
        if (result.status === "error" && !result.automatic)
          setErrors((e) => ({
            ...e,
            [result.incident_id]: result.error || "Assessment failed",
          }));
        await refresh();
      } catch (e) {
        if (!cancelled) {
          void refresh();
          timer = setTimeout(check, 1500);
        }
      }
    };
    timer = setTimeout(check, 850);
    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [running?.id, refresh, log, notify]);
  const mutate = useCallback(
    async <T>(path: string, body: unknown, message?: string): Promise<T> => {
      setBusy(true);
      try {
        const result = await api<T>(path, body);
        await refresh();
        if (message) {
          notify(message);
          log(message);
        }
        return result;
      } catch (e) {
        await refresh();
        notify(e instanceof Error ? e.message : "Request failed");
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [refresh, notify, log],
  );
  const assess = async (
    pairId?: string,
    request = "Assess available resources and explain the best feasible assignment.",
  ) => {
    if (!selected || running || busy || !connected) return;
    const id = selected,
      rec = records[id];
    setErrors((e) => ({ ...e, [id]: "" }));
    setBusy(true);
    try {
      const next = await api<Job>(
        pairId ? "/api/alternative" : "/api/agent/retry",
        pairId
          ? { recommendation_id: rec.id, pair_id: pairId }
          : { incident_id: id, request },
      );
      setJob(next);
      log(id + " · assessment started");
    } catch (e) {
      setErrors((previous) => ({
        ...previous,
        [id]: e instanceof Error ? e.message : "Assessment unavailable",
      }));
    } finally {
      setBusy(false);
    }
  };
  const decide = async (action: string) => {
    if (!selected || busy || !connected) return;
    const current = records[selected];
    try {
      const result = await mutate<Recommendation>(
        "/api/decision",
        { id: current.id, action },
        action === "approve" ? "Assignment reserved." : "Plan rejected.",
      );
      setRecords((previous) => ({
        ...previous,
        [current.incident_id]: result,
      }));
    } catch (e) {
      setErrors((previous) => ({
        ...previous,
        [current.incident_id]:
          e instanceof Error ? e.message : "Decision failed",
      }));
    }
  };
  return {
    state,
    selected,
    select,
    rec: selected ? records[selected] || null : null,
    connected,
    errors,
    job: running,
    busy,
    toast,
    now,
    activities,
    notify,
    refresh,
    mutate,
    assess,
    decide,
  };
}
export type Workspace = ReturnType<typeof useWorkspace>;
