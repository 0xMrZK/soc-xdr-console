import { Activity, CircleDashed, ShieldCheck, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { AgentStatus } from "@/types/dashboard";

const statusMap = {
    healthy: {
        label: "Healthy",
        variant: "success" as const,
        icon: ShieldCheck,
    },
    degraded: {
        label: "Degraded",
        variant: "warning" as const,
        icon: TriangleAlert,
    },
    offline: {
        label: "Offline",
        variant: "danger" as const,
        icon: CircleDashed,
    },
    unknown: {
        label: "Unknown",
        variant: "outline" as const,
        icon: Activity,
    },
};

export function StatusBadge({ status }: { status: AgentStatus }) {
    const config = statusMap[status];
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className="gap-1.5">
            <Icon className="size-3.5" />
            {config.label}
        </Badge>
    );
}