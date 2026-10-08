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
});
