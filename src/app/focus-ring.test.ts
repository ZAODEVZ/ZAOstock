import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// WCAG 1.4.11 / 2.4.11: a focus indicator needs 3:1 against what it sits on.
// The old ring was translucent gold (alpha 0.45-0.5) and measured 1.2-1.3:1 on
// the cream grounds (Dotfiles, 2026-09-28). A translucent ring is the failure
// shape, so every definition of the token must be opaque.
const css = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

function hexToLum(hex: string): number {
  const c = hex.replace('#', '').match(/../g)!.map((h) => parseInt(h, 16) / 255);
  const [r, g, b] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a: string, b: string) => {
  const [x, y] = [hexToLum(a), hexToLum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

describe('keyboard focus ring', () => {
  it('is never translucent', () => {
    const defs = css.match(/--shadow-focus:[^;]+;/g) ?? [];
    expect(defs.length).toBeGreaterThan(0);
    for (const d of defs) expect(d, d).not.toMatch(/rgba|hsla|transparent/);
  });

  it('draws an outline site-wide that no utility class can switch off', () => {
    // Unlayered, so it outranks Tailwind's utilities layer (the failure it fixes:
    // shadow-hard beat focus-visible:[box-shadow:...] on the RSVP pill).
    const i = css.indexOf(':focus-visible {\n  outline: 3px solid var(--color-red-700);');
    expect(i).toBeGreaterThan(-1);
    // Top level means brace depth 0 where the selector starts: inside any
    // @layer, @media or rule block the depth would be 1 or more.
    const start = css.lastIndexOf('\n', css.lastIndexOf('.site :is(', i));
    const before = css.slice(0, start).replace(/\/\*[\s\S]*?\*\//g, '');
    const depth = (before.match(/\{/g) ?? []).length - (before.match(/\}/g) ?? []).length;
    expect(depth, 'the focus rule must be unlayered, at the top level').toBe(0);
  });

  it('clears 3:1 on every ground, light and dark', () => {
    for (const bg of ['#F2E6D3', '#FAF3E6', '#F2E6CC']) expect(ratio('#8F3E1E', bg)).toBeGreaterThanOrEqual(3);
    for (const bg of ['#1C150D', '#2C2115']) expect(ratio('#F0955A', bg)).toBeGreaterThanOrEqual(3);
  });
});
