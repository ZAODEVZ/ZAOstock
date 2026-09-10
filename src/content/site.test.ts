import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { PARTNERS, PUBLIC_LINEUP, LINEUP_NAMES, LINEUP_NAMES_NOTE, TIERS, SITE, DAY, SERIES, ZAO, WAVEWARZ_STATS, ELLSWORTH, DELIVERABLES } from './site';

// The rules festival.test.ts enforces for festival.ts, applied to the facts
// that live here until PRODUCTION's file absorbs them.

// 'north creek' left this list on 2026-09-07: Zaal settled it as the after-party
// act at Black Moon, 6-9pm, underwritten by them. It is no longer proposed.
// 'aquavantes' STAYS: the act is unconfirmed for the programme and its spelling is
// still disputed (repo and organising doc say Aquavantes, Zaal said Aquaventus,
// only Steve can settle it), so it must not reach a public surface either way.
const PROPOSED = ['aquavantes', 'somes sound'];
const NOT_PUBLIC = ['werb', 'sen wilde', 'phelan'];

describe('SITE facts', () => {
  it('publishes noon and the contact address, and no reveal date', () => {
    expect(SITE.musicFrom).toBe('Noon');
    expect(SITE.contact).toBe('info@thezao.com');
    expect('lineupRevealDate' in SITE).toBe(false);
    expect(SITE.submissionCutoffDate).toBe('2026-09-01');
  });

  it('names no proposed act anywhere', () => {
    const blob = JSON.stringify({ PARTNERS, PUBLIC_LINEUP, LINEUP_NAMES, TIERS, SITE, DAY, SERIES }).toLowerCase();
    for (const name of PROPOSED) expect(blob).not.toContain(name);
  });

  it('keeps every unconfirmed act out of the public lineup', () => {
    const blob = PUBLIC_LINEUP.join(' ').toLowerCase();
    for (const name of NOT_PUBLIC) expect(blob).not.toContain(name);
    expect(PUBLIC_LINEUP).toEqual(['Lyons Den']);
  });

  // PUBLIC_LINEUP is the website's half of the reveal: the app reads the artists
  // table, the site reads this array, and on 7 September BOTH have to change.
  // So this array is guaranteed to be edited under time pressure, and a surface
  // that indexes it renders the literal string "undefined" the moment it is
  // emptied or reordered. /program did exactly that on the public run of show.
  it('is never indexed into a template without a guard on the same line', () => {
    const surfaces = ['src/app/program/page.tsx', 'src/app/page.tsx'];
    for (const p of surfaces) {
      const src = readFileSync(path.join(process.cwd(), p), 'utf8');
      for (const line of src.split('\n')) {
        for (const hit of line.matchAll(/\$\{PUBLIC_LINEUP\[(\d+)\]\}/g)) {
          const i = hit[1];
          expect(
            line,
            `${p}: PUBLIC_LINEUP[${i}] is interpolated with nothing checking it exists`,
          ).toMatch(new RegExp(`PUBLIC_LINEUP\\[${i}\\]\\s*(\\?|&&)`));
        }
      }
    }
  });

  it('carries no price until Zaal types one', () => {
    for (const t of TIERS) expect(t.price).toBeNull();
  });

  it('lists eight confirmed partners', () => {
    // Eighth since 2026-09-10: Artizen, for funding (Zaal).
    expect(PARTNERS).toHaveLength(8);
    expect(PARTNERS.map((p) => p.name)).toContain('Artizen');
    expect(PARTNERS.map((p) => p.name)).toContain('Bomb Squad');
    expect(PARTNERS.map((p) => p.name)).toContain('COC Concertz');
    expect(PARTNERS.map((p) => p.name)).not.toContain('Heart of Ellsworth');
    for (const p of PARTNERS) expect(p.confirmed).toBe(true);
  });

  // The test above was called '...and only partners with a POC field' and made
  // no assertion about poc whatsoever. The gating rule over PARTNERS is strict -
  // a partner is published only when it is confirmed AND poc names the ZAO team
  // member who owns the relationship - and only half of it was enforced.
  //
  // COC Concertz is the one known exception: added 2026-08-27 with role and POC
  // untyped. It is NAMED here rather than waved through, so a second unowned
  // partner cannot reach the public homepage without this going red.
  it('gives every published partner a typed role and a named owner, bar the one known exception', () => {
    const untyped = PARTNERS.filter((p) => p.role === 'UNSET' || p.poc === 'UNSET').map((p) => p.name);
    expect(untyped).toEqual(['COC Concertz']);
    // Zaal, 2026-09-10: "poc is thyrev". Only the role is still untyped.
    const coc = PARTNERS.find((p) => p.name === 'COC Concertz');
    expect(coc?.poc).toBe('Thy Revolution');
    expect(coc?.role).toBe('UNSET');
    // And no page prints an untyped role: the overview one-pager's own list
    // renders a role only when there is one.
    const overview = readFileSync(path.join(process.cwd(), 'src/app/onepagers/overview/page.tsx'), 'utf8');
    expect(overview).not.toMatch(/role:\s*'UNSET'/);
    for (const p of PARTNERS) {
      expect(p.poc.trim()).not.toBe('');
      expect(p.role.trim()).not.toBe('');
    }
  });

  it('describes one venue at a time with no changeover DJ', () => {
    const blob = JSON.stringify(DAY).toLowerCase();
    expect(blob).not.toContain('dj in every');
    expect(blob).not.toContain('second stage');
    expect(DAY[0].what).toContain('MC');
  });

  it('never claims a tax-deductible path', () => {
    const blob = JSON.stringify({ SITE, TIERS }).toLowerCase();
    expect(blob).not.toContain('tax-deductible');
    expect(blob).not.toContain('501(c)');
  });
});

