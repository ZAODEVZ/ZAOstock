import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { LINEUP_NAMES } from './site';

/**
 * THE RUN OF SHOW EXISTS IN THREE PLACES. THEY MUST AGREE.
 *
 *   1. src/content/program.ts      BLOCKS - the run of show (times are internal)
 *   2. ops-room/ops-room.src.html - what the CREW reads on the day
 *   3. the artists table          day_of_start_time - what the API publishes
 *
 * Nothing has ever held them together. They agree today - verified by hand on
 * 2026-09-08, all nine acts, all nine times - so this pins good behaviour rather
 * than fixing a break.
 *
 * WHY IT IS WORTH PINNING. The press kit drifted from the lineup in public
 * twice, for exactly this reason: a second copy of a fact with nothing holding
 * it to the first. This is the same shape with a worse blast radius, because
 * the disagreement would appear on the day, between the schedule the audience
 * has and the schedule the stage manager is running.
 *
 * The database is deliberately NOT checked here - a unit test must not depend on
 * production. `scripts/reveal-preflight.sh` covers the live side.
 */

const PROGRAM = path.join(process.cwd(), 'src/content/program.ts');
const OPS = path.join(process.cwd(), 'ops-room/ops-room.src.html');

/** `{ time: '12:05', label: 'The Crown Vics'` -> Map(name -> "12:05") */
function programTimes(): Map<string, string> {
  const src = readFileSync(PROGRAM, 'utf8');
  const out = new Map<string, string>();
  for (const m of src.matchAll(/time:\s*'(\d{1,2}:\d{2})',\s*label:\s*'([^']+)'/g)) {
    out.set(m[2], m[1]);
  }
  return out;
}

/** `t:725, ... n:"The Crown Vics"` -> Map(name -> "12:05") */
function opsRoomTimes(): Map<string, string> {
  const src = readFileSync(OPS, 'utf8');
  const out = new Map<string, string>();
  for (const m of src.matchAll(/t:\s*(\d+),\s*e:\s*\d+,\s*n:"([^"]+)"/g)) {
    const mins = Number(m[1]);
    out.set(m[2], `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`);
  }
  return out;
}

describe('run of show, across every copy of it', () => {
  it('names every act on the public program', () => {
    const prog = programTimes();
    const missing = LINEUP_NAMES.filter((n) => !prog.has(n));
    expect(missing, `not on /program: ${missing.join(', ')}`).toEqual([]);
  });

  it('names every act in the ops room the crew runs the day from', () => {
    const ops = opsRoomTimes();
    const missing = LINEUP_NAMES.filter((n) => !ops.has(n));
    expect(missing, `not in the ops room run of show: ${missing.join(', ')}`).toEqual([]);
  });

  it('gives every act the SAME time in both', () => {
    const prog = programTimes();
    const ops = opsRoomTimes();

    const drift = LINEUP_NAMES.filter((n) => prog.get(n) !== ops.get(n)).map(
      (n) => `  ${n}: /program says ${prog.get(n)}, the ops room says ${ops.get(n)}`,
    );

    expect(
      drift,
      drift.length
        ? `\nThe public schedule and the crew's schedule DISAGREE:\n${drift.join('\n')}\n\n` +
            `On the day this is the audience arriving for one time while the stage\n` +
            `manager runs another. Fix both, or neither.\n`
        : '',
    ).toEqual([]);
  });
});
