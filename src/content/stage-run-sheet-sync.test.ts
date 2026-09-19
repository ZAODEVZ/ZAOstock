import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { OPS_ACTS } from './artist-ops';

/**
 * THE STAGE MANAGER'S ONE-PAGER IS ANOTHER COPY OF THE RUN OF SHOW.
 *
 * `run-of-show-sync.test.ts` holds program BLOCKS, the ops room and the artists
 * table together. docs/plans/run-sheet-2026-10-03.md was outside all of it, and
 * it is the page the stage manager actually works from on the day.
 *
 * On 2026-09-18 it still ran the August day: five acts at 30 minutes, 10/5/5/10
 * changeovers, an open stretch at 15:05, a WaveWarZ battle block from 15:45 with
 * Hurricane on the host mic, and Stilo playing the crowd next door at 18:00.
 * WaveWarZ came off on 09-07, Hurricane went on 09-10, the day was retimed on
 * 09-10 and the evening was ruled on 09-14. Four supersessions, none of which
 * reached the page that runs the stage.
 *
 * It is held to OPS_ACTS, which carries the minutes and is itself held to
 * BLOCKS: one chain, not two.
 */

const SHEET = 'docs/plans/run-sheet-2026-10-03.md';
const sheet = readFileSync(path.join(process.cwd(), SHEET), 'utf8');

/** `| 12:05 | 1. The Crown Vics (33) | ...` -> { time, name, minutes } */
function actRows(): { time: string; name: string; minutes: number }[] {
  const rows: { time: string; name: string; minutes: number }[] = [];
  for (const m of sheet.matchAll(/^\|\s*(\d{1,2}:\d{2})\s*\|\s*\d\.\s*([^(|]+)\((\d+)\)/gm)) {
    rows.push({ time: m[1], name: m[2].trim(), minutes: Number(m[3]) });
  }
  return rows;
}

/**
 * Two kinds of line name a dropped act legitimately: the rewrite banner, which
 * exists to say what was removed, and the line telling the stage manager the
 * between-sets mic is open BECAUSE Hurricane went. Every other line in this file
 * is a live instruction to somebody standing in a street on 3 October.
 */
const liveInstructions = sheet
  .split('\n')
  .filter((l) => !l.trim().startsWith('>') && !l.includes('between-sets voice and is out'))
  .join('\n');

describe('the stage-manager run sheet follows the run of show', () => {
  it('runs every act, in order, at the time and length the grid says', () => {
    const rows = actRows();
    expect(rows).toHaveLength(OPS_ACTS.length);
    expect(rows.map((r) => r.time)).toEqual(OPS_ACTS.map((a) => a.setStart));
    expect(rows.map((r) => r.name)).toEqual(OPS_ACTS.map((a) => a.name));
    expect(rows.map((r) => r.minutes)).toEqual(OPS_ACTS.map((a) => a.minutes));
  });

  it('puts nobody on the mic who is off the programme', () => {
    for (const gone of [/hurricane/i, /wavewarz/i, /stilo/i, /open stretch/i]) {
      expect(liveInstructions, gone.source).not.toMatch(gone);
    }
  });
});

describe('the evening, as ruled on 14 September', () => {
  it('is the after-party at Black Moon with Steve on the decks', () => {
    expect(sheet).toMatch(/After-party at Black Moon, DJ run by Steve, from six/);
  });

  it('does not invent a close time Black Moon has not given', () => {
    expect(sheet).toMatch(/Close is Black Moon's licence and their call/);
  });
});

describe('what the sheet still owes a name', () => {
  // A one-pager that quietly drops an open role reads as settled. These three
  // decide who is standing where while DCoop is on stage at 15:32.
  it('names the third stage manager, ruled 2026-09-18, not left contested', () => {
    // Card 9829: "Steve Peer stage-manages; Maceo is on video." The sheet used
    // to say the name was contested between Steve Peer and "Maseo" - both the
    // spelling and the open-question framing were wrong once this landed.
    expect(sheet).toMatch(/Steve Peer, ruled 2026-09-18/);
    expect(sheet).not.toMatch(/contested|Maseo/);
    expect(sheet).toMatch(/Maceo is on video/);
  });

  it('keeps the between-sets mic open, and says whose it was', () => {
    expect(sheet).toMatch(/Hurricane/);
    expect(sheet).toMatch(/that name is open/);
  });

  it('flags AV cover during the set DCoop plays himself', () => {
    expect(sheet).toMatch(/AV cover during this set is an open role/);
  });
});
