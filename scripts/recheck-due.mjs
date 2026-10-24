#!/usr/bin/env node
/**
 * RE-CHECK DATES DUE SOON, listed before they fail a PR.
 *
 * WHY THIS EXISTS
 * src/content/recheck.test.ts fails every build once a `<!-- re-check: YYYY-MM-DD -->`
 * marker is past its date. That is the point, but on 2026-10-22 an expired marker
 * failed #480, #481 and #482 at once: the test worked, and nobody owned the marker
 * until an unrelated PR tripped it (card 10545). This lists the markers coming due
 * within the next N days (default 7), so the zaostock lane re-verifies them first.
 *
 * Same regex, same directories and the same New York "today" as the test, so the
 * two cannot disagree about which markers exist.
 *
 * Exit codes:
 *   0  nothing due within the window (and nothing already past)
 *   1  at least one marker is due within the window or already past
 *   2  no markers found at all - the scan could not see the convention, which is
 *      not "nothing due"
 *
 * Usage: node scripts/recheck-due.mjs [--days N]
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

export const RECHECK = /<!--\s*re-check:\s*(\d{4}-\d{2}-\d{2})\s*-->/g;
export const SEARCH_DIRS = ['docs', 'src'];
const SKIP = new Set(['node_modules', '.next', 'dist', '.git']);

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(md|ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

/** Every re-check marker under `dirs`, with where it came from. */
export function markers(dirs = SEARCH_DIRS) {
  const found = [];
  for (const dir of dirs) {
    for (const file of walk(dir)) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((text, i) => {
          for (const m of text.matchAll(RECHECK)) found.push({ file, date: m[1], line: i + 1 });
        });
    }
  }
  return found;
}

/** Today in the festival's own timezone, not the runner's (as the test does). */
export function today(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** YYYY-MM-DD plus `days`, in plain calendar arithmetic. */
export function addDays(ymd, days) {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Markers past their date, and markers due on or before `now + days`.
 * Sorted by date, so the listing reads soonest first.
 */
export function dueWithin(found, now, days) {
  const until = addDays(now, days);
  const byDate = (a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
  return {
    until,
    past: found.filter((m) => m.date < now).sort(byDate),
    soon: found.filter((m) => m.date >= now && m.date <= until).sort(byDate),
  };
}

function main(argv) {
  const i = argv.indexOf('--days');
  const days = i >= 0 ? Number(argv[i + 1]) : 7;
  if (!Number.isInteger(days) || days < 0) {
    console.error('--days takes a whole number of days, 0 or more');
    return 2;
  }
  const found = markers();
  if (found.length === 0) {
    console.log('UNKNOWN: 0 re-check markers found under docs/ and src/. Run from the repo root.');
    return 2;
  }
  const now = today();
  const { until, past, soon } = dueWithin(found, now, days);
  console.log(`${found.length} re-check marker(s); today ${now} (America/New_York), window to ${until}.`);
  for (const m of past) console.log(`PAST  ${m.date}  ${m.file}:${m.line}`);
  for (const m of soon) console.log(`DUE   ${m.date}  ${m.file}:${m.line}`);
  if (past.length + soon.length === 0) {
    console.log(`Nothing due within ${days} day(s).`);
    return 0;
  }
  console.log(
    `${past.length} past, ${soon.length} due within ${days} day(s). Re-verify each claim, then` +
      ' correct it or move its date forward with the evidence.',
  );
  return 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exit(main(process.argv.slice(2)));
}
