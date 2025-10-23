import type { Registry } from "shadcn/registry";

export const hooks: Registry["items"] = [
  {
    name: "use-debounce",
    description: "A small hook to debounce a value.",
    type: "registry:component",
    files: [
      {
        path: "new-york/hooks/use-debounce.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "use-fetch",
    description: "A hook to fetch data from an API endpoint with loading and error states.",
    type: "registry:component",
    dependencies: ["axios"],  
    files: [
      {
        path: "new-york/hooks/use-fetch.ts",
        type: "registry:ui",
      },
    ],
  },
];

export const hooksExamples: Registry["items"] = [
  {
    name: "use-debounce-demo",
    type: "registry:example",
    title: "useDebounce",
    description: "Demo for useDebounce hook",
    files: [
      {
        path: "new-york/examples/use-debounce-example.tsx",
        type: "registry:example",
      },
    ],
    registryDependencies: [],
  },
  {
    name: "use-fetch-demo",
    type: "registry:example",
    title: " useFetch",
    description: "Demo for useFetch hook",
    files: [
      {
        path: "new-york/examples/use-fetch-example.tsx",
        type: "registry:example",
      },
    ],
    registryDependencies: [],
  },
];
