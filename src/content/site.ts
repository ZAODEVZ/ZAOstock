// Site-wide facts that DESIGN.md's page spec asks for and that
// src/content/festival.ts does not carry yet. festival.ts belongs to the
// PRODUCTION lane, so these live here until that file absorbs them
// (request logged in .handoffs/DONE.md). Same rules as festival.ts: facts
// only, nothing invented, UNSET where nobody has typed the value.
//
// Overrides relayed to SITE on 2026-08-27 that beat the spec where they
// differ: attendance stays off the public site (19:3x); Werb is not fully
// confirmed, so only Lyons Den is public (20:4x); there is no changeover DJ,
// the MC and partner spots cover changeovers (20:0x); the evening is a DJ set
// 18:00-20:00, a live set 20:00-22:00 hosted by Black Moon, nothing after
// 22:00 until the licence hour is typed (ros-v7, 28 Aug).

export const SITE = {
  contact: 'info@thezao.com',
  musicFrom: 'Noon',
  /** Public window; festival.ts `window` is the source once PRODUCTION's noon revert merges. */
  windowLabel: 'Noon - 6 PM',
  lineupRevealLabel: '1 September',
  lineupRevealDate: '2026-09-01',
  submissionCutoffLabel: '1 September',
  submissionCutoffDate: '2026-09-01',
  soundcheckNight: 'Friday 2 October',
  weather: 'Rain or shine, under tent cover.',
  series: '9th Annual Art of Ellsworth',
  weekend: 'Maine Craft Weekend',
  producedBy: 'ZAOstock is produced by ZAO Festivals, the events arm of The ZAO.',
  credit: 'Identity by Samantha "Candy", CandyToyBox.',
  badge: {
    src: '/brand/logos/zaostock26_badge_official.png',
    alt: 'ZAOstock 26 badge: October 3rd, Maine. Whole day of art, peace and music.',
    width: 1122,
    height: 1402,
  },
  icons: {
    lighthouse: '/brand/icons/location-lighthouse-07.png',
    hands: '/brand/icons/community-hands-06.png',
    dove: '/brand/icons/good-vibes-dove-06.png',
  },
} as const;

/** Acts that may be named on a public surface today. Nothing proposed, ever. */
export const PUBLIC_LINEUP: readonly string[] = ['Lyons Den'];

export const WAVEWARZ = {
  battlers: ['Stilo', 'Jango', 'Lui', 'Quan'],
  mc: 'Hurricane',
  window: '4 - 6 PM',
} as const;

/** The day, one venue at a time. Times are the public shape, not the run of show. */
export const DAY = [
  { time: 'Noon - 4 PM', where: 'Franklin Street Parklet', what: 'Independent artists on the parklet stage, with our MC and our partners between sets.' },
  { time: '4 - 6 PM', where: 'Franklin Street Parklet', what: 'WaveWarZ. Two artists go head to head; the audience decides, in the street and online.' },
  { time: '6 - 8 PM', where: 'Black Moon Public House, next door', what: 'DJ set as the street walks in.' },
  { time: '8 - 10 PM', where: 'Black Moon Public House', what: 'Live set, hosted by Black Moon.' },
] as const;

/**
 * The two open meetings, every day until 3 October. Zaal, 29 August: the eight
 * circles "will become meetings", 11:30 AM and 5 PM Eastern. Rendered by
 * /meetings; the same two times go on the shared calendar.
 */
export const MEETINGS = [
  {
    label: 'Midday',
    time: '11:30 AM',
    zone: 'Eastern, every day',
    what: 'What moved since yesterday, and what is stuck. The one that catches problems early enough to fix them.',
  },
  {
    label: 'Evening',
    time: '5:00 PM',
    zone: 'Eastern, every day',
    what: 'For anyone whose day starts after the midday one. Same agenda, later, so nobody has to choose between this and a job.',
  },
] as const;

export type Partner = { name: string; role: string; poc: string; confirmed: boolean; logoSrc?: string };

// PARTNER GATING RULES (strict): a partner appears only if confirmed === true
// (locked agreement, not "in conversation") and poc is the ZAO team member who
// owns the relationship. logoSrc only once the file exists in public/partners/
// (six do since 28 Aug; Town, ENTERACT, Web3Metal due 29 Aug). Heart of Ellsworth is deliberately NOT listed: on the
// 2026-08-13 call Chesnee Barney said official-partner status and logo use
// have to clear internally first. COC Concertz added 2026-08-27 (Zaal, 20:3x);
// its role and POC were not typed and stay UNSET until he does.
export const PARTNERS: readonly Partner[] = [
  { name: 'Town of Ellsworth', role: 'Parklet venue', poc: 'Zaal', confirmed: true },
  { name: 'Black Moon Public House', role: 'The evening, and the official after-party', poc: 'Zaal', confirmed: true, logoSrc: '/partners/black-moon.png' },
  { name: 'Star 97.7', role: 'Local radio promotion', poc: 'Zaal', confirmed: true, logoSrc: '/partners/star-977.png' },
  { name: 'Wallace Events', role: 'Event equipment and tenting', poc: 'Zaal', confirmed: true, logoSrc: '/partners/wallace-events.png' },
  { name: 'WaveWarZ', role: 'Live music-battle format on the ZAOstock stage', poc: 'Zaal', confirmed: true, logoSrc: '/partners/wavewarz.png' },
  { name: 'COC Concertz', role: 'UNSET', poc: 'UNSET', confirmed: true, logoSrc: '/partners/coc-concertz.png' },
  { name: 'ENTERACT', role: 'Production and operational support', poc: 'FailOften', confirmed: true },
  { name: 'Web3Metal', role: 'Partnership integration and community surface', poc: 'Shawn', confirmed: true },
  // Bomb Squad: resolved a partner at the 24 Aug standup (docs/marketing/partner-logos.md row 5), owner Dcoop.
  { name: 'Bomb Squad', role: 'Crew, content and merch', poc: 'Dcoop', confirmed: true, logoSrc: '/partners/bomb-squad.png' },
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

/** Deck slide 9. Names and benefits are settled; every price is Zaal's to type. */
export const TIERS: readonly Tier[] = [
  { name: 'Presenting', gets: 'Name on the banner, the poster, the stage and the stream. Named in every announcement. Two on-stage mentions. First refusal on 2027.', price: null },
  { name: 'Platform', gets: 'Logo on the poster and the site. Named in the newsletter and the recap. One on-stage mention.', price: null },
  { name: 'Sponsor an artist', gets: "Covers one artist's travel. They make content carrying your name. The artist opts in.", price: null },
  { name: 'Community', gets: 'Logo on the site, named in the recap, thanked from stage.', price: null },
  { name: 'Friend of the Fest', gets: 'Name on the site and in the newsletter.', price: null },
];

/** Deck slide 3 and the press kit. */
export const SERIES = [
  { name: 'ZAO-PALOOZA', place: 'New York City, during NFT NYC', when: '2024', note: 'Twelve artists. Volunteer-organised in six weeks. Broke even.', href: '/festivals' },
  { name: 'ZAO-CHELLA', place: 'Miami, Wynwood, during Art Basel', when: 'December 2024', note: 'The first live WaveWarZ battle.', href: '/festivals' },
  { name: 'ZAOville', place: 'Laurel, Maryland', when: 'July 2026', note: 'Co-hosted with Dcoop.', href: '/zaoville' },
] as const;

/** Why Ellsworth: press kit and deck slide 8. */
export const ELLSWORTH = {
  driveThrough: { value: '4M', label: 'drove through in 2025' },
  artOfEllsworth: { value: '9th', label: 'Annual Art of Ellsworth' },
  heartEvents: { value: '28', label: 'Heart of Ellsworth events in 2025' },
  heartSponsors: { value: '50+', label: 'sponsors of those events' },
  historic: 'Downtown newly on the National Historic Register.',
} as const;

/** Deck slide 2. The newsletter count is VERIFY in the deck and does not render. */
export const ZAO = {
  weeklySessions: { value: '100+', label: 'consecutive weekly sessions since 30 July 2024' },
  governanceMembers: { value: '157', label: 'verified on-chain governance members' },
} as const;

/** Deck slide 6, measured 2026-08-27. Re-pull from wavewarz.info/api/public/stats before print. */
export const WAVEWARZ_STATS = {
  asOf: '27 August 2026',
  battles: { value: '1,452', label: 'battles run' },
} as const;
