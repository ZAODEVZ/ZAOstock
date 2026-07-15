import { describe, it, expect } from 'vitest';
import { sealData, unsealData } from 'iron-session';

// Exercises the actual iron-session primitives issueMobileToken() and the
// Authorization-header branch of getStockTeamMember() are built on, rather
// than importing session.ts directly - that file transitively imports
// lib/env.ts, which does `import 'server-only'`, a module that only
// resolves inside Next's own webpack build and has no real package under
// node_modules for a plain Node/vitest run. That's a pre-existing gap in
// this codebase's testability, not something to route around here.
const SECRET = 'test-secret-at-least-32-chars-long-xxxx';

describe('mobile bearer token (iron-session sealData/unsealData)', () => {
  it('round-trips a sealed payload back to the original member', async () => {
    const token = await sealData({ memberId: 'member-123', memberName: 'Zaal' }, { password: SECRET });
    const payload = await unsealData<{ memberId: string; memberName: string }>(token, { password: SECRET });

    expect(payload.memberId).toBe('member-123');
    expect(payload.memberName).toBe('Zaal');
  });

  it('does not yield a usable payload when unsealed with the wrong secret', async () => {
    // iron-session deliberately swallows a bad-HMAC/wrong-password failure
    // and resolves to {} rather than throwing - this is exactly why
    // getStockTeamMember()'s bearer path checks `!payload.memberId` after
    // unsealing instead of relying on a try/catch to reject a bad token.
    const token = await sealData({ memberId: 'member-123', memberName: 'Zaal' }, { password: SECRET });
    const payload = await unsealData<{ memberId?: string; memberName?: string }>(token, {
      password: 'a-completely-different-secret-32chars',
    });

    expect(payload.memberId).toBeUndefined();
  });
});
