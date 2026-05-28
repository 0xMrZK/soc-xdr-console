import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors",
    {
        variants: {
            variant: {
                default: "border-white/10 bg-white/5 text-slate-200",
                outline: "border-white/15 bg-transparent text-slate-300",
                success: "border-emerald-500/30 bg-emerald-500/12 text-emerald-300",
                info: "border-sky-500/30 bg-sky-500/12 text-sky-300",
                warning: "border-amber-500/30 bg-amber-500/12 text-amber-300",
                danger: "border-rose-500/30 bg-rose-500/12 text-rose-300",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

export interface BadgeProps
    extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };