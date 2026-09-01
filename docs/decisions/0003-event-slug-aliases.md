---
decision: 0003
title: Client event slugs are aliased, never given their own events row
decided: 2026-09-01
by: Iman
status: active
supersedes: null
superseded-by: null
---

# 0003. Event slugs are aliased, not duplicated

The `events` table uses `zaostock`. The ZAO Festivals mobile app calls
`/api/events/zaostock-2026/lineup` and can send `eventSlug: 'zaostock-2026'` to
the RSVP route. That slug has never existed in the table.

## What we chose

One place owns the alias: `EVENT_SLUG_ALIASES` in `src/lib/event-slugs.ts`,
resolved **before** the event lookup rather than after it fails.

## What we rejected, and why

Adding a second row to the `events` table for `zaostock-2026`. It would work
immediately and it would be wrong: two rows means two ids, and RSVPs and lineup
writes would split across them. That is the same bug one layer down and much
harder to see, because both halves would look like they were working.

## Why this needed a decision rather than a fix

For a week the bug did not show. Supabase was unreachable, the lineup route
degraded to the committed fallback, and the fallback happened to be keyed by
both names, so both answered. Repointing production at the real project on
31 August is what broke it: the event lookup then ran to completion first, so
`zaostock-2026` became a hard 404, and an RSVP carrying it was written with
`event_id: null`, silently detached from the festival.

Fixing the layer above is what broke the client. That shape of bug is worth a
file, because the next person to "clean up" the alias will not have seen it.

## The rule

Never change an event slug without adding an alias. Never add an event to
`docs/events/` without recording its slug.
