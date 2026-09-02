import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * The public run of show, checked for the two ways it has actually gone wrong.
 *
 * On 2026-09-02 this page was found publishing the v7 grid of 28 August, four
 * days after the 31 August standup rebuilt the afternoon. Live, in production,
 * it told the public that the one act confirmed in writing played at 13:55 (it
 * is 14:25) and that forty minutes in the middle of the festival had "nothing
 * booked yet" (it is filled). Nothing failed, because a stale schedule is still
 * a valid schedule.
 *
 * A test cannot know which grid is current. It can refuse the shapes that are
 * wrong on their face, which is what these do.
 */

const PAGE = 'src/app/program/page.tsx';
const src = readFileSync(path.join(process.cwd(), PAGE), 'utf8');

const times = [...src.matchAll(/time: '(\d{2}):(\d{2})'/g)].map((m) => ({
  label: `${m[1]}:${m[2]}`,
  minutes: Number(m[1]) * 60 + Number(m[2]),
}));

describe('the published run of show', () => {
  it('has slots at all, so the checks below are not vacuous', () => {
    expect(times.length).toBeGreaterThan(10);
  });

  it('runs strictly forwards, with no slot at or before the one above it', () => {
    for (let i = 1; i < times.length; i++) {
      expect(
        times[i].minutes,
        `${times[i].label} does not come after ${times[i - 1].label}`,
      ).toBeGreaterThan(times[i - 1].minutes);
    }
  });

  it('starts at noon and hands over to the battle block by 16:00', () => {
    expect(times[0].label).toBe('12:00');
    const beforeBattle = times.filter((t) => t.minutes < 16 * 60);
    expect(beforeBattle.at(-1)?.minutes).toBeLessThan(16 * 60);
  });

  // The 31 August standup replaced five daytime sets and a 40-minute open
  // stretch with six sets that tile the block end to end. Reverting to five is
  // the exact regression this page already shipped once.
  it('carries the six daytime sets the 31 August schedule has, not the five of v7', () => {
    const setLabels = [...src.matchAll(/Set (\d)/g)].map((m) => Number(m[1]));
    expect(new Set(setLabels).size).toBe(6);
    expect(Math.max(...setLabels)).toBe(6);
  });

  it('does not advertise unbooked time on a schedule that is full', () => {
    // "Around forty minutes with nothing booked yet" was public for two days
    // after the gap had been filled. If an open slot is ever genuinely correct
    // again, delete this and say so in the commit.
    expect(src).not.toContain('nothing booked yet');
    expect(src).not.toMatch(/tone: 'open'/);
  });
});
