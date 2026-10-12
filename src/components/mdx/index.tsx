import * as React from "react";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";

import { Callout } from "@/components/mdx/callout";
import { ComponentPreview } from "@/components/mdx/component-preview";
import { ComponentSource } from "@/components/mdx/component-source";
import { CopyButton } from "@/components/mdx/copy-button";
import { Tab, Tabs } from "@/components/mdx/mdx-tabs";
import { Step, Steps } from "@/components/mdx/steps";
import { cn } from "@/lib/utils";

type PreProps = React.ComponentProps<"pre"> & { rawCode?: string };

function Pre({ rawCode, className, children, ...props }: PreProps) {
  return (
    <div className="bg-muted/40 group relative my-6 overflow-hidden rounded-xl border">
      <pre
        {...props}
        className={cn(
          "code-block overflow-x-auto p-4 text-[13px] leading-relaxed",
          className
        )}
      >
        {children}
      </pre>
      {rawCode && (
        <CopyButton value={rawCode} className="absolute top-3 right-3" />
      )}
    </div>
  );
}

function Anchor({ href = "", className, ...props }: React.ComponentProps<"a">) {
  const classes = cn("font-medium underline underline-offset-4", className);
  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link href={href} className={classes} {...props} />;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
      {...props}
    />
  );
}

function InlineCode({ className, ...props }: React.ComponentProps<"code">) {
  // Fenced blocks are highlighted by rehype-pretty-code and carry data-language.
  if ("data-language" in props)
    return <code className={className} {...props} />;
  return (
    <code
      className={cn(
        "bg-muted rounded px-[0.4rem] py-[0.15rem] font-mono text-[0.85em]",
        className
      )}
      {...props}
    />
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    h1: ({ className, ...props }) => (
      <h1
        className={cn("mt-2 text-3xl font-semibold tracking-tight", className)}
        {...props}
      />
    ),
    h2: ({ className, ...props }) => (
      <h2
        className={cn(
          "mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0",
          className
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3
        className={cn(
          "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
          className
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }) => (
      <h4
        className={cn("mt-6 scroll-m-20 text-base font-semibold", className)}
        {...props}
      />
    ),
    p: ({ className, ...props }) => (
      <p
        className={cn("leading-7 [&:not(:first-child)]:mt-5", className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul
        className={cn("my-5 ml-6 list-disc space-y-2 [&_ul]:my-2", className)}
        {...props}
      />
    ),
    ol: ({ className, ...props }) => (
      <ol
        className={cn("my-5 ml-6 list-decimal space-y-2", className)}
        {...props}
      />
    ),
    li: ({ className, ...props }) => (
      <li className={cn("leading-7", className)} {...props} />
    ),
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn(
          "text-muted-foreground mt-6 border-l-2 pl-6 italic",
          className
        )}
        {...props}
      />
    ),
    hr: () => <hr className="my-10" />,
    table: ({ className, ...props }) => (
      <div className="my-6 w-full overflow-x-auto rounded-xl border">
        <table className={cn("w-full text-sm", className)} {...props} />
      </div>
    ),
    thead: ({ className, ...props }) => (
      <thead className={cn("bg-muted/50", className)} {...props} />
    ),
    tr: ({ className, ...props }) => (
      <tr className={cn("border-b last:border-b-0", className)} {...props} />
    ),
    th: ({ className, ...props }) => (
      <th
        className={cn("px-4 py-2.5 text-left font-medium", className)}
        {...props}
      />
    ),
    td: ({ className, ...props }) => (
      <td className={cn("px-4 py-2.5 align-top", className)} {...props} />
    ),
    a: Anchor,
    code: InlineCode,
    pre: Pre,
    Callout,
    ComponentPreview,
    ComponentSource,
    Tabs,
    Tab,
    Steps,
    Step,
    ...components,
  };
}
