import { FESTIVAL } from './festival';
import { displayName } from './site';
import { ADDRESS } from './event-jsonld';
import { parseSocials } from '@/lib/socials';

// ARTIST STRUCTURED DATA (schema.org MusicGroup), one per /artist/<slug> page.
//
// Added in the 2026-09-29 SEO pass. The festival's MusicEvent (layout.tsx)
// already lists every act as a performer, linking here; this is the other
// direction - each act's page says "this act plays ZAOstock, Oct 3, on
// Franklin Street" in a form search engines and AI assistants read, so a
// search for the act's name can surface the date. schema.org's MusicGroup
// covers solo acts as well as bands.
//
// Only fields the page already shows: name, bio, photo, and the socials that
// are real URLs (handles stay out - the platform is not inferable).

const SITE_URL = 'https://zaostock.com';

export interface ArtistForJsonLd {
  name: string;
  slug: string;
  bio: string;
  photo_url: string;
  socials: string;
}

export function artistJsonLd(artist: ArtistForJsonLd) {
  const shown = displayName(artist.name);
  const sameAs = parseSocials(artist.socials)
    .map((t) => t.href)
    .filter((href): href is string => Boolean(href));

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: shown,
    url: `${SITE_URL}/artist/${artist.slug}`,
    ...(artist.bio.trim() ? { description: artist.bio.trim() } : {}),
    // Some acts store photo_url as a site path (/artists/lyons-den.webp);
    // JSON-LD needs an absolute URL. new URL() leaves absolute ones alone.
    // Caught in Dotfiles' review of #390.
    ...(artist.photo_url ? { image: new URL(artist.photo_url, SITE_URL).toString() } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    event: {
      '@type': 'MusicEvent',
      name: 'ZAOstock 2026',
      url: SITE_URL,
      startDate: FESTIVAL.date,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: { '@type': 'Place', name: FESTIVAL.venue, address: ADDRESS },
    },
  };
}

/** JSON for a <script type="application/ld+json">. Escapes "<" so a bio
 *  containing "</script>" cannot close the tag early. */
export function artistJsonLdString(artist: ArtistForJsonLd): string {
  return JSON.stringify(artistJsonLd(artist)).replace(/</g, '\\u003c');
}
