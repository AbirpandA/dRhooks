import type { Registry } from 'shadcn/registry';

export const examples: Registry['items'] = [
   {
    name: 'bounce-button-demo',
    type: 'registry:example',
    title: 'Bounce Button',
    description: 'An interactive button with smooth hover lift and click scale animations for enhanced user feedback.',
    files: [
      {
        path: 'new-york/examples/bounce-button-example.tsx',
        type: 'registry:example',
      },
    ],
    registryDependencies: ['https://dr-hooks-iqyd4arhp-abirpandas-projects.vercel.app/r/bounce-button.json'],
  },
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