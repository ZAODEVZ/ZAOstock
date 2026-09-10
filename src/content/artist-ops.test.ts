import { describe, expect, it } from 'vitest';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import path from 'path';
import {
  ARTIST_DATES,
  ARTIST_FORM,
  OPS_ACTS,
  SOUNDCHECK,
  addMinutes,
  artistFormUrl,
  actFromFormAnswer,
  latestPerAct,
  responseTime,
  type FormResponse,
  clock12,
  findActByCode,
  type OpsAct,
} from './artist-ops';
import { LINEUP_NAMES } from './site';

const sha = (s: string) => createHash('sha256').update(s).digest('hex');

// Codes invented for the test. No real code may ever appear in this public repo.
const FAKE: readonly OpsAct[] = [
  { ...OPS_ACTS[0], key: 'alpha', codeSha256: sha('alpha-abc234') },
  { ...OPS_ACTS[1], key: 'beta', codeSha256: sha('beta-xyz789') },
];

describe('findActByCode - the gate on the background page', () => {
  it('opens for the right code, and for the right code retyped in capitals', () => {
    expect(findActByCode('alpha-abc234', FAKE)?.key).toBe('alpha');
    expect(findActByCode('BETA-XYZ789', FAKE)?.key).toBe('beta');
    expect(findActByCode('%20alpha-abc234%20', FAKE)?.key).toBe('alpha');
  });

  // The red control. If this ever passes a wrong code, the gate is decorative.
  it('refuses a wrong code, a near miss, the bare key, and junk', () => {
    for (const bad of ['alpha-abc235', 'alpha', 'beta-xyz78', '', '../etc', 'a'.repeat(200), '%E0%A4%A', 'alpha abc234']) {
      expect(findActByCode(bad, FAKE), bad).toBeNull();
    }
  });

  it('does not open a real page for a fake code', () => {
    expect(findActByCode('alpha-abc234')).toBeNull();
  });
});

describe('OPS_ACTS - one page per act, eight acts', () => {
  it('is the bill in running order, without Hurricane', () => {
    // Hurricane is out (Zaal, 2026-09-10). Until LINEUP_NAMES drops him this
    // filter removes him; after, it is a no-op and the equality still holds.
    expect(OPS_ACTS.map((a) => a.name)).toEqual(LINEUP_NAMES.filter((n) => n !== 'Hurricane'));
    expect(OPS_ACTS).toHaveLength(8);
    expect(OPS_ACTS.some((a) => /hurricane/i.test(a.name + a.key))).toBe(false);
  });

  it('carries a distinct well-formed hash for every act, and no plaintext code', () => {
    const hashes = OPS_ACTS.map((a) => a.codeSha256);
    expect(new Set(hashes).size).toBe(OPS_ACTS.length);
    for (const h of hashes) expect(h).toMatch(/^[0-9a-f]{64}$/);
    const src = readFileSync(path.join(process.cwd(), 'src/content/artist-ops.ts'), 'utf8');
    // A code is `<key>-<six chars>`. None may be written out in the source.
    for (const a of OPS_ACTS) {
      expect(src, a.key).not.toMatch(new RegExp(`['"\`]${a.key}-[a-z0-9]{6}['"\`]`));
    }
  });

  // Zaal, 2026-09-10: "lets give 7 mins between performers and give the 30
  // mins people some more time", then "option b": 33-minute sets.
  it('runs the day on seven-minute changeovers, music 12:05 to 17:46', () => {
    expect(OPS_ACTS[0].setStart).toBe('12:05');
    for (let i = 1; i < OPS_ACTS.length; i++) {
      const prev = OPS_ACTS[i - 1];
      expect(OPS_ACTS[i].setStart, `${prev.name} -> ${OPS_ACTS[i].name}`).toBe(
        addMinutes(addMinutes(prev.setStart, prev.minutes), 7),
      );
    }
    const last = OPS_ACTS[OPS_ACTS.length - 1];
    expect(addMinutes(last.setStart, last.minutes)).toBe('17:46');
    expect(OPS_ACTS.map((a) => a.minutes)).toEqual([33, 40, 33, 33, 33, 40, 40, 40]);
  });

  it('gives every act the SAME time as /program', () => {
    const prog = readFileSync(path.join(process.cwd(), 'src/app/program/page.tsx'), 'utf8');
    const times = new Map<string, string>();
    for (const m of prog.matchAll(/time:\s*'(\d{1,2}:\d{2})',\s*label:\s*'([^']+)'/g)) times.set(m[2], m[1]);
    const drift = OPS_ACTS.filter((a) => times.get(a.name) !== a.setStart).map(
      (a) => `${a.name}: backstage ${a.setStart}, /program ${times.get(a.name)}`,
    );
    expect(drift).toEqual([]);
  });

  it('prefills with the bare act name the live dropdown offers', () => {
    // Read from the live form 2026-09-10 after the hand edit: bare names only,
    // no set times, no member names (Zaal: always "Acadia Rising").
    const LIVE_OPTIONS = [
      'The Crown Vics', 'OPEN X', 'Grass Rug', 'Acadia Rising',
      'Michael Anderson', 'DCoop', 'Lyons Den', 'Fellenz',
    ];
    for (const a of OPS_ACTS) {
      const v = new URL(artistFormUrl({ act: a })).searchParams.get(ARTIST_FORM.actEntry);
      expect(LIVE_OPTIONS, a.name).toContain(v);
      expect(v).not.toMatch(/\d:\d{2}|Sen Wilde|Women with Rhythm/);
    }
  });
});

