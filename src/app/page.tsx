import Link from "next/link";
import { Github } from "lucide-react";

import { CopyButton } from "@/components/mdx/copy-button";
import { ItemCard } from "@/components/site/item-card";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import { getNav, installCommand, siteConfig } from "@/lib/docs";

export default function Home() {
  const sections = getNav().filter(
    (group) => group.title !== "Getting Started"
  );
  const example = `npx ${installCommand("use-debounce")}`;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6">
        <section className="flex flex-col items-center gap-6 py-20 text-center sm:py-28">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Hooks and components you own
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg text-balance">
            {siteConfig.description} No package to depend on: the code lands in
            your project.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/docs">Get started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github />
                GitHub
              </Link>
            </Button>
          </div>
          <div className="bg-muted/40 relative mt-4 w-full max-w-xl rounded-xl border py-3 pr-12 pl-4 text-left">
            <code className="block overflow-x-auto font-mono text-[13px] whitespace-nowrap">
              {example}
            </code>
            <CopyButton
              value={example}
              className="absolute top-1/2 right-2 -translate-y-1/2"
            />
          </div>
        </section>

        {sections.map((group) => (
          <section key={group.title} className="pb-16">
            <h2 className="mb-4 text-sm font-medium">{group.title}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <ItemCard key={item.href} item={item} />
              ))}
            </div>
          </section>
        ))}
      </main>
      <footer className="border-t py-6">
        <p className="text-muted-foreground mx-auto max-w-5xl px-4 text-sm sm:px-6">
          MIT licensed. Built on{" "}
          <Link
            href="https://ui.shadcn.com"
            className="underline underline-offset-4"
          >
            shadcn/ui
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}
