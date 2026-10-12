import { describe, it, expect, vi } from 'vitest';

// artists.ts pulls the database client, which imports 'server-only'.
vi.mock('server-only', () => ({}));
import { existsSync } from 'node:fs';
import path from 'node:path';
import { eventJsonLd, artistSlug } from './event-jsonld';
import { LINEUP_NAMES, RETIRED_ACT_SLUGS } from './site';
import { slugify } from '@/lib/artists';
import { FESTIVAL } from './festival';

describe('MusicEvent structured data', () => {
  it('carries the three fields Search Console flagged: image, performer, street address', () => {
    expect(eventJsonLd.image.length).toBeGreaterThan(0);
    expect(eventJsonLd.performer.length).toBe(LINEUP_NAMES.length);
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
    LINEUP_NAMES.forEach((name, i) => {
      expect(eventJsonLd.performer[i].url).toBe(`https://zaostock.com/artist/${slugify(name)}`);
    });
  });

  // Zaal, 2026-10-05: the act that did not show up is retired from public copy.
  // `performer` is a claim that an act performed, so it must not be in it.
  it('does not name a retired act as a performer', () => {
    expect(RETIRED_ACT_SLUGS.length).toBeGreaterThan(0);
    for (const slug of RETIRED_ACT_SLUGS) {
      expect(LINEUP_NAMES.map(slugify)).not.toContain(slug);
      expect(eventJsonLd.performer.some((p) => p.url.endsWith(`/artist/${slug}`))).toBe(false);
    }
    expect(eventJsonLd.performer.some((p) => p.url.endsWith('/artist/the-crown-vics'))).toBe(true);
  });

  it('keeps the date and venue on the festival facts', () => {
    expect(eventJsonLd.startDate).toBe(FESTIVAL.date);
    expect(eventJsonLd.location.name).toBe(FESTIVAL.venue);
    expect(eventJsonLd.offers.price).toBe('0');
  });
});
