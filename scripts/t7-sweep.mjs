#!/usr/bin/env node
/**
 * T-7 sweep - Sat 26 Sept, one command, a re-run not a rebuild.
 *
 * WHY THIS EXISTS. week-review-2026-09-19.md item 4: every public route
 * and all eight artist pages, every link resolved, and the date/time/place
 * strings checked against the run sheet - written as a script now so
 * Saturday is running it, not writing it.
 *
 * Includes a CONTROL: a deliberately broken URL this sweep must catch
 * before it is allowed to report the real site clean. A sweep that finds
 * nothing wrong is indistinguishable from a broken sweep unless something
 * proves it CAN find a broken thing - the surface-cannot-report-state shape
 * MISTAKES.md logged 13 times in the three days before this was written.
 *
 * FACT_CHECKS below are hand-verified live and against
 * docs/plans/run-sheet-2026-10-03.md on 2026-09-19, the same way the
 * day-262-prep-kit measurement verified its claims - not read from
 * site.ts programmatically, since this runs as a plain Node script outside
 * the Next app. Re-verify both lists (ROUTES and FACT_CHECKS) against
 * src/app/sitemap.ts and site.ts before Saturday if either changed this
 * week.
 *
 * USAGE
 *   node scripts/t7-sweep.mjs               # against production
 *   BASE=http://localhost:3000 node scripts/t7-sweep.mjs
 *
 * Exit 0 = clean AND the control fired. Exit 1 = a real finding, OR the
 * control did not fire - that second case means the sweep itself is
 * broken, and is reported exactly as loudly as a real failure, never as a
 * quiet pass.
 */

const BASE = (process.env.BASE || 'https://zaostock.com').replace(/\/$/, '');

const ARTIST_SLUGS = [
  'the-crown-vics', 'open-x', 'grass-rug', 'acadia-rising',
  'michael-anderson', 'dcoop', 'lyonsden', 'tom-fellenz',
];

// Mirrors src/app/sitemap.ts's static list.
const STATIC_ROUTES = [
  '', '/musicians', '/musicians/rider', '/artists', '/live', '/event-organizers',
  '/apply', '/suggest', '/donate', '/tickets', '/program', '/ellsworth', '/acadia',
  '/festivals', '/sponsor', '/partners', '/build', '/meetings', '/onepagers/overview',
  '/zaoville', '/privacy', '/press', '/design',
];

const ROUTES = [...STATIC_ROUTES, ...ARTIST_SLUGS.map((s) => `/artist/${s}`)];

const FACT_CHECKS = [
  { path: '/', mustContain: ['Saturday 3 October', 'Franklin Street Parklet', 'Ellsworth'] },
  { path: '/program', mustContain: ['Franklin Street Parklet', 'Noon to six'] },
  { path: '/ellsworth', mustContain: ['Franklin Street Parklet'] },
];

const CONTROL_PATH = '/t7-sweep-control-this-must-404';

async function fetchPage(path) {
  return fetch(`${BASE}${path}`, { redirect: 'manual' });
}

function extractInternalLinks(html) {
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  const internal = new Set();
  for (const href of hrefs) {
    if (href.startsWith('/') && !href.startsWith('//')) {
      internal.add(href.split('#')[0]);
    } else if (href.startsWith(BASE)) {
      internal.add(href.slice(BASE.length).split('#')[0] || '/');
    }
  }
  return [...internal].filter(Boolean);
}

async function main() {
  const findings = [];
  const linkCache = new Map();

  async function checkLink(path) {
    if (linkCache.has(path)) return linkCache.get(path);
    const res = await fetchPage(path);
    // A 3xx redirect counts as resolving - several routes here are
    // deliberately temporary redirects (next.config.ts), not dead links.
    const ok = res.status >= 200 && res.status < 400;
    linkCache.set(path, ok);
    return ok;
  }

  console.log(`T-7 sweep against ${BASE}\n`);

  const controlOk = await checkLink(CONTROL_PATH);
  if (controlOk) {
    console.error(`CONTROL FAILED: ${CONTROL_PATH} returned a success/redirect status. The sweep cannot be trusted this run - fix the sweep before reading anything else it says.`);
    process.exit(1);
  }
  console.log(`Control OK: ${CONTROL_PATH} correctly detected as broken.\n`);

  for (const path of ROUTES) {
    const res = await fetchPage(path);
    if (res.status !== 200) {
      findings.push(`${path} -> ${res.status} (expected 200)`);
      continue;
    }
    const html = await res.text();
    for (const link of extractInternalLinks(html)) {
      if (!(await checkLink(link))) findings.push(`${path} links to ${link}, which does not resolve`);
    }
  }

  for (const { path, mustContain } of FACT_CHECKS) {
    const res = await fetchPage(path);
    const html = res.status === 200 ? await res.text() : '';
    for (const phrase of mustContain) {
      if (!html.includes(phrase)) findings.push(`${path} is missing expected text: "${phrase}"`);
    }
  }

  console.log(`Routes checked: ${ROUTES.length}. Findings: ${findings.length}.\n`);
  if (findings.length) {
    for (const f of findings) console.log(`  - ${f}`);
    process.exit(1);
  }
  console.log('Clean.');
}

main();
