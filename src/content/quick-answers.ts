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
  // Scoped to the parklet on purpose (zaostock-f7, 2026-09-29): whether kids
  // can go into Black Moon after six is asked of Steve with no answer on file.
  // Also still OPEN with Zaal and so NOT answered here: dogs, smoking, food on
  // site, accessible restrooms, the after-party end time. Add none of them
  // until each is settled.
  { q: 'Is it all ages?', a: 'Yes. The festival on the parklet is all ages and family-friendly.' },
  { q: 'Where do I park?', a: PARKING_DETAIL },
  {
    q: 'What happens after six?',
    a: 'At six the street clears, and Black Moon Public House next door hosts its own evening: the ZAOstock after-party, with North Creek.',
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
