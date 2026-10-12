import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { NavLink } from "@/lib/docs";

export function ItemCard({ item }: { item: NavLink }) {
  return (
    <Link
      href={item.href}
      className="group hover:bg-accent/40 flex flex-col gap-1.5 rounded-xl border p-4 transition-colors"
    >
      <span className="flex items-center justify-between font-medium">
        {item.title}
        <ArrowUpRight className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
      {item.description && (
        <span className="text-muted-foreground text-sm leading-relaxed">
          {item.description}
        </span>
      )}
    </Link>
  );
}
