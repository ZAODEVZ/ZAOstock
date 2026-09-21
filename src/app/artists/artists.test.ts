import { describe, expect, it } from 'vitest';
import { LINEUP_NAMES } from '@/content/site';
import { LINEUP_ARTISTS } from './lineup-artists';

/**
 * THE ARTISTS PAGE CANNOT DRIFT FROM THE LINEUP.
 *
 * LINEUP_ARTISTS carries its own name/slug/genre/highlight per act, hand-
 * maintained separately from LINEUP_NAMES in src/content/site.ts because it
 * needs more than a name - same structural reason docs/marketing/press-kit.md
 * has its own copy of the running order (see press-kit-lineup.test.ts). That
 * means nothing enforces the two arrays staying in sync: an act renamed,
 * reordered or dropped from LINEUP_NAMES would leave this page quietly
 * wrong, on the page a fan actually browses for the lineup.
 */
describe('artists page lineup', () => {
  it('names every act in LINEUP_NAMES, in the same order', () => {
    expect(LINEUP_ARTISTS.map((a) => a.name)).toEqual([...LINEUP_NAMES]);
  });

  it('carries no act that is not in LINEUP_NAMES', () => {
    const extra = LINEUP_ARTISTS.map((a) => a.name).filter((n) => !LINEUP_NAMES.includes(n));
    expect(extra).toEqual([]);
  });
});
