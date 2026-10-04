import { describe, it, expect, vi } from 'vitest';

// artists.ts pulls the database client, which imports 'server-only'.
vi.mock('server-only', () => ({}));
import { existsSync } from 'node:fs';
import path from 'node:path';
import { eventJsonLd, artistSlug } from './event-jsonld';
import { LINEUP_NAMES } from './site';
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
    LINEUP_NAMES.forEach((name, i) => {
      expect(artistSlug(name)).toBe(slugify(name));
      expect(eventJsonLd.performer[i].url).toBe(`https://zaostock.com/artist/${slugify(name)}`);
    });
  });

  it('keeps the date and venue on the festival facts', () => {
    expect(eventJsonLd.startDate).toBe(FESTIVAL.date);
    expect(eventJsonLd.location.name).toBe(FESTIVAL.venue);
    expect(eventJsonLd.offers.price).toBe('0');
  });
});
