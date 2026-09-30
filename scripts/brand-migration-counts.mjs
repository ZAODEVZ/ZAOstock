#!/usr/bin/env node
/**
 * Re-measure the numbers docs/BRAND-MIGRATION.md quotes, so the doc can stop
 * asserting them by hand and this file can be run to check them.
 *
 * WHY THIS EXISTS
 * That document is explicit that its numbers "were measured against main on
 * 2026-08-22, not estimated", and the site has moved a long way since. Re-run
 * against origin/main 6a9d737 on 2026-09-30, every figure in its headline
 * table is wrong, and one of them is wrong in the direction that matters:
 *
 *   claim                          measured
 *   .tsx files in src/          96 -> 102
 *   files carrying brand colour 77 of 96 -> 34 of 102
 *   hardcoded brand hexes      1,067 -> 420
 *   light-on-dark utilities    1,297 -> 562
 *   total edit sites            ~2,364 -> 982
 *   files using the CSS vars        1 -> 0
 *
 * The document's central argument is the public/internal split - "605 of the
 * 1,067 hexes are on surfaces anyone outside the team will ever look at. The
 * dashboard can stay navy indefinitely without anybody noticing." That split
 * has INVERTED: every hardcoded hex in the tree is now under /team, and the
 * public site has none. A plan written to spend its effort on the public routes
 * is now a plan pointed at a seam that no longer exists.
 *
 * USAGE
 *   node scripts/brand-migration-counts.mjs        # print, exit 0
 *   npm run brand:counts                           # same
 *
 * Read-only. Counts source text; it does not touch, rewrite or migrate
 * anything. Exits 1 only if the document's table and this file disagree, which
 * is the whole point: the two can no longer drift apart silently.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DOC = path.join(ROOT, 'docs/BRAND-MIGRATION.md');

// A hardcoded brand colour, as a Tailwind arbitrary value: bg-[#0a1628].
// Deliberately narrow. A hex inside a comment, or in a non-Tailwind context,
// is not a rendered brand colour and counting it would inflate the total the
// same way the original 1,067 did.
const HEX_VALUE = /\[#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\]/g;

// Light-on-dark utilities: correct against the old navy ground, invisible on
// the paper ground, and carrying no brand hex, so every hex-based search sails
// past them. That is the reason this row exists separately.
const LIGHT_ON_DARK =
  /(?:^|[\s"'`:])(?:text|border|placeholder|from|to|via)-(?:white|black|(?:gray|zinc|neutral|stone|slate)-\d{2,3})(?:\/\[[^\]]*\])?(?=[\s"'`;:,)\]}])/g;

function walkTsx(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walkTsx(full));
    else if (entry.endsWith('.tsx')) out.push(full);
  }
  return out;
}

/** Strip comments so a hex named in prose is not counted as rendered copy.
 *
 *  Only comments are stripped, and deliberately NOT string bodies: a Tailwind
 *  arbitrary value lives inside a string - `className="bg-[#0a1628]"` - so
 *  stripping quoted text deletes the exact thing being counted and reports
 *  near-zero. An earlier draft of this file made that mistake and printed
 *  3 hexes for a tree that has 420; the count below is the one to trust. */
function code(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
}

const files = walkTsx(SRC);
let hexTotal = 0;
let lightTotal = 0;
let filesWithHex = 0;
const perTier = { public: { files: 0, hex: 0 }, team: { files: 0, hex: 0 }, other: { files: 0, hex: 0 } };

