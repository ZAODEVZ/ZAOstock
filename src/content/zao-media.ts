import { LINEUP_NAMES } from './site';

// THE ZAO'S OWN COVERAGE OF EACH ACT, for the "ZAO media" card on /artist/<slug>.
//
// Zaal, 2026-09-28 14:46 EDT (relayed by the vault lane): "update the artist
// page with a zao media page". His Firefly posts for DCoop, LyonsDen and Tom
// Fellenz used to link their Paragraph editions; he switched every post to
// zaostock.com/artist/<slug>, so the artist page is now where a reader lands
// and the edition has to be reachable from there.
//
// Keyed by the IDENTITY name in LINEUP_NAMES (never the display name), the
// same key the sitemap and the DB join use. zao-media.test.ts holds every key
// to LINEUP_NAMES and every url to The ZAO's own Paragraph publication.
//
// Only editions that were fetched and read on 2026-09-28 are listed:
// - Day 258 og:description "DCoop is playing at ZAOstock"
// - Day 259 og:description "LyonsDen is playing ZAOstock"
// - Day 260 og:description "Tom Fellenz is playing ZAOstock"
// - Day 268 "the Maine artists on the ZAOstock bill" names all five Maine acts
// The single-act drafts for Michael Anderson, The Crown Vics, OPEN X and
// Acadia Rising in zaoonparagraph were not published under those days, so
// they are not here. Add a row when an edition goes live, not before.

export type MediaItem = {
  title: string;
  url: string;
};

const DAY_268: MediaItem = {
  title: 'Year of the ZABAL, Day 268: the Maine artists on the ZAOstock bill',
  url: 'https://paragraph.com/@thezao/year-of-the-zabal-day-268-the-maine-artists-on-the-zaostock-bill',
};

export const ZAO_MEDIA: Readonly<Record<string, readonly MediaItem[]>> = {
  'The Crown Vics': [DAY_268],
  'OPEN X': [DAY_268],
  'Grass Rug': [DAY_268],
  'Acadia Rising': [DAY_268],
  'Michael Anderson': [DAY_268],
  DCoop: [
    {
      title: 'Year of the ZABAL, Day 258: DCoop is playing ZAOstock',
      url: 'https://paragraph.com/@thezao/year-of-the-zabal-day-258',
    },
  ],
  LyonsDen: [
    {
      title: 'Year of the ZABAL, Day 259: LyonsDen is playing ZAOstock',
      url: 'https://paragraph.com/@thezao/year-of-the-zabal-day-259-1',
    },
  ],
  'Tom Fellenz': [
    {
      title: 'Year of the ZABAL, Day 260: Tom Fellenz is playing ZAOstock',
      url: 'https://paragraph.com/@thezao/year-of-the-zabal-day-260',
    },
  ],
};

/** An act with no edition yet gets an empty list, and the page renders no card for it. */
export function zaoMediaFor(name: string): readonly MediaItem[] {
  return ZAO_MEDIA[name] ?? [];
}

/** Exported for the test: every act on the bill should have at least one entry. */
export const MEDIA_ACTS = LINEUP_NAMES;
