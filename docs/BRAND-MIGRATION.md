# Brand migration: what moving to ZAOstock 26 actually costs

**Status: a plan and a cost estimate. Nothing has been migrated.**
Whether we rebrand before or after the lineup announcement is Zaal's call.

Candy's package landed in PR #42 (`docs/brand/README.md`). Her README is explicit
that the retro-poster identity **replaces** the Midnight Navy / Festival Yellow
look rather than sitting alongside it, and that a page carrying half of each reads
as a mistake rather than a transition. That constraint is what makes this
expensive, so it is worth knowing the number before choosing a date.

Everything below was measured against `main` on 2026-08-22, not estimated.

---

## The headline

**This is not a colour swap. It is a polarity inversion, and the codebase has no
token layer to absorb it.**

| | Measured |
|---|---|
| `.tsx` files in `src/` | 96 |
| Files carrying brand colour | **77 of 96** |
| Hardcoded brand hexes | **1,067** |
| Light-on-dark utilities that break on a paper ground | **1,297** |
| **Total edit sites** | **~2,364** |
| Files consuming the existing CSS variables | **1** |

The old identity is dark: navy ground, light text. The new one is light: paper
ground, ink text. Those are not two palettes, they are opposite polarities, and
the second number above is the one that a naive plan misses.

### Why a find-and-replace does not work

Substituting the four hexes gets you a paper-coloured page with 1,297 pieces of
white and light-grey text on it. `text-white`, `text-gray-400`, and
`border-white/[0.08]` were all correct against navy and are invisible or
near-invisible against `#F2E6D3`. They carry no brand hex, so every hex-based
search-and-replace, codemod, or `sed` script sails straight past them.

```
272  text-white
246  text-gray-400
218  text-gray-500
172  border-white/[0.08]
114  text-gray-300
108  border-white/[0.06]
...  and 15 more variants
```

A migration that fixes colours and not polarity produces a site that looks broken
in a way that is tedious rather than obvious to find: it renders, it deploys, and
you discover it one component at a time.

### Why there is no shortcut through tokens

`src/app/globals.css` is nine lines. It defines `--background`, `--foreground` and
`--accent` correctly, and **exactly one file in the codebase uses them.** Every
other component hardcodes the hex inline as a Tailwind arbitrary value
(`bg-[#0a1628]`, `text-[#f5a623]`).

So the indirection layer that would make a rebrand a one-file change exists on
paper and has never been adopted. Building it is not optional overhead here - it
is the only thing that makes this migration finite, and it is the reason the work
is worth doing even if the rebrand slips.

---

## Where the work is

| Surface | Files | Hexes | Notes |
|---|---|---|---|
| **Public site** | 42 | **605** | 24 routes. What the lineup announcement points at |
| **Team dashboard** (`/team/*`) | 37 | **462** | Internal. Nobody outside the team sees it |
| Other brand surfaces | - | - | `src/app/icon.svg`, `src/app/opengraph-image.tsx` |

The public routes:

```
/  /acadia  /apply  /artist/[slug]  /artists  /circles  /cypher  /donate
/ellsworth  /event-organizers  /festivals  /musicians  /musicians/rider
/musicians/submit  /onepagers  /onepagers/[slug]  /onepagers/overview  /pitch
/privacy  /program  /sponsor  /sponsor/deck  /suggest  /zaoville
```

Heaviest single files: `app/page.tsx` (69), `pitch/page.tsx` (48),
`musicians/rider/RiderForm.tsx` (44), `team/ArtistPipeline.tsx` (43),
`team/SponsorCRM.tsx` (37).

**The public/internal split is the most useful fact in this document.** It is a
real seam: 605 of the 1,067 hexes are on surfaces anyone outside the team will
ever look at. The dashboard can stay navy indefinitely without anybody noticing,
and nothing about the announcement depends on it.

---

## The plan, in the order it should happen

### Phase 0 - build the token layer (2-3 hours, do this regardless)

Expand `globals.css` from Candy's `tokens.reference.css` into a real token set:
the full red / gold / denim / olive ramps, plus `--paper-100`, `--paper-200`,
`--ink-950`. Map them to Tailwind v4's `@theme` so components can say
`bg-paper` and `text-ink` instead of a hex.

**This is independently worth doing.** It is the difference between the next
brand change costing 2,300 edits and costing one file. It ships safely on its own
because adding tokens changes no rendering until something consumes them.

### Phase 1 - one page, end to end (half a day)

Migrate `/program` completely and look at it. It is the smallest self-contained
public page, it is already being rebuilt in PR #40, and it exercises the full
problem: ground, text, borders, accent, and cards.

The purpose is to find out what Phase 2 actually costs per page, from one real
data point rather than from this document's arithmetic. Do not skip it and do not
scale up until it looks right on a phone.

### Phase 2 - the public site (the bulk)

The remaining 23 public routes, in descending order of who sees them: `/` first,
then `/pitch` and `/sponsor` (these carry the money conversation), then the
musician funnel, then the long tail.

Per page: swap ground and text polarity, replace the accent, re-check every
border and hover state, verify contrast on paper. **Budget on the polarity work,
not the hexes** - the hexes are the fast part.

### Phase 3 - the dashboard, or never

462 hexes across 37 files for a surface with no external audience. Legitimate
outcomes include "do it later", "do it never", and "do it when someone is already
in that file". It should not gate the announcement.

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

**Phase 0 now, the rest after the lineup announcement.**

The token layer is pure upside, carries no visual risk, and makes every later
phase cheaper. The full migration is roughly a week of focused work for one
person, and the failure mode of rushing it is the exact half-and-half state
Candy's README warns about - shipped in front of the audience the announcement
just brought in.

The announcement is also the single moment this year with the most eyes on the
site, which cuts both ways: it is the best time to have a new identity, and the
worst time to be halfway through one. Given 42 days to the event and six open
run-of-show decisions competing for the same attention, the risk-adjusted answer
is to land the announcement on the identity we have and rebrand behind it.

That is a recommendation, not a decision. It is question 7 on Monday's list.

**One thing that is genuinely urgent regardless:** Candy's complete reference
homepage - plain HTML/CSS/JS, the actual implementation of this identity - lives
only in `~/Downloads/ZaoStock for Zaal/`. It is not in any repo. Whoever does
Phase 2 needs to read it first, and right now it is one `rm` from gone. PR #42
raises this; it is still open.

---

## Credit

The design system, badge, icons and reference homepage are the work of
**Samantha ("Candy"), CandyToyBox**. Any surface built from them carries her
credit (`.claude/rules/credit-attribution.md`).

## Method

Counts produced on 2026-08-22 against `main` by grepping `src/**/*.tsx` for the
four legacy brand hexes (`0a1628`, `f5a623`, `0d1b2a`, `ffd700`) and for the
light-on-dark utility patterns (`text-white`, `text-gray-[345]00`,
`{bg,border,ring,divide,from,to}-white/*`, `bg-black/*`). The utility figure is
de-duplicated - an earlier pass double-counted `border-white/[0.08]` under two
patterns and read 1,679; the correct figure is 1,297.
