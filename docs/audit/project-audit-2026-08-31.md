# ZAOstock project audit - 2026-08-31

Re-audit of `docs/audit/project-audit-2026-08-29.md`, two days on, 33 days before
the festival and roughly twelve hours before the lineup reveal fires. Measured
against `origin/main` at `9cfad7e` on Monday 31 August, 13:0x UTC. Every line is
from a tool run in this session - live curl against production, `gh`, `git`, npm,
a real `next build` - or a file read. Nothing is from memory, and nothing is
carried forward from the 29 August audit without being re-checked.

Previous audits: `project-audit-2026-08-29.md`, `docs/AUDIT.md` (17-18 July),
`2026-05-12-public-surfaces.md`.

## One-screen verdict

**The thing that blocked all three previous audits is fixed.** Production now
points at the real Supabase project. `/api/events` returns five real events, and
the uptime workflow went green between 03:52Z and 10:34Z this morning after
failing every run for days. That was finding #1 in July and #1 on 29 August.

What replaces it is smaller but time-critical. The database came back a few
hours ago and nothing downstream has been told: **three public forms are still
switched off by a one-line flag**, and **the lineup reveal that fires tonight
will reveal an empty roster** on every database-driven surface. Both are hours
away from mattering, and both are cheap to fix.

The codebase itself is in good order: typecheck clean, 57 tests passing, build
green, zero high advisories, no committed secrets, every security header
present. The open risks are configuration and data, not code.

## Fixed since 29 August, verified

| # | Finding then | State now | Evidence |
|---|---|---|---|
| 1 | Production wired to the cowork Supabase project; `/api/events` 500 since 26 August | **Fixed.** Five real events returned, `source` is the real project | `curl https://zaostock.com/api/events`; uptime run 10:34Z success after 03:52Z failure |
| 2 | 3 high npm advisories (next, sharp, nanoid) | **Fixed.** 0 high. Next is 16.3.3 installed | `npm audit --omit=dev` |
| 3 | `/api/events` TEMP diagnostic leaked the database host and raw Postgres error | **Fixed.** Route returns data or a generic 500 | `src/app/api/events/route.ts` |
| 4 | 104 remote branches, 40 already merged | **Partly fixed.** 59 remain and none of them are merged into main | `gh api .../branches`; `git branch -r --merged origin/main` |
| 5 | Issue #55 carrying the outage since 26 August | **Closed.** Zero open issues | `gh issue list` |
| 6 | Flat auth across 40 routes, any member could delete | **Dormant, not fixed.** See finding 7 below | `src/lib/team-status.ts` |
| 7 | Stale PR #50 | **Closed.** Five PRs open, four opened today, all CI green | `gh pr list`, `gh pr checks` |

## Findings, ranked

