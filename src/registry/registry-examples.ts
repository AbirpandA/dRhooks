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
    registryDependencies: ['https://dr-hooks-iqyd4arhp-abirpandas-projects.vercel.app/r/loading-swap.json'],
  },
];