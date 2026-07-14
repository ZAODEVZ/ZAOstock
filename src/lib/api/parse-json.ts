import { NextRequest, NextResponse } from 'next/server';

/**
 * Parses a request's JSON body, returning a typed error response instead of
 * throwing when the body is missing or malformed. `request.json()` throws on
 * invalid JSON, and several routes called it outside a try/catch - letting a
 * malformed request produce an unhandled exception instead of a clean 400.
 */
export async function parseJsonBody<T = unknown>(
  request: NextRequest,
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  try {
    const data = (await request.json()) as T;
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }),
    };
  }
}
