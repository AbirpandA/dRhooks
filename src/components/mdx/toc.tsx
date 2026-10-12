"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

/** A heading counts as "current" once it crosses this line from the top of the viewport. */
const READ_LINE = 120;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

/**
 * "On this page" with a reading-progress rail. The rail fills as you scroll,
 * each section has a dot on it, sections you have passed are highlighted, and
 * every entry jumps to its heading. The article is found via `[data-doc-content]`.
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const itemRefs = React.useRef<(HTMLLIElement | null)[]>([]);
  const updateRef = React.useRef<() => void>(() => {});
  const [state, setState] = React.useState({ active: 0, fill: 0, progress: 0 });

  React.useEffect(() => {
    if (!items.length) return;
    const article = document.querySelector<HTMLElement>("[data-doc-content]");
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.scrollY + READ_LINE;
      const tops = items.map((item) => {
        const element = document.getElementById(item.id);
        return element
          ? element.getBoundingClientRect().top + window.scrollY
          : Infinity;
      });
      const articleBottom = article
        ? article.getBoundingClientRect().bottom + window.scrollY
        : document.documentElement.scrollHeight;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      let active = 0;
      tops.forEach((top, index) => {
        if (top <= line) active = index;
      });
      if (atBottom) active = items.length - 1;

      // Dot centres give the rail positions that line up with the entries.
      const centre = (index: number) => {
        const element = itemRefs.current[index];
        return element ? element.offsetTop + element.offsetHeight / 2 : 0;
      };
      const segmentEnd =
        active + 1 < items.length ? tops[active + 1] : articleBottom;
      const span = Math.max(1, segmentEnd - tops[active]);
      const within = atBottom ? 1 : clamp((line - tops[active]) / span);
      const fill =
        line < tops[0]
          ? 0
          : active + 1 < items.length
            ? centre(active) + (centre(active + 1) - centre(active)) * within
            : centre(active) + 8 * within;

      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? clamp(window.scrollY / scrollable) : 1;
      setState({ active, fill, progress });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    updateRef.current = update;
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  // Sub-headings only open for the section being read, which keeps the rail short.
  const parents: number[] = [];
  items.forEach((item, index) => {
    parents.push(item.depth === 2 ? index : (parents[index - 1] ?? index));
  });
  const openGroup = parents[state.active];

  // Opening a section changes entry heights without any scroll, so keep the
  // rail measured while the open/close animation runs.
  React.useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = () => {
      updateRef.current();
      if (performance.now() - start < 300) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [openGroup]);

  if (!items.length) return null;

  const left = items.length - 1 - state.active;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-4 text-xs font-medium">On This Page</p>
      <div className="relative">
        <div
          aria-hidden
          className="bg-border absolute top-0 bottom-0 left-[6px] w-px"
        />
        <div
          aria-hidden
          className="bg-foreground absolute top-0 left-[6px] w-px transition-[height] duration-150 ease-out"
          style={{ height: state.fill }}
        />
        <ul className="flex flex-col">
          {items.map((item, index) => {
            const reached = index <= state.active;
            const current = index === state.active;
            const collapsed = item.depth === 3 && parents[index] !== openGroup;
            return (
              <li
                key={item.id}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                className={cn(
                  "grid transition-[grid-template-rows] duration-200",
                  collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
                )}
              >
                <div
                  className={cn(
                    "relative min-h-0",
                    item.depth === 3 && "overflow-hidden"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-1/2 left-[6px] size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors",
                      reached
                        ? "bg-foreground border-foreground"
                        : "bg-background border-border",
                      current && "ring-foreground/15 ring-[3px]"
                    )}
                  />
                  <a
                    href={`#${item.id}`}
                    tabIndex={collapsed ? -1 : undefined}
                    aria-current={current ? "location" : undefined}
                    className={cn(
                      "block py-1.5 pr-1 transition-colors",
                      item.depth === 3 ? "pl-9 text-[13px]" : "pl-6",
                      current
                        ? "text-foreground font-medium"
                        : reached
                          ? "text-foreground/70 hover:text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.text}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="text-muted-foreground mt-5 flex items-center justify-between text-xs tabular-nums">
        <span>{Math.round(state.progress * 100)}% read</span>
        <span>{left === 0 ? "Last section" : `${left} left`}</span>
      </p>
    </nav>
  );
}
