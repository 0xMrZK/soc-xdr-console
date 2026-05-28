"use client";

import { useEffect, useMemo, useState } from "react";

import { AgentCard } from "@/components/dashboard/agent-card";
import { IncidentSeverityChart } from "@/components/dashboard/incident-severity-chart";
import { IncidentsPanel } from "@/components/dashboard/incidents-panel";
import { LifecyclePanel } from "@/components/dashboard/lifecycle-panel";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PlatformHeader } from "@/components/dashboard/platform-header";
import { apiClient } from "@/services/api";
import type {
    AgentApiItem,
    AgentCardModel,
    AgentStatus,
    DashboardData,
    IncidentApiItem,
    LifecycleChannel,
    LifecycleResponse,
    MetricCardModel,
    Severity,
} from "@/types/dashboard";

const AGENT_BLUEPRINTS: Array<
    Pick<AgentCardModel, "id" | "name" | "subtitle" | "icon"> & {
        aliases: string[];
    }
> = [
        {
            id: "network-rust-agent",
            name: "Network Rust Agent",
            subtitle: "East-west traffic and protocol telemetry",
            icon: "network",
            aliases: ["network-rust-agent", "network", "rust"],
        },
        {
            id: "web-python-agent",
            name: "Web Detection Agent",
            subtitle: "HTTP threat detection and request analytics",
            icon: "globe",
            aliases: ["web-python-agent", "web", "http"],
        },
        {
            id: "xdr-python-agent",
            name: "XDR Endpoint Agent",
            subtitle: "Endpoint events, host behavior and XDR signals",
            icon: "shield",
            aliases: ["xdr-python-agent", "xdr", "endpoint"],
        },
    ];

function normalizeStatus(status: string): AgentStatus {
    if (status === "healthy") return "healthy";
    if (status === "degraded") return "degraded";
    if (status === "offline") return "offline";
    return "unknown";
}

function normalizeChannel(channel: string): LifecycleChannel {
    if (channel === "experimental" || channel === "stable" || channel === "lts") {
        return channel;
    }

    return "experimental";
}

function normalizeSeverity(severity?: string): Severity {
    if (
        severity === "low" ||
        severity === "medium" ||
        severity === "high" ||
        severity === "critical"
    ) {
        return severity;
    }

    return "low";
}

function matchAgent(agents: AgentApiItem[], aliases: string[]) {
    return agents.find((agent) => {
        const candidate = `${agent.agent_id} ${agent.agent_type}`.toLowerCase();
        return aliases.some((alias) => candidate.includes(alias));
    });
}

function formatRelativeOrAbsoluteTimestamp(value: string | null) {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(date);
}

function formatTimestamp(value: string) {
    return formatRelativeOrAbsoluteTimestamp(value) || value;
}

function buildAgentModels(items: AgentApiItem[]): AgentCardModel[] {
    return AGENT_BLUEPRINTS.map((blueprint) => {
        const agent = matchAgent(items, blueprint.aliases);

        return {
            id: blueprint.id,
            name: blueprint.name,
            subtitle: blueprint.subtitle,
            icon: blueprint.icon,
            status: agent ? normalizeStatus(agent.status) : "unknown",
            version: agent?.version || "Pending registration",
            lifecycleChannel: normalizeChannel(agent?.lts_channel || "experimental"),
            lastSeen: formatRelativeOrAbsoluteTimestamp(agent?.last_seen || null),
            riskScore: agent?.risk_score || 0,
            latestEvent: agent?.last_event || "Awaiting first signal from the cluster.",
            severity: normalizeSeverity(agent?.severity),
        };
    });
}

function buildMetrics(
    agents: AgentCardModel[],
    incidents: IncidentApiItem[],
): MetricCardModel[] {
    const activeAgents = agents.filter((agent) => agent.status === "healthy").length;
    const criticalAlerts = incidents.filter(
        (incident) => incident.severity === "critical",
    ).length;
    const averageRisk =
        agents.length > 0
            ? Math.round(
                agents.reduce((total, agent) => total + agent.riskScore, 0) / agents.length,
            )
            : 0;

    return [
        {
            label: "Active agents",
            value: String(activeAgents),
            delta: `${agents.length} registered nodes`,
            tone: "info",
        },
        {
            label: "Open incidents",
            value: String(incidents.length),
            delta: incidents.length > 0 ? "Requires analyst review" : "No backlog",
            tone: incidents.length > 0 ? "warning" : "neutral",
        },
        {
            label: "Critical alerts",
            value: String(criticalAlerts),
            delta: criticalAlerts > 0 ? "Escalate immediately" : "No escalation",
            tone: criticalAlerts > 0 ? "critical" : "neutral",
        },
        {
            label: "Average risk score",
            value: `${averageRisk}`,
            delta: averageRisk >= 70 ? "Elevated platform risk" : "Within expected range",
            tone: averageRisk >= 70 ? "critical" : averageRisk >= 40 ? "warning" : "info",
        },
    ];
}

