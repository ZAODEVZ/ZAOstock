# Session handoff - 2026-07-18
> from Mac (zaostock + zao-festivals repos, main) -> to Zaal himself, later, via Claude Code in the cloud
> doc: .handoffs/session-2026-07-18-park-zaostock-zaofestivals/README.md
> chain: none

## Receiver instructions (read me FIRST, then do exactly this)

You just received a handoff bundle. Do NOT start work yet. Do this:

1. Read ALL sections below before responding to anything.
2. Read `docs/AUDIT.md` in the zaostock repo and `docs/APP_STORE_METADATA.md` in the zao-festivals repo NOW - they are the primary record, this bundle does not duplicate them.
3. Create TaskList entries from section A.
4. Use section B as your "why" - do NOT re-litigate decisions captured there unless new info surfaces.
5. Use section E as your cold-start map.
6. Once integrated, message back: "Ingested handoff park-zaostock-zaofestivals. N tasks queued. Ready."
7. Zaal's stated intent for this handoff: he wants to be able to just **chat** about zaostock/zaofestivals (both repos) in a cloud session without necessarily doing more engineering work yet, until he's ready to resume the app. Don't assume every message means "start building" - he may just want to talk through something.
8. This work is explicitly **parked**, not urgent - he switched to WaveWarZ. Don't push him to resume it.

## Repos to use (START HERE)

**Primary: `ZAODEVZ/ZAOstock`** (local checkout: `/Users/zaalpanthaki/Desktop/repos/zaostock`)
`git clone https://github.com/ZAODEVZ/ZAOstock.git`
This is zaostock.com - the web app, team dashboard, and every API route the mobile app depends on. `docs/AUDIT.md` lives here and is the critical blocker record. Branch/PR convention: sync `main`, branch as `ws/<slug>`, PR + merge via `gh pr merge --merge --delete-branch=false` (established convention this session, not a hard requirement).

**Secondary: `bettercallzaal/zao-festivals`** (local checkout: `/tmp/zaostock-app`)
`git clone https://github.com/bettercallzaal/zao-festivals.git`
The ZAO Festivals mobile app (Expo/React Native), a client of the primary repo's API. `docs/APP_STORE_METADATA.md` lives here. Same branch/PR convention.

If unsure which repo a task belongs to: web/API/backend/infra -> primary. Mobile screens/UX/App Store -> secondary.

## Capability boundary (cloud vs terminal)

Boot self-check before assuming any capability:
- `~/.zao/zao.env` for secrets (may not exist in a cloud sandbox)
- `~/.claude/skills` for the skill library
- `gh auth status` for GitHub access
- `$DISPLAY` / GUI access (a cloud session has none)

**Escalate to Zaal instead of faking it** when a task needs: local secrets, a real browser/GUI, the `clipboard` skill, locally-authed MCP (Supabase/Vercel dashboards - a cloud session likely has NO access to either), Zaal's real Apple/Vercel/Supabase accounts, onchain writes, or a mac-local file outside these two repos. Say so plainly and continue with whatever you CAN do (reading code, discussing, drafting, non-privileged research).

**Specifically:** the #1 open blocker (wrong Supabase env var, see section A) requires the Vercel dashboard under "thezao's projects" team - a cloud session almost certainly cannot do this. That step is Zaal's alone. Don't attempt to route around it.

