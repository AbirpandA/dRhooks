"use client";

import * as React from "react";
import { Music2 } from "lucide-react";

import { DynamicIsland, IslandProvider, useIsland } from "./dynamic-island";

const wait = (ms: number, fail = false) =>
  new Promise<string>((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error("failed")) : resolve("ok")), ms)
  );

function Controls() {
  const island = useIsland();
  const { show } = island;
  React.useEffect(() => {
    show({ title: "Ready", description: "Pick a state below" });
  }, [show]);
  const button =
    "rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-accent";

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        className={button}
        onClick={() =>
          island.show({
            variant: "success",
            title: "Saved",
            description: "Your changes are live",
            duration: 2500,
          })
        }
      >
        Success
      </button>
      <button
        className={button}
        onClick={() =>
          island
            .promise(wait(1500, true), {
              loading: "Uploading…",
              success: "Uploaded",
              error: "Upload failed",
            })
            .catch(() => {})
        }
      >
        Promise
      </button>
      <button
        className={button}
        onClick={() =>
          island.show({
            title: "Now playing",
            description: "Midnight City · M83",
            leading: <Music2 className="size-5 text-fuchsia-400" />,
            content: (
              <p className="text-xs opacity-70">
                Tap the header to collapse, or press Esc.
              </p>
            ),
          })
        }
      >
        Expand
      </button>
      <button className={button} onClick={island.dismiss}>
        Dismiss
      </button>
    </div>
  );
}

export default function DynamicIslandExample() {
  return (
    <IslandProvider>
      <div className="relative flex h-56 w-full items-end justify-center overflow-hidden pb-2">
        <DynamicIsland layout="absolute" />
        <Controls />
      </div>
    </IslandProvider>
  );
}
