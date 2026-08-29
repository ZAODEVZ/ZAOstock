// What each public submission surface does.
//
// History. On 2026-08-23 every form was switched off in one go: the Supabase
// project behind them was unreachable, so a submission returned "Could not
// submit right now" and the answers were thrown away. An artist referred by
// Heart of Ellsworth hit exactly that and only got through by emailing the
// whole thing by hand. A form that discards what you typed is worse than no
// form.
//
// Zaal, 2026-08-29, once the code-login dashboard was retired: the volunteer
// sign-up, the ideas box and the RSVP stay as forms; musician submissions and
// riders become an email link. The cypher form was the third music intake and
// is dropped entirely in the same pass - Zaal, same day: "drop, we need to go
// to MVP with this, get as many people there and see if sponsors will give us
// anything.
//
// Two separate questions, so they are two separate switches:
//   FORM_POLICY       - what this surface should be, by decision. Permanent.
//   DATABASE_AVAILABLE - whether the write path works at all. Temporary.
// A surface renders its form only when it is a 'form' AND the database is up.

export type FormSurface = 'volunteer' | 'ideas' | 'rsvp' | 'musician-submission' | 'rider';

export type FormPolicy = 'form' | 'email';

export const FORM_POLICY: Record<FormSurface, FormPolicy> = {
  volunteer: 'form',
  ideas: 'form',
  rsvp: 'form',
  'musician-submission': 'email',
  rider: 'email',
};

// FLIP THIS when Vercel Production points at the real Supabase project
// (yjrlaxpjusmrfylumban) and `curl https://zaostock.com/api/events` returns a
// list rather than 500. That is the whole change; the form components are
// untouched and still correct.
export const DATABASE_AVAILABLE = false;

/** True when this surface should render its real form right now. */
export function formIsLive(surface: FormSurface): boolean {
  return FORM_POLICY[surface] === 'form' && DATABASE_AVAILABLE;
}

/** True when this surface is an email link by decision, not because of an outage. */
export function emailByDesign(surface: FormSurface): boolean {
  return FORM_POLICY[surface] === 'email';
}
