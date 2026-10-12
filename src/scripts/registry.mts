/**
 * Registry build.
 *
 * Every item is a folder `src/registry/<hooks|ui>/<name>/` containing:
 *   <name>.ts(x)             shipped source (anything not matched below)
 *   <name>.example.tsx       main preview: required for ui, optional for hooks
 *                            (extra: <name>.<variant>.example.tsx)
 *   <name>.test.ts(x)        tests, never shipped
 *   <name>.mdx               docs; frontmatter holds the registry metadata
 *
 * Usage: yarn registry [--watch]
 */
import { execFileSync } from "node:child_process";
import { existsSync, watch } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { rimraf } from "rimraf";
import { registrySchema, type Registry } from "shadcn/registry";
import { z } from "zod";

import type {
  ManifestItem,
  RegistryCategory,
} from "../lib/registry-types.ts";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "src/registry");
const OUTPUT_DIR = path.join(ROOT, "src/__registry__");
const PUBLIC_DIR = path.join(ROOT, "public/r");
const BASE_URL = (
  process.env.REGISTRY_BASE_URL ?? "https://dr-hooks.vercel.app"
).replace(/\/$/, "");

const CATEGORIES: Record<
  RegistryCategory,
  { itemType: "registry:hook" | "registry:ui"; section: "hooks" | "components" }
> = {
  hooks: { itemType: "registry:hook", section: "hooks" },
  ui: { itemType: "registry:ui", section: "components" },
};

const frontmatterSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    dependencies: z.array(z.string().min(1)).default([]),
    registryDependencies: z.array(z.string().min(1)).default([]),
    order: z.number().default(100),
  })
  .strict();

interface SourceFile {
  /** Path relative to the repo root, e.g. `src/registry/hooks/use-fetch/use-fetch.ts`. */
  path: string;
  content: string;
}

interface ExampleFile extends SourceFile {
  /** Index key, e.g. `use-fetch-demo` or `use-fetch-error-demo`. */
  name: string;
  title: string;
  /** Import specifier for `React.lazy`. */
  importPath: string;
}

interface Item {
  name: string;
  category: RegistryCategory;
  meta: z.infer<typeof frontmatterSchema>;
  mdxPath: string;
  files: SourceFile[];
  examples: ExampleFile[];
}

const rel = (...segments: string[]) =>
  path.posix.join("src/registry", ...segments);

const toTitle = (value: string) =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const isTest = (file: string) => /\.test\.[cm]?[jt]sx?$/.test(file);
const isStory = (file: string) => /\.stories\.[cm]?[jt]sx?$/.test(file);
const isExample = (file: string) => /\.example\.tsx$/.test(file);
const isDoc = (file: string) => file.endsWith(".mdx");

const readItem = async (
  category: RegistryCategory,
  name: string,
): Promise<Item> => {
  const dir = path.join(SOURCE_DIR, category, name);
  const mdxPath = rel(category, name, `${name}.mdx`);

  if (!existsSync(path.join(ROOT, mdxPath))) {
    throw new Error(`${mdxPath} is missing. Every item needs a docs page.`);
  }

  const parsed = matter(await readFile(path.join(ROOT, mdxPath), "utf-8"));
  const result = frontmatterSchema.safeParse(parsed.data);
  if (!result.success) {
    throw new Error(
      `Invalid frontmatter in ${mdxPath}\n${z.prettifyError(result.error)}`,
    );
  }

  const entries = (await readdir(dir)).sort();

  const shippedNames = entries.filter(
    (file) =>
      !isTest(file) && !isStory(file) && !isExample(file) && !isDoc(file),
  );
  const main = shippedNames.find((file) => file.startsWith(`${name}.`));
  if (!main) {
    throw new Error(
      `${rel(category, name)} has no ${name}.ts(x) source file.`,
    );
  }
  // Main file first: the docs "Code" tab shows `files[0]`.
  const ordered = [main, ...shippedNames.filter((file) => file !== main)];
  const files: SourceFile[] = await Promise.all(
    ordered.map(async (file) => ({
      path: rel(category, name, file),
      content: await readFile(path.join(dir, file), "utf-8"),
    })),
  );

  const exampleNames = entries.filter(isExample);
  // Components need a live preview; for hooks an example is optional.
  if (category === "ui" && !exampleNames.includes(`${name}.example.tsx`)) {
    throw new Error(
      `${rel(category, name)} needs a main example: ${name}.example.tsx`,
    );
  }
  const examples: ExampleFile[] = await Promise.all(
    // `<name>.example.tsx` sorts before `<name>.<variant>.example.tsx`.
    exampleNames.map(async (file) => {
      const variant = file
        .slice(name.length + 1, -".example.tsx".length);
      const base = file.replace(/\.tsx$/, "");
      return {
        name: variant ? `${name}-${variant}-demo` : `${name}-demo`,
        title: variant ? toTitle(variant) : result.data.title,
        path: rel(category, name, file),
        content: await readFile(path.join(dir, file), "utf-8"),
        importPath: `@/registry/${category}/${name}/${base}`,
      };
    }),
  );

  return { name, category, meta: result.data, mdxPath, files, examples };
};

const readItems = async (): Promise<Item[]> => {
  const items: Item[] = [];
  for (const category of Object.keys(CATEGORIES) as RegistryCategory[]) {
    const dirents = await readdir(path.join(SOURCE_DIR, category), {
      withFileTypes: true,
    });
    for (const dirent of dirents) {
      if (dirent.isDirectory()) {
        items.push(await readItem(category, dirent.name));
      }
    }
  }

  const names = new Set(items.map((item) => item.name));
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.name)) {
      throw new Error(`Duplicate item name "${item.name}".`);
    }
    seen.add(item.name);
    for (const dep of item.meta.registryDependencies) {
      if (!names.has(dep)) {
        throw new Error(
          `${item.mdxPath}: registryDependencies references unknown item "${dep}".`,
        );
      }
    }
  }

  return items.sort(
    (a, b) =>
      a.category.localeCompare(b.category) ||
      a.meta.order - b.meta.order ||
      a.name.localeCompare(b.name),
  );
};

