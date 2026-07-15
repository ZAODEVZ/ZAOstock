import { randomBytes } from 'crypto';

// Best-effort in-memory store (per warm instance) - same tradeoff already
// accepted for rate limiting and the old team/login throttle in this
// codebase. A nonce only needs to survive the few seconds between issuing
// it and the wallet signing it, so a durable store isn't worth the extra
// infra for this.
const NONCE_TTL_MS = 5 * 60_000;
const issuedNonces = new Map<string, number>(); // nonce -> expiresAt

export function issueNonce(): string {
  const nonce = randomBytes(16).toString('hex');
  issuedNonces.set(nonce, Date.now() + NONCE_TTL_MS);
  return nonce;
}

// Single-use: a valid nonce is consumed (deleted) the moment it's checked,
// whether or not the surrounding signature also verifies - replaying the
// same nonce twice should never succeed even if the first attempt failed
// for an unrelated reason.
export function consumeNonce(nonce: string): boolean {
  const expiresAt = issuedNonces.get(nonce);
  issuedNonces.delete(nonce);
  if (!expiresAt) return false;
  return Date.now() < expiresAt;
}
