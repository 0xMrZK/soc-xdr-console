import { CalendarClock, Layers3, ShieldCheck } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { LifecycleResponse } from "@/types/dashboard";

interface LifecyclePanelProps {
    lifecycle: LifecycleResponse | null;
}

export function LifecyclePanel({ lifecycle }: LifecyclePanelProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Lifecycle and LTS posture</CardTitle>
                <CardDescription>
                    {lifecycle?.strategy || "Detection agent release channels and support policy"}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-3">
                {(lifecycle?.channels || []).map((channel) => {
                    const version = lifecycle?.versions.find(
                        (entry) => entry.channel === channel.name,
                    );

                    return (
                        <div
                            key={channel.name}
                            className="rounded-2xl border border-white/8 bg-white/4 p-5"
                        >
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 text-cyan-300">
                                        <Layers3 className="size-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                                            {channel.name}
                                        </div>
                                        <div className="text-xs text-slate-400">{version?.version || "TBD"}</div>
                                    </div>
                                </div>
                                <ShieldCheck className="size-4 text-emerald-400" />
                            </div>
                            <p className="mb-4 text-sm leading-6 text-slate-300">
                                {channel.description}
                            </p>
                            <div className="space-y-3 text-sm">
                                <Row label="Support strategy" value={channel.support} />
                                <Row label="End of life" value={version?.eol || "Not scheduled"} />
                                <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-3 text-slate-300">
                                    <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                        <CalendarClock className="size-3.5" />
                                        Release status
                                    </div>
                                    <div>{version?.status || "Planned"}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-3">
            <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                {label}
            </div>
            <div className="leading-6 text-slate-100">{value}</div>
        </div>
    );
}