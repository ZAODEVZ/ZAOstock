import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

/**
 * THE REVEAL RUNBOOK'S OPERATIONAL DATE CANNOT DRIFT FROM THE GATE.
 *
 * This is the document somebody follows ON REVEAL DAY, under time pressure,
 * checking whether the festival's lineup went live correctly. On 2026-09-08 it
 * still said the gate opens "at 04:00Z on the 7th" and showed a sample payload
 * carrying `"reveal_date":"2026-09-07"` - a date that had already passed, and
 * whose passing was the incident the runbook exists to prevent.
 *
 * A runbook that is wrong about the date is worse than no runbook: it is
 * followed confidently.
 *
 * WHY NOT JUST BAN EVERY OTHER DATE, as the press-kit guard does?
 * Because this file SHOULD talk about 7 September - that is its history, and
 * the story of what went wrong is the most useful thing in it. So this pins the
 * one thing that must track the gate: the sample payload an operator compares
 * real output against.
 */

const RUNBOOK = path.join(process.cwd(), 'docs/events/REVEAL-RUNBOOK.md');

describe('reveal runbook', () => {
  // RETIRED 2026-09-10 with the reveal date itself. This test used to pin the
  // runbook's sample payload to SITE.lineupRevealDate; that key is gone. What
  // must hold now is that nobody can follow the runbook as live instructions.
  it('opens by saying it is retired and there is no reveal day', () => {
    const md = readFileSync(RUNBOOK, 'utf8');
    const head = md.split('\n').slice(0, 6).join('\n');
    expect(head).toMatch(/RETIRED/);
    expect(head).toMatch(/There is no reveal day/);
  });

  it('tells the operator to stop on an empty bill', () => {
    const md = readFileSync(RUNBOOK, 'utf8');

    // The single most important instruction in the file, and the one the
    // 7 September incident proves is needed. If a future edit softens it,
    // this fails.
    expect(
      md.includes('`[]` after the gate opens, stop'),
      'The runbook no longer tells the operator to STOP when the lineup is ' +
        'empty after the gate opens. That is exactly what happened on ' +
        '2026-09-07: the gate fired on time, the endpoint answered correctly, ' +
        'and the bill was empty. Everything worked and the result was wrong.',
    ).toBe(true);
  });
});
