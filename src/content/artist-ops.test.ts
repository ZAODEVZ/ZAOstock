import { describe, expect, it } from 'vitest';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import path from 'path';
import {
  ARTIST_FORM,
  OPS_ACTS,
  SOUNDCHECK,
  addMinutes,
  artistFormUrl,
  actFromFormAnswer,
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
