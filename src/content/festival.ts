// Single source of truth for the festival facts that appear in more than one
// place on the public site. Facts only - no JSX, no styling.
//
// Publication rules locked by Zaal 2026-08-10: Black Moon is publishable as the
// confirmed after-party; performer names and any date other than Oct 3 are NOT
// publishable. src/content/festival.test.ts enforces both.

export type AfterParty = {
  name: string;
  note: string;
  /** Black Moon can also host performances during the main 12-6 window. */
  hostsPerformances: boolean;
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
    hostsPerformances: true,
  },
};
