// Single source of truth for the enum values that were previously duplicated
// as literal string-union arrays across API route schemas and ~8 UI
// components each (artist status, sponsor status/track, volunteer role/shift).
// These MUST match the corresponding Postgres CHECK constraints exactly - if
// a value is added here without a matching migration (or vice versa), inserts
// will fail at the database, not at validation.

export const ARTIST_STATUSES = [
  'wishlist',
  'contacted',
  'interested',
  'confirmed',
  'declined',
  'travel_booked',
] as const;
export type ArtistStatus = (typeof ARTIST_STATUSES)[number];

export const SPONSOR_TRACKS = ['local', 'virtual', 'ecosystem', 'partner'] as const;
export type SponsorTrack = (typeof SPONSOR_TRACKS)[number];

export const SPONSOR_STATUSES = ['lead', 'contacted', 'in_talks', 'committed', 'paid', 'declined'] as const;
export type SponsorStatus = (typeof SPONSOR_STATUSES)[number];

export const VOLUNTEER_ROLES = [
  'setup',
  'checkin',
  'water',
  'safety',
  'teardown',
  'floater',
  'content',
  'unassigned',
] as const;
export type VolunteerRole = (typeof VOLUNTEER_ROLES)[number];

export const VOLUNTEER_SHIFTS = ['early', 'block1', 'block2', 'teardown', 'allday'] as const;
export type VolunteerShift = (typeof VOLUNTEER_SHIFTS)[number];
