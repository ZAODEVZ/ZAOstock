import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { SERIES } from './site';

/**
 * The team roster and the events registry are indexes, and an index nobody can
 * trust is worse than no index at all.
 *
 * This repo has already been bitten twice by exactly that. `agents/README.md`
 * carries a status table saying Zaal.md "needs draft" when it is fully written
 * and Iman.md is written when it is still the empty seed, and every file in
 * that folder is past the 90-day staleness rule the same README declares. And
 * the mobile app spent a week calling an event slug that was not in the table,
 * which only surfaced when the database came back up.
 *
 * So docs/team/README.md and docs/events/README.md are checked here rather than
 * trusted. If someone adds a person and forgets the roster row, or adds an
 * event and forgets the slug, this goes red instead of the index quietly
 * drifting out of true.
 */

const ROOT = process.cwd();
const TEAM = path.join(ROOT, 'docs', 'team');
const EVENTS = path.join(ROOT, 'docs', 'events');
const DECISIONS = path.join(ROOT, 'docs', 'decisions');

const read = (p: string) => readFileSync(p, 'utf8');

/** Minimal front-matter reader. Every key in these files is a plain `key: value`. */
function frontMatter(file: string): Record<string, string> {
  const text = read(file);
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const out: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([a-z-]+):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].trim();
  }
  return out;
}

const isDir = (p: string) => existsSync(p) && statSync(p).isDirectory();

/** Position folders are `NN-name`. Anything else in docs/team/ is an index page. */
const positionDirs = readdirSync(TEAM)
  .filter((d) => /^\d{2}-/.test(d) && isDir(path.join(TEAM, d)))
  .sort();

/** Every person file, as a repo-relative posix path, which is how README links them. */
const personFiles = positionDirs.flatMap((dir) =>
  readdirSync(path.join(TEAM, dir))
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .sort()
    .map((f) => `${dir}/${f}`),
);

describe('the team roster is an index that cannot rot', () => {
  const readme = read(path.join(TEAM, 'README.md'));

  it('has at least one position folder and one person in it', () => {
    expect(positionDirs.length).toBeGreaterThan(0);
    expect(personFiles.length).toBeGreaterThan(0);
  });

  it('lists every person file in the roster table', () => {
    const missing = personFiles.filter((rel) => !readme.includes(`(${rel})`));
    expect(missing).toEqual([]);
  });

  it('points every roster row at a file that exists', () => {
    const linked = [...readme.matchAll(/\]\((\d{2}-[^)]+\.md)\)/g)].map((m) => m[1]);
    expect(linked.length).toBeGreaterThan(0);
    const broken = linked.filter((rel) => !existsSync(path.join(TEAM, rel)));
    expect(broken).toEqual([]);
  });

  it('files every person under the position their own front matter claims', () => {
    const wrong = personFiles.filter((rel) => {
      const [dir] = rel.split('/');
      return frontMatter(path.join(TEAM, rel)).position !== dir;
    });
    expect(wrong).toEqual([]);
  });

  it('never reuses a number inside a position folder', () => {
    for (const dir of positionDirs) {
      const numbers = personFiles
        .filter((rel) => rel.startsWith(`${dir}/`))
        .map((rel) => rel.split('/')[1].slice(0, 2));
      expect(new Set(numbers).size, `duplicate number in ${dir}`).toBe(numbers.length);
    }
  });

  it('gives every position folder a section in ROLES.md', () => {
    const roles = read(path.join(TEAM, 'ROLES.md'));
    const missing = positionDirs.filter((dir) => !roles.includes(`## ${dir.slice(0, 2)}.`));
    expect(missing).toEqual([]);
  });
});

/**
 * The repo is PUBLIC. This is a backstop for the two shapes that are easiest to
 * paste in without thinking, not a licence to stop thinking: it catches an
 * email address and a US-format phone number, and there are more ways to leak
 * than that. The rule itself is written out in docs/team/README.md.
 */
describe('nothing in the public team folder is a way to contact someone directly', () => {
  const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
  const PHONE = /(\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/;

  const everyTeamFile = [
    ...readdirSync(TEAM)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f),
    ...personFiles,
    ...positionDirs.flatMap((dir) =>
      readdirSync(path.join(TEAM, dir))
        .filter((f) => f.startsWith('_') && f.endsWith('.md'))
        .map((f) => `${dir}/${f}`),
    ),
  ];

  it('carries no email address', () => {
    const hits = everyTeamFile.filter((rel) => EMAIL.test(read(path.join(TEAM, rel))));
    expect(hits).toEqual([]);
  });

  it('carries no phone number', () => {
    const hits = everyTeamFile.filter((rel) => PHONE.test(read(path.join(TEAM, rel))));
    expect(hits).toEqual([]);
  });
});

const eventFiles = readdirSync(EVENTS)
  .filter((f) => /^\d{2}-.*\.md$/.test(f))
  .sort();

describe('the events registry agrees with what the site publishes', () => {
  const readme = read(path.join(EVENTS, 'README.md'));
  // Kept as { file, fm } rather than spread: spreading a Record<string, string>
  // into an object literal drops the index signature, so every lookup below
  // would be a type error.
  const events = eventFiles.map((file) => ({ file, fm: frontMatter(path.join(EVENTS, file)) }));

  it('lists every event file in the table', () => {
    const missing = eventFiles.filter((f) => !readme.includes(`(${f})`));
    expect(missing).toEqual([]);
  });

  it('records a slug for every event, because the slug is the load-bearing part', () => {
    for (const e of events) {
      expect(e.fm.slug, `${e.file} has no slug`).toBeTruthy();
      expect(e.fm.slug).toMatch(/^[a-z0-9-]+$/);
    }
    // and the slug a client sends must resolve to one of them
    const slugs = events.map((e) => e.fm.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toContain('zaostock');
  });

  it('has a file for every festival the site puts in SERIES', () => {
    const named = events.map((e) => e.fm.event);
    for (const s of SERIES) {
      expect(named, `${s.name} is on the site but has no file in docs/events/`).toContain(s.name);
    }
  });

  it('describes each past festival the same way the site does', () => {
    for (const s of SERIES) {
      const match = events.find((e) => e.fm.event === s.name);
      expect(match, `no registry file for ${s.name}`).toBeDefined();
      expect(match?.fm.place, `${s.name}: place disagrees with SERIES`).toBe(s.place);
      expect(match?.fm.when, `${s.name}: date disagrees with SERIES`).toBe(s.when);
    }
  });
});

describe('the decision log is numbered and indexed', () => {
  const readme = read(path.join(DECISIONS, 'README.md'));
  const files = readdirSync(DECISIONS)
    .filter((f) => /^\d{4}-.*\.md$/.test(f))
    .sort();

  it('lists every decision in the log table', () => {
    const missing = files.filter((f) => !readme.includes(`(${f})`));
    expect(missing).toEqual([]);
  });

  it('never reuses a decision number, even for a reversed decision', () => {
    const numbers = files.map((f) => f.slice(0, 4));
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('makes every superseded decision point at the one that replaced it', () => {
    for (const f of files) {
      const fm = frontMatter(path.join(DECISIONS, f));
      if (fm.status === 'superseded') {
        expect(fm['superseded-by'], `${f} is superseded but does not say by what`).toBeTruthy();
        expect(fm['superseded-by']).not.toBe('null');
      }
    }
  });
});
