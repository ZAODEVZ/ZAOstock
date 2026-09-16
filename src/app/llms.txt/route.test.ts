import { describe, it, expect } from 'vitest';
import { FESTIVAL } from '@/content/festival';
import { LINEUP_NAMES } from '@/content/site';
import { GET } from './route';

// THE RED CONTROL FOR THE 2026-09-16 AUDIT FINDING. llms.txt said "Noon to
// 4 PM" and "about 30 minutes each" - stale since the window moved to 12-6
// and set lengths went to 33/40 minutes with seven-minute changeovers, not a
// uniform ~30. The route now interpolates FESTIVAL.window and
// LINEUP_NAMES.length instead of typing its own copy of either fact, so
// this file holds it to those two sources rather than re-typing the
// expected text - a future change to festival.ts or the roster moves this
// test's expectation along with it, the same way it moves the real content.
async function content(): Promise<string> {
  const res = await GET();
  return res.text();
}

describe('GET /llms.txt', () => {
  it('states the real festival window, not a stale one', async () => {
    const text = await content();
    expect(text).toContain(FESTIVAL.window);
    expect(text).not.toMatch(/noon to 4\s*pm/i);
  });

  it('never claims a uniform set length - sets are 33 or 40 minutes, not "about 30"', async () => {
    const text = await content();
    expect(text).not.toMatch(/about 30 minutes each/i);
  });

  it('names the real act count, sourced from LINEUP_NAMES', async () => {
    const text = await content();
    expect(text).toContain(`${LINEUP_NAMES.length} acts on the bill`);
    expect(text).toContain(`The ${LINEUP_NAMES.length} acts are named on the site`);
  });

  it('serves as plain text', async () => {
    const res = await GET();
    expect(res.headers.get('Content-Type')).toMatch(/text\/plain/);
  });
});
