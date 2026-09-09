import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * RE-CHECK DATES, ENFORCED - not tabled.
 *
 * WHY THIS EXISTS
 * On 2026-09-08 five separate records across the estate were found still
 * asserting things that had stopped being true: a service recorded as down that
 * had been up six days, an application drafted against a closed cycle, doc
 * summaries contradicting their own bodies. In this repo the same shape sat in
 * ARCHITECTURE.md, which warned that a lookup "could not be checked" long after
 * both endpoints started answering 200.
 *
 * A record that stops being true does not go quiet. It stays loud, in confident
 * formatting, and the next reader acts on it.
 *
 * THE RULE
 * Any claim about an external service, a deadline, a quota or a cycle carries
 * `<!-- re-check: YYYY-MM-DD -->` next to it. Past that date this test FAILS,
 * which forces someone to re-verify and either correct the claim or move the
 * date forward with fresh evidence.
 *
 * A failing build is the point. The alternative - a table of dates somebody is
 * supposed to read - is what already failed five times in one day.
 */

const RECHECK = /<!--\s*re-check:\s*(\d{4}-\d{2}-\d{2})\s*-->/g;
const SEARCH_DIRS = ['docs', 'src'];
const SKIP = new Set(['node_modules', '.next', 'dist', '.git']);

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[];
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

/** Every re-check marker in the repo, with where it came from. */
function markers(): { file: string; date: string; line: number }[] {
  const found: { file: string; date: string; line: number }[] = [];
  for (const dir of SEARCH_DIRS) {
    for (const file of walk(dir)) {
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((text, i) => {
        for (const m of text.matchAll(RECHECK)) {
          found.push({ file, date: m[1], line: i + 1 });
        }
      });
    }
  }
  return found;
}

/** Today in the festival's own timezone, not the runner's. */
function today(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

describe('re-check dates', () => {
  it('has at least one, so the convention cannot quietly disappear', () => {
    // If this fails, someone deleted every marker. That is not "clean" - it is
    // the guard being removed, which is how the convention dies.
    expect(markers().length).toBeGreaterThan(0);
  });

  it('has none that have passed', () => {
    const now = today();
    const stale = markers().filter((m) => m.date < now);

    // The message has to say what to DO, because whoever hits this did not
    // write the claim and has no idea what it was about.
    const detail = stale
      .map(
        (m) =>
          `  ${m.file}:${m.line} - re-check was due ${m.date}\n` +
          `      Re-verify the claim next to it. Then either correct it, or move\n` +
          `      the date forward WITH the evidence that it still holds.`,
      )
      .join('\n');

    expect(
      stale.length,
      stale.length
        ? `\n${stale.length} claim(s) are past their re-check date as of ${now}:\n${detail}\n\n` +
            `Do not just bump the date. The point is the re-verification.\n`
        : '',
    ).toBe(0);
  });

  it('uses real dates', () => {
    for (const m of markers()) {
      expect(Number.isNaN(Date.parse(m.date)), `${m.file}:${m.line} has an unparseable date`).toBe(
        false,
      );
    }
  });
});
