# Brand migration: what moving to ZAOstock 26 actually costs

**Status: mostly done. The cost is now small and the remaining work is
internal.** Whether the last of it happens before or after the lineup
announcement is Zaal's call.

Candy's package landed in PR #42 (`docs/brand/README.md`). Her README is explicit
that the retro-poster identity **replaces** the Midnight Navy / Festival Yellow
look rather than sitting alongside it, and that a page carrying half of each reads
as a mistake rather than a transition.

> **These numbers are now generated, not typed.** Every figure below comes from
> [`scripts/brand-migration-counts.mjs`](../scripts/brand-migration-counts.mjs):
>
> ```bash
> npm run brand:counts
> ```
>
> The table was first measured by hand on 2026-08-22 and then left alone while
> the site moved. It was wrong in a way that inverted this document's central
> claim (see "What changed since 2026-08-22" below). It is now re-runnable so it
> cannot go stale silently again. If you edit a number here, re-run the script
> and paste what it prints.

---

## The headline

**This was not a colour swap. It was a polarity inversion, and the codebase had
no token layer to absorb it.** Most of that is now behind us.

| | Measured 2026-08-22 | Measured now |
|---|---|---|
| `.tsx` files in `src/` | 96 | 102 |
| Files carrying brand colour | 77 of 96 | **34 of 102** |
| Hardcoded brand hexes | 1,067 | **420** |
| Light-on-dark utilities that break on a paper ground | 1,297 | **597** |
| **Total edit sites** | ~2,364 | **~1,017** |
| Files consuming the existing CSS variables | 1 | 0 |

The old identity was dark: navy ground, light text. The new one is light: paper
ground, ink text. Those are not two palettes, they are opposite polarities, and
the second number above is the one that a naive plan misses.

### Why a find-and-replace does not work

Substituting the four hexes gets you a paper-coloured page with 597 pieces of
white and light-grey text on it. `text-white`, `text-gray-400`, and
`border-white/[0.08]` were all correct against navy and are invisible or
near-invisible against `#F2E6D3`. They carry no brand hex, so every hex-based
search-and-replace, codemod, or `sed` script sails straight past them.

```
101  text-white
139  text-gray-500
 62  text-gray-400
 15  text-gray-300
 18  text-black
...  and the border-white alpha variants
```

A migration that fixes colours and not polarity produces a site that looks broken
in a way that is tedious rather than obvious to find: it renders, it deploys, and
you discover it one component at a time.

### Why there is no shortcut through tokens

This is the one part of the original argument that is now out of date in the
other direction. `src/app/globals.css` was nine lines when this was written; it
is now a full Tailwind v4 `@theme` block defining the paper / ink / red / gold /
denim ramps, and the public site consumes them by name (`bg-paper`,
`text-ink-950`) rather than by hex. `npm run brand:counts` prints the line count.

The three original variables --background, --foreground, --accent -- now have
**zero** consumers, where the hand count said one. The indirection layer this
document called the blocker exists. That is the single biggest change since
2026-08-22 and it is why the remaining cost below is a fraction of the
estimate.

---

## Where the work is

**This is the finding that matters most, and it is the opposite of what this
document said when it was written.** The public/internal split did not just
shift - it inverted.

| Surface | Files | Hexes | Notes |
|---|---|---|---|
| **Public site** (`src/app/**`, outside `/team`) | 47 | **0** | On tokens by name. Nothing left to migrate |
| **Team dashboard** (`src/app/team/*`) | 42 | **420** | Internal. Nobody outside the team sees it |
| Other brand surfaces | - | - | `src/app/icon.svg`, `src/app/opengraph-image.tsx` |

The original claim was "605 of the 1,067 hexes are on surfaces anyone outside
the team will ever look at. The dashboard can stay navy indefinitely without
anybody noticing, and nothing about the announcement depends on it." Every one of
those 420 hexes is now under `src/app/team/`. The public site has **zero**.

Heaviest single files, all of them internal: `team/ArtistPipeline.tsx` (43),
`team/SponsorCRM.tsx` (37), `team/QuickAdd.tsx` (25), `team/TeamRoles.tsx` (24),
`team/BioEditor.tsx` (24).

So the seam this document was built around is now the other way round: the
public site is done, and the only remaining brand debt is on a surface with no
external audience. That makes the decision much easier than it looked on
2026-08-22 - it is now a "do it when someone is already in that file" item
rather than a launch risk.

---

## The plan, in the order it should happen

**Status of each phase as of 2026-09-30, measured by `npm run brand:counts`.**

### Phase 0 - build the token layer (2-3 hours, do this regardless) - DONE

Expand `globals.css` from Candy's `tokens.reference.css` into a real token set:
the full red / gold / denim / olive ramps, plus `--paper-100`, `--paper-200`,
`--ink-950`. Map them to Tailwind v4's `@theme` so components can say
`bg-paper` and `text-ink` instead of a hex.

**This is independently worth doing.** It is the difference between the next
brand change costing 1,017 edits and costing one file. It shipped, and the
proof that it shipped is the number that dropped from 605 public hexes to zero.

