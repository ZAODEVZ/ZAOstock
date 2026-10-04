import { describe, expect, it } from 'vitest';
import { REPLAY_PARTS, DEFAULT_REPLAY_PART, replayEmbedSrc, replayWatchHref } from './replay';

describe('the recorded festival', () => {
  it('lists the parts in order, each with a numeric Twitch id and a length', () => {
    expect(REPLAY_PARTS.length).toBeGreaterThan(0);
    REPLAY_PARTS.forEach((p, i) => {
      expect(p.part).toBe(i + 1);
      expect(p.id).toMatch(/^\d{9,12}$/);
      expect(p.length).toMatch(/^(\d+:)?\d{1,2}:\d{2}$/);
      expect(p.title.trim()).not.toBe('');
      expect(p.title).not.toMatch(/WAVEWARZ/i);
    });
    expect(new Set(REPLAY_PARTS.map((p) => p.id)).size).toBe(REPLAY_PARTS.length);
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
});
