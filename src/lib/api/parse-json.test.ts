import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { parseJsonBody } from './parse-json';

function makeRequest(body: string | undefined): NextRequest {
  return new NextRequest('http://localhost/api/test', {
    method: 'POST',
    body,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
  });
}

describe('parseJsonBody', () => {
  it('returns the parsed data for valid JSON', async () => {
    const result = await parseJsonBody(makeRequest(JSON.stringify({ name: 'Test Artist' })));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({ name: 'Test Artist' });
    }
  });

  it('returns a 400 response for malformed JSON instead of throwing', async () => {
    // This is the exact bug the fix addresses: request.json() throws on
    // invalid JSON, and 25 routes previously called it unguarded.
    const result = await parseJsonBody(makeRequest('{not valid json'));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.response.status).toBe(400);
      const body = await result.response.json();
      expect(body.error).toBe('Invalid JSON body');
    }
  });

  it('returns a 400 response for an empty body instead of throwing', async () => {
    const result = await parseJsonBody(makeRequest(''));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.response.status).toBe(400);
    }
  });
});
