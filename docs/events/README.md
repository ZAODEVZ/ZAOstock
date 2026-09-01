# ZAO Festivals, every event in one place

Every event The ZAO has run or is running, with the links, the data and the
identifiers each one uses. If you are looking for "where is ZAOville" or "what
slug does the API use for this festival", it is here.

One file per event, numbered in the order they happened.

| # | Event | Where | When | Slug | Status |
|---|-------|-------|------|------|--------|
| 01 | [ZAO-PALOOZA](01-zao-palooza-2024.md) | New York City, during NFT NYC | 2024 | `zao-palooza` | past |
| 02 | [ZAO-CHELLA](02-zao-chella-2024.md) | Miami, Wynwood, during Art Basel | December 2024 | `zao-chella` | past |
| 03 | [ZAOville](03-zaoville-2026.md) | Laurel, Maryland | July 2026 | `zaoville` | past |
| 04 | [ZAOstock](04-zaostock-2026.md) | Ellsworth, Maine | 3 October 2026 | `zaostock` | **upcoming** |

## Reveal day

**[`REVEAL-RUNBOOK.md`](REVEAL-RUNBOOK.md)** is the 7 September checklist. Read it
before touching anything that day. The short version: the reveal is **two edits
in two systems**, the database and `PUBLIC_LINEUP` in the bundle, and doing one
without the other fails silently. The site and the app just disagree in public.

## The slug is the load-bearing part

Each event's `slug` is the value in the `events` table, and it is what the API
and the ZAO Festivals mobile app resolve against. Getting it wrong does not
throw. It 404s, or worse it writes a row with `event_id: null` that looks like
it saved.

That already happened. The mobile app called `zaostock-2026` for a week while
the table said `zaostock`, and it only surfaced when Supabase came back up and
the event lookup started succeeding. See
[`docs/decisions/0003-event-slug-aliases.md`](../decisions/0003-event-slug-aliases.md)
and `src/lib/event-slugs.ts`.

**So: never add an event here without recording its slug, and never change a
slug without adding an alias.** `src/content/registry.test.ts` fails the build
if this table and `SERIES` in `src/content/site.ts` stop agreeing.

## Adding an event

1. Copy `_TEMPLATE.md` to `NN-<slug>-<year>.md`, next number, never reused.
2. Fill the front matter. `slug` must match the `events` table exactly.
3. Add a row to the table above.
4. If it should appear on the public site, add it to `SERIES` in
   `src/content/site.ts` as well. The test checks both directions.

