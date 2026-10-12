import type { ReactNode } from "react";

import { DocsSidebar } from "@/components/site/docs-sidebar";
import { SiteHeader } from "@/components/site/site-header";
import { getNav } from "@/lib/docs";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader showMobileNav />
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 px-4 sm:px-6">
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 pr-4 md:block">
          <DocsSidebar groups={getNav()} />
        </aside>
        <main className="min-w-0 flex-1 md:pl-8">{children}</main>
      </div>
    </div>
  );
}
