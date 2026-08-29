import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import Image from 'next/image';
import Link from 'next/link';
import { InstagramEmbed } from './InstagramEmbed';
import { getPublicMembers, type PublicMember } from '@/lib/members';
import { FESTIVAL } from '@/content/festival';
import { SITE } from '@/content/site';
import { SiteShell, Section, TwoUp, Eyebrow, Button, Badge, Card, SectionHeader } from '@/components/poster';

export const metadata: Metadata = {
  title: 'ZAO Festivals',
  description:
    "ZAO Festivals is The ZAO's series of community-owned, artist-built music festivals: free to attend, artists paid fairly. Flagship: ZAOstock 2026, Ellsworth, Maine.",
  alternates: { canonical: '/festivals' },
  openGraph: {
    title: 'ZAO Festivals | ZAOstock',
    description: 'A series of community-owned, artist-built music festivals. Free, fair, owned by the people who show up. Flagship: ZAOstock 2026.',
    url: 'https://zaostock.com/festivals',
    images: [OG_IMAGE],
    type: 'website',
  },
};

// The team roster reads the database at request time; the rest is static.
export const dynamic = 'force-dynamic';

interface Chapter {
  name: string;
  place: string;
  year: string;
  note: string;
  href: string;
  status: 'past' | 'flagship';
}

// The series. Facts per deck slide 3 and the press kit; the CHELLA scale line
// ("16+ musicians, 100+ visual artists") is on disk here and stays until
// someone contradicts it.
const SERIES: Chapter[] = [
  { name: 'ZAO-PALOOZA', place: 'New York City, during NFT NYC', year: 'April 2024', note: 'Twelve artists, the community’s first IRL meetup. Volunteer-organised in six weeks. Broke even.', href: '#recap', status: 'past' },
  { name: 'ZAO-CHELLA', place: 'Miami, Wynwood, during Art Basel', year: 'December 2024', note: '16+ musicians, 100+ visual artists, the first live WaveWarZ battle, AR art.', href: '#recap', status: 'past' },
  { name: 'ZAOville', place: 'Laurel, Maryland', year: 'July 2026', note: 'Co-hosted with Dcoop and The VEC. Open mic, live sets, a DJ night swim.', href: '/zaoville', status: 'past' },
  { name: 'ZAOstock', place: FESTIVAL.city, year: FESTIVAL.shortDate, note: 'The flagship, and the first in Maine. Free, one day, downtown, at the gateway to Acadia.', href: '/', status: 'flagship' },
];

const PRINCIPLES = [
  { k: '01', t: 'Artist-built', b: 'The lineup and the day are built by the artists and the community, not a promoter extracting margin. Curated by the people in the room.' },
  { k: '02', t: 'Community-owned', b: 'The crowd that funds it owns it. A festival as a protocol, not a product: open, shared, repeatable by anyone.' },
  { k: '03', t: 'Free and fair', b: 'Free to attend. Artists paid fairly and transparently. Built in public, every step shared.' },
] as const;

// Instagram posts/reels to embed. This is where the real ZAO-CHELLA / ZAO-PALOOZA
// recap media lives (@zaofestivals).
const INSTAGRAM: string[] = [
  'https://www.instagram.com/reel/DDa-oPBJ7G7/', // ZAO-CHELLA 2024 Miami recap
  'https://www.instagram.com/reel/DDLVvNuu5_3/', // ZAO-CHELLA 2024 coverage
];

const TILE_TONES = ['bg-paper-200 text-ink-950', 'bg-denim-300/40 text-denim-600', 'bg-gold-300 text-gold-600'] as const;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/** Null when the database is unreachable; the section then says so instead of the page failing. */
async function loadTeam(): Promise<PublicMember[] | null> {
  try {
    return await getPublicMembers();
  } catch {
    return null;
  }
}

