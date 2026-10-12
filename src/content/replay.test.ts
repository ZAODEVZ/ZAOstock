import { describe, expect, it } from 'vitest';
import {
  REPLAY_PARTS, DEFAULT_REPLAY_PART, replayEmbedSrc, replayWatchHref, replayPartsPhrase,
  replayProvider, replayHostName, replayPartEmbedSrc, replayPartWatchHref, replayPartLabel, REPLAY_NOTE,
} from './replay';

describe('the recorded festival', () => {
  it('lists the parts in order, each with an id that fits its host and a length', () => {
    expect(REPLAY_PARTS.length).toBeGreaterThan(0);
    REPLAY_PARTS.forEach((p, i) => {
      expect(p.part).toBe(i + 1);
      expect(p.id).toMatch(replayProvider(p) === 'youtube' ? /^[A-Za-z0-9_-]{11}$/ : /^\d{9,12}$/);
      expect(p.length).toMatch(/^(\d+:)?\d{1,2}:\d{2}$/);
      expect(p.title.trim()).not.toBe('');
      expect(p.title).not.toMatch(/WAVEWARZ/i);
    });
    expect(new Set(REPLAY_PARTS.map((p) => p.id)).size).toBe(REPLAY_PARTS.length);
  });

  it('does not list the six zaofestivals broadcasts that Twitch deleted (measured 2026-10-12)', () => {
    const expired = ['2890837517', '2890841510', '2890850258', '2890857550', '2890969100', '2891031137'];
    expect(REPLAY_PARTS.filter((p) => expired.includes(p.id))).toEqual([]);
  });

  it('says how many parts in words that follow the list', () => {
    expect(replayPartsPhrase(1)).toBe('in one recording');
    expect(replayPartsPhrase(6)).toBe('in six parts');
    expect(replayPartsPhrase()).toBe(replayPartsPhrase(REPLAY_PARTS.length));
  });

  it('opens on a part that exists', () => {
    expect(REPLAY_PARTS.some((p) => p.part === DEFAULT_REPLAY_PART)).toBe(true);
  });

  it('builds a Twitch embed that names zaostock.com as parent, and never autoplays', () => {
    const src = replayEmbedSrc('2890857550');
    expect(src).toContain('video=2890857550');
    expect(src).toContain('parent=zaostock.com');
    expect(src).toContain('autoplay=false');
    expect(replayWatchHref('2890857550')).toBe('https://www.twitch.tv/videos/2890857550');
  });

  it('embeds a YouTube part from youtube-nocookie.com and links to the watch page', () => {
    const yt = { provider: 'youtube' as const, id: 'dQw4w9WgXcQ' };
    expect(replayPartEmbedSrc(yt)).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0');
    expect(replayPartEmbedSrc(yt)).not.toContain('autoplay=1');
    expect(replayPartWatchHref(yt)).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(replayHostName(yt)).toBe('YouTube');
  });

  it('treats a part with no provider as Twitch, exactly as before', () => {
    const tw: { id: string; provider?: 'twitch' | 'youtube' } = { id: '2890835848' };
    expect(replayProvider(tw)).toBe('twitch');
    expect(replayPartEmbedSrc(tw)).toBe(replayEmbedSrc('2890835848'));
    expect(replayPartWatchHref(tw)).toBe(replayWatchHref('2890835848'));
    expect(replayHostName(tw)).toBe('Twitch');
  });

  it('labels a part by its own label, or "Part N"', () => {
    expect(replayPartLabel({ part: 3 })).toBe('Part 3');
    expect(replayPartLabel({ part: 2, label: 'OPEN X' })).toBe('OPEN X');
    expect(REPLAY_NOTE.trim()).not.toBe('');
  });
});
