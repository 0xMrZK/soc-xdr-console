import { AlertTriangle, ShieldAlert, Siren, Waves } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Severity } from "@/types/dashboard";

const severityMap = {
    low: {
        label: "Low",
        variant: "info" as const,
        icon: Waves,
    },
    medium: {
        label: "Medium",
        variant: "warning" as const,
        icon: AlertTriangle,
    },
    high: {
        label: "High",
        variant: "warning" as const,
        icon: ShieldAlert,
    },
    critical: {
        label: "Critical",
        variant: "danger" as const,
        icon: Siren,
    },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
    const config = severityMap[severity];
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className="gap-1.5">
            <Icon className="size-3.5" />
            {config.label}
        </Badge>
    );
}