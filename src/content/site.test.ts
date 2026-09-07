import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { PARTNERS, PUBLIC_LINEUP, TIERS, SITE, DAY, SERIES } from './site';

// The rules festival.test.ts enforces for festival.ts, applied to the facts
// that live here until PRODUCTION's file absorbs them.

const PROPOSED = ['crown vics', 'aquavantes', 'somes sound', 'north creek'];
const NOT_PUBLIC = ['werb', 'fellenz', 'dcoop', 'acadia rising', 'sen', 'phelan'];

describe('SITE facts', () => {
  it('publishes noon, the contact address and the reveal date', () => {
    expect(SITE.musicFrom).toBe('Noon');
    expect(SITE.contact).toBe('info@thezao.com');
    expect(SITE.lineupRevealDate).toBe('2026-09-18');
    expect(SITE.submissionCutoffDate).toBe('2026-09-01');
  });

  it('names no proposed act anywhere', () => {
    const blob = JSON.stringify({ PARTNERS, PUBLIC_LINEUP, TIERS, SITE, DAY, SERIES }).toLowerCase();
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
