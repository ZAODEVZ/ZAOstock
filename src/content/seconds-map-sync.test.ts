import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { OPS_ACTS } from './artist-ops';

/**
 * THE SECONDS MAP SAYS WHO COVERS A LEAD WHILE THE LEAD IS ON STAGE.
 *
 * It is the fifth copy of the run of show, and until 2026-09-18 it was the worst
 * of them, because it did not just carry stale times: it carried a stale
 * PROBLEM. Its headline gap was four straight hours of covering one person
 * through a WaveWarZ block and an evening DJ set, neither of which is happening,
 * while the two real conflicts were unwritten - OPEN X run the PA and play
 * second, and DCoop holds the desk and plays at 15:32.
 *
 * So this test pins two different things: that the windows match the grid, and
 * that the conflicts the file names are the ones the day actually has.
 */

const MAP = 'docs/plans/seconds-map-2026-10-03.md';
const map = readFileSync(path.join(process.cwd(), MAP), 'utf8');

/** `| 12:05-12:38 | Steve Peer (The Crown Vics) | ...` -> "12:05-12:38" */
function windows(): string[] {
  return [...map.matchAll(/^\|\s*(\d{1,2}:\d{2})-(\d{1,2}:\d{2})\s*\|/gm)].map((m) => `${m[1]}-${m[2]}`);
}

/** The grid's own windows, start plus length. */
function actWindows(): Map<string, string> {
  const out = new Map<string, string>();
  for (const a of OPS_ACTS) {
    const [h, m] = a.setStart.split(':').map(Number);
    const end = h * 60 + m + a.minutes;
    out.set(a.name, `${a.setStart}-${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`);
  }
  return out;
}

describe('the windows are the grid, not a memory of it', () => {
  it('gives every window it names to a real act, at the real time', () => {
    const real = new Set(actWindows().values());
    for (const w of windows()) {
      expect(real, `window ${w} is not an act's window`).toContain(w);
    }
  });

  it('covers the two acts whose members hold a live role', () => {
    const byAct = actWindows();
    // OPEN X bring and run the PA all day (Zaal, 15 Sept) and play second.
    expect(map).toContain(`| ${byAct.get('OPEN X')} | OPEN X |`);
    // DCoop is the music and AV lead and a stage manager.
    expect(map).toContain(`| ${byAct.get('DCoop')} | DCoop |`);
  });

  it('keeps no second copy of the running order', () => {
    // This file used to end with its own "Final outdoor order" table, from
    // 31 August, six acts, a battle reset at 15:50. That copy is how it came to
    // describe a day nobody is running.
    expect(map).not.toMatch(/Final outdoor order/i);
    // The old copy's rows were "| window | act | length |". The conflict table
    // here is four columns and its third is prose, so this catches a re-added
    // order table without catching the paragraph that explains why one is gone.
    expect(map).not.toMatch(/^\|\s*\d{1,2}:\d{2}-\d{1,2}:\d{2}\s*\|[^|]*\|\s*\d+\s*\|\s*$/m);
  });
});

describe('the conflicts it names are the ones the day has', () => {
  it('does not staff a shift that was cancelled', () => {
    const live = map
      .split('\n')
      .filter((l) => !l.trim().startsWith('>'))
      .join('\n');
    for (const gone of [/stilo/i, /wavewarz/i, /hurricane is out.*second/i]) {
      expect(live, gone.source).not.toMatch(gone);
    }
  });

  it('names the PA conflict, which nothing carried before', () => {
    expect(map).toMatch(/OPEN X cannot run their own sound/);
  });

  it('holds First Aid to the date Zaal parked it to', () => {
    // "PARKED until ~18 September" was written on 31 August. That date has
    // arrived, and a parked item with a passed date is just an unowned one.
    expect(map).toMatch(/First Aid contact \| \*\*DUE NOW\.\*\*/);
  });
});
