# Architecture

How this app is put together, for someone who has just cloned it. Written by
reading the code on 2026-08-22, not from memory - where something is uncertain it
says so.

For setup and workflow see [`CONTRIBUTING.md`](../CONTRIBUTING.md). For what the
project *is*, see the [README](../README.md).

---

## The shape of it

One Next.js app serving two audiences out of one codebase and one database.

```
                    ┌─────────────────────────────┐
   public visitor ─▶│  35 non-team pages          │
                    │  /  /program  /pitch  ...   │──┐
                    └─────────────────────────────┘  │
                                                     │   ┌──────────────┐
                    ┌─────────────────────────────┐  ├──▶│  Supabase    │
   team member    ─▶│  /team/*  dashboard         │──┤   │  (Postgres)  │
   (4-letter code)  │  iron-session cookie        │  │   │  RLS: service│
                    └─────────────────────────────┘  │   │  role only   │
                                                     │   └──────────────┘
                    ┌─────────────────────────────┐  │
   ZAO Festivals  ─▶│  /api/events/[slug]/lineup  │──┘
   mobile app       │  + ?event_id= on team APIs  │
                    └─────────────────────────────┘
```

The third consumer is easy to miss. Several API routes exist for a **mobile app
that does not live in this repo**, and changing their response shapes breaks a
client you cannot see from here.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16, App Router, Turbopack for both dev and build |
| UI | React 19, Tailwind v4 (no `tailwind.config` - v4 configures in CSS) |
| Data | Supabase Postgres via `@supabase/supabase-js` |
| Auth | `iron-session` cookies, plus signed tokens for mobile |
| Wallets | `viem` for signature verification |
| Editor | Tiptap (`@tiptap/*`, `tiptap-markdown`) for bio editing |
| Validation | Zod on API input |
| Logging | `pino` |
| Tests | Vitest |
| Hosting | Vercel |

## Commands

```bash
npm run dev        # next dev --turbopack
npm run build      # next build --turbopack
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
npm run test       # vitest run
npm run test:e2e   # playwright test
```

CI (`.github/workflows/ci.yml`) runs on every push and PR to `main`, as four
separate jobs so one failure cannot hide another: `typecheck` + `test` + `build`,
`lint`, `check:facts` and `check:review`.

---

## Directory map

```
src/
  app/
    (35 non-team pages)     the festival site, plus the private /backstage/<code> sheets
    team/                   the dashboard, behind a session
    api/                    43 route handlers
      events/[slug]/lineup  public lineup, consumed by the mobile app
      team/*                dashboard CRUD, session-guarded
      cron/                 scheduled jobs, guarded by CRON_SECRET
    globals.css             the brand tokens, in a Tailwind v4 @theme block
  lib/
    env.ts                  server-only env access, throws on missing secrets
    db/supabase.ts          the admin client
    auth/                   sessions, team codes, wallet signatures
    api/                    parse-json, rate-limit, resolve-event
    artists.ts              public artist projection
    members.ts              team member reads
    push/                   mobile push notifications
docs/                       this directory
public/brand/               the ZAOstock 26 marks (see docs/brand/)
```

---

## Environment

Read through `src/lib/env.ts`, which is worth reading in full - it encodes a
decision rather than just listing variables.

| Variable | |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public, warns if empty |
| `NEXT_PUBLIC_APP_URL` | public, defaults to `https://zaostock.com` |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only**, throws if missing |
| `SESSION_SECRET` | **server only**, throws if missing |
| `CRON_SECRET` | **server only**, throws if missing |
| `ARTIST_CONFIRM_SECRET` | **server only**, throws if missing |

Two properties matter:

- The module imports `server-only`, so importing it from a client component is a
  **build error**, not a runtime leak.
- The four secrets are lazy getters that throw **when read**, not when the module
  is imported. The comment explains why: Next's build-time page-data collection
  imports every route module without using every variable, so throwing at
  construction broke `next build` outright. A missing secret must not silently
  become an empty string either - that is how you get a predictable session secret.

---

## Auth

**Retired.** The team dashboard was retired on 2026-08-29 (see
[decision 0001](./decisions/0001-team-dashboard-retired.md)).
`TEAM_DASHBOARD_RETIRED` in `src/lib/team-status.ts` makes every `/api/team/*`
route answer 401 and the login, token and wallet routes answer 410. The code
below is still in the tree until stage two deletes it.

Two paths, one rule.

**Web:** a 4-letter team code exchanged at `/api/team/login` for an `iron-session`
cookie (`team_session`, httpOnly, sameSite lax, 30 days).

**Mobile:** a sealed token with the same 30-day lifetime, via
`/api/team/mobile-login`.

**Wallets:** `/api/team/wallet-nonce` issues a nonce,
`/api/team/wallet-login` verifies the signature with `viem`.

The rule that matters, from `session.ts`:

