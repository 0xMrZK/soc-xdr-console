import { ActivitySquare, Clock3, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface PlatformHeaderProps {
    clusterStatus: "online" | "degraded" | "offline";
    currentTimestamp: string;
}

const clusterVariant = {
    online: "success",
    degraded: "warning",
    offline: "danger",
} as const;

export function PlatformHeader({
    clusterStatus,
    currentTimestamp,
}: PlatformHeaderProps) {
    return (
        <header className="relative overflow-hidden rounded-[28px] border border-cyan-500/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.92))] p-6 shadow-[0_0_80px_rgba(14,165,233,0.12)] sm:p-8">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(56,189,248,0.04),transparent)]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/8 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-300">
                        <Shield className="size-4" />
                        SOC / XDR Console
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl xl:text-5xl">
                            Mini Cyber Defense Platform
                        </h1>
                        <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                            Cloud-native SOC/XDR proof of concept running on k3s
                        </p>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
                        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                            <ActivitySquare className="size-4" />
                            Cluster status
                        </div>
                        <Badge variant={clusterVariant[clusterStatus]}>
                            {clusterStatus}
                        </Badge>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
                        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                            <Clock3 className="size-4" />
                            Current timestamp
                        </div>
                        <div className="text-sm font-medium text-slate-100">{currentTimestamp}</div>
                    </div>
                </div>
            </div>
        </header>
    );
}