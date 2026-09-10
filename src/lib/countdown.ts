import { FESTIVAL } from '@/content/festival';

// THE COUNTDOWN TO 3 OCTOBER. The idea is from Candy's design system
// (ui_kits/festival-website/Countdown.jsx); the code is the site's own.
//
// Hers clamps at zero, so the day after the festival it would read 00 00 00
// 00 for ever. This one has three phases and says something true in each:
// counting down to the doors, "on now" while the music runs, and nothing at
// all once the street has cleared. It never counts up.
//
// Pure: takes `now` as a number so the tests can stand at any moment.

/** Doors, and the moment the count reaches zero. */
export const DOORS_MS = Date.parse(FESTIVAL.date);
/** The outdoor day ends when the street clears at six (FESTIVAL.window). */
export const STREET_CLEARS_MS = DOORS_MS + 6 * 60 * 60 * 1000;

export type CountdownState =
  | { phase: 'before'; days: number; hours: number; minutes: number }
  | { phase: 'live' }
  | { phase: 'after' };

export function countdownState(now: number, doors = DOORS_MS, clears = STREET_CLEARS_MS): CountdownState {
  if (now >= clears) return { phase: 'after' };
  if (now >= doors) return { phase: 'live' };
  // Round the remainder UP to the minute, so the count never shows 0 minutes
  // while there is still time to go, and reaches zero exactly at the doors.
  const totalMinutes = Math.ceil((doors - now) / 60_000);
  return {
    phase: 'before',
    days: Math.floor(totalMinutes / (24 * 60)),
    hours: Math.floor((totalMinutes % (24 * 60)) / 60),
    minutes: totalMinutes % 60,
  };
}
