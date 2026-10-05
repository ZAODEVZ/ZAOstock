import { describe, it, expect, vi } from 'vitest';

// artists.ts pulls the database client, which imports 'server-only'.
vi.mock('server-only', () => ({}));
import { existsSync } from 'node:fs';
import path from 'node:path';
import { eventJsonLd, artistSlug } from './event-jsonld';
import { LINEUP_NAMES, DID_NOT_PLAY } from './site';
import { slugify } from '@/lib/artists';
import { FESTIVAL } from './festival';

describe('MusicEvent structured data', () => {
  it('carries the three fields Search Console flagged: image, performer, street address', () => {
    expect(eventJsonLd.image.length).toBeGreaterThan(0);
    expect(eventJsonLd.performer.length).toBe(LINEUP_NAMES.length - DID_NOT_PLAY.length);
    expect(eventJsonLd.location.address.streetAddress).toBeTruthy();
    // No house number: the parklet has none, and "3 Franklin St" geocodes to
    // an office building ~140 m away (#382 review).
    expect(eventJsonLd.location.address.streetAddress).not.toMatch(/^\d/);
  });

  it('points the image at a file that ships in public/', () => {
    for (const url of eventJsonLd.image) {
      const rel = new URL(url).pathname;
      expect(existsSync(path.join(process.cwd(), 'public', rel)), rel).toBe(true);
    }
  });

  it('lists the bill in order, each linking the artist page the sitemap serves', () => {
    for (const name of LINEUP_NAMES) expect(artistSlug(name)).toBe(slugify(name));
    LINEUP_NAMES.filter((name) => !DID_NOT_PLAY.includes(name)).forEach((name, i) => {
      expect(eventJsonLd.performer[i].url).toBe(`https://zaostock.com/artist/${slugify(name)}`);
    });
  });

  // Zaal, 2026-10-04: "Acadia rising did not play". `performer` is a claim
  // that an act performed, so an act he has ruled out must not be in it.
  it('does not name as a performer an act that did not play', () => {
    expect(DID_NOT_PLAY.length).toBeGreaterThan(0);
    for (const name of DID_NOT_PLAY) {
      expect(LINEUP_NAMES).toContain(name);
      expect(eventJsonLd.performer.some((p) => p.url.endsWith(`/artist/${slugify(name)}`))).toBe(false);
    }
    expect(eventJsonLd.performer.some((p) => p.url.endsWith('/artist/the-crown-vics'))).toBe(true);
  });

  it('keeps the date and venue on the festival facts', () => {
    expect(eventJsonLd.startDate).toBe(FESTIVAL.date);
    expect(eventJsonLd.location.name).toBe(FESTIVAL.venue);
    expect(eventJsonLd.offers.price).toBe('0');
  });
});
