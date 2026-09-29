import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// /onepagers and every /onepagers/[slug] briefing are working documents for
// sponsors, partners and city contacts: reachable by link, kept out of search
// (#394). Dotfiles' review of #394 found the [slug] noindex unpinned; this pins
// both, so a refactor cannot silently put the briefings back in the index.
const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');

describe('/onepagers stays out of the search index', () => {
  it('the index page sets robots index:false', () => {
    expect(read('src/app/onepagers/page.tsx')).toMatch(/robots:\s*\{\s*index:\s*false/);
  });

  it('every briefing\'s generateMetadata returns robots index:false', () => {
    const src = read('src/app/onepagers/[slug]/page.tsx');
    const gm = src.slice(src.indexOf('export async function generateMetadata'), src.indexOf('export default'));
    expect(gm).toMatch(/robots:\s*\{\s*index:\s*false/);
  });

  it('the public overview one-pager is NOT noindexed', () => {
    expect(read('src/app/onepagers/overview/page.tsx')).not.toMatch(/index:\s*false/);
  });
});