## A. Tasks to absorb (paste these into your TODO list)
- [ ] Fix Supabase env var in Vercel (`za-ostock` project, "thezao's projects" team, NOT any personal account) - exact steps + expected before/after `curl` output in `docs/AUDIT.md`. This is Zaal's step alone (dashboard access), not something to attempt from a cloud session.
- [ ] Once #1 is confirmed fixed: resume the blocked QA pass (RSVP, feedback, sign-in happy paths against live data) and take real App Store screenshots - both were blocked all last session by the broken backend.
- [ ] Run one interactive `eas build --platform ios --profile production` from a real Terminal.app (not cloud) to sync the Push Notifications capability - failed at build 13, never retried. Exact command in `docs/AUDIT.md`.
- [ ] Get real ZAOville event details from Zaal's call with Kaylan (Magnetiq) - date, real `magnetiqUrl`, livestream URL if any - and add one entry to `lib/magnetiq-events.ts` in the mobile repo (currently intentionally empty).
- [ ] Decide the Unlock Protocol path for the $50 "pro ticket" tier - research was queued to the ZOE VPS loop but got stuck cycling on an unrelated PR (~45+ min, never touched the actual research). May need re-routing or a direct check-in with Zaal on why ZOE's loop deprioritized it.

## B. Why - decisions + pivots + ruled-out paths

