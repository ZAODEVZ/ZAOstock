import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';
import sharp from 'sharp';
import { getArtistBySlug } from '@/lib/artists';

/**
 * GET /artist/<slug>/flyer[?variant=ig] - a per-artist share flyer.
 *
 * Zaal, 2026-09-16 18:4x (relayed by the seat): "we should send the flyer
 * over to each artist with the artist flyers, we should include that."
 *
 * SCOPE MATCHES THE PUBLIC ROSTER, NOT A SEPARATE CHECK. `getArtistBySlug`
 * is the exact function the public /artist/<slug> page uses (see
 * src/lib/artists.ts's isOnBill) - an act not on the eight-act bill (a
 * cypher applicant) or declined (Hurricane) is a 404 here for the same
 * reason it is a 404 there, not a second gate someone could get out of
 * sync. NO SET TIME anywhere on the flyer - same public rule as everywhere
 * else (Zaal, 2026-09-12).
 *
 * The photo comes from the filesystem, not from `artist.photo_url` as a
 * URL to fetch - every photo processed for this festival so far
 * (dcoop.webp, lyons-den.webp, michael-anderson.webp) already lives at
 * `public/artists/<slug>.webp`, and reading it locally is one file read
 * instead of a network round trip inside an image-rendering function. An
 * act whose row happens to hold a non-repo URL (nobody's does today) falls
 * back to the name-only layout rather than fetching an arbitrary URL from
 * inside this route - the exact case the "renders no broken image" red
 * control is about.
 *
 * SATORI (this route's renderer, via next/og) CANNOT DECODE WEBP - measured
 * directly before writing this comment: `new ImageResponse` with a webp
 * data URI throws `u2 is not iterable` from inside its own bundled decoder,
 * no matter how the div around it is written. Every artist photo in this
 * repo is webp (the site's own convention). So every photo is converted to
 * PNG with `sharp` (already resolves in this project - Next's own image
 * optimizer depends on it - added here as a direct dependency since this
 * route now uses it by name, not just transitively) before it ever reaches
 * satori. Caught by a REAL render in route.test.ts, not a mock - a mocked
 * file-exists check would have shipped this broken.
 */
export const dynamic = 'force-dynamic';

const WIDE = { width: 1920, height: 1080 };
const IG = { width: 1080, height: 1350 };

const INK = '#141E27';
const GOLD = '#E0DDAA';

async function dataUri(relPath: string): Promise<string | null> {
  const abs = path.join(process.cwd(), 'public', relPath);
  if (!existsSync(abs)) return null;
  const buf = await readFile(abs);
  const ext = path.extname(abs).slice(1).toLowerCase();
  if (ext === 'webp') {
    const png = await sharp(buf).png().toBuffer();
    return `data:image/png;base64,${png.toString('base64')}`;
  }
  const mime = ext === 'png' ? 'image/png' : `image/${ext}`;
  return `data:${mime};base64,${buf.toString('base64')}`;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug).catch(() => null);
  if (!artist) {
    return new Response('Not found', { status: 404 });
  }

  const variant = request.nextUrl.searchParams.get('variant') === 'ig' ? 'ig' : 'wide';
  const size = variant === 'ig' ? IG : WIDE;

  const [poster, logo, photo, boogaloo] = await Promise.all([
    dataUri('flyers/poster-wide-no-logo.png'),
    dataUri('brand/logos/zaostock26_moose_600.png'),
    dataUri(`artists/${artist.slug}.webp`),
    readFile(path.join(process.cwd(), 'public', 'fonts', 'Boogaloo-Regular.ttf')),
  ]);

  const nameSize = variant === 'ig' ? 96 : 128;
  const infoSize = variant === 'ig' ? 30 : 34;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backgroundColor: INK,
          ...(poster
            ? { backgroundImage: `url(${poster})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {}),
          fontFamily: 'Helvetica, Arial, sans-serif',
          position: 'relative',
        }}
      >
        {/* A dark gradient panel so text stays readable over any part of the
            illustrated poster, rather than fighting its colours per-artist. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: variant === 'ig' ? '48px 56px' : '64px 96px',
            background: 'linear-gradient(0deg, rgba(20,30,39,0.92) 0%, rgba(20,30,39,0.55) 55%, rgba(20,30,39,0) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
            {logo && (
              // eslint-disable-next-line @next/next/no-img-element -- satori needs a plain img
              <img src={logo} alt="" width={72} height={72} style={{ objectFit: 'contain' }} />
            )}
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: GOLD }}>
              ZAOstock
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 40 }}>
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element -- satori needs a plain img
              <img
                src={photo}
                alt=""
                width={variant === 'ig' ? 220 : 260}
                height={variant === 'ig' ? 220 : 260}
                style={{ objectFit: 'cover', borderRadius: 20, border: `4px solid ${GOLD}`, flexShrink: 0 }}
              />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  fontFamily: 'Boogaloo',
                  fontSize: nameSize,
                  lineHeight: 1.05,
                  color: '#FFFFFF',
                  wordBreak: 'break-word',
                }}
              >
                {artist.name}
              </div>
              <div style={{ display: 'flex', fontSize: infoSize, marginTop: 16, color: GOLD, lineHeight: 1.35 }}>
                Saturday 3 October &middot; Franklin Street Parklet, Ellsworth, Maine &middot; free &middot; noon to six
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Boogaloo', data: boogaloo, style: 'normal', weight: 400 }],
      headers: { 'Cache-Control': 'public, max-age=3600' },
    },
  );
}
