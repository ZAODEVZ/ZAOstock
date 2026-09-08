import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { SITE } from './site';

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
  it('shows a sample payload carrying the real reveal date', () => {
    const md = readFileSync(RUNBOOK, 'utf8');

    // The line an operator diffs their curl output against.
    const samples = [...md.matchAll(/"reveal_date":"(\d{4}-\d{2}-\d{2})"/g)].map((m) => m[1]);

    expect(
      samples.length,
      'The runbook no longer shows a sample lineup payload. That sample is what ' +
        'an operator compares real output against on the day - keep it.',
    ).toBeGreaterThan(0);

    for (const found of samples) {
      expect(
        found,
        `The runbook's sample payload says reveal_date ${found}, but the gate is ` +
          `${SITE.lineupRevealDate}. Someone following this on the day would ` +
          `compare their curl output against the wrong date.`,
      ).toBe(SITE.lineupRevealDate);
    }
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
