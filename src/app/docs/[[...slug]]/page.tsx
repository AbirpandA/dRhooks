import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ComponentPreview } from "@/components/mdx/component-preview";
import { ComponentSource } from "@/components/mdx/component-source";
import { InstallTabs } from "@/components/mdx/install-tabs";
import { PreviewTabs } from "@/components/mdx/preview-tabs";
import { TableOfContents, type TocItem } from "@/components/mdx/toc";
import { ItemCard } from "@/components/site/item-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getItem,
  getItems,
  getSiblings,
  guidePages,
  installCommand,
  type NavLink,
} from "@/lib/docs";
import { readDoc } from "@/lib/mdx";
import type { ManifestItem } from "@/lib/registry-types";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

type Resolved =
  | { kind: "guide"; slug: string; href: string }
  | { kind: "section"; section: "hooks" | "components" }
  | { kind: "item"; item: ManifestItem };

const resolve = (slug: string[] = []): Resolved | undefined => {
  if (slug.length === 0) return { kind: "guide", slug: "index", href: "/docs" };

  if (slug.length === 1) {
    const guide = guidePages.find((page) => page.slug === slug[0]);
    if (guide) return { kind: "guide", slug: guide.slug, href: guide.href };
    if (slug[0] === "hooks" || slug[0] === "components") {
      return { kind: "section", section: slug[0] };
    }
    return undefined;
  }

  if (slug.length === 2) {
    const item = getItem(slug[0], slug[1]);
    return item && { kind: "item", item };
  }
  return undefined;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { slug: [] },
    ...guidePages
      .filter((page) => page.slug !== "index")
      .map((page) => ({ slug: [page.slug] })),
    { slug: ["hooks"] },
    { slug: ["components"] },
    ...getItems().map((item) => ({ slug: [item.section, item.name] })),
  ];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolved = resolve((await params).slug);
  if (!resolved) return {};

  if (resolved.kind === "item") {
    return {
      title: resolved.item.title,
      description: resolved.item.description,
    };
  }
  if (resolved.kind === "guide") {
    const { data } = await readDoc(`src/content/docs/${resolved.slug}.mdx`);
    return { title: data.title, description: data.description };
  }
  return { title: resolved.section === "hooks" ? "Hooks" : "Components" };
}

function PageHeader({
  title,
  description,
  href,
  crumb,
}: {
  title: string;
  description?: string;
  href: string;
  crumb?: { label: string; href: string };
}) {
  const { prev, next } = getSiblings(href);
  const arrow = (link: NavLink | undefined, direction: "prev" | "next") =>
    link ? (
      <Button variant="outline" size="icon" asChild className="size-8">
        <Link
          href={link.href}
          aria-label={`${direction === "prev" ? "Previous" : "Next"}: ${link.title}`}
        >
          {direction === "prev" ? <ChevronLeft /> : <ChevronRight />}
        </Link>
      </Button>
    ) : null;

  return (
    <header className="space-y-2">
      <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
        <Link href="/docs" className="hover:text-foreground transition-colors">
          Docs
        </Link>
        {crumb && (
          <>
            <ChevronRight className="size-3.5" />
            <Link
              href={crumb.href}
              className="hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          </>
        )}
      </p>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <div className="flex shrink-0 gap-1.5 pt-1">
          {arrow(prev, "prev")}
          {arrow(next, "next")}
        </div>
      </div>
      {description && (
        <p className="text-muted-foreground text-lg text-balance">
          {description}
        </p>
      )}
    </header>
  );
}

function PageFooter({ href }: { href: string }) {
  const { prev, next } = getSiblings(href);
  if (!prev && !next) return null;

  return (
    <nav className="mt-16 flex items-center justify-between gap-4 border-t pt-6 text-sm">
      {prev ? (
        <Button variant="ghost" asChild>
          <Link href={prev.href}>
            <ChevronLeft />
            {prev.title}
          </Link>
        </Button>
      ) : (
        <span />
      )}
      {next && (
        <Button variant="ghost" asChild>
          <Link href={next.href}>
            {next.title}
            <ChevronRight />
          </Link>
        </Button>
      )}
    </nav>
  );
}

