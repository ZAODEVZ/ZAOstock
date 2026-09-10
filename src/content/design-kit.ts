import { SITE } from './site';

// THE DESIGN KIT at /design - marks, colours, type and the rules for using
// them, each downloadable. Every value is copied from a file on disk, never
// retyped from memory: the colours from DESIGN.md's primitives table (which is
// `docs/brand/tokens.reference.css` verbatim), the type from DESIGN.md
// "Typography". design-kit.test.ts holds every hex to globals.css, so the kit
// cannot drift from the site it describes.

export type KitMark = {
  name: string;
  file: string;
  format: string;
  note: string;
  alt: string;
  width: number;
  height: number;
  /** A white knockout needs the ink ground to be seen at all. */
  dark: boolean;
};

export const MARKS: readonly KitMark[] = [
  { name: 'The moose', file: SITE.logo.src, format: 'PNG, 4000 x 4000, transparent', note: `The primary mark since 10 September 2026, by ${SITE.logo.credit}. White on transparent.`, alt: SITE.logo.alt, width: SITE.logo.width, height: SITE.logo.height, dark: true },
  { name: 'The moose, web size', file: SITE.logo.web, format: 'PNG, 600 x 600, transparent', note: `Same mark by ${SITE.logo.credit}, small enough to drop into a post or an email.`, alt: SITE.logo.alt, width: 600, height: 600, dark: true },
  // The 26 badge was listed here as an archive mark until 2026-09-10, when it
  // was retired as too close to Woodstock's branding and pulled (Zaal: "Pull it").
];

export type KitColour = { token: string; hex: string; role: string };

/** DESIGN.md "Primitives", in its order. */
export const COLOURS: readonly KitColour[] = [
  { token: 'red-500', hex: '#D2402A', role: 'Primary: the main button, stat values, the accent word in a headline.' },
  { token: 'red-300', hex: '#E8735C', role: 'Red on ink surfaces.' },
  { token: 'red-600', hex: '#B93826', role: 'Primary button ground.' },
  { token: 'red-700', hex: '#9C2F1E', role: 'Primary button hover and press.' },
  { token: 'gold-400', hex: '#E5AC3B', role: 'Gold badge, focus ring, the "stock" in the wordmark.' },
  { token: 'gold-300', hex: '#F2D48A', role: 'Gold tint.' },
  { token: 'gold-500', hex: '#C98F2A', role: 'Gold hover.' },
  { token: 'gold-600', hex: '#A8721C', role: 'Gold text on paper - the only gold that passes for text.' },
  { token: 'denim-400', hex: '#2E6494', role: 'Links, section eyebrows, denim badge.' },
  { token: 'denim-300', hex: '#7FA8C7', role: 'Denim on ink surfaces.' },
  { token: 'denim-500', hex: '#245078', role: 'Link hover.' },
  { token: 'denim-600', hex: '#1B3C5C', role: 'Link pressed, denim text on paper.' },
  { token: 'olive-400', hex: '#7C8A3D', role: 'The fourth ink. Used rarely.' },
  { token: 'olive-300', hex: '#A4AF6E', role: 'Olive on ink surfaces.' },
  { token: 'olive-500', hex: '#636F2F', role: 'Olive text on paper.' },
  { token: 'paper-100', hex: '#F2E6D3', role: 'Page ground.' },
  { token: 'paper-200', hex: '#FAF3E6', role: 'Cards, header, lighter ground.' },
  { token: 'ink-950', hex: '#241E15', role: 'Text, borders, shadows, and the dark ground the moose sits on.' },
];

export type KitFont = { family: string; use: string; weights: string; url: string };

/** DESIGN.md "Typography". All three are open-licence Google Fonts. */
export const FONTS: readonly KitFont[] = [
  { family: 'Boogaloo', use: 'Display: every heading, every big number. Never below 22px, never for a paragraph, never bold - it has no bold.', weights: '400', url: 'https://fonts.google.com/specimen/Boogaloo' },
  { family: 'Rubik', use: 'Body and interface. Buttons and navigation in 700, uppercase, 0.04em tracking.', weights: '400, 500, 600, 700, 800', url: 'https://fonts.google.com/specimen/Rubik' },
  { family: 'Space Mono', use: 'Eyebrows, labels, times and tables. Labels in 700, uppercase, 0.12em tracking.', weights: '400, 700', url: 'https://fonts.google.com/specimen/Space+Mono' },
];

/** Rules with a source. Nothing here is taste invented for the page. */
export const RULES: ReadonlyArray<{ title: string; items: readonly string[] }> = [
  {
    title: 'The moose',
    items: [
      `Drawn by ${SITE.logo.credit}. Credit the moose to ${SITE.logo.credit}.`,
      'It is white on transparent. Put it on ink (#241E15) or another dark ground; on paper or a light photo it disappears.',
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
      'Paper is the ground, ink is the text, red is the only thing that asks to be clicked.',
      'Never pure white (#FFFFFF) for a surface and never pure black (#000000) for text.',
      'Gold 400 is never text on paper; it fails contrast. Use gold 600 for gold words.',
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
