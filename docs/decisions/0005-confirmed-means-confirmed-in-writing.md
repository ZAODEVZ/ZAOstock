---
decision: 0005
title: Confirmed means confirmed in writing, and nothing softer
decided: 2026-09-02
by: Iman, from the organizing doc
status: active
supersedes: null
superseded-by: null
---

# 0005. Confirmed means confirmed in writing

The organizers draw a distinction the database does not have.

From the organizing doc, read 2026-09-02, five days before the reveal:

- **Lyons Den** is the only act **confirmed in writing**, which is exactly why it
  is the only act on any public surface.
- **The Crown Vics, Acadia Rising, Dcoop and Fellenz** are internally confirmed
  and locked into the running order, but their written confirmations are not
  finalised, so they are deliberately not public.
- **Michael Anderson** is internally confirmed and **not yet confirmed in
  writing**. He has until the reveal to provide it.
- **Steve Peer's closing hip-hop group** is not booked. Steve is paying for them
  and finalising the slot; the artists have not confirmed.
- **WaveWarZ battlers** are internally locked, but the bracket is deferred and
  their public confirmation is handled separately.

The team acted on that distinction: the posters printed for the 1 September push
carry **no artist names at all**, specifically so the written confirmations could
be gathered before the digital reveal.

## The problem

`ARTIST_STATUSES` has one word for confirmed. There is no value meaning "locked
into the running order, signature pending", which is the state five of six
daytime acts are actually in.

So whoever loads this roster has two options, and both are bad:

- **Load nothing.** The reveal gate opens on the 7th onto an empty roster and
  the mobile app shows no acts at all.
- **Load them as `confirmed`.** The gate opens and publishes five people who
  have not signed anything.

The second is what would happen, because `confirmed` is the only word available
and the acts genuinely are locked as far as the organizers are concerned. The
system would then do the exact thing the nameless posters were printed to
prevent, on a date nobody has to be present for, because the gate is automatic.

## The decision

**`confirmed` means confirmed in writing. Nothing else may use it.**

An act that is locked into the running order but has not signed does not go into
the `artists` table as `confirmed`. It waits. The written confirmation is the
event that changes the row, not the running order being settled.

Both public readers already filter on exactly this status:

    src/lib/artists.ts:47                        .eq('status', 'confirmed')
    src/app/api/events/[slug]/lineup/route.ts    .eq('status', 'confirmed')

So with this rule the automatic gate becomes **safe** rather than dangerous: it
can only ever publish an act that has signed. Michael Anderson appears the day
his written confirmation lands, not before, and nobody has to remember to hold
him back.

No migration, no schema change. The rule is a discipline, and
`ARTIST_STATUS_IS_PUBLISHABLE` in `src/lib/team-constants.ts` is where it is
written down in code rather than in one person's head.

## The tripwire

`ARTIST_STATUS_IS_PUBLISHABLE` is typed `Record<ArtistStatus, boolean>`, so
adding a value to `ARTIST_STATUSES` without classifying it is a **compile
error**, not a silent default. The next person who adds `internally_confirmed`
has to state, in the same edit, whether it reaches the public.

That matters more than it looks. The obvious future fix for this whole problem
is to add a softer status, and the obvious way to get it wrong is to add it and
let it inherit whatever the publish path happens to do.

## One thing this surfaces and does not settle

`travel_booked` is currently **not** publishable, because both queries ask for
`confirmed` exactly. An act is one status or the other, so marking an act's
travel as booked silently removes them from the public lineup.

That is almost certainly wrong. Nobody books travel for an unconfirmed act.

It is left alone here on purpose. Changing it would start publishing acts five
days before the reveal, which is the risk this decision exists to remove. The
column is conflating a confirmation state with a logistics state and that needs
Zaal, not a guess. Until then: **do not use `travel_booked` for an act you want
on the site.**
