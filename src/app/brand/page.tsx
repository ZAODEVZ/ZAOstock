import { Metadata } from 'next';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import { SiteShell, Section, Eyebrow, SectionHeader, Card, Button } from '@/components/poster';
import { COLOURS, FONTS } from '@/content/design-kit';
import { FESTIVAL } from '@/content/festival';
import { LINEUP_NAMES } from '@/content/site';
import { CopyBlock } from './CopyBlock';

// The brand asset library. Zaal, 2026-09-16: "we need all this ZAOstock on
// the website stat" (a screenshot of Candy's Telegram file drop) - this page
// is that drop, catalogued, plus the poster/logo set already in
// public/brand/ from the 2026-08-21 rebrand (docs/brand/README.md).
//
// TWO CREDITS, NOT ONE. The primary mark (zaostock26_moose.png, used
// site-wide via SITE.logo) is attabotty's - see docs/brand/README.md, "The
// mark is the moose... by attabotty". Everything added on this page from
// the 2026-09-16 drop is Samantha "Candy" (CandyToyBox)'s - the retro-poster
// palette, the poster references, the wordmark and the moose colourways.
// Do not credit the whole page to one person; each asset says whose it is.
//
// ONE ASSET DELIBERATELY LEFT OUT of this drop: a moose-mark variant reading
// "EST 2017". That date is wrong - ZAO started in 2024
// (src/content/site.ts weeklySessions: "since 30 July 2024"; src/app/page.tsx
// already strips an identical "Est. 2017" claim from Candy's original build
// for the same reason) - so it is not published here. Flagged to the seat
// rather than silently dropped.
//
// ONE FILE FLAGGED, NOT COMMITTED: the vault's zaostock-new-1536x1024.png
// poster reference is 3.3 MB, over the 2 MB budget for this PR. It still
// lives at ~/zao-vault/images/zaostock/poster/zaostock-new-1536x1024.png;
// ask for a compressed export before publishing it here.
//
// DRONE SHOTS: Zaal mentioned having some but had not sent them as of this
// PR. Not hunted for - asked for through the seat instead.

export const metadata: Metadata = {
  title: 'Brand',
  description: 'ZAOstock brand assets: logos, posters, textures and the palette, for anyone building something that needs to look like ZAOstock.',
  alternates: { canonical: '/brand' },
  openGraph: {
    title: 'Brand | ZAOstock',
    description: 'ZAOstock brand assets: logos, posters, textures and the palette.',
    url: 'https://zaostock.com/brand',
    images: [OG_IMAGE],
  },
  twitter: twitterCard(
    'Brand | ZAOstock',
    'ZAOstock brand assets: logos, posters, textures and the palette.',
  ),
};

type Asset = {
  name: string;
  src: string;
  width: number;
  height: number;
  bytes: string;
  format: string;
  credit: string;
  use: string;
};

const LOGOS: Asset[] = [
  {
    name: 'The moose, primary mark',
    src: '/brand/logos/zaostock26_moose.png',
    width: 4000,
    height: 4000,
    bytes: '644 KB',
    format: 'PNG, transparent',
    credit: 'attabotty',
    use: 'Default everywhere. This is the mark SITE.logo points at.',
  },
  {
    name: 'The moose, web-sized',
    src: '/brand/logos/zaostock26_moose_600.png',
    width: 600,
    height: 600,
    bytes: '115 KB',
    format: 'PNG, transparent',
    credit: 'attabotty',
    use: 'Small placements - favicons, cards, anywhere 4000px is overkill.',
  },
  {
    name: 'The moose, alt render',
    src: '/brand/logos/zaostock-logo-1024.png',
    width: 1024,
    height: 1024,
    bytes: '117 KB',
    format: 'PNG, transparent',
    credit: 'Candy (CandyToyBox)',
    use: 'Same mark, a second export. Use the primary mark unless this one fits a spot better.',
  },
  {
    // Measured 2026-09-19 after a sweep flagged this: the file is 82%
    // transparent (alpha histogram), and the opaque 18% samples near-white
    // (~224,224,224), not black. The old "white on black" / "opaque black
    // background" label described a file this one has never been - fixed to
    // what it measures as. It vanishes on a light page for the same reason
    // the /design moose does; a true black-background export is a separate
    // ask to Candy, not this fix.
    name: 'The moose, near-white on transparent',
    src: '/brand/logos/zaostock-moose-alt-4000.png',
    width: 4000,
    height: 4000,
    bytes: '598 KB',
    format: 'PNG, transparent (82% alpha=0)',
    credit: 'Candy (CandyToyBox)',
    use: 'Dark-background placements - the mark itself is near-white, so it needs a dark card behind it.',
  },
  {
    name: 'ZAOSTOCK, brush lettering',
    src: '/brand/logos/zaostock-brush-lettering-black.png',
    width: 253,
    height: 85,
    bytes: '29 KB',
    format: 'PNG, transparent',
    credit: 'Candy (CandyToyBox)',
    use: 'Wordmark only, no moose - a small-space or type-only placement.',
  },
];

