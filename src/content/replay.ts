// THE FESTIVAL, RECORDED. Zaal, 2026-10-04 00:0x (seat pane): "lets emebed this
// video everyhwer i just renamed all of them on twitch for zaofestivals".
//
// The 3 October stream reconnected five times, so Twitch stored the day as six
// past broadcasts on twitch.tv/zaofestivals. Ids, titles and lengths read from
// twitch.tv/zaofestivals/videos?filter=archives on 2026-10-04 (seat in Chrome,
// and this lane in a headless browser). The clock windows are derived from the
// measured stream starts (about 12:01, 12:05, 12:25, 14:28 and 15:32) and the
// 18:07 end, so they are approximate and say so.
//
// TWITCH EXPIRES PAST BROADCASTS, AND THESE DID. Measured 2026-10-12 against
// Twitch's own API: all six zaofestivals ids above (2890837517, 2890841510,
// 2890850258, 2890857550, 2890969100, 2891031137) return "video does not
// exist", so /live and /media were showing six dead players. The one public
// recording left is twitch.tv/videos/2890835848 on bettercallzaal, "ZAOstock
// Music Festival Live", 26148 s: the whole day in one piece, captured from the
// /live page itself, so the stage sits inside the page. It will expire too.
// The permanent fix is the per-act sets on YouTube (iman-desk #64); when those
// exist, swap this list for them. replay.test.ts keeps the shape honest.

export type ReplayProvider = 'twitch' | 'youtube';

export type ReplayPart = {
  part: number;
  /** Where the video lives. Twitch when left out. */
  provider?: ReplayProvider;
  /** Button text. An act's name when each part is one set; "Part N" when left out. */
  label?: string;
  /** Twitch video id (digits only), or the 11-character YouTube video id. */
  id: string;
  title: string;
  /** Running length as the host shows it. */
  length: string;
  /** Roughly when in the day, Eastern. Approximate by construction. */
  window: string;
};

// THE 7 FULL SETS ON YOUTUBE (iman-desk #164). Files and order from Iman's
// docs/media/festival-full-sets.md (#497). DRAFT: every id below is a TODO
// until Iman posts the YouTube links on #164, and the lengths are the Drive
// cuts before the intro and outro go on. Re-read each length from YouTube when
// the id lands. Windows stay clock-free (no-public-set-times.test.ts).
export const REPLAY_PARTS: readonly ReplayPart[] = [
  { part: 1, provider: 'youtube', label: 'The Crown Vics', id: 'TODO-CROWNV', title: 'The Crown Vics, live at ZAOstock 2026 (full set)', length: '45:22', window: 'First set of the day' },
  { part: 2, provider: 'youtube', label: 'OPEN X', id: 'TODO-OPEN-X', title: 'OPEN X, live at ZAOstock 2026 (full set)', length: '45:30', window: 'Second set' },
  { part: 3, provider: 'youtube', label: 'Grass Rug', id: 'TODO-GRASSR', title: 'Grass Rug, live at ZAOstock 2026 (full set)', length: '37:50', window: 'Third set' },
  { part: 4, provider: 'youtube', label: 'Michael Anderson', id: 'TODO-MANDER', title: 'Michael Anderson, live at ZAOstock 2026 (full set)', length: '36:30', window: 'Fourth set' },
  { part: 5, provider: 'youtube', label: 'DCoop', id: 'TODO-DCOOP0', title: 'DCoop, live at ZAOstock 2026 (full set)', length: '55:23', window: 'Fifth set' },
  { part: 6, provider: 'youtube', label: 'LyonsDen', id: 'TODO-LYONSD', title: 'LyonsDen, live at ZAOstock 2026 (full set)', length: '42:30', window: 'Sixth set' },
  { part: 7, provider: 'youtube', label: 'Tom Fellenz', id: 'TODO-TOMFEL', title: 'Tom Fellenz, live at ZAOstock 2026 (full set)', length: '40:00', window: 'Last set, into the close' },
];

/** The line under the player. Says what this list is, so it changes with the list. */
export const REPLAY_NOTE = 'Each act\u2019s full set, one video per act.';

/** "Part 3", or the part's own label when it has one. */
export function replayPartLabel(p: Pick<ReplayPart, 'part' | 'label'>): string {
  return p.label ?? `Part ${p.part}`;
}

/** The part that opens first. */
export const DEFAULT_REPLAY_PART = 1;

const COUNT_WORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

/** "in one recording" or "in six parts": page copy follows the list, so it cannot go stale. */
export function replayPartsPhrase(count: number = REPLAY_PARTS.length): string {
  if (count === 1) return 'in one recording';
  return `in ${COUNT_WORDS[count] ?? String(count)} parts`;
}

export function replayEmbedSrc(id: string): string {
  return `https://player.twitch.tv/?video=${id}&parent=zaostock.com&parent=localhost&autoplay=false`;
}

export function replayWatchHref(id: string): string {
  return `https://www.twitch.tv/videos/${id}`;
}

// YOUTUBE PARTS. Twitch deletes past broadcasts; YouTube does not. A part with
// provider 'youtube' embeds from youtube-nocookie.com, which is already on the
// frame-src list in next.config.ts, and never autoplays (the default there).

export function replayProvider(p: Pick<ReplayPart, 'provider'>): ReplayProvider {
  return p.provider ?? 'twitch';
}

/** "Twitch" or "YouTube", for button and link labels. */
export function replayHostName(p: Pick<ReplayPart, 'provider'>): string {
  return replayProvider(p) === 'youtube' ? 'YouTube' : 'Twitch';
}

/** The iframe src for a part, whichever host it is on. */
export function replayPartEmbedSrc(p: Pick<ReplayPart, 'provider' | 'id'>): string {
  if (replayProvider(p) === 'youtube') return `https://www.youtube-nocookie.com/embed/${p.id}?rel=0`;
  return replayEmbedSrc(p.id);
}

/** The link that opens a part on its host. */
export function replayPartWatchHref(p: Pick<ReplayPart, 'provider' | 'id'>): string {
  if (replayProvider(p) === 'youtube') return `https://www.youtube.com/watch?v=${p.id}`;
  return replayWatchHref(p.id);
}