function deriveClusterStatus(
    agents: AgentCardModel[],
    hasErrors: boolean,
): DashboardData["clusterStatus"] {
    if (hasErrors) return "offline";
    if (agents.some((agent) => agent.status === "degraded" || agent.status === "offline")) {
        return "degraded";
    }
    if (agents.some((agent) => agent.status === "healthy")) {
        return "online";
    }
    return "degraded";
}

function buildDashboardData(
    agentsResponse: AgentApiItem[],
    incidents: IncidentApiItem[],
    lifecycle: LifecycleResponse | null,
    hasErrors: boolean,
): DashboardData {
    const agents = buildAgentModels(agentsResponse);

    return {
        agents,
        incidents,
        lifecycle,
        metrics: buildMetrics(agents, incidents),
        clusterStatus: deriveClusterStatus(agents, hasErrors),
        lastUpdated: new Date().toISOString(),
    };
}

export function DashboardShell() {
    const [dashboard, setDashboard] = useState<DashboardData>(() =>
        buildDashboardData([], [], null, false),
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = window.setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        let active = true;

        async function loadDashboard() {
            try {
                const [agentsResponse, incidentsResponse, lifecycleResponse] = await Promise.all([
                    apiClient.getAgents(),
                    apiClient.getIncidents(),
                    apiClient.getLifecycle(),
                ]);

                if (!active) return;

                setDashboard(
                    buildDashboardData(
                        agentsResponse.items,
                        incidentsResponse.items,
                        lifecycleResponse,
                        false,
                    ),
                );
                setLastRefresh(new Date());
                setError(null);
            } catch (loadError) {
                if (!active) return;

                setDashboard(buildDashboardData([], [], null, true));
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Unable to load dashboard telemetry.",
                );
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        void loadDashboard();
        const interval = window.setInterval(() => {
            void loadDashboard();
        }, 5000);

        return () => {
            active = false;
            window.clearInterval(interval);
        };
    }, []);

    const timestamp = useMemo(
        () =>
            currentTime
                ? new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                }).format(currentTime)
                : "",
        [currentTime],
    );

    const lastRefreshStr = useMemo(() => {
        if (!lastRefresh) return null;
        return (
            new Intl.DateTimeFormat("en", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
                timeZone: "UTC",
            }).format(lastRefresh) + " UTC"
        );
    }, [lastRefresh]);

    const connectedAgents = dashboard.agents.filter((a) => a.status === "healthy").length;
    const totalAgents = dashboard.agents.length;

    return (
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(8,145,178,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.12),transparent_26%),#020617] text-slate-100">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.78)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.78)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.08]" />
            <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <PlatformHeader
                    clusterStatus={dashboard.clusterStatus}
                    currentTimestamp={timestamp}
                    totalAgents={totalAgents}
                    connectedAgents={connectedAgents}
                />

                {error ? (
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                        {error}. Ensure NEXT_PUBLIC_API_URL points to the manager API.
                    </div>
                ) : null}

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {dashboard.metrics.map((metric) => (
                        <MetricCard key={metric.label} metric={metric} />
                    ))}
                </section>

                <section className="space-y-4">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight text-white">
                                Detection agents
                            </h2>
                            <p className="text-sm text-slate-400">
                                Telemetry pipeline health across the Kubernetes security fabric
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                Polling every 5 seconds
                            </div>
                            {lastRefreshStr ? (
                                <div className="mt-1 text-xs text-slate-600">
                                    Last update: {lastRefreshStr}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="grid gap-4 xl:grid-cols-3">
                        {dashboard.agents.map((agent) => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
                    <IncidentsPanel
                        incidents={dashboard.incidents}
                        formatTimestamp={formatTimestamp}
                    />
                    <IncidentSeverityChart incidents={dashboard.incidents} />
                </section>

                <LifecyclePanel lifecycle={dashboard.lifecycle} />

                {loading ? (
                    <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/6 px-4 py-3 text-sm text-cyan-200">
                        Loading telemetry and lifecycle data...
                    </div>
                ) : null}

                <footer className="border-t border-white/5 pt-5 text-center text-[11px] uppercase tracking-[0.22em] text-slate-600">
                    AWS EC2 &bull; k3s &bull; Traefik &bull; Flask/Gunicorn &bull; Next.js 16 &bull; Rust &bull; Python
                </footer>
            </div>
        </div>
    );
}