import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { OPS_ACTS } from './artist-ops';

/**
 * THE STREAM RUN SHEET IS A FOURTH COPY OF THE RUN OF SHOW.
 *
 * `src/content/run-of-show-sync.test.ts` holds three of them together: program
 * BLOCKS, the ops room the crew reads, and the artists table. The stream run
 * sheet at docs/av/stream-run-sheet-2026-10-03.md was the fourth, and nothing
 * held it to anything.
 *
 * It drifted exactly as far as you would expect. On 2026-09-18 it still ran
 * FIVE acts with 30-minute sets, still handed 15:45 to Hurricane (out since
 * 09-10) and 16:00 to a WaveWarZ block (off the programme since 09-07), and
 * still named the pre-15-September owners. It is the sheet the person running
 * the stream follows on the day, so every one of those is a live cue pointed at
 * something that does not exist.
 *
 * OPS_ACTS is the comparison rather than BLOCKS because it already carries the
 * minutes, and it is itself held to BLOCKS by artist-ops.test.ts. One chain,
 * not two.
 */

const SHEET = 'docs/av/stream-run-sheet-2026-10-03.md';
const sheet = readFileSync(path.join(process.cwd(), SHEET), 'utf8');

/** `| 12:05 | 1. THE CROWN VICS, 33 | ...` -> { time, name, minutes } */
function cueRows(): { time: string; name: string; minutes: number }[] {
  const rows: { time: string; name: string; minutes: number }[] = [];
  for (const m of sheet.matchAll(/^\|\s*(\d{1,2}:\d{2})\s*\|\s*\d\.\s*([^,|]+),\s*(\d+)/gm)) {
    rows.push({ time: m[1], name: m[2].trim(), minutes: Number(m[3]) });
  }
  return rows;
}

describe('the stream run sheet follows the run of show', () => {
  it('cues every act, in order, at the time the grid says', () => {
    const rows = cueRows();
    expect(rows).toHaveLength(OPS_ACTS.length);
    expect(rows.map((r) => r.time)).toEqual(OPS_ACTS.map((a) => a.setStart));
    expect(rows.map((r) => r.name.toLowerCase())).toEqual(OPS_ACTS.map((a) => a.name.toLowerCase()));
  });

  it('gives each act the length the grid gives it', () => {
    expect(cueRows().map((r) => r.minutes)).toEqual(OPS_ACTS.map((a) => a.minutes));
  });

  // Two kinds of line legitimately name a dropped act: the rewrite banner, which
  // exists to say what was removed, and the one sentence that tells an operator
  // there is deliberately no WAVEWARZ scene. Everything else is a live cue.
  const cues = sheet
    .split('\n')
    .filter((l) => !l.trim().startsWith('>') && !/There is no WAVEWARZ scene/.test(l))
    .join('\n');

  it('cues nobody who is off the programme', () => {
    for (const gone of [/hurricane/i, /wavewarz/i, /stilo/i]) {
      expect(cues, gone.source).not.toMatch(gone);
    }
  });

  it('says out loud that the WaveWarZ scene is gone, so nobody re-adds it', () => {
    expect(sheet).toMatch(/There is no WAVEWARZ scene/);
  });
});

describe('the parts of the sheet that are not the grid', () => {
  it('sends a dropped stream to the Telegram chat, which is the decision of 15 September', () => {
    expect(sheet).toMatch(/If it drops/);
    expect(sheet).toMatch(/telegram\.thezao\.com/);
  });

  it('keeps the crew clock out of anything public, and says why it is here', () => {
    expect(sheet).toMatch(/crew document, not a/);
    expect(sheet).toMatch(/not copy rows out of it into anything public/);
  });

  it('ends the stream with the parklet rather than promising the evening', () => {
    expect(sheet).toMatch(/The stream ends with/);
  });
});
