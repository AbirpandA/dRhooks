import { DocsLayout, type DocsLayoutProps } from 'fumadocs-ui/layouts/notebook';
import type { ReactNode } from 'react';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { GithubInfo } from 'fumadocs-ui/components/github-info';


const docsOptions: DocsLayoutProps = {
  ...baseOptions(),
  tree: source.pageTree,
  links: [
    {
      type: 'custom',
      children: (
        <GithubInfo owner="AbirpandA" repo="dRhooks
"  />
      ),
      
    },
    
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsLayout {...docsOptions} >{children}</DocsLayout>;
}