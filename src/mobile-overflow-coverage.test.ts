import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The mobile-overflow checker's page list must cover the site's public pages.
 *
 * Context, all measured 2026-10-01:
 *   - `npm run build` prints 48 non-/api routes: 39 marked static (○),
 *     9 dynamic (ƒ).
 *   - Of the routes that answer without credentials, 37 return 200 or 308.
 *   - The checker listed 5 of them.
 *
 * So two thirds of the site had no mobile check, on the site whose first
 * brief priority is "somebody lands on a phone, on cell service". The list
 * has now been widened to all 37, and this test is what stops it narrowing
 * back: a shortened list is as silent as a deleted one, and neither fails
 * anything on its own.
 *
 * The two dynamic segment routes (/artist/[slug], /t/[tier], and friends) are
 * deliberately absent - they need a real slug, and /artist/dcoop stands in
 * for the artist family. /api/* is excluded because those are endpoints, not
 * pages, and a few of them are authenticated.
 */
const CHECK = join(process.cwd(), 'scripts', 'mobile-overflow-check.mjs');
const APP = join(process.cwd(), 'src', 'app');

const check = readFileSync(CHECK, 'utf8');
const pageList = check.match(/const PAGES = \[[\s\S]*?\];/)?.[0] ?? '';
// String.matchAll yields one array per hit whose element 0 is the WHOLE match
// and elements 1..n are the capture groups. Destructuring with a hole
// ([, path]) takes element 1, which here is the label, not the path - so the
// list silently held "home, program, artists" and every path assertion below
// failed for the wrong reason. Read index 2 explicitly.
const entries = [...pageList.matchAll(/\['([^']+)', '([^']+)'\]/g)].map(
  (m) => [m[1], m[2]] as const
);

/** Every public page route that exists as a page.tsx in the app tree. */
function pageRoutes(dir = APP, out: string[] = []): string[] {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === 'api') continue; // endpoints, not pages
      pageRoutes(full, out);
    } else if (name.name === 'page.tsx') {
      // Strip the filename, not just the APP prefix: slicing at APP.length
      // alone leaves "page.tsx" glued to the route, so /acadia comes out as
      // "/acadia/page.tsx" and every comparison below silently fails.
      const rel = full.slice(APP.length).replace(/\\/g, '/');
      const route = rel.replace(/\/?page\.tsx$/, '');
      out.push(route || '/');
    }
  }
  return out;
}

const routes = pageRoutes();
const checked = entries.map(([, path]) => path);

describe('mobile overflow page list', () => {
  it('has entries', () => {
    expect(entries.length).toBeGreaterThan(0);
    expect(pageList).not.toBe('');
  });

  it('covers every static page route in the app', () => {
    // The concrete segment routes only. [slug] routes are dynamic and need a
    // real value, so they are not in the list by design.
    const concrete = routes
      .filter((r) => !r.includes('['))
      .map((r) => (r === '/' ? '/' : r.replace(/\/$/, '')));
    const missing = concrete.filter((r) => !checked.includes(r));
    expect(missing).toEqual([]);
  });

  it('has no duplicate paths', () => {
    expect(new Set(checked).size).toBe(checked.length);
  });

  it('has no duplicate labels', () => {
    const names = entries.map(([, name]) => name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('does not cover /api routes', () => {
    // An endpoint is not a page, and several need a session. A page list that
    // grows to include them would make the job red for the wrong reason.
    expect(checked.filter((p) => p.startsWith('/api'))).toEqual([]);
  });

  it('still covers the home page and the five it always did', () => {
    // The original five, so widening cannot quietly drop the most-visited.
    for (const p of ['/', '/program', '/artists', '/artist/dcoop', '/tickets']) {
      expect(checked).toContain(p);
    }
  });

  it('is large enough to be worth running', () => {
    // A regression guard on the count, so "someone trimmed the list" fails
    // loudly rather than passing as a smaller job.
    expect(checked.length).toBeGreaterThanOrEqual(30);
  });
});