const POSTERS: Asset[] = [
  {
    name: 'Wide poster, with logo',
    src: '/brand/posters/wide-with-logo-1920x1080.png',
    width: 1920,
    height: 1080,
    bytes: '1.94 MB',
    format: 'PNG',
    credit: 'Candy (CandyToyBox)',
    use: 'Full-bleed poster background, logo already placed.',
  },
  {
    name: 'Wide poster, no logo',
    src: '/brand/posters/wide-no-logo-1920x1080.png',
    width: 1920,
    height: 1080,
    bytes: '1.84 MB',
    format: 'PNG',
    credit: 'Candy (CandyToyBox)',
    use: 'The base for placing your own type or a different logo lockup - the flyer route composites onto this one.',
  },
  {
    name: 'Poster reference, full',
    src: '/brand/posters/reference-4000x4000.png',
    width: 4000,
    height: 4000,
    bytes: '598 KB',
    format: 'PNG',
    credit: 'Candy (CandyToyBox)',
    use: 'Large-format reference, square crop.',
  },
  {
    name: 'Title card reference',
    src: '/brand/posters/title-reference-1545x1999.png',
    width: 1545,
    height: 1999,
    bytes: '1.43 MB',
    format: 'PNG',
    credit: 'Candy (CandyToyBox)',
    use: 'Portrait title-card layout reference.',
  },
  {
    name: 'The moose, wild and abstract',
    src: '/brand/posters/moose-abstract-black-1024.jpg',
    width: 1024,
    height: 1024,
    bytes: '121 KB',
    format: 'JPEG, black studio background',
    credit: 'Candy (CandyToyBox)',
    use: 'Presentation render, not a transparent file - reference only.',
  },
  {
    name: 'The moose, on cracked cement',
    src: '/brand/posters/moose-cracked-cement-red-1024.png',
    width: 1024,
    height: 1024,
    bytes: '1.24 MB',
    format: 'PNG, opaque textured background',
    credit: 'Candy (CandyToyBox)',
    use: 'Presentation tile, not a transparent file - reference only.',
  },
];

const SOCIAL: Asset[] = [
  {
    name: 'Profile picture',
    src: '/brand/social/profile-1000x1000.png',
    width: 1000,
    height: 1000,
    bytes: '~120 KB',
    format: 'PNG',
    credit: 'attabotty (moose), composited for this crop',
    use: 'Square avatar - Discord, X, Instagram, LinkedIn.',
  },
  {
    name: 'Cover / banner',
    src: '/brand/social/cover-1500x500.png',
    width: 1500,
    height: 500,
    bytes: '~90 KB',
    format: 'PNG',
    credit: 'attabotty (moose), composited for this crop',
    use: 'Wide banner - X header, Facebook cover, LinkedIn banner.',
  },
  {
    name: 'Story / post',
    src: '/brand/social/story-1080x1920.png',
    width: 1080,
    height: 1920,
    bytes: '~180 KB',
    format: 'PNG',
    credit: 'attabotty (moose), composited for this crop',
    use: 'Tall - Instagram/Facebook Story, TikTok, a full-screen post.',
  },
];

