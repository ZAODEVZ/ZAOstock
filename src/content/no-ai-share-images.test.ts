import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { OG_IMAGE } from '@/lib/meta';

// NO CODE-DRAWN PROMO IMAGES (Zaal, 2026-10-08: "Let's start removing").
// For some of the Maine audience, AI-made promo, marketing and design is a deal
// breaker; AI for code is fine, and design is led by a person. The site-wide
// share card (src/app/opengraph-image.tsx) and the per-artist flyer route
// (src/app/artist/[slug]/flyer) both drew images with next/og, so both came
// out. This holds the line: no ImageResponse anywhere, no image routes, and
// the share image is a committed human-made file.

function filesUnder(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) out.push(...filesUnder(full));
    else out.push(full);
  }
  return out;
}

const SRC = path.join(process.cwd(), 'src');
const code = filesUnder(SRC).filter((f) => /\.(ts|tsx)$/.test(f) && !f.endsWith('no-ai-share-images.test.ts'));

describe('no code-drawn share or promo images', () => {
  it('has no next/og ImageResponse anywhere under src', () => {
    expect(code.filter((f) => /\bImageResponse\b|from ['"]next\/og['"]/.test(readFileSync(f, 'utf8')))).toEqual([]);
  });

  it('has no opengraph-image or twitter-image route files', () => {
    expect(code.filter((f) => /\/(opengraph|twitter)-image\.(ts|tsx|js)$/.test(f))).toEqual([]);
  });

  it('has no per-artist flyer route, and nothing links to one', () => {
    expect(existsSync(path.join(SRC, 'app/artist/[slug]/flyer'))).toBe(false);
    expect(code.filter((f) => readFileSync(f, 'utf8').includes('/flyer`') || readFileSync(f, 'utf8').includes('/flyer?'))).toEqual([]);
  });

  it('uses a committed, human-made file as the share image', () => {
    expect(OG_IMAGE.url.startsWith('/brand/posters/')).toBe(true);
    expect(existsSync(path.join(process.cwd(), 'public', OG_IMAGE.url))).toBe(true);
  });

  // Next.js replaces, not merges, a page's openGraph: a page that sets none
  // gets the root layout's whole object. With the implicit opengraph-image
  // file gone, the root layout must carry the image itself, or ten pages share
  // with no picture.
  it('gives the root layout an explicit share image, for pages with no openGraph of their own', () => {
    const layout = readFileSync(path.join(SRC, 'app/layout.tsx'), 'utf8');
    const og = layout.slice(layout.indexOf('openGraph: {'), layout.indexOf('twitter: {'));
    const tw = layout.slice(layout.indexOf('twitter: {'), layout.indexOf('};', layout.indexOf('twitter: {')));
    expect(og).toContain('images: [OG_IMAGE]');
    expect(tw).toContain('images: [OG_IMAGE.url]');
  });

  it('those pages really have no openGraph of their own, so they inherit it', () => {
    for (const page of ['app/pitch/page.tsx', 'app/circles/page.tsx', 'app/sponsor/deck/page.tsx', 'app/backstage/page.tsx']) {
      expect(readFileSync(path.join(SRC, page), 'utf8')).not.toContain('openGraph');
    }
  });
});
