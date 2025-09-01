// lib/source.ts - Import from .source (auto-generated), not source.config.ts
import { docs } from '../../.source'; 
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(), 
});

// Debug
console.log(docs);