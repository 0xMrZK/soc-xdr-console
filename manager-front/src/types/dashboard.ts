export type Severity = "low" | "medium" | "high" | "critical";

export type AgentStatus = "healthy" | "degraded" | "offline" | "unknown";

export type LifecycleChannel = "experimental" | "stable" | "lts";

export interface AgentApiItem {
  agent_id: string;
  agent_type: string;
  status: string;
  version: string;
  lts_channel: string;
  last_seen: string;
  last_event: string;
  risk_score: number;
  severity: Severity;
}

export interface AgentsResponse {
  count: number;
  items: AgentApiItem[];
}

export interface IncidentApiItem {
  id: string;
  created_at: string;
  source_agent: string;
  severity: Severity;
  risk_score: number;
  event_type: string;
  message: string;
  asset?: string | null;
  mitre_attack_technique?: string | null;
  recommended_action?: string | null;
  status: string;
}

export interface IncidentsResponse {
  count: number;
  items: IncidentApiItem[];
}

export interface LifecycleChannelItem {
  name: LifecycleChannel;
  description: string;
  support: string;
}

export interface LifecycleVersionItem {
  version: string;
  channel: LifecycleChannel;
  status: string;
  eol: string;
}

export interface LifecycleResponse {
  strategy: string;
  channels: LifecycleChannelItem[];
  versions: LifecycleVersionItem[];
}

export interface AgentCardModel {
  id: string;
  name: string;
  subtitle: string;
  icon: "network" | "globe" | "shield";
  status: AgentStatus;
  version: string;
  lifecycleChannel: LifecycleChannel;
  lastSeen: string | null;
  riskScore: number;
  latestEvent: string;
  severity: Severity;
}

export interface MetricCardModel {
  label: string;
  value: string;
  delta: string;
  tone: "neutral" | "info" | "warning" | "critical";
}

export interface DashboardData {
  agents: AgentCardModel[];
  incidents: IncidentApiItem[];
  lifecycle: LifecycleResponse | null;
  metrics: MetricCardModel[];
  clusterStatus: "online" | "degraded" | "offline";
  lastUpdated: string;
}