### Phase 1 - one page, end to end (half a day) - DONE

Migrate `/program` completely and look at it.

The purpose was to find out what Phase 2 actually costs per page, from one real
data point rather than from this document's arithmetic.

### Phase 2 - the public site (the bulk) - DONE

The remaining public routes, in descending order of who sees them.

Per page: swap ground and text polarity, replace the accent, re-check every
border and hover state, verify contrast on paper. **Budget on the polarity work,
not the hexes** - the hexes are the fast part.

Result: zero hardcoded hexes remain outside `src/app/team/`.

### Phase 3 - the dashboard, or never - THE ONLY THING LEFT

420 hexes across 42 files for a surface with no external audience. Legitimate
outcomes include "do it later", "do it never", and "do it when someone is already
in that file". It should not gate the announcement, and now it demonstrably
cannot: the public site it was blocking is finished.

### Phase 4 - the marks and the metadata

`opengraph-image.tsx`, `icon.svg`, and the badge itself. The badge PNGs are
already committed by PR #42. Note there is no favicon or manifest PNG in
`public/` today, so the badge gives us one for free if someone wants it.

---

## What breaks, specifically

- **Contrast.** Gold `#f5a623` on navy is high-contrast; the same gold on paper
  `#F2E6D3` is not. Anything currently relying on gold-on-dark for legibility
  needs a different token, most likely `--red-500` or an ink.
- **The `#fff` / `#000` trap.** Candy's README calls this out and it is worth
  repeating: paper is not white and ink is not black. Reaching for `#fff` because
  it is "basically the same" is what makes a retro-poster palette look like a
  web page with a beige background.
- **Focus rings and hover states.** Overwhelmingly defined as white-alpha. All of
  them invert.
- **Anything with an image behind it.** Photo overlays tuned for a dark ground
  will need re-tuning, and this is the category most likely to be missed, because
  it looks fine until the photo loads.
- **`prefers-color-scheme`.** The site is currently dark-only by construction. A
  paper-ground identity raises the question of whether there is a dark variant at
  all. **Candy's package does not answer this**, and it should be asked rather
  than assumed - inventing a dark mode for a poster identity is a design decision,
  not an implementation detail.

---

## The honest recommendation

**Phases 0-2 are done. Only Phase 3 is open, and it can wait.**

The estimate this document gave on 2026-08-22 was roughly a week of focused
work for one person, gated on the token layer and the public-site sweep. Both
shipped. What is left is 420 hexes across 42 dashboard files that no visitor
will ever load. The failure mode Candy's README warns about - shipped in front
of an audience in a half-and-half state - cannot happen from dashboard work,
because the dashboard is not what the audience loads.

So this is now a "do it when someone is already in that file" item rather than
a decision anyone has to make on a deadline.

**One thing that was urgent on 2026-08-22 and should be checked now:** Candy's
complete reference homepage - plain HTML/CSS/JS, the actual implementation of
this identity - was recorded as living only in `~/Downloads/ZaoStock for Zaal/`,
in no repo, and "one `rm` from gone". The identity has since shipped on the
public site, so the risk that this document was guarding against has been
retired by the work itself. If the reference is still only on one machine, it is
still worth committing; if the public site now carries it, this paragraph can
go.

---

## Credit

The design system, badge, icons and reference homepage are the work of
**Samantha ("Candy"), CandyToyBox**. Any surface built from them carries her
credit (`.claude/rules/credit-attribution.md`).

## Method

Two passes, because the first one is what made this document go stale.

**2026-08-22, by hand.** Grepping `src/**/*.tsx` for the four legacy brand hexes
(`0a1628`, `f5a623`, `0d1b2a`, `ffd700`) and for the light-on-dark utility
patterns (`text-white`, `text-gray-[345]00`, `{bg,border,ring,divide,from,to}-white/*`,
`bg-black/*`). The utility figure was de-duplicated - an earlier pass
double-counted `border-white/[0.08]` under two patterns and read 1,679.

**2026-09-30, by script, re-runnable.**
[`scripts/brand-migration-counts.mjs`](../scripts/brand-migration-counts.mjs)
recomputes every row in the table above and prints the document's figure next to
the current one. It matches on the same Tailwind arbitrary-value shape
(`[#[hex]`) and the same light-on-dark utility families, and it strips comments
first so a hex named in prose is not counted as rendered copy.

Two differences worth stating plainly rather than burying:

- **The hex pattern is broader than "the four legacy hexes".** It counts any
  hardcoded hex in a Tailwind arbitrary value, which is the number the
  migration actually has to fix. A dark-only file carrying an unrelated
  non-brand hex is still an edit site.
- **The hand count and this script are not the same measurement**, so the
  1,067 -> 420 change mixes two things: real migration, and a wider definition.
  The public/internal split is the number to trust, because it is the one that
  flips the document's conclusion: **0 hexes outside `src/app/team/`**, which
  is true under either definition.
