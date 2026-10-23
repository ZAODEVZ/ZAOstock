import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// Search titles for the four pages people search for before a festival. A bare
// "Artists" or "Live" tells a searcher nothing; each carries the date and the
// place, from FESTIVAL so they cannot drift (2026-09-29, for the recrawl
// requested after Search Console verification).
const PAGES = ['artists', 'tickets', 'program', 'live'];
// /tickets became the ZAOstock 2027 ticket page on 2026-10-23. The 2027 date is
// Zaal's call and is not printed there, so its title carries the edition name
// in place of a date, and no town: the 2027 place is not set either
// (tickets.test.ts pins both rules).
const DATE_IN_TITLE: Record<string, string> = { tickets: 'NEXT_EDITION.name' };
const NO_PLACE = new Set(['tickets']);

describe('search titles carry the date and the place', () => {
  for (const p of PAGES) {
    it(`/${p}`, () => {
      const src = readFileSync(path.join(process.cwd(), 'src/app', p, 'page.tsx'), 'utf8');
      const head = src.slice(0, src.indexOf('openGraph:'));
      const title = head.match(/\n  title: (`[^`]+`|'[^']+'),/)?.[1] ?? '';
      expect(title, p).toContain(DATE_IN_TITLE[p] ?? 'FESTIVAL.shortDate');
      if (!NO_PLACE.has(p)) expect(title, p).toMatch(/Ellsworth|Eastern/);
    });
  }
});
