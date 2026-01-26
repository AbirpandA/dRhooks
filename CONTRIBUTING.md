# Contributing to dRhooks

First off, thank you for considering contributing to dRhooks! 🎉

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Adding a New Component](#adding-a-new-component)
- [Adding a New Hook](#adding-a-new-hook)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)

## Code of Conduct

Please be respectful and constructive in all interactions. We're here to build something great together.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/dRhooks.git`
3. Add the original repo as upstream: `git remote add upstream https://github.com/ORIGINAL_OWNER/dRhooks.git`
4. Create a branch for your changes: `git checkout -b feature/your-feature-name`

## Development Setup

### Prerequisites

- Node.js 18+
- yarn (v1.x or v4+)

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build the registry (run after adding/modifying components)
yarn build:registry

# Run linting
yarn lint
```

### Docker Setup (Optional)

```bash
docker-compose up
```

## Project Structure

```
src/
├── __registry__/           # Auto-generated registry files (don't edit manually)
├── app/                    # Next.js app router
├── components/             # Shared components for the docs site
├── content/docs/           # MDX documentation files
│   ├── components/         # Component documentation
│   └── hooks/              # Hook documentation
├── lib/                    # Utility functions
├── registry/               # ⭐ Main registry source
│   ├── new-york/
│   │   ├── ui/             # UI components
│   │   ├── hooks/          # Custom hooks
│   │   └── examples/       # Example implementations
│   ├── registry-ui.ts      # UI component registry config
│   ├── registry-hooks.ts   # Hooks registry config
│   └── registry-examples.ts# Examples registry config
├── scripts/                # Build scripts
└── templates/              # Templates for new docs
```

## Adding a New Component

### Step 1: Create the Component

Create your component in `src/registry/new-york/ui/`:

```tsx
// src/registry/new-york/ui/my-component.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  // Add your props here
}

export function MyComponent({ className, ...props }: MyComponentProps) {
  return (
    <div className={cn("your-tailwind-classes", className)} {...props}>
      {/* Component content */}
    </div>
  );
}
```

### Step 2: Create an Example

Create an example in `src/registry/new-york/examples/`:

```tsx
// src/registry/new-york/examples/my-component-example.tsx
import { MyComponent } from "@/registry/new-york/ui/my-component";

export default function MyComponentExample() {
  return <MyComponent>Example usage</MyComponent>;
}
```

### Step 3: Register the Component

Add entries to the registry files:

**`src/registry/registry-ui.ts`:**

```ts
{
  name: "my-component",
  type: "registry:ui",
  title: "My Component",
  description: "A brief description of what it does",
  dependencies: [], // npm packages if needed
  files: [
    {
      path: "registry/new-york/ui/my-component.tsx",
      type: "registry:ui",
      target: "components/ui/my-component.tsx",
    },
  ],
},
```

**`src/registry/registry-examples.ts`:**

```ts
{
  name: "my-component-example",
  type: "registry:example",
  title: "My Component Example",
  registryDependencies: ["my-component"],
  files: [
    {
      path: "registry/new-york/examples/my-component-example.tsx",
      type: "registry:example",
    },
  ],
},
```

### Step 4: Create Documentation

Create an MDX file in `src/content/docs/components/`:

````mdx
---
title: My Component
description: A brief description of the component
---

<ComponentPreview name="my-component-example" />

## Installation

<Tabs items={["CLI", "Manual"]}>
  <Tab value="CLI">
    ```bash npx shadcn@latest add "https://drhooks.com/r/my-component.json" ```
  </Tab>
  <Tab value="Manual">
    <ComponentSource name="my-component" />
  </Tab>
</Tabs>

## Usage

```tsx
import { MyComponent } from "@/components/ui/my-component";

export default function Example() {
  return <MyComponent>Hello World</MyComponent>;
}
```
````

## Props

| Prop        | Type     | Default | Description            |
| ----------- | -------- | ------- | ---------------------- |
| `className` | `string` | -       | Additional CSS classes |

````

### Step 5: Build and Test

```bash
# Rebuild the registry
yarn build:registry

# Start dev server and verify
yarn dev
````

## Adding a New Hook

### Step 1: Create the Hook

Create your hook in `src/registry/new-york/hooks/`:

```ts
// src/registry/new-york/hooks/use-my-hook.ts
import { useState, useEffect } from "react";

export function useMyHook(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  // Hook logic here

  return { value, setValue };
}
```

### Step 2: Create an Example

```tsx
// src/registry/new-york/examples/use-my-hook-example.tsx
"use client";

import { useMyHook } from "@/registry/new-york/hooks/use-my-hook";

export default function UseMyHookExample() {
  const { value, setValue } = useMyHook("initial");

  return (
    <div>
      <p>Value: {value}</p>
      <button onClick={() => setValue("updated")}>Update</button>
    </div>
  );
}
```

### Step 3: Register the Hook

Add to `src/registry/registry-hooks.ts` and `src/registry/registry-examples.ts`.

### Step 4: Create Documentation

Create an MDX file in `src/content/docs/hooks/`.

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new BounceButton component
fix: resolve animation timing issue in ShimmerText
docs: update useDebounce documentation
chore: update dependencies
refactor: simplify useLocalStorage implementation
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Pull Request Process

1. **Ensure your code passes all checks:**

   ```bash
   pnpm lint
   pnpm build
   ```

2. **Update documentation** if you've added/changed functionality

3. **Run the registry build** after any component changes:

   ```bash
   pnpm build:registry
   ```

4. **Fill out the PR template** completely

5. **Request a review** from maintainers

## Style Guide

### TypeScript

- Use explicit types for component props
- Export interfaces for reusable types
- Prefer `interface` over `type` for object shapes

### React Components

- Use function components with explicit return types
- Use `forwardRef` for components that need ref forwarding
- Follow the shadcn/ui patterns for consistency

### Tailwind CSS

- Use `cn()` utility for conditional classes
- Follow mobile-first responsive design
- Use CSS variables for theming (defined in `globals.css`)

### Naming Conventions

| Type          | Convention                  | Example                |
| ------------- | --------------------------- | ---------------------- |
| Components    | PascalCase                  | `BounceButton`         |
| Hooks         | camelCase with `use` prefix | `useDebounce`          |
| Files         | kebab-case                  | `bounce-button.tsx`    |
| CSS Variables | kebab-case                  | `--primary-foreground` |

---

## Questions?

If you have questions, feel free to:

- Open a [Discussion](https://github.com/OWNER/dRhooks/discussions)
- Check existing [Issues](https://github.com/OWNER/dRhooks/issues)

Thank you for contributing! 🙏
