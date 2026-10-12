"use client";

import { useLocalStorage } from "./use-localstorage";

export default function UseLocalStorageDemo() {
  const [name, setName] = useLocalStorage("drhooks-demo-name", "");

  return (
    <div className="w-full max-w-xs space-y-2">
      <input
        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
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