| # | Area | Finding | Evidence | Fix, and whose |
|---|---|---|---|---|
| 1 | **Public forms** | `DATABASE_AVAILABLE = false` is still hardcoded in `src/lib/forms-status.ts`. That file's own instruction is "FLIP THIS when Vercel Production points at the real Supabase project and `curl https://zaostock.com/api/events` returns a list rather than 500." Both conditions were met this morning. Until it flips, the RSVP, the volunteer sign-up and the ideas box all render the email fallback instead of a working form, 33 days out and on the eve of the reveal. | `src/lib/forms-status.ts:38`; `src/app/RSVPForm.tsx:24`, `src/app/apply/ApplyForm.tsx:34`, `src/app/suggest/SuggestForm.tsx:21`; live `/api/events` returns 5 events | SITE: one-line change. Note these pages are prerendered static in the build output, so it needs a deploy, not just a flag. Verify one real RSVP write end to end before calling it done, because the write path has never been exercised against the correct project. |
| 2 | **Reveal timing** | `lineupIsPublic()` compared `now.toISOString()` against `'2026-09-01'`, so the reveal fired at `2026-09-01T00:00:00Z`, which is **8:00 PM Monday 31 August in Ellsworth**. The site labels it "1 September" (`SITE.lineupRevealLabel`). The lineup would have unlocked four hours before the date the site promises, this evening. The test suite pinned the UTC behaviour, so this was deliberate code, not a slip - but it was not the intended wall-clock moment. **FIXED in this session, in the working tree.** The gate now reads the calendar date in `SITE.timeZone` via `Intl.formatToParts`, so it opens at midnight on 1 September in Ellsworth. Verified at all four boundary instants; the 8 PM to midnight window that used to be open is now closed. | `src/lib/lineup-reveal.ts`; `src/lib/lineup-reveal.test.ts`; `src/content/site.ts` | Landed as code, unmerged. Zaal only needs to confirm midnight local is the intended moment. |
| 3 | **The reveal has nothing to reveal** | `/api/events/zaostock/lineup` answers `{"artists":[],"source":"live"}` right now: zero artists with `status = 'confirmed'` are linked to the zaostock event. Meanwhile `docs/acts/` documents five booked acts (Crown Vics booked via Steve Peer, Fellenz agreed, Lyons Den placed, DCoop, Acadia Rising) and PRs #70 and #71 add more to the run of show. When the gate opens tonight, `/artist/<slug>` pages unlock onto an empty roster and the mobile app's festival detail screen stays blank. The web program is unaffected because it reads `PUBLIC_LINEUP = ['Lyons Den']` from `src/content/site.ts`, hardcoded. | live curl; `src/lib/artists.ts:42`; `src/content/site.ts:43`; `docs/acts/*.md` | Zaal: get the confirmed acts into the `artists` table with `event_id` set and `status = 'confirmed'`, or accept that the reveal is web-copy only tonight. Either is fine, but they should be the same decision on every surface. |
| 4 | **Mobile lineup slug 404s** | `/api/events/zaostock-2026/lineup` returned a hard `404 Event not found`. The route looked the event up first and 404d before any fallback, so the dual-slug protection in `lineup-fallback.ts` ("the mobile app calls `zaostock-2026`; both keys serve the same list") was unreachable whenever the database was up. Fixing the database is what exposed it: while Supabase was down the route degraded and answered; once it came back it refused. The 404 branch was pinned by a passing test, so CI read green on the behaviour that broke the client. The same slug also reached the RSVP route, where an unresolved event is not an error - it writes the RSVP with `event_id: null`, silently detached from the festival. **FIXED in this session, in the working tree.** `src/lib/event-slugs.ts` now owns the alias and both routes resolve through it before the lookup, so the live path and the degraded path cannot disagree. A new route test asserts the query is given `zaostock`, not the status alone. | live curl on both slugs; `src/app/api/events/[slug]/lineup/route.ts`; `src/app/api/events/rsvp/route.ts`; `src/lib/event-slugs.ts` | Landed as code, unmerged. **Still not verified from here:** `bettercallzaal/zao-festivals` is 404 to this `gh` account, so which slug the app actually calls could not be confirmed, and the RSVP half of this may already have written detached rows. Zaal: check the app, and check `rsvps` for rows with a null `event_id`. |
| 5 | Lineup fallback | `LINEUP_FALLBACK` is still empty for both slugs, `AS_OF` 2026-08-22. It was left empty on purpose because the roster was unreachable. It is reachable now. This matters on a clock: the Supabase egress quota does not refill until 21 September, twelve days before the festival. | `src/lib/lineup-fallback.ts:40-55` | SITE, after finding 3: populate from the real roster and move `AS_OF`. |
| 6 | Repo hardening | Branch protection on `main` is **off** (`404 Branch not protected`). Dependabot alerts are **disabled**. The repo is public. PR #72 turns Dependabot on and is green and unmerged. `delete_branch_on_merge` is false, which is why the branch count climbs back. | `gh api .../branches/main/protection`; `gh api .../dependabot/alerts`; repo settings | Zaal: three settings toggles, two minutes. Merge #72. |
| 7 | Authorization | Unchanged and structural. `DELETE` on artists, attachments, budget, comments, contact-log, notes, sponsors, timeline and volunteers requires only `getStockTeamMember()` - any signed-in member. There is no role to check: `StockTeamPayload` carries `memberId` and `memberName` and nothing else. This is currently unreachable because `TEAM_DASHBOARD_RETIRED = true` makes every `/api/team/*` route 401 and the six login routes 410, which is a genuine fail-closed. It returns in full the moment anyone flips that flag. | `src/app/api/team/artists/route.ts:126`; `src/lib/auth/session.ts:7`; `src/lib/team-status.ts:18` | SITE, before the dashboard ever comes back: a role on the session and lead-only on DELETE and on visibility changes. Not urgent while retired; do not let it be forgotten. |
| 8 | Database access model | Every read and write goes through `getSupabaseAdmin()` and the service-role key. There is no anon client and no RLS path anywhere in `src/`; `.env.example` does not even list an anon key. Row-level security cannot help, so any route bug is a whole-table bug. | `src/lib/db/supabase.ts`; `.env.example` | Noted, not a 33-days-out change. Worth deciding after 3 October. |
| 9 | Schema | Still no `supabase/` directory. The real project's schema exists only in the dashboard. The 29 August audit raised this; nothing landed. | `ls supabase` | Zaal + SITE: export the schema into the repo. This is also the only way to settle the open `submitted` versus CHECK-constraint question from Iman's item 04, which could not be tested from here without database credentials. |
| 10 | Monitoring | The uptime workflow is good and it is what caught finding 1 - but it watches exactly one endpoint and notifies by opening a GitHub issue. Its own comment says "If Oct 3 needs a real pager, this is not it." It would not have caught findings 3 or 4: `/api/events` is 200 with a non-empty array while the lineup endpoint serves nothing and the legacy slug 404s. | `.github/workflows/uptime.yml` | SITE: add the lineup endpoint and `/program` to the check. Zaal: decide whether 3 October needs a real pager, and whose phone. |
| 11 | Dependencies | 1 moderate advisory: postcss `<=8.5.22`, an incomplete fix of GHSA-6g55-p6wh-862q. The repo's own `overrides: { "postcss": "^8.5.19" }` - added in July to force a fix - now pins inside the vulnerable range. | `npm audit --omit=dev`; `package.json` | SITE: raise the override past 8.5.22, re-run the build. Low severity, dev-surface, no rush. |
| 12 | Data versus copy | The events table has ZAOville as `status: "upcoming"`, `event_date: 2026-07-25` - five weeks past. `/api/events` serves that to the mobile app's home screen, which lists past and upcoming. The web is fine and unaffected: `/festivals` hardcodes ZAOville as `past`. The divergence is the point - the web copy was corrected in code and the row was never touched. | live `/api/events`; `src/app/festivals/page.tsx:43` | Zaal: one row update in Supabase. |
| 13 | Team dead end | `TEAM_DOC_URL` is still the literal string `'UNSET'`, two days after the dashboard was retired and pointed at "the working document". `TeamRetired.tsx` guards on it correctly so nothing leaks to the page, but a team member landing on `/team` gets a message and no link. | `src/lib/team-status.ts:21`; `src/app/team/TeamRetired.tsx:19` | Zaal: paste the Drive URL. |
| 14 | Repo hygiene | 59 remote branches, none merged into main - the 45 merged ones from the last audit were deleted, which is the cleanup landing. What remains is the July-August unmerged tail the last audit set aside. | `git fetch '+refs/heads/*'`; `git branch -r --merged origin/main` | Zaal: a look before deletion, as last time. Turn on auto-delete so the merged ones never accumulate again. |
| 15 | Local checkout | Local `main` was 236 commits behind origin when this audit started, and two local branches (`fix/zaoville-past-status`, `ws/audit-followup-0829`) hold single commits whose content has since landed on main under different SHAs via PRs #61 and the festivals fix. | `git rev-list --count`; `git log origin/main..` | Housekeeping: both local branches can go. |