function Layout({
  toc,
  children,
}: {
  toc: TocItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-10 py-8">
      <article data-doc-content className="min-w-0 max-w-3xl flex-1 pb-16">
        {children}
      </article>
      <aside className="hidden w-52 shrink-0 xl:block">
        <div className="sticky top-20 max-h-[calc(100svh-6rem)] overflow-y-auto pb-4">
          <TableOfContents items={toc} />
        </div>
      </aside>
    </div>
  );
}

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2
    id={id}
    className="mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
  >
    {children}
  </h2>
);

async function ItemPage({ item }: { item: ManifestItem }) {
  const { content, toc: bodyToc } = await readDoc(item.mdxPath);
  const mainName = `${item.name}-demo`;
  const hasMain = item.examples.some((example) => example.name === mainName);
  const extra = item.examples.filter((example) => example.name !== mainName);
  const crumb = {
    label: item.section === "hooks" ? "Hooks" : "Components",
    href: `/docs/${item.section}`,
  };
  const hasDeps =
    item.dependencies.length > 0 || item.registryDependencies.length > 0;

  const toc: TocItem[] = [
    { id: "installation", text: "Installation", depth: 2 },
    ...bodyToc,
    ...(extra.length
      ? [{ id: "examples", text: "Examples", depth: 2 as const }]
      : []),
  ];

  return (
    <Layout toc={toc}>
      <PageHeader
        title={item.title}
        description={item.description}
        href={item.href}
        crumb={crumb}
      />

      {hasMain && (
        <div className="mt-8">
          <PreviewTabs
            preview={<ComponentPreview name={mainName} />}
            code={<ComponentSource name={mainName} bare />}
          />
        </div>
      )}

      <div className="mt-12 space-y-4">
        <H2 id="installation">Installation</H2>
        <Tabs defaultValue="cli" className="gap-4">
          <TabsList
            variant="line"
            className="h-auto justify-start border-b p-0"
          >
            <TabsTrigger value="cli" className="flex-none px-3">
              CLI
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex-none px-3">
              Manual
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cli">
            <InstallTabs run={installCommand(item.name)} />
          </TabsContent>
          <TabsContent value="manual" className="space-y-4">
            {item.dependencies.length > 0 && (
              <>
                <p className="text-sm">Install the required packages:</p>
                <InstallTabs install={item.dependencies} />
              </>
            )}
            {item.registryDependencies.length > 0 && (
              <p className="text-sm">
                Also add{" "}
                {item.registryDependencies.map((dep, index) => (
                  <span key={dep}>
                    {index > 0 && ", "}
                    <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-[13px]">
                      {dep}
                    </code>
                  </span>
                ))}
                .
              </p>
            )}
            <p className="text-sm">
              {hasDeps ? "Then copy" : "Copy"} the following code into your
              project and update the import paths to match your setup.
            </p>
            <ComponentSource name={item.name} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-12">{content}</div>

      {extra.length > 0 && (
        <div className="mt-12 space-y-6">
          <H2 id="examples">Examples</H2>
          {extra.map((example) => (
            <section key={example.name} className="space-y-3">
              <h3 className="text-lg font-semibold">{example.title}</h3>
              <PreviewTabs
                preview={<ComponentPreview name={example.name} />}
                code={<ComponentSource name={example.name} bare />}
              />
            </section>
          ))}
        </div>
      )}

      <PageFooter href={item.href} />
    </Layout>
  );
}

export default async function Page({ params }: PageProps) {
  const resolved = resolve((await params).slug);
  if (!resolved) notFound();

  if (resolved.kind === "item") return <ItemPage item={resolved.item} />;

  if (resolved.kind === "section") {
    const items = getItems(resolved.section);
    const title = resolved.section === "hooks" ? "Hooks" : "Components";
    return (
      <Layout toc={[]}>
        <PageHeader title={title} href={`/docs/${resolved.section}`} />
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <ItemCard key={item.href} item={item} />
          ))}
        </div>
      </Layout>
    );
  }

  const { data, content, toc } = await readDoc(
    `src/content/docs/${resolved.slug}.mdx`
  );
  return (
    <Layout toc={toc}>
      <PageHeader
        title={data.title}
        description={data.description}
        href={resolved.href}
        crumb={{ label: "Getting Started", href: "/docs" }}
      />
      <div className="mt-8">{content}</div>
      <PageFooter href={resolved.href} />
    </Layout>
  );
}
