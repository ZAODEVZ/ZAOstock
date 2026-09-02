# Reveal runbook, 7 September 2026

The lineup reveal is **two edits in two different systems**, and doing one
without the other is the most likely way this goes wrong. Nothing fails if you
only do half. The site and the app simply disagree, quietly, in public.

Read this before touching anything on reveal day.

---

## Why it is two edits

The website and the mobile app answer "who is playing" from two different
places. This is not an accident to be cleaned up on the day, it is the current
design, and `src/lib/lineup-reveal.test.ts` pins the disagreement on purpose so
that changing one side trips the other.

| Surface | Reads from | Reveal action |
|---|---|---|
| Homepage, `/program` | `PUBLIC_LINEUP` in `src/content/site.ts`, compiled into the bundle | **Edit code and deploy** |
| `/artist/<slug>` pages | Supabase `artists`, gated by `lineupIsPublic()` | Database only |
| `/api/events/<slug>/lineup` (the **mobile app**) | Supabase `artists`, gated by `lineupIsPublic()` | Database only |

So: the database reveals itself the moment the date passes. The website does
not. The website needs a human.

---

## The order to do it in

### 1. Database first, before the gate opens

Set the confirmed acts in the `artists` table:

- `status` must be exactly `confirmed`, and **`confirmed` means confirmed in
  writing**. Not "internally confirmed", not "locked into the running order",
  not "we shook on it". If an act has not signed, it does not go in the table
  yet. The signature is what creates the row.
  See [`../decisions/0005-confirmed-means-confirmed-in-writing.md`](../decisions/0005-confirmed-means-confirmed-in-writing.md).
  As of 2026-09-02 exactly **one** act on the whole bill had signed.
- Do **not** use `travel_booked` for an act you want on the site. Both public
  queries ask for `confirmed` exactly, so that status silently unpublishes them.
  The allowed values are pinned in `src/lib/team-constants.ts`.
- `event_id` must point at the **`zaostock`** event row. Not `zaostock-2026`,
  which is a client alias and has never been a row. See
  [`../decisions/0003-event-slug-aliases.md`](../decisions/0003-event-slug-aliases.md).
- `set_order` controls the running order. Rows without one sort last.

Nothing is published by doing this before the 7th. `lineupIsPublic()` holds both
surfaces shut until the date passes in **Ellsworth**, not UTC. That is what #86
fixed, and it means the gate opens at 04:00Z on the 7th, not at midnight UTC.

### 2. Check the API before the website

```bash
curl -s https://zaostock.com/api/events/zaostock/lineup
curl -s https://zaostock.com/api/events/zaostock-2026/lineup   # the app's slug
```

Before the gate: `{"artists":[],"source":"live","published":false,"reveal_date":"2026-09-07"}`

After the gate, with rows in place: `"published"` is gone and `artists` has the
roster in `set_order`.

**If `artists` is `[]` after the gate opens, stop.** That is either the rows not
being `confirmed`, or `event_id` not matching. It is not a caching problem.

### 3. Then the website, which is a deploy

Edit `PUBLIC_LINEUP` in `src/content/site.ts` to the same acts, then ship it.

Two tests will stop you shipping something inconsistent, and they are doing
their job if they go red:

- `src/content/site.test.ts` refuses any act on the "not public" list, and
  refuses any surface that indexes `PUBLIC_LINEUP` without checking the entry
  exists. `/program` builds a run-of-show slot from `PUBLIC_LINEUP[0]`, so an
  empty array used to render the literal word "undefined" in public.
- `src/lib/lineup-reveal.test.ts` pins the site-versus-app disagreement. When
  you change one side it fails, and that is the prompt to change the other.

Update `/program`'s slots at the same time. Sets 1, 2, 3 and 5 are unnamed
placeholders today; only Set 4 is wired to `PUBLIC_LINEUP`.

### 4. Last, the caches

The API sends a short cache on an empty roster and a long one on a real roster,
precisely so an empty answer cannot outlive the reveal. Once real rows are
serving, the edge holds them for five minutes fresh and up to a day stale, which
is correct: a real lineup is worth carrying through an outage.

If you reveal and then immediately correct the roster, that correction can take
up to five minutes to reach the app. Get it right before, not after.

---

## What to check when it looks wrong

| Symptom | Almost always |
|---|---|
| App shows no acts, site shows them | Rows are not `confirmed`, or `event_id` is wrong |
| Site shows no acts, app shows them | `PUBLIC_LINEUP` was not edited, or not deployed |
| Both empty after the 7th | The gate. Check the date in Ellsworth, not UTC |
| One act shows, the rest do not | `status` on the others |
| "Set 4 - undefined" on /program | `PUBLIC_LINEUP` emptied without updating the slot |
| App 404s | The slug. `zaostock-2026` resolves via `src/lib/event-slugs.ts` |

## Who to wake up

- Database, artists, set order: **music and AV**,
  [`../team/02-music-and-av/`](../team/02-music-and-av/)
- Site deploy: **ops and infrastructure**,
  [`../team/06-ops-and-infrastructure/`](../team/06-ops-and-infrastructure/)
- Anything that changes what is announced, or the date itself: **Zaal**. The
  reveal date is his call and no one else's.

## The standing risk

As of 1 September the `artists` table is **empty**, and `PUBLIC_LINEUP` names
one act. If nothing changes before the 7th, the gate opens onto an empty roster
on every database-driven surface while the website announces one act. That is
not a bug in the code. It is the roster, and it is the first of the three things
the 31 August audit asked for.