## Green, measured this session

- `tsc --noEmit`: clean.
- `eslint .`: 0 errors, 4 warnings, all `no-img-element` under `/team`, all pre-existing and deliberate. Down from 5.
- `vitest run`: 12 files, 57 tests, all pass in 2.24 s. Up from 9 files / 45 tests.
- `next build --turbopack`: green. 32 pages, 40 API routes.
- `npm audit --omit=dev`: 0 critical, 0 high, 1 moderate.
- Secrets: no `.env` tracked beyond `.env.example`, and no key-shaped literal anywhere in the tree. On a public repo this is the one that matters.
- Security headers on production: HSTS with preload, nosniff, frame SAMEORIGIN, referrer policy, permissions policy. CSP is still Report-Only, by design through 3 October.
- Live routes: `/`, `/program`, `/partners`, `/musicians/submit`, `/build` all 200. `/circles` 308 to `/meetings`. Warm TTFB 0.43-1.07 s, slower than the 24-153 ms measured on 29 August, worth a second look but measured from a different machine and network so not comparable enough to call a regression.
- All five open PRs green on CI and Vercel preview.

## Fixed in this session

Findings 2 and 4 are code, so they were fixed rather than filed. Both are in the
working tree on `main`, uncommitted, with `tsc` clean, 63 tests passing (up from
57), lint unchanged at 0 errors, and a green build.

- **The reveal now opens on the festival's own clock.** `SITE.timeZone` is the
  new fact; `lineupIsPublic()` reads the calendar date in Ellsworth through
  `Intl.formatToParts`, so the machine's locale cannot reorder it. Tests pin
  both sides of the 8 PM and the midnight boundary, and one case in standard
  time so the next person cannot "simplify" it back to a fixed offset.
- **The mobile slug resolves before the lookup.** `src/lib/event-slugs.ts` owns
  the alias, `getFallbackLineup` and both event routes read it, and the
  duplicate key in `LINEUP_FALLBACK` is gone, so the live and degraded paths
  cannot drift apart again. The RSVP route was fixed in the same pass: it had
  the same bug with a quieter symptom.

## If you only do three things, and the first two are today

1. **Get the confirmed acts into the `artists` table, or say the reveal is web
   copy only.** The timing is fixed; the emptiness is not. It now opens at
   midnight tonight onto whatever is in the database, which is currently
   nothing. Finding 3.
2. **Flip `DATABASE_AVAILABLE` and deploy.** The database has been correct since
   this morning and three public forms are still turned off. Test one real RSVP
   after the deploy. Finding 1.
3. **Turn on branch protection and Dependabot, and merge #72.** Three toggles on
   a public repo, and the reason to do it this week rather than after 3 October
   is that the festival is when nobody will be watching the repo. Finding 6.

## Not measured

- Vercel Production environment variables directly. Inferred from behaviour: the
  API now serves the real project's data, which is the observable half.
- The Supabase table inventory, row counts and the `status` CHECK constraint. No
  database credentials on this machine, so Iman's item 04 stays open and finding
  3 cannot distinguish "no confirmed artists" from "confirmed artists not linked
  to the event".
- The mobile app. `bettercallzaal/zao-festivals` returns 404 to this `gh`
  account, so finding 4's client-side half is unverified.
- Core Web Vitals in the field. No RUM.
- Accessibility. No axe run this session; the 29 August pass stands unchallenged.