// Zaal, 2026-09-07: "lets just update it with the names but no times and no links
// and over the week this week we will just add it all to the website."
//
// So the guard changed shape rather than going away. It used to say "do not name
// these acts". It now says "name them, but never claim they signed, and publish no
// set time and no link until the rest is filled in". None of them has
// countersigned, so a rendered "confirmed" next to these names would be a
// fabricated signature - the one line that has not moved all week.
describe('the names-only lineup', () => {
  const RUN_OF_SHOW = [
    'The Crown Vics',
    'OPEN X',
    'Grass Rug',
    'Acadia Rising',
    'Michael Anderson',
    'DCoop',
    'Lyons Den',
    'Fellenz',
  ];

  it('is the eight acts of the locked run of show, in order (Hurricane out 2026-09-10)', () => {
    expect(LINEUP_NAMES).toEqual(RUN_OF_SHOW);
  });

  it('carries NO set time and NO link', () => {
    for (const entry of [...LINEUP_NAMES, LINEUP_NAMES_NOTE]) {
      expect(entry).not.toMatch(/\d{1,2}:\d{2}/);
      expect(entry).not.toMatch(/\b\d{1,2}\s*(AM|PM)\b/i);
      expect(entry).not.toMatch(/https?:\/\//);
    }
  });

  it('never claims these acts are confirmed - none has countersigned', () => {
    expect(LINEUP_NAMES_NOTE.toLowerCase()).not.toContain('confirm');
    for (const p of ['src/app/page.tsx', 'src/app/program/page.tsx']) {
      const lines = readFileSync(path.join(process.cwd(), p), 'utf8').split('\n');
      const offending = lines.filter(
        (l) => l.includes('LINEUP_NAMES') && /confirm/i.test(l),
      );
      expect(offending).toEqual([]);
    }
  });

  it('keeps "confirmed" for PUBLIC_LINEUP only, which is a different and narrower claim', () => {
    expect(PUBLIC_LINEUP).toEqual(['Lyons Den']);
    expect(LINEUP_NAMES.length).toBeGreaterThan(PUBLIC_LINEUP.length);
  });
});

// Zaal, 2026-09-07: WaveWarZ is OFF the 3 October programme. The locked run of
// show puts Lyons Den at 16:30 and Fellenz at 17:15 in the window the battle
// used to hold, so it was already off in practice while four surfaces still
// advertised it.
//
// The distinction this guards: WaveWarZ the FORMAT is real, is a confirmed
// partner and genuinely happened at ZAO-CHELLA in December 2024. What is gone is
// the claim that it is on the ZAOstock bill. Do not "fix" this by deleting the
// word everywhere - the history is true and deleting it would be its own error.
describe('WaveWarZ is off the 3 October programme', () => {
  const BATTLERS = ['Jango', 'Lui', 'Quan'];

  it('holds no battle slot in the published day', () => {
    const day = JSON.stringify(DAY);
    expect(day).not.toContain('WaveWarZ');
    expect(day).not.toContain('head to head');
  });

  it('names no battler anywhere in the site content', () => {
    const blob = JSON.stringify({ PARTNERS, PUBLIC_LINEUP, LINEUP_NAMES, TIERS, SITE, DAY, SERIES });
    for (const b of BATTLERS) expect(blob).not.toContain(b);
  });

  it('leaves the outdoor block running to six, with no gap where the battle was', () => {
    const outdoor = DAY.filter((d) => d.where.includes('Franklin Street'));
    expect(outdoor).toHaveLength(1);
    expect(outdoor[0].time).toBe('Noon - 6 PM');
  });

  it('keeps WaveWarZ as a partner, but claiming no stage slot', () => {
    const w = PARTNERS.find((p) => p.name === 'WaveWarZ');
    expect(w).toBeDefined();
    expect(w!.role).not.toContain('ZAOstock stage');
  });

  it('KEEPS the true ZAO-CHELLA 2024 history - that battle really happened', () => {
    const chella = SERIES.find((s) => s.name === 'ZAO-CHELLA');
    expect(chella).toBeDefined();
    expect(JSON.stringify(chella)).toContain('WaveWarZ');
  });
});

/**
 * RETIRED CLAIMS. Each of these was live on a public sponsor surface on
 * 2026-09-09 and was found by rendering the page, not by reading this file.
 * The point of pinning VALUES rather than files is that a barred figure or
 * phrase trips wherever it reappears, including in a file nobody thought to
 * add to a checklist. That is the failure mode these three came back through.
 */
describe('retired claims stay retired', () => {
  // Everything in this module that could reach a page.
  const surfaces = JSON.stringify({ SITE, ZAO, WAVEWARZ_STATS, SERIES, ELLSWORTH, TIERS, DELIVERABLES, DAY });

  const BARRED: ReadonlyArray<readonly [RegExp, string]> = [
    [/\bon-?chain\b/i, 'no crypto or web3 framing on a local Maine surface'],
    [/\bblockchain\b/i, 'no crypto or web3 framing on a local Maine surface'],
    [/\bweb ?3\b/i, 'no crypto or web3 framing on a local Maine surface'],
    [/\b157\b/, 'never quote a specific ZAO member count, use "100+"'],
    [/\b1,?452\b/, 'stale WaveWarZ figure, superseded 2026-09-09'],
    [/18 September/, 'the reveal is 13 September; the 18th replicated into a sibling lane'],
    [/\$ ?25,?000|\$ ?25K/i, '$25K is internal only; $5,000 is the only public figure'],
    [/four million|\b4 ?million|\b4M\b/i, 'no source for "4 million drove through", MaineDOT included; Zaal: "Drop both" (2026-09-10)'],
    [/(twenty|\d+\+?)\s+countries/i, 'no member-country list exists; Zaal: "Drop both" (2026-09-10)'],
  ];

  for (const [pattern, why] of BARRED) {
    it(`does not carry ${pattern.source} - ${why}`, () => {
      expect(surfaces).not.toMatch(pattern);
    });
  }

  // The two press-kit claims Zaal dropped on 2026-09-10 lived in page files and
  // the press kit, not only in this module, so check every file a reader sees.
  it('keeps "4 million drove through" and "N countries" off every public file', () => {
    const roots = ['src/app', 'src/components', 'src/content', 'public', 'docs/marketing/press-kit.md'];
    const files: string[] = [];
    for (const r of roots) {
      const abs = path.join(process.cwd(), r);
      if (r.endsWith('.md')) { files.push(abs); continue; }
      for (const f of readdirSync(abs, { recursive: true }) as string[]) {
        const full = path.join(abs, f);
        // src/app/llms.txt is a route FOLDER, so test the name AND that it is a file.
        if (/\.(tsx?|md|html|txt)$/.test(f) && !/\.test\.tsx?$/.test(f) && statSync(full).isFile()) files.push(full);
      }
    }
    const hits = files.flatMap((f) => {
      const src = readFileSync(f, 'utf8');
      return [/four million|\b4 ?million\b/i, /(twenty|\d+\+?)\s+countries/i]
        .filter((re) => re.test(src))
        .map((re) => `${path.relative(process.cwd(), f)}: ${re.source}`);
    });
    expect(files.length).toBeGreaterThan(50);
    expect(hits).toEqual([]);
  });

  // A guard that cannot fail is not a guard. This proves the check above is
  // actually looking at something, so deleting a constant cannot silently
  // turn every assertion into a pass over an empty string.
  it('is actually inspecting real content', () => {
    expect(surfaces.length).toBeGreaterThan(500);
    expect(surfaces).toContain('Franklin Street Parklet');
  });
});

/**
 * THE CROWD DOES NOT MOVE INDOORS, and no public surface may say it does.
 *
 * Black Moon's evening is North Creek, roughly 6 to 9, on THEIR stage and
 * THEIR licence, underwritten by them. Two reasons this wording is load-bearing
 * rather than fussy. Their posted occupancy has never been given to us, so
 * "everyone goes inside" asserts a fire-code fact nobody has looked up against
 * an expected 200-250 people. And our insurance covers the OUTDOOR day only, a
 * position that depends on their evening not being one continuous ZAOstock event.
 *
 * On 2026-09-09 this claim was live on `/` and `/program` while the sponsor deck
 * carried the careful version, so the surface the town and the artists read was
 * the reckless one and the surface fewest people see was the honest one.
 *
 * The rule matches the CLAIM, not remembered phrasings: a subject meaning
 * everyone, a verb of motion, a destination meaning inside or next door. An
 * earlier version matched only "moves inside" and "moves indoors" and passed
 * cleanly over four live instances of "walks next door".
 */
describe('no public surface claims the crowd goes indoors', () => {
  const FILES = [
    'src/app/page.tsx',
    'src/app/program/page.tsx',
    'src/app/llms.txt/route.ts',
    'src/app/sponsor/page.tsx',
  ];

  const SUBJECT = /(the whole street|everyone|everybody|the whole day|the crowd|all of us)/i;
  const MOTION = /(walks?|moves?|heads?|goes|go|piles?|files?|streams?)/i;
  const INSIDE = /(next door|inside|indoors|into black moon|in to black moon|in\b)/i;
  const CLAIM = new RegExp(`${SUBJECT.source}[^.!?\\n]{0,60}\\b${MOTION.source}\\b[^.!?\\n]{0,60}${INSIDE.source}`, 'i');

  for (const rel of FILES) {
    it(`${rel} does not assert a crowd movement nobody has measured`, () => {
      const body = readFileSync(path.join(process.cwd(), rel), 'utf8');
      const hit = body.match(CLAIM);
      expect(hit ? `${rel}: ${hit[0]}` : null).toBeNull();
    });
  }

  it('the rule actually fires on the wording that was live', () => {
    // All four real 2026-09-09 instances, kept as cases so the rule cannot be
    // narrowed back to something that passes over them.
    for (const live of [
      'At six the whole street walks next door.',
      'At six the whole street walks next door into Black Moon for the evening.',
      'Everyone moves next door into Black Moon.',
      'the whole street walks in',
      'At six the street clears and the whole day walks inside.',
    ]) {
      expect(live).toMatch(CLAIM);
    }
  });

  it('does not fire on the wording that is correct', () => {
    for (const ok of [
      'At six the street clears, and Black Moon next door hosts their own evening.',
      'North Creek, hosted by Black Moon. Their stage, their evening.',
      'Black Moon Public House, next door',
    ]) {
      expect(ok).not.toMatch(CLAIM);
    }
  });
});


/**
 * NO PUBLIC PAGE PUBLISHES A RECURRING MEETING TIME unless somebody holds it.
 *
 * /meetings advertised two open meetings a day, 11:30 AM and 5 PM Eastern,
 * "every day until 3 October", in copy that invited people to whichever suited
 * them "so nobody has to choose between this and a job". Zaal, 2026-09-09: "we
 * never do the standups tbh". It was true when written on 29 August and went
 * stale without anyone touching the page.
 *
 * This is the worst-consequence version of the stale-claim family, because a
 * wrong figure misleads a reader and a wrong meeting time makes somebody travel.
 *
 * Matches the CLAIM, not the old wording: a clock time next to a recurrence
 * word. If a real standing meeting ever starts, someone must delete this test
 * deliberately and name who is holding it.
 */
describe('no public page publishes a recurring meeting time', () => {
  const PAGES = ['src/app/meetings/page.tsx', 'src/app/page.tsx', 'src/app/program/page.tsx'];
  const TIME = /\b(?:[01]?\d|2[0-3])(?::[0-5]\d)?\s*(?:AM|PM|am|pm)\b/;
  const RECURS = /\b(every ?day|daily|each day|(?:twice|once|two|three) a day|meetings? a day|a day|per day|every week|weekly)\b/i;
  const NEAR = new RegExp(`(?:${TIME.source}[^.!?\n]{0,80}${RECURS.source})|(?:${RECURS.source}[^.!?\n]{0,80}${TIME.source})`, 'i');

  for (const rel of PAGES) {
    it(`${rel} does not advertise a standing meeting time`, () => {
      const body = readFileSync(path.join(process.cwd(), rel), 'utf8');
      // Strip comments: the history of the retirement is written in them and
      // must stay readable without tripping the guard it explains.
      const code = body.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      const hit = code.match(NEAR);
      expect(hit ? `${rel}: ${hit[0]}` : null).toBeNull();
    });
  }

  it('fires on the wording that was live', () => {
    for (const live of [
      'Two open meetings a day, 11:30 AM and 5 PM Eastern',
      '11:30 AM Eastern, every day',
      'daily at 5 PM',
    ]) {
      expect(live).toMatch(NEAR);
    }
  });

  it('does not fire on the run of show', () => {
    for (const ok of [
      'Music starts at noon and the street clears at six.',
      '12:05 The Crown Vics. 30 minutes.',
      'Soundcheck is the evening of Friday 2 October.',
    ]) {
      expect(ok).not.toMatch(NEAR);
    }
  });
});

// Zaal, 2026-09-10: "He knows, strip him today." Hurricane is out, eight acts,
// no replacement. A note that he is out may stay; a billing may not.
describe('Hurricane is off the bill', () => {
  const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');

  it('is not billed on any surface that names the acts', () => {
    expect(LINEUP_NAMES).not.toContain('Hurricane');
    expect(read('src/app/program/page.tsx')).not.toMatch(/label:\s*'Hurricane'/);
    expect(read('ops-room/ops-room.src.html')).not.toMatch(/n:"Hurricane"|id:"hurricane"/);
    expect(read('docs/marketing/press-kit.md')).not.toMatch(/hurricane/i);
    expect(read('scripts/create-artist-form.gs')).not.toMatch(/'Hurricane - /);
  });

  // Zaal's standing rule, 2026-09-10: always "Acadia Rising", never the long form.
  it('bills Acadia Rising by that name only', () => {
    for (const p of ['docs/marketing/press-kit.md', 'ops-room/ops-room.src.html', 'scripts/create-artist-form.gs', 'src/app/program/page.tsx']) {
      expect(read(p), p).not.toMatch(/Acadia Rising \(|Women with Rhythm/);
    }
  });

  it('is counted as eight wherever the kit states a count', () => {
    expect(read('docs/marketing/press-kit.md')).not.toMatch(/\bnine\b/i);
  });
});

// Zaal, 2026-09-10: "enteract is not a partner neither is we 3 metal". Both had
// been rendering as confirmed partners on /, /press and /partners.
describe('ENTERACT and Web3Metal are not partners', () => {
  const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');
  it('never reappear in PARTNERS or on a surface that lists partners', () => {
    const names = PARTNERS.map((p) => p.name.toLowerCase().replace(/\s+/g, ''));
    for (const gone of ['enteract', 'web3metal']) expect(names).not.toContain(gone);
    for (const f of ['docs/marketing/press-kit.md', 'src/app/llms.txt/route.ts', 'src/app/onepagers/overview/page.tsx']) {
      const lines = read(f).split('\n').filter((l) => !l.trim().startsWith('//'));
      expect(lines.filter((l) => /enteract|web3 ?metal/i.test(l)), f).toEqual([]);
    }
  });
});

// No crypto framing in public copy (a standing rule for the local Maine
// audience). "during NFT NYC" was retired from the press kit on 2026-09-10 and
// was still live in SERIES and llms.txt: a retirement is a search, not an edit.
describe('the retired "NFT NYC" framing', () => {
  it('appears on no rendered surface', () => {
    const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');
    expect(JSON.stringify(SERIES)).not.toMatch(/NFT/);
    for (const f of ['src/app/llms.txt/route.ts', 'docs/marketing/press-kit.md', 'src/app/page.tsx', 'src/app/sponsor/page.tsx', 'src/app/event-organizers/page.tsx', 'src/app/festivals/page.tsx']) {
      expect(read(f), f).not.toMatch(/NFT NYC/);
    }
  });
});
