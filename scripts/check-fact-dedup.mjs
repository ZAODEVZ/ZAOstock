#!/usr/bin/env node
/**
 * Is a festival fact being retyped instead of imported?
 *
 * WHY THIS EXISTS
 *
 * `src/content/festival.ts` is the single source of truth for facts that
 * appear on more than one page: the venue name, the date, the time window.
 * That discipline has already failed twice this way - PR #252 fixed 9 pages
 * that hand-typed the event date instead of reading `FESTIVAL.dateLabel` /
 * `FESTIVAL.shortDate`, and a second sweep on 2026-09-21 fixed more of the
 * same for venue, act-count and time literals. Both sweeps were manual and
 * after the fact - a hardcoded duplicate that drifts from the real value is
 * invisible until someone reads every page and compares.
 *
 * This script is the check that makes a third manual sweep unnecessary. It
 * reads the current fact values straight out of festival.ts's own source
 * text (never imports/evaluates it - a .mjs script has no TS loader in this
 * repo, and re-declaring the values here would just be a second place for
 * them to drift) and fails if any of them shows up as literal text on a page
 * instead of through the import.
 *
 * WHAT IT CHECKS
 *
 * - FESTIVAL.venue, .shortVenue, .dateLabel, .shortDate, .window - exact
 *   string match, case-sensitive, against every src/app/**\/*.tsx file.
 * - The act count (LINEUP_NAMES.length from site.ts) - a narrower regex for
 *   "<N> acts" / "<word> acts" / "<N> independent acts" phrasing, since the
 *   raw number alone (e.g. "8") is too common elsewhere (prices, times,
 *   spot counts) to match safely.
 *
 * WHAT IT DELIBERATELY DOES NOT CHECK
 *
 * FESTIVAL.city ("Ellsworth, Maine") is excluded on purpose - it is
 * ordinary descriptive prose that shows up correctly in headings and copy
 * all over the site without ever being "the same duplicated fact" in the
 * sense #252 and this check care about, and including it would produce
 * far more noise than signal.
 *
 * Comment lines are stripped before matching (same reasoning as
 * tickets.test.ts's `code()` helper: a comment may legitimately name a
 * price or a date while explaining itself; rendered copy may not), so this
 * only fires on text that would actually reach a visitor.
 *
 * USAGE
 *
 *   node scripts/check-fact-dedup.mjs
 *   npm run check:facts
 *
 * Exits 1 and prints file:line + the literal found + which constant to
 * import instead, for every hit. Exits 0 with a one-line confirmation if
 * clean.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'src/app');
const FESTIVAL_TS = path.join(ROOT, 'src/content/festival.ts');
const SITE_TS = path.join(ROOT, 'src/content/site.ts');

// EVERY fact this check exists to protect is a top-level key of the FESTIVAL
// literal object, and each is a required field of the `Festival` type above
// it. A fact that extracts to nothing is not a fact to skip quietly: it is
// this check having lost its own input, and the only correct response is to
// fail loudly rather than report a PASS that enforces nothing.
const REQUIRED_FACTS = [
  { name: 'FESTIVAL.venue', key: 'venue', suggest: 'FESTIVAL.venue' },
  { name: 'FESTIVAL.shortVenue', key: 'shortVenue', suggest: 'FESTIVAL.shortVenue' },
  { name: 'FESTIVAL.dateLabel', key: 'dateLabel', suggest: 'FESTIVAL.dateLabel' },
  { name: 'FESTIVAL.shortDate', key: 'shortDate', suggest: 'FESTIVAL.shortDate' },
  { name: 'FESTIVAL.window', key: 'window', suggest: 'FESTIVAL.window' },
];

// A single-quoted value is what this regex was written against, and it stopped
// matching the moment any of these keys was reformatted to double quotes -
// which is what `eslint --fix` does to a file it touches. The check then
// reported "clean" while enforcing nothing, and nothing in the output said so
// beyond a fact count nobody reads. Match both quote styles, and count the
// LINEUP_NAMES entries the same way, so coverage cannot depend on a
// formatting choice.
// Exported so check-fact-dedup.test.ts can pin its quote-style behaviour
// directly. Same guarded-import pattern as stripComments below: the export
// costs the running script nothing and the regression suite gains the one
// thing that made this check unable to fail.
export function extractField(source, key) {
  for (const m of source.matchAll(new RegExp(`\\b${key}:\\s*(?:'([^']*)'|"([^"]*)")`, 'g'))) {
    // Group 1 is a single-quoted body, group 2 a double-quoted one.
    if (m[1] !== undefined) return m[1];
    if (m[2] !== undefined) return m[2];
  }
  return null;
}

function loadFacts() {
  const festivalSrc = readFileSync(FESTIVAL_TS, 'utf8');
  const missing = [];
  const facts = REQUIRED_FACTS.map(({ name, key, suggest }) => {
    const value = extractField(festivalSrc, key);
    if (value === null) missing.push(name);
    return { name, value, suggest };
  }).filter((f) => f.value);

  // The next edition (ZAOstock 2027). NEXT_EDITION sits AFTER FESTIVAL in the
  // same file, and extractField() returns the FIRST match, so read its own
  // block rather than the whole source or this would re-find FESTIVAL's value.
  // Missing means this check lost its input: fail closed, like the others.
  const nextStart = festivalSrc.indexOf('export const NEXT_EDITION');
  const nextDate = nextStart === -1 ? null : extractField(festivalSrc.slice(nextStart), 'dateLabel');
  if (nextDate === null) missing.push('NEXT_EDITION.dateLabel');
  else facts.push({ name: 'NEXT_EDITION.dateLabel', value: nextDate, suggest: 'NEXT_EDITION.dateLabel (or nextEditionLine())' });

  // Act count: LINEUP_NAMES is a readonly string[] literal in site.ts - count
  // its entries by counting quoted strings inside the array literal, not by
  // importing/evaluating the module.
  const siteSrc = readFileSync(SITE_TS, 'utf8');
  const lineupMatch = siteSrc.match(/export const LINEUP_NAMES:[^=]*=\s*\[([\s\S]*?)\];/);
  if (lineupMatch) {
    const count = (lineupMatch[1].match(RE_QUOTED_ENTRY) || []).length;
    if (count > 0) facts.push({ name: 'act count', value: count, suggest: 'LINEUP_NAMES.length', isActCount: true });
  } else {
    missing.push('LINEUP_NAMES (act count)');
  }

  // Fail closed. A partial fact list makes every later "clean" message a lie
  // about coverage: the check would be auditing 1 fact and printing the same
  // PASS as a run that audited 6, with no line in the output to tell them
  // apart. Refusing to certify is the only honest option.
  if (missing.length > 0) {
    return { facts, missing };
  }
  return { facts, missing: null };
}

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

// Counts the entries of a string[] literal regardless of which quote style
// each one is written in, for the same reason extractField() accepts both.
const RE_QUOTED_ENTRY = /'[^']*'|"[^"]*"/g;

function actCountPattern(count) {
  const word = NUMBER_WORDS[count];
  const alt = word ? `${count}|${word}` : `${count}`;
  // "8 acts", "eight acts", "8 independent acts", case-insensitive.
  return new RegExp(`\\b(${alt})\\s+(independent\\s+)?acts?\\b`, 'i');
}

/** Strip comment-only lines so a comment naming a fact for its own sake
 * (like this file's own header) doesn't count as rendered copy. Mirrors
 * tickets.test.ts's code() helper.
 *
 * A per-line prefix check (does the trimmed line start with `//`, `*` or
 * `/*`) is not enough for a JSX comment: `{/* ... *\/}` opens with `{/*`,
 * not `/*`, and this codebase's own convention (see ellsworth/page.tsx,
 * program/page.tsx) wraps its continuation lines as plain indented prose
 * with no per-line marker at all - so only the opening line was ever
 * caught. Found 2026-09-27 when an explanatory multi-line JSX comment
 * naming the act count tripped this check; several already-merged JSX
 * comments in this exact style had been silently unstripped before that,
 * just without a flagged phrase in their continuation lines to expose it.
 * Track open/close state instead, so everything between `{/*` and `*\/}`
 * is dropped regardless of how each continuation line is written. */
