import { FESTIVAL } from './festival';
import { SITE, LINEUP_NAMES, displayName } from './site';

// QUICK ANSWERS - the questions people type into a search box or ask an AI
// assistant about the day, answered once, here, and rendered two ways from
// this one array: a visible list on /program and schema.org FAQPage data on
// the same page. The two cannot drift because there is only one copy.
//
// Added in the 2026-09-29 SEO/GEO pass. EVERY answer is assembled from a
// statement the site already makes - nothing here is new policy:
// - free: FESTIVAL.admission and /tickets ("No ticket is checked").
// - rain: SITE.weather, the same constant /program and /terms already use.
// - all ages: /terms "Getting in".
// - parking: PARKING_DETAIL below, which /ellsworth now renders from here.
// - after six: the wording site.test.ts's crowd-movement guard lists as
//   correct - Black Moon hosts its own evening; nobody "moves" anywhere.
// - stream: /live.

export const PARKING_DETAIL = `Franklin Street itself has no vehicle parking during the parklet season. Use the free Franklin Street Parking Lot or Ellsworth City Hall's own lot instead - both a short walk from the ${FESTIVAL.venue}.`;

const actList = LINEUP_NAMES.map(displayName);
const acts = `${actList.slice(0, -1).join(', ')} and ${actList[actList.length - 1]}`;

export const QUICK_ANSWERS: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: 'Is ZAOstock free?',
    a: `Yes. ${FESTIVAL.admission}. No ticket is checked at the parklet, and the RSVP is optional.`,
  },
  {
    q: 'When and where is it?',
    a: `${FESTIVAL.dateLabel}, ${FESTIVAL.window}, on the ${FESTIVAL.venue} in downtown Ellsworth, Maine. Music starts at noon.`,
  },
  {
    q: 'Who is playing?',
    a: `${LINEUP_NAMES.length} independent acts: ${acts}. Set times are listed on this page.`,
  },
  { q: 'What if it rains?', a: SITE.weather },
  // All ages after six is now answered by Black Moon's own flyer ("7 PM ALL
  // AGES", shared by Zaal 2026-09-30). The after-party end time (10 PM) was
  // ruled 2026-09-27 (program.ts) but is Black Moon's close, so this list
  // still does not quote it. Still OPEN with Zaal and NOT answered here: dogs,
  // smoking, food on site, accessible restrooms.
  { q: 'Is it all ages?', a: 'Yes. The festival on the parklet is all ages and family-friendly, and Black Moon lists its after-party as all ages too.' },
  { q: 'Where do I park?', a: PARKING_DETAIL },
  {
    q: 'What happens after six?',
    a: 'At six the street clears, and Black Moon Public House next door hosts its own evening: the ZAOstock after-party, doors from 6 and music from 7, with North Creek and friends. Details at zaostock.com/afterparty.',
  },
  { q: 'Can I watch online?', a: 'Yes. The stream and the running order are at zaostock.com/live.' },
];

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: QUICK_ANSWERS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
