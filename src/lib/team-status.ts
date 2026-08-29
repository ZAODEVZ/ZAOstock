// The /team dashboard (4-letter code login, kanban, CRM, budget, roster,
// circles, mobile tokens) is RETIRED as of 2026-08-29. Zaal: "we aren't
// really running the team like that any more ... remove this form of
// passwords and just move this stuff all into the document." The working
// document is the tool; the site is the public face.
//
// While this is true:
// - every /api/team/* route answers 401 (getStockTeamMember returns null)
// - the six login, token and wallet routes answer 410
// - the inactivity cron does nothing
// - /team, /team/plan, /team/onepager and /team/help show a pointer to the doc
// - /team/m/<slug> is a 404
// The database is untouched: every table keeps its rows. Export what matters
// (sponsors, budget, artists, volunteers, RSVPs, notes) from the Supabase
// dashboard before any table is dropped. Stage two, once Zaal confirms the
// export, deletes the components and routes; this flag is stage one.
export const TEAM_DASHBOARD_RETIRED = true;

/** The ZAOstock working document. Filled from Drive on 2026-08-29; UNSET means ask Zaal. */
export const TEAM_DOC_URL = 'UNSET';

export const TEAM_RETIRED_MESSAGE = 'The team dashboard is retired. The ZAOstock working document is the tool now.';
