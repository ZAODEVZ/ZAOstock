/**
 * Response redaction for fields that are credentials rather than data.
 *
 * `claim_token` is the artist's own credential: it is the whole of the auth
 * check in `verifyClaimToken()` (`src/lib/artists.ts`), and holding one is
 * enough to edit that artist's public profile via `PATCH /api/artist-profile`
 * and to mint a signed upload URL via `POST /api/musicians/rider/upload-url`.
 * No `/api/team/*` surface needs it.
 *
 * `GET /api/team/artists` already stripped it inline. `POST` returned the
 * freshly inserted row from `select('*')` untouched, so the two paths on the
 * same route disagreed about whether the field was safe to serve. This exists
 * so they cannot drift apart again: both call the same function, and the test
 * pins the behaviour.
 */
export function withoutClaimToken<T extends Record<string, unknown>>(row: T): Omit<T, 'claim_token'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- rest-destructure is the omit; the binding is the discard
  const { claim_token: _claimToken, ...rest } = row;
  return rest;
}

/** Array form of {@link withoutClaimToken}, for list responses. */
export function withoutClaimTokens<T extends Record<string, unknown>>(rows: readonly T[]): Omit<T, 'claim_token'>[] {
  return rows.map(withoutClaimToken);
}
