"use client";

import { useEffect, useState } from "react";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { IncidentApiItem, Severity } from "@/types/dashboard";

const severityOrder: Severity[] = ["low", "medium", "high", "critical"];

const colors: Record<Severity, string> = {
    low: "#38bdf8",
    medium: "#facc15",
    high: "#fb923c",
    critical: "#f43f5e",
};

export function IncidentSeverityChart({ incidents }: { incidents: IncidentApiItem[] }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const data = severityOrder.map((severity) => ({
        severity,
        count: incidents.filter((incident) => incident.severity === severity).length,
    }));

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-base">Alert distribution</CardTitle>
                <CardDescription>Severity mix across the current incident window</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px] pt-2">
                {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                            <XAxis
                                dataKey="severity"
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                {data.map((entry) => (
                                    <Cell key={entry.severity} fill={colors[entry.severity]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full animate-pulse rounded-2xl border border-white/8 bg-white/5" />
                )}
            </CardContent>
        </Card>
    );
}