import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { SITE } from '@/content/site';

// The 23 August failure was not that the database was down. It was that a
// failed insert returned 500 and the submission vanished: the person saw an
// error, we never learned they tried, and the only reason one artist got
// through is that they had a personal email address for Zaal.
//
// So a public submission that cannot be stored is written to the server log
// with its payload, and the person is told to email rather than shown a bare
// error. The log is recoverable: nothing a person typed is lost because our
// database was unreachable.
//
// The payload contains what the person entered, including their name and email
// where the form asks for it, so it lands in the Vercel runtime log and nowhere
// else. That is a deliberate trade against silently discarding it.
export function submissionUnstored(scope: string, payload: unknown, cause: unknown) {
  logger.error(
    { scope, payload, cause },
    'public submission could not be stored - payload logged here so it is recoverable by hand',
  );
  return NextResponse.json(
    {
      error: `We could not save that just now. Email ${SITE.contact} and we will enter it by hand - nothing you typed is lost.`,
      contact: SITE.contact,
    },
    { status: 503 },
  );
}
