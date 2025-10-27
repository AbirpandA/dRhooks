import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import type { MDXComponents } from 'mdx/types';
import { CodeBlock} from 'fumadocs-ui/components/codeblock';

import { ComponentPreview } from './component-preview';
import { ComponentSource } from './component-source';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Pre: CodeBlock,
    ComponentSource,
    ComponentPreview,
    Tabs,
    Tab,
    Steps,
    Step,
    ...components,
  };
}