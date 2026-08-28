import { describe, it, expect } from 'vitest';
import { FESTIVAL } from './festival';

// These values are what the PUBLIC site says. They are locked here so a future
// edit cannot silently change a published fact - or publish something Zaal
// ruled out on 2026-08-10 - without a deliberate, visible change to this file.

describe('FESTIVAL facts', () => {
  it('publishes the confirmed date, venue and window', () => {
    expect(FESTIVAL.date).toBe('2026-10-03T12:00:00-04:00');
    expect(FESTIVAL.dateLabel).toBe('Saturday, October 3, 2026');
    expect(FESTIVAL.shortDate).toBe('Oct 3, 2026');
    expect(FESTIVAL.venue).toBe('Franklin Street Parklet');
    expect(FESTIVAL.shortVenue).toBe('Franklin St Parklet');
    expect(FESTIVAL.city).toBe('Ellsworth, Maine');
    expect(FESTIVAL.window).toBe('12 PM - 6 PM');
  });

  it('publishes free admission and the RSVP destination', () => {
    expect(FESTIVAL.admission).toBe('Free to attend');
    expect(FESTIVAL.rsvpUrl).toBe('https://ticket.zaostock.com');
  });

  it('publishes Black Moon as the confirmed after-party, and NOT as a second simultaneous stage', () => {
    expect(FESTIVAL.afterParty.name).toBe('Black Moon');
    expect(FESTIVAL.afterParty.note).toBe('next door');
    // One venue at a time, corrected 2026-08-23. If this ever flips back to
    // true, the homepage starts telling people they can choose between two
    // rooms during the afternoon, which is the exact claim we removed.
    expect(FESTIVAL.afterParty.hostsSimultaneousStage).toBe(false);
  });

  it('names no performer anywhere in the published facts', () => {
    const blob = JSON.stringify(FESTIVAL).toLowerCase();
    for (const name of ['sen', 'phelan', 'dcoop', 'david cooper']) {
      expect(blob).not.toContain(name);
    }
  });

  it('sets no date other than October 3', () => {
    const blob = JSON.stringify(FESTIVAL).toLowerCase();
    for (const token of ['friday', 'sunday', 'night-before', 'night before', 'multi-day']) {
      expect(blob).not.toContain(token);
    }
  });
});
