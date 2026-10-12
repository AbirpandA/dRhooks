import Link from "next/link";

import { cn } from "@/lib/utils";

/** Typographic wordmark: mono `dR`, a muted slash, then `hooks` in the sans face. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="dRhooks home"
      className={cn("group inline-flex items-baseline text-lg", className)}
    >
      <span className="font-mono font-bold tracking-tighter">dR</span>
      <span
        aria-hidden
        className="text-muted-foreground/50 group-hover:text-foreground mx-px font-mono font-light transition-colors"
      >
        /
      </span>
      <span className="font-medium tracking-tight">hooks</span>
    </Link>
  );
}
