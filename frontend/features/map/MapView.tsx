import type * as Leaflet from "leaflet";
import { useEffect, useRef } from "react";
import { hasPickup, proposalState, proposedUnits } from "../../policy";
import type {
  Feature,
  Layers,
  Location,
  Recommendation,
  Snapshot,
} from "../../types";
export interface MapFocus {
  serial: number;
  mode: "selected" | "overview" | "feature";
  point?: Location;
}
interface Props {
  state: Snapshot | null;
  rec: Recommendation | null;
  selected: string | null;
  feature: Feature | null;
  layers: Layers;
  focus: MapFocus;
  ready: boolean;
  picking: boolean;
  draftPoint: Location | null;
  onSelect: (feature: Feature) => void;
  onPick: (lat: number, lon: number) => void;
  onMapReady: (map: Leaflet.Map) => void;
  notify: (text: string) => void;
}
const esc = (s: string) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
function padding(map: Leaflet.Map): Leaflet.FitBoundsOptions {
  const size = map.getSize(),
    mobile = size.x <= 760;
  let left = 24,
    right = 24,
    bottom = 110;
  if (mobile) {
    const panel = document.querySelector(
      ".detail-panel:not([hidden]), .inbox-panel:not([hidden])",
    );
    if (panel) {
      const r = panel.getBoundingClientRect();
      bottom = size.y - r.top + 18;
    }
    return {
      paddingTopLeft: [24, 100],
      paddingBottomRight: [24, Math.min(bottom, size.y - 210)],
    };
  }
  for (const [selector, side] of [
    [".inbox-panel", "left"],
    [".detail-panel", "right"],
  ] as const) {
    const panel = document.querySelector(selector);
    if (panel) {
      const rect = panel.getBoundingClientRect();
      if (rect.width && rect.height) {
        if (side === "left") left = rect.right + 24;
        else right = size.x - rect.left + 24;
      }
    }
  }
  return {
    paddingTopLeft: [left, 100],
    paddingBottomRight: [right, bottom],
  };
}
export function MapView(props: Props) {
  const host = useRef<HTMLDivElement>(null),
    mapRef = useRef<Leaflet.Map | null>(null),
    latest = useRef(props),
    scene = useRef<Leaflet.LayerGroup | null>(null),
    draft = useRef<Leaflet.LayerGroup | null>(null),
    lastKey = useRef(""),
    lastFocus = useRef(-1);
  latest.current = props;
  useEffect(() => {
    const L = window.L,
      c = window.ARC_CITY,
      map = L.map(host.current!, {
        zoomControl: false,
        preferCanvas: false,
        minZoom: 10,
        maxZoom: 19,
        scrollWheelZoom: true,
      }).setView(c.center, c.zoom);
    mapRef.current = map;
    scene.current = L.layerGroup().addTo(map);
    draft.current = L.layerGroup().addTo(map);
    props.onMapReady(map);
    L.control
      .scale({ position: "bottomleft", imperial: false, maxWidth: 100 })
      .addTo(map);
    map.attributionControl.addAttribution(c.basemap_credit);
    map.createPane("cachedStreets");
    map.getPane("cachedStreets")!.style.zIndex = "150";
    map.getPane("cachedStreets")!.style.pointerEvents = "none";
    const fallback = L.layerGroup().addTo(map);
    let alive = true,
      cached = false,
      failed = false,
      ready = false,
      vector: Leaflet.Layer | undefined;
    const abort = new AbortController();
    const loadCached = () => {
      if (cached) return;
      cached = true;
      fetch("/" + c.basemap, { signal: abort.signal })
        .then((r) => r.json())
        .then((data) => {
          if (alive)
            L.geoJSON(data, {
              pane: "cachedStreets",
              interactive: false,
              style: (f) => ({
                color: "#fff",
                weight: String(f?.properties.class).includes("Arterial")
                  ? 5
                  : 2.5,
                opacity: 1,
              }),
            }).addTo(fallback);
        })
        .catch(() => {});
    };
    const tiles = L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    );
    const fallbackMap = () => {
      if (failed || !alive) return;
      failed = true;
      loadCached();
      map.getPane("cachedStreets")!.style.display = "";
      if (vector && map.hasLayer(vector)) map.removeLayer(vector);
      tiles.addTo(map);
    };
    try {
      const base = (
        L as typeof L & {
          maplibreGL: (options: {
            style: string;
            interactive: boolean;
          }) => Leaflet.Layer & {
            getMaplibreMap: () => {
              on: (event: string, cb: () => void) => void;
            };
          };
        }
      ).maplibreGL({
        style: "https://tiles.openfreemap.org/styles/positron",
        interactive: false,
      });
      vector = base;
      base.addTo(map);
      base.getMaplibreMap().on("load", () => {
        if (!alive || failed) return;
        ready = true;
        map.getPane("cachedStreets")!.style.display = "none";
      });
      base.getMaplibreMap().on("error", fallbackMap);
    } catch {
      fallbackMap();
    }
    const timer = setTimeout(() => {
        if (!ready) fallbackMap();
      }, 15000),
      cacheTimer = setTimeout(() => {
        if (!ready) loadCached();
      }, 1200);
    map.on("click", (e: Leaflet.LeafletMouseEvent) => {
      if (!latest.current.picking) return;
      const [south, west, north, east] = c.bounds;
      if (
        e.latlng.lat <= south ||
        e.latlng.lat >= north ||
        e.latlng.lng <= west ||
        e.latlng.lng >= east
      ) {
        latest.current.notify(
          "Choose a pickup within " + c.name + " coverage.",
        );
        return;
      }
      latest.current.onPick(e.latlng.lat, e.latlng.lng);
    });
    const resize = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    resize.observe(host.current!);
    return () => {
      alive = false;
      abort.abort();
      clearTimeout(timer);
      clearTimeout(cacheTimer);
      resize.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);
  useEffect(() => {
    const map = mapRef.current,
      s = props.state,
      r = props.rec;
    if (!map || !s || !scene.current) return;
    const current = s.incidents.find((i) => i.id === props.selected),
      status = proposalState(r, s.version, Date.now(), current),
      key = JSON.stringify([
        props.selected,
        props.feature,
        props.layers,
        r?.id,
        status,
        s.version,
        s.fleet,
        s.hospitals,
        s.incidents
          .filter(
            (i) =>
              (i.status === "open" || i.id === props.selected) && i.service,
          )
          .map((i) => [i.id, i.lat, i.lon, i.agent_state]),
        s.assignments.map((a) => [a.id, a.phase, a.hold_reason]),
        Object.entries(s.public_context).map(([k, v]) => [
          k,
          v.fetched_at,
          v.stale,
        ]),
      ]);
    if (lastKey.current === key) return;
    lastKey.current = key;
    scene.current.clearLayers();
    const L = window.L,
      group = scene.current,
      p = r?.selected,
      proposed = proposedUnits(s);
    const selected = (kind: Feature["kind"], id: string) =>
      props.feature?.kind === kind && props.feature.id === id;
    const interactive = (
      layer: Leaflet.Layer,
      feature: Feature,
      label: string,
    ) => {
      layer.on("click", (e: Leaflet.LeafletMouseEvent) => {
        if (latest.current.picking) return;
        L.DomEvent.stopPropagation(e.originalEvent);
        latest.current.onSelect(feature);
      });
      layer.addTo(group);
      const element = (layer as Leaflet.Path).getElement?.();
      if (element) {
        element.setAttribute("tabindex", "0");
        element.setAttribute("role", "button");
        element.setAttribute("aria-label", label);
        element.addEventListener("keydown", (event) => {
          const e = event as KeyboardEvent;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            latest.current.onSelect(feature);
          }
        });
      }
      return layer;
    };
    const marker = (
      item: Location & { id: string; name: string },
      kind: "unit" | "hospital",
      muted: boolean,
    ) => {
      if (!hasPickup(item)) return;
      const active = selected(kind, item.id);
      const mark = L.marker([item.lat, item.lon], {
        title: item.name,
        alt: item.name,
        icon: L.divIcon({
          className: "map-marker",
          html: `<div class="marker ${kind} ${muted ? "muted" : ""} ${active ? "active" : ""}">${kind === "hospital" ? "+" : "↗"}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        }),
      }).bindTooltip(esc(item.name));
      interactive(mark, { kind, id: item.id }, item.name);
    };
    s.hospitals
      .filter(
        (h) =>
          props.layers.resources ||
          h.id === p?.hospital_id ||
          selected("hospital", h.id),
      )
      .forEach((h) => marker(h, "hospital", !h.accepting || h.slots < 1));
    s.fleet
      .filter(
        (a) =>
          props.layers.resources ||
          a.id === p?.ambulance_id ||
          selected("unit", a.id),
      )
      .forEach((a) =>
        marker(a, "unit", a.status !== "available" && !proposed.has(a.id)),
      );
    s.incidents
      .filter(
        (i) =>
          (i.status === "open" || i.id === props.selected) &&
          hasPickup(i) &&
          (i.service || i.id === props.selected),
      )
      .forEach((i) => {
        if (!hasPickup(i)) return;
        const color =
          i.agent_state === "awaiting_approval"
            ? "#28785c"
            : i.agent_state === "working"
              ? "#315fb6"
              : "#9c7131";
        interactive(
          L.circleMarker([i.lat, i.lon], {
            radius: i.id === props.selected ? 10 : 7,
            color,
            weight: i.id === props.selected ? 3 : 2,
            fillColor: color,
            fillOpacity: i.id === props.selected ? 0.85 : 0.5,
          }).bindTooltip(esc(i.name), {
            permanent: i.id === props.selected,
            direction: "top",
            offset: [0, -10],
            className: "selected-map-label",
          }),
          { kind: "incident", id: i.id },
          i.name,
        );
      });
    s.closures.forEach((c, n) => {
      if (hasPickup(c))
        interactive(
          L.circle([c.lat, c.lon], {
            radius: c.radius_m,
            color: "#ac694b",
            fillOpacity: 0.15,
            weight: 2,
          }).bindTooltip(esc(c.name)),
          { kind: "closure", id: c.id || String(n) },
          c.name,
        );
    });
    const journey = s.assignments.find((a) => a.incident_id === props.selected),
      review =
        !!journey?.hold_reason ||
        (r?.decision === "pending" && status !== "ready");
    if (p)
      for (const [route, color] of [
        [p.pickup_route, "#255bd6"],
        [p.transport_route, "#16786b"],
      ] as const) {
        const points = route.coordinates.map(
          ([x, y]) => [y, x] as Leaflet.LatLngTuple,
        );
        L.polyline(points, {
          color: "#fff",
          weight: 8,
          opacity: 0.95,
          interactive: false,
        }).addTo(group);
        L.polyline(points, {
          color: review ? "#9a783a" : color,
          weight: 4.5,
          dashArray: review ? "6 6" : undefined,
          lineCap: "round",
          interactive: false,
        }).addTo(group);
      }
    const addPublic = (
      kind: "fire" | "police" | "roads" | "stations",
      color: string,
    ) => {
      let rows = s.public_context[kind]?.records || [];
      if (kind === "roads" && hasPickup(current)) {
        const distance = (item: Location) =>
          hasPickup(item)
            ? Math.hypot(
                (item.lat - current.lat) * 111,
                (item.lon - current.lon) * 80,
              )
            : Infinity;
        rows = [...rows].sort((a, b) => distance(a) - distance(b));
      }
      for (const item of rows.slice(0, kind === "roads" ? 100 : 500)) {
        if (!hasPickup(item)) continue;
        interactive(
          L.circleMarker([item.lat, item.lon], {
            radius: selected(kind, item.id) ? 8 : kind === "stations" ? 6 : 4,
            color,
            weight: selected(kind, item.id) ? 3 : 1,
            fillOpacity: 0.6,
          }).bindTooltip(esc(item.name)),
          { kind, id: item.id },
          item.name,
        );
      }
    };
    if (props.layers.calls) {
      addPublic("police", "#66718a");
      if (s.city.id === "seattle") addPublic("fire", "#66718a");
    }
    if (props.layers.roads) addPublic("roads", "#a4762f");
    if (props.layers.stations && s.city.id === "toronto")
      addPublic("stations", "#516e85");
    const traffic = s.public_context.traffic;
    if (
      (traffic?.mode === "live" && !traffic.stale) ||
      p?.transport_route.traffic_aware
    )
      map.attributionControl.addAttribution("© TomTom");
    if (props.layers.traffic && traffic?.mode === "live" && !traffic.stale)
      for (const item of traffic.records) {
        const points = (item.coordinates || [])
          .filter(
            (x): x is { latitude: number; longitude: number } =>
              !Array.isArray(x),
          )
          .map((c) => [c.latitude, c.longitude] as Leaflet.LatLngTuple);
        interactive(
          L.polyline(points, {
            color: item.closed
              ? "#a33f39"
              : (item.speed_kph || 0) < (item.free_flow_kph || 0) * 0.5
                ? "#c07928"
                : "#39816e",
            weight: 5,
            opacity: 0.65,
          }).bindTooltip(esc(item.speed_kph + " km/h observed · " + item.name)),
          { kind: "traffic", id: item.id },
          item.name,
        );
      }
  }, [props.state, props.rec, props.selected, props.feature, props.layers]);
  useEffect(() => {
    draft.current?.clearLayers();
    if (props.draftPoint && hasPickup(props.draftPoint))
      window.L.circleMarker([props.draftPoint.lat, props.draftPoint.lon], {
        radius: 7,
        color: "#3974cc",
        fillOpacity: 0.4,
      })
        .bindTooltip("Unsaved pickup", { permanent: true })
        .addTo(draft.current!);
  }, [props.draftPoint]);
  useEffect(() => {
    const map = mapRef.current,
      s = latest.current.state;
    if (!map || !s || !props.ready) return;
    if (lastFocus.current === props.focus.serial) return;
    lastFocus.current = props.focus.serial;
    const timer = requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
      const { rec, selected, focus } = latest.current,
        i = s.incidents.find((i) => i.id === selected);
      let points: Leaflet.LatLngTuple[] = [];
      if (focus.mode === "feature" && hasPickup(focus.point))
        points = [[focus.point.lat, focus.point.lon]];
      else if (focus.mode === "overview")
        points = [
          ...s.fleet,
          ...s.hospitals,
          ...s.incidents.filter((i) => i.status === "open" && i.service),
        ].flatMap((i) =>
          hasPickup(i) ? [[i.lat, i.lon] as Leaflet.LatLngTuple] : [],
        );
      else {
        if (hasPickup(i)) points.push([i.lat, i.lon]);
        if (rec?.selected)
          points.push(
            ...rec.selected.pickup_route.coordinates.map(
              ([x, y]) => [y, x] as Leaflet.LatLngTuple,
            ),
            ...rec.selected.transport_route.coordinates.map(
              ([x, y]) => [y, x] as Leaflet.LatLngTuple,
            ),
          );
      }
      if (!points.length) points = [s.city.center];
      map.fitBounds(points, {
        ...padding(map),
        maxZoom: focus.mode === "overview" ? 14 : points.length === 1 ? 15 : 15,
        animate: false,
      });
    });
    return () => cancelAnimationFrame(timer);
  }, [props.focus, props.ready]);
  return (
    <div
      id="map"
      ref={host}
      className={props.picking ? "choosing-pickup" : ""}
      aria-label={`${window.ARC_CITY.name} incident, unit and hospital map`}
    />
  );
}
