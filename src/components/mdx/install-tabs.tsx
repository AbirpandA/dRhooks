"use client";

import * as React from "react";

import { CopyButton } from "@/components/mdx/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RUNNERS = [
  { id: "npm", prefix: "npx" },
  { id: "pnpm", prefix: "pnpm dlx" },
  { id: "yarn", prefix: "yarn dlx" },
  { id: "bun", prefix: "bunx --bun" },
] as const;

const INSTALLERS = [
  { id: "npm", prefix: "npm install" },
  { id: "pnpm", prefix: "pnpm add" },
  { id: "yarn", prefix: "yarn add" },
  { id: "bun", prefix: "bun add" },
] as const;

/**
 * Package-manager tabs. Pass `run` for a one-off CLI command
 * (`shadcn@latest add ...`) or `install` for a list of packages.
 */
export function InstallTabs({
  run,
  install,
}: {
  run?: string;
  install?: string[];
}) {
  const managers = run ? RUNNERS : INSTALLERS;
  const rest = run ?? install?.join(" ") ?? "";

  return (
    <Tabs
      defaultValue="npm"
      className="bg-muted/40 gap-0 overflow-hidden rounded-xl border"
    >
      <div className="flex items-center border-b px-3 py-1">
        <TabsList variant="line" className="h-8 p-0">
          {managers.map(({ id }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="flex-none px-2.5 text-xs"
            >
              {id}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {managers.map(({ id, prefix }) => {
        const command = `${prefix} ${rest}`;
        return (
          <TabsContent key={id} value={id} className="relative m-0">
            <pre className="overflow-x-auto p-4 pr-12 text-[13px] leading-relaxed">
              <code className="font-mono">{command}</code>
            </pre>
            <CopyButton value={command} className="absolute top-3 right-3" />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
