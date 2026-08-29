# ZAOstock project audit - 2026-08-29

Measured by the SITE terminal on Saturday 29 August 2026, 01:xx ET, 35 days
before the festival. Every line is from a tool run this morning (gh, git, npm,
curl, Playwright plus axe) or a file read; nothing is from memory. Previous
audits: `docs/AUDIT.md` (17-18 July) and `docs/audit/2026-05-12-public-surfaces.md`.

## One-screen verdict

The public site is in good shape as of this morning: every route 200, 25 ms
TTFB, zero layout shift, the poster identity on every page, canonical and OG
on every page, sitemap and favicon right, axe clean on the poster pages (PR
#58 merged, PR #59 open). The three things that are actually broken are all
infrastructure, and all three have one root cause: **production is wired to
the wrong Supabase project.** Below that: three high npm advisories with fixes
available, 104 remote branches of which 40 are already merged, one stale PR,
and a test suite that covers content rules but not the 40 API routes.

## Findings, ranked

| # | Area | Finding | Evidence | Fix, and whose |
|---|---|---|---|---|
| 1 | **Production database** | Vercel Production resolves `NEXT_PUBLIC_SUPABASE_URL` to `etwvzrmlxeobinrlytza.supabase.co` (the cowork project). The real ZAOstock project is `yjrlaxpjusmrfylumban` (`docs/CANONICAL-REPO.md`, memory). The cowork project has no `events`, `circles` or lineup tables, so `/api/events` is 500 ("Could not find the table 'public.events'", PGRST205), `/circles` is 500, `/api/events/zaostock-2026/lineup` is serving its committed fallback, and the mobile app's home screen has nothing to load. Issue #55 has carried this exact response body since 26 August; the uptime workflow reopens it daily. | `curl https://zaostock.com/api/events`; issue #55; `src/lib/db/supabase.ts` reads only `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` | Zaal (the Vercel project lives in the `info-75478046s-projects` team; the CLI account on this Mac, bettercallzaal, is not a member, so this could not be measured or changed from here). Set the URL, anon key and service-role key for Production to the real project and redeploy. Then close #55. |
| 2 | Dependencies | `npm audit --omit=dev`: 3 high, 0 critical (before this PR). `next` 16.2.10 (middleware/proxy bypass in App Router; DoS via Server Action; fixed in 16.3.x), `sharp` <0.35 (libvips CVE-2026-33327), `nanoid` <3.3.18. All three have a fix available. 13 packages outdated, all minor. | `npm audit`, `npm outdated` | SITE: `npm audit fix` on a branch, gate with `next build` + tests, PR. Done in PR #59: Next 16.3.3, 0 high, production build green. |
| 3 | Repo hygiene | 104 remote refs; 40 branches already merged into main and still on origin (list below); one open PR (#50, 25 Aug, conflicting, CI red) superseded by the `/press` route now on main. | `git branch -r --merged origin/main`; `gh pr list` | #50: boilerplate and four angles salvaged into `docs/marketing/press-kit.md` (this PR), then closed with a note. Branches: one tap from Zaal to delete the 40 merged ones (recoverable from the merge commits; nothing on them is unmerged). Turn on "automatically delete head branches" in the repo settings so this stops accumulating. |
| 4 | Tests | 9 test files, 45 tests, all on content rules, auth helpers and parsers. 40 API routes, 0 route tests beyond `events/[slug]/lineup`. CI runs typecheck, lint, test, build on every PR (good) and a daily uptime check on `/api/events` (good, and it is what surfaced #1). | `find src -name '*.test.ts*'`; `.github/workflows/ci.yml`, `uptime.yml` | SITE, after #1 lands: a smoke test per public GET route against a stub, and an uptime check on `/program` and `/partners`, not only the API. |
| 5 | Public API | `/api/events` carries a "TEMP diagnostic" that prints the resolved Supabase host and the raw Postgres error to any caller. Useful this week; a leak of infrastructure detail once #1 is fixed. | `src/app/api/events/route.ts` | Removed in PR #59; the host is already public in issue #55. |
| 6 | Security headers | HSTS preload, nosniff, frame SAMEORIGIN, referrer policy, permissions policy all present. CSP is still Report-Only (by design since July); instagram.com added to `frame-src` this week. | `next.config.ts` | Leave Report-Only through 3 October; enforce after. |
| 7 | Public copy | All public surfaces now match the 27-28 Aug verdicts (program v7, nine partners, four sponsor surfaces, no prices, reveal 1 September). `llms.txt` was the last stale surface (retired tiers, "lineup once every set is locked", an ENTERACT funding path) and is rewritten in PR #59. | `docs/site/research-2026-08-28.md`; `docs/site/design-review-2026-08-28.md` | Done. Keep `src/content/*.ts` the only place a fact is typed. |
| 8 | Design | DESIGN.md system on all 19 poster routes; `/onepagers/overview` and `/circles` were the last two with off-palette classes (fixed in #59). Photos: none exist; every page carries the badge or logos instead. | design review doc | Photos are the one visual gap. Not a code task. |
| 9 | Docs | `docs/` has 23 directories and is the working memory of five lanes; `docs/AUDIT.md` (July) still describes the pre-redesign site and the old tiers. | `ls docs` | Leave the July audit as a dated record; this file is the current one. |
| 10 | Tooling on this Mac | Turbopack panics in Orca worktrees (shared `node_modules` symlink); gstack browse was dead for two days because Playwright's browsers were not installed. Both recorded in memory. | this session | Use `next dev --webpack`; `npx playwright install chromium` once. |

## Iman's audit (28 Aug), reviewed 29 Aug

Iman audited all 40 API routes against `a35cc05` and sent a ten-item report
plus a set of lower-blast-radius notes. Every code-level claim was checked
against the source this morning and held. Status per item; exploit detail is
deliberately not reproduced here because this repository is public.

| Iman # | Claim | Verified | Landed in PR #59 | Left for |
|---|---|---|---|---|
| 01 | `/musicians/rider` was the one public form not behind the 23 Aug guard; it posted to the dead database and dropped riders | yes | rider page renders `FormsUnavailable` until `PUBLIC_FORMS_ENABLED` flips | - |
| 02 | Production reads the cowork Supabase project | yes (issue #55 body) | - | Zaal: Vercel env, then redeploy |
| 03 | A public roster page plus a deterministic code formula plus wide `select('*')` responses chain into a credential path | yes | `/api/team/artists` no longer returns `claim_token`; login sweep now constant-work | Zaal: rotate all codes off the formula before the env fix redeploys; SITE after: role-scope the team routes (one role check exists today) |
| 04 | Both intake routes write `status: 'submitted'`, not one of the six declared statuses | yes | - | Zaal: read the CHECK constraint in the real project; then SITE maps intake to a legal status or adds one with a migration |
| 05 | Any cypher applicant got a public `/artist/<name>` page; no confirmation step | yes | public artists are confirmed-only and held until the 1 September reveal (`src/lib/lineup-reveal.ts`, tested) | - |
| 06 | Lineup fallback keyed to a slug the events table does not use; the one route test used the same wrong slug | yes | fallback answers to both slugs; test uses the real one; new test pins both | - |
| 07 | One bad login blocks the event loop ~1.8 s (sync scrypt over every row) | yes | async scrypt on the thread pool; request-access shares the helper instead of its own copy | - |
| 08 | `Array.find` short-circuit leaks roster position by timing, defeating the identical-body design | yes | every row checked every time | - |
| 09 | 3-day inactivity cron locks volunteers out mid-festival | yes | window is 45 days | Zaal: confirm the number |
| 10 | Public detail pages scan whole tables 2-3 times per view; egress quota refills 21 Sep | yes | `react cache()` on both helpers: one read per request | SITE: `revalidate` on those pages once #02 lands; Zaal: confirm the Supabase tier |
| - | No schema in the repo; runtime errors point at SQL files that never existed | yes | - | Zaal + SITE: export the real project's schema into `supabase/` |
| - | Profile scope enum rejects livestream and finance members | yes | enum extended (livestream, finance, content) | - |
| - | Rider notes read-modify-write can drop a line under concurrent writes | yes | - | SITE: append via a single update expression or a separate riders table |
| - | Flat authorization: one role check across 40 routes; any member can delete or flip visibility | yes | - | SITE, before forms reopen: lead-only on DELETE and on visibility changes |
| - | 5 high npm advisories; Dependabot off; no branch protection | yes (3 high measured here) | `npm audit fix`: Next 16.3.3, 0 high, build green | Zaal: protect `main` (require the CI check), enable Dependabot alerts |
| - | `/api/events` debug fields leak the database host | yes | removed | - |
| - | README says two stages | yes | fixed | - |

Order Iman set, and it stands: rider guard (done) -> rotate codes and scope the team routes (rotation is Zaal's; scoping is SITE's next PR) -> Zaal fixes the Vercel env and grants a second person access to that team -> settle the `submitted` status against the real constraint and commit the schema before any form comes back on -> this week: branch protection, egress tier, roster into the fallback, uptime alert reaching a human.

## Numbers

- Routes: 30 pages (22 public, 8 under `/team`), 40 API routes, 9 test files / 45 tests.
- Source: `src/` TypeScript and TSX, tests pass in 2.6 s, `tsc --noEmit` clean, eslint 0 errors (5 pre-existing `<img>` warnings under `/team`).
- Dependencies: 18 runtime, 12 dev. Next 16.2.10, React 19.2.3, Tailwind 4, Supabase JS 2.109.
- Public site this morning: 22/22 routes 200, TTFB 24-153 ms, CLS 0, no dead internal links, axe clean on the poster pages.
- Deploys: main `402f58c` is Production (PR #58); PR #59 open with the SEO/a11y pass, `/build` and `llms.txt`.

## The 40 merged branches (safe to delete; each is in main)

chore/remove-photos-homepage, claude/a11y-forms-skiplink, claude/coc-confirmed, claude/donate-trust, claude/festive-cerf-s4nft2, claude/resilience-error-boundary, claude/security-cypher-idor, claude/tier0-public-bugs, feat/donate-2path-design-iteration, feat/entry-pages-may7, feat/live-iteration-6-hero, feat/live-page-iteration-overnight, feat/music-docs-may7, feat/sponsor-pages-atmosphere, feat/test-iteration-3-overnight, feat/test-iteration-4-vibes, fix/nmc-not-501c3-fractured-atlas-correction, fix/nmc-rename-and-scope-cleanup, fix/paypal-handle-zaalpanthaki, fix/sponsor-two-paths-may8, fix/test-rsvp-endpoint-sponsor-rename, redesign/test-landing, ws/audit-fixes-web, ws/audit-fixes-web-v2, ws/ellsworth-page, ws/events-diagnostic-and-lineup, ws/festivals-clickable-cards, ws/fold-2026-08-27, ws/fold-2026-08-28, ws/handoff-park-zaostock-zaofestivals, ws/haptics-and-profile-fix, ws/log-events-route-error, ws/onepagers-resilience, ws/polish-launch, ws/port-pr40, ws/production-plan-1003-0826, ws/public-events-endpoint, ws/push-notifications-backend, ws/session-failclosed, ws/site-fix-0828.

The other 60-odd unmerged branches are July-August lane work that was folded by merge commits or abandoned; they need a look before deletion and are not in this tap.

## Not measured

- Vercel Production environment variables (team membership, above).
- Supabase table inventory on the real project (no client on this Mac).
- Core Web Vitals in the field (no RUM); lab numbers only.
