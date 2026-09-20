import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArtistBySlug, getRosterArtists, verifyClaimToken } from '@/lib/artists';
import { ArtistProfileView } from './ArtistProfileView';
import { FESTIVAL } from '@/content/festival';
import { SiteShell, Section, Eyebrow, Button, Card } from '@/components/poster';
import { OG_IMAGE, truncateAtWord, twitterCard } from '@/lib/meta';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug).catch(() => null);
  if (!artist) return { title: 'Artist not found' };

  const description = artist.bio
    ? truncateAtWord(artist.bio, 160)
    : `${artist.name} at ZAOstock, Oct 3 2026 in Ellsworth Maine.`;

  return {
    // `absolute` bypasses the root layout's `%s | ZAOstock` title template -
    // a plain string here doubles the suffix (measured live 2026-09-17:
    // "Tom Fellenz | ZAOstock Artist | ZAOstock" on all eight artist pages).
    title: { absolute: `${artist.name} | ZAOstock Artist` },
    description,
    alternates: { canonical: `/artist/${slug}` },
    openGraph: {
      title: `${artist.name} | ZAOstock`,
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
    twitter: twitterCard(`${artist.name} | ZAOstock`, description, artist.photo_url ? [artist.photo_url] : [OG_IMAGE.url]),
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
  const total = (await getRosterArtists()).length;

  return (
    <SiteShell>
      <Section first className="pt-10 sm:pt-14">
        <div className="max-w-[760px] space-y-6">
          <ArtistProfileView artist={artist} canEdit={canEdit} token={token || ''} total={total} />
          <Card>
            <Eyebrow className="mb-2">About ZAOstock</Eyebrow>
            <p className="text-sm text-ink-secondary m-0">
              {artist.name} is on the ZAOstock roster for {FESTIVAL.dateLabel} at the {FESTIVAL.venue} in {FESTIVAL.city}. A free, community-built music festival, part of the 9th Annual Art of Ellsworth.
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
      </Section>
    </SiteShell>
  );
}
