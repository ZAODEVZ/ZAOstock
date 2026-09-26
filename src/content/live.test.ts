import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { SOCIALS } from '@/content/site';
import { WATCH_PARTIES, fallbackChannelHref, TWITCH_CHANNEL, watchHref, embedSrc, chatEmbedSrc } from '@/content/live';

// /live is the one link everywhere else carries (Zaal, 15 September), so on
// 3 October it is where the online audience lands, and the online audience is
// the bigger half of the day. These tests hold the things a viewer needs from
// it: the confirmed watch destination, where to go when the player dies, what
// a watch party is, and that the evening is in person.

const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');
const LIVE = 'src/app/live/page.tsx';
const LIVE_CONTENT = 'src/content/live.ts';

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

/**
 * THE CONFIRMED WATCH DESTINATION.
 *
 * Zaal, 2026-09-25, after Fellenz's software-chain test passed: Twitch,
 * channel zaofestivals - the platform docs/av item 8 held back until a run
 * passed. Verified independently before this constant was trusted: twitch.tv
 * returns HTTP 200 for a channel that does not exist, so a status check alone
 * proves nothing; the real signal was the page's og:title meta tag.
 *
 * This is the test Dotfiles asked for by name: it must fail if the channel
 * goes back to null, or if the string changes without this file changing
 * with it - this is the one page thousands of people may hit at once on
 * 3 October, and it should never be silently pointed at the wrong channel or
 * quietly regress to no player at all.
 */
describe('the confirmed Twitch channel', () => {
  it('is zaofestivals, and the page embeds it', () => {
    expect(TWITCH_CHANNEL).toBe('zaofestivals');
    expect(read(LIVE)).toContain('embedSrc()');
  });

  it('the embed URL carries the channel and a parent matching production', () => {
    const src = embedSrc();
    expect(src).toContain('channel=zaofestivals');
    expect(src).toContain('parent=zaostock.com');
  });

  it('the external watch link points straight at twitch.tv/zaofestivals', () => {
    expect(watchHref()).toBe('https://twitch.tv/zaofestivals');
  });

  it('never carries a stream key - only the channel name is public', () => {
    // The hard rule from Dotfiles: if any part of the implementation seems to
    // want the key, the approach is wrong. This pins the invariant at the
    // CODE level - comments are stripped first, since this file's own
    // explanatory comments legitimately use the phrase "stream key" to
    // describe the rule, and that prose is not the thing being guarded
    // against.
    const stripComments = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    for (const file of [LIVE_CONTENT, LIVE]) {
      const code = stripComments(read(file));
      expect(code, file).not.toMatch(/stream.?key/i);
      expect(code, file).not.toMatch(/process\.env\.[A-Z_]*TWITCH/);
      expect(code, file).not.toMatch(/oauth/i);
    }
  });

  it('the iframe has a real title, for the one page thousands may hit at once', () => {
    expect(read(LIVE)).toContain('title="ZAOstock live on Twitch"');
  });

  it('the chat embed carries the channel and a parent matching production', () => {
    const src = chatEmbedSrc();
    expect(src).toContain('/zaofestivals/chat');
    expect(src).toContain('parent=zaostock.com');
    expect(read(LIVE)).toContain('chatEmbedSrc()');
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

describe('before the stream starts and after it ends', () => {
  // Twitch's own player shows its offline screen outside the broadcast
  // window, so the "dead player" failure mode Dotfiles flagged is Twitch's
  // problem to solve and it already does - but the page says so itself too,
  // rather than relying only on a viewer recognising Twitch's own UI.
  it('tells a viewer that offline outside the show window is expected, not broken', () => {
    const src = read(LIVE);
    expect(src).toContain('Nothing playing?');
    expect(src).toMatch(/stream is offline/);
  });

  it('tells a remote viewer the stream ends with the parklet', () => {
    const src = read(LIVE);
    expect(src).toContain('The stream runs with the parklet.');
    expect(src).toContain('in person only');
    expect(src).toContain('Black Moon Public House');
  });
});
