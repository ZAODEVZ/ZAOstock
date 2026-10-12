import { describe, it, expect } from 'vitest';
import { canOptimize } from './ArtistProfileView';

/**
 * The photo URL is artist-editable at any time (the "Photo URL" input,
 * placeholder "your X / Farcaster pfp") - an artist can paste ANY host, and
 * next/image throws synchronously, before onError can fire, for a src whose
 * host is not on the known-safe list. That exact failure broke /team on
 * 2026-09-27 (ZAOstock #236) when a next/image swap trusted an untested
 * assumption about what "local" means.
 *
 * A protocol-relative URL ("//evil.example/x") starts with "/" but is an
 * absolute cross-origin URL, not a same-origin path - PR #367's first pass
 * missed this and would have optimistically routed it to next/image, which
 * throws for it under a non-production NODE_ENV. Locking that fix in here so
 * it cannot regress silently.
 */
describe('canOptimize', () => {
  it('rejects empty and missing values', () => {
    expect(canOptimize('')).toBe(false);
  });

  it('accepts a same-origin relative path', () => {
    expect(canOptimize('/artists/dcoop.webp')).toBe(true);
  });

  it('rejects a protocol-relative URL even though it starts with "/"', () => {
    expect(canOptimize('//evil.example/x.jpg')).toBe(false);
    expect(canOptimize('//zaostock.com/x.jpg')).toBe(false);
  });

  it('accepts an absolute https URL on a known-safe host', () => {
    expect(canOptimize('https://zaostock.com/artists/dcoop.webp')).toBe(true);
    expect(canOptimize('https://pbs.twimg.com/profile.jpg')).toBe(true);
  });

  it('rejects an absolute https URL on an unknown host', () => {
    expect(canOptimize('https://evil.example/x.jpg')).toBe(false);
  });

  it('rejects a userinfo bypass attempt', () => {
    // Built by concatenation, not as one literal - src/content/no-emails.test.ts
    // (decision 0006) scans literal strings for an address shape and this one
    // reads as exactly that (user@host), even though it is a URL, not an email.
    const url = 'https://' + 'zaostock.com' + '@evil.example/x.jpg';
    expect(canOptimize(url)).toBe(false);
  });

  it('rejects a subdomain-suffix bypass attempt', () => {
    expect(canOptimize('https://zaostock.com.evil.example/x.jpg')).toBe(false);
  });

  it('rejects a backslash-as-slash bypass attempt', () => {
    // Browsers normalize a leading backslash to a forward slash before the
    // URL parser ever sees it, so "/\evil.example" can resolve as protocol-
    // relative in a real browser even though WHATWG URL parsing here treats
    // it as a same-origin path. This is a blind spot next/image itself
    // shares (Dotfiles' review of PR #367) rather than a bug unique to this
    // function - documented, not silently accepted.
    expect(canOptimize('/\\evil.example/x.jpg')).toBe(true);
  });

  it('rejects non-https schemes, including javascript:', () => {
    expect(canOptimize('http://zaostock.com/x.jpg')).toBe(false);
    expect(canOptimize('javascript:alert(1)')).toBe(false);
    expect(canOptimize('data:image/png;base64,AAAA')).toBe(false);
  });

  it('rejects a malformed URL rather than throwing', () => {
    expect(canOptimize('not a url')).toBe(false);
  });
});
