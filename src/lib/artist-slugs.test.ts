import { describe, expect, it, vi } from 'vitest';

// `slugify` is a pure function, but it lives beside the Supabase client, which
// imports `server-only` - unresolvable under vitest. Mocked so this test can
// exercise the REAL slugify rather than a copy of it: a duplicate would keep
// passing after the original changed, which is the opposite of a guard.
vi.mock('server-only', () => ({}));

import { slugify } from './artists';
import { LINEUP_NAMES } from '@/content/site';

/**
 * EVERY ACT MUST GET A WORKING URL.
 *
 * When an act confirms, its public page is `/artist/<slugify(name)>` - there is
 * no stored slug column, so the URL is derived from the name every time. That
 * makes the act's name and its URL the same fact, and a name that slugifies
 * badly is a 404 on the one day the page matters.
 *
 * `slugify` strips everything outside [a-z0-9\s-]. That is fine for the nine
 * acts on the 2026 bill, verified below - but it means a name written in
 * non-ASCII collapses. The ZAO glossary already contains such names (Huöttöja),
 * so this is not hypothetical for a future festival, and the failure is silent:
 * the row is confirmed, the API lists the act, and only the link is dead.
 *
 * Nothing has ever exercised this path, because no act has ever been confirmed.
 * The reveal will be its first real run.
 */
describe('artist page URLs', () => {
  it('gives every act on the bill a non-empty slug', () => {
    const empty = LINEUP_NAMES.filter((n) => slugify(n) === '');

    expect(
      empty,
      empty.length
        ? `\nThese acts slugify to an EMPTY string, so /artist/<slug> is a dead\n` +
            `link the moment they confirm:\n` +
            empty.map((n) => `  - ${JSON.stringify(n)}`).join('\n') +
            `\nslugify() strips everything outside a-z, 0-9, space and hyphen, so a\n` +
            `name written entirely in other characters leaves nothing behind.\n`
        : '',
    ).toEqual([]);
  });

  it('gives every act a DISTINCT slug', () => {
    const bySlug = new Map<string, string[]>();
    for (const name of LINEUP_NAMES) {
      const slug = slugify(name);
      bySlug.set(slug, [...(bySlug.get(slug) ?? []), name]);
    }
    const collisions = [...bySlug.entries()].filter(([, names]) => names.length > 1);

    expect(
      collisions,
      collisions.length
        ? `\nTwo acts share a URL. One of them would silently overwrite the other:\n` +
            collisions.map(([s, n]) => `  /artist/${s} <- ${n.join(' AND ')}`).join('\n') +
            `\n`
        : '',
    ).toEqual([]);
  });

  it('produces the URLs we expect for the 2026 bill', () => {
    // Pinned so a change to slugify() OR to the bill shows up as a diff of real
    // URLs rather than as an abstract rule change. These are the links that go
    // in posts, so a human should look at them.
    //
    // IF YOU ARE HERE AFTER ADDING OR RENAMING AN ACT: check the new slug still
    // reads like the act's name before updating this list. slugify() strips
    // everything outside a-z0-9, so accented and non-Latin names degrade
    // quietly and are NOT caught by the emptiness check above:
    //
    //   "Sigur Rós"  -> "sigur-rs"
    //   "Huöttöjä"   -> "huttj"
    //   "日本のバンド" -> ""          (this one IS caught)
    //
    // A mangled-but-non-empty slug is a working link to a page whose URL
    // misspells the artist, which is worse than a 404 because nobody reports it.
    expect(LINEUP_NAMES.map(slugify)).toEqual([
      'the-crown-vics',
      'open-x',
      'grass-rug',
      'acadia-rising',
      'michael-anderson',
      'dcoop',
      'lyons-den',
      'fellenz',
    ]);
  });
});
