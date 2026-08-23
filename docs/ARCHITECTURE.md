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
   public visitor ─▶│  24 public routes           │
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
npm run codes      # scripts/team-codes.mjs - generate team login codes
```

CI (`.github/workflows/ci.yml`) runs `typecheck`, `lint`, `test`, `build` on every
push and PR to `main`.

---

## Directory map

```
src/
  app/
    (24 public routes)      the festival site
    team/                   the dashboard, behind a session
    api/                    41 route handlers
      events/[slug]/lineup  public lineup, consumed by the mobile app
      team/*                dashboard CRUD, session-guarded
      cron/                 scheduled jobs, guarded by CRON_SECRET
    globals.css             9 lines. See "the token gap" below
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

Two properties matter:

- The module imports `server-only`, so importing it from a client component is a
  **build error**, not a runtime leak.
- The three secrets are lazy getters that throw **when read**, not when the module
  is imported. The comment explains why: Next's build-time page-data collection
  imports every route module without using every variable, so throwing at
  construction broke `next build` outright. A missing secret must not silently
  become an empty string either - that is how you get a predictable session secret.

---

## Auth

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

**Worth verifying when the database is reachable:** the public lineup endpoint is
called in production as `/api/events/zaostock-2026/lineup` - a different slug from
the `zaostock` fallback. Both may exist as separate rows, or one may not exist at
all. It could not be checked while writing this, because the Supabase org is over
its egress quota (402 until 2026-09-21) and that lookup is exactly what fails. If
`zaostock-2026` turns out not to exist, that endpoint will return 404 rather than
data once the quota refills, and the fix is a slug, not code.

---

## API conventions

41 route handlers under `src/app/api`.

- **Zod on input.** `lib/api/parse-json.ts` is the shared parser.
- **Rate limiting** via `lib/api/rate-limit.ts` on public form endpoints. Read its
  docstring before relying on it: it is an **in-memory map, per warm serverless
  instance**, explicitly "not a substitute for a real store if this needs to hold
  up against a determined attacker." It raises the bar against naive spam. It is
  not a security control.
- **Session guard first**, before any data access, on everything under
  `/api/team/*`.
- **Cron routes** under `/api/cron/*` are guarded by `CRON_SECRET`.
- **Public routes expose a narrow projection.** `lib/artists.ts` and the lineup
  route both hand-list public-safe columns rather than selecting `*`, so fees,
  riders, notes and contact details cannot leak by accident. Keep that shape when
  adding fields.

---

## Two things that will surprise you

**The token gap.** `src/app/globals.css` is nine lines. It defines
`--background`, `--foreground` and `--accent` correctly - and **exactly one file
in the codebase uses them.** Every other component hardcodes brand hex inline as
Tailwind arbitrary values (`bg-[#0a1628]`). That is 1,067 hardcoded hexes across
77 of 96 `.tsx` files. It is the single biggest source of friction in the app and
it is measured in [`BRAND-MIGRATION.md`](./BRAND-MIGRATION.md).

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
