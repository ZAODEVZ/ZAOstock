# ZAO Festivals / ZAOstock — project audit

> **Re-audit 2026-08-09 — event is Sat Oct 3, 2026 (~8 weeks out). See the
> "2026-08-09 re-audit" section immediately below. The original 2026-07-18
> record follows it unchanged as the historical baseline.**

---

## 2026-08-09 re-audit + fixes (web repo)

Re-verified every open item from July against the current tree. What changed,
and what got fixed this session (branch `claude/project-audit-setup-97su1b`):

### Fixed this session

| Area | Was | Fix |
|---|---|---|
| `/api/events` temp diagnostic | 500 responses leaked raw `error.message`, `code`, and `resolvedHost` to any caller (a July debugging aid, left in) | Reverted to a plain `{ error: 'Failed to load events' }`; full error stays in server logs only (`src/app/api/events/route.ts`) |
| Dependency vulns | `npm audit` reported **6** (5 high, 1 moderate): `next` (9 advisories incl. middleware bypass, SSRF, DoS), `sharp`, `nanoid`, `postcss` | `npm audit fix` → patched-version bumps in the lockfile only (`next` 16.3.0, `nanoid` 3.3.18, `postcss` 8.5.26, `sharp` patched). **`npm audit` → 0 vulnerabilities.** Verified with a real `npm run build` |
| No health endpoint | Nothing to monitor but the raw public routes | Added `GET /api/health` — cheap HEAD/count round-trip to the DB, returns `{ status, db: { ok, host, latencyMs } }` and 503 when the DB is unreachable/misconfigured. Surfaces the connected Supabase host — the exact signal that would have caught the July outage |
| No uptime monitoring (July's #2 "if you only do three things") | Prod broke silently in July and stayed broken | Added `.github/workflows/uptime.yml` — pings `/api/health` + `/api/events` every 15 min, fails the run (→ GitHub emails admins) on non-200. Optional repo vars `PROD_BASE_URL`, `EXPECTED_DB_HOST` let it also assert prod is pointed at the right Supabase project |

### Resolved on their own since July (dependency drift, no action needed)

- **`ws`/wagmi HIGH DoS (CVSS 7.5)** — `wagmi` is no longer a dependency at
  all; `ws` is now 8.21.0 (the fix landed in 8.17.1). `viem` remains for the
  wallet flow. **This blocker is gone.**

### Still open — needs Zaal / live access (cannot be done from a cloud session)

- **Supabase prod env var** — could not be verified this session: the cloud
  sandbox's network policy blocks `zaostock.com` and `mcp.supabase.com` (403).
  Confirm with `curl https://zaostock.com/api/health` — a healthy `db.host` of
  `yjrlaxpjusmrfylumban.supabase.co` means the July fix is in place. If it
  still shows a different host, apply the fix in the July section below.
- **Turn on the uptime workflow's guard rail** — set repo variable
  `EXPECTED_DB_HOST=yjrlaxpjusmrfylumban.supabase.co` (Settings → Secrets and
  variables → Actions → Variables) so a wrong-database regression fails loudly.

### Still open — deliberately deferred, unchanged reasoning

- **5 `<img>` lint warnings** (BioEditor ×2, TeamRoles, MemberProfileView,
  TeamMosaic) — still deferred for the July reason: `photo_url` is dynamic
  user data and `next/image` only allows 5 image hosts; converting risks
  breaking real team photos from an un-allowlisted host. 0 lint *errors*.
- **Route-level test coverage** — still only 5 unit-test files (lib utils);
  the ~40 API routes have no route tests. Fine for a volunteer project, worth
  knowing before the event.

**Current gate (this branch): `npm audit` 0 vulns · typecheck clean · lint 0
errors / 5 warnings · 17/17 tests pass · `next build` succeeds.**

---

## Original record — compiled 2026-07-17/18

Every finding here was independently confirmed - live curl checks against production, direct code reads, git/deploy history, real `npm audit` and `npm run build` runs. Nothing guessed.

Two repos:
- **Web** (`zaostock`, this repo) — zaostock.com, team dashboard, all API routes
- **Mobile** (`bettercallzaal/zao-festivals`) — the ZAO Festivals iOS/Android app, a client of this repo's API

---

## BLOCKING — needs Zaal, nothing else matters until this is done

### 1. Production is pointed at the wrong Supabase database
`zaostock.com`'s live `NEXT_PUBLIC_SUPABASE_URL` resolves to `etwvzrmlxeobinrlytza.supabase.co` — an unrelated project — instead of the real production database, `yjrlaxpjusmrfylumban` ("ZAO STOCK"). Confirmed by posting a real test write through the live public API and watching it fail on a schema mismatch (the wrong project's `suggestions` table has a different schema entirely). Every event, RSVP, and lineup fetch is currently broken because of this.

**Fix**, in the Vercel dashboard → `za-ostock` project (under **"thezao's projects" team, not any personal Vercel account**) → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL` (Production) → `https://yjrlaxpjusmrfylumban.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` (Production) → get the real value from **Supabase Dashboard → "ZAO STOCK" project → Settings → API → service_role key**
- Save, then redeploy (Deployments tab → Create Deployment, or it may auto-redeploy on save)

Verify: `curl https://zaostock.com/api/events` should return real event JSON, not a `PGRST205` error.

### 2. Push notifications capability was never synced (real device required)
Build 13 failed on this and was never retried until this session. Run from a **real Terminal.app window**, not through Claude Code:
```
cd /tmp/zaostock-app   # or wherever the mobile repo is checked out locally
eas build --platform ios --profile production
```
Expect a prompt about syncing provisioning/capabilities — confirm yes.

### 3. Fresh TestFlight build once #1 and #2 are both confirmed
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
