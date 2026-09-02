import { describe, it, expect } from 'vitest';
import {
  ARTIST_STATUSES,
  ARTIST_STATUS_IS_PUBLISHABLE,
  PUBLISHABLE_ARTIST_STATUSES,
  SPONSOR_TRACKS,
  SPONSOR_STATUSES,
  VOLUNTEER_ROLES,
  VOLUNTEER_SHIFTS,
} from './team-constants';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// These MUST match the live Postgres CHECK constraints exactly (see the
// comment in team-constants.ts) - this test locks the values so a future
// edit here can't silently drift from what the database actually allows
// without a deliberate, visible change to this file.

describe('team-constants', () => {
  it('ARTIST_STATUSES matches the artists.status CHECK constraint', () => {
    expect(ARTIST_STATUSES).toEqual(['wishlist', 'contacted', 'interested', 'confirmed', 'declined', 'travel_booked']);
  });

  it('SPONSOR_TRACKS matches the sponsors.track CHECK constraint (includes partner)', () => {
    expect(SPONSOR_TRACKS).toEqual(['local', 'virtual', 'ecosystem', 'partner']);
  });

  it('SPONSOR_STATUSES matches the sponsors.status CHECK constraint', () => {
    expect(SPONSOR_STATUSES).toEqual(['lead', 'contacted', 'in_talks', 'committed', 'paid', 'declined']);
  });

  it('VOLUNTEER_ROLES matches the volunteers.role CHECK constraint', () => {
    expect(VOLUNTEER_ROLES).toEqual(['setup', 'checkin', 'water', 'safety', 'teardown', 'floater', 'content', 'unassigned']);
  });

  it('VOLUNTEER_SHIFTS matches the volunteers.shift CHECK constraint', () => {
    expect(VOLUNTEER_SHIFTS).toEqual(['early', 'block1', 'block2', 'teardown', 'allday']);
  });
});

// docs/decisions/0005-confirmed-means-confirmed-in-writing.md
//
// On 2026-09-02, five days before the reveal, exactly ONE act of the whole bill
// was confirmed in writing, while five more were locked into the running order
// with paperwork pending. `confirmed` is the only word this enum has, so loading
// those five would have published people who never signed, automatically, on a
// date nobody has to be awake for.
describe('only a written confirmation reaches the public', () => {
  it('classifies every artist status, with no status left to a default', () => {
    for (const s of ARTIST_STATUSES) {
      expect(ARTIST_STATUS_IS_PUBLISHABLE, `${s} is not classified`).toHaveProperty(s);
      expect(typeof ARTIST_STATUS_IS_PUBLISHABLE[s]).toBe('boolean');
    }
    expect(Object.keys(ARTIST_STATUS_IS_PUBLISHABLE).sort()).toEqual([...ARTIST_STATUSES].sort());
  });

  it('publishes confirmed and nothing else', () => {
    expect(PUBLISHABLE_ARTIST_STATUSES).toEqual(['confirmed']);
  });

  // The rule is worth nothing if the queries drift from it. Both public readers
  // of the artists table must filter on exactly the publishable set.
  it('matches what the two public queries actually filter on', () => {
    const readers = ['src/lib/artists.ts', 'src/app/api/events/[slug]/lineup/route.ts'];
    expect(PUBLISHABLE_ARTIST_STATUSES).toHaveLength(1);
    const only = PUBLISHABLE_ARTIST_STATUSES[0];
    for (const rel of readers) {
      const src = readFileSync(path.join(process.cwd(), rel), 'utf8');
      expect(src, `${rel} does not filter on '${only}'`).toContain(`.eq('status', '${only}')`);
    }
  });
});
