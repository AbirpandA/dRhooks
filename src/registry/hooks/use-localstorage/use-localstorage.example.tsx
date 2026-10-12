"use client";

import { useLocalStorage } from "./use-localstorage";

export default function UseLocalStorageDemo() {
  const [name, setName] = useLocalStorage("drhooks-demo-name", "");

  return (
    <div className="w-full space-y-3">
      <input
        className="border-input bg-background focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type, then refresh the page"
      />
      <p className="text-muted-foreground text-sm">
        {name
          ? `Hello, ${name}. This value survives a reload.`
          : "Nothing saved yet."}
      </p>
    </div>
  );
}
