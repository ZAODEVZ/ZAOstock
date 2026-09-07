import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { SITE } from './site';

// The reveal date has ALREADY drifted once: 1 September became 7 September on
// 2026-08-31, and src/app/press/page.tsx still carries a comment saying so. It
// was typed as a literal in eight files at the time.
//
// site.ts holds the one source, SITE.lineupRevealLabel. On 2026-09-01 five
// pieces of RENDERED copy were still not reading it - three in the press-kit
// placeholder, one on /sponsor, two in llms.txt - so the next move of the date
// would have left the public site announcing two different days with nothing
// failing. This is the same guard tickets.test.ts puts on the Pro Ticket price.
//
// Comments may name the date while explaining themselves. Rendered copy may not.
const SURFACES = [
  'src/lib/press-kit.ts',
  'src/app/sponsor/page.tsx',
  'src/app/llms.txt/route.ts',
  'src/app/program/page.tsx',
];

const code = (p: string) =>
  readFileSync(path.join(process.cwd(), p), 'utf8')
    .split('\n')
    .filter((l) => {
      const t = l.trim();
      return !t.startsWith('//') && !t.startsWith('*') && !t.startsWith('/*');
    })
    .join('\n');

describe('the lineup reveal date has one source', () => {
  it('is never typed as a literal in rendered copy', () => {
    for (const p of SURFACES) {
      expect(code(p)).not.toContain(SITE.lineupRevealLabel);
      expect(code(p)).not.toContain(SITE.lineupRevealDate);
      expect(code(p)).not.toContain('September 7');
      // The date has now drifted twice: 1 -> 7 -> 18 September. The old literal
      // stays guarded as well as the new one.
      expect(code(p)).not.toContain('September 18');
    }
  });

  it('still carries the day Zaal typed, in both the label and the gate', () => {
    expect(SITE.lineupRevealLabel).toBe('18 September');
    expect(SITE.lineupRevealDate).toBe('2026-09-18');
    // The label and the gate must name the same day, or the site announces one
    // date and opens on another.
    expect(SITE.lineupRevealDate).toContain('-09-18');
    expect(SITE.lineupRevealLabel.startsWith('18 ')).toBe(true);
  });
});
