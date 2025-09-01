import type { Registry } from 'shadcn/registry';

export const examples: Registry['items'] = [
  {
    name: 'loading-swap-demo',
    type: 'registry:example',
    title: 'loading swap',
    description: 'Swaps content with a loading spinner without layout shift.',
    files: [
      {
        path: 'new-york/examples/loading-swap-example.tsx',
        type: 'registry:example',
      },
    ],
    registryDependencies: ['http://localhost:3000/r/loading-swap.json'],
  },
];