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
// 18:00-19:30 then live music to close, in booking (ros-v4).

export const SITE = {
  contact: 'info@thezao.com',
  musicFrom: 'Noon',
  /** Public window; festival.ts `window` is the source once PRODUCTION's noon revert merges. */
  windowLabel: 'Noon - 6 PM',
  lineupRevealLabel: '1 September',
  lineupRevealDate: '2026-09-01',
  submissionCutoffLabel: '3 September',
  submissionCutoffDate: '2026-09-03',
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
  { time: '6 PM onward', where: 'Black Moon Public House, next door', what: 'A DJ set as the street walks in, then live music to close.' },
] as const;

export type Partner = { name: string; role: string; poc: string; confirmed: boolean; logoSrc?: string };

// PARTNER GATING RULES (strict): a partner appears only if confirmed === true
// (locked agreement, not "in conversation") and poc is the ZAO team member who
// owns the relationship. logoSrc only once the file exists in public/partners/
// (today none does). Heart of Ellsworth is deliberately NOT listed: on the
// 2026-08-13 call Chesnee Barney said official-partner status and logo use
// have to clear internally first. COC Concertz added 2026-08-27 (Zaal, 20:3x);
// its role and POC were not typed and stay UNSET until he does.
export const PARTNERS: readonly Partner[] = [
  { name: 'Town of Ellsworth', role: 'Parklet venue', poc: 'Zaal', confirmed: true },
  { name: 'Black Moon Public House', role: 'The evening, and the official after-party', poc: 'Zaal', confirmed: true },
  { name: 'Star 97.7', role: 'Local radio promotion', poc: 'Zaal', confirmed: true },
  { name: 'Wallace Events', role: 'Event equipment and tenting', poc: 'Zaal', confirmed: true },
  { name: 'WaveWarZ', role: 'Live music-battle format on the ZAOstock stage', poc: 'Zaal', confirmed: true },
  { name: 'COC Concertz', role: 'UNSET', poc: 'UNSET', confirmed: true },
  { name: 'ENTERACT', role: 'Production and operational support', poc: 'FailOften', confirmed: true },
  { name: 'Web3Metal', role: 'Partnership integration and community surface', poc: 'Shawn', confirmed: true },
].filter((p) => p.confirmed);

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
