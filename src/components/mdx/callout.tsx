import * as React from "react";
import { AlertTriangle, Info, OctagonAlert } from "lucide-react";

import { cn } from "@/lib/utils";

const VARIANTS = {
  info: { icon: Info, className: "border-border bg-muted/40" },
  warning: {
    icon: AlertTriangle,
    className: "border-amber-500/40 bg-amber-500/5",
  },
  error: {
    icon: OctagonAlert,
    className: "border-destructive/40 bg-destructive/5",
  },
} as const;

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: keyof typeof VARIANTS;
  title?: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, className } = VARIANTS[type];

  return (
    <div
      role="note"
      className={cn(
        "my-6 flex gap-3 rounded-xl border p-4 text-sm [&_p]:m-0 [&_p]:leading-relaxed",
        className
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 space-y-1">
        {title && <p className="font-medium">{title}</p>}
        {children}
      </div>
    </div>
  );
}
