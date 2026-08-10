# ZAOstock website update - content truth first

Date: 2026-08-10
Repo: ZAODEVZ/ZAOstock
Branch: ws/zaostock-festivals-lane-0805
Status: approved design, not yet implemented

## Why

The 2026-08-03 ZAO-VILLE catch-up named updating the website "the biggest priority"
(Zaal's words, captured in the ZAOVILLE NOTES Google Doc, Meetings tab). The homepage
currently predates that meeting: it carries none of the Black Moon information, and its
lineup section makes a promise whose date has now passed.

The audience decision for this pass is Ellsworth locals, and the one action is RSVP.
Visual reskin to match the Woodstock-homage flyers is explicitly NOT in scope; it comes
later, once the flyers are final.

## Publication rules for this work

Decided by Zaal on 2026-08-10. These are hard constraints, not preferences.

PUBLISH:
- Black Moon as the confirmed after-party venue.
- That Black Moon can host performances during the 12-6 window.
- The two-stage option: main stage at the parklet plus a second stage at the bar.
  Stated as an option, not as a commitment.
- Free to attend, with ticket.zaostock.com as the RSVP destination.

DO NOT PUBLISH:
- Any performer name. Not the two confirmed Maine musicians, not Phelan, not DCoop.
- Any date other than October 3. No night-before, no Friday, no Sunday, nothing
  multi-day. Zaal's words: do not name or set other dates.

These stay internal until Zaal says otherwise.

Standing rules that also apply (from project memory): public copy names only locked
venues, partners, and vendors; no crypto or web3 language; never quote a specific ZAO
member count, use 100+.

## Current state

`src/app/page.tsx` is a single 708-line server component. All content lives in
hard-coded consts (`FACTS`, `SPONSOR_OFFERINGS`, `PAST_EVENTS`, `PARTNERS`, `NAV`) and
inline JSX strings. The date, venue, time window, and RSVP URL each repeat in four or
more places. `globals.css` defines three CSS variables that nothing consumes; palette
hexes are inline throughout.

Three defects this work fixes:

1. The Lineup section reads "The full lineup drops August 2026 once final commitments
   are locked." It is now mid-August and no names may be published, so the promise is
   both due and unfulfillable as written.
2. The ZAOville lineage card describes DCoop as "returning for ZAOstock", which places
   a named performer at the event in public copy.
3. Nothing on the site mentions Black Moon, the after-party, or the 12-6 window at the
   bar.

## PR 1 - content truth

### New file: `src/content/festival.ts`

A single typed `FESTIVAL` export holding the facts that repeat:

| key | value |
|---|---|
| `date` | `2026-10-03T12:00:00-04:00` (drives `CountdownTimer`) |
| `dateLabel` | `Saturday, October 3, 2026` |
| `venue` | `Franklin Street Parklet` |
| `city` | `Ellsworth, Maine` |
| `window` | `12 PM - 6 PM` |
| `admission` | `Free to attend` |
| `rsvpUrl` | `https://ticket.zaostock.com` |
| `afterParty` | `{ name: 'Black Moon', note: 'next door', hostsPerformances: true }` |

The module holds facts only. No JSX, no styling, no component imports. It exists so a
fact has exactly one home and cannot drift between the facts strip, the hero, the new
after-party block, and the footer.

### Changes to `src/app/page.tsx`

1. `FACTS`, `FESTIVAL_DATE`, the hero copy, the footer strip, and all four
   `ticket.zaostock.com` links read from `FESTIVAL` instead of repeating literals.
2. New "After Hours" section, placed after the existing "Where" section, built from the
   existing `SectionHeader` component so it matches its neighbours. Exact copy:

   > Eyebrow: `After Hours`
   > Title: `Black Moon, next door.`
   > Body: `Black Moon is confirmed as the ZAOstock after-party. The bar can also host
   > performances during the 12 PM - 6 PM window, which opens up a second stage there
   > alongside the main stage in the parklet.`

   "opens up" keeps the second stage an option. Wording that states it as decided is a
   rule violation, not a style preference.

3. Lineup section: remove "The full lineup drops August 2026 once final commitments are
   locked" and the `Lineup drops / August 2026` definition row. Exact replacement body
   copy:

   > `A full day of independent artists with DJs between every act. The lineup is
   > announced once every set is locked.`

   No artist named, no announcement date promised. Promising a date would violate the
   no-other-dates rule. The `Stage` and `Format` rows in that definition list stay.
4. Remove "returning for ZAOstock" from the ZAOville lineage card. The rest of that
   card, including the ZAO-CHELLA past-performance credit, stays - it describes a past
   event, not the ZAOstock lineup.
5. Untouched: Pro Ticket, sponsor tracks, partners, team mosaic, past events, nav,
   `StickyActionBar`, and every other route in the app.

### Explicitly out of scope for PR 1

Palette work, the Woodstock-homage reskin, the disabled `VibesGrid` photo section, the
`TagMarquee` artist-name replacement, and any route other than `/`.

## PR 2 - locals-first order

Pure section moves inside `src/app/page.tsx`. No copy changes, so the diff reads as
"these blocks moved" and can be reviewed against PR 1's already-approved wording.

Target order:

```
header -> hero -> countdown -> where + after hours -> RSVP/volunteer -> lineup
-> plug in -> about -> team -> partners -> pro ticket -> sponsors -> lineage -> footer
```

A local visitor reaches when, where, the after-party, and the RSVP button before
sponsorship tracks, the Pro Ticket ask, and festival lineage.

`#rsvp` and `#pro-ticket` are id-based anchors and keep working after the move.
`StickyActionBar` renders outside the section flow and is position-independent.

### Branching

PR 2 branches from PR 1's branch so its diff contains only the reorder. This means PR 2
merges second. The two PRs both edit `page.tsx`, so they cannot be literally
independent; sequencing them this way keeps each diff single-purpose.

## Verification

Both PRs, before either is called done:

- `npm run typecheck`
- `npm run lint`
- `npm run test` (vitest)
- `npm run build`
- `npm run dev`, then read the rendered homepage text and confirm the date, venue, time
  window, and after-party details render once each and agree with each other. Checking
  the rendered output, not only the diff.

## Risks

- The homepage is `force-dynamic` and calls Supabase at request time via
  `getPublicMembers` / `getStockCounts`. Local dev must point at the real app DB
  (`yjrlaxpjusmrfylumban`), not the cowork tracker DB (`etwvzrmlxeobinrlytza`). An empty
  team mosaic is the tell that the wrong DB is wired up.
- The two-stage line is the one piece of published copy describing something not yet
  settled. It is authorized explicitly by Zaal and must stay worded as an option. If the
  wording drifts toward commitment in review, it violates the standing
  no-unconfirmed-commitments rule.
- The "27 teammates" stat tile is unverified against the roster, which project memory
  records as 26 active in May 2026. Out of scope here; flagged for a separate check.

## Not doing

No deploy, no posting, no announcement, no action-item pushes to any tracker or bot.
PRs only.
