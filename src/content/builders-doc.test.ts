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

  it('has no public set times and no reveal date', () => {
    // Zaal, 2026-09-12: no set times listed publicly, anywhere - reversed the
    // 09-10 call this doc's "12:05 to 5:46" assertion used to guard. Checked
    // against the summary line and the Music fact row specifically, not the
    // whole document - the August bounty deadline elsewhere in the doc
    // ("11:59 PM PT") is a real clock time that has nothing to do with the
    // festival's own set times.
    const summaryLine = body.split('\n').find((l) => l.startsWith('ZAOstock is a free'));
    const musicRow = body.split('\n').find((l) => l.startsWith('| Music |'));
    expect(summaryLine).toBeDefined();
    expect(musicRow).toBeDefined();
    for (const line of [summaryLine, musicRow]) {
      expect(line, line).not.toMatch(/\b\d{1,2}:[0-5]\d\b/);
    }
    expect(body).not.toMatch(/revealed 1 September|reveal date is/i);
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
