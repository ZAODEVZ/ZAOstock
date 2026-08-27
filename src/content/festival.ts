// Single source of truth for the festival facts that appear in more than one
// place on the public site. Facts only - no JSX, no styling.
//
// Publication rules locked by Zaal 2026-08-10: Black Moon is publishable as the
// confirmed after-party; performer names and any date other than Oct 3 are NOT
// publishable. src/content/festival.test.ts enforces both.
//
// Window is 12-6. It was moved to 11-6 for part of 2026-08-27 to fit five
// confirmed acts into 45-minute slots, and Zaal reverted it the same evening:
// MUSIC STARTS AT NOON. That is a decision on our side, not a City condition,
// so the 11:00 question to Roddy Ehrlenbach (City of Ellsworth Parks/Rec) was
// withdrawn before it was sent. The fifth act's placement is an open decision
// in docs/plans/production-plan-2026-10-03.md section 2; it does not change
// this value. `date` at 12:00 matches the doors.

export type AfterParty = {
  name: string;
  note: string;
  /**
   * Whether Black Moon runs a stage AT THE SAME TIME as the parklet, i.e. a
   * genuine second simultaneous stage during the outdoor window.
   *
   * FALSE since 2026-08-23. The day is one venue at a time: outdoors until 6pm,
   * then everything moves indoors. Black Moon absolutely does host performances
   * - it hosts the whole evening from 6 - but not alongside the parklet, and
   * the public copy must not offer a choice of two rooms.
   */
  hostsSimultaneousStage: boolean;
};

export type Festival = {
  date: string;
  dateLabel: string;
  shortDate: string;
  venue: string;
  shortVenue: string;
  city: string;
  window: string;
  admission: string;
  rsvpUrl: string;
  afterParty: AfterParty;
};

export const FESTIVAL: Festival = {
  date: '2026-10-03T12:00:00-04:00',
  dateLabel: 'Saturday, October 3, 2026',
  shortDate: 'Oct 3, 2026',
  venue: 'Franklin Street Parklet',
  shortVenue: 'Franklin St Parklet',
  city: 'Ellsworth, Maine',
  window: '12 PM - 6 PM',
  admission: 'Free to attend',
  rsvpUrl: 'https://ticket.zaostock.com',
  afterParty: {
    name: 'Black Moon',
    note: 'next door',
    hostsSimultaneousStage: false,
  },
};
