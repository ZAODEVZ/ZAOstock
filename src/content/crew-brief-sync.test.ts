import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { OPS_ACTS } from './artist-ops';

/**
 * A FIFTH COPY OF THE RUN OF SHOW.
 *
 * `run-of-show-sync.test.ts` holds program BLOCKS, the ops room and the
 * artists table together; `stage-run-sheet-sync.test.ts` and
 * `stream-run-sheet-sync.test.ts` hold the other two crew documents to it.
 * `docs/plans/crew-brief-2026-10-03.md` is the fourth crew-facing clock copy
 * this repo has built - every one of the other three drifted from the real
 * day at least once before a test caught it, so this one starts with a test
 * rather than waiting for its own rewrite banner.
 */

const SHEET = 'docs/plans/crew-brief-2026-10-03.md';
const sheet = readFileSync(path.join(process.cwd(), SHEET), 'utf8');

/** `| 12:05 | 1. The Crown Vics (33) |` -> { time, name, minutes } */
function actRows(): { time: string; name: string; minutes: number }[] {
  const rows: { time: string; name: string; minutes: number }[] = [];
  for (const m of sheet.matchAll(/^\|\s*(\d{1,2}:\d{2})\s*\|\s*\d\.\s*([^(|]+)\((\d+)\)/gm)) {
    rows.push({ time: m[1], name: m[2].trim(), minutes: Number(m[3]) });
  }
  return rows;
}

describe('the crew brief follows the run of show', () => {
  it('runs every act, in order, at the time and length the grid says', () => {
    const rows = actRows();
    expect(rows).toHaveLength(OPS_ACTS.length);
    expect(rows.map((r) => r.time)).toEqual(OPS_ACTS.map((a) => a.setStart));
    expect(rows.map((r) => r.name)).toEqual(OPS_ACTS.map((a) => a.name));
    expect(rows.map((r) => r.minutes)).toEqual(OPS_ACTS.map((a) => a.minutes));
  });

  it('puts nobody on the clock who is off the programme', () => {
    for (const gone of [/hurricane/i, /wavewarz battle/i, /open stretch/i]) {
      expect(sheet, gone.source).not.toMatch(gone);
    }
  });

  it('says who is MC for the whole day, not the earlier split plan', () => {
    expect(sheet).toMatch(/MC, the whole day.*\*\*Zaal\*\*/);
    expect(sheet).not.toMatch(/Steve Peer covers.*front of the day/i);
  });

  it('marks the crew roster UNSET rather than inventing names', () => {
    expect(sheet).toMatch(/Crew \(names.*\|\s*\*\*UNSET\*\*/);
  });

  it('names the crew shirt (coyote brown, ruled 2026-09-27) and leaves count and sizes UNSET', () => {
    expect(sheet).toMatch(/Coyote brown ZAOstock hoodie/);
    expect(sheet).toMatch(/Count and sizes:\s*\*\*UNSET\*\*/);
    // The print itself spells it as two words - not a typo to fix here.
    expect(sheet).toMatch(/"LYONS DEN" as two words/);
  });

  it('names the Google Drive ruling and leaves the folder link UNSET', () => {
    expect(sheet).toMatch(/Google Drive only/);
    expect(sheet).toMatch(/Folder link:\s*\*\*UNSET\*\*/);
  });
});