const toRegistry = (items: Item[]): Registry => ({
  name: "dr-hooks.io",
  homepage: `${BASE_URL}/registry.json`,
  items: items.map((item) => {
    const { itemType } = CATEGORIES[item.category];
    return {
      name: item.name,
      type: itemType,
      title: item.meta.title,
      description: item.meta.description,
      ...(item.meta.dependencies.length && {
        dependencies: item.meta.dependencies,
      }),
      ...(item.meta.registryDependencies.length && {
        registryDependencies: item.meta.registryDependencies.map(
          (dep) => `${BASE_URL}/r/${dep}.json`,
        ),
      }),
      files: item.files.map((file) => ({ path: file.path, type: itemType })),
    };
  }),
});

const toIndexSource = (items: Item[]) => {
  const files = (list: SourceFile[], type: string) =>
    `[${list
      .map(
        (file) => `{
        path: ${JSON.stringify(file.path)},
        content: ${JSON.stringify(file.content)},
        type: ${JSON.stringify(type)},
      }`,
      )
      .join(", ")}]`;
  const entry = (
    name: string,
    title: string,
    description: string,
    type: string,
    list: SourceFile[],
  ) => `  ${JSON.stringify(name)}: {
    name: ${JSON.stringify(name)},
    title: ${JSON.stringify(title)},
    description: ${JSON.stringify(description)},
    type: ${JSON.stringify(type)},
    files: ${files(list, type)},
  },`;

  const entries = items.flatMap((item) => [
    entry(
      item.name,
      item.meta.title,
      item.meta.description,
      CATEGORIES[item.category].itemType,
      item.files,
    ),
    ...item.examples.map((example) =>
      entry(
        example.name,
        example.title,
        item.meta.description,
        "registry:example",
        [example],
      ),
    ),
  ]);

  return `// Autogenerated by src/scripts/registry.mts. Do not edit.
// Server-only: contains every file's source. Client code uses ./examples.
import type { RegistryIndex } from "@/lib/registry-types";

export const Index: RegistryIndex = {
${entries.join("\n")}
};
`;
};

const toExamplesSource = (items: Item[]) => {
  const entries = items.flatMap((item) =>
    item.examples.map(
      (example) =>
        `  ${JSON.stringify(example.name)}: React.lazy(() => import(${JSON.stringify(example.importPath)})),`,
    ),
  );

  return `"use client";

// Autogenerated by src/scripts/registry.mts. Do not edit.
import * as React from "react";

export const Examples: Record<
  string,
  React.LazyExoticComponent<React.ComponentType>
> = {
${entries.join("\n")}
};
`;
};

const toManifestSource = (items: Item[]) => {
  const manifest: ManifestItem[] = items.map((item) => {
    const { section } = CATEGORIES[item.category];
    return {
      name: item.name,
      title: item.meta.title,
      description: item.meta.description,
      category: item.category,
      section,
      href: `/docs/${section}/${item.name}`,
      order: item.meta.order,
      dependencies: item.meta.dependencies,
      registryDependencies: item.meta.registryDependencies,
      examples: item.examples.map(({ name, title }) => ({ name, title })),
      mdxPath: item.mdxPath,
    };
  });

  return `// Autogenerated by src/scripts/registry.mts. Do not edit.
import type { ManifestItem } from "@/lib/registry-types";

export const manifest: ManifestItem[] = ${JSON.stringify(manifest, null, 2)};
`;
};

const build = async () => {
  const items = await readItems();
  const registry = toRegistry(items);

  const parsed = registrySchema.safeParse(registry);
  if (!parsed.success) {
    throw new Error(`Registry failed shadcn validation\n${z.prettifyError(parsed.error)}`);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(path.join(OUTPUT_DIR, "index.tsx"), toIndexSource(items));
  await writeFile(
    path.join(OUTPUT_DIR, "examples.tsx"),
    toExamplesSource(items),
  );
  await writeFile(
    path.join(OUTPUT_DIR, "manifest.ts"),
    toManifestSource(items),
  );
  await writeFile(
    path.join(OUTPUT_DIR, "registry.json"),
    JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry.json", ...parsed.data }, null, 2),
  );

  // Clear first so deleted items don't leave stale /r/<name>.json behind.
  await rimraf(PUBLIC_DIR);
  execFileSync(
    path.join(ROOT, "node_modules/.bin/shadcn"),
    ["build", path.join(OUTPUT_DIR, "registry.json"), "--output", PUBLIC_DIR],
    { stdio: "inherit", cwd: ROOT },
  );

  console.log(
    `Registry built: ${items.length} items, ${items.reduce((n, i) => n + i.examples.length, 0)} examples.`,
  );
};

const main = async () => {
  if (!process.argv.includes("--watch")) {
    try {
      await build();
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    }
    return;
  }

  let running = false;
  let queued = false;
  const run = async () => {
    if (running) {
      queued = true;
      return;
    }
    running = true;
    try {
      await build();
    } catch (error) {
      // Keep watching: a half-written file shouldn't kill the dev server.
      console.error(error instanceof Error ? error.message : error);
    }
    running = false;
    if (queued) {
      queued = false;
      void run();
    }
  };

  let timer: NodeJS.Timeout | undefined;
  watch(SOURCE_DIR, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => void run(), 150);
  });
  console.log("Watching src/registry for changes...");
  await run();
};

await main();
