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
  {
      "name": "bounce-button",
      "description": "An interactive button with smooth hover lift and click scale animations for enhanced user feedback.",
      "type": "registry:component",
      "files": [
        {
          "path": "new-york/ui/bounce-button.tsx",
          "type": "registry:ui"
        }
      ]
    },
  {
      "name": "shimmer-text",
      "description": "A text component that displays a shimmering loading effect.",
      "type": "registry:component",
      "dependencies": ["motion/react"],
      "files": [
        {
          "path": "new-york/ui/shimmer-text.tsx",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "prompt-input",
      "description": " A versatile input component for chat prompts with file attachment support.",
      "type": "registry:component",
      "dependencies": [ "lucide-react" ],
      registryDependencies: ["https://dr-hooks-6t7r69njm-abirpandas-projects.vercel.app/r/loading-swap.json"],
      "files": [
        {
          "path": "new-york/ui/prompt-input.tsx",
          "type": "registry:ui"
        }
      ]
    },
    
];