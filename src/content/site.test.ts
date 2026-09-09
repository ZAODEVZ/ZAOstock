import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { PARTNERS, PUBLIC_LINEUP, LINEUP_NAMES, LINEUP_NAMES_NOTE, TIERS, SITE, DAY, SERIES, ZAO, WAVEWARZ_STATS, ELLSWORTH, DELIVERABLES } from './site';

// The rules festival.test.ts enforces for festival.ts, applied to the facts
// that live here until PRODUCTION's file absorbs them.

// 'north creek' left this list on 2026-09-07: Zaal settled it as the after-party
// act at Black Moon, 6-9pm, underwritten by them. It is no longer proposed.
// 'aquavantes' STAYS: the act is unconfirmed for the programme and its spelling is
// still disputed (repo and organising doc say Aquavantes, Zaal said Aquaventus,
// only Steve can settle it), so it must not reach a public surface either way.
const PROPOSED = ['aquavantes', 'somes sound'];
const NOT_PUBLIC = ['werb', 'sen wilde', 'phelan'];

describe('SITE facts', () => {
  it('publishes noon, the contact address and the reveal date', () => {
    expect(SITE.musicFrom).toBe('Noon');
    expect(SITE.contact).toBe('info@thezao.com');
    expect(SITE.lineupRevealDate).toBe('2026-09-13');
    expect(SITE.submissionCutoffDate).toBe('2026-09-01');
  });

  it('names no proposed act anywhere', () => {
    const blob = JSON.stringify({ PARTNERS, PUBLIC_LINEUP, LINEUP_NAMES, TIERS, SITE, DAY, SERIES }).toLowerCase();
    for (const name of PROPOSED) expect(blob).not.toContain(name);
  });

  it('keeps every unconfirmed act out of the public lineup', () => {
    const blob = PUBLIC_LINEUP.join(' ').toLowerCase();
    for (const name of NOT_PUBLIC) expect(blob).not.toContain(name);
    expect(PUBLIC_LINEUP).toEqual(['Lyons Den']);
  });

  // PUBLIC_LINEUP is the website's half of the reveal: the app reads the artists
  // table, the site reads this array, and on 7 September BOTH have to change.
  // So this array is guaranteed to be edited under time pressure, and a surface
  // that indexes it renders the literal string "undefined" the moment it is
  // emptied or reordered. /program did exactly that on the public run of show.
  it('is never indexed into a template without a guard on the same line', () => {
    const surfaces = ['src/app/program/page.tsx', 'src/app/page.tsx'];
    for (const p of surfaces) {
      const src = readFileSync(path.join(process.cwd(), p), 'utf8');
      for (const line of src.split('\n')) {
        for (const hit of line.matchAll(/\$\{PUBLIC_LINEUP\[(\d+)\]\}/g)) {
          const i = hit[1];
          expect(
            line,
            `${p}: PUBLIC_LINEUP[${i}] is interpolated with nothing checking it exists`,
          ).toMatch(new RegExp(`PUBLIC_LINEUP\\[${i}\\]\\s*(\\?|&&)`));
        }
      }
    }
  });

  it('carries no price until Zaal types one', () => {
    for (const t of TIERS) expect(t.price).toBeNull();
  });

  it('lists nine confirmed partners', () => {
    expect(PARTNERS).toHaveLength(9);
    expect(PARTNERS.map((p) => p.name)).toContain('Bomb Squad');
    expect(PARTNERS.map((p) => p.name)).toContain('COC Concertz');
    expect(PARTNERS.map((p) => p.name)).not.toContain('Heart of Ellsworth');
    for (const p of PARTNERS) expect(p.confirmed).toBe(true);
  });

  // The test above was called '...and only partners with a POC field' and made
  // no assertion about poc whatsoever. The gating rule over PARTNERS is strict -
  // a partner is published only when it is confirmed AND poc names the ZAO team
  // member who owns the relationship - and only half of it was enforced.
  //
  // COC Concertz is the one known exception: added 2026-08-27 with role and POC
  // untyped. It is NAMED here rather than waved through, so a second unowned
  // partner cannot reach the public homepage without this going red.
  it('gives every published partner a typed role and a named owner, bar the one known exception', () => {
    const untyped = PARTNERS.filter((p) => p.role === 'UNSET' || p.poc === 'UNSET').map((p) => p.name);
    expect(untyped).toEqual(['COC Concertz']);
    for (const p of PARTNERS) {
      expect(p.poc.trim()).not.toBe('');
      expect(p.role.trim()).not.toBe('');
    }
  });

  it('describes one venue at a time with no changeover DJ', () => {
    const blob = JSON.stringify(DAY).toLowerCase();
    expect(blob).not.toContain('dj in every');
    expect(blob).not.toContain('second stage');
    expect(DAY[0].what).toContain('MC');
  });

  it('never claims a tax-deductible path', () => {
    const blob = JSON.stringify({ SITE, TIERS }).toLowerCase();
    expect(blob).not.toContain('tax-deductible');
    expect(blob).not.toContain('501(c)');
  });
});

