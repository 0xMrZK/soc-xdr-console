import {
    Activity,
    Globe,
    Network,
    Shield,
    Sparkles,
} from "lucide-react";

import { StatusBadge } from "@/components/dashboard/status-badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { AgentCardModel } from "@/types/dashboard";

const iconMap = {
    network: Network,
    globe: Globe,
    shield: Shield,
} as const;

export function AgentCard({ agent }: { agent: AgentCardModel }) {
    const Icon = iconMap[agent.icon];

    return (
        <Card className="h-full transition-transform duration-300 hover:-translate-y-1">
            <CardHeader className="gap-4 border-b border-white/5 pb-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
                            <Icon className="size-6" />
                        </div>
                        <div>
                            <CardTitle className="text-base">{agent.name}</CardTitle>
                            <CardDescription>{agent.subtitle}</CardDescription>
                        </div>
                    </div>
                    <StatusBadge status={agent.status} />
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <DataPoint label="Version" value={agent.version} />
                    <DataPoint label="Channel" value={agent.lifecycleChannel} />
                    <DataPoint label="Last seen" value={agent.lastSeen ?? "Awaiting telemetry"} />
                    <DataPoint label="Risk score" value={`${agent.riskScore}/100`} />
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                        <Sparkles className="size-3.5" />
                        Latest event
                    </div>
                    <p className="text-sm leading-6 text-slate-200">
                        {agent.latestEvent || "No high-fidelity event received yet."}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500"
                            style={{ width: `${Math.min(agent.riskScore, 100)}%` }}
                        />
                    </div>
                    <div className="flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                        <Activity className="size-3.5" />
                        Risk
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function DataPoint({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-3">
            <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                {label}
            </div>
            <div className="text-sm font-medium text-slate-100">{value}</div>
        </div>
    );
}