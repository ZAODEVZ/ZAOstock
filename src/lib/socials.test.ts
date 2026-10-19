import { describe, expect, it } from 'vitest';
import { parseSocials } from './socials';

describe('parseSocials', () => {
  it('handles DCoop: a handle, a dropped separator, a real URL', () => {
    const tokens = parseSocials('@dcoopofficial - https://dot.cards/dcoope2');
    expect(tokens).toEqual([
      { text: '@dcoopofficial', href: null },
      { text: 'https://dot.cards/dcoope2', href: 'https://dot.cards/dcoope2' },
    ]);
  });

  it('links two bare domains', () => {
    const tokens = parseSocials('facebook.com/ExampleBand instagram.com/example.band');
    expect(tokens).toEqual([
      { text: 'facebook.com/ExampleBand', href: 'https://facebook.com/ExampleBand' },
      { text: 'instagram.com/example.band', href: 'https://instagram.com/example.band' },
    ]);
  });

  it('links a bare domain with no path', () => {
    expect(parseSocials('fellenz.net')).toEqual([
      { text: 'fellenz.net', href: 'https://fellenz.net' },
    ]);
  });

  it('never produces "https://-" or "https://@..."', () => {
    const cases = ['@handle', '-', '|', '/', ',', '- @handle -'];
    for (const raw of cases) {
      for (const t of parseSocials(raw)) {
        expect(t.href).not.toBe('https://-');
        expect(t.href ?? '').not.toMatch(/^https:\/\/@/);
      }
    }
  });
});
