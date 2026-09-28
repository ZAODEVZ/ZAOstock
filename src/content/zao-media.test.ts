import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ZAO_MEDIA, MEDIA_ACTS, zaoMediaFor } from './zao-media';

describe('ZAO media links on the artist pages', () => {
  it('keys every entry by an act on the bill, by identity name', () => {
    for (const key of Object.keys(ZAO_MEDIA)) {
      expect(MEDIA_ACTS).toContain(key);
    }
  });

  it('covers all eight acts', () => {
    for (const name of MEDIA_ACTS) {
      expect(zaoMediaFor(name).length).toBeGreaterThan(0);
    }
  });

  it("links only The ZAO's own Paragraph publication, over https", () => {
    for (const items of Object.values(ZAO_MEDIA)) {
      for (const item of items) {
        expect(item.url).toMatch(/^https:\/\/paragraph\.com\/@thezao\/[a-z0-9-]+$/);
        expect(item.title.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('returns an empty list for a name that is not on the bill', () => {
    expect(zaoMediaFor('Not An Act')).toEqual([]);
  });

  it('is rendered on the artist page', () => {
    const page = readFileSync(path.join(process.cwd(), 'src/app/artist/[slug]/page.tsx'), 'utf8');
    expect(page).toContain('zaoMediaFor(artist.name)');
  });
});
