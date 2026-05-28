import { ArrowUpRight } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { MetricCardModel } from "@/types/dashboard";

const toneStyles = {
    neutral: "from-slate-500/10 to-transparent text-slate-300",
    info: "from-sky-500/15 to-transparent text-sky-300",
    warning: "from-amber-500/15 to-transparent text-amber-300",
    critical: "from-rose-500/15 to-transparent text-rose-300",
} as const;

export function MetricCard({ metric }: { metric: MetricCardModel }) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-3">
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle className="text-3xl font-semibold">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1.5 text-xs uppercase tracking-[0.18em] ${toneStyles[metric.tone]}`}
                >
                    <ArrowUpRight className="size-3.5" />
                    {metric.delta}
                </div>
            </CardContent>
        </Card>
    );
}