import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

// docs/builders/build-on-zaostock-2026-08-29.md is rendered verbatim at
// zaostock.com/build. It is dated, so it was treated as history and left alone
// while the festival changed under it. On 2026-09-12 the live page still said
// WaveWarZ was on the 3 October programme (off since 09-07), still named
// Hurricane on the mic (out since 09-10), still listed ENTERACT and Web3Metal
// as partners (not partners since 09-10) and still promised a 1 September
// reveal. A dated file that a public route renders is not history.

const DOC = 'docs/builders/build-on-zaostock-2026-08-29.md';

describe('what /build tells a builder', () => {
  // The update banner names what changed, so quoted lines are exempt.
  const body = readFileSync(path.join(process.cwd(), DOC), 'utf8')
    .split('\n')
    .filter((l) => !l.trim().startsWith('>'))
    .join('\n');

  it('carries no retired name, act or partner', () => {
    for (const re of [/hurricane|hurric4n3/i, /enteract/i, /web3 ?metal/i]) {
      expect(body, re.source).not.toMatch(re);
    }
  });

  it('does not put WaveWarZ back on the 3 October stage', () => {
    expect(body).not.toMatch(/4 to 6 PM WaveWarZ|takes the parklet stage/i);
    expect(body).toMatch(/NOT on the 3 October programme/);
  });

  it('has the retimed day and no reveal date', () => {
    expect(body).not.toMatch(/5:55|17:55|revealed 1 September|reveal date is/i);
    expect(body).toMatch(/noon to six/);
  });

  // THE 2026-09-18 AUDIT FINDING. This doc carried "music 12:05 to 5:46" in two
  // places, added by the 09-12 retime pass. Those are not day boundaries: the
  // running order IS public (/program), so 12:05 is The Crown Vics' downbeat and
  // 5:46 is when Tom Fellenz finishes. Zaal, 2026-09-12: "no set times listed
  // publicly. Not on the site, not in posts, not in the reveal copy. Name the
  // act, not the slot." src/content/no-public-set-times.test.ts holds that for
  // the program rows; this doc is rendered verbatim at a public route and sat
  // outside it. Noon and six survive, because they pin no act and people have
  // to know when to turn up.
  it('publishes the window, never a time that pins an act', () => {
    // 11:59 PM PT on the closed August bounty falls outside the window anyway; it is
    // named so the one legitimate clock in this file is explicit rather than lucky.
    const ALLOWED = new Set(['11:59']);
    const found = (body.match(/\b(1[2-9]|[1-9]):[0-5][0-9]\b/g) ?? []).filter((t) => !ALLOWED.has(t));
    expect(found, `clock times in public builder copy: ${found.join(', ')}`).toEqual([]);
  });

  it('tells a builder the clock is deliberately absent, so nobody builds a grid around it', () => {
    expect(body).toMatch(/Set times \| \*\*Not public/);
    expect(body).toMatch(/build it around the order/);
  });

  // A dated file a public route renders is not history: the same lesson as the
  // banner above, in the other direction. This line introduced a bounty that
  // closed on 30 August as one a builder could still enter.
  it('does not advertise a closed bounty as open', () => {
    expect(body).not.toMatch(/A live bounty right now/);
    expect(body).toMatch(/closed on Sunday 30 August/);
  });

  // THE 2026-09-16 AUDIT FINDING: the glossary/spellings list said "Dcoop"
  // (lowercase c) and bare "Fellenz" - the two headliners' public billing per
  // commit d388b55 "branding: adopt Tom Fellenz as public billing everywhere"
  // (#194) and site.ts LINEUP_NAMES ('DCoop', 'Tom Fellenz'). Checks every
  // mention in the doc, not just the glossary line the audit happened to
  // flag - a bare "Fellenz" or lowercase "Dcoop" is wrong wherever it is.
  it('spells DCoop and Tom Fellenz correctly everywhere, not just in the glossary', () => {
    expect(body).not.toMatch(/\bDcoop\b/);
    expect(body).not.toMatch(/(?<!Tom )\bFellenz\b/);
  });
});
