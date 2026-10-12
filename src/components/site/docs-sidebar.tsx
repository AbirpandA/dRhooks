"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Blocks, Webhook, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { NavGroup } from "@/lib/docs";

const GROUP_ICONS: Record<string, LucideIcon> = {
  "Getting Started": BookOpen,
  Hooks: Webhook,
  Components: Blocks,
};

export function DocsSidebar({
  groups,
  onNavigate,
}: {
  groups: NavGroup[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const navRef = React.useRef<HTMLElement>(null);

  // Keep the current page visible when the list is longer than the viewport.
  React.useEffect(() => {
    navRef.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  return (
    <nav
      ref={navRef}
      aria-label="Documentation"
      className="flex flex-col gap-7 text-sm"
    >
      {groups.map((group) => {
        const Icon = GROUP_ICONS[group.title];
        const isHooks = group.title === "Hooks";
        return (
          <div key={group.title}>
            <p className="mb-2 flex items-center gap-2 px-2 text-xs font-medium">
              {Icon && <Icon className="text-muted-foreground size-3.5" />}
              {group.title}
              {group.title !== "Getting Started" && (
                <span className="text-muted-foreground ml-auto font-normal tabular-nums">
                  {group.items.length}
                </span>
              )}
            </p>
            <ul className="border-border/70 ml-3 flex flex-col border-l">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative -ml-px block rounded-r-md border-l-2 py-1.5 pr-2 pl-4 transition-colors",
                        isHooks && "font-mono text-[13px]",
                        active
                          ? "border-foreground bg-accent/60 text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 border-transparent"
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
