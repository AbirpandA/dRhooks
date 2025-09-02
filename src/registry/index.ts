import { type Registry } from 'shadcn/registry';
import { ui } from './registry-ui';
import { examples } from './registry-examples';

export const registry = {
  name: 'dr-hooks.io',
  homepage: 'https://dr-hooks-iqyd4arhp-abirpandas-projects.vercel.app/registry.json',
  items: [...ui,...examples],
} satisfies Registry;