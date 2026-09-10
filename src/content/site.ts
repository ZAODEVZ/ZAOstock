// Site-wide facts that DESIGN.md's page spec asks for and that
// src/content/festival.ts does not carry yet. festival.ts belongs to the
// PRODUCTION lane, so these live here until that file absorbs them
// (request logged in .handoffs/DONE.md). Same rules as festival.ts: facts
// only, nothing invented, UNSET where nobody has typed the value.
//
// Overrides relayed to SITE on 2026-08-27 that beat the spec where they
// differ: attendance stays off the public site (19:3x); Werb is not fully
// confirmed, so only Lyons Den is public (20:4x); the evening is a DJ set
// 18:00-20:00, a live set 20:00-22:00 hosted by Black Moon, nothing after
// 22:00 until the licence hour is typed (ros-v7, 28 Aug).
//
// SUPERSEDED, 31 Aug: "there is no changeover DJ, the MC and partner spots
// cover changeovers" (20:0x, 27 Aug) is NO LONGER TRUE. Zaal reopened the
// daytime DJ on the 31 Aug DCoop call - "if we're gonna have one" - and is
// sourcing local DJs through Nextdoor. Nothing on this page asserts the
// absence of a DJ, so no public copy changes here; the note is corrected so
// the next reader does not act on it. Doc 2453.

export const SITE = {
  contact: 'info@thezao.com',
  musicFrom: 'Noon',
  /** Public window; festival.ts `window` is the source once PRODUCTION's noon revert merges. */
  windowLabel: 'Noon - 6 PM',
  // lineupRevealLabel / lineupRevealDate ('13 September', '2026-09-13') lived
  // here until 2026-09-10. Zaal: "stop making a whole reveal date - we will just
  // post about each of them individually starting on Saturday with their bio
  // and photo." Deleted, not blanked: reveal-date.test.ts fails if either key,
  // or the date, comes back. Acts publish per artist (src/lib/lineup-reveal.ts).
  // UNUSED since 2026-09-01: the submission form was removed from the site, so
  // nothing renders these and there is no cutoff to enforce. Left in place
  // rather than deleted so the value is not lost if intake ever returns. Do NOT
  // read them as a live deadline - there is no way to submit on the site.
  submissionCutoffLabel: '1 September',
  submissionCutoffDate: '2026-09-01',
  soundcheckNight: 'Friday 2 October',
  weather: 'Rain or shine, under tent cover.',
  series: '9th Annual Art of Ellsworth',
  weekend: 'Maine Craft Weekend',
  producedBy: 'ZAOstock is produced by ZAO Festivals, the events arm of The ZAO.',
  /**
   * THE PRIMARY MARK since 2026-09-10 (Zaal): the moose. It is a WHITE
   * knockout on transparent, so it only ever sits on the ink inverse surface
   * (`bg-ink-950`); on paper it disappears. `web` is a 600px copy for places
   * that inline the file (the OG image); `src` is the full 4000px original.
   * Drawn by attabotty (Zaal, 2026-09-10): credit on every surface that offers
   * the mark as a download.
   */
  logo: {
    credit: 'attabotty',
    src: '/brand/logos/zaostock26_moose.png',
    web: '/brand/logos/zaostock26_moose_600.png',
    alt: 'ZAOstock logo: the word ZAOSTOCK set in the antlers of a moose head.',
    width: 4000,
    height: 4000,
  },
  // The 26 badge is RETIRED and PULLED (2026-09-10). Candy, who designed it,
  // retired it as "too similar to the original Woodstock logo and branding",
  // and Zaal: "Pull it". It is no longer served: the files moved out of
  // public/ to docs/brand/archive/, and no page offers it. Do not re-add it.
  icons: {
    lighthouse: '/brand/icons/location-lighthouse-07.png',
    hands: '/brand/icons/community-hands-06.png',
    dove: '/brand/icons/good-vibes-dove-06.png',
  },
} as const;

/**
 * Acts CONFIRMED IN WRITING. This is the narrow claim - it is the only list the
 * site may describe with the word "confirmed". Nothing proposed, ever.
 */
export const PUBLIC_LINEUP: readonly string[] = ['Lyons Den'];

/*
 * WHAT PUBLIC_LINEUP IS NOT, measured 2026-09-08.
 *
 * NOTHING RENDERS IT. `/program` imported it and never used it; that import is
 * now removed. No other surface references it.
 *
 * This matters because REVEAL-RUNBOOK.md told the operator to edit this array
 * on the day and ship a deploy - a step that would have changed nothing while
 * feeling like publishing the lineup. The runbook is corrected in the same
 * change.
 *
 * What actually publishes acts is `getPublicArtists()`, which is dynamic: it
 * gates each row on `isPublishable()` (confirmed, bio, photo) from the
 * database. No deploy is involved. Acts appear when they confirm, not when
 * someone edits this file.
 *
 * It is kept rather than deleted because it still states something true and
 * narrow - the only acts the site may call CONFIRMED - and `site.test.ts` pins
 * that meaning. Treat it as a guarded assertion, not as a render source.
 */

/**
 * WHO IS PLAYING - names only. Zaal, 2026-09-07: "lets just update it with the
 * names but no times and no links and over the week this week we will just add
 * it all to the website."
 *
 * This is DELIBERATELY NOT a confirmation claim and must never be rendered next
 * to the word "confirmed" - none of these acts has countersigned, and saying
 * they have is the fabricating-signatures line. It is also NOT the gated lineup
 * API, which publishes only status='confirmed' rows and is untouched by this.
 * Names here are plain site content so his team can see the bill and say what is
 * missing.
 *
 * NO SET TIMES AND NO LINKS until the rest is filled in this week. A test
 * enforces both.
 *
 * Order is the run of show locked 3 September. EIGHT acts since 2026-09-10:
 * Hurricane is out (Zaal: "He knows, strip him today"), no replacement and no
 * held slot. Nobody else moved; his 15:10 set became an open stretch.
 */
export const LINEUP_NAMES: readonly string[] = [
  'The Crown Vics',
  'OPEN X',
  'Grass Rug',
  'Acadia Rising',
  'Michael Anderson',
  'DCoop',
  'Lyons Den',
  'Fellenz',
];

/** Rendered beside LINEUP_NAMES. Kept here so a test can hold it to the rules. */
export const LINEUP_NAMES_NOTE =
  'Set times are in the program. Bios and photos go up one artist at a time.';

/** The day, one venue at a time. Times are the public shape, not the run of show. */
export const DAY = [
  { time: 'Noon - 6 PM', where: 'Franklin Street Parklet', what: 'Independent artists on the parklet stage, with our MC and our partners between sets.' },
  // SETTLED 2026-09-07: North Creek, roughly 6 to 9, hosted AND underwritten by
  // Black Moon on their own premises and licence. Source: Steve Peer, 26 August.
  // Was two rows, 6-8 DJ and 8-10 live, which was the older plan and ran an hour
  // past what the venue owner paying for it described.
  { time: '6 - 9 PM', where: 'Black Moon Public House, next door', what: 'North Creek, hosted by Black Moon. Their stage, their evening.' },
] as const;

/**
 * RETIRED 2026-09-09. There were two exported meeting times here, 11:30 AM and
 * 5 PM Eastern, "every day until 3 October", rendered on /meetings and promised
 * to the public.
 *
 * Zaal, 2026-09-09: "we never do the standups tbh". So the page invited
 * strangers, artists and sponsors to meetings that do not happen, in copy that
 * specifically said nobody has to choose between this and a job. It was true
 * when it was written on 29 August and stopped being true without anyone
 * editing the page, which is the same failure as the reveal date and the
 * crowd-goes-indoors claim: a record that goes stale stays loud.
 *
 * Deleted rather than emptied, so nothing can render a meeting time from here
 * again. /meetings now says how to reach us instead of when to turn up.
 */

export type Partner = { name: string; role: string; poc: string; confirmed: boolean; logoSrc?: string };

// PARTNER GATING RULES (strict): a partner appears only if confirmed === true
// (locked agreement, not "in conversation") and poc is the ZAO team member who
// owns the relationship. logoSrc only once the file exists in public/partners/
// (six do since 28 Aug; Town of Ellsworth's is still due). Heart of Ellsworth is deliberately NOT listed: on the
// 2026-08-13 call Chesnee Barney said official-partner status and logo use
// have to clear internally first. COC Concertz added 2026-08-27 (Zaal, 20:3x).
// POC is Thy Revolution (Zaal, 2026-09-10: "poc is thyrev"), role Co-presenter
// (Zaal's pick the same day). No partner is untyped any more.
export const PARTNERS: readonly Partner[] = [
  { name: 'Town of Ellsworth', role: 'Parklet venue', poc: 'Zaal', confirmed: true },
  { name: 'Black Moon Public House', role: 'The evening, and the official after-party', poc: 'Zaal', confirmed: true, logoSrc: '/partners/black-moon.png' },
  { name: 'Star 97.7', role: 'Local radio promotion', poc: 'Zaal', confirmed: true, logoSrc: '/partners/star-977.png' },
  { name: 'Wallace Events', role: 'Event equipment and tenting', poc: 'Zaal', confirmed: true, logoSrc: '/partners/wallace-events.png' },
  { name: 'WaveWarZ', role: 'Live music-battle format, online all year', poc: 'Zaal', confirmed: true, logoSrc: '/partners/wavewarz.png' },
  { name: 'COC Concertz', role: 'Co-presenter', poc: 'Thy Revolution', confirmed: true, logoSrc: '/partners/coc-concertz.png' },
  // ENTERACT and Web3Metal were here, both confirmed: true, and both rendered on
  // /, /press and /partners. REMOVED 2026-09-10 by Zaal, verbatim: "enteract is
  // not a partner neither is we 3 metal". Deleted rather than set to false, so
  // nobody reads them as pending. Do not re-add either from an older deck or doc.
  // Bomb Squad: resolved a partner at the 24 Aug standup (docs/marketing/partner-logos.md row 5), owner DCoop.
  { name: 'Bomb Squad', role: 'Crew, content and merch', poc: 'DCoop', confirmed: true, logoSrc: '/partners/bomb-squad.png' },
  // Artizen: Zaal, 2026-09-10, "also add artizen for funding as a parter". No
  // amount is stated anywhere, on purpose: none has been given for public copy.
  { name: 'Artizen', role: 'Funding partner', poc: 'Zaal', confirmed: true, logoSrc: '/partners/artizen.png' },
].filter((p) => p.confirmed);

/** What every partner gets, whatever the tier (site-fix brief, 28 Aug). */
export const DELIVERABLES = [
  { name: 'The parklet banner', detail: 'Your name on the banner behind the stage on Franklin Street.' },
  { name: 'The programme', detail: 'Named in the printed programme and on the day-of schedule.' },
  { name: 'Site and stream', detail: 'Logo on zaostock.com and on the livestream.' },
  { name: 'Thank-you from the stage', detail: 'Said out loud by the MC, in the changeovers.' },
] as const;

/** Zaal, typed 27 Aug 19:3x. Public on /sponsor per the 28 Aug site-fix brief; nowhere else. */
export const ATTENDANCE = { inPerson: '200-250', online: 'about 1,000' } as const;

export type Tier = { name: string; gets: string; price: null | string };

