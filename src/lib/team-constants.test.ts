import { describe, it, expect } from 'vitest';
import { ARTIST_STATUSES, SPONSOR_TRACKS, SPONSOR_STATUSES, VOLUNTEER_ROLES, VOLUNTEER_SHIFTS } from './team-constants';

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
