import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { rateLimitPublicForm, trackedWindowCount } from './rate-limit';

function makeRequest(ip: string): NextRequest {
  return new NextRequest('http://localhost/api/test', {
    headers: { 'x-forwarded-for': ip },
  });
}

describe('rateLimitPublicForm', () => {
  it('allows requests under the limit', () => {
    const ip = `test-allow-${Math.random()}`;
    const result = rateLimitPublicForm(makeRequest(ip), 'unit-test-bucket', { maxAttempts: 3 });
    expect(result).toBeNull();
  });

  it('blocks requests once the per-bucket limit is exceeded', () => {
    const ip = `test-block-${Math.random()}`;
    const bucket = 'unit-test-bucket-block';
    for (let i = 0; i < 3; i++) {
      expect(rateLimitPublicForm(makeRequest(ip), bucket, { maxAttempts: 3 })).toBeNull();
    }
    const blocked = rateLimitPublicForm(makeRequest(ip), bucket, { maxAttempts: 3 });
    expect(blocked).not.toBeNull();
    expect(blocked?.status).toBe(429);
  });

  it('scopes limits per-bucket, so one endpoint cannot exhaust another endpoint\'s allowance', () => {
    const ip = `test-scope-${Math.random()}`;
    // The premise of this test is that bucket-a ends up exhausted. It used to
    // discard these return values, so it would still have passed against a
    // limiter that never blocked anything at all.
    expect(rateLimitPublicForm(makeRequest(ip), 'bucket-a', { maxAttempts: 1 })).toBeNull();
    for (let i = 0; i < 4; i++) {
      expect(rateLimitPublicForm(makeRequest(ip), 'bucket-a', { maxAttempts: 1 })).not.toBeNull();
    }
    // bucket-a is now exhausted for this IP, but bucket-b should be untouched
    const result = rateLimitPublicForm(makeRequest(ip), 'bucket-b', { maxAttempts: 1 });
    expect(result).toBeNull();
  });

  it('scopes limits per-IP, so one IP cannot exhaust another IP\'s allowance', () => {
    const bucket = `unit-test-per-ip-${Math.random()}`;
    const ipA = 'ip-a';
    const ipB = 'ip-b';
    rateLimitPublicForm(makeRequest(ipA), bucket, { maxAttempts: 1 });
    const blockedA = rateLimitPublicForm(makeRequest(ipA), bucket, { maxAttempts: 1 });
    expect(blockedA).not.toBeNull();
    const allowedB = rateLimitPublicForm(makeRequest(ipB), bucket, { maxAttempts: 1 });
    expect(allowedB).toBeNull();
  });
});

// The limiter keys on `bucket:ip`, and the IP comes off a request header on
// eleven public routes. Nothing ever deleted an entry, so every distinct IP that
// ever hit a public form was retained for the life of the warm instance: a slow
// leak in the anti-abuse code, grown by exactly the traffic it defends against.
describe('the window map does not grow forever', () => {
  it('drops windows that have expired instead of holding every IP it has ever seen', () => {
    vi.useFakeTimers();
    try {
      const bucket = `sweep-${Math.random()}`;
      const before = trackedWindowCount();

      for (let i = 0; i < 200; i++) {
        rateLimitPublicForm(makeRequest(`sweep-ip-${i}`), bucket, { windowMs: 1_000, maxAttempts: 5 });
      }
      expect(trackedWindowCount()).toBeGreaterThanOrEqual(before + 200);

      // every one of those windows is now long over
      vi.advanceTimersByTime(120_000);
      rateLimitPublicForm(makeRequest('sweep-trigger'), bucket, { windowMs: 1_000, maxAttempts: 5 });

      expect(trackedWindowCount()).toBeLessThan(before + 200);
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not drop a window that is still open', () => {
    vi.useFakeTimers();
    try {
      const bucket = `sweep-live-${Math.random()}`;
      const ip = 'still-counting';
      expect(rateLimitPublicForm(makeRequest(ip), bucket, { windowMs: 10 * 60_000, maxAttempts: 2 })).toBeNull();

      // past the sweep interval, but well inside this window
      vi.advanceTimersByTime(90_000);
      expect(rateLimitPublicForm(makeRequest(ip), bucket, { windowMs: 10 * 60_000, maxAttempts: 2 })).toBeNull();
      // third attempt is over the limit, which only holds if the count survived
      expect(rateLimitPublicForm(makeRequest(ip), bucket, { windowMs: 10 * 60_000, maxAttempts: 2 })).not.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});
