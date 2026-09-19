import { SOCIALS } from './site';

/**
 * THE DAY-OF SIDE OF /live.
 *
 * Settled on the 15 September 2026 round two call with Zaal, and none of it is
 * on the page the call changed:
 *
 * - **Zaal runs the stream**, video and audio, with the venue AV team. This
 *   supersedes the ownership row in docs/av/livestream-chain-2026-10-03.md,
 *   which was written on 27 August and still names other owners.
 * - **zaostock.com/live is the main link.** Everywhere else carries it.
 * - **If the stream drops, the Telegram chat is the channel.** Anyone on the
 *   ground sees it, and if Zaal misses it someone tells him. A viewer looking
 *   at a dead player has no way to learn that from the page today, which is the
 *   single most useful thing this file adds.
 * - **Watch parties have no single format.** One channel carries clean event
 *   audio from a ZAO account; every other host takes that audio and does their
 *   own take on it. On the day Zaal posts and emails the full list of places to
 *   watch along with a community.
 *
 * What is NOT here, on purpose: any platform name. docs/av item 8 holds that no
 * platform is named publicly before a run passes, and no run has passed. The
 * page's WATCH_HREF is still null for the same reason.
 */

export type WatchParty = {
  /** Who is hosting, as they want to be named. */
  host: string;
  /** Where it is, in plain words. No platform is implied by this being filled. */
  where: string;
  href: string;
};

/**
 * EMPTY ON PURPOSE. Zaal posts the list on the day, so until he does there is
 * no list, and the page says that rather than showing an empty box. Anything
 * added here renders immediately, so nothing goes in that is not confirmed.
 */
export const WATCH_PARTIES: readonly WatchParty[] = [];

/**
 * The channel a viewer goes to when the player dies. Read from SOCIALS so there
 * is one Telegram URL in the codebase, not two that can drift. Returns null
 * rather than a guess if the row is ever removed, and the page then renders no
 * fallback card at all instead of a dead link.
 */
export function fallbackChannelHref(socials: typeof SOCIALS = SOCIALS): string | null {
  return socials.find((s) => s.platform === 'Telegram')?.href ?? null;
}
