import { type Registry } from "shadcn/registry";
import { ui } from "./registry-ui";
import { examples } from "./registry-examples";
import { hooks, hooksExamples } from "./registry-hooks";

export const registry = {
  name: "dr-hooks.io",
  homepage:
    "https://dr-hooks.vercel.app/registry.json",
  items: [...ui, ...examples, ...hooks, ...hooksExamples],
} satisfies Registry;