// Three lengths, the same facts every time - not retyped, so a date or
// venue change on this page can never drift from what /brand's own
// download links point at.
const COPY_BLOCKS = [
  {
    label: 'Short (social bio, ~150 chars)',
    text: `ZAOstock - ${LINEUP_NAMES.length} acts, ${FESTIVAL.dateLabel}, ${FESTIVAL.venue}, ${FESTIVAL.city}. ${FESTIVAL.admission}.`,
  },
  {
    label: 'Medium (one paragraph)',
    text: `ZAOstock is a free, independent music festival on ${FESTIVAL.dateLabel} at the ${FESTIVAL.venue} in ${FESTIVAL.city} - ${LINEUP_NAMES.length} acts, ${FESTIVAL.window}, ${FESTIVAL.admission.toLowerCase()}. The evening continues at ${FESTIVAL.afterParty.name}, ${FESTIVAL.afterParty.note}.`,
  },
  {
    label: 'Long (press-style)',
    text: `ZAOstock returns to ${FESTIVAL.city} on ${FESTIVAL.dateLabel}, bringing ${LINEUP_NAMES.length} independent acts to the ${FESTIVAL.venue} for a free, all-ages afternoon of music, ${FESTIVAL.window}. There is no ticket cost and no gate. When the outdoor stage wraps, the night moves ${FESTIVAL.afterParty.note} to ${FESTIVAL.afterParty.name} for the official after-party. ZAOstock is built and run by an independent community of musicians and digital creators - not a label, not a venue chain.`,
  },
];

const TASKS: Array<{ label: string; href: string }> = [
  { label: 'I need a logo', href: '#logos' },
  { label: 'How do I use it', href: '#usage' },
  { label: 'I need a poster', href: '#posters' },
  { label: 'I need a social image', href: '#social' },
  { label: 'I need words to paste', href: '#copy' },
];

const TEXTURES: Asset[] = [
  {
    name: 'Cracked cement',
    src: '/brand/textures/cracked-cement.jpeg',
    width: 1024,
    height: 1024,
    bytes: '1.16 MB',
    format: 'JPEG',
    credit: 'Candy (CandyToyBox)',
    use: 'The texture behind the "moose on cracked cement" poster tile above - usable on its own for a distressed background.',
  },
];

// Hex values come from design-kit.ts's COLOURS (the /design page's own
// source, itself matching globals.css's live .site scope) rather than being
// typed here a second time - two copies is how Red 500 went stale for a
// year while /design stayed current. A token missing from COLOURS throws at
// build time instead of silently falling back to a guessed hex.
function liveHex(token: string): string {
  const c = COLOURS.find((c) => c.token === token);
  if (!c) throw new Error(`design-kit.ts has no COLOURS entry for token "${token}"`);
  return c.hex;
}

const PALETTE: Array<{ name: string; hex: string; note?: string }> = [
  { name: 'Red 500', hex: liveHex('red-500'), note: "fireside - the brand's primary" },
  { name: 'Gold 400', hex: liveHex('gold-400') },
  { name: 'Denim 400', hex: liveHex('denim-400'), note: 'pine' },
  { name: 'Olive 400', hex: liveHex('olive-400') },
  { name: 'Paper 100', hex: liveHex('paper-100'), note: 'ground - not white' },
  { name: 'Ink 950', hex: liveHex('ink-950'), note: 'text - not black' },
];

// A checkerboard, not a flat tint: some marks here are white-on-transparent,
// some are black-on-transparent, in the same grid - a single flat backing
// color would wash one or the other out, the way a light tint against the
// paper-200 card did until this was measured against an actual render.
const TRANSPARENCY_GRID = {
  backgroundImage:
    'linear-gradient(45deg, #C9BFA8 25%, transparent 25%), linear-gradient(-45deg, #C9BFA8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #C9BFA8 75%), linear-gradient(-45deg, transparent 75%, #C9BFA8 75%)',
  backgroundSize: '16px 16px',
  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
};

