# Session summary - ZAO Festivals TestFlight push - 2026-07-15


> **Redacted before this file was committed.** This repo is public and these are unreviewed session notes. Personal account identifiers, a third-party company name, an unpermissioned quote and real budget figures were removed on 2026-08-25. Everything else is verbatim. See `docs/CLONE-CONSOLIDATION.md`.

## Goal

Take the ZAO Festivals mobile app (React Native/Expo, multi-event team dashboard covering ZAO-PALOOZA, ZAO-CHELLA, ZAOville, ZAOstock) from "feature complete" to a working TestFlight build a real tester can install and open without crashing.

## Timeline and what actually happened

### 1. Expo/Apple account setup
- Created a fresh Expo Organization `zaofestivals` (not reusing Zaal's existing `wavewarz`/`wavewarz-2` accounts) - this is a genuinely separate project.
- Renamed the app and repo from "zaostock-app"/"ZAOstock" to `zao-festivals`/"ZAO Festivals" to match the multi-event rebrand. Repo: `bettercallzaal/zao-festivals`.
- **Near-miss**: `developer.apple.com` initially showed an *expired* membership under a team belonging to an unrelated organisation [name redacted] - not Zaal's own enrollment. Caught this before proceeding and switched to the correct team, "Zaal Panthaki (Individual)" (Team ID `[redacted]`), via the team switcher. This team still shows in Zaal's account switcher as a leftover; whether it can be removed (he's a member, not the owner) was never resolved - open item.
- Registered bundle ID `com.zaostock.app` in Apple's Identifiers list, created the "ZAO Festivals" App Store Connect app record (App Store Connect app ID `[redacted]`), and filled in `eas.json`'s `submit.production.ios` block (`appleId`, `ascAppId`, `appleTeamId` - real values redacted, they are in the private repo's `eas.json`).

### 2. The TTY discovery
`eas build --platform ios --profile production` needs an interactive Y/N prompt to auto-generate a Distribution Certificate on its *first* run. Neither the agent's Bash tool nor the `!`-prefix "run in this session" mechanism provide a real TTY for that prompt - it silently fails with "Credentials are not set up. Run this command again in interactive mode." Zaal had to run it from an actual separate Terminal.app window to get past this once. After that first run, the certificate exists on Expo's servers ("Using remote iOS credentials"), and every subsequent build works fine with `--non-interactive`, including run directly through the agent's Bash tool in the background.

### 3. Four real bugs, each one only surfacing on a full EAS build/TestFlight cycle

None of these were guessable in advance. Each one passed local sanity checks and only showed up after a 5-40 minute EAS build+submit round trip (or, in the last case, on a real device via TestFlight crash reporting).

1. **wagmi v2/v3 peer conflict.** `@reown/appkit-wagmi-react-native@2.0.6` requires `wagmi@">=2 <3.0.0"`, but `wagmi@^3.7.1` was installed. `--legacy-peer-deps` (used in all local `npm install` calls) silently allowed the mismatch; EAS's clean `npm ci` doesn't, and failed loudly. Fix: `npm install wagmi@^2`.

2. **Test files bundled into the app.** `expo-router`'s file-based routing sweeps up every file under `app/`, including `app/(tabs)/index.test.tsx` and `app/modules/sponsors.test.tsx`. Those import `@testing-library/react-native`, which imports Node's `console` module - unresolvable in a React Native bundle, fatal on `expo export:embed` (the exact command EAS's "Bundle JavaScript" build phase runs). Fix: added `metro.config.js` with `resolver.blockList` excluding `*.test.tsx`.

3. **Unconfigured wallet SDK crashing the entire app at launch.** `EXPO_PUBLIC_REOWN_PROJECT_ID` was never set (Zaal hadn't created a Reown/WalletConnect project yet). WalletConnect's core throws synchronously on an empty `projectId`, and both `WagmiAdapter` and `createAppKit()` ran as a module-load side effect in `lib/wallet-config.ts`, imported unconditionally from `app/_layout.tsx` - so the *whole app* crashed on launch, not just the wallet feature. Fix: added an `isWalletConfigured` flag; `app/_layout.tsx` skips mounting `AppKitProvider`/`WagmiProvider`/`AppKit` entirely when unconfigured, and the two `ConnectWallet` call sites (`app/login.tsx`, `app/settings/link-wallet.tsx`) swap in a plain-text fallback since those hooks require the now-unmounted providers. Code-based sign-in (the primary auth path) was unaffected either way.

4. **`react-native-worklets` native framework never embedded.** This one only showed up as a real on-device TestFlight crash (build 1.0.0(7)): `DYLD 1 Library missing: RNWorklets.framework`, referenced from `RNReanimated.framework`. `react-native-worklets` was only a **peer** dependency of `react-native-reanimated` (pulled in transitively via `expo-router` -> `react-native-drawer-layout` -> `react-native-reanimated`), never a direct one. It resolved fine at the npm/JS level (present in `node_modules`, satisfied the peer range) but Expo's native build never embedded its compiled framework into the app bundle - a DYLD-level failure invisible to typecheck, lint, jest, and even a full `expo export:embed` bundle check, since none of those touch native linking. Fix: `npx expo install react-native-worklets`, making it a direct dependency so Expo's autolinking treats it as first-class. **Confirmed as the documented, known fix** via software-mansion's own Reanimated GitHub issues (#8309) after the fact - this is a known SDK 54+ footgun, not something specific to this project.

Diagnosis method for #4: downloaded the actual crash log from App Store Connect -> TestFlight -> Crashes (click the download icon in the crash detail modal -> `testflight_feedback.zip` -> `crashlog.crash` has the real symbolicated trace, `feedback.json` has metadata). The `Termination Reason: DYLD 1 Library missing` line named the exact missing framework - no guesswork needed once the log was in hand.

Build 1.0.0(8) shipped with all four fixes and submitted to TestFlight cleanly (no queue this time, "Submitted your app to Apple App Store Connect!" in under a minute).

### 4. A fifth, self-inflicted bug (caught before it mattered)

While fixing #2 above, `metro.config.js`'s `resolver.blockList` was set via plain assignment (`config.resolver.blockList = [...]`), which **overwrote** Expo's own default blockList entries (`ios/Pods`, `android/*/build`) instead of appending to them. This only matters for a *live* Metro dev server (`expo run:ios` / `expo start`), not EAS's one-shot `expo export:embed` - so it never affected the TestFlight builds, but it did cause a real reload/churn problem the moment a local Xcode Simulator session was started to debug something else. Fixed by spreading the existing blockList instead of replacing it.

### 5. Still open: "reloading, black and white, and small"

After build 1.0.0(8) reached TestFlight, Zaal reported the app "reloading black and white and small" - confirmed as happening on his real device (build 8), not something he was seeing on this Mac. Investigation so far:

- No new crash report in App Store Connect's Crashes tab for build 8 as of this session's end (Apple's session expired mid-check and couldn't be re-verified - password/2FA entry is off-limits for the agent to do itself).
- Set up a local Xcode Simulator session (`npx expo prebuild --platform ios --clean` + `npx expo run:ios`) to get direct visual/console access, since App Store Connect's own tooling can't show live UI state.
- The simulator consistently shows a **fully blank white screen** (only the Dynamic Island renders) across multiple rebuilds, even after confirming Metro is reachable (`packager-status:running`) and the app is genuinely launched (`simctl launch` returns a real PID).
- Found and fixed the Metro/Pods blockList regression above along the way - real bug, but not confirmed as *the* cause of the blank screen.
- A full code-review audit (`everything-claude-code:code-reviewer` agent) flagged `StatusBar` positioning and a missing explicit `SafeAreaProvider` as "critical" - **treated with skepticism, not accepted at face value**: `expo-status-bar`'s `<StatusBar />` is a non-visual component that only calls a native status-bar API, so its position in the component tree shouldn't affect sibling layout/rendering. This claim was not verified as correct before the session ended.
- `app.json` has no `"splash"` key configured, meaning Expo's default behavior *is* a blank white screen (not a branded image) while the native splash is up - consistent with what's being seen, but doesn't explain why the JS bundle never finishes mounting to replace it.
- Last action before this summary: a fresh clean rebuild (`Build Succeeded`, 0 errors), app installed and launched on the simulator - screenshot check was in progress when this summary was written. **Root cause not yet confirmed.**

## Other work this session

- **Research agents** (background, parallel): audited ZAO OS V1's prior research on native app strategy (`research/infrastructure/218-mobile-app-strategy-pwa-native`, `416-native-app-testflight-playstore`, and others) and found a real, unflagged divergence worth resolving later - that research recommended a **Capacitor-wrapped Next.js app**, not a standalone React Native/Expo codebase; ZAO Festivals was built as the latter. Whether that's an intentional pivot or something to reconcile was not decided. A second agent researched what makes festival/event apps genuinely good (offline-first schedules/maps, personalized lineup builders, targeted-not-spammy push notifications, hybrid NFT-loyalty-not-NFT-gating for web3 features) with sourced findings - see agent output in this session's transcript for the full report.
- **Created a new Claude Code skill**, `~/.claude/skills/expo-ios-app/skill.md` - encodes every fix above as a reusable pre-flight checklist (`npm ci` clean install, `npx expo-modules-autolinking verify -v`, `npx expo-doctor`, the exact `expo export:embed` bundle check, and critically, an actual `expo run:ios` Simulator smoke test - the one check that catches native-linking bugs nothing else does) plus the metro.config.js append-not-replace pattern, the optional-SDK-gating pattern, the EAS non-interactive TTY gotcha, and a TestFlight crash-diagnosis walkthrough.
- Evaluated whether to rebuild the app from an open-source template instead of continuing to fix forward. Decision: no - the app is already past its first TestFlight release with working infra; switching cost outweighs the benefit. Identified Obytes' React Native Template (github.com/obytes/react-native-template-obytes) as a well-maintained reference worth diffing config against for *future* projects, not a migration target for this one.

## Open items for next session

1. **Confirm and fix the "reloading/black-and-white/small" bug.** Last known state: blank white screen in local Simulator persists after the Metro/Pods regression fix; root cause unconfirmed. Next step is almost certainly to get real-time JS console output (Metro's terminal output, not device syslog) to see if there's a silent JS exception, or to check whether `AuthProvider`'s effect is actually resolving (`loading` state stuck `true` forever would produce exactly this symptom - a permanent `ActivityIndicator`-only screen, easily mistaken for "blank" against a white background).
2. Set `EXPO_PUBLIC_REOWN_PROJECT_ID` once Zaal creates a Reown project at dashboard.reown.com - wallet-connect currently self-disables cleanly but isn't functional yet.
3. Resolve the stale Apple team belonging to the unrelated organisation [name redacted] - Zaal is a member, not owner, so full deletion may not be possible; leaving/removing himself as a member is the likely lesser action, never executed.
4. Decide whether the Capacitor-vs-Expo divergence from ZAO OS's prior research needs reconciling, or was an intentional call.
5. Consider adding Sentry (`@sentry/react-native`) for real symbolicated crash reports instead of the manual TestFlight-crash-zip-download workflow - flagged as a recommended addition in the new skill, not yet implemented.

## Key files touched this session

- `app.json`, `eas.json` - rebrand, EAS project link, App Store Connect submit config
- `metro.config.js` - new file, test-file exclusion (with the blockList append fix)
- `lib/wallet-config.ts`, `app/_layout.tsx`, `app/login.tsx`, `app/settings/link-wallet.tsx` - wallet SDK gating
- `package.json` - wagmi downgrade, `react-native-worklets` direct dependency
- `~/.claude/skills/expo-ios-app/skill.md` - new skill, this session's lessons encoded for reuse
