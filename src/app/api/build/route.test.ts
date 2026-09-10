import { describe, expect, it, afterEach, vi } from 'vitest';

afterEach(() => vi.unstubAllEnvs());

describe('GET /api/build - the commit this deployment was built from', () => {
  it('reports the build SHA Vercel set', async () => {
    vi.stubEnv('VERCEL_GIT_COMMIT_SHA', '006aab9e1f2d3c4b5a6978877665544332211000');
    vi.stubEnv('VERCEL_GIT_COMMIT_REF', 'main');
    const { GET } = await import('./route');
    const body = await GET().json();
    expect(body.sha).toBe('006aab9e1f2d3c4b5a6978877665544332211000');
    expect(body.ref).toBe('main');
  });

  // The red side: outside Vercel there is no SHA, and the route must say null
  // rather than invent one - a checker reads null as "could not tell".
  it('says null, never a guess, when no build SHA exists', async () => {
    vi.stubEnv('VERCEL_GIT_COMMIT_SHA', '');
    const { GET } = await import('./route');
    expect((await GET().json()).sha).toBeNull();
  });
});