function AssetCard({ a, checker }: { a: Asset; checker?: boolean }) {
  return (
    <li className="bg-paper-200 border-[1.5px] border-gold-500/60 rounded-[14px] shadow-hard overflow-hidden list-none flex flex-col">
      {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset, not optimised */}
      <img
        src={a.src}
        alt={a.name}
        className="w-full h-40 object-contain p-3"
        style={checker ? TRANSPARENCY_GRID : { backgroundColor: 'color-mix(in oklch, var(--color-ink-950) 5%, transparent)' }}
        loading="lazy"
      />
      <div className="p-4 flex flex-col gap-1.5">
        <p className="text-sm font-bold text-ink-950 m-0">{a.name}</p>
        <p className="text-xs text-ink-muted m-0">
          {a.width}&times;{a.height} &middot; {a.format} &middot; {a.bytes}
        </p>
        <p className="text-xs text-ink-secondary m-0">{a.use}</p>
        <p className="text-xs text-ink-muted m-0">Credit: {a.credit}</p>
        <a href={a.src} download className="mt-2 text-sm font-bold underline underline-offset-4 text-ink-950">
          Download
        </a>
      </div>
    </li>
  );
}

function AssetGrid({ assets, checker }: { assets: Asset[]; checker?: boolean }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 m-0 p-0">
      {assets.map((a) => (
        <AssetCard key={a.src} a={a} checker={checker} />
      ))}
    </ul>
  );
}

