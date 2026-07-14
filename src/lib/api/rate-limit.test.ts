import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { rateLimitPublicForm } from './rate-limit';

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
    for (let i = 0; i < 5; i++) {
      rateLimitPublicForm(makeRequest(ip), 'bucket-a', { maxAttempts: 1 });
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
