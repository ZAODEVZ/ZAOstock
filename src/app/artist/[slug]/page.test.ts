import { describe, it, expect, vi } from 'vitest';

// THE RED CONTROL FOR THE 2026-09-16 AUDIT FINDING: no artist page carried a
// <link rel="canonical">, while every other crawled page (home, /program,
// /artists, /tickets, /partners, /press, etc.) had one. Tested directly
// against generateMetadata rather than a rendered page, the same way the
// route tests in this repo check a handler's return value without a full
// Next.js server.

const { getArtistBySlug } = vi.hoisted(() => ({ getArtistBySlug: vi.fn() }));
vi.mock('@/lib/artists', () => ({ getArtistBySlug, getRosterArtists: vi.fn(), verifyClaimToken: vi.fn() }));

import { generateMetadata } from './page';

const ARTIST = {
  id: '1',
  name: 'DCoop',
  slug: 'dcoop',
  genre: 'Hip-hop',
  city: 'The DMV',
  status: 'confirmed',
  socials: '',
  bio: 'x',
  photo_url: '/artists/dcoop.webp',
  logo_url: '',
  cypher_interested: false,
  cypher_role: '',
  points_earned: 0,
  volunteer_eligible: false,
  setOrder: 6,
};

function params(slug: string) {
  return { params: Promise.resolve({ slug }), searchParams: Promise.resolve({}) };
}

describe('generateMetadata for /artist/[slug]', () => {
  it('carries a canonical link to its own slug', async () => {
    getArtistBySlug.mockResolvedValue(ARTIST);
    const meta = await generateMetadata(params('dcoop'));
    expect(meta.alternates?.canonical).toBe('/artist/dcoop');
  });

  it('sets the same canonical for a different slug, not a copy-pasted constant', async () => {
    getArtistBySlug.mockResolvedValue({ ...ARTIST, name: 'LyonsDen', slug: 'lyonsden' });
    const meta = await generateMetadata(params('lyonsden'));
    expect(meta.alternates?.canonical).toBe('/artist/lyonsden');
  });

  it('does not crash for an act getArtistBySlug cannot find', async () => {
    getArtistBySlug.mockResolvedValue(null);
    const meta = await generateMetadata(params('nobody'));
    expect(meta.title).toBe('Artist not found');
  });

  // THE RED CONTROL FOR THE 2026-09-17 AUDIT FINDING. The root layout applies
  // a `%s | ZAOstock` title template to any plain-string title. A title of
  // `"${name} | ZAOstock Artist"` is not exempt from that template, so it
  // rendered live as "Tom Fellenz | ZAOstock Artist | ZAOstock" on all eight
  // artist pages - measured via curl, not assumed. `title.absolute` is the
  // fix: it opts out of the parent template entirely.
  it('uses title.absolute so the root layout does not double the "| ZAOstock" suffix', async () => {
    getArtistBySlug.mockResolvedValue(ARTIST);
    const meta = await generateMetadata(params('dcoop'));
    expect(meta.title).toEqual({ absolute: 'DCoop | ZAOstock Artist' });
  });
});
