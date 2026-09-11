import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import path from 'path';
import { COLOURS, FONTS, ILLUSTRATIONS, MARKS, RULES, SIGNS, paletteCss } from './design-kit';
import { SITE } from './site';

const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');

describe('the design kit cannot drift from the site it describes', () => {
  it('gives every colour the exact hex the site uses', () => {
    const css = read('src/app/globals.css');
    // The public pages wear the .site block's values (the front page's look,
    // 2026-09-10); a token it does not set is a constant from @theme.
    const start = css.indexOf('.site {');
    expect(start).toBeGreaterThan(-1);
    const site = css.slice(start, css.indexOf('}', start));
    const drift = COLOURS.filter((c) => {
      const re = new RegExp(`--color-${c.token}:\\s*(#[0-9A-Fa-f]{6})`);
      const m = site.match(re) ?? css.match(re);
      return !m || m[1].toUpperCase() !== c.hex.toUpperCase();
    }).map((c) => c.token);
    expect(drift).toEqual([]);
  });

  it('lists the three families the site actually loads', () => {
    const layout = read('src/app/layout.tsx');
    for (const f of FONTS) expect(layout, f.family).toContain(f.family.replace(' ', '_'));
    expect(FONTS).toHaveLength(3);
  });

  it('offers only files that exist, and each is a real image', () => {
    for (const m of MARKS) {
      const p = path.join(process.cwd(), 'public', m.file);
      expect(existsSync(p), m.file).toBe(true);
      expect(statSync(p).size, m.file).toBeGreaterThan(10_000);
    }
  });

  it('makes the moose the one mark, on ink', () => {
    expect(MARKS[0].file).toBe(SITE.logo.src);
    expect(MARKS[0].dark).toBe(true);
    for (const f of ['src/components/poster/Header.tsx', 'src/components/poster/Footer.tsx']) {
      const src = read(f);
      expect(src, f).toContain('SITE.logo.src');
      // A white knockout on cream is invisible: every placement sits on night,
      // which stays dark in both modes (ink flips to cream in dark mode).
      expect(src, f).toContain('bg-night');
    }
    // The homepage carries Candy's GOLD moose since 2026-09-10 (made for any
    // ground). If it ever places the white one again, it must be on night.
    const home = read('src/app/page.tsx');
    if (home.includes('SITE.logo.src')) expect(home).toContain('bg-night');
  });

  // RETIRED AND PULLED 2026-09-10. Candy retired the 26 badge as "too similar
  // to the original Woodstock logo and branding"; Zaal: "Pull it". A press page
  // handing it out invites the comparison she changed the logo to avoid, so it
  // must not come back through a kit, a page or a public file.
  it('never offers or serves the retired badge', () => {
    expect(MARKS.some((m) => /badge/i.test(m.file + m.name))).toBe(false);
    for (const f of ['zaostock26_badge_official.png', 'zaostock26_badge_bw_final.png']) {
      expect(existsSync(path.join(process.cwd(), 'public/brand/logos', f)), f).toBe(false);
    }
    for (const f of ['src/app/press/page.tsx', 'src/lib/press-kit.ts', 'src/content/design-kit.ts', 'src/content/site.ts', 'docs/marketing/press-kit.md', 'public/design/colors.html']) {
      expect(read(f), f).not.toMatch(/\/brand\/logos\/zaostock26_badge|SITE\.badge/);
    }
  });

  // Zaal, 2026-09-10: the moose is by attabotty. Every surface that offers the
  // mark as a download carries the credit.
  it('credits the moose to attabotty wherever it is offered as a download', () => {
    expect(SITE.logo.credit).toBe('attabotty');
    for (const m of MARKS.filter((m) => m.file.includes('moose'))) expect(m.note).toContain('attabotty');
    expect(read('src/app/press/page.tsx')).toContain('SITE.logo.credit');
    expect(read('src/lib/press-kit.ts')).toContain('SITE.logo.credit');
  });

  it('builds the downloadable palette from the same list', () => {
    const css = paletteCss();
    for (const c of COLOURS) expect(css).toContain(`--zaostock-${c.token}: ${c.hex};`);
  });
});

// Candy's signage and illustrations (2026-09-10). What is shown must exist, and
// what was held back must not be able to slip into public/ unnoticed.
describe('signage and illustrations on /design', () => {
  const ELEMENTS = path.join(process.cwd(), 'public/brand/elements');

  it('offers only real webp files that exist', () => {
    for (const a of [...SIGNS, ...ILLUSTRATIONS]) {
      const p = path.join(process.cwd(), 'public', a.file);
      expect(existsSync(p), a.file).toBe(true);
      const head = readFileSync(p).subarray(0, 12);
      expect(head.subarray(0, 4).toString('latin1'), a.file).toBe('RIFF');
      expect(head.subarray(8, 12).toString('latin1'), a.file).toBe('WEBP');
    }
    expect(SIGNS.map((s) => s.name)).toEqual(['Stage', 'Food', 'Art', 'Merch', 'Info', 'Restrooms', 'Welcome to ZAOstock', 'Set times', 'Thank you Ellsworth', 'Franklin St Parklet']);
  });

  it('ships nothing in public/brand/elements that the page does not list', () => {
    const listed = new Set([...SIGNS, ...ILLUSTRATIONS].map((a) => path.basename(a.file)));
    expect(readdirSync(ELEMENTS).filter((f) => !listed.has(f))).toEqual([]);
  });

  // Held back on purpose: Woodstock-adjacent birds and doves, day-of
  // credentials, ticket graphics for an event that needs no ticket, and beer.
  it('holds back the birds, doves, credentials and tickets', () => {
    const held = /bird|dove|badge_|wristband|ticket|beer/i;
    expect(readdirSync(ELEMENTS).filter((f) => held.test(f))).toEqual([]);
    expect([...SIGNS, ...ILLUSTRATIONS].filter((a) => held.test(a.file))).toEqual([]);
  });

  it('never calls the retired badge usable', () => {
    const rules = JSON.stringify(RULES);
    expect(rules).not.toMatch(/still usable|archive mark/i);
    expect(rules).toMatch(/retired/);
    expect(rules).toContain('CandyToyBox');
  });
});
