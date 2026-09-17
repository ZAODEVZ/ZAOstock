import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

// THE 2026-09-17 AUDIT FINDING. The root layout (src/app/layout.tsx) sets
// `title: { default: 'ZAOstock 2026', template: '%s | ZAOstock' }`. Any page
// whose own metadata.title is a plain string ALREADY ending in "| ZAOstock"
// gets that suffix appended a second time - measured live via curl:
// /design read "Design kit | ZAOstock | ZAOstock", /backstage the same
// shape, and all eight /artist/<slug> pages read
// "<name> | ZAOstock Artist | ZAOstock". Three page files had this bug;
// this test statically scans every page.tsx in the app so the same class of
// bug cannot ship again from a fourth.
//
// Only the TOP-LEVEL metadata.title is templated - openGraph.title and
// twitter.title are separate fields Next does not template, and this repo's
// own convention is to put the fuller "<page> | ZAOstock" form there on
// purpose (see src/app/press/page.tsx). So this only checks the slice of
// each file BEFORE its first `openGraph:` key, which is where a top-level
// `title:` must live in every metadata object in this codebase.
//
// `title: { absolute: ... }` opts a page out of the parent template
// entirely (src/app/artist/[slug]/page.tsx does this on purpose, to keep
// its fuller "<name> | ZAOstock Artist" title exactly as written) - that
// pattern is exempt.

const APP_DIR = path.join(process.cwd(), 'src', 'app');

function findPageFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      // /team keeps its own internal look and metadata conventions until
      // after 3 October (DESIGN.md) - out of scope for the public site's
      // title template.
      if (entry === 'team' || entry === 'api') continue;
      findPageFiles(full, out);
    } else if (entry === 'page.tsx') {
      out.push(full);
    }
  }
  return out;
}

describe('every public page title avoids the "| ZAOstock" double-suffix', () => {
  const files = findPageFiles(APP_DIR);

  it('found more than a handful of page.tsx files (sanity check the walk itself works)', () => {
    expect(files.length).toBeGreaterThan(15);
  });

  for (const file of files) {
    const rel = path.relative(process.cwd(), file);
    it(`${rel}: top-level title, if a plain string, does not already contain "ZAOstock"`, () => {
      const src = readFileSync(file, 'utf8');
      const ogIdx = src.indexOf('openGraph:');
      const head = ogIdx === -1 ? src : src.slice(0, ogIdx);

      // `title: { absolute: ... }` or `title: { default: ... }` opts out of
      // the template on purpose - only a bare string literal is at risk.
      const titleMatch = head.match(/\btitle:\s*(['"`])((?:(?!\1).)*)\1/);
      if (!titleMatch) return; // no plain-string top-level title in this file - nothing to check
      const value = titleMatch[2];
      expect(value, `${rel} sets title: '${value}' - the root layout will append " | ZAOstock" to it`).not.toMatch(
        /ZAOstock/i,
      );
    });
  }
});
