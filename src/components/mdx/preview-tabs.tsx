"use client";

import * as React from "react";

import { PreviewCanvas } from "@/components/mdx/preview-canvas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Preview / Code switcher. One bordered card: a header bar with the tabs, then
 * either the live example on a dotted canvas or the source. Both panels are
 * rendered on the server and passed in.
 */
export function PreviewTabs({
  preview,
  code,
}: {
  preview: React.ReactNode;
  code: React.ReactNode;
}) {
  return (
    <Tabs
      defaultValue="preview"
      className="bg-background gap-0 overflow-hidden rounded-xl border"
    >
      <div className="bg-muted/30 flex h-12 items-center border-b px-2">
        <TabsList className="h-8">
          <TabsTrigger value="preview" className="px-3 text-[13px]">
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className="px-3 text-[13px]">
            Code
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="preview" className="m-0">
        <PreviewCanvas>{preview}</PreviewCanvas>
      </TabsContent>
      <TabsContent value="code" className="m-0">
        {code}
      </TabsContent>
    </Tabs>
  );
}
