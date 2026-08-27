// Single source of truth for the festival facts that appear in more than one
// place on the public site. Facts only - no JSX, no styling.
//
// Publication rules locked by Zaal 2026-08-10: Black Moon is publishable as the
// confirmed after-party; performer names and any date other than Oct 3 are NOT
// publishable. src/content/festival.test.ts enforces both.
//
// Window moved 12-6 -> 11-6 on 2026-08-27. Five confirmed acts do not fit four
// 45-minute slots, so the parklet opens an hour earlier. This is our intent and
// it is NOT yet cleared with the City - if the parklet permit caps how early
// amplified sound starts, this is the value that moves back. Roddy Ehrlenbach
// (City of Ellsworth Parks/Rec, the parklet contact) is the person who answers
// it, and as of 2026-08-27 the question has not been sent (city lane owns it).
// See docs/plans/production-plan-2026-10-03.md section 9.

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
  window: '11 AM - 6 PM',
  admission: 'Free to attend',
  rsvpUrl: 'https://ticket.zaostock.com',
  afterParty: {
    name: 'Black Moon',
    note: 'next door',
    hostsSimultaneousStage: false,
  },
};