- **The whole session's root cause**: production zaostock.com pointed at the wrong Supabase database. Confirmed with hard evidence (a real test write through the live public API failed on a schema mismatch), not inference. This is a "NEVER error" per Zaal's own words - burned into memory (`feedback_verify_supabase_project_before_writes.md`).
- **Two separate wrong-account near-misses happened before finding ground truth**, not one: first a wrong Supabase MCP connection (`mcp__supabase__` = correct "ZAO STOCK" project; `mcp__supabase-cowork__` = unrelated project, confirmed via Zaal's own dashboard screenshot), then a wrong Vercel account entirely (CLI login only had access to an orphaned personal-account `zaostock` project; real production is `za-ostock` under "thezao's projects" team - a completely different account the CLI can't reach). Both cost real hours. Rule going forward: never trust "the CLI I'm logged into has a same-named thing" - always verify against Zaal's own browser session.
- **Ruled out building "ZAO Ticketing" from scratch.** Existing platforms (Eventbrite, RSVPify) charge 3-4%+ per ticket specifically because payments/fraud-protection/check-in infra is real ongoing engineering work - disproportionate for a free festival whose only real transaction is an optional $50 add-on. Chose Unlock Protocol (onchain NFT membership, has its own check-in app) as the lighter path instead, reusing wallet-connect infra the app already has.
- **Magnetiq does NOT do ticketing or payments** - verified directly against magnetiq.io (no ticket/checkout/Stripe language anywhere). It's registration/check-in/press-CRM. Corrected an initial wrong assumption before building on it. Added a public "Events" tab in the mobile app that links OUT to Magnetiq event pages (config-driven list, since Magnetiq has no public API), not an embedded WebView - the earlier WebView prototype used a personal-looking URL with an unconfirmed-safety token and was deliberately removed rather than shipped.
- **Deliberately did NOT fix two known issues tonight**: a HIGH-severity `ws`/wagmi dependency vulnerability (real, CVSS 7.5, but the fix needs a semver-major wagmi bump - genuine breaking-change risk not worth rushing before a demo) and 3 raw `<img>` tags flagged for `next/image` conversion (skipped because `next/image` requires domain allowlisting and `photo_url` is dynamic user data that couldn't be verified against the 5 allowlisted domains while the backend was down - risked silently breaking real team photos). Both documented with reasoning in `docs/AUDIT.md` so they don't get "fixed" blindly later without the same care.
- **ZOE's research loop got stuck**, not just slow: watched it cycle "no change, holding" on an unrelated PR (#1777) across 3 separate checks (~45+ min) without ever touching the queued Unlock Protocol research task. Flagged directly to Zaal rather than silently re-polling indefinitely, per his explicit instruction that turn.
- **New standing preference**: Zaal wants standalone research asks routed to the ZOE VPS loop (via a `~/loop-directive.md` file + `tmux send-keys` injection, NOT typed directly - bracketed-paste swallows a same-burst Enter) rather than done inline in this kind of session by default. Captured in memory (`feedback_route_research_to_zoe.md`). Given the ZOE-stuck incident above, this preference may need revisiting.

## C. Git state

Both repos: clean, on `main`, fully pushed and merged. No uncommitted diff, no open branches with unmerged work.

- **zaostock** (primary): `main` @ `3db79fe` ("Merge pull request #29 from ZAODEVZ/ws/audit-fixes-web-v2")
- **zao-festivals** (secondary): `main` @ `d69ad82` ("Merge pull request #27 from bettercallzaal/ws/app-store-readiness-status")

Untracked, harmless, not part of this work (pre-existing local leftovers, safe to ignore): `.claude/settings.json`, older `.handoffs/session-*` folders from prior sessions.

## D. In-flight

- Background bash jobs: none still running.
- Subagents pending: none.
- Scheduled wakeups: none currently armed (the last polling loop watching Supabase/ZOE status was concluded when this handoff was requested).
- Open AskUserQuestion: none.
- ZOE VPS tmux session (`zoe` on `zaal@31.97.148.88`): still has the Unlock Protocol research directive queued (`~/loop-directive.md` on that box) but was observed stuck/not progressing as of the last check. Not this session's responsibility to fix, but worth knowing it may still be sitting there untouched.

## E. Cold-start map (read if you are confused)

**Files touched this session** (grouped; full detail + reasoning is in `docs/AUDIT.md` and `docs/APP_STORE_METADATA.md`, not repeated here):
- zaostock (web): `docs/AUDIT.md` (new), `src/app/privacy/page.tsx`, `src/app/festivals/page.tsx`, `src/app/team/{OnboardingModal,CommentThread,ContactLogPanel,AttachmentPanel}.tsx`, `src/app/circles/CirclesView.tsx`, `src/components/CountdownTimer.tsx`, `package.json`/`package-lock.json` (postcss override), `src/app/api/events/route.ts` (temp diagnostic field, still present - `resolvedHost` in the error response, intentionally left in to help verify the Supabase fix once applied)
- zao-festivals (mobile): `docs/APP_STORE_METADATA.md` (new), `app.json`/`eas.json`-adjacent config (splash screen, `userInterfaceStyle`), `app/(tabs)/{index,events,feedback,more}.tsx`, `app/festival/[slug].tsx`, `app/login.tsx`, `contexts/EventContext.tsx`, `components/{DataListScreen,ConnectWallet}.tsx`, `app/modules/{budget,sponsors}.tsx`, `lib/magnetiq-events.ts` (new, intentionally empty)

**Skills invoked**: `terminals` (steer the ZOE VPS loop remotely), `artifact-design` + `Artifact` (published a weakness-audit report, iterated 3 passes), `handoff` (this bundle), `clipboard` (Supabase fix steps, for Zaal's own quick reference).

**Memory writes**:
- `feedback_verify_supabase_project_before_writes.md` (new) - the wrong-account lesson, both Supabase and Vercel
- `feedback_route_research_to_zoe.md` (new) - route standalone research to ZOE by default
- `MEMORY.md` updated twice to index both

**Last-known mental model**: The app itself (mobile + web) is code-complete and thoroughly audited - error states, accessibility, security deps, lint, a real production build all verified. The ONLY thing stopping a real demo or TestFlight build is infrastructure access Zaal alone has: the Vercel env var (Supabase) and one interactive EAS build. Everything else (screenshots, ZAOville event details, Unlock Protocol) is genuinely next-tier, not blocking.

**Open questions for the receiver**:
- Has Zaal fixed the Supabase env var yet? Check with a live `curl https://zaostock.com/api/events` before assuming anything works.
- Did Zaal have his Kaylan/Magnetiq call yet? If so, get the real ZAOville details.
- Is ZOE's research loop still stuck, or did Zaal check on it himself?

## Inline copy-paste block (for fast receiver paste)

```
Ingest the bundle at .handoffs/session-2026-07-18-park-zaostock-zaofestivals/README.md (in the ZAODEVZ/ZAOstock repo) and follow receiver instructions at the top. 5 tasks to absorb, all parked/non-urgent except confirming whether the Supabase fix has landed.
```