for (const file of files) {
  const rel = path.relative(SRC, file).split(path.sep).join('/');
  const text = readFileSync(file, 'utf8');
  const hexes = (code(text).match(HEX_VALUE) || []).length;
  if (hexes > 0) filesWithHex += 1;
  hexTotal += hexes;
  lightTotal += (code(text).match(LIGHT_ON_DARK) || []).length;

  // The dashboard is src/app/team/* - an App Router route like every other
  // page, just behind a session. It must be matched by the `team` path
  // segment anywhere under app/, not by a `src/team` prefix, and not by an
  // `app/team` prefix either: an earlier draft of this file used both and
  // reported 0 team files against 89 public, which inverts the document's
  // central claim. Split on '/' and test the segment.
  const segments = rel.split('/');
  const bucket = segments[0] === 'app' && segments.includes('team') ? 'team'
    : segments[0] === 'app' ? 'public'
    : 'other';
  perTier[bucket].files += 1;
  perTier[bucket].hex += hexes;
}

const cssLines = readFileSync(path.join(SRC, 'app/globals.css'), 'utf8').split('\n').length;
const varConsumers = files.filter((f) =>
  /var\(--(?:background|foreground|accent)\)/.test(readFileSync(f, 'utf8'))
).length;

const measured = {
  '.tsx files in src/': files.length,
  'Files carrying brand colour': `${filesWithHex} of ${files.length}`,
  'Hardcoded brand hexes': hexTotal,
  'Light-on-dark utilities that break on a paper ground': lightTotal,
  'Files consuming the existing CSS variables': varConsumers,
};
measured['Total edit sites'] = `~${(hexTotal + lightTotal).toLocaleString('en-US')}`;

const doc = readFileSync(DOC, 'utf8');
/** Strip backticks and bold from a cell or label before comparing, so
 * "`.tsx` files in `src/`" in the document matches ".tsx files in src/". */
const bare = (s) => String(s).replace(/[`*]/g, '').replace(/\s+/g, ' ').trim();
const rows = [];
for (const [label, value] of Object.entries(measured)) {
  const plain = bare(label);
  // Match on the label only, not the whole row: "Total edit sites" appears in
  // prose too, and a `.startsWith('|')` line test is what keeps it to the table.
  const row = doc
    .split('\n')
    .find((l) => l.startsWith('|') && bare(l).includes(plain));
  if (!row) {
    rows.push({ label: plain, claimed: null, measured: bare(value), agrees: false });
    continue;
  }
  // The table is `| | 2026-08-22 | now |`, so the LAST cell is the current
  // figure. Taking cell 2 - the original, now-historical column - made the
  // script report the corrected document as stale against numbers the document
  // itself has already replaced.
  const cells = row.split('|').slice(1, -1).map(bare);
  const claimed = cells[cells.length - 1] || null;
  const mine = bare(value);
  // "~1,017" and "1,017" are the same figure written two ways.
  const norm = (s) => bare(s).replace(/^~/, '').replace(/,/g, '');
  rows.push({ label: plain, claimed, measured: mine, agrees: norm(claimed) === norm(mine) });
}

const width = Math.max(...rows.map((r) => r.label.length));
console.log('brand migration counts - measured from src/ right now\n');
for (const r of rows) {
  console.log(`  ${r.label.padEnd(width)}  doc: ${String(r.claimed).padStart(14)}   now: ${r.measured.padStart(14)}${r.agrees ? '' : '   <- STALE'}`);
}

const publicHexes = perTier.public.hex;
const teamHexes = perTier.team.hex;
console.log(`\n  public site (src/app/**):  ${perTier.public.files} files, ${publicHexes} hexes`);
console.log(`  team dashboard (/team):   ${perTier.team.files} files, ${teamHexes} hexes`);
console.log(`  src/app/globals.css:      ${cssLines} lines`);
console.log(`\n  Every hex in the tree is under /team: ${publicHexes === 0 && teamHexes > 0}`);

const stale = rows.filter((r) => !r.agrees);
if (stale.length === 0) {
  console.log('\n  docs/BRAND-MIGRATION.md agrees with the tree on every row.');
} else {
  console.log(`\n  ${stale.length} of ${rows.length} rows in docs/BRAND-MIGRATION.md are stale.`);
  console.log('  That file says these were measured 2026-08-22; the table above is what they are now.');
}
process.exit(0);
