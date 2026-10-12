# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

dRhooks is a shadcn-compatible **registry** of React hooks and UI components, plus a custom Next.js 16 docs site (no docs framework) that previews them. Consumers install items with `npx shadcn@latest add https://dr-hooks.vercel.app/r/<name>.json`. Package manager is **yarn**; the lockfile and CI use yarn.

## Commands

```bash
yarn dev                  # Next dev (Turbopack) + `yarn registry --watch`; new/edited items appear live
yarn build                # `yarn registry && next build`
yarn lint                 # ESLint (flat config)
yarn typecheck            # tsc --noEmit (also checks src/scripts/*.mts)
yarn test                 # Vitest in watch mode; use `yarn test --run` for a single pass
yarn test src/registry/hooks/use-debounce/use-debounce.test.ts   # single file
yarn test -t "should return the initial value"                   # single test by name
yarn registry             # Rebuild src/__registry__/* and public/r/*.json (runs on postinstall)
yarn new hook use-x ["description"] [--example] | yarn new ui x ["description"]   # Scaffold an item folder
```

CI (`.github/workflows/ci.yml`, Node 24) runs `yarn registry`, fails if `public/r` differs from what is committed, then `lint`, `typecheck`, `test`. A husky pre-commit hook runs lint-staged (prettier + `eslint --fix` on `src/**`). Commits follow Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:` …).

## Architecture: convention-based registry

There is **no hand-maintained registry list**. Each item is one folder, and `src/scripts/registry.mts` discovers all of them:

```
src/registry/{hooks,ui}/<name>/
  <name>.ts(x)             shipped source (any file that is not a test/example/mdx/story)
  <name>.example.tsx       main preview, default export; required for ui, optional for hooks
                           (extra: <name>.<variant>.example.tsx)
  <name>.test.ts(x)        colocated Vitest tests, never shipped
  <name>.mdx               docs prose + registry metadata in frontmatter
```

Frontmatter (validated with zod, `.strict()`): `title`, `description`, optional `dependencies` (npm), `registryDependencies` (bare dRhooks item names, expanded to `https://dr-hooks.vercel.app/r/<name>.json`), `order`. Item name = folder name; category = parent folder. Build errors name the offending file (missing `.mdx`, a `ui` item without a main example, unknown key, unknown registry dependency). `yarn registry --watch` does not reload its own script: restart `yarn dev` after editing `src/scripts/`.

`yarn registry` writes:
- `src/__registry__/index.tsx` — server-only `Index` (every file's source) for `ComponentSource`.
- `src/__registry__/examples.tsx` — `"use client"` map of `React.lazy` example components for `ComponentPreview` (kept separate so source text is not bundled to the client).
- `src/__registry__/manifest.ts` — typed page list driving sidebar, search, prev/next and `generateStaticParams` (`src/lib/docs.ts` wraps it).
- `src/__registry__/registry.json` → `shadcn build` → `public/r/<name>.json` (committed; CI checks it is fresh). Hooks are published as `registry:hook`, components as `registry:ui`. Each file has an explicit flat `target` (`hooks/<file>`, `components/ui/<file>`) so installs do not nest a folder.

`src/__registry__/` is git-ignored and ESLint-ignored; never hand-edit it or `public/r/`.

### Docs site

- One route, `src/app/docs/[[...slug]]/page.tsx`: guide pages (`src/content/docs/*.mdx`), `/docs/hooks` and `/docs/components` listings, and item pages (`/docs/{hooks,components}/<name>`). `dynamicParams = false`.
- The item page template renders title, preview/code tabs, and the Installation section (CLI + Manual with deps) itself. Item MDX files contain **prose only** (Overview, Usage, API).
- `src/lib/mdx.tsx` compiles MDX with `next-mdx-remote/rsc` (remark-gfm, rehype-slug, rehype-pretty-code with dual github themes). It collects an h2/h3 TOC and passes each fence's raw text to the copy button. `HighlightedCode` uses shiki directly with the same themes; token colors come from `--shiki-light/--shiki-dark` in `globals.css`.
- Example previews: `ComponentPreview` renders only the example; `PreviewCanvas` (shared by `PreviewTabs` and MDX `<ComponentPreview>`) provides the frame, padding and a `max-w-md` column. The right-hand `TableOfContents` is a reading-progress rail shown from `lg` up (below that `CompactToc` gives a progress bar and a floating menu; `[data-doc-content]` marks the article; sub-headings expand for the current section only).
- MDX components (`src/components/mdx/index.tsx`): `Callout`, `Tabs`/`Tab`, `Steps`/`Step`, `ComponentPreview`, `ComponentSource`.
- Gotchas: in MDX tables escape pipes inside code (`T \| null`); `blockJS: false` is required for `<Tabs items={[...]}>`.

## Code conventions

- Path alias `@/*` → `src/*` (also resolved in Vitest via `vite-tsconfig-paths`).
- shadcn config (`components.json`): `new-york` style, RSC, Tailwind v4 with CSS variables in `src/app/globals.css`, lucide icons. Use `cn()` from `@/lib/utils`.
- ESLint enforces double quotes, semicolons, `prefer-template`, `prefer-arrow-callback`, plus react-hooks rules. Prettier config in `.prettierrc.json`.
- Files kebab-case, components PascalCase, hooks `useX` in `use-x.ts`.
- Tests: Vitest + jsdom + Testing Library (`renderHook`, `act`, `vi.useFakeTimers()` for timing hooks); `src/setupTests.ts` loads jest-dom matchers and runs `cleanup`.
- `next.config.ts` only holds redirects for renamed doc URLs; Turbopack is the default bundler.

## Git Commit Conventions
- **Commit in Phases:** When working on a multi-step task, do not wait until the entire task is finished. Break your work down into logical checkpoints, levels, or components. As soon as you believe a specific phase is completed and verified, commit the change immediately before moving to the next phase.
- **No AI Attribution:** Never add a `Co-Authored-By: Claude...` or any AI-attribution trailers, footers, or signatures to commit messages. The commit is authored solely by the user; you are acting as a tool, not a co-author.
