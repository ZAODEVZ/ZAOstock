import { NextRequest, NextResponse } from 'next/server';

/**
 * Best-effort in-memory rate limiter (per warm serverless instance, not
 * durable/distributed). Raises the bar against naive spam/abuse of public
 * form endpoints - not a substitute for a real store (e.g. Upstash) if this
 * needs to hold up against a determined attacker. Mirrors the pattern
 * already used for the team login route.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Nothing used to remove an entry from `buckets`.
 *
 * The key is `bucket:ip`, and the IP is read off a request header on eleven
 * public routes, two of them logins - so the key space is whatever the internet
 * decides to send. An entry was only ever overwritten, and only if that exact
 * key came back after its window had passed. Every other distinct IP that ever
 * touched a public form stayed in memory for the life of the warm instance,
 * counted and never collected.
 *
 * That is a slow leak in the code whose job is to raise the bar against abuse of
 * those endpoints, and the input that grows it is the input it is defending
 * against. An expired record has no meaning - the window is over and the next
 * request starts a fresh one - so expired records are dropped rather than kept.
 *
 * Swept on write, at most once a minute, so a burst pays for one pass over the
 * map rather than one per request.
 */
const SWEEP_INTERVAL_MS = 60_000;
let lastSweep = Date.now();

function sweepExpired(now: number): void {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, rec] of buckets) {
    if (now > rec.resetAt) buckets.delete(key);
  }
}

/** How many windows are being tracked right now. Exists so the sweep is testable. */
export function trackedWindowCount(): number {
  return buckets.size;
}

function isRateLimited(key: string, windowMs: number, maxAttempts: number): boolean {
  const now = Date.now();
  sweepExpired(now);
  const rec = buckets.get(key);
  if (!rec || now > rec.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  rec.count += 1;
  return rec.count > maxAttempts;
}

function requestIp(request: NextRequest): string {
  return (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
}

/**
 * Returns a 429 response if this request's IP has exceeded the limit for the
 * given bucket, otherwise null. `bucket` scopes the limit per-route so one
 * endpoint's traffic doesn't consume another's allowance.
 */
export function rateLimitPublicForm(
  request: NextRequest,
  bucket: string,
  { windowMs = 10 * 60_000, maxAttempts = 5 }: { windowMs?: number; maxAttempts?: number } = {},
): NextResponse | null {
  const key = `${bucket}:${requestIp(request)}`;
  if (isRateLimited(key, windowMs, maxAttempts)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please wait a few minutes and try again.' },
      { status: 429 },
    );
  }
  return null;
}
