"use client";

import { useState } from "react";
import {
    CheckCheck,
    ShieldAlert,
    ShieldEllipsis,
    Siren,
    TerminalSquare,
} from "lucide-react";

import { SeverityBadge } from "@/components/dashboard/severity-badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { IncidentApiItem } from "@/types/dashboard";

interface IncidentsPanelProps {
    incidents: IncidentApiItem[];
    formatTimestamp: (value: string) => string;
}

const MAX_INCIDENTS = 10;

export function IncidentsPanel({
    incidents,
    formatTimestamp,
}: IncidentsPanelProps) {
    const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set());

    const visibleIncidents = incidents
        .filter((inc) => !acknowledgedIds.has(inc.id))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, MAX_INCIDENTS);

    function acknowledge(id: string) {
        setAcknowledgedIds((prev) => new Set([...prev, id]));
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="border-b border-white/5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-base">Incident feed</CardTitle>
                        <CardDescription>
                            Live incident view aligned to SOC response workflows
                        </CardDescription>
                    </div>
                    <div className="hidden items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-rose-300 sm:flex">
                        <ShieldAlert className="size-3.5" />
                        Priority triage
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {visibleIncidents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center text-slate-400">
                        <ShieldEllipsis className="size-10 text-slate-600" />
                        <div>
                            <div className="text-sm font-medium text-slate-200">No open incidents</div>
                            <div className="mt-1 text-sm text-slate-400">
                                Detection agents have not emitted high or critical events yet.
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="border-b border-white/5 px-6 py-2.5">
                            <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                Displaying last {visibleIncidents.length} events
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/5 text-left text-sm">
                                <thead className="bg-white/3 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Severity</th>
                                        <th className="px-6 py-4 font-medium">Timestamp</th>
                                        <th className="px-6 py-4 font-medium">MITRE ATT&CK</th>
                                        <th className="px-6 py-4 font-medium">Message</th>
                                        <th className="px-6 py-4 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {visibleIncidents.map((incident) => {
                                        const isCritical = incident.severity === "critical";

                                        return (
                                            <tr
                                                key={incident.id}
                                                className={isCritical ? "bg-rose-500/6" : "bg-transparent"}
                                            >
                                                <td className="px-6 py-5 align-top">
                                                    <SeverityBadge severity={incident.severity} />
                                                    <div className="mt-1.5 text-xs text-slate-400">{incident.source_agent}</div>
                                                </td>
                                                <td className="px-6 py-5 align-top text-slate-400">
                                                    <div className="text-xs leading-5">
                                                        {new Intl.DateTimeFormat("en", { month: "short", day: "2-digit" }).format(new Date(incident.created_at))}
                                                    </div>
                                                    <div className="text-xs leading-5">
                                                        {new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(incident.created_at))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 align-top text-slate-300">
                                                    {incident.mitre_attack_technique || "Not mapped"}
                                                </td>
                                                <td className="max-w-sm px-6 py-5 align-top">
                                                    <div className="flex gap-3">
                                                        {isCritical ? (
                                                            <Siren className="mt-0.5 size-4 shrink-0 text-rose-400" />
                                                        ) : (
                                                            <TerminalSquare className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                                                        )}
                                                        <span className="leading-6 text-slate-200">
                                                            {incident.message || "Telemetry event without message"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-5 align-top">
                                                    <button
                                                        onClick={() => acknowledge(incident.id)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300"
                                                    >
                                                        <CheckCheck className="size-3.5" />
                                                        Acknowledge
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}