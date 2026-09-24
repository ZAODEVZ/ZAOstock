# ZAO Festivals / ZAOstock — project audit

Compiled 2026-07-17/18. Every finding here was independently confirmed - live curl checks against production, direct code reads, git/deploy history, real `npm audit` and `npm run build` runs. Nothing guessed.

Two repos:
- **Web** (`zaostock`, this repo) — zaostock.com, team dashboard, all API routes
- **Mobile** (`bettercallzaal/zao-festivals`) — the ZAO Festivals iOS/Android app, a client of this repo's API

---

## BLOCKING — needs Zaal

> **Compiled 2026-07-17/18. Item 1 below was RESOLVED on or before 2026-08-31 and
> is kept only as history.** The heading used to read "nothing else matters until
> this is done", which was true in July and false by September - a record that
> stayed loud after it stopped being true, at the top of the document people read
> first. Items 2 and 3 are UNVERIFIED from this seat: they need a real device and
> an EAS build, which cannot be measured from here.
>
> **Re-checked 2026-09-16, still true, still unmeasurable from this seat -
> not a blind bump.** `bettercallzaal/zao-festivals` (the mobile repo #2 and
> #3 live in) has had no push since 2026-08-25T18:44Z - three weeks with no
> commit, so nothing has moved on either item since the last check. No local
> checkout at `/tmp/zaostock-app` to build from even if this seat could run
> `eas build` (it cannot - Zaal's own terminal only, see #2). The condition
> that would resolve this: Zaal runs the EAS build himself. Re-check again
> only after that happens, not on a calendar - a date-only re-check on an
> item nobody has touched just re-confirms the same "cannot measure" every
> time and trains the reader to stop reading it.
>
> **Re-verified 2026-09-24, and the guard fired to force it.** The marker below
> came due on 2026-09-23 and `src/content/recheck.test.ts` failed the build on
> `main`, which is the mechanism working. The re-verification, run today:
> `gh api repos/bettercallzaal/zao-festivals --jq .pushed_at` returns
> **`2026-08-25T18:44:44Z`** - 30 days, unchanged since the 2026-09-16 check, so
> items 2 and 3 still stand exactly as written. **Nothing here was bumped
> blind.**
>
> **The mismatch this exposed, recorded rather than papered over:** these three
> items declare an EVENT re-check condition (Zaal runs `eas build`) while the
> guard understands only DATES. So the guard will keep firing on a calendar for
> items whose own text says not to re-check on a calendar. The date below is
> moved past the festival to 2026-10-10 rather than to a week out, because
> firing again during festival week is noise on a build nobody can act on. If
> the guard fires on 2026-10-10 and the mobile repo is still untouched, the fix
> is an event-aware marker in `recheck.test.ts`, not a fourth bump.
> <!-- re-check: 2026-10-10 -->

### 1. ~~Production is pointed at the wrong Supabase database~~ — RESOLVED

**Measured 2026-09-08 using this section's own verification command:**

```
curl -s https://zaostock.com/api/events
{"events":[{"id":"b49b8db0-8948-4f31-8202-d46ae3b92bd6","name":"ZAO-PALOOZA",...
```

Real event JSON, no `PGRST205`. And the returned IDs match a direct query against
the `yjrlaxpjusmrfylumban` project row for row, so production and the real
database are demonstrably the same project - not merely "responding".

<!-- measured 2026-09-08T21:15Z - zao-measure --verify "zaostock api events returns real json not PGRST205" -->

`src/lib/event-slugs.ts` dates the repoint: *"when production was repointed at the
real project on the morning of 2026-08-31 the event lookup started succeeding."*
That repoint is also what surfaced the `zaostock-2026` slug bug - fixing the
database is what broke the client, which is the shape of bug that only appears
when the thing above you gets better.

<details><summary>What this said, and why it is left here</summary>

### 1. Production is pointed at the wrong Supabase database
`zaostock.com`'s live `NEXT_PUBLIC_SUPABASE_URL` resolves to `etwvzrmlxeobinrlytza.supabase.co` — an unrelated project — instead of the real production database, `yjrlaxpjusmrfylumban` ("ZAO STOCK"). Confirmed by posting a real test write through the live public API and watching it fail on a schema mismatch (the wrong project's `suggestions` table has a different schema entirely). Every event, RSVP, and lineup fetch is currently broken because of this.

**Fix**, in the Vercel dashboard → `za-ostock` project (under **"thezao's projects" team, not any personal Vercel account**) → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL` (Production) → `https://yjrlaxpjusmrfylumban.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` (Production) → get the real value from **Supabase Dashboard → "ZAO STOCK" project → Settings → API → service_role key**
- Save, then redeploy (Deployments tab → Create Deployment, or it may auto-redeploy on save)

Verify: `curl https://zaostock.com/api/events` should return real event JSON, not a `PGRST205` error.

</details>

### 2. Push notifications capability was never synced (real device required)
**UNVERIFIED from this seat as of 2026-09-08** - needs a real device and an EAS
build. Neither is measurable from here, so this is neither confirmed open nor
closed. **Re-checked 2026-09-16: still unverified, and still cannot be -
`bettercallzaal/zao-festivals` has had no push since 2026-08-25T18:44Z, three
weeks with no build attempt on record. Re-verified 2026-09-24: `pushed_at` is
still `2026-08-25T18:44:44Z` (GitHub API, this repo's own metadata), now 30
days, so no build attempt has been made since.** The re-check condition is Zaal
running the command below, not a date. <!-- re-check: 2026-10-10 -->
Build 13 failed on this and was never retried until this session. Run from a **real Terminal.app window**, not through Claude Code:
```
cd /tmp/zaostock-app   # or wherever the mobile repo is checked out locally
eas build --platform ios --profile production
```
Expect a prompt about syncing provisioning/capabilities — confirm yes.

### 3. Fresh TestFlight build once #2 is confirmed
**UNVERIFIED from this seat.** Note the precondition changed: this used to wait on
#1 and #2. #1 is resolved, so only #2 gates it. **Re-checked 2026-09-16: #2 is
still unconfirmed (see above), so this is still gated on it, unchanged.
Re-verified 2026-09-24: #2 is still unconfirmed on the same evidence, so this is
still gated, still unchanged.**
<!-- re-check: 2026-10-10 -->
```
cd /tmp/zaostock-app
eas build --platform ios --profile production
eas submit --platform ios --profile production --latest
```
`eas.json` already has real submit credentials configured (`ascAppId`, `appleTeamId`) — submit should run non-interactively. This is Zaal's step to trigger, not something to run automatically.

---

## Fixed this session

| Area | What was wrong | Fix |
|---|---|---|
| Mobile: Home screen | Blank screen on any fetch failure, no retry | Error text + retry button + pull-to-refresh (`bettercallzaal/zao-festivals` PR #21) |
| Mobile: Festival detail + all 7 team modules | Real fetch errors misreported as "not found" / "nothing here" | Proper error state, retry buttons (PR #23) |
| Mobile: splash screen | `expo-splash-screen` was never installed — blank white flash before content loaded; the placeholder asset was also still the unmodified default Expo template icon | Configured with real ZAO branding on the app's dark background (PR #22) |
| Mobile: `userInterfaceStyle` | Set to `light` despite the entire app being dark-themed | Switched to `dark` (PR #22) |
| Mobile: budget/sponsors | `$0` amounts silently hidden (JS falsy-zero bug) | Fixed the check to `!= null` (PR #25) |
| Mobile: ConnectWallet | No haptic feedback, unlike every other action in the app | Added (PR #25) |
| Mobile: `EventContext.tsx` | `react-hooks/set-state-in-effect` lint error | Derive empty state at render instead of reset-via-effect — mobile repo is 0 errors, 0 warnings now |
| Mobile: 51 tappable elements | Zero explicit `accessibilityLabel`s; buttons that swap to a bare spinner announced nothing to VoiceOver | Labeled every loading-state-swap button (RSVP, sign-in, feedback send, retry) plus festival rows and Events tab buttons |
| Web: `/festivals` dead cards | ZAO-PALOOZA/ZAO-CHELLA had no click target | Now scroll to the recap section (PR #28) |
| Web: `zaofestivals.com` | Fully broken (TLS handshake failure), not just stale | Redirected to `zaostock.com/festivals` |
| Web: `OnboardingModal.tsx`, `CountdownTimer.tsx`, `CommentThread.tsx`, `ContactLogPanel.tsx`, `AttachmentPanel.tsx`, `CirclesView.tsx` | Same `react-hooks/set-state-in-effect` pattern in 6 places (2 more turned up during verification than the first pass caught) | Real fixes where possible (lazy init), documented suppressions where the pattern is genuinely correct (SSR hydration guard, standard fetch-on-mount). Web repo: 0 errors, 5 known/deliberately-deferred warnings (the `<img>` ones below) |
| Web: postcss XSS (moderate) | Next.js's internally-pinned postcss (8.4.31) was in the vulnerable range; root postcss was already safe | Package override forcing 8.5.19 everywhere. `npm audit` → 0 vulnerabilities. Verified with a real `npm run build`, not just a version bump |
| Web: privacy policy | Predated the mobile app's push notification feature | Added a section on device push tokens |
| Web: ZAO-CHELLA artist count | Homepage said "16+ musicians," `/festivals` said "10 artists," for the same event | Aligned to the homepage's more detailed figure |

## Still open — not blocking, but real

| Severity | Finding | Why not fixed tonight |
|---|---|---|
| High | `ws` package (WebSocket lib, via wagmi/WalletConnect) has a HIGH-severity DoS vuln, CVSS 7.5, currently in the installed range | Fix requires a semver-major wagmi bump — genuine breaking-change risk to the wallet-connect flow. Deliberately not touched right before a demo; needs real testing time, not a blind auto-fix |
| Moderate | No production monitoring/alerting at all | The Supabase misconfiguration above went unnoticed until manual investigation. A cheap uptime check on `/api/events` (even a free-tier pinger) would close this |
| Moderate | Two Vercel accounts + two Supabase projects with confusingly similar names | Real near-miss happened twice this session before dashboard screenshots settled which was which. Underlying account sprawl still exists |
| Moderate | 40 web API routes, zero route-level tests | The 5 existing test files only cover small utility functions |
| Moderate | Mobile: 2 test files for 21 screens/components | Fine for a small volunteer project, but "typecheck is green" ≠ "it works" |
| Moderate | No push opt-in for regular fans (only team members) | Feature build, not a fix — flagged in product research as the single highest-leverage engagement gap |
| Moderate | No day-of "live ops" alert path for schedule changes | Same — feature build |
| Minor | Name collision with an established 22K-follower band ("Zao") in search results | Not a code fix — marketing/SEO problem |
| Minor | Naming/capitalization split across the series (PALOOZA/CHELLA hyphenated+caps, ville/stock not) | Brand style decision, needs Zaal's call |
| Minor | 3 raw `<img>` tags instead of `next/image` (perf) | **Deliberately skipped** — only 5 image domains are allowlisted (twitter/imgur/postimg); `photo_url` is dynamic user data that couldn't be verified against that list while the backend was down. Converting risked silently breaking real team photos for a perf warning. Revisit once the backend is confirmed fixed and real photo URLs can be checked |
| Minor | No onboarding/permission priming before the push notification OS prompt | Feature build |
| Watching | ZOE's async research loop got fixated on an unrelated PR and didn't pick up a queued research task across 3 checks (~45+ min) | Flagged to Zaal directly rather than silently re-polling; worth checking why its own loop deprioritizes one-off asks |

---

## If you only do three things
1. **Fix the Supabase env var.** Nothing else can even be tested until this lands.
2. **Put a cheap uptime check on `/api/events`.** The core lesson of this session: it broke silently and stayed broken. A five-minute pinger closes that gap for good.
3. **Decide the wagmi/ws upgrade timing.** Real HIGH-severity vuln, but a breaking-change fix — schedule it deliberately, don't rush it before a demo.
