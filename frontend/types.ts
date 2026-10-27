export interface City {
  id: string;
  name: string;
  timezone: string;
  center: [number, number];
  bounds: [number, number, number, number];
  zoom: number;
  basemap: string;
  basemap_credit: string;
}
export interface Location {
  lat: number | null;
  lon: number | null;
}
export interface Incident extends Location {
  id: string;
  name: string;
  status: string;
  priority?: string;
  service?: string;
  equipment?: string;
  received_at?: string;
  incident_revision?: number;
  assessment_blockers?: string[];
  agent_state?: string;
  agent_reason?: string;
  public_source?: string;
  public_kind?: string;
  public_observed_at?: string;
  public_location?: string;
  public_call_type?: string;
  public_feed_status?: string;
  public_units?: string;
  public_alarm_level?: number;
  requirements_source?: string;
  prepared_intake?: boolean;
  public_reference?: { public_call_type?: string; public_location?: string };
  pickup_source?: string;
  pickup_label?: string;
  notes?: string;
}
export interface Unit extends Location {
  id: string;
  name: string;
  equipment: string;
  status: string;
  active_assignment_id?: string;
  station_reference?: { name: string; address: string };
}
export interface Hospital extends Location {
  id: string;
  name: string;
  capabilities: string;
  accepting: number;
  slots: number;
}
export interface Closure extends Location {
  id?: string;
  name: string;
  radius_m: number;
}
export interface Assignment {
  id: string;
  incident_id: string;
  ambulance_id: string;
  hospital_id: string;
  phase: string;
  revision: number;
  automatic: boolean;
  hold_reason?: string;
  completed_at?: string;
  phase_ends_epoch: number | null;
  speed?: number;
  at: string;
  history: { phase: string; at: string }[];
}
export interface Route {
  coordinates: [number, number][];
  mode: string;
  source: string;
  traffic_aware?: boolean;
}
export interface Pair {
  id: string;
  name: string;
  type: string;
  eligible: boolean;
  ambulance_id: string;
  hospital_id: string;
  pickup_min: number;
  transport_min: number;
  reasons: string[];
  pickup_route: Route;
  transport_route: Route;
}
export interface Recommendation {
  id: string;
  incident_id: string;
  simulation_epoch: string;
  version: number;
  incident_revision?: number;
  decision: string;
  approvable: boolean;
  created_at: string;
  created_epoch: number;
  evidence_epoch?: number;
  selected: Pair | null;
  alternatives: Pair[];
  evidence: { id: string; text: string }[];
  explanation: { evidence_ids: string[] };
  changes: { text: string }[];
  trace: { tool: string; detail: string }[];
  source_rows: {
    fleet: Unit[];
    hospitals: Hospital[];
    [key: string]: unknown[];
  };
  zetaris?: unknown;
  ai?: unknown;
}
export interface Job {
  id: string;
  incident_id: string;
  simulation_epoch: string;
  status: string;
  stage?: string;
  error?: string;
  automatic?: boolean;
  trigger?: string;
  result?: Recommendation;
}
export interface PublicRecord extends Location {
  id: string;
  name: string;
  location?: string;
  address?: string;
  observed_at?: string;
  units?: string;
  description?: string;
  updated_ms?: string;
  wait_min?: number | null;
  patients_waiting?: number;
  speed_kph?: number;
  free_flow_kph?: number;
  closed?: boolean;
  confidence?: number;
  coordinates?: ({ latitude: number; longitude: number } | [number, number])[];
}
export interface PublicSource {
  mode?: string;
  stale?: boolean;
  fetched_at?: string;
  observed_at?: string;
  error?: string;
  note?: string;
  source_url?: string;
  records: PublicRecord[];
}
export interface Snapshot {
  epoch: string;
  version: number;
  incidents: Incident[];
  fleet: Unit[];
  hospitals: Hospital[];
  assignments: Assignment[];
  closures: Closure[];
  assessments: Job[];
  proposals: Record<
    string,
    {
      decision: string;
      approvable: boolean;
      version: number;
      ambulance_id?: string;
    }
  >;
  agent: {
    enabled: boolean;
    error?: string;
    states: Record<string, { state: string }>;
    events: { incident_id?: string; text: string; at: string }[];
  };
  journey_speed?: number;
  scenario: string;
  feed_stale?: boolean;
  zetaris_offline?: boolean;
  ai_offline?: boolean;
  public_context: Record<string, PublicSource>;
  public_roads: PublicSource;
  integrations: { zetaris?: unknown };
  city: City;
}
export type Feature = {
  kind:
    | "unit"
    | "hospital"
    | "incident"
    | "closure"
    | "fire"
    | "police"
    | "roads"
    | "traffic"
    | "stations";
  id: string;
};
export interface Layers {
  resources: boolean;
  calls: boolean;
  roads: boolean;
  traffic: boolean;
  stations: boolean;
}
export interface IntakeDraft {
  priority: string;
  service: string;
  equipment: string;
  lat: string;
  lon: string;
  pickup_label: string;
  notes: string;
  revision: number;
}
declare global {
  interface Window {
    ARC_CITY: City;
    ARC_INITIAL_STATE?: Promise<Snapshot | null>;
    L: typeof import("leaflet");
  }
}