describe('the form stays open', () => {
  it('points at the public /d/e/ viewform, never an editor or sign-in URL', () => {
    for (const u of [artistFormUrl(), artistFormUrl({ act: OPS_ACTS[0], embedded: true })]) {
      const url = new URL(u);
      expect(url.hostname).toBe('docs.google.com');
      expect(url.pathname).toMatch(/^\/forms\/d\/e\/[A-Za-z0-9_-]+\/viewform$/);
      expect(u).not.toMatch(/edit|ServiceLogin|accounts\.google|authuser/);
    }
  });

  it('prefills only the act question', () => {
    const url = new URL(artistFormUrl({ act: OPS_ACTS[5], embedded: true }));
    expect(url.searchParams.get(ARTIST_FORM.actEntry)).toBe(OPS_ACTS[5].name);
    expect(url.searchParams.get('embedded')).toBe('true');
    expect([...url.searchParams.keys()].sort()).toEqual(['embedded', ARTIST_FORM.actEntry, 'usp'].sort());
  });

  it('is reachable with no code: /backstage renders the form with no gate', () => {
    const index = readFileSync(path.join(process.cwd(), 'src/app/backstage/page.tsx'), 'utf8');
    expect(index).toContain('<ArtistForm />');
    expect(index).not.toMatch(/findActByCode|notFound|cookies|session/);
    const missing = readFileSync(path.join(process.cwd(), 'src/app/backstage/[code]/not-found.tsx'), 'utf8');
    expect(missing).toContain('<ArtistForm />');
  });
});

describe('the Friday soundcheck', () => {
  it('is 4 to 7 PM on Friday 2 October (Zaal, 2026-09-10)', () => {
    expect(SOUNDCHECK).toEqual({ day: 'Friday 2 October', window: '4 PM to 7 PM' });
  });
});

describe('clock helpers', () => {
  it('formats and adds', () => {
    expect(clock12('12:05')).toBe('12:05 PM');
    expect(clock12('15:45')).toBe('3:45 PM');
    expect(clock12('00:30')).toBe('12:30 AM');
    expect(addMinutes('17:15', 40)).toBe('17:55');
    expect(addMinutes('12:40', 40)).toBe('13:20');
  });
});

describe('actFromFormAnswer - every shape the act question has had', () => {
  // Zaal ruled "DCoop" on 2026-09-10 while responses in the old shapes were
  // already in. All three must land on the same act.
  it('matches DCoop in all three shapes', () => {
    for (const answer of ['Dcoop - 3:45 PM, 40 min', 'Dcoop', 'DCoop']) {
      expect(actFromFormAnswer(answer)?.key, answer).toBe('dcoop');
    }
  });

  it('matches every act from its original option text and its bare name', () => {
    const OLD = [
      'The Crown Vics - 12:05 PM, 30 min', 'OPEN X - 12:40 PM, 40 min', 'Grass Rug - 1:25 PM, 30 min',
      'Acadia Rising (Sen Wilde, with Women with Rhythm) - 2:00 PM, 30 min', 'Michael Anderson - 2:35 PM, 30 min',
      'Dcoop - 3:45 PM, 40 min', 'Lyons Den - 4:30 PM, 40 min', 'Fellenz - 5:15 PM, 40 min',
    ];
    expect(OLD.map((a) => actFromFormAnswer(a)?.name)).toEqual(OPS_ACTS.map((a) => a.name));
    expect(OPS_ACTS.map((a) => actFromFormAnswer(a.name)?.key)).toEqual(OPS_ACTS.map((a) => a.key));
  });

  // The red side: an answer that is not an act must not be forced onto one.
  it('returns null for anything that is not one of the eight', () => {
    for (const bad of ['Hurricane - 3:10 PM, 30 min', 'Hurricane', 'Coop', '', '   ', 'TEST DO NOT USE']) {
      expect(actFromFormAnswer(bad), bad).toBeNull();
    }
  });
});

