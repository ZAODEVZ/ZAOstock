import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArtistBySlug, getRosterArtists, verifyClaimToken } from '@/lib/artists';
import { ArtistProfileView } from './ArtistProfileView';
import { FESTIVAL } from '@/content/festival';
import { SiteShell, Section, Eyebrow, Button, Card } from '@/components/poster';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug).catch(() => null);
  if (!artist) return { title: 'Artist not found' };

  return {
    title: `${artist.name} | ZAOstock Artist`,
    description: artist.bio.slice(0, 160) || `${artist.name} at ZAOstock, Oct 3 2026 in Ellsworth Maine.`,
    alternates: { canonical: `/artist/${slug}` },
    openGraph: {
      title: `${artist.name} | ZAOstock`,
      description: artist.bio.slice(0, 160) || `${artist.name} - ${artist.genre || 'music'}`,
      url: `https://zaostock.com/artist/${slug}`,
      images: artist.photo_url ? [artist.photo_url] : [],
    },
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
