import { DOORS_MS } from '@/lib/countdown';
import { BLOCKS, type Slot } from './program';
import { displayName } from './site';

// THE "ON NOW / UP NEXT" STRIP FOR /live.
//
// Zaal, 2026-09-12: no set times published anywhere, ever - "name the act, not
// the slot." This module never returns a clock value, only act names and fixed
// copy. See src/content/program.ts for the rule in full and BLOCKS for the one
// internal source of the day's shape.
//
// Time source: like src/lib/countdown.ts, comparisons are plain UTC epoch-ms
// against DOORS_MS (which bakes in the -04:00 EDT offset for 3 October, see
// src/content/festival.ts). That is what "reads the clock in America/New_York"
// means in practice - epoch-ms comparison is timezone-agnostic by
// construction, so there is no viewer-local-timezone bug to have.
//
// MUSIC_ENDS_MS is computed from the last DAY_SLOTS entry, not 18:00 (the
// street-clears time countdown.ts uses): Zaal ruled the strip should point at
// Black Moon as soon as the last act (Tom Fellenz) finishes, not wait for the
// extra margin of strike time. It moves with program.ts, so no time is typed
// here to go stale the next time the schedule does.
//
// DAY_START_MS marks the start of 3 October itself (Dotfiles review of #331):
// the bare "Doors at noon." reads as today only on the day - a visitor on
// 27 September or any other date before that needs the date said out loud, or
// the line lies by omission. The DATE is fine to publish (Zaal, 2026-08-10:
// only performer names and any date OTHER than Oct 3 are unpublishable); it is
// only the TIME that stays banned.

const DAY_SLOTS = BLOCKS[0].slots;

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** A slot's absolute instant, anchored to DOORS_MS (12:00) rather than parsed fresh. */
function slotMs(slot: Slot): number {
  return DOORS_MS + (toMinutes(slot.time) - 12 * 60) * 60_000;
}

const MUSIC_ENDS_MS = slotMs(DAY_SLOTS[DAY_SLOTS.length - 1]); // the "Music ends" gap slot
const DAY_START_MS = DOORS_MS - 12 * 60 * 60 * 1000; // 3 October, 00:00 ET

export type NowNextState =
  | { phase: 'before'; message: string }
  | { phase: 'live'; onNow: string | null; onNext: string | null }
  | { phase: 'after'; message: string };

const BEFORE_MESSAGE_TODAY = 'Doors at noon.';
const BEFORE_MESSAGE_DATED = 'Doors at noon on Saturday 3 October.';
const AFTER_MESSAGE = "That's a wrap outside. Next door at Black Moon: doors from six, after-party music from seven.";

export function nowNextState(now: number): NowNextState {
  if (now < DOORS_MS) {
    return { phase: 'before', message: now < DAY_START_MS ? BEFORE_MESSAGE_DATED : BEFORE_MESSAGE_TODAY };
  }
  if (now >= MUSIC_ENDS_MS) return { phase: 'after', message: AFTER_MESSAGE };

  let current: Slot | null = null;
  for (const slot of DAY_SLOTS) {
    if (slotMs(slot) <= now) current = slot;
    else break;
  }
  const onNow = current && current.tone === 'set' ? displayName(current.label) : null;

  const nextSet = DAY_SLOTS.find((slot) => slot.tone === 'set' && slotMs(slot) > now);
  const onNext = nextSet ? displayName(nextSet.label) : null;

  return { phase: 'live', onNow, onNext };
}
