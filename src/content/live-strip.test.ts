import { describe, expect, it } from 'vitest';
import { nowNextState } from './live-strip';

// 3 October 2026 and 27 September 2026 are both EDT (DST ends the following
// month), so -04:00 is the correct offset for every boundary below. Each
// instant is written as a wall clock, not derived from minutes, so a reader
// can check them by eye.
const et = (time: string) => Date.parse(`2026-10-03T${time}:00-04:00`);
const etOn = (date: string, time: string) => Date.parse(`2026-${date}T${time}:00-04:00`);

describe('nowNextState', () => {
  it('is "before" until noon on the day itself, bare, and never names an act or a time', () => {
    const state = nowNextState(et('11:59'));
    expect(state.phase).toBe('before');
    expect(state).toMatchObject({ phase: 'before', message: "Doors at noon." });
  });

  it('says the date out loud when the visitor is not on 3 October (Dotfiles review of #331)', () => {
    // The date is public everywhere already (Zaal, 2026-08-10); only the
    // TIME stays banned. "Doors at noon." alone, days early, reads as today.
    const state = nowNextState(etOn('09-27', '20:00'));
    expect(state).toMatchObject({ phase: 'before', message: 'Doors at noon on Saturday 3 October.' });
  });

  it('names The Crown Vics on now and OPEN X up next once the first set starts', () => {
    expect(nowNextState(et('12:05'))).toEqual({ phase: 'live', onNow: 'The Crown Vics', onNext: 'OPEN X' });
  });

  it('is between sets during a changeover, with the next act still named', () => {
    expect(nowNextState(et('12:38'))).toEqual({ phase: 'live', onNow: null, onNext: 'OPEN X' });
  });

  it('points at Black Moon the minute the last set ends, not at the 18:00 street-clear', () => {
    const state = nowNextState(et('17:41'));
    expect(state.phase).toBe('after');
    expect(state).toMatchObject({ phase: 'after', message: expect.stringContaining('Black Moon') });
  });

  it('keeps pointing at Black Moon well after the after-party has started', () => {
    expect(nowNextState(et('18:01')).phase).toBe('after');
  });

  it('renders LyonsDen by its display name, not its identity name', () => {
    // LyonsDen plays 16:15-16:55; DISPLAY_NAMES maps it to "LyonsDen Rez Muzik"
    // (site.ts) without touching the identity name the slug/form/sitemap use.
    expect(nowNextState(et('16:20'))).toMatchObject({ onNow: 'LyonsDen Rez Muzik' });
  });

  it('never returns a string containing a clock time', () => {
    // Zaal, 2026-09-12: name the act, not the slot. A regression here would
    // leak a time onto the public page.
    for (const t of ['11:59', '12:05', '12:38', '13:00', '17:41', '18:01']) {
      const state = nowNextState(et(t));
      const text = JSON.stringify(state);
      expect(text).not.toMatch(/\d{1,2}:\d{2}/);
    }
  });
});
