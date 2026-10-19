import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

// Every label on the home page that sits on a fill, checked against WCAG AA
// in BOTH colour schemes, read from home.module.css itself.
//
// Why this exists: the page follows the viewer's system setting, and its dark
// variant lightens every accent. Text on those accents was a hardcoded
// #fff8ec, so in dark mode the RSVP button, the hero tags and every kicker
// were near-white on light orange/olive/brass (2.1 to 2.6:1). axe reported the
// kickers and tags but never the button: it cannot score text on a gradient.
// This test can, because it reads the stops.
//
// 4.5:1 for body-size text, 3:1 for large text (24px, or 18.66px bold).

const css = readFileSync(path.join(process.cwd(), 'src/app/home.module.css'), 'utf8');

type Rule = { selectors: string[]; decls: Record<string, string>; dark: boolean };

function parse(src: string, dark = false, out: Rule[] = []): Rule[] {
  let rest = src.replace(/\/\*[\s\S]*?\*\//g, '');
  for (let open = rest.indexOf('{'); open >= 0; open = rest.indexOf('{')) {
    const head = rest.slice(0, open).trim();
    if (head.startsWith('@')) {
      let depth = 1;
      let j = open + 1;
      for (; j < rest.length && depth > 0; j++) depth += rest[j] === '{' ? 1 : rest[j] === '}' ? -1 : 0;
      if (head.startsWith('@media')) parse(rest.slice(open + 1, j - 1), dark || /prefers-color-scheme:\s*dark/.test(head), out);
      rest = rest.slice(j);
      continue;
    }
    const close = rest.indexOf('}', open);
    const decls: Record<string, string> = {};
    for (const d of rest.slice(open + 1, close).split(';')) {
      const k = d.indexOf(':');
      if (k > 0) decls[d.slice(0, k).trim()] = d.slice(k + 1).replace('!important', '').trim();
    }
    out.push({ selectors: head.split(',').map((x) => x.trim().replace(/\s+/g, ' ')), decls, dark });
    rest = rest.slice(close + 1);
  }
  return out;
}

const RULES = parse(css);

/** The value a list of selectors ends up with, least specific first, as the cascade would apply it. */
function declared(selectors: string[], props: string[], dark: boolean, rules = RULES): string | undefined {
  let value: string | undefined;
  for (const sel of selectors)
    for (const r of rules)
      if ((!r.dark || dark) && r.selectors.includes(sel))
        for (const p of props) if (r.decls[p] !== undefined) value = r.decls[p];
  return value;
}

function resolve(value: string, dark: boolean, rules = RULES): string {
  return value.replace(/var\((--[\w-]+)\)/g, (_, name: string) => {
    const v = declared(['.home'], [name], dark, rules);
    if (!v) throw new Error(`${name} is not defined on .home`);
    return resolve(v, dark, rules);
  });
}

const hexes = (v: string): string[] => v.match(/#[0-9a-f]{6}\b/gi) ?? [];
const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h: string) => {
  const [r, g, b] = rgb(h).map((c) => (c / 255 <= 0.03928 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const mix = (a: string, b: string, t: number) =>
  '#' + rgb(a).map((c, i) => Math.round(c + (rgb(b)[i] - c) * t).toString(16).padStart(2, '0')).join('');

interface Case {
  name: string;
  text: string[];
  fill: string[];
  large?: true;
  /** For a two-stop vertical gradient: the band the text actually sits in. */
  band?: [number, number];
}

const CASES: Case[] = [
  { name: 'hero tag: Free', text: ['.tagrow span', '.tagrow span:nth-child(1)'], fill: ['.tagrow span:nth-child(1)'] },
  { name: 'hero tag: All ages', text: ['.tagrow span', '.tagrow span:nth-child(2)'], fill: ['.tagrow span:nth-child(2)'] },
  { name: 'hero tag: Rain or shine', text: ['.tagrow span', '.tagrow span:nth-child(3)'], fill: ['.tagrow span:nth-child(3)'] },
  // 16px padding round a 13px line: the glyphs sit in the middle ~30% of the pill.
  { name: 'RSVP button', text: ['.btn'], fill: ['.btn'], band: [0.35, 0.65] },
  { name: 'section kicker', text: ['.kicker'], fill: ['.kicker'] },
  { name: 'lineup panel kicker', text: ['.kicker', '.panelTxt .kicker'], fill: ['.kicker', '.panelTxt .kicker'] },
  { name: 'Ellsworth kicker', text: ['.kicker', '.ellCopy .kicker'], fill: ['.kicker', '.ellCopy .kicker'] },
  { name: 'closing kicker', text: ['.kicker', '.close .kicker'], fill: ['.kicker', '.close .kicker'] },
  { name: 'plug-in card on hover', text: ['.plugCard:hover *'], fill: ['.plugCard:hover'] },
  { name: 'running-order link on a tinted section', text: ['.link'], fill: ['.tint'] },
  { name: 'link on the page background', text: ['.link'], fill: ['.home'] },
  { name: 'heading accent on a tinted section', text: ['.title em', '.tint .title em'], fill: ['.tint'], large: true },
  { name: 'heading accent on the page background', text: ['.title em'], fill: ['.home'], large: true },
  { name: 'Why Ellsworth accent', text: ['.title em', '.ellCopy h2 em'], fill: ['.ellCopy'], large: true },
];

/** Every [text, background, ratio] a case produces in one scheme. */
function measure(c: Case, dark: boolean, rules = RULES): Array<[string, string, number]> {
  const fg = declared(c.text, ['color'], dark, rules);
  const bg = declared(c.fill, ['background', 'background-color'], dark, rules);
  if (!fg || !bg) throw new Error(`${c.name}: no ${fg ? 'background' : 'color'} declared`);
  const [text] = hexes(resolve(fg, dark, rules));
  let stops = hexes(resolve(bg, dark, rules));
  if (!text || stops.length === 0) throw new Error(`${c.name}: no hex colour after resolving ${fg} / ${bg}`);
  const [top, bottom] = stops;
  if (c.band && top && bottom && stops.length === 2) stops = c.band.map((t) => mix(top, bottom, t));
  return stops.map((s): [string, string, number] => [text, s, ratio(text, s)]);
}

describe('home page contrast (WCAG AA)', () => {
  for (const dark of [false, true]) {
    describe(dark ? 'dark scheme' : 'light scheme', () => {
      for (const c of CASES) {
        it(c.name, () => {
          const floor = c.large ? 3 : 4.5;
          for (const [text, bg, r] of measure(c, dark)) {
            expect(r, `${text} on ${bg} is ${r.toFixed(2)}:1, needs ${floor}:1`).toBeGreaterThanOrEqual(floor);
          }
        });
      }
    });
  }

  it('catches a planted failure, so a green run means something', () => {
    // The control: the pre-fix pattern, a hardcoded near-white on an accent
    // that dark mode lightens. The same parser and resolver must score it as
    // failing, through a token, a media query and a gradient.
    const planted = parse(`
      .home { --fire: #c1662c; --deep: #8f3e1e; }
      @media (prefers-color-scheme: dark) { .home { --fire: #e2833f; --deep: #f0955a; } }
      .btn { color: #fff8ec; background: linear-gradient(180deg, var(--fire), var(--deep)); }
    `);
    const btn: Case = { name: 'planted', text: ['.btn'], fill: ['.btn'], band: [0.35, 0.65] };
    expect(Math.min(...measure(btn, false, planted).map(([, , r]) => r))).toBeGreaterThanOrEqual(4.5);
    expect(Math.max(...measure(btn, true, planted).map(([, , r]) => r))).toBeLessThan(3);
  });
});
