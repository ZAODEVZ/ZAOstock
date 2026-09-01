# Contributing

Working on zaostock? Here's the actual workflow, not boilerplate.

## Where things live

| Looking for | Go to |
|---|---|
| Who owns what, who decides what | [`docs/team/`](docs/team/) |
| A role nobody is filling | [`docs/team/OPEN-ROLES.md`](docs/team/OPEN-ROLES.md) |
| Any ZAO event, its links and its slug | [`docs/events/`](docs/events/) |
| Why something was decided, and when | [`docs/decisions/`](docs/decisions/) |
| How the app is put together | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| How a bot should write as someone | [`agents/`](agents/) |

Adding a person, an event or a decision each take four steps, written at the
bottom of the relevant README. All three indexes are enforced by
`src/content/registry.test.ts`, so forgetting the index row fails the build
instead of leaving a file nobody can find.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in Supabase + SESSION_SECRET
npm run dev                  # http://localhost:3000
```

You'll need real values for `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (from the
project's Supabase dashboard) and a real `SESSION_SECRET` (any random string 32+ characters - both
of these throw a clear error at first use if missing, not a silent failure).

## Before you push

CI runs `typecheck`, `lint`, `test`, and `build` on every push/PR to `main` (`.github/workflows/ci.yml`) - but
run them locally first so you're not waiting on CI to find something obvious:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

There **is** a test suite now - Vitest, and CI runs it. Add tests with your change rather than
leaning on `tsc` alone; a type-check proves the code compiles, not that it does the right thing.
If you're touching anything security-sensitive (auth, RLS, the API routes under
`src/app/api/team/*`), still verify by hand against the real behavior on top of the tests - the
suite does not cover every route.

## Commit style

Conventional commits, matching the existing git history: `type(scope): description` or
`type: description` (`fix`, `feat`, `chore`, `research`). Keep the body focused on *why*, not a
restatement of the diff - the diff already shows what changed.

## Database changes

**Verify the RLS claim below rather than trusting it.** `npm run check:exposure`
asks the project directly what the publishable key can read, table by table. It
never writes and never pulls a row. The claim in this section has never been
checked by CI, and the tables behind the retired team dashboard still hold every
row they ever had. Retired routes are not retired data.

This project's Supabase RLS policies are scoped to `service_role` only (not `public`/`anon`) - every
DB access goes through `getSupabaseAdmin()` server-side, gated by the app's own session check. Keep it
that way: a new table or policy that isn't `TO service_role` reopens a real vulnerability that was
fixed here before (a full-database-read/write hole via a leaked anon key).

## Team/admin routes

Every route under `src/app/api/team/*` must call `getStockTeamMember()` and reject `null` before doing
anything else. Public form endpoints (RSVP, apply, cypher, musicians/submit, musicians/rider,
artist-profile) go through `rateLimitPublicForm()` (`src/lib/api/rate-limit.ts`) and `parseJsonBody()`
(`src/lib/api/parse-json.ts`) - use both for any new public-facing POST/PATCH route, not just the
zod schema.
