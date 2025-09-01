import * as React from 'react';
import { notFound } from 'next/navigation';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';

import { source } from '@/lib/source';
import { getMDXComponents } from '@/components/mdx';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  
  // Debug logging
  console.log('Resolved params:', resolvedParams);
  console.log('Slug:', resolvedParams.slug);
  
  const page = source.getPage(resolvedParams.slug);
  
  // More debug logging
  console.log('Found page:', !!page);
  console.log('Available pages:', source.getPages().map(p => p.url));
  
  if (!page) {
    console.log('Page not found for slug:', resolvedParams.slug);
    notFound();
  }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}