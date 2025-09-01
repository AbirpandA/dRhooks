import { type Registry } from 'shadcn/registry';
import { ui } from './registry-ui';
import { examples } from './registry-examples';

export const registry = {
  name: 'dr-hooks.io',
  homepage: 'http://localhost:3000/registry.json',
  items: [...ui,...examples],
} satisfies Registry;