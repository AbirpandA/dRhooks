import type { Registry } from 'shadcn/registry';

export const ui: Registry['items'] = [
  {
      "name": "loading-swap",
      "description": "Swaps content with a loading spinner without layout shift.",
      "type": "registry:component",
      "files": [
        {
          "path": "new-york/ui/loading-swap.tsx",
          "type": "registry:ui"
        }
      ]
    },
];