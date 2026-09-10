import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, statSync } from 'fs';
import path from 'path';
import { COLOURS, FONTS, MARKS, paletteCss } from './design-kit';
import { SITE } from './site';

const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');

describe('the design kit cannot drift from the site it describes', () => {
  it('gives every colour the exact hex the site uses', () => {
    const css = read('src/app/globals.css');
    const drift = COLOURS.filter((c) => {
      const m = css.match(new RegExp(`--color-${c.token}:\\s*(#[0-9A-Fa-f]{6})`));
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

  it('makes the moose the primary mark and keeps the badge as archive', () => {
    expect(MARKS[0].file).toBe(SITE.logo.src);
    expect(MARKS[0].dark).toBe(true);
    expect(MARKS.some((m) => m.file === SITE.badge.src && !m.dark)).toBe(true);
    for (const f of ['src/components/poster/Header.tsx', 'src/components/poster/Footer.tsx', 'src/app/page.tsx']) {
      const src = read(f);
      expect(src, f).toContain('SITE.logo.src');
      expect(src, f).not.toContain('SITE.badge.src');
      // A white knockout on paper is invisible: every placement sits on ink.
      expect(src, f).toContain('bg-ink-950');
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