// Zaal, 2026-09-07: "lets just update it with the names but no times and no links
// and over the week this week we will just add it all to the website."
//
// So the guard changed shape rather than going away. It used to say "do not name
// these acts". It now says "name them, but never claim they signed, and publish no
// set time and no link until the rest is filled in". None of the nine has
// countersigned, so a rendered "confirmed" next to these names would be a
// fabricated signature - the one line that has not moved all week.
describe('the names-only lineup', () => {
  const RUN_OF_SHOW = [
    'The Crown Vics',
    'OPEN X',
    'Grass Rug',
    'Acadia Rising',
    'Michael Anderson',
    'Hurricane',
    'Dcoop',
    'Lyons Den',
    'Fellenz',
  ];

  it('is the nine acts of the locked run of show, in order', () => {
    expect(LINEUP_NAMES).toEqual(RUN_OF_SHOW);
  });

  it('carries NO set time and NO link', () => {
    for (const entry of [...LINEUP_NAMES, LINEUP_NAMES_NOTE]) {
      expect(entry).not.toMatch(/\d{1,2}:\d{2}/);
      expect(entry).not.toMatch(/\b\d{1,2}\s*(AM|PM)\b/i);
      expect(entry).not.toMatch(/https?:\/\//);
    }
  });

  it('never claims these acts are confirmed - none has countersigned', () => {
    expect(LINEUP_NAMES_NOTE.toLowerCase()).not.toContain('confirm');
    for (const p of ['src/app/page.tsx', 'src/app/program/page.tsx']) {
      const lines = readFileSync(path.join(process.cwd(), p), 'utf8').split('\n');
      const offending = lines.filter(
        (l) => l.includes('LINEUP_NAMES') && /confirm/i.test(l),
      );
      expect(offending).toEqual([]);
    }
  });

  it('keeps "confirmed" for PUBLIC_LINEUP only, which is a different and narrower claim', () => {
    expect(PUBLIC_LINEUP).toEqual(['Lyons Den']);
    expect(LINEUP_NAMES.length).toBeGreaterThan(PUBLIC_LINEUP.length);
  });
});

// Zaal, 2026-09-07: WaveWarZ is OFF the 3 October programme. The locked run of
// show puts Lyons Den at 16:30 and Fellenz at 17:15 in the window the battle
// used to hold, so it was already off in practice while four surfaces still
// advertised it.
//
// The distinction this guards: WaveWarZ the FORMAT is real, is a confirmed
// partner and genuinely happened at ZAO-CHELLA in December 2024. What is gone is
// the claim that it is on the ZAOstock bill. Do not "fix" this by deleting the
// word everywhere - the history is true and deleting it would be its own error.
describe('WaveWarZ is off the 3 October programme', () => {
  const BATTLERS = ['Jango', 'Lui', 'Quan'];

  it('holds no battle slot in the published day', () => {
    const day = JSON.stringify(DAY);
    expect(day).not.toContain('WaveWarZ');
    expect(day).not.toContain('head to head');
  });

  it('names no battler anywhere in the site content', () => {
    const blob = JSON.stringify({ PARTNERS, PUBLIC_LINEUP, LINEUP_NAMES, TIERS, SITE, DAY, SERIES });
    for (const b of BATTLERS) expect(blob).not.toContain(b);
  });

  it('leaves the outdoor block running to six, with no gap where the battle was', () => {
    const outdoor = DAY.filter((d) => d.where.includes('Franklin Street'));
    expect(outdoor).toHaveLength(1);
    expect(outdoor[0].time).toBe('Noon - 6 PM');
  });

  it('keeps WaveWarZ as a partner, but claiming no stage slot', () => {
    const w = PARTNERS.find((p) => p.name === 'WaveWarZ');
    expect(w).toBeDefined();
    expect(w!.role).not.toContain('ZAOstock stage');
  });

  it('KEEPS the true ZAO-CHELLA 2024 history - that battle really happened', () => {
    const chella = SERIES.find((s) => s.name === 'ZAO-CHELLA');
    expect(chella).toBeDefined();
    expect(JSON.stringify(chella)).toContain('WaveWarZ');
  });
});

/**
 * RETIRED CLAIMS. Each of these was live on a public sponsor surface on
 * 2026-09-09 and was found by rendering the page, not by reading this file.
 * The point of pinning VALUES rather than files is that a barred figure or
 * phrase trips wherever it reappears, including in a file nobody thought to
 * add to a checklist. That is the failure mode these three came back through.
 */
describe('retired claims stay retired', () => {
  // Everything in this module that could reach a page.
  const surfaces = JSON.stringify({ SITE, ZAO, WAVEWARZ_STATS, SERIES, ELLSWORTH, TIERS, DELIVERABLES, DAY });

  const BARRED: ReadonlyArray<readonly [RegExp, string]> = [
    [/\bon-?chain\b/i, 'no crypto or web3 framing on a local Maine surface'],
    [/\bblockchain\b/i, 'no crypto or web3 framing on a local Maine surface'],
    [/\bweb ?3\b/i, 'no crypto or web3 framing on a local Maine surface'],
    [/\b157\b/, 'never quote a specific ZAO member count, use "100+"'],
    [/\b1,?452\b/, 'stale WaveWarZ figure, superseded 2026-09-09'],
    [/18 September/, 'the reveal is 13 September; the 18th replicated into a sibling lane'],
    [/\$ ?25,?000|\$ ?25K/i, '$25K is internal only; $5,000 is the only public figure'],
  ];

  for (const [pattern, why] of BARRED) {
    it(`does not carry ${pattern.source} - ${why}`, () => {
      expect(surfaces).not.toMatch(pattern);
    });
  }

  // A guard that cannot fail is not a guard. This proves the check above is
  // actually looking at something, so deleting a constant cannot silently
  // turn every assertion into a pass over an empty string.
  it('is actually inspecting real content', () => {
    expect(surfaces.length).toBeGreaterThan(500);
    expect(surfaces).toContain('Franklin Street Parklet');
  });
});
