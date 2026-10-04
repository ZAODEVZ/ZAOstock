import { FESTIVAL } from './festival';
import { LINEUP_NAMES, displayName } from './site';

// QUICK ANSWERS - the questions people type into a search box or ask an AI
// assistant about the day, answered once, here, and rendered two ways from
// this one array: a visible list on /program and schema.org FAQPage data on
// the same page. The two cannot drift because there is only one copy.
//
// Added in the 2026-09-29 SEO/GEO pass. EVERY answer is assembled from a
// statement the site already makes - nothing here is new policy:
// - free: FESTIVAL.admission and /tickets ("No ticket is checked").
// - all ages: /terms "Getting in".
// - parking: PARKING_DETAIL below, which /ellsworth now renders from here.
// - after six: the wording site.test.ts's crowd-movement guard lists as
//   correct - Black Moon hosts its own evening; nobody "moves" anywhere.
// - stream: /live.

export const PARKING_DETAIL = `Franklin Street itself has no vehicle parking during the parklet season. Use the free Franklin Street Parking Lot or Ellsworth City Hall's own lot instead - both a short walk from the ${FESTIVAL.venue}.`;

const actList = LINEUP_NAMES.map(displayName);
const acts = `${actList.slice(0, -1).join(', ')} and ${actList[actList.length - 1]}`;

// PAST TENSE, 2026-10-04: the day happened, so every answer reads as a record.
// "What if it rains?" and "Where do I park?" were advice for attending and are
// gone from this list (PARKING_DETAIL stays: /ellsworth still renders it).
export const QUICK_ANSWERS: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: 'Was ZAOstock free?',
    a: `Yes. ${FESTIVAL.admission}. No ticket was checked at the parklet.`,
  },
  {
    q: 'When and where was it?',
    a: `${FESTIVAL.dateLabel}, ${FESTIVAL.window}, on the ${FESTIVAL.venue} in downtown Ellsworth, Maine. Music started at noon.`,
  },
  {
    q: 'Who played?',
    a: `${LINEUP_NAMES.length} independent acts: ${acts}. The running order and set times are listed on this page.`,
  },
  // All ages after six was answered by Black Moon's own flyer ("7 PM ALL
  // AGES", shared by Zaal 2026-09-30). The after-party end time (10 PM) was
  // Black Moon's close, so this list still does not quote it.
  { q: 'Was it all ages?', a: 'Yes. The festival on the parklet was all ages and family-friendly, and Black Moon listed its after-party as all ages too.' },
  {
    q: 'What happened after six?',
    a: 'At six the street cleared, and Black Moon Public House next door hosted its own evening: the ZAOstock after-party, doors from 6 and music from 7, with North Creek and friends. Details at zaostock.com/afterparty.',
  },
  { q: 'Can I watch the replay?', a: 'Yes. The recording and the running order are at zaostock.com/live.' },
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
