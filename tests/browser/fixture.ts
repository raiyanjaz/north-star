import type { Page } from "@playwright/test";
import type { Snapshot, Recommendation } from "../../frontend/types";
export function fixture() {
  const now = Date.now() / 1000,
    stamp = new Date().toISOString();
  const state: Snapshot = {
    epoch: "test-epoch",
    version: 4,
    city: {
      id: "toronto",
      name: "Toronto",
      timezone: "America/Toronto",
      center: [43.657, -79.387],
      bounds: [43.4, -80, 44, -79],
      zoom: 14,
      basemap: "toronto-map.geojson",
      basemap_credit: "City of Toronto centreline · cached extract",
    },
    scenario: "baseline",
    journey_speed: 10,
    incidents: [
      {
        id: "CASE-1",
        name: "King & Church",
        status: "open",
        priority: "Priority 1",
        service: "pediatric",
        equipment: "general",
        lat: 43.649,
        lon: -79.374,
        incident_revision: 2,
        received_at: stamp,
        prepared_intake: true,
        agent_state: "awaiting_approval",
        assessment_blockers: [],
      },
      {
        id: "CASE-2",
        name: "College & Spadina",
        status: "open",
        priority: "Priority 2",
        service: "neuro",
        equipment: "advanced",
        lat: 43.658,
        lon: -79.4003,
        incident_revision: 1,
        received_at: stamp,
        prepared_intake: true,
        agent_state: "queued",
        assessment_blockers: [],
      },
      {
        id: "REPORT-1",
        name: "Queen Street report",
        status: "open",
        lat: 43.653,
        lon: -79.38,
        incident_revision: 3,
        public_source: "Toronto Fire Services",
        public_kind: "fire",
        public_observed_at: stamp,
        public_location: "Queen Street",
        public_call_type: "Medical assist",
        public_feed_status: "current",
        agent_state: "watching",
        assessment_blockers: [
          "Choose a priority",
          "Choose a required service",
          "Choose required equipment",
        ],
      },
    ],
    fleet: [
      {
        id: "UNIT-1",
        name: "Medic 52",
        lat: 43.658,
        lon: -79.388,
        equipment: "general,advanced",
        status: "available",
        station_reference: {
          name: "Station 18",
          address: "643 Eglinton Ave W",
        },
      },
      {
        id: "UNIT-2",
        name: "Medic 24",
        lat: 43.645,
        lon: -79.395,
        equipment: "general,advanced",
        status: "available",
      },
    ],
    hospitals: [
      {
        id: "H-1",
        name: "SickKids",
        lat: 43.657,
        lon: -79.386,
        capabilities: "general,pediatric",
        accepting: 1,
        slots: 3,
      },
    ],
    assignments: [],
    closures: [],
    assessments: [],
    proposals: {
      "CASE-1": {
        decision: "pending",
        approvable: true,
        version: 4,
        ambulance_id: "UNIT-1",
      },
    },
    agent: {
      enabled: true,
      states: { "CASE-1": { state: "awaiting_approval" } },
      events: [],
    },
    public_context: {
      fire: {
        mode: "live",
        stale: false,
        fetched_at: stamp,
        records: [
          {
            id: "F-1",
            name: "Medical assist",
            location: "Queen Street",
            observed_at: stamp,
            lat: 43.653,
            lon: -79.38,
          },
        ],
      },
      roads: {
        mode: "live",
        fetched_at: stamp,
        records: [
          {
            id: "R-1",
            name: "Queen Street restriction",
            lat: 43.652,
            lon: -79.39,
            description: "Road work",
            updated_ms: String(Date.now()),
          },
        ],
      },
      stations: {
        mode: "live",
        fetched_at: stamp,
        records: [
          {
            id: "ST-18",
            name: "Station 18",
            address: "643 Eglinton Ave W",
            lat: 43.651,
            lon: -79.397,
          },
        ],
      },
      traffic: { mode: "live", fetched_at: stamp, records: [] },
    },
    public_roads: { mode: "live", records: [] },
    integrations: { zetaris: { status: "online", rows: 10 } },
  };
  const pair = {
    id: "UNIT-1:H-1",
    name: "Medic 52 → SickKids",
    type: "assignment",
    eligible: true,
    ambulance_id: "UNIT-1",
    hospital_id: "H-1",
    pickup_min: 2.8,
    transport_min: 9.6,
    reasons: ["These resources meet the confirmed requirements."],
    pickup_route: {
      coordinates: [
        [-79.388, 43.658],
        [-79.388, 43.649],
        [-79.374, 43.649],
      ] as [number, number][],
      mode: "live",
      source: "TomTom",
      traffic_aware: true,
    },
    transport_route: {
      coordinates: [
        [-79.374, 43.649],
        [-79.386, 43.649],
        [-79.386, 43.657],
      ] as [number, number][],
      mode: "live",
      source: "TomTom",
      traffic_aware: true,
    },
  };
  const rec: Recommendation = {
    id: "REC-1",
    incident_id: "CASE-1",
    simulation_epoch: state.epoch,
    version: 4,
    incident_revision: 2,
    decision: "pending",
    approvable: true,
    created_at: stamp,
    created_epoch: now,
    evidence_epoch: now,
    selected: pair,
    alternatives: [
      pair,
      {
        ...pair,
        id: "UNIT-2:H-1",
        name: "Medic 24 → SickKids",
        ambulance_id: "UNIT-2",
        pickup_min: 4.8,
      },
    ],
    evidence: [
      {
        id: "E1",
        text: "Medic 52 meets the required equipment and is available.",
      },
    ],
    explanation: { evidence_ids: ["E1"] },
    changes: [],
    trace: [
      { tool: "federate_resources", detail: "10 rows from three REST sources" },
    ],
    source_rows: { fleet: state.fleet, hospitals: state.hospitals },
    zetaris: { status: "online", rows: 10 },
    ai: { status: "online" },
  };
  return { state, rec };
}
export async function mockWorkspace(page: Page, city = "toronto") {
  const data = fixture(),
    requests: { path: string; body: Record<string, unknown> }[] = [],
    jobs: Record<string, unknown> = {};
  let offline = false;
  if (city === "seattle") {
    data.state.city = {
      ...data.state.city,
      id: "seattle",
      name: "Seattle",
      timezone: "America/Los_Angeles",
      center: [47.61, -122.333],
      bounds: [47.48, -122.46, 47.75, -122.23],
      zoom: 13,
      basemap: "seattle-map.geojson",
    };
  }
  await page.route("**/api/**", async (route) => {
    const url = new URL(route.request().url()),
      path = url.pathname;
    const body =
      route.request().method() === "POST" ? route.request().postDataJSON() : {};
    if (route.request().method() === "POST") requests.push({ path, body });
    if (offline)
      return route.fulfill({ status: 503, json: { error: "Offline test" } });
    let result: unknown = {};
    if (path === "/api/state") result = data.state;
    else if (path.startsWith("/api/recommendations/"))
      result =
        decodeURIComponent(path.split("/").pop()!) === data.rec.incident_id
          ? data.rec
          : null;
    else if (path === "/api/agent/control") {
      data.state.agent.enabled = body.enabled;
      result = { enabled: body.enabled };
    } else if (path === "/api/journeys/speed") {
      data.state.journey_speed = body.speed;
    } else if (path === "/api/decision") {
      if (
        data.rec.version !== data.state.version ||
        data.rec.incident_revision !==
          data.state.incidents[0].incident_revision ||
        Date.now() / 1000 - (data.rec.evidence_epoch || 0) > 120
      )
        return route.fulfill({
          status: 409,
          json: { error: "Plan changed. Reassess." },
        });
      data.rec.decision = body.action === "approve" ? "approved" : "rejected";
      result = data.rec;
      if (body.action === "approve") {
        data.state.incidents[0].status = "assigned";
        data.state.incidents[0].agent_state = "reserved";
        data.state.fleet[0].status = "assigned";
        data.state.hospitals[0].slots--;
        data.state.assignments.push({
          id: "ASSIGN-1",
          incident_id: "CASE-1",
          ambulance_id: "UNIT-1",
          hospital_id: "H-1",
          phase: "assigned",
          revision: 0,
          automatic: true,
          phase_ends_epoch: Date.now() / 1000 + 30,
          speed: 10,
          at: new Date().toISOString(),
          history: [{ phase: "assigned", at: new Date().toISOString() }],
        });
      }
    } else if (path === "/api/assignments/progress") {
      const a = data.state.assignments[0];
      a.phase = body.action === "cancel" ? "cancelled" : "responding";
      a.revision++;
      if (body.action === "cancel") {
        data.state.incidents[0].status = "cancelled";
        data.state.fleet[0].status = "available";
        data.state.hospitals[0].slots++;
      }
      result = a;
    } else if (path === "/api/incidents/details") {
      const i = data.state.incidents.find((i) => i.id === body.incident_id)!;
      if (body.revision !== i.incident_revision)
        return route.fulfill({
          status: 409,
          json: { error: "Incident changed. Reload current details." },
        });
      Object.assign(i, body, {
        lat: Number(body.lat),
        lon: Number(body.lon),
        requirements_source: "dispatcher",
        incident_revision: i.incident_revision! + 1,
        assessment_blockers: [],
      });
      result = i;
    } else if (path === "/api/scenario") {
      data.state.version++;
      data.state.scenario = body.name;
      result = data.state;
    } else if (path === "/api/agent/retry" || path === "/api/alternative") {
      const job = {
        id: "JOB-1",
        incident_id: body.incident_id || data.rec.incident_id,
        simulation_epoch: data.state.epoch,
        status: "running",
        stage: "Planning evidence tools",
        automatic: false,
      };
      jobs["JOB-1"] = job;
      data.state.assessments = [job];
      result = job;
    } else if (path.startsWith("/api/jobs/"))
      result = jobs[path.split("/").pop()!] || {
        status: "done",
        simulation_epoch: data.state.epoch,
        result: data.rec,
      };
    else if (path === "/api/world")
      result = { entities: [{ id: "entity-1" }], events: [] };
    else if (path === "/api/demo/intake") result = { loaded: false };
    else if (path === "/api/roads/refresh") result = data.state.public_roads;
    else if (path === "/api/reset") {
      const fresh = fixture();
      data.state = { ...fresh.state, epoch: "reset-epoch" };
      data.rec = { ...fresh.rec, simulation_epoch: "reset-epoch" };
    } else
      return route.fulfill({
        status: 404,
        json: { error: "Unhandled test API " + path },
      });
    await route.fulfill({ json: result });
  });
  await page.goto("/?city=" + city);
  await page.getByRole("button", { name: "Pause agent" }).waitFor();
  return {
    ...data,
    requests,
    setOffline: (value: boolean) => {
      offline = value;
    },
    finishJob: (incident = "CASE-1") => {
      jobs["JOB-1"] = {
        id: "JOB-1",
        status: "done",
        incident_id: incident,
        simulation_epoch: data.state.epoch,
        result: { ...data.rec, incident_id: incident },
      };
      data.state.assessments = [];
    },
  };
}
