#!/usr/bin/env tsx
/**
 * Component/Hook Generator Script
 *
 * Usage:
 *   yarn generate component my-component
 *   yarn generate hook use-my-hook
 */

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

const REGISTRY_PATH = "src/registry/new-york";
const DOCS_PATH = "src/content/docs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt: string): Promise<string> =>
  new Promise((resolve) => rl.question(prompt, resolve));

// Convert kebab-case to PascalCase
const toPascalCase = (str: string): string =>
  str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

// Convert kebab-case to camelCase
const toCamelCase = (str: string): string => {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

// Component Templates
const componentTemplate = (name: string) => {
  const pascalName = toPascalCase(name);
  return `"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ${pascalName}Props extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Add your custom props here
   */
}

/**
 * ${pascalName} - A customizable component
 *
 * @example
 * \`\`\`tsx
 * <${pascalName}>Content</${pascalName}>
 * \`\`\`
 */
export function ${pascalName}({
  className,
  children,
  ...props
}: ${pascalName}Props) {
  return (
    <div
      className={cn(
        // Add your default styles here
        "rounded-lg border p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
`;
};

const componentExampleTemplate = (name: string) => {
  const pascalName = toPascalCase(name);
  return `import { ${pascalName} } from "@/registry/new-york/ui/${name}";

export default function ${pascalName}Example() {
  return (
    <${pascalName}>
      <p>Your example content here</p>
    </${pascalName}>
  );
}
`;
};

const componentDocTemplate = (name: string, description: string) => {
  const pascalName = toPascalCase(name);
  return `---
title: ${pascalName}
description: ${description}
---

import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { ComponentPreview } from "@/components/mdx/component-preview";
import { ComponentSource } from "@/components/mdx/component-source";

<ComponentPreview name="${name}-example" />

## Installation

<Tabs items={["CLI", "Manual"]}>
  <Tab value="CLI">
    \`\`\`bash
    npx shadcn@latest add "https://drhooks.com/r/${name}.json"
    \`\`\`
  </Tab>
  <Tab value="Manual">
    <ComponentSource name="${name}" />
  </Tab>
</Tabs>

## Usage

\`\`\`tsx
import { ${pascalName} } from "@/components/ui/${name}";

export default function Example() {
  return (
    <${pascalName}>
      Hello World
    </${pascalName}>
  );
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`className\` | \`string\` | - | Additional CSS classes |
| \`children\` | \`React.ReactNode\` | - | Content to display |

## Examples

### Basic Usage

<ComponentPreview name="${name}-example" />

## Accessibility

- Add accessibility notes here
`;
};

// Hook Templates
const hookTemplate = (name: string) => {
  const camelName = toCamelCase(name);
  return `import { useState, useEffect, useCallback } from "react";

export interface ${toPascalCase(name)}Options {
  /**
   * Add your options here
   */
}

export interface ${toPascalCase(name)}Return {
  /**
   * Add your return type here
   */
  value: string;
  setValue: (value: string) => void;
}

/**
 * ${camelName} - A custom React hook
 *
 * @param initialValue - The initial value
 * @param options - Configuration options
 * @returns Hook state and methods
 *
 * @example
 * \`\`\`tsx
 * const { value, setValue } = ${camelName}("initial");
 * \`\`\`
 */
export function ${camelName}(
  initialValue: string = "",
  options?: ${toPascalCase(name)}Options
): ${toPascalCase(name)}Return {
  const [value, setValue] = useState(initialValue);

  // Add your hook logic here

  return {
    value,
    setValue,
  };
}
`;
};

const hookExampleTemplate = (name: string) => {
  const camelName = toCamelCase(name);
  const pascalName = toPascalCase(name);
  return `"use client";

import { ${camelName} } from "@/registry/new-york/hooks/${name}";

export default function ${pascalName}Example() {
  const { value, setValue } = ${camelName}("initial value");

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Current value: <code className="font-mono">{value}</code>
      </p>
      <button
        onClick={() => setValue("updated value")}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Update Value
      </button>
    </div>
  );
}
`;
};

const hookDocTemplate = (name: string, description: string) => {
  const camelName = toCamelCase(name);
  return `---
title: ${camelName}
description: ${description}
---

import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { ComponentPreview } from "@/components/mdx/component-preview";
import { ComponentSource } from "@/components/mdx/component-source";

<ComponentPreview name="${name}-example" />

## Installation

<Tabs items={["CLI", "Manual"]}>
  <Tab value="CLI">
    \`\`\`bash
    npx shadcn@latest add "https://drhooks.com/r/${name}.json"
    \`\`\`
  </Tab>
  <Tab value="Manual">
    <ComponentSource name="${name}" />
  </Tab>
</Tabs>

## Usage

\`\`\`tsx
import { ${camelName} } from "@/hooks/${name}";

export default function Example() {
  const { value, setValue } = ${camelName}("initial");

  return (
    <div>
      <p>Value: {value}</p>
      <button onClick={() => setValue("new value")}>Update</button>
    </div>
  );
}
\`\`\`

## API

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| \`initialValue\` | \`string\` | \`""\` | The initial value |
| \`options\` | \`object\` | - | Configuration options |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| \`value\` | \`string\` | Current value |
| \`setValue\` | \`(value: string) => void\` | Update the value |

## Examples

### Basic Usage

<ComponentPreview name="${name}-example" />
`;
};

// Registry entry templates
const registryUiEntry = (name: string, description: string) => `  {
    name: "${name}",
    type: "registry:ui",
    title: "${toPascalCase(name)}",
    description: "${description}",
    dependencies: [],
    files: [
      {
        path: "registry/new-york/ui/${name}.tsx",
        type: "registry:ui",
        target: "components/ui/${name}.tsx",
      },
    ],
  },`;

const registryHookEntry = (name: string, description: string) => `  {
    name: "${name}",
    type: "registry:ui",
    title: "${toCamelCase(name)}",
    description: "${description}",
    dependencies: [],
    files: [
      {
        path: "registry/new-york/hooks/${name}.ts",
        type: "registry:ui",
        target: "hooks/${name}.ts",
      },
    ],
  },`;

const registryExampleEntry = (name: string, isHook: boolean) => `  {
    name: "${name}-example",
    type: "registry:example",
    title: "${toPascalCase(name)} Example",
    registryDependencies: ["${name}"],
    files: [
      {
        path: "registry/new-york/examples/${name}-example.tsx",
        type: "registry:example",
      },
    ],
  },`;

async function generateComponent(name: string) {
  console.log(`\n🧩 Generating component: ${name}\n`);

  const description = await question("Enter a brief description: ");

  const files = [
    {
      path: `${REGISTRY_PATH}/ui/${name}.tsx`,
      content: componentTemplate(name),
    },
    {
      path: `${REGISTRY_PATH}/examples/${name}-example.tsx`,
      content: componentExampleTemplate(name),
    },
    {
      path: `${DOCS_PATH}/components/${name.replace(/-/g, "_")}.mdx`,
      content: componentDocTemplate(name, description),
    },
  ];

  for (const file of files) {
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(file.path, file.content);
    console.log(`  ✓ Created: ${file.path}`);
  }

  console.log("\n📋 Add to registry files:\n");
  console.log("// src/registry/registry-ui.ts");
  console.log(registryUiEntry(name, description));
  console.log("\n// src/registry/registry-examples.ts");
  console.log(registryExampleEntry(name, false));
  console.log("\n✅ Don't forget to run: yarn build:registry\n");
}

async function generateHook(name: string) {
  // Ensure hook name starts with "use-"
  if (!name.startsWith("use-")) {
    name = `use-${name}`;
  }

  console.log(`\n🪝 Generating hook: ${name}\n`);

  const description = await question("Enter a brief description: ");

  const files = [
    {
      path: `${REGISTRY_PATH}/hooks/${name}.ts`,
      content: hookTemplate(name),
    },
    {
      path: `${REGISTRY_PATH}/examples/${name}-example.tsx`,
      content: hookExampleTemplate(name),
    },
    {
      path: `${DOCS_PATH}/hooks/${name.replace(/-/g, "_")}.mdx`,
      content: hookDocTemplate(name, description),
    },
  ];

  for (const file of files) {
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(file.path, file.content);
    console.log(`  ✓ Created: ${file.path}`);
  }

  console.log("\n📋 Add to registry files:\n");
  console.log("// src/registry/registry-hooks.ts");
  console.log(registryHookEntry(name, description));
  console.log("\n// src/registry/registry-examples.ts");
  console.log(registryExampleEntry(name, true));
  console.log("\n✅ Don't forget to run: yarn build:registry\n");
}

async function main() {
  const [type, name] = process.argv.slice(2);

  if (!type || !name) {
    console.log(`
📦 dRhooks Generator

Usage:
  yarn generate component <name>    Create a new UI component
  yarn generate hook <name>         Create a new hook

Examples:
  yarn generate component toast-stack
  yarn generate hook clipboard
    `);
    process.exit(1);
  }

  try {
    if (type === "component") {
      await generateComponent(name);
    } else if (type === "hook") {
      await generateHook(name);
    } else {
      console.error(`Unknown type: ${type}. Use "component" or "hook".`);
      process.exit(1);
    }
  } finally {
    rl.close();
  }
}

main();
