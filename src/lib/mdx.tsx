import * as React from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Element, Root } from "hast";
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import { toString } from "hast-util-to-string";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

import { getMDXComponents } from "@/components/mdx";
import type { TocItem } from "@/components/mdx/toc";
import { stripNotation } from "@/lib/strip-notation";

export interface DocFrontmatter {
  title: string;
  description?: string;
}

export const CODE_THEMES = {
  light: "github-light",
  dark: "github-dark",
} as const;

const prettyCodeOptions: Options = {
  theme: CODE_THEMES,
  keepBackground: false,
  // Fences like ```npm have no grammar; render them as plain text.
  defaultLang: { block: "plaintext" },
  // Support `// [!code ++]`, `// [!code --]`, `highlight` and `focus` markers.
  transformers: [
    transformerNotationDiff(),
    transformerNotationHighlight(),
    transformerNotationFocus(),
  ],
};

/** Collect h2/h3 after rehype-slug so ids match the rendered headings. */
const rehypeToc = (toc: TocItem[]) => () => (tree: Root) => {
  visit(tree, "element", (node: Element) => {
    if (
      (node.tagName === "h2" || node.tagName === "h3") &&
      node.properties.id
    ) {
      toc.push({
        id: String(node.properties.id),
        text: toString(node),
        depth: node.tagName === "h2" ? 2 : 3,
      });
    }
  });
};

type RawCodeElement = Element & { rawCode?: string };

/** Before pretty-code rewrites the node: remember the untouched code text. */
const rehypeRawCodeBefore = () => (tree: Root) => {
  visit(tree, "element", (node: RawCodeElement) => {
    const code = node.children[0];
    if (
      node.tagName === "pre" &&
      code?.type === "element" &&
      code.tagName === "code"
    ) {
      node.rawCode = stripNotation(toString(code).replace(/\n$/, ""));
    }
  });
};

/** After: pretty-code turned the node into a <figure>; hand the text to its <pre>. */
const rehypeRawCodeAfter = () => (tree: Root) => {
  visit(tree, "element", (node: RawCodeElement) => {
    if (node.tagName !== "figure" || node.rawCode === undefined) return;
    for (const child of node.children) {
      if (child.type === "element" && child.tagName === "pre") {
        child.properties.rawCode = node.rawCode;
      }
    }
  });
};

export async function renderMdx<T extends DocFrontmatter>(source: string) {
  const toc: TocItem[] = [];
  const { content, frontmatter } = await compileMDX<T>({
    source,
    components: getMDXComponents(),
    options: {
      parseFrontmatter: true,
      // Only our own checked-in files are compiled, and `items={[...]}` needs expressions.
      blockJS: false,
      mdxOptions: {
        format: "mdx",
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          rehypeToc(toc),
          rehypeRawCodeBefore,
          [rehypePrettyCode, prettyCodeOptions],
          rehypeRawCodeAfter,
        ],
      },
    },
  });

  return { content, toc, data: frontmatter };
}

/** Read and compile an `.mdx` file by repo-relative path. Cached per request. */
export const readDoc = React.cache(async (relativePath: string) => {
  const source = await readFile(
    path.join(process.cwd(), relativePath),
    "utf-8"
  );
  return renderMdx<DocFrontmatter>(source);
});
