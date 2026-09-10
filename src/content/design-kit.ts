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
  { name: 'The moose', file: SITE.logo.src, format: 'PNG, 4000 x 4000, transparent', note: 'The primary mark since 10 September 2026. White on transparent.', alt: SITE.logo.alt, width: SITE.logo.width, height: SITE.logo.height, dark: true },
  { name: 'The moose, web size', file: SITE.logo.web, format: 'PNG, 600 x 600, transparent', note: 'Same mark, small enough to drop into a post or an email.', alt: SITE.logo.alt, width: 600, height: 600, dark: true },
  { name: 'The 2026 badge, colour', file: SITE.badge.src, format: 'PNG, 1122 x 1402', note: 'Archive mark. Still ours to use; no longer the primary.', alt: SITE.badge.alt, width: SITE.badge.width, height: SITE.badge.height, dark: false },
  { name: 'The 2026 badge, black and white', file: '/brand/logos/zaostock26_badge_bw_final.png', format: 'PNG', note: 'Archive mark, for single-colour print.', alt: 'ZAOstock 26 badge, black and white', width: SITE.badge.width, height: SITE.badge.height, dark: false },
];

export type KitColour = { token: string; hex: string; role: string };

/** DESIGN.md "Primitives", in its order. */
export const COLOURS: readonly KitColour[] = [
  { token: 'red-500', hex: '#D2402A', role: 'Primary. The badge red: the main button, stat values, the accent word in a headline.' },
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
      'It is white on transparent. Put it on ink (#241E15) or another dark ground; on paper or a light photo it disappears.',
      'Use the file as supplied. Do not recolour, stretch, rotate, outline or add effects to it, and do not crop the antlers.',
      'Give it room. Nothing sits inside the antlers or touches the edge of the mark.',
    ],
  },
  {
    title: 'The 2026 badge',
    items: [
      'An archive mark since 10 September 2026, kept and still usable. The moose leads.',
      'Credit the badge and this colour and type system to Samantha "Candy", CandyToyBox.',
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

/** The downloadable palette, generated from COLOURS so it cannot drift. */
export function paletteCss(): string {
  const lines = COLOURS.map((c) => `  --zaostock-${c.token}: ${c.hex}; /* ${c.role} */`);
  return `/* ZAOstock 2026 colours - from zaostock.com/design */\n:root {\n${lines.join('\n')}\n}\n`;
}
