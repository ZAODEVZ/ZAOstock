import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { SITE } from './site';

// THERE IS NO REVEAL DATE. Zaal, 2026-09-10: "stop making a whole reveal date -
// we will just post about each of them individually starting on Saturday with
// their bio and photo."
//
// This file used to prove the reveal date was PRESENT and matched everywhere
// (it drifted 1 -> 7 -> 13 September and reached eight files once). It now
// proves the date is GONE. That is the only version of the test that can catch
// a re-add: a check that a date matches passes happily on the date coming back.
//
// Comments may still tell the history. Rendered copy may not promise a reveal.
const RENDERED = [
  'src/app/page.tsx',
  'src/app/program/page.tsx',
  'src/app/sponsor/page.tsx',
  'src/app/llms.txt/route.ts',
  'src/app/backstage/[code]/page.tsx',
  'src/lib/press-kit.ts',
];

const code = (p: string) =>
  readFileSync(path.join(process.cwd(), p), 'utf8')
    .split('\n')
    .filter((l) => {
      const t = l.trim();
      return !t.startsWith('//') && !t.startsWith('*') && !t.startsWith('/*') && !t.startsWith('{/*');
    })
    .join('\n');

describe('the reveal date is gone and stays gone', () => {
  it('has no lineupRevealLabel or lineupRevealDate in SITE', () => {
    expect('lineupRevealLabel' in SITE).toBe(false);
    expect('lineupRevealDate' in SITE).toBe(false);
  });

  it('is not promised on any rendered surface', () => {
    for (const p of RENDERED) {
      const c = code(p);
      expect(c, p).not.toContain('lineupReveal');
      expect(c, p).not.toMatch(/13 September|September 13|Lineup reveal|reveal on/i);
    }
  });

  // docs/marketing/press-kit.md is what /press RENDERS, and it is static
  // markdown that cannot read SITE - which is exactly how it drifted before.
  it('is not promised in the rendered press kit', () => {
    const md = readFileSync(path.join(process.cwd(), 'docs/marketing/press-kit.md'), 'utf8');
    const rendered = md.slice(md.indexOf('\n---\n'));
    expect(rendered).not.toMatch(/13 September|reveal on|the reveal/i);
  });

  it('is not on the crew board either', () => {
    const ops = readFileSync(path.join(process.cwd(), 'ops-room/ops-room.src.html'), 'utf8');
    expect(ops).not.toMatch(/Sun 13 Sep|reveal on Sunday|Lineup reveal/);
  });
});

// Nobody has countersigned a memo. "Booked and locked in the run of show" is a
// different claim from "confirmed", and press copy is where that gets lost.
describe('the rendered press kit', () => {
  it('never calls an act confirmed', () => {
    const md = readFileSync(path.join(process.cwd(), 'docs/marketing/press-kit.md'), 'utf8');
    const claims = md.split('\n').filter((l) => /\bis confirmed\b/i.test(l) && !/partner/i.test(l));
    expect(claims).toEqual([]);
  });
});
