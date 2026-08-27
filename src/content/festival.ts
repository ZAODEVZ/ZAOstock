// Single source of truth for the festival facts that appear in more than one
// place on the public site. Facts only - no JSX, no styling.
//
// Publication rules locked by Zaal 2026-08-10: Black Moon is publishable as the
// confirmed after-party; performer names and any date other than Oct 3 are NOT
// publishable. src/content/festival.test.ts enforces both.
//
// Window moved 12-6 -> 11-6 on 2026-08-27, then BACK to 12-6 the same day when
// Zaal locked "music starts at NOON". The 11:00 open is withdrawn, and so is the
// question about whether the permit caps an early start. Do not reintroduce 11:00.
//
// The tradeoff it was solving is real and unresolved: noon to four on a
// 45-minute/15-minute grid is four slots, and five acts are confirmed. That is
// the production lane's to settle, not this file's.

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
