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

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'src/app');
const FESTIVAL_TS = path.join(ROOT, 'src/content/festival.ts');
const SITE_TS = path.join(ROOT, 'src/content/site.ts');

function extractField(source, key) {
  const m = source.match(new RegExp(`\\b${key}:\\s*'([^']+)'`));
  return m ? m[1] : null;
}

function loadFacts() {
  const festivalSrc = readFileSync(FESTIVAL_TS, 'utf8');
  const facts = [
    { name: 'FESTIVAL.venue', value: extractField(festivalSrc, 'venue'), suggest: 'FESTIVAL.venue' },
    { name: 'FESTIVAL.shortVenue', value: extractField(festivalSrc, 'shortVenue'), suggest: 'FESTIVAL.shortVenue' },
    { name: 'FESTIVAL.dateLabel', value: extractField(festivalSrc, 'dateLabel'), suggest: 'FESTIVAL.dateLabel' },
    { name: 'FESTIVAL.shortDate', value: extractField(festivalSrc, 'shortDate'), suggest: 'FESTIVAL.shortDate' },
    { name: 'FESTIVAL.window', value: extractField(festivalSrc, 'window'), suggest: 'FESTIVAL.window' },
  ].filter((f) => f.value);

  // Act count: LINEUP_NAMES is a readonly string[] literal in site.ts - count
  // its entries by counting quoted strings inside the array literal, not by
  // importing/evaluating the module.
  const siteSrc = readFileSync(SITE_TS, 'utf8');
  const lineupMatch = siteSrc.match(/export const LINEUP_NAMES:[^=]*=\s*\[([\s\S]*?)\];/);
  if (lineupMatch) {
    const count = (lineupMatch[1].match(/'[^']*'/g) || []).length;
    if (count > 0) facts.push({ name: 'act count', value: count, suggest: 'LINEUP_NAMES.length', isActCount: true });
  }
  return facts;
}

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

function actCountPattern(count) {
  const word = NUMBER_WORDS[count];
  const alt = word ? `${count}|${word}` : `${count}`;
  // "8 acts", "eight acts", "8 independent acts", case-insensitive.
  return new RegExp(`\\b(${alt})\\s+(independent\\s+)?acts?\\b`, 'i');
}

/** Strip comment-only lines so a comment naming a fact for its own sake
 * (like this file's own header) doesn't count as rendered copy. Mirrors
 * tickets.test.ts's code() helper. */
function stripComments(text) {
  return text
    .split('\n')
    .filter((l) => {
      const t = l.trim();
      return !t.startsWith('//') && !t.startsWith('*') && !t.startsWith('/*');
    })
    .join('\n');
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
  const facts = loadFacts();
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

main();
