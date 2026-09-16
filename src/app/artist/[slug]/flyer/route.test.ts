import { describe, it, expect, vi } from 'vitest';

// REAL rendering, not mocked - next/og's ImageResponse runs standalone in
// plain Node (verified before writing this file: `new ImageResponse(...)`
// outside any Next.js request context still produces real PNG bytes), so
// this test exercises the actual satori/resvg path with the real poster
// background and the real Boogaloo font, which is the only way the file-size
// red control ("under 2 MB each") means anything - a mocked render could
// never be too big.

const { getArtistBySlug } = vi.hoisted(() => ({ getArtistBySlug: vi.fn() }));
vi.mock('@/lib/artists', () => ({ getArtistBySlug }));

import { GET } from './route';

const WITH_PHOTO = {
  id: '1',
  name: 'DCoop',
  slug: 'dcoop', // public/artists/dcoop.webp is a real, committed file
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

// A real act with no committed photo file - The Crown Vics, never processed.
const NO_PHOTO = { ...WITH_PHOTO, name: 'The Crown Vics', slug: 'the-crown-vics' };

function req(url: string) {
  return { nextUrl: new URL(url) } as unknown as Parameters<typeof GET>[0];
}

function params(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

describe('GET /artist/[slug]/flyer - real renders, not mocked', () => {
  it('404s for an act getArtistBySlug does not return - covers both a declined act and a wrong slug', async () => {
    getArtistBySlug.mockResolvedValue(null);
    const res = await GET(req('https://zaostock.com/artist/hurricane/flyer'), params('hurricane'));
    expect(res.status).toBe(404);
  });

  it('renders a real PNG under 2 MB for an act WITH a committed photo (wide)', async () => {
    getArtistBySlug.mockResolvedValue(WITH_PHOTO);
    const res = await GET(req('https://zaostock.com/artist/dcoop/flyer'), params('dcoop'));
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/png');
    const bytes = Buffer.from(await res.arrayBuffer());
    expect(bytes.length).toBeGreaterThan(1000); // a real image, not an empty/broken response
    expect(bytes.length).toBeLessThan(2 * 1024 * 1024);
  }, 20_000);

  // THE RED CONTROL, verbatim from the ask: "an act with no photo renders
  // the name-only layout without a broken image." The only way this could
  // fail is an unhandled reference to a missing file inside satori - which
  // a mock of `existsSync` could hide. This is a REAL act slug
  // (the-crown-vics) with NO public/artists/the-crown-vics.webp on disk.
  it('renders a real PNG, no crash, for an act with NO photo on disk (name-only layout)', async () => {
    getArtistBySlug.mockResolvedValue(NO_PHOTO);
    const res = await GET(req('https://zaostock.com/artist/the-crown-vics/flyer'), params('the-crown-vics'));
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/png');
    const bytes = Buffer.from(await res.arrayBuffer());
    expect(bytes.length).toBeGreaterThan(1000);
    expect(bytes.length).toBeLessThan(2 * 1024 * 1024);
  }, 20_000);

  it('renders the Instagram-portrait variant at a different size, still under 2 MB', async () => {
    getArtistBySlug.mockResolvedValue(WITH_PHOTO);
    const wide = await GET(req('https://zaostock.com/artist/dcoop/flyer'), params('dcoop'));
    const ig = await GET(req('https://zaostock.com/artist/dcoop/flyer?variant=ig'), params('dcoop'));
    const wideBytes = Buffer.from(await wide.arrayBuffer());
    const igBytes = Buffer.from(await ig.arrayBuffer());
    expect(igBytes.length).toBeLessThan(2 * 1024 * 1024);
    // Different aspect ratio, different pixel count - a real distinct render,
    // not the same image with a different query string ignored.
    expect(igBytes.length).not.toBe(wideBytes.length);
  }, 20_000);

  it('never renders a set time - the public rule holds here too', async () => {
    getArtistBySlug.mockResolvedValue(WITH_PHOTO);
    // The route source itself is the thing to check - the rendered PNG is
    // pixels, not text a test can grep. The same guarantee /program's own
    // test relies on: no clock-shaped literal in the source that renders.
    const src = await import('node:fs/promises').then((fs) => fs.readFile(new URL('./route.tsx', import.meta.url), 'utf8'));
    expect(src).not.toMatch(/\b\d{1,2}:[0-5]\d\b/);
  });
});
