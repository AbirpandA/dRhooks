"use client";

import { useState } from "react";
import { useDebounce } from "../hooks/use-debounce";

export default function UseDebounceDemo() {
  const [q, setQ] = useState("");
  const debounced = useDebounce(q, 500);

  return (
    <div className="space-y-2">
      <input
        className="border px-2 py-1 rounded"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Type to debounce"
      />
      <div className="p-2 text-sm">Immediate: {q}</div>
      <div className="p-2 text-sm">Debounced: {debounced}</div>
    </div>
  );
}
