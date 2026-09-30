import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// Zaal, 2026-09-29 (zao-vault decisions/grill-2026-09-29-iman-desk-morning.md
// item 4): act 7 reads "LyonsDen Rez Muzik" everywhere. The lineup rows /live
// renders carry the identity name ("LyonsDen", which the slug and sitemap use),
// so the page must wrap the visible text in displayName(), as /program does.
describe('/live shows each act by its display name', () => {
  it('page.tsx renders displayName(act.name), and still slugs from the identity', () => {
    const page = readFileSync(path.join(process.cwd(), 'src/app/live/page.tsx'), 'utf8');
    expect(page).toContain('{displayName(act.name)}');
    expect(page).toContain('slugify(act.name)');
  });
});
