import { manifest } from "@/__registry__/manifest";
import type { ManifestItem } from "@/lib/registry-types";

export const siteConfig = {
  name: "dRhooks",
  description:
    "Copy-and-paste React hooks and UI components, installable with the shadcn CLI.",
  url: "https://dr-hooks.vercel.app",
  github: "https://github.com/AbirpandA/dRhooks",
};

export interface NavLink {
  title: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  title: string;
  items: NavLink[];
}

/** Hand-written pages in `src/content/docs/<slug>.mdx`. */
export const guidePages: (NavLink & { slug: string })[] = [
  { slug: "index", title: "Introduction", href: "/docs" },
  { slug: "installation", title: "Installation", href: "/docs/installation" },
];

const toLink = (item: ManifestItem): NavLink => ({
  title: item.title,
  href: item.href,
  description: item.description,
});

export const getItems = (section?: ManifestItem["section"]) =>
  manifest.filter((item) => !section || item.section === section);

export const getItem = (section: string, name: string) =>
  manifest.find((item) => item.section === section && item.name === name);

export const getNav = (): NavGroup[] => [
  {
    title: "Getting Started",
    items: guidePages.map(({ title, href }) => ({ title, href })),
  },
  { title: "Hooks", items: getItems("hooks").map(toLink) },
  { title: "Components", items: getItems("components").map(toLink) },
];

export const getSiblings = (href: string) => {
  const flat = getNav().flatMap((group) => group.items);
  const index = flat.findIndex((link) => link.href === href);
  return {
    prev: index > 0 ? flat[index - 1] : undefined,
    next: index >= 0 && index < flat.length - 1 ? flat[index + 1] : undefined,
  };
};

export const installCommand = (name: string) =>
  `shadcn@latest add ${siteConfig.url}/r/${name}.json`;
