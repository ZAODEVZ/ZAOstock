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

/**
 * Which artist statuses may reach a PUBLIC surface.
 *
 * `confirmed` means confirmed IN WRITING. It does not mean "internally
 * confirmed", "locked into the running order", or "we shook on it". The
 * organizers draw that distinction and the database did not, which is the whole
 * of docs/decisions/0005-confirmed-means-confirmed-in-writing.md: on
 * 2026-09-02, five days before the reveal, exactly one act of the whole bill had
 * signed, while five more were locked into the running order. Loading those five
 * as `confirmed` would have published people who never agreed to be published,
 * automatically, on a date nobody has to be awake for.
 *
 * An act that is locked but unsigned does not go in the table yet. The signature
 * is the event that creates the row, not the running order being settled.
 *
 * Typed as a total Record on purpose: adding a value to ARTIST_STATUSES without
 * classifying it here is a COMPILE ERROR rather than a silent default. The
 * obvious future fix for all of this is a softer status like
 * `internally_confirmed`, and the obvious way to get it wrong is to add it and
 * let it inherit whatever the publish path happens to do.
 *
 * `travel_booked` is false because both public readers filter on `confirmed`
 * exactly, so marking travel booked silently unpublishes an act. That is
 * probably wrong and is deliberately NOT changed here; see the decision.
 */
export const ARTIST_STATUS_IS_PUBLISHABLE: Record<ArtistStatus, boolean> = {
  wishlist: false,
  contacted: false,
  interested: false,
  confirmed: true,
  declined: false,
  travel_booked: false,
};

/** The statuses a public surface is allowed to render. */
export const PUBLISHABLE_ARTIST_STATUSES = ARTIST_STATUSES.filter(
  (s) => ARTIST_STATUS_IS_PUBLISHABLE[s],
);

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