export default function BrandPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Brand · ZAOstock 2026</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">
            Everything that makes it look like ZAOstock.
          </h1>
          <p className="text-lg text-ink-secondary measure m-0">
            Logos, posters, a texture, the palette and the font. If you are building anything with the ZAOstock name on it, start here.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {TASKS.map((t) => (
              <Button key={t.href} href={t.href} variant="secondary" size="sm">
                {t.label}
              </Button>
            ))}
          </div>
          <div className="mt-4">
            {/* A plain anchor, not the Button/Link primitive - this is a
                public/ static file, not an app route, and every other
                download on this page (AssetCard below) is a plain <a
                download> for the same reason. */}
            <a
              href="/brand/zaostock-brand-kit.zip"
              download
              className="poster-motion inline-flex items-center justify-center gap-2 font-sans font-bold uppercase tracking-[0.08em] whitespace-nowrap rounded-pill bg-linear-to-b from-fireside to-ember text-onfill shadow-hard hover:-translate-y-0.5 hover:shadow-hard-lg text-sm px-[26px] py-[13px]"
            >
              Download everything (.zip)
            </a>
          </div>
        </div>
      </Section>

      <Section id="logos">
        <SectionHeader eyebrow="Marks" title="Logos." className="mb-4" />
        <AssetGrid assets={LOGOS} checker />
        <div className="mt-4 bg-paper-200 border-[1.5px] border-gold-500/60 rounded-[14px] shadow-hard p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-muted m-0 mb-3">
            The near-white moose, on light vs. dark
          </p>
          <div className="grid grid-cols-2 gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset, not optimised */}
            <img
              src="/brand/logos/zaostock-moose-alt-4000.png"
              alt="The near-white moose on a light background - nearly invisible"
              className="w-full h-32 object-contain rounded-[10px] p-2"
              style={{ backgroundColor: liveHex('paper-100') }}
              loading="lazy"
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset, not optimised */}
            <img
              src="/brand/logos/zaostock-moose-alt-4000.png"
              alt="The near-white moose on a dark background - the way to actually use it"
              className="w-full h-32 object-contain rounded-[10px] p-2"
              style={{ backgroundColor: liveHex('ink-950') }}
              loading="lazy"
            />
          </div>
          <p className="text-xs text-ink-secondary mt-3 mb-0">
            Left: on Paper 100, the mark all but disappears. Right: on Ink 950, it reads. Always give this file a dark card.
          </p>
        </div>
      </Section>

      <Section id="usage">
        <SectionHeader eyebrow="How to use it" title="Clear space, minimum size, and what not to do." className="mb-4" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="bg-paper-200 border-[1.5px] border-gold-500/60 rounded-[14px] shadow-hard p-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-muted m-0 mb-3">Clear space</p>
            <div className="flex items-center justify-center bg-ink-950 rounded-[10px] p-8">
              {/* The padding above (p-8, 32px) is a visual stand-in for "leave
                  room" - illustrative, not a measured ratio. The rule in the
                  copy below is the real one. */}
              {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset, not optimised */}
              <img src="/brand/logos/zaostock26_moose_600.png" alt="The moose with clear space around it" className="w-32 h-32 object-contain" />
            </div>
            <p className="text-xs text-ink-secondary mt-3 mb-0">
              Keep empty space around the mark equal to at least 10% of its own width on every side - nothing else (text, another
              logo, an edge of the frame) inside that margin. The mark is a dense, detailed illustration; crowding it is what
              breaks it first, before size does.
            </p>
          </div>
          <div className="bg-paper-200 border-[1.5px] border-gold-500/60 rounded-[14px] shadow-hard p-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-muted m-0 mb-3">Minimum size</p>
            <div className="flex items-end justify-center gap-4 bg-ink-950 rounded-[10px] p-4">
              {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset, not optimised */}
              <img src="/brand/logos/zaostock26_moose_600.png" alt="The moose at 32px - too small" width={32} height={32} />
              {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset, not optimised */}
              <img src="/brand/logos/zaostock26_moose_600.png" alt="The moose at 64px - the floor" width={64} height={64} />
            </div>
            <p className="text-xs text-ink-secondary mt-3 mb-0">
              Never render the full mark (moose + wordmark) below <strong>64px</strong> wide. Determined by actually rendering it at
              16 through 96px and looking, not assumed: the ZAOSTOCK wordmark inside the mark is illegible under ~40px and still
              marginal at 48px - 64px is the first size where it reads cleanly. Need something smaller than that? Use the
              web-sized or alt-render mark on its own, or the wordmark-only lettering file above, not a shrunk full mark.
            </p>
          </div>
        </div>
        <div className="mt-4 bg-paper-200 border-[1.5px] border-gold-500/60 rounded-[14px] shadow-hard p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-muted m-0 mb-3">Don&rsquo;t</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {/* Each "don't" below is the SAME real logo file, distorted with a
                CSS transform to demonstrate the misuse - not a real exported
                asset, nothing here is downloadable or meant to be copied. */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center bg-ink-950 rounded-[10px] p-4 w-full h-28">
                {/* eslint-disable-next-line @next/next/no-img-element -- illustrative CSS distortion, not a real asset */}
                <img src="/brand/logos/zaostock26_moose_600.png" alt="Don't stretch it" className="w-full h-full object-fill" />
              </div>
              <p className="text-xs text-ink-muted m-0">Don&rsquo;t stretch it</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center bg-ink-950 rounded-[10px] p-4 w-full h-28">
                {/* eslint-disable-next-line @next/next/no-img-element -- illustrative CSS distortion, not a real asset */}
                <img src="/brand/logos/zaostock26_moose_600.png" alt="Don't skew it" className="w-20 h-20 object-contain [transform:skew(-18deg,8deg)]" />
              </div>
              <p className="text-xs text-ink-muted m-0">Don&rsquo;t skew it</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex items-center justify-center rounded-[10px] p-4 w-full h-28"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #e0ddaa 0 8px, #b3392c 8px 16px, #4a6741 16px 24px)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- illustrative misuse, real asset on a busy background */}
                <img src="/brand/logos/zaostock26_moose_600.png" alt="Don't place it on a busy background" className="w-20 h-20 object-contain" />
              </div>
              <p className="text-xs text-ink-muted m-0">Don&rsquo;t bury it in a busy background</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center bg-ink-950 rounded-[10px] p-4 w-full h-28">
                {/* eslint-disable-next-line @next/next/no-img-element -- illustrative CSS distortion, not a real asset */}
                <img
                  src="/brand/logos/zaostock26_moose_600.png"
                  alt="Don't add a drop shadow or glow"
                  className="w-20 h-20 object-contain [filter:drop-shadow(0_0_10px_#e0ddaa)_drop-shadow(4px_6px_0_#b3392c)]"
                />
              </div>
              <p className="text-xs text-ink-muted m-0">Don&rsquo;t add a drop shadow or glow</p>
            </div>
          </div>
        </div>
      </Section>

      <details className="group">
        <summary className="cursor-pointer list-none px-6 sm:px-0">
          <div className="flex items-center gap-2 py-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-muted">More assets</span>
            <span className="text-xs text-ink-muted">Posters, textures, the logo animation - reference material, open to browse</span>
            <span className="ml-auto text-ink-muted transition-transform group-open:rotate-180">&#9660;</span>
          </div>
        </summary>

        <Section id="posters">
          <SectionHeader eyebrow="Reference" title="Posters." className="mb-4" />
          <AssetGrid assets={POSTERS} />
        </Section>

        <Section id="textures">
          <SectionHeader eyebrow="Surface" title="Textures." className="mb-4" />
          <AssetGrid assets={TEXTURES} />
        </Section>

        <Section id="video">
          <SectionHeader eyebrow="Motion" title="Logo animation." className="mb-4" />
          <Card className="max-w-[520px]">
            <video src="/brand/video/logo-draw-animation.mp4" controls muted loop playsInline className="w-full rounded-[10px] border-[1.5px] border-ink-950/20" />
            <p className="text-xs text-ink-muted mt-3 mb-0">MP4 &middot; 1.77 MB &middot; Credit: Candy (CandyToyBox)</p>
            <a href="/brand/video/logo-draw-animation.mp4" download className="mt-2 inline-block text-sm font-bold underline underline-offset-4 text-ink-950">
              Download
            </a>
          </Card>
        </Section>
      </details>

      <Section id="social">
        <SectionHeader eyebrow="Ready-made" title="Social crops." className="mb-4" />
        <p className="text-sm text-ink-secondary measure mb-4">
          The moose, pre-sized for a profile picture, a cover and a story - already composited onto Ink 950 so it never vanishes on a transparent background.
        </p>
        <AssetGrid assets={SOCIAL} />
      </Section>

      <Section id="palette">
        <SectionHeader eyebrow="Colour" title="Palette." className="mb-4" />
        <p className="text-sm text-ink-secondary measure mb-4">
          The ground is paper, not white; the text is ink, not black. Full token set: <code>docs/brand/tokens.reference.css</code>.
        </p>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 m-0 p-0">
          {PALETTE.map((c) => (
            <li key={c.hex} className="list-none">
              <div className="h-16 rounded-[10px] border-[1.5px] border-ink-950/20" style={{ backgroundColor: c.hex }} />
              <p className="text-xs font-bold text-ink-950 mt-2 mb-0">{c.name}</p>
              <p className="text-xs text-ink-muted m-0">{c.hex}</p>
              {c.note && <p className="text-xs text-ink-secondary m-0">{c.note}</p>}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="type">
        <SectionHeader eyebrow="Type" title="Font." className="mb-4" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FONTS.map((f) => (
            <Card key={f.family}>
              <p className="text-3xl text-ink-950 m-0 mb-2" style={{ fontFamily: f.family }}>{f.family}</p>
              <p className="text-sm text-ink-secondary m-0">{f.use}</p>
              <a href={f.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-bold underline underline-offset-4 text-ink-950">
                Get the font
              </a>
            </Card>
          ))}
          <Card>
            <p className="font-display text-3xl text-ink-950 m-0 mb-2">Boogaloo</p>
            <p className="text-sm text-ink-secondary m-0">
              An earlier display face, not the live one - <code>--font-display</code> now maps to Oswald above. Kept here for anything already built on it.
            </p>
            <a href="/fonts/Boogaloo-Regular.ttf" download className="mt-3 inline-block text-sm font-bold underline underline-offset-4 text-ink-950">
              Download the font file
            </a>
          </Card>
        </div>
      </Section>

      <Section id="copy">
        <SectionHeader eyebrow="Words" title="Paste-ready copy." className="mb-4" />
        <p className="text-sm text-ink-secondary measure mb-4">
          Three lengths, same facts - pulled from the site&rsquo;s own event data, not retyped.
        </p>
        <ul className="grid grid-cols-1 gap-4 m-0 p-0">
          {COPY_BLOCKS.map((c) => (
            <CopyBlock key={c.label} label={c.label} text={c.text} />
          ))}
        </ul>
      </Section>

      <Section id="rules">
        <SectionHeader eyebrow="Usage" title="One line each." className="mb-4" />
        <ul className="text-sm text-ink-secondary measure space-y-2 pl-5 m-0">
          <li>Ground is paper, text is ink - not white and black.</li>
          <li>The moose is the mark; there is no separate &ldquo;red logo&rdquo;.</li>
          <li>Credit whoever made it - attabotty for the primary mark, Candy (CandyToyBox) for everything else on this page.</li>
          <li>Nothing here is final until it is live on zaostock.com - this is the library, not a promise.</li>
        </ul>
      </Section>
    </SiteShell>
  );
}