describe('latestPerAct - one act, several submissions', () => {
  const row = (timestamp: string, act: string, bio: string, photo: string): FormResponse => ({ timestamp, act, bio, photo });

  it('takes the LATER submission by timestamp, not by row order', () => {
    const later = row('9/10/2026 14:00:00', 'Fellenz', 'New bio.', 'https://x/new.jpg');
    const earlier = row('9/10/2026 09:00:00', 'Fellenz', 'Old bio.', 'https://x/old.jpg');
    // later listed FIRST, so row position would pick the wrong one
    const { byAct } = latestPerAct([later, earlier]);
    expect(byAct.get('fellenz')).toBe(later);
  });

  // THE TRAP. Resubmitting to fix a photo with the bio box left empty must NOT
  // quietly keep the old bio: the later row wins whole, blanks included.
  it('does not inherit a field from an earlier submission when the later one is empty', () => {
    const first = row('9/10/2026 09:00:00', 'Fellenz', 'Old bio.', 'https://x/old.jpg');
    const fix = row('9/10/2026 10:00:00', 'Fellenz', '', 'https://x/fixed.jpg');
    const won = latestPerAct([first, fix]).byAct.get('fellenz')!;
    expect(won).toBe(fix);
    expect(won.bio).toBe('');
    expect(won.photo).toBe('https://x/fixed.jpg');
  });

  it('groups the old and new DCoop shapes as one act', () => {
    const old = row('9/9/2026 11:38:50', 'Dcoop - 3:45 PM, 40 min', 'Bio.', '');
    const renamed = row('9/11/2026 08:00:00', 'DCoop', 'Bio.', 'https://x/d.jpg');
    const { byAct } = latestPerAct([renamed, old]);
    expect(byAct.size).toBe(1);
    expect(byAct.get('dcoop')).toBe(renamed);
  });

  it('keeps answers that match no act, rather than dropping them', () => {
    const stray = row('9/10/2026 09:00:00', 'Hurricane - 3:10 PM, 30 min', 'x', 'y');
    expect(latestPerAct([stray]).unmatched).toEqual([stray]);
  });

  it('refuses a timestamp it cannot read, rather than guessing the order', () => {
    expect(responseTime('9/9/2026 11:38:50')).toBeLessThan(responseTime('9/10/2026 09:00:00'));
    expect(() => responseTime('yesterday')).toThrow();
    expect(() => latestPerAct([row('garbage', 'Fellenz', 'a', 'b'), row('9/10/2026 09:00:00', 'Fellenz', 'a', 'b')])).toThrow();
  });
});

// Zaal, 2026-09-10: there is no reveal day. Every backstage page is the landing
// page for a message that says so, and must not contradict it.
describe('the backstage page promises no reveal day', () => {
  it('names no reveal date, no Sunday, and no reveal label', () => {
    const page = readFileSync(path.join(process.cwd(), 'src/app/backstage/[code]/page.tsx'), 'utf8');
    expect(page).not.toContain('lineupRevealLabel');
    expect(page).not.toMatch(/Sunday|13 September/);
    expect(page).toContain('The form is what puts you in it.');
  });
});

// Zaal, 2026-09-10: "just dont make it due on a date no later than 18 th". The
// form's due date was Friday 11 September, the next day, with no act yet sent
// its link. Every reading of his words forbids 11 September; neither asks for a
// new date. So: none is printed, and if one ever is, it may not pass 18 Sep.
describe('the artist form has no due date', () => {
  const SURFACES = [
    'src/content/artist-ops.ts',
    'src/app/backstage/ArtistForm.tsx',
    'src/app/backstage/[code]/page.tsx',
    'src/app/backstage/page.tsx',
    'scripts/create-artist-form.gs',
    'ops-room/ops-room.src.html',
  ];

  it('prints "11 September" nowhere an artist or the crew reads about the form', () => {
    for (const f of SURFACES) {
      const src = readFileSync(path.join(process.cwd(), f), 'utf8');
      expect(src, f).not.toMatch(/Friday 11 September|due back Friday 11/);
    }
    expect(JSON.stringify(ARTIST_FORM)).not.toMatch(/11 September/);
  });

  it('asks without a date, and any date it ever carries is no later than 18 September', () => {
    const row = ARTIST_DATES[0];
    expect(row.what).toMatch(/artist details form/);
    expect(row.when).toBe(ARTIST_FORM.askLabel);
    const m = row.when.match(/(\d{1,2}) September/);
    if (m) expect(Number(m[1])).toBeLessThanOrEqual(18);
    expect(ARTIST_FORM.askLabel).not.toMatch(/\d/);
  });
});
