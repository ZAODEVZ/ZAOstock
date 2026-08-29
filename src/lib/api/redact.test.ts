import { describe, it, expect } from 'vitest';
import { withoutClaimToken, withoutClaimTokens } from './redact';

describe('withoutClaimToken', () => {
  it('removes claim_token and keeps everything else', () => {
    const row = { id: 'a1', name: 'Lyons Den', status: 'confirmed', claim_token: 'deadbeefdeadbeef' };
    const out = withoutClaimToken(row);
    expect(out).not.toHaveProperty('claim_token');
    expect(out).toEqual({ id: 'a1', name: 'Lyons Den', status: 'confirmed' });
  });

  it('is a no-op on a row that never had one', () => {
    const row = { id: 'a2', name: 'The Crown Vics' };
    expect(withoutClaimToken(row)).toEqual(row);
  });

  it('does not mutate the row it was given', () => {
    const row = { id: 'a3', claim_token: 'deadbeefdeadbeef' };
    withoutClaimToken(row);
    expect(row.claim_token).toBe('deadbeefdeadbeef');
  });

  it('strips every row in a list', () => {
    const rows = [
      { id: 'a1', claim_token: 'one' },
      { id: 'a2', claim_token: 'two' },
      { id: 'a3' },
    ];
    const out = withoutClaimTokens(rows);
    expect(out.every((r) => !('claim_token' in r))).toBe(true);
    expect(out.map((r) => r.id)).toEqual(['a1', 'a2', 'a3']);
  });

  it('leaves a nested relation object alone', () => {
    // The team routes select a joined `outreach` object alongside the row;
    // only the top-level credential is the concern here.
    const row = { id: 'a4', claim_token: 'x', outreach: { id: 'm1', name: 'Dcoop' } };
    expect(withoutClaimToken(row)).toEqual({ id: 'a4', outreach: { id: 'm1', name: 'Dcoop' } });
  });
});
