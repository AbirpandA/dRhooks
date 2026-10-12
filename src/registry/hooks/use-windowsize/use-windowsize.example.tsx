"use client";

import { useWindowSize } from "./use-windowsize";

export default function UseWindowSizeDemo() {
  const { width, height } = useWindowSize();

  return (
    <div className="space-y-1 text-center text-sm">
      <p className="text-muted-foreground">Resize the window</p>
      <p className="font-mono text-lg tabular-nums">
        {width} × {height}
      </p>
    </div>
  );
}
