// The one switch for the public submission forms.
//
// Set to false on 2026-08-23. The Supabase project behind these forms is
// unavailable, so every submission returned "Could not submit right now" and
// the person's answers were thrown away. An artist referred by Heart of
// Ellsworth hit it and only got through by emailing the whole submission by
// hand; the ones who did not have a personal email address for us got nothing,
// and we have no record they ever tried.
//
// A form that discards what you typed is worse than no form. So the forms come
// off and src/components/FormsUnavailable.tsx takes their place with a mailto
// that works.
//
// TO PUT THEM BACK: set this to true. That is the whole change. The form
// components are untouched and still correct - the database underneath them
// was the problem.
//
// Before flipping it back, fix the thing that made this bad rather than merely
// broken: /api/musicians/submit and its siblings return 500 on a failed insert
// and DROP the submission. Catch that and persist it somewhere, so the next
// outage costs a delay instead of an artist.
export const PUBLIC_FORMS_ENABLED = false;
