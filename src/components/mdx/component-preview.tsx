"use client";

import * as React from "react";

import { Examples } from "@/__registry__/examples";

/** Renders a registry example with no chrome; the caller provides the frame. */
export const ComponentPreview: React.FC<{ name: string }> = ({ name }) => {
  const Component = Examples[name];

  if (!Component) {
    return (
      <p className="text-muted-foreground text-sm">
        Example <code>{name}</code> was not found in the registry.
      </p>
    );
  }

  return (
    <React.Suspense
      fallback={<p className="text-muted-foreground text-sm">Loading...</p>}
    >
      <Component />
    </React.Suspense>
  );
};
