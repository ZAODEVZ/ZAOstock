import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArtistBySlug, getRosterArtists, verifyClaimToken } from '@/lib/artists';
import { ArtistProfileView } from './ArtistProfileView';
import { FESTIVAL } from '@/content/festival';
import { SiteShell, Section, Eyebrow, Button, Card } from '@/components/poster';
import { OG_IMAGE, truncateAtWord, twitterCard } from '@/lib/meta';
import { displayName } from '@/content/site';
import { zaoMediaFor } from '@/content/zao-media';
import { artistJsonLdString } from '@/content/artist-jsonld';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug).catch(() => null);
  if (!artist) return { title: 'Artist not found' };

  const shown = displayName(artist.name);
  const description = artist.bio
    ? truncateAtWord(artist.bio, 160)
    : `${shown} was on the bill for ZAOstock, ${FESTIVAL.shortDate}, in ${FESTIVAL.city}.`;

  return {
    // `absolute` bypasses the root layout's `%s | ZAOstock` title template -
    // a plain string here doubles the suffix (measured live 2026-09-17:
    // "Tom Fellenz | ZAOstock Artist | ZAOstock" on all eight artist pages).
    // Place and year in the title (SEO pass 2026-09-29): people search an
    // act's name with the town or the festival, rarely "ZAOstock Artist".
    title: { absolute: `${shown} at ZAOstock 2026, Ellsworth, Maine` },
    description,
    alternates: { canonical: `/artist/${slug}` },
    openGraph: {
      title: `${shown} | ZAOstock`,
      description,
      url: `https://zaostock.com/artist/${slug}`,
      // Falls back to the site's own OG image rather than an empty array -
      // measured live 2026-09-19: the four acts with no photo yet shared
      // with no image at all on any social platform.
      images: artist.photo_url ? [artist.photo_url] : [OG_IMAGE],
    },
    // Same fallback as openGraph.images above, for the same reason: an
    // artist with no photo yet must degrade to the festival card, never to
    // a broken image link.
    twitter: twitterCard(`${shown} | ZAOstock`, description, artist.photo_url ? [artist.photo_url] : [OG_IMAGE.url]),
  };
}

export default async function ArtistProfilePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { token } = await searchParams;
  // A missing database reads as not found rather than a 500; the roster is the source of truth.
  const artist = await getArtistBySlug(slug).catch(() => null);
  if (!artist) notFound();

  const canEdit = token ? Boolean(await verifyClaimToken(slug, token)) : false;
  // Cheap: getRosterArtists() is react-cache()'d, so this reuses the same
  // fetch getArtistBySlug already made this request rather than re-querying.
  const roster = await getRosterArtists();
  const total = roster.length;
  const media = zaoMediaFor(artist.name);

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: artistJsonLdString(artist) }}
      />
      <Section first className="pt-10 sm:pt-14">
        <div className="lg:flex lg:items-start lg:gap-8">
          {/* flex-1 min-w-0: without a grow class a flex item shrink-wraps
              to its content's preferred width (flex-basis defaults to
              auto/flex-grow to 0) rather than filling up to max-w-[760px] -
              review flagged this (PR #367) as the reason the two-column
              split below could land narrower than intended, with unwanted
              gap between the card and the rail. min-w-0 lets the card's own
              text wrap instead of forcing the row wider than the viewport. */}
          <div className="flex-1 min-w-0 max-w-[760px] space-y-6">
            <ArtistProfileView artist={artist} canEdit={canEdit} token={token || ''} total={total} />
            {media.length > 0 && (
              <Card>
                <Eyebrow className="mb-2">ZAO media</Eyebrow>
                <p className="text-sm text-ink-secondary m-0 mb-3">
                  The ZAO&apos;s own coverage of {displayName(artist.name)}, from the daily newsletter.
                </p>
                <ul className="space-y-2 text-sm m-0 p-0 list-none">
                  {media.map((item) => (
                    <li key={item.url}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-ink-950 underline hover:no-underline"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            <Card>
              <Eyebrow className="mb-2">About ZAOstock</Eyebrow>
              <p className="text-sm text-ink-secondary m-0">
                {/* "On the bill" for every act, on purpose. That seven acts played is
                    established (Zaal: "Acadia rising did not play", and seven sets on
                    the stream), but WHICH act played which set was read off the
                    running order at low to medium confidence, not confirmed by him.
                    A sentence naming one act as having played waits for his word. */}
                {displayName(artist.name)} was on the bill for ZAOstock, {FESTIVAL.dateLabel}, at the {FESTIVAL.venue} in {FESTIVAL.city}. A free, community-built music festival, part of the 9th Annual Art of Ellsworth.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button href="/" size="sm">
                  Festival info
                </Button>
                <Button href="/program" variant="secondary" size="sm">
                  Program
                </Button>
              </div>
            </Card>
          </div>
          {/* Desktop only (Polish item 14, doc 2507): at 1440px the card is
              capped at max-w-[760px], leaving roughly half the screen flat.
              Purely additive - hidden entirely below lg, so mobile is
              unchanged. Not sticky: this page has no long scroll of its own
              content for a sticky rail to track against. */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card>
              <Eyebrow className="mb-3">Act order</Eyebrow>
              <ol className="space-y-2 text-sm">
                {roster.map((a) => (
                  <li key={a.slug}>
                    {a.slug === slug ? (
                      <span className="font-bold text-ink-950" aria-current="page">
                        {a.setOrder}. {displayName(a.name)}
                      </span>
                    ) : (
                      <Link
                        href={`/artist/${a.slug}`}
                        className="text-ink-secondary hover:text-ink-950 hover:underline"
                      >
                        {a.setOrder}. {displayName(a.name)}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </Card>
          </aside>
        </div>
      </Section>
    </SiteShell>
  );
}
