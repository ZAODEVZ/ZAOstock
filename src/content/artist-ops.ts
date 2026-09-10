import { createHash } from 'crypto';

// THE ARTIST OPS PAGE - one private page per act at /backstage/<code>.
// Zaal, 2026-09-10 (zao-vault decisions/zaostock-2026-09-10-lineup-and-ops-page.md):
// "Don't have it need a code to fill in form just to see more background on
// the event."
//
// So there are two things here with OPPOSITE access rules, and the second one
// is the one that has already cost a morning:
//
//   1. The background page is behind a code. A wrong code is a 404.
//   2. THE FORM IS NEVER BEHIND ANYTHING. It is a public Google Form, embedded
//      on the page and linked in full beside the embed, and it is also reachable
//      at /backstage with no code at all. On 2026-09-09 a real artist proved it
//      opens with no login, and three Workspace settings had to be turned off to
//      get there. Nothing in this file may put a gate back on it.
//
// THE CODES ARE NOT IN THIS REPO. The repo is public, so a plaintext code here
// would be a gate anyone could read. Only the SHA-256 of each code is stored;
// the codes themselves live in the private vault, in
// projects/zaostock-artist-ops-links-2026-09-10.md, which is what Zaal sends
// from. To reissue one, generate a new code, put its hash here and its link
// there.
//
// What the page shows is deliberately narrow: the act's OWN set, the shape of
// the day, the Friday soundcheck, what to bring. It never lists the other acts,
// so it announces no lineup change and nothing on it needs the reveal to have
// happened first.

/** The live artist details form. Public `/d/e/` URL, not an editor link. */
export const ARTIST_FORM = {
  viewUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSf7ex3EiiT1AkzyN8GKQ4jSfPWjBTo89l4ez27xvZCpc0OqtQ/viewform',
  /** The "Which act are you?" dropdown, read from the live form 2026-09-10:
   *  options are the bare names, Hurricane removed. */
  actEntry: 'entry.1967705479',
  /** The deadline the form itself asks for (scripts/create-artist-form.gs DEADLINE). */
  dueLabel: 'Friday 11 September',
} as const;

export type OpsAct = {
  /** Stable, human-readable; the first half of the code. */
  key: string;
  /** Exactly as LINEUP_NAMES spells it. */
  name: string;
  /** 24h, exactly as /program prints it. A test holds the two together. */
  setStart: string;
  minutes: number;
  /** SHA-256 hex of the code. The code itself is in the private vault. */
  codeSha256: string;
};

/**
 * Eight acts, in running order. Hurricane is out (Zaal, 2026-09-10) and has no
 * page; no act moved, so every time below is the one the form and the memos
 * already give.
 */
export const OPS_ACTS: readonly OpsAct[] = [
  { key: 'crown-vics', name: 'The Crown Vics', setStart: '12:05', minutes: 30,
    codeSha256: 'e3ff431d71cf5f7c147a6f6d267a4f26dedea7fc82f137d079173ea84f2ff4ca' },
  { key: 'open-x', name: 'OPEN X', setStart: '12:40', minutes: 40,
    codeSha256: '9d4dc8269872799d466ce773635b98c63ebf21ae76755ea3e03a6f2495e4373e' },
  { key: 'grass-rug', name: 'Grass Rug', setStart: '13:25', minutes: 30,
    codeSha256: '23bb7d8cec6d8080324bb8172f8cd2c4dda1d96d0c194193b62253459ecaade8' },
  { key: 'acadia-rising', name: 'Acadia Rising', setStart: '14:00', minutes: 30,
    codeSha256: 'e9ff956154b23901cee71a313712cff962bd772da981f7b63fa2273a6184086b' },
  { key: 'michael-anderson', name: 'Michael Anderson', setStart: '14:35', minutes: 30,
    codeSha256: 'b89fdb296171f0a04ebd1dcefa85b13b46dc74e32fe00f3e89397ac06d86b652' },
  { key: 'dcoop', name: 'DCoop', setStart: '15:45', minutes: 40,
    codeSha256: '58cdef916cbce928d46a263d3ffb64639285168051b57b91fc75ebd5f0ad9709' },
  { key: 'lyons-den', name: 'Lyons Den', setStart: '16:30', minutes: 40,
    codeSha256: 'c4e9b93e5e6d06ad10e2e7780d60ff016ef4027dde270c4297e62753755752ae' },
  { key: 'fellenz', name: 'Fellenz', setStart: '17:15', minutes: 40,
    codeSha256: '21323ff07117cc8842f6984ca063c7072d008e2150696561cf2eca1d486b51ed' },
];

/** Codes are `<key>-<six chars>`; anything else is refused before hashing. */
const CODE_SHAPE = /^[a-z0-9-]{3,64}$/;

/**
 * The act a code belongs to, or null. Case-insensitive, because people retype
 * links from phones. Takes the table as an argument so the test can use codes
 * of its own without any real code ever entering the repo.
 */
