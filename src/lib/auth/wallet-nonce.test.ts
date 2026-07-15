import { describe, it, expect } from 'vitest';
import { issueNonce, consumeNonce } from './wallet-nonce';

describe('wallet-nonce', () => {
  it('a freshly issued nonce is valid exactly once', () => {
    const nonce = issueNonce();
    expect(consumeNonce(nonce)).toBe(true);
    expect(consumeNonce(nonce)).toBe(false);
  });

  it('rejects a nonce that was never issued', () => {
    expect(consumeNonce('never-issued-nonce-value')).toBe(false);
  });

  it('issues distinct nonces each call', () => {
    const a = issueNonce();
    const b = issueNonce();
    expect(a).not.toBe(b);
  });
});
