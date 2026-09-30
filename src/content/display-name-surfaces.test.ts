import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// Zaal, 2026-09-29 (zao-vault decisions/grill-2026-09-29-iman-desk-morning.md
// item 4): act 7 reads "LyonsDen Rez Muzik" everywhere a visitor sees it. The
// identity "LyonsDen" stays for slugs, the sitemap and the DB join. Found
// rendering the bare identity by the #384 review; each surface now goes
// through displayName(), and this holds it there.
const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');

describe('visitor-facing act names go through displayName()', () => {
  it('/artists listing', () => {
    expect(read('src/app/artists/page.tsx')).toContain('{displayName(act.name)}');
  });

  it('/artist/[slug] title, share cards, description and body', () => {
    const src = read('src/app/artist/[slug]/page.tsx');
    expect(src).toContain('const shown = displayName(artist.name);');
    expect(src).not.toMatch(/`\$\{artist\.name\}/);
    expect(src).not.toMatch(/\{artist\.name\} is on the ZAOstock roster/);
  });

  it('the shareable artist flyer', () => {
    expect(read('src/app/artist/[slug]/flyer/route.tsx')).toContain('{displayName(artist.name)}');
  });

  it('/zaoville schedule', () => {
    expect(read('src/app/zaoville/page.tsx')).toContain('{displayName(s.label)}');
  });
});
