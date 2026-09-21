import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { PARTNERS } from './site';

/**
 * THE PRESS KIT CANNOT DRIFT FROM THE PARTNER LIST.
 *
 * Same structural reason as press-kit-lineup.test.ts: `docs/marketing/press-kit.md`
 * is static markdown and cannot import `PARTNERS`. It already drifted once - written
 * 2026-08-27 with 8 partners, while WE THE MEDIA and Heart of Ellsworth were added
 * to `src/content/site.ts` on 2026-09-16 and 2026-09-18 and never landed here until
 * 2026-09-21. Nothing caught that until this file was read by hand.
 *
 * This closes it the same way the lineup guard does: every confirmed partner name
 * must appear in the kit, or the test fails and says which one is missing.
 */

const KIT = path.join(process.cwd(), 'docs/marketing/press-kit.md');
const text = () => readFileSync(KIT, 'utf8');

describe('press kit partners', () => {
  it('names every confirmed partner, so one cannot be quietly dropped', () => {
    const md = text();
    const missing = PARTNERS.map((p) => p.name).filter((n) => !md.includes(n));
    expect(
      missing,
      missing.length
        ? `\nThese partners are confirmed in PARTNERS but appear nowhere in the press kit:\n` +
            missing.map((n) => `  - ${n}`).join('\n') +
            `\nAdd them to docs/marketing/press-kit.md's Partners section, or unconfirm\n` +
            `them in src/content/site.ts. Do not leave the two disagreeing - /press is\n` +
            `what a journalist reads.\n`
        : '',
    ).toEqual([]);
  });
});
