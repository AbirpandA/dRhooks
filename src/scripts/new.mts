/**
 * Scaffold a new registry item. Creates the whole folder; nothing to register.
 *
 *   yarn new hook use-toggle ["Short description"]
 *   yarn new ui toast-stack ["Short description"]
 */
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";

type Kind = "hook" | "ui";

const KINDS: Record<string, Kind> = { hook: "hook", hooks: "hook", ui: "ui", component: "ui" };

const toPascal = (value: string) =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
const toCamel = (value: string) => {
  const pascal = toPascal(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const hookFiles = (name: string, description: string) => {
  const fn = toCamel(name);
  return {
    [`${name}.ts`]: `import { useCallback, useState } from "react";

/**
 * ${description}
 */
export function ${fn}(initialValue = "") {
  const [value, setValue] = useState(initialValue);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return { value, setValue, reset };
}
`,
    [`${name}.example.tsx`]: `"use client";

import { ${fn} } from "./${name}";

export default function ${toPascal(name)}Demo() {
  const { value, setValue, reset } = ${fn}("hello");

  return (
    <div className="space-y-3 text-center text-sm">
      <p>
        Value: <code className="font-mono">{value}</code>
      </p>
      <div className="flex justify-center gap-2">
        <button
          className="rounded-md border px-3 py-1.5"
          onClick={() => setValue("updated")}
        >
          Update
        </button>
        <button className="rounded-md border px-3 py-1.5" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
`,
    [`${name}.test.ts`]: `import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ${fn} } from "./${name}";

describe("${fn}", () => {
  it("returns the initial value", () => {
    const { result } = renderHook(() => ${fn}("initial"));
    expect(result.current.value).toBe("initial");
  });

  it("updates and resets the value", () => {
    const { result } = renderHook(() => ${fn}("initial"));

    act(() => result.current.setValue("next"));
    expect(result.current.value).toBe("next");

    act(() => result.current.reset());
    expect(result.current.value).toBe("initial");
  });
});
`,
    [`${name}.mdx`]: `---
title: ${JSON.stringify(fn)}
description: ${JSON.stringify(description)}
# dependencies: ["axios"]            # npm packages the hook imports
# registryDependencies: ["use-x"]    # other dRhooks items it needs
---

## Overview

Explain what \`${fn}\` does and when to reach for it.

## Usage

\`\`\`tsx
import { ${fn} } from "@/hooks/${name}";

export default function Example() {
  const { value, setValue } = ${fn}("hello");

  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
\`\`\`

## API Reference

### Parameters

| Parameter      | Type     | Default | Description        |
| -------------- | -------- | ------- | ------------------ |
| \`initialValue\` | \`string\` | \`""\`    | The initial value. |

### Return value

| Property   | Type                      | Description                |
| ---------- | ------------------------- | -------------------------- |
| \`value\`    | \`string\`                  | The current value.         |
| \`setValue\` | \`(value: string) => void\` | Replaces the value.        |
| \`reset\`    | \`() => void\`              | Restores the initial value. |
`,
  };
};

const uiFiles = (name: string, description: string) => {
  const Component = toPascal(name);
  return {
    [`${name}.tsx`]: `import * as React from "react";
import { cn } from "@/lib/utils";

export type ${Component}Props = React.HTMLAttributes<HTMLDivElement>;

/**
 * ${description}
 */
export function ${Component}({ className, ...props }: ${Component}Props) {
  return <div className={cn("rounded-lg border p-4", className)} {...props} />;
}
`,
    [`${name}.example.tsx`]: `import { ${Component} } from "./${name}";

export default function ${Component}Demo() {
  return <${Component}>Your example content here</${Component}>;
}
`,
    [`${name}.test.tsx`]: `import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ${Component} } from "./${name}";

describe("${Component}", () => {
  it("renders its children", () => {
    render(<${Component}>Hello</${Component}>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("merges a custom className", () => {
    render(<${Component} className="custom">Hello</${Component}>);
    expect(screen.getByText("Hello")).toHaveClass("custom");
  });
});
`,
    [`${name}.mdx`]: `---
title: ${JSON.stringify(Component)}
description: ${JSON.stringify(description)}
# dependencies: ["lucide-react"]     # npm packages the component imports
# registryDependencies: ["loading-swap"]   # other dRhooks items it needs
---

## Overview

Explain what \`${Component}\` does and when to reach for it.

## Usage

\`\`\`tsx
import { ${Component} } from "@/components/ui/${name}";

export default function Example() {
  return <${Component}>Hello</${Component}>;
}
\`\`\`

## API Reference

| Prop        | Type        | Default | Description                  |
| ----------- | ----------- | ------- | ---------------------------- |
| \`className\` | \`string\`    | -       | Extra classes for the root.  |
| \`children\`  | \`ReactNode\` | -       | Content to render.           |
`,
  };
};

const main = async () => {
  const [rawKind, name, descriptionArg] = process.argv.slice(2);
  const kind = rawKind ? KINDS[rawKind] : undefined;

  if (!kind || !name) {
    console.error(`Usage:
  yarn new hook <name> ["description"]   e.g. yarn new hook use-toggle
  yarn new ui <name> ["description"]     e.g. yarn new ui toast-stack`);
    process.exit(1);
  }
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
    console.error(`"${name}" must be kebab-case (lowercase letters, digits, dashes).`);
    process.exit(1);
  }
  if (kind === "hook" && !name.startsWith("use-")) {
    console.error(`Hook names must start with "use-" (got "${name}").`);
    process.exit(1);
  }

  const dir = path.join(process.cwd(), "src/registry", kind === "hook" ? "hooks" : "ui", name);
  if (existsSync(dir)) {
    console.error(`${path.relative(process.cwd(), dir)} already exists. Nothing written.`);
    process.exit(1);
  }

  let description = descriptionArg;
  if (!description && process.stdin.isTTY) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    description = (await rl.question("Short description: ")).trim();
    rl.close();
  }
  description ||= `TODO: describe ${name}.`;

  const files = kind === "hook" ? hookFiles(name, description) : uiFiles(name, description);
  await mkdir(dir, { recursive: true });
  for (const [file, content] of Object.entries(files)) {
    await writeFile(path.join(dir, file), content);
    console.log(`  created ${path.relative(process.cwd(), path.join(dir, file))}`);
  }
  console.log("\nDone. `yarn dev` picks it up automatically; otherwise run `yarn registry`.");
};

await main();
