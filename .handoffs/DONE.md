# ZAOstock lane - PARKED 2026-08-27

Parked mid-lane on Zaal's direction change. Nothing is half-finished; every
piece below is committed and coherent on its own.

**Branch:** `ws/production-plan-1003-0826`, six commits ahead of `origin/main`.
**Not pushed.** Working tree clean.

## What is on the branch

| Commit | What |
|--------|------|
| `e2c1faa` | The Oct 3 production plan for Steve Peer, and the stage-model correction |
| `ef53e3a` | North Creek takes the whole evening on /program, day opens at eleven |
| `94be243` | Blocked section, with both asks drafted ready to send |
| `cc07ce7` | Homepage was still selling a second stage at Black Moon |
| `1586705` | Livestream split, Aziz and Ohnahji, closes the flag open since 20 Aug |
| `8d6bd50` | Deck slide 9 as three ladders and an early-close date |

Files: `docs/plans/production-plan-2026-10-03.md`,
`docs/plans/people-map-2026-10-03.md`, `docs/sponsor/slide-9-tier-ladder.md`,
plus `src/app/program/page.tsx`, `src/app/page.tsx`, `src/content/festival.ts`
and its test, `src/app/layout.tsx`, `src/app/pitch/page.tsx`,
`src/app/team/plan/page.tsx`.

Verified: `tsc --noEmit` clean, `festival.test.ts` 5 passed. CI has not run -
nothing is pushed.

## Resume point

The next action is **Zaal sending two messages**, both already drafted verbatim
in section 8 of the production plan. No agent can advance the lane past them.

1. **To Steve Peer** - does North Creek start at 6:00 or 6:30. Until he answers,
   no downbeat is printed anywhere, which is the correct state and not a gap.
2. **To Roddy, City of Ellsworth** - does the parklet permit cap an 11:00 start.

## The one thing to check on resume

**The 11:00 open is on public surfaces and is NOT cleared with the City.**
`FESTIVAL.window` is `11 AM - 6 PM`, the schema.org `startDate` is 11:00, and
`/program` and `/pitch` both say eleven. If the City comes back with an hours
condition, `src/content/festival.ts` is the single value that moves, and its
comment says so. This was a deliberate call - the alternative was leaving the
site contradicting the plan we are sending the venue - but it is a claim we made
before it was cleared, so it is the first thing to re-check.

## Two open flags a resumer must not silently resolve

1. **The livestream split reverses a dated decision.** The people map finalised
   24 Aug recorded, as Zaal's own call, that virtual has no lead deliberately.
   The 27 Aug verdict supersedes it. Both are written down in
   `docs/plans/people-map-2026-10-03.md`. Do not treat the reversal as an error
   and revert it, and do not treat it as settled without Zaal seeing it.
2. **Which livestream half belongs to whom is inferred, not instructed.** Zaal
   named both people and said split by platform. Aziz-to-rig and
   Ohnahji-to-scheduling is read from what each already runs. One word flips it.

## Zaal-only items still open, carried from handoffs/zaostock.md

1. Is Supabase project `yjrlaxpjusmrfylumban` in the org upgraded to Pro. Blocks
   the lineup API, the public forms and reading the roster.
2. Does this event have any fiscal sponsor, or none. Nothing may say
   tax-deductible until it is settled.
3. Deck slide 9 - **every figure is UNSET.** A draft proposing a $2,500 top tier
   and an early-close of Friday 11 September was killed on 27 Aug: Zaal has
   never named a tier price or a close date, and the draft's "doc 2326" source
   does not contain those numbers. `docs/sponsor/slide-9-tier-ladder.md` now
   holds the shape of the decision only. Slide 9 stays blocked, and blocked is
   correct. Do not re-derive a ladder from the deck words or the audit doc -
   both of those figures are the same unvalidated set.
4. Deck slide 4 - the attendance claim. "4,000 of 8,000 Ellsworth" is his own
   goal and defensible; a projected attendance is not.
5. Are Steve's four acts booked or proposed. He sent a run of show including
   them and nobody has confirmed which.
6. The Google Doc `1B78AVonJS3-bXXdHMYJ-M2LruujQjZhcONT-vAO0Jko` - he wants that
   one updated, not a new one. No credential yet, and browser automation is
   barred after it corrupted tabs.
7. Insurance - card `89e9da61`, no owner, a permit condition the City asked for
   on 17 Aug. Broker not agent.

Item 5 moved on 27 Aug. Item 3 moved and was then reverted to blocked. Items 1
and 2 have the widest blast radius.

## A failure mode this lane produced twice, worth naming

Both on 27 Aug, in different repos: a provenance claim was inherited from a
draft and repeated without checking whether the cited source says it.

1. Slide 9 prices attributed to Zaal "per doc 2326". Doc 2326 does not contain
   them.
2. `hermes-agent` described as "OpenMatter's template per doc 1659-v5". Doc 1659
   resolves to two documents and neither says it.

The second was caught before it shipped. The first was not, and reached a
recommendation. **A number or claim whose cited source does not support it is
worse than one with no source, because it reads as settled.** Check the line
before repeating the citation.

## Deliberately not done

- **Not pushed.** Standing instruction across the whole lane.
- **No performer names on any public surface.** Reveal is 1 September. The
  public plan and people map carry roles and slots only; names live on the gated
  `/team/plan`.
- **`src/lib/lineup-fallback.ts` left empty.** It needs five fields per artist
  copied from the real roster, the roster is unreachable, and its own header
  says never to invent them. The endpoint keeps returning an honest 503.
