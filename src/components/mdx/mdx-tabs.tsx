"use client";

import * as React from "react";

import {
  Tabs as UiTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

/** `<Tabs items={["A", "B"]}><Tab>...</Tab><Tab>...</Tab></Tabs>` for MDX authors. */
export function Tabs({
  items,
  children,
}: {
  items: string[];
  children: React.ReactNode;
}) {
  const panels = React.Children.toArray(children);

  return (
    <UiTabs defaultValue={items[0]} className="my-6 gap-0">
      <TabsList variant="line" className="h-auto justify-start border-b p-0">
        {items.map((item) => (
          <TabsTrigger key={item} value={item} className="flex-none px-3">
            {item}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item, index) => (
        <TabsContent key={item} value={item} className="pt-4">
          {panels[index]}
        </TabsContent>
      ))}
    </UiTabs>
  );
}

export function Tab({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
