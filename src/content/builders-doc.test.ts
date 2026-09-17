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
    expect(body).toContain('12:05 to 5:46');
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
