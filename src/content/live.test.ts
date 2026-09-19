import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { SOCIALS } from '@/content/site';
import { WATCH_PARTIES, fallbackChannelHref } from '@/content/live';

// /live is the one link everywhere else carries (Zaal, 15 September), so on
// 3 October it is where the online audience lands, and the online audience is
// the bigger half of the day. These tests hold the three things a viewer needs
// from it that no stream test gates: where to go when the player dies, what a
// watch party is, and the rule that no platform is named before a run passes.

const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');
const LIVE = 'src/app/live/page.tsx';

describe('the fallback channel', () => {
  it('is the Telegram chat, read from the one socials source', () => {
    const href = fallbackChannelHref();
    expect(href).toBe('https://telegram.thezao.com');
    expect(SOCIALS.some((s) => s.href === href)).toBe(true);
  });

  it('is rendered on the page, next to the player and not buried', () => {
    const src = read(LIVE);
    expect(src).toContain('fallbackChannelHref');
    expect(src).toContain('If the picture stops on the day,');
    // The fallback sits in the same Card as the player, above "How to follow along".
    expect(src.indexOf('If the picture stops on the day,')).toBeLessThan(src.indexOf('How to follow along'));
  });

  it('renders nothing rather than a dead link if the Telegram row ever goes', () => {
    expect(fallbackChannelHref([] as unknown as typeof SOCIALS)).toBeNull();
    expect(read(LIVE)).toContain('{fallbackHref ? (');
  });

  it('hardcodes no Telegram URL of its own', () => {
    expect(read(LIVE)).not.toContain('telegram.thezao.com');
  });
});

describe('no platform is named before a run passes', () => {
  // docs/av/livestream-chain-2026-10-03.md, item 8, and Zaal on 15 September:
  // "no platform named publicly before a run passes". The destinations are all
  // candidates and none has been streamed to.
  it('names no streaming destination anywhere on the page', () => {
    const src = read(LIVE).toLowerCase();
    for (const platform of ['youtube', 'twitch', 'restream', 'x.com', 'cloudflare', 'kick', 'rumble', 'zoom']) {
      expect(src, platform).not.toContain(platform);
    }
  });

  it('keeps the watch link a single null constant, still gated on the test', () => {
    const src = read(LIVE);
    expect(src).toContain('const WATCH_HREF: string | null = null;');
    expect(src).toContain('{WATCH_HREF ? (');
  });
});

describe('watch parties', () => {
  it('starts empty, because Zaal posts the list on the day', () => {
    expect(WATCH_PARTIES).toEqual([]);
  });

  it('says the list is coming rather than showing an empty box', () => {
    expect(read(LIVE)).toContain('The full list of places to watch goes out on the day itself.');
  });

  it('describes the format Zaal actually settled on, not a moderated single room', () => {
    const src = read(LIVE);
    expect(src).toContain('One channel carries clean event audio');
    expect(src).toContain('Host one yourself');
  });
});

describe('the evening', () => {
  // The after-party is at Black Moon from six (ruled 14 September, ZAOstock
  // #195). Nobody has said the stream follows it indoors, and the indoor mirror
  // is "to build" in the AV doc, so the page may not imply it does.
  it('tells a remote viewer the stream ends with the parklet', () => {
    const src = read(LIVE);
    expect(src).toContain('The stream runs with the parklet.');
    expect(src).toContain('in person only');
    expect(src).toContain('Black Moon Public House');
  });
});