export function findActByCode(raw: string, acts: readonly OpsAct[] = OPS_ACTS): OpsAct | null {
  let code: string;
  try {
    code = decodeURIComponent(raw).trim().toLowerCase();
  } catch {
    return null;
  }
  if (!CODE_SHAPE.test(code)) return null;
  const hash = createHash('sha256').update(code).digest('hex');
  return acts.find((a) => a.codeSha256 === hash) ?? null;
}

/**
 * The form URL. `embedded` is Google's framing mode; the prefill only selects
 * the act in the dropdown and changes nothing about who may open the form.
 */
export function artistFormUrl(opts: { act?: OpsAct; embedded?: boolean } = {}): string {
  const url = new URL(ARTIST_FORM.viewUrl);
  if (opts.act) {
    // The live dropdown offers the bare act names (edited by hand 2026-09-10;
    // it carried set times before). Prefill with the name itself so there is
    // no second copy of the option text to drift. If the options are ever
    // renamed, the prefill quietly selects nothing - the form still works,
    // the artist just picks their act by hand.
    url.searchParams.set('usp', 'pp_url');
    url.searchParams.set(ARTIST_FORM.actEntry, opts.act.name);
  }
  if (opts.embedded) url.searchParams.set('embedded', 'true');
  return url.toString();
}

/** '15:45' -> '3:45 PM' */
export function clock12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** '15:45' + 40 -> '16:25' */
export function addMinutes(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

/**
 * Friday soundcheck. Zaal, 2026-09-10: 4pm to 7pm, the earliest of the three
 * blocks. Mandatory for every act; Saturday morning is a line check only.
 */
export const SOUNDCHECK = {
  day: 'Friday 2 October',
  window: '4 PM to 7 PM',
} as const;

/**
 * The weekend, for an act. Every row is sourced; nothing here is a promise
 * nobody has made. Parking and load-in are deliberately absent - the City owes
 * the vehicle-access answer and it is not in yet.
 */
export const ARTIST_DATES: ReadonlyArray<{ when: string; what: string }> = [
  { when: `${ARTIST_FORM.dueLabel}`, what: 'The artist details form, on this page. Photo link, short bio, your city, your links, a yes on playing and a yes or no on Friday soundcheck.' },
  { when: 'Friday 18 September', what: 'Your tech rider, by email to info@thezao.com: who is on stage, what you plug in, what you bring and what you need from us.' },
  { when: `${SOUNDCHECK.day}, ${SOUNDCHECK.window}`, what: 'Soundcheck on the parklet stage. Every act, mandatory, and there is no Saturday alternative. It doubles as a filming and recording night.' },
  { when: 'Saturday 3 October, 10 AM', what: 'Everyone on site. Crew is in from 8.' },
  { when: 'Saturday, noon', what: 'Doors, a five-minute welcome on the mic, then music from 12:05. One stage, sets back to back with five-minute changeovers.' },
  { when: 'Saturday, 5:55 PM', what: 'Music ends and the street clears at six. Black Moon Public House next door hosts its own evening from six.' },
];

/** From the ops room's hospitality list, which Steve and Black Moon committed. */
export const PROVIDED: ReadonlyArray<string> = [
  'Bottled water and electricity at the stage.',
  'A $20 gift certificate at Black Moon for every performer. Eat after your set.',
  'A dressing room with its own bathroom, in the Black Moon basement, for performers.',
  'A porta-potty on site.',
];

export const BRING: ReadonlyArray<string> = [
  'Your instruments, and anything you play through beyond the shared PA. Backline is sorted act by act from your rider; until an item is confirmed to you in writing, assume you bring it.',
  'A headcount. Tell us how many people are with you, on stage and in total: it sets the meal certificates and the dressing-room space.',
  'Layers and rain gear. It is rain or shine, under tent cover, in Maine in October.',
  'Merch, if you sell it. Say so in the last box of the form so we can plan for it.',
];

/**
 * Which act a form response belongs to. The "Which act are you?" answer exists
 * in three shapes at once, all already in flight on 2026-09-10:
 *
 *   "Dcoop - 3:45 PM, 40 min"   the original option, name + set time
 *   "Dcoop"                     bare name, after the first hand edit
 *   "DCoop"                     Zaal's ruled spelling, after the rename
 *
 * plus the retired long form "Acadia Rising (Sen Wilde, with Women with
 * Rhythm) - 2:00 PM, 30 min". Anything that reads responses must accept every
 * shape, or it matches seven acts and loses the one who already replied.
 *
 * Match: drop everything from " - " on, drop any parenthetical, then compare
 * letters and digits only, case-insensitively. No fuzzy matching: an answer
 * that is not one of the acts returns null rather than a guess.
 */
export function actFromFormAnswer(answer: string, acts: readonly OpsAct[] = OPS_ACTS): OpsAct | null {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const head = answer.split(' - ')[0].replace(/\([^)]*\)/g, '');
  const key = norm(head);
  if (!key) return null;
  return acts.find((a) => norm(a.name) === key) ?? null;
}
