import { FESTIVAL } from './festival';
import { LINEUP_NAMES, displayName } from './site';

// EVENT STRUCTURED DATA (schema.org MusicEvent), rendered once in layout.tsx.
//
// It is what puts the date, the venue and the free price into Google's own
// result for ZAOstock. On 2026-09-28 Search Console reported "Events
// enhancement: Non-critical issues detected" and a source-side audit found the
// same three fields missing: image, performer and a street address. All three
// are added here, from sources that already exist:
// - image: the confirmed lineup poster, public/brand/posters (live, HTTP 200).
// - performer: LINEUP_NAMES, the same identity list the sitemap and artist
//   pages use, so a lineup change cannot leave Google on the old bill. Each
//   links its /artist/<slug> page. event-jsonld.test.ts holds the two together.
// - streetAddress: "Franklin Street", no house number. The Facebook event
//   says "3 Franklin St", but a parklet has no street number: that address
//   geocodes to an office building about 140 m from where Luma pins the event
//   (Dotfiles review of #382, 2026-09-29), and Google may pin whatever we
//   publish. The site itself only ever says "Franklin Street Parklet".

const SITE_URL = 'https://zaostock.com';

/** Same rule as slugify() in src/lib/artists.ts, kept here so the root layout
 *  does not import the database client. The test checks the two agree. */
export function artistSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

const ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Franklin Street',
  addressLocality: 'Ellsworth',
  addressRegion: 'ME',
  postalCode: '04605',
  addressCountry: 'US',
} as const;

export const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicEvent',
  name: 'ZAOstock 2026',
  description: 'A free, one-day, artist-built music festival in downtown Ellsworth, Maine. Run by The ZAO.',
  image: [`${SITE_URL}/brand/posters/2026-lineup-poster-1600x2000.png`],
  url: SITE_URL,
  startDate: FESTIVAL.date,
  endDate: '2026-10-03T18:00:00-04:00',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  isAccessibleForFree: true,
  location: {
    '@type': 'Place',
    name: FESTIVAL.venue,
    address: ADDRESS,
  },
  performer: LINEUP_NAMES.map((name) => ({
    '@type': 'PerformingGroup',
    name: displayName(name),
    url: `${SITE_URL}/artist/${artistSlug(name)}`,
  })),
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: SITE_URL,
    validFrom: '2026-08-01T00:00:00-04:00',
  },
  organizer: {
    '@type': 'Organization',
    name: 'The ZAO',
    url: SITE_URL,
  },
  // The evening next door. One venue at a time: this starts when the parklet ends.
  subEvent: {
    '@type': 'MusicEvent',
    name: 'ZAOstock 2026 - the evening at Black Moon Public House',
    startDate: '2026-10-03T18:00:00-04:00',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'Black Moon Public House',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ellsworth',
        addressRegion: 'ME',
        addressCountry: 'US',
      },
    },
  },
};
