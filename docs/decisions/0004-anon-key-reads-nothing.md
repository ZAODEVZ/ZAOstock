---
decision: 0004
title: The publishable key can read nothing, so the site needs no RLS work before the event
decided: 2026-09-01
by: measured, ZAOstock lane
status: active
supersedes: null
superseded-by: null
---

# 0004. The publishable key reads nothing

Round two asked what a Supabase publishable key can read, and answered honestly
that nothing in the repo could confirm it: the site holds only a service-role
key, server side, and no RLS definition lives in version control. The suggested
next step was for Zaal to paste a publishable key so `check:exposure` could
answer it.

**He does not need to.** The question is answerable from the database itself,
and the answer is nothing.

## Measured

2026-09-01, against `yjrlaxpjusmrfylumban`, the production project.

All **23 tables** in `public`:

| Property | Value |
|---|---|
| `relrowsecurity` | `true` on every table, no exceptions |
| Policies per table | exactly 1 |
| Policy roles | `{service_role}` on all 23 |
| Policy `cmd` | `ALL` |
| Policy `qual` / `with_check` | `true` |

There is **no policy granting `anon` or `authenticated` anything**, on any
table. Postgres row-level security denies by default: RLS enabled with no
matching policy returns zero rows. So a publishable key sees an empty result on
every table, including `budget_entries`, `sponsors`, `team_members` and
`contact_log`.

The single permissive policy is scoped to `service_role`, which bypasses RLS
anyway, so it changes nothing about exposure. It is belt and braces, not a hole.

## What this closes

- The "paste the publishable key" item. Nothing to test; the answer is already
  known and does not depend on holding the key.
- The concern that the retired team dashboard's tables are still readable. Their
  rows are all still there, deliberately, and none of them are reachable without
  the service-role key.

## What it does NOT close

**Anything holding the service-role key reads and writes everything.** That key
is the whole boundary. It lives in Vercel's environment, is never sent to a
browser, and the repo has no publishable key to leak — but it means the exposure
question for this project is a secrets-handling question, not an RLS one.

`relforcerowsecurity` is `false` throughout, so the table owner also bypasses
RLS. That is the `postgres` role, not a public one, and is normal.

## Why this is a decision rather than a note

Because the natural next step was to change something. Adding anon policies, or
auditing RLS table by table, would both have been real work aimed at a hole that
is not there. Recording the measurement stops that work being done twice, and
stops the next reader assuming the silence in the repo means the question is
open.

If a publishable key is ever introduced — a client-side read, a public
dashboard, an embed — this decision expires immediately and every table needs a
deliberate policy before that ships.