/**
 * THREE tiers, no prices. Zaal, 31 August 2026: fewer tiers, simpler.
 *
 * Was five (Presenting, Platform, Sponsor an artist, Community, Friend of the
 * Fest) with five null prices - seven open fields that had been blocking the
 * deck, the sponsor one-pager and three Chamber messages since 27 August.
 * Collapsing to three closes all seven, because the discarded tiers were
 * gradations of the same two ideas: back the festival, or back an artist.
 *
 * PRICES STAY NULL, and that is load-bearing. `docs/sponsor/slide-9-tier-ladder.md`
 * records a previous ladder that was killed for inventing figures Zaal never
 * typed, and `docs/audit/2026-05-12-public-surfaces.md` flagged a $500-$2,500
 * range as INCONSISTENT back in May. site.test.ts asserts no price appears here.
 * This is the single source: the sponsor one-pager now reads from it rather
 * than keeping its own list.
 */
// The two support tiers. ONE source: /donate and /tickets both read this, so a
// price cannot drift between them the way "1 September" drifted across eight
// files on 2026-08-31.
//
// NEITHER TIER IS ADMISSION. Admission is free and stays free - /tickets says
// "this is patronage, not admission" and "nothing here buys access, because
// access is free". So $50 is not a standard ticket with $20 underneath it; both
// are ways to fund a day that charges nobody at the gate. Order them cheapest
// first so the page reads as a ladder of support rather than a price list.
//
// OPEN DECISION: "Pro Ticket, $50, 20 spots: keep on /donate or drop" is item 5
// on the 2 September meeting agenda (docs/design/meeting-2026-09-02.md). If the
// paid tiers go, delete SUPPORT_TIERS and the one block on each page that reads
// it. Nothing else depends on them.
export interface SupportTier {
  id: string;
  name: string;
  price: string;
  /** The bare number, for building a PayPal link. */
  amount: number;
  /** UNSET when the tier is uncapped. */
  spots: string | null;
  blurb: string;
  gets: readonly string[];
}

export const SUPPORT_TIERS: readonly SupportTier[] = [
  {
    id: 'supporter',
    name: 'Supporter',
    price: '$20',
    amount: 20,
    // Uncapped on purpose. The cap on the Pro Ticket exists because a 1:1 costs
    // real time; nothing here is scarce, so nothing needs rationing.
    spots: null,
    blurb: 'The straightforward one. It pays for the day and puts your name on it.',
    gets: [
      'Supports the festival: artist fees, materials, production costs.',
      'Credited as a supporter on the festival page.',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Ticket',
    price: '$50',
    amount: 50,
    spots: '20 spots',
    blurb: 'The same, plus time with the people building it.',
    gets: [
      'Supports the festival: artist fees, materials, production costs.',
      'Credited as a supporter on the festival page.',
      'A 1:1 with someone on the ZAO team before the event.',
    ],
  },
] as const;

/** The Pro Ticket, by name, for the copy that speaks about it specifically. */
export const PRO_TICKET = SUPPORT_TIERS[1];

/**
 * Round one of crowdfunding. The $1,000 target predates the $20 tier, and
 * 20 x $50 = $1,000 exactly, so the goal was originally DEFINED as "sell the
 * Pro Ticket round" rather than "raise a thousand dollars".
 *
 * WHAT COUNTS, decided 2026-09-01: every support dollar, at either tier. Two
 * reasons. It funds a free festival, so a dollar is a dollar and the page says
 * in words that neither tier buys access. And the alternative produces a figure
 * that lies - twenty $20 supporters would raise $400 while a $50-only tracker
 * still read zero.
 *
 * That also means the old "20 people, $1,000" phrasing is now WRONG, because it
 * silently asserts $50 each. `goal` states its own rule instead. A target whose
 * rule is invisible is the shape that produced the stale lineup date and the
 * 10% Unlock error: a number everyone reads and nobody can check.
 *
 * `count` and `countWord` are the Pro Ticket's 20-spot CAP, held since the
 * 2026-05-12 standup. They are not the goal's headcount - there isn't one any
 * more, because the number of supporters depends on the mix.
 */
export const PRO_ROUND = {
  count: 20,
  countWord: 'twenty',
  roundTotal: '$1,000',
  goal: 'Round 1 goal: $1,000, counting every supporter at either tier',
  /** Rendered next to any progress figure, so the rule travels with the number. */
  countsRule: 'Every supporter counts, at either tier.',
} as const;

/** The project's collection account, not an individual. Confirmed by Zaal 2026-04-30. */
export const PAYPAL_URL = 'https://paypal.com/paypalme/zaalpanthaki';

export const TIERS: readonly Tier[] = [
  { name: 'Presenting', gets: 'Name on the banner, the poster, the stage and the stream. Named in every announcement. Two on-stage mentions. First refusal on 2027.', price: null },
  { name: 'Sponsor an artist', gets: "Covers one artist's travel. They make content carrying your name. The artist opts in.", price: null },
  { name: 'Community', gets: 'Logo on the site, named in the recap, thanked from stage.', price: null },
];

/** Deck slide 3 and the press kit. */
export const SERIES = [
  { name: 'ZAO-PALOOZA', place: 'New York City', when: '2024', note: 'Twelve artists. Volunteer-organised in six weeks. Broke even.', href: '/festivals' },
  { name: 'ZAO-CHELLA', place: 'Miami, Wynwood, during Art Basel', when: 'December 2024', note: 'The first live WaveWarZ battle.', href: '/festivals' },
  { name: 'ZAOville', place: 'Laurel, Maryland', when: 'July 2026', note: 'Co-hosted with DCoop.', href: '/zaoville' },
] as const;

/** Why Ellsworth: press kit and deck slide 8. */
export const ELLSWORTH = {
  // driveThrough ('4M drove through in 2025') RETIRED 2026-09-10: no source
  // was ever found, MaineDOT counts included, and Zaal ruled "Drop both".
  artOfEllsworth: { value: '9th', label: 'Annual Art of Ellsworth' },
  heartEvents: { value: '28', label: 'Heart of Ellsworth events in 2025' },
  heartSponsors: { value: '50+', label: 'sponsors of those events' },
  historic: 'Downtown newly on the National Historic Register.',
} as const;

/** Deck slide 2. The newsletter count is VERIFY in the deck and does not render. */
export const ZAO = {
  weeklySessions: { value: '100+', label: 'consecutive weekly sessions since 30 July 2024' },
  /**
   * RETIRED 2026-09-09: this was `157` / "verified on-chain governance members",
   * and it broke two standing rules at once on a public sponsor surface - never
   * quote a specific ZAO member count (use "100+"), and no crypto or web3
   * framing in copy aimed at a local Maine audience. It was found live on
   * /sponsor by the retired-claims registry, not by anyone re-reading this file.
   *
   * Replaced with the track record, which is what a sponsor is actually weighing
   * and is sourced from SERIES below rather than invented.
   */
  festivalsRun: { value: '3', label: 'live festivals run since 2024, before this one' },
} as const;

/** Deck slide 6, measured 2026-08-27. Re-pull from wavewarz.info/api/public/stats before print. */
export const WAVEWARZ_STATS = {
  // Re-pulled 2026-09-09T12:38Z from wavewarz.info/api/public/stats, which
  // returned battles.total = 1508. The previous figure, 1,452 as of 27 August,
  // was refreshed in the sponsor deck hours before this file, which is exactly
  // the shape this codebase keeps getting caught by: a correction that reaches
  // one surface and not its sibling. This is the SOURCE, so the deck and the
  // site now agree because they read the same number, not because someone
  // remembered to edit both.
  //
  // It is a SNAPSHOT and it climbs, so it goes stale downward in credibility.
  // re-check 2026-10-01, before any print run.
  asOf: '9 September 2026',
  battles: { value: '1,508', label: 'battles run' },
} as const;
