import { useEffect, useState } from "react";
import { api } from "../../api";
import type { Workspace } from "../../useWorkspace";
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
