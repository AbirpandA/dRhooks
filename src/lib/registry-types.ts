import type * as React from "react";

export type RegistryCategory = "hooks" | "ui";

export interface RegistryIndexFile {
  path: string;
  content: string;
  type: string;
}

export interface RegistryIndexEntry {
  name: string;
  title: string;
  description: string;
  type: string;
  files: RegistryIndexFile[];
  /** Present on example entries only. */
  component?: React.LazyExoticComponent<React.ComponentType>;
}

export type RegistryIndex = Record<string, RegistryIndexEntry>;

export interface ManifestExample {
  /** Key into the registry `Index`, e.g. `use-fetch-demo`. */
  name: string;
  title: string;
}

export interface ManifestItem {
  name: string;
  title: string;
  description: string;
  category: RegistryCategory;
  /** URL section: `hooks` or `components`. */
  section: "hooks" | "components";
  href: string;
  order: number;
  dependencies: string[];
  registryDependencies: string[];
  examples: ManifestExample[];
  /** Path to the item's `.mdx`, relative to the repo root. */
  mdxPath: string;
}
