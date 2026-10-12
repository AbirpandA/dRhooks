"use client";

import { useState } from "react";
import { useDebounce } from "./use-debounce";

export default function UseDebounceDemo() {
  const [query, setQuery] = useState("");
  const { debounced } = useDebounce(query, 500);

  return (
    <div className="w-full space-y-4">
      <input
        className="border-input bg-background focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to debounce"
      />
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        <dt className="text-muted-foreground">Immediate</dt>
        <dd className="truncate font-mono">{query || "-"}</dd>
        <dt className="text-muted-foreground">Debounced (500ms)</dt>
        <dd className="truncate font-mono">{debounced || "-"}</dd>
      </dl>
    </div>
  );
}