export default async function FestivalsPage() {
  const team = await loadTeam();

  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">The series</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">ZAO Festivals</h1>
          <p className="text-lg text-ink-secondary measure m-0">
            The ZAO&apos;s series of community-owned, artist-built music festivals. Free to attend, artists paid fairly, and the crowd that funds it owns it. New York, Miami and Maryland so far; the flagship lands in Maine this October.
          </p>
          <p className="text-base text-ink-950 font-bold mt-3 m-0">ZAO Festivals presents ZAOstock. One umbrella, many events, one DNA.</p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <Card key={p.k}>
              <Eyebrow className="mb-2">{p.k}</Eyebrow>
              <h2 className="font-sans font-extrabold text-h4 text-ink-950 m-0">{p.t}</h2>
              <p className="text-sm text-ink-secondary m-0 mt-2">{p.b}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="The chapters" title="Four so far." className="mb-6" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SERIES.map((c, i) => (
            <Card key={c.name} href={c.href} interactive className="p-0">
              <div className={['h-3 border-b-2 border-ink-950', ['bg-red-500', 'bg-denim-400', 'bg-olive-400', 'bg-gold-400'][i]].join(' ')} />
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <Eyebrow>{c.year}</Eyebrow>
                  {c.status === 'flagship' ? <Badge tone="gold">Flagship</Badge> : null}
                </div>
                <p className="font-sans font-extrabold text-h4 text-ink-950 m-0 mt-1.5">{c.name}</p>
                <p className="text-sm text-ink-secondary m-0 mt-0.5">{c.place}</p>
                <p className="text-sm text-ink-muted m-0 mt-2">{c.note}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="team">
        <TwoUp>
          <SectionHeader
            eyebrow="The team"
            title="Built by these people."
            lede="A volunteer crew across operations, music, design, finance, livestream and content."
          />
          {team === null ? (
            <p className="text-sm text-ink-muted m-0">The roster reads from the database, which is unavailable right now.</p>
          ) : team.length === 0 ? (
            <p className="text-sm text-ink-muted m-0">Full roster coming soon.</p>
          ) : (
            <ul className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 list-none m-0 p-0">
              {team.map((m, i) => (
                <li key={m.id}>
                  <Link
                    href={`/team/m/${m.slug}`}
                    className={[
                      'poster-motion flex aspect-square items-center justify-center overflow-hidden rounded-md border border-ink-950/60 font-sans font-extrabold text-sm text-center px-2 transition-transform duration-[120ms] ease-poster hover:-translate-x-px hover:-translate-y-px focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]',
                      TILE_TONES[i % TILE_TONES.length],
                    ].join(' ')}
                    title={m.name}
                  >
                    {m.photo_url ? (
                      <Image src={m.photo_url} alt={m.name} width={160} height={160} className="h-full w-full object-cover" unoptimized />
                    ) : (
                      <span aria-label={m.name}>{initials(m.name)}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </TwoUp>
      </Section>

      {INSTAGRAM.length > 0 ? (
        <Section id="recap">
          <SectionHeader eyebrow="From the festivals" title="What it looked like." className="mb-6" />
          <InstagramEmbed urls={INSTAGRAM} />
        </Section>
      ) : null}

      <Section>
        <SectionHeader eyebrow="Be part of it" title="Bring one to your city, sponsor one, play one." lede="ZAO Festivals is a model anyone can run. The goal is more community-owned culture in more places." className="mb-6" />
        <div className="flex flex-wrap gap-3">
          <Button href="/">ZAOstock 2026</Button>
          <Button href="/event-organizers" variant="secondary">
            Organize
          </Button>
          <Button href="/sponsor" variant="secondary">
            Sponsor
          </Button>
          <Button href="/musicians" variant="secondary">
            Play it
          </Button>
        </div>
        <p className="text-sm text-ink-muted mt-6 m-0">
          Questions:{' '}
          <a href={`mailto:${SITE.contact}`} className="text-denim-400 underline underline-offset-4 hover:text-denim-500">
            {SITE.contact}
          </a>
        </p>
      </Section>
    </SiteShell>
  );
}