export function stripComments(text) {
  const lines = [];
  let inJsxComment = false;
  for (const l of text.split('\n')) {
    const t = l.trim();
    if (inJsxComment) {
      const end = t.indexOf('*/');
      if (end === -1) continue;
      inJsxComment = false;
      // The comment closes mid-line - keep whatever follows `*/`, rather
      // than dropping the whole line. Found 2026-09-27 (Dotfiles, reviewing
      // #356): `*/} <Button href="/tickets">` on one line silently lost the
      // Button entirely, which is exactly the rendered-copy case this check
      // exists to catch.
      const rest = t.slice(end + 2).trim();
      if (rest) lines.push(rest);
      continue;
    }
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) continue;
    if (t.startsWith('{/*')) {
      const end = t.indexOf('*/');
      if (end === -1) {
        inJsxComment = true;
      } else {
        const rest = t.slice(end + 2).trim();
        if (rest) lines.push(rest);
      }
      continue;
    }
    lines.push(l);
  }
  return lines.join('\n');
}

// src/app/error.tsx: the root error boundary, deliberately dependency-free
// and client-only (see its own header comment) so the fallback page can't
// break if festival.ts ever does. Its venue mention is a one-time, hand-
// verified exception, not something this check should chase.
const EXCLUDED_FILES = new Set(['src/app/error.tsx']);

function walkTsxFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...walkTsxFiles(full));
    } else if (entry.endsWith('.tsx') && !entry.endsWith('.test.tsx')) {
      out.push(full);
    }
  }
  return out;
}

function lineNumberOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

function main() {
  const { facts, missing } = loadFacts();
  const files = walkTsxFiles(APP_DIR);
  const hits = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    if (EXCLUDED_FILES.has(rel)) continue;
    const raw = readFileSync(file, 'utf8');
    const stripped = stripComments(raw);

    for (const fact of facts) {
      if (fact.isActCount) {
        const pattern = actCountPattern(fact.value);
        const m = pattern.exec(stripped);
        if (m) {
          hits.push({ rel, line: lineNumberOf(stripped, m.index), literal: m[0], fact });
        }
        continue;
      }
      const idx = stripped.indexOf(fact.value);
      if (idx !== -1) {
        hits.push({ rel, line: lineNumberOf(stripped, idx), literal: fact.value, fact });
      }
    }
  }

  // Coverage is a precondition, not a footnote. Report the lost facts first,
  // whatever the scan found, because a hit list from a partial fact list is
  // not the whole truth and a reader needs both halves of it.
  if (missing) {
    console.error(`check:facts - could not read ${missing.length} of ${REQUIRED_FACTS.length + 2} known facts from festival.ts/site.ts:`);
    for (const name of missing) console.error(`  ${name}`);
    console.error('\nThis check has lost its own input, so it cannot certify anything.');
    console.error('Its extraction is a regex over the source text of festival.ts/site.ts, so any');
    console.error('change to how those literals are written - a quote style, a reformat, a rename -');
    console.error('silently reduces what it enforces. Fix the literals, or teach the extraction to');
    console.error('read the new shape. Do not delete a fact from REQUIRED_FACTS to make this pass.');
    if (hits.length === 0) {
      console.error('\n(The scan below found no duplicates, but with facts missing that is not a clean bill of health.)');
      console.error('\nOVERALL VERDICT: UNKNOWN');
      process.exit(2);
    }
    console.error(`\nIt did still find ${hits.length} duplicate(s), listed below.`);
  }

  if (hits.length === 0) {
    console.log(`check:facts - clean. Checked ${files.length} files against ${facts.length} known facts from festival.ts/site.ts.`);
    process.exit(0);
  }

  console.error(`check:facts - found ${hits.length} hardcoded fact(s) duplicating festival.ts/site.ts:\n`);
  for (const h of hits) {
    console.error(`  ${h.rel}:${h.line}`);
    console.error(`    literal: "${h.literal}"`);
    console.error(`    use ${h.fact.suggest} instead (imported from '@/content/festival'${h.fact.isActCount ? " or '@/content/site'" : ''})\n`);
  }
  console.error('If this is a legitimate new match (not a duplicate), update the exclusion in scripts/check-fact-dedup.mjs with a comment explaining why.');
  process.exit(1);
}

// Run only when executed directly, not when imported (a vitest test imports
// stripComments from this module; without this guard, that import would run
// main()'s own process.exit() and kill the test runner). Same pattern as
// #325/#358: import.meta.url percent-encodes and process.argv[1] does not,
// so a raw string compare breaks on a path containing a space.
if (process.argv[1] && path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1])) main();
