import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card"
            className={cn(
                "rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.96),rgba(7,12,24,0.92))] text-card-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_18px_50px_rgba(2,8,23,0.45)] backdrop-blur-xl",
                className,
            )}
            {...props}
        />
    );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-header"
            className={cn("flex flex-col gap-1.5 p-6", className)}
            {...props}
        />
    );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-title"
            className={cn("text-sm font-semibold tracking-wide text-white", className)}
            {...props}
        />
    );
}

function CardDescription({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-description"
            className={cn("text-sm text-slate-400", className)}
            {...props}
        />
    );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-content"
            className={cn("px-6 pb-6", className)}
            {...props}
        />
    );
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle };