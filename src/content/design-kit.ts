import { SITE } from './site';

// THE DESIGN KIT at /design - marks, colours, type and the rules for using
// them, each downloadable. Every value is copied from a file on disk, never
// retyped from memory: since 2026-09-10 the colours and heading face are the
// front page's (Candy's site build, src/app/home.module.css), which replaced
// DESIGN.md's poster tokens on every public page. design-kit.test.ts holds
// every hex to globals.css, so the kit cannot drift from the site it describes.

export type KitMark = {
  name: string;
  file: string;
  format: string;
  note: string;
  alt: string;
  width: number;
  height: number;
  /** A white knockout needs a dark ground (night) to be seen at all. */
  dark: boolean;
};

export const MARKS: readonly KitMark[] = [
  { name: 'The moose', file: SITE.logo.src, format: 'PNG, 4000 x 4000, transparent', note: `The primary mark since 10 September 2026, by ${SITE.logo.credit}. White on transparent.`, alt: SITE.logo.alt, width: SITE.logo.width, height: SITE.logo.height, dark: true },
  { name: 'The moose, web size', file: SITE.logo.web, format: 'PNG, 600 x 600, transparent', note: `Same mark by ${SITE.logo.credit}, small enough to drop into a post or an email.`, alt: SITE.logo.alt, width: 600, height: 600, dark: true },
  // The 26 badge was listed here as an archive mark until 2026-09-10, when it
  // was retired as too close to Woodstock's branding and pulled (Zaal: "Pull it").
];

export type KitColour = { token: string; hex: string; role: string };

/**
 * The front page's palette, sitewide since 2026-09-10 (Zaal's pick: "Front
 * page's"): Candy's site build, src/app/home.module.css. The first column is
 * the site's token name, kept so no page changed a class; her own name leads
 * each role. Values are the light ones; her dark variant takes over when the
 * viewer's system is dark. The test reads them from globals.css (.site).
 */
export const COLOURS: readonly KitColour[] = [
  { token: 'red-500', hex: '#C1662C', role: 'Fireside. The accent word in a headline, stat values, the top of the button.' },
  { token: 'red-700', hex: '#8F3E1E', role: 'Ember. The foot of the button, and fireside when it has to be text.' },
  { token: 'red-600', hex: '#9F4B1D', role: 'Between the two. Small red text on cream.' },
  { token: 'red-300', hex: '#E2833F', role: 'Fireside on dark grounds.' },
  { token: 'gold-400', hex: '#DFA23C', role: 'Sun. Badges, the focus ring, highlights on dark photographs.' },
  { token: 'gold-300', hex: '#EFCB82', role: 'Sun tint.' },
  { token: 'gold-500', hex: '#A97C3F', role: 'Brass. Card edges and hairlines.' },
  { token: 'gold-600', hex: '#86602C', role: 'Brass as text on cream: the only gold that passes for words.' },
  { token: 'denim-400', hex: '#3F4D31', role: 'Pine. The kicker label above a heading, links.' },
  { token: 'denim-300', hex: '#8FA26C', role: 'Pine on dark grounds.' },
  { token: 'denim-500', hex: '#323E27', role: 'Link hover.' },
  { token: 'denim-600', hex: '#26301D', role: 'Link pressed.' },
  { token: 'olive-400', hex: '#7C8A3D', role: 'Olive. Used rarely: the success alert.' },
  { token: 'olive-300', hex: '#A4AF6E', role: 'Olive tint.' },
  { token: 'olive-500', hex: '#5B662A', role: 'Olive text on cream.' },
  { token: 'paper-100', hex: '#F2E6CC', role: 'Cream. The page ground.' },
  { token: 'paper-200', hex: '#FAF3E6', role: 'Cards, and the lighter ground.' },
  { token: 'ink-950', hex: '#2E2015', role: 'Ink. Text.' },
  { token: 'night', hex: '#1B130B', role: 'The footer and the moose\'s ground. Dark in both modes.' },
  { token: 'onfill', hex: '#FFF8EC', role: 'Text on the button and on night.' },
];

export type KitFont = { family: string; use: string; weights: string; url: string };

/** The public pages' three families. Oswald replaced Boogaloo for headings on
 *  2026-09-10 with the front page's look; Boogaloo stays loaded for /team only.
 *  All three are open-licence Google Fonts. */
export const FONTS: readonly KitFont[] = [
  { family: 'Oswald', use: 'Headings and big numbers, in capitals, bold. Condensed, so a heading stays short on a phone. Never for a paragraph.', weights: '600, 700', url: 'https://fonts.google.com/specimen/Oswald' },
  { family: 'Rubik', use: 'Body and interface. Buttons and navigation in 700, uppercase, 0.04em tracking.', weights: '400, 500, 600, 700, 800', url: 'https://fonts.google.com/specimen/Rubik' },
  { family: 'Space Mono', use: 'Eyebrows, labels, times and tables. Labels in 700, uppercase, 0.12em tracking.', weights: '400, 700', url: 'https://fonts.google.com/specimen/Space+Mono' },
];

/** Rules with a source. Nothing here is taste invented for the page. */
export const RULES: ReadonlyArray<{ title: string; items: readonly string[] }> = [
  {
    title: 'The moose',
    items: [
      `Drawn by ${SITE.logo.credit}. Credit the moose to ${SITE.logo.credit}.`,
      'It is white on transparent. Put it on night (#1B130B) or another dark ground; on cream or a light photo it disappears.',
      'Use the file as supplied. Do not recolour, stretch, rotate, outline or add effects to it, and do not crop the antlers.',
      'Give it room. Nothing sits inside the antlers or touches the edge of the mark.',
    ],
  },
  {
    // Was "The 2026 badge: an archive mark, kept and still usable". Wrong since
    // 2026-09-10: Candy retired the badge as too close to Woodstock's branding
    // and Zaal pulled it (#162). Corrected here, where it was read.
    title: 'Credit',
    items: [
      'Credit this colour and type system, the signage and the illustrations to Samantha "Candy", CandyToyBox.',
      'The red 2026 badge is retired and is not a ZAOstock mark. Do not use it.',
    ],
  },
  {
    title: 'Colour',
    items: [
      'Cream is the ground, ink is the text, fireside is the only thing that asks to be clicked.',
      'Never pure white (#FFFFFF) for a surface and never pure black (#000000) for text.',
      'Sun and brass are never text on cream; they fail contrast. Use gold 600 for gold words.',
    ],
  },
  {
    title: 'The name',
    items: ['ZAOstock: one word, capital ZAO, never hyphenated.'],
  },
];

/**
 * Candy's signage and illustrations, from the ZAOstock design system she sent
 * the design team on 2026-09-10 (vault intake:
 * projects/zaostock-design-assets-intake-2026-09-10.md). Web sizes, as webp
 * from her own site build. These are for screens: the print masters are her
 * Affinity file, not these.
 *
 * DELIBERATELY NOT HERE, and a test holds each line:
 * - the bird and dove pieces: too close to the Woodstock imagery she retired
 *   the badge over;
 * - the four role badges and the wristbands: day-of credentials, and whether
 *   they go public before the day is a question with vault;
 * - the ticket graphics: admission is free, and nothing may look like a
 *   ticket flow the site does not run;
 * - pieces cut from a sprite sheet with a neighbour's fragments still on them
 *   (the mic, drumsticks, pines, maple leaf, easel, lighthouse, moose
 *   silhouette, "Now Playing"). Those want clean exports from her first.
 */
export type KitArt = { name: string; file: string; width: number; height: number };

const art = (slug: string, name: string, width: number, height: number): KitArt => ({ name, file: `/brand/elements/${slug}.webp`, width, height });

export const SIGNS: readonly KitArt[] = [
  art('directional_sign_stage', 'Stage', 160, 108),
  art('directional_sign_food', 'Food', 160, 112),
  art('directional_sign_art', 'Art', 160, 141),
  art('directional_sign_merch', 'Merch', 160, 144),
  art('directional_sign_info', 'Info', 160, 114),
  art('directional_sign_restrooms', 'Restrooms', 160, 94),
  art('sign_welcome_to_zaostock', 'Welcome to ZAOstock', 148, 93),
  art('sign_set_times_schedule', 'Set times', 189, 92),
  art('sign_thank_you_ellsworth', 'Thank you Ellsworth', 176, 108),
  art('sign_franklin_st_parklet', 'Franklin St Parklet', 620, 350),
];

export const ILLUSTRATIONS: readonly KitArt[] = [
  art('banner_music_lives_here', 'Music lives here', 560, 191),
  art('guitar_pick_zaostock_pine', 'ZAOstock pick', 180, 214),
  art('stamp_zaostock_round_red', 'Stock stamp', 180, 160),
  art('acoustic_guitar_yellow', 'Acoustic guitar', 420, 829),
  art('vintage_guitar_amplifier', 'Amp', 114, 130),
  art('festival_canopy_tent_booth', 'Tent', 300, 300),
  art('star_red', 'Star', 60, 61),
];

/** The downloadable palette, generated from COLOURS so it cannot drift. */
export function paletteCss(): string {
  const lines = COLOURS.map((c) => `  --zaostock-${c.token}: ${c.hex}; /* ${c.role} */`);
  return `/* ZAOstock 2026 colours - from zaostock.com/design */\n:root {\n${lines.join('\n')}\n}\n`;
}
