"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/** Preview / Code switcher. Both panels are rendered on the server and passed in. */
export function PreviewTabs({
  preview,
  code,
}: {
  preview: React.ReactNode;
  code: React.ReactNode;
}) {
  return (
    <Tabs defaultValue="preview" className="gap-0">
      <div className="flex items-center border-b pb-1">
        <TabsList variant="line" className="h-auto p-0">
          <TabsTrigger value="preview" className="flex-none px-3">
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className="flex-none px-3">
            Code
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="preview" className="mt-4">
        <div className="bg-background flex min-h-72 items-center justify-center rounded-xl border p-6">
          {preview}
        </div>
      </TabsContent>
      <TabsContent value="code" className="mt-4">
        {code}
      </TabsContent>
    </Tabs>
  );
}
