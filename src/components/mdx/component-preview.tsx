"use client";

import * as React from "react";

import { Examples } from "@/__registry__/examples";

export const ComponentPreview: React.FC<{ name: string }> = ({ name }) => {
  const Component = Examples[name];

  return (
    <div className="flex items-center justify-center bg-card rounded-lg border h-64">
      {Component ? (
        <React.Suspense
          fallback={
            <div className="text-muted-foreground flex items-center justify-center text-sm">
              Loading...
            </div>
          }
        >
          <Component />
        </React.Suspense>
      ) : (
        <p className="text-muted-foreground text-sm">
          Example <code>{name}</code> was not found in the registry.
        </p>
      )}
    </div>
  );
};
