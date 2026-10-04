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
  // Zaal, 2026-09-29: the Telegram link comes off the website. With no
  // Telegram row in SOCIALS the fallback is null and /live shows no card.
  it('is off the site since Telegram left the socials list', () => {
    expect(fallbackChannelHref()).toBeNull();
    expect(SOCIALS.some((s) => /telegram/i.test(s.href))).toBe(false);
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
  // After 3 October the page plays the recording (ReplayPlayer), not the live
  // channel; embedSrc() stays exported and tested for the next live day.
  it('is zaofestivals, and the page plays the recording from that channel', () => {
    expect(TWITCH_CHANNEL).toBe('zaofestivals');
    expect(read(LIVE)).toContain('<ReplayPlayer />');
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

  it('the replay iframe has a real title, taken from the part being played', () => {
    expect(read('src/components/ReplayPlayer.tsx')).toContain('title={current.title}');
  });

  it('the chat embed carries the channel and a parent matching production', () => {
    const src = chatEmbedSrc();
    expect(src).toContain('/zaofestivals/chat');
    expect(src).toContain('parent=zaostock.com');
  });
});

describe('watch parties', () => {
  // Was "starts empty". Zaal, 2 Oct: ship only the confirmed hosts.
  it('lists only named hosts, each with a place, and only real links', () => {
    for (const p of WATCH_PARTIES) {
      expect(p.host.trim()).not.toBe('');
      expect(p.where.trim()).not.toBe('');
      if (p.href !== undefined) expect(p.href).toMatch(/^https:\/\//);
    }
    expect(new Set(WATCH_PARTIES.map((p) => p.host)).size).toBe(WATCH_PARTIES.length);
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
