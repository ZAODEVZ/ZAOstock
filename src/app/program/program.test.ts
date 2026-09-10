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

  it('starts at noon and the OUTDOOR block ends 17:55, when the street clears at six', () => {
    expect(times[0].label).toBe('12:00');
    // times[] spans the whole page, evening block included, so scope this to the
    // outdoor half rather than to the last slot on the page.
    const outdoor = times.filter((t) => t.minutes < 18 * 60);
    expect(outdoor.at(-1)?.label).toBe('17:55');
  });

  // Was "six sets, not the five of v7" while the sets were unnamed placeholders.
  // Zaal published the real names with their real times on 2026-09-07, so the
  // shape to pin is now the run of show locked 3 September: NINE acts, in order.
  // EIGHT since 2026-09-10: Hurricane is out, no replacement, nobody moved.
  // Reverting to a shorter or reordered bill is the same regression in a new form.
  it('carries all EIGHT acts of the locked run of show, in order', () => {
    const ACTS = [
      'The Crown Vics', 'OPEN X', 'Grass Rug', 'Acadia Rising', 'Michael Anderson',
      'DCoop', 'Lyons Den', 'Fellenz',
    ];
    const positions = ACTS.map((a) => ({ act: a, at: src.indexOf(`label: '${a}'`) }));
    for (const { act, at } of positions) {
      expect(at, `${act} is missing from the published run of show`).toBeGreaterThan(-1);
    }
    for (let i = 1; i < positions.length; i++) {
      expect(
        positions[i].at,
        `${positions[i].act} is published before ${positions[i - 1].act}`,
      ).toBeGreaterThan(positions[i - 1].at);
    }
  });

  // Naming the acts is NOT saying they signed. Nobody has countersigned, and the
  // reveal API still publishes only status='confirmed'. This page must never put
  // the word against an act.
  it('never calls a published act confirmed', () => {
    const lines = src.split('\n').filter((l) => !l.trim().startsWith('//'));
    const offending = lines.filter((l) => /label: '/.test(l) && /confirmed/i.test(l));
    expect(offending).toEqual([]);
  });

  it('does not advertise unbooked time on a schedule that is full', () => {
    // "Around forty minutes with nothing booked yet" was public for two days
    // after the gap had been filled. If an open slot is ever genuinely correct
    // again, delete this and say so in the commit.
    expect(src).not.toContain('nothing booked yet');
    expect(src).not.toMatch(/tone: 'open'/);
  });
});
