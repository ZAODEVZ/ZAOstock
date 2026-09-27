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
 * THE PLATFORM, CONFIRMED 2026-09-25. Zaal, after Fellenz's software-chain
 * test passed: "fellenz streaming test went well he has zaofestivals twitch
 * stream key can we add that to the embed for /live i will daischain of that
 * to my streaming platforms and tell everyone to go to zaostock.com/live."
 * docs/av item 8's "no platform named before a run passes" gate is what held
 * TWITCH_CHANNEL back until now - the run passed, so it is named.
 *
 * THE STREAM KEY IS NOT HERE, AND MUST NEVER BE. Only the channel NAME is
 * public; the embed needs nothing else. The key lives in Zaal's broadcaster
 * software alone (Dotfiles, 2026-09-25: "if any part of your implementation
 * seems to want the key, stop and say so, because it means the approach is
 * wrong").
 *
 * Verified independently before trusting the channel name: twitch.tv returns
 * HTTP 200 for a channel that does not exist - a control check against
 * zzz-not-a-real-channel-zzz also returned 200, so a bare status check proves
 * nothing. The real signal is the page's `og:title` meta tag: "zaofestivals -
 * Twitch" for the confirmed channel, empty for the control. Re-run that check
 * before trusting this constant if the channel is ever in doubt again.
 */
export const TWITCH_CHANNEL = 'zaofestivals';

/** The externally-linkable watch page - Twitch's own UI, chat included. */
export function watchHref(channel: string = TWITCH_CHANNEL): string {
  return `https://twitch.tv/${channel}`;
}

/**
 * The embeddable player URL. Twitch refuses to load in an iframe unless
 * `parent` matches the embedding page's hostname exactly (no scheme, no
 * path) - zaostock.com for production, localhost so this can be previewed
 * with `npm run dev` before it ships. Muted so the browser's autoplay policy
 * does not silently block the whole player; a viewer unmutes with one click.
 */
export function embedSrc(channel: string = TWITCH_CHANNEL): string {
  return `https://player.twitch.tv/?channel=${channel}&parent=zaostock.com&parent=localhost&muted=true`;
}

/**
 * Twitch's chat embed - same parent-domain rule as the player. Lets a remote
 * viewer talk to the room instead of only watching it, which is the one
 * feature the page did not have for the ~1,000-online half of the day. A
 * viewer needs a Twitch account to post; reading needs nothing.
 */
export function chatEmbedSrc(channel: string = TWITCH_CHANNEL): string {
  return `https://www.twitch.tv/embed/${channel}/chat?parent=zaostock.com&parent=localhost`;
}

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
