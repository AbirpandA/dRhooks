"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = React.useState<string | undefined>(items[0]?.id);

  React.useEffect(() => {
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "0px 0px -70% 0px" }
    );
    for (const { id } of items) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 text-xs font-medium">On This Page</p>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id} className={cn(item.depth === 3 && "pl-3")}>
            <a
              href={`#${item.id}`}
              className={cn(
                "transition-colors",
                active === item.id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
