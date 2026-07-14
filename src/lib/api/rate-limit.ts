import { NextRequest, NextResponse } from 'next/server';

/**
 * Best-effort in-memory rate limiter (per warm serverless instance, not
 * durable/distributed). Raises the bar against naive spam/abuse of public
 * form endpoints - not a substitute for a real store (e.g. Upstash) if this
 * needs to hold up against a determined attacker. Mirrors the pattern
 * already used for the team login route.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string, windowMs: number, maxAttempts: number): boolean {
  const now = Date.now();
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
