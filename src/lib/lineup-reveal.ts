import { SITE } from '@/content/site';

/**
 * The festival is in Ellsworth, Maine, so the reveal date means a date THERE.
 *
 * This used to compare `now.toISOString().slice(0, 10)`, which is UTC. In
 * September Maine is UTC-4, so a '2026-09-07' gate flipped open at
 * 2026-09-07T00:00:00Z, which is 8 PM on 6 September in Ellsworth. The lineup
 * would have gone public the evening BEFORE the day it was announced for, and
 * nothing would have reported an error - the same silent-success shape as the
 * press-kit hold regex. Caught by Iman, 2026-08-31.
 *
 * en-CA formats as YYYY-MM-DD, which is what SITE.lineupRevealDate is, so the
 * two are string-comparable.
 */
const FESTIVAL_TZ = 'America/New_York';

const localDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: FESTIVAL_TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Has the lineup reveal date passed in Ellsworth? Pure, so it needs no Supabase client. */
export function lineupIsPublic(now: Date = new Date()): boolean {
  return localDate.format(now) >= SITE.lineupRevealDate;
}
