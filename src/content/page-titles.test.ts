import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// Search titles for the four pages people search for before a festival. A bare
// "Artists" or "Live" tells a searcher nothing; each carries the date and the
// place, from FESTIVAL so they cannot drift (2026-09-29, for the recrawl
// requested after Search Console verification).
const PAGES = ['artists', 'tickets', 'program', 'live'];

describe('search titles carry the date and the place', () => {
  for (const p of PAGES) {
    it(`/${p}`, () => {
      const src = readFileSync(path.join(process.cwd(), 'src/app', p, 'page.tsx'), 'utf8');
      const head = src.slice(0, src.indexOf('openGraph:'));
      const title = head.match(/\n  title: (`[^`]+`|'[^']+'),/)?.[1] ?? '';
      expect(title, p).toContain('FESTIVAL.shortDate');
      expect(title, p).toMatch(/Ellsworth|Eastern/);
    });
  }
});