> a valid session/token alone isn't enough, since either can outlive a member
> being deactivated (by the inactivity cron or a lead's manual PATCH) by up to
> 30 days otherwise.

So **every authenticated read re-checks `active` against the database.** Do not
optimise that away - it is the only thing that makes deactivation take effect
before the cookie expires.

A missing `SESSION_SECRET` fails **closed** (anonymous), not open.

---

## Data

Supabase RLS is scoped to `service_role` only, not `public` or `anon`. Every read
and write goes through the server with the service-role key. **There is no direct
browser-to-Supabase path**, which is why an outage takes out API routes rather
than degrading one widget.

Tables referenced in code, by how often:

`artists` (22) · `team_members` (21) · `volunteers` (9) · `sponsors` (8) ·
`timeline` (7) · `meeting_notes` (7) · `budget_entries` (7) · `todos` (5) ·
`suggestions` (5) · `rsvps` (5) · `events` (5) · `onepagers` (4) ·
`circle_members` (4) · `attachments` (4) · `activity_log` (4) · `goals` (3) ·
`contact_log` (3) · `comments` (3) · `onepager_activity` (2) · `circles` (2)

Schema lives in the Supabase project, not in this repo - there is no migrations
directory. That is a real gap: the schema is not reviewable in a PR and cannot be
recreated from a clone.

### Event scoping

Team API routes accept `?event_id=` so the mobile app can switch events.
`resolveEventId()` falls back to the event with slug **`zaostock`**.

**RESOLVED 2026-09-08, measured.** Both slugs answer 200 with identical bodies:

    /api/events/zaostock/lineup       200  {"artists":[],...,"reveal_date":"2026-09-13"}
    /api/events/zaostock-2026/lineup  200  same

`zaostock-2026` is not a second row. It is an alias resolved *before* the lookup
in `src/lib/event-slugs.ts`, which is why it answers rather than 404s. The
concern below was real when written and is now closed.

<details><summary>What this said before, and why it was wrong to leave standing</summary>

It said the lookup "could not be checked" because the Supabase org was over its
egress quota (402 until 2026-09-21), and warned `zaostock-2026` might 404 once
the quota refilled. That was true on the day it was written. It then sat here
unchanged while the alias shipped and both endpoints started answering - a claim
about an external service that stayed loud after it stopped being true, which is
the exact failure this repo now guards against.
<!-- re-checked 2026-09-22: /api/events/zaostock/lineup and /api/events/zaostock-2026/lineup both 200 with the same first artist (The Crown Vics, id aedc603c); /api/events/not-a-festival/lineup 404s {"error":"Event not found"}, so the 200s are the alias answering and not a catch-all. Still closed. -->
<!-- re-check: 2026-10-20 -->

</details>

---

## API conventions

43 route handlers under `src/app/api`.

- **Zod on input.** `src/lib/api/parse-json.ts` is the shared parser.
- **Rate limiting** via `src/lib/api/rate-limit.ts` on public form endpoints. Read its
  docstring before relying on it: it is an **in-memory map, per warm serverless
  instance**, explicitly "not a substitute for a real store if this needs to hold
  up against a determined attacker." It raises the bar against naive spam. It is
  not a security control.
- **Session guard first**, before any data access, on everything under
  `/api/team/*`.
- **Cron routes** under `/api/cron/*` are guarded by `CRON_SECRET`.
- **Public routes expose a narrow projection.** `src/lib/artists.ts` and the lineup
  route both hand-list public-safe columns rather than selecting `*`, so fees,
  riders, notes and contact details cannot leak by accident. Keep that shape when
  adding fields.

---

## Two things that will surprise you

**The token gap, partly closed.** The brand tokens now live in a Tailwind v4
`@theme` block in `src/app/globals.css` (`paper`, `ink`, `red`, `gold`, `denim`,
`olive`), and 68 of 110 `.tsx` files use them. The rest still hardcode hex as Tailwind
arbitrary values (`bg-[#0a1628]`): 420 of them across 34 of 110 `.tsx` files, as
of 2026-09-27. [`BRAND-MIGRATION.md`](./BRAND-MIGRATION.md) has the original
measurement.

**No schema in the repo.** See above. Combined with service-role-only RLS, the
database is a hard dependency with no local story: there is no seed, no fixture
set, and no way to run the dashboard without real credentials.

---

## Where the docs are

| | |
|---|---|
| [`README.md`](../README.md) | what this is, stack, run locally |
| [`CONTRIBUTING.md`](../CONTRIBUTING.md) | setup, pre-push checks, commit style |
| `docs/ARCHITECTURE.md` | this file |
| `docs/brand/` | the ZAOstock 26 design system (Candy / CandyToyBox) |
| `docs/BRAND-MIGRATION.md` | what moving to that identity costs |
| `docs/CANONICAL-REPO.md` | **read this if you found another zaostock repo** |
| `docs/audit/`, `docs/plans/`, `docs/standup/` | working notes, not specs |

`docs/CANONICAL-REPO.md` is load-bearing: `bettercallzaal/zao-stock` is archived
and dead, and clones of it still exist on people's machines.
