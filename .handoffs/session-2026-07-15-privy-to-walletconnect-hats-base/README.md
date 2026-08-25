# Session handoff - 2026-07-15 07:59
> from zaostock (main, clean) -> to ZOE via Bonfire
> doc: /Users/zaalpanthaki/Desktop/repos/zaostock/.handoffs/session-2026-07-15-privy-to-walletconnect-hats-base/README.md
> chain: sibling:/Users/zaalpanthaki/Desktop/repos/zaostock/.handoffs/session-2026-07-14-team-access-hats-streaming/README.md

## Receiver instructions (read me FIRST, then do exactly this)

You just received a handoff bundle. Do NOT start work yet. Do this:

1. Read ALL sections below (A through E) before responding to anything.
2. Create TaskList entries from section A. These are the "to do" items.
3. Use section B as your "why" - do NOT re-litigate decisions captured there unless new info surfaces.
4. Use section D to know what's still running (background jobs, wakeups, subagents) - should be none.
5. Use section E as your cold-start map for files, skills, memory state.
6. Once integrated, message back: "Ingested handoff privy-to-walletconnect-hats-base. N tasks queued. Ready."

## A. Tasks to absorb (paste these into your TODO list)

- [ ] Decide with Zaal: keep the merged Privy email-login path live, or rip it out for Reown AppKit wallet-connect. He verbally chose wallet-connect mid-session (rejected holding key material, even inert/dormant), but nothing's been removed yet - Privy's client (login screen, link-email settings screen) and server (`/api/team/privy-login`, `/api/team/link-email`) are both live on `main` in both repos.
- [ ] If wallet-connect is confirmed: build Reown AppKit (`@reown/appkit-react-native` or current package name - verify against docs.reown.com, package names shift) + Sign-In With Ethereum verification. Real cost to know going in: Reown AppKit needs `expo prebuild` (native modules Expo Go can't handle), which moves `bettercallzaal/zaostock-app` off the pure-JS managed workflow it's been in for every prior slice. EAS Build (already configured) handles prebuild fine in the cloud; local dev changes from instant Expo Go to a custom dev client build.
- [ ] Once real member wallet addresses exist (via wallet-connect): mint the Hat to each address under the ZAO tree - now decided to be on **Base**. Hats Protocol's contract address is identical across all chains it's deployed to, confirmed for Base: `0x3bc1A0Ad72417f2d411118085256fC53CBdDd137` (source: docs.hatsprotocol.xyz). Then build the actual gate: a Base RPC read of `isWearerOfHat(address, hatId)` - free, real-time, no gas, and it self-revokes the instant Zaal pulls the hat.
- [ ] Zaal's own action items, unblocked but not yet done: (a) if Privy stays, paste `PRIVY_VERIFICATION_KEY` into Vercel env vars (from Privy dashboard > Settings - NOT the App Secret, a narrower credential); (b) either way, run `eas login` / `eas init` and set up the App Store Connect app record per `bettercallzaal/zaostock-app/RELEASE.md` - Apple Developer enrollment is done, this is the only remaining gate on App Store submission.
- [ ] Pick up the livestreaming hardware research Zaal just pivoted to (separate thread, see Section B - "Also in flight" note). Not yet started as of this handoff.

## B. Why - decisions + pivots + ruled-out paths

- **Why Hats-gating at all**: Zaal wants the team dashboard "super web2 user experience friendly" while keeping real on-chain roles as the source of truth for access - a callback to an old team-management idea (weekly-message-or-you're-inactive) that got reimplemented as an automatic 3-day login-inactivity lockout earlier this session (see the 2026-07-14 sibling handoff), with Hats as a parallel/future access mechanism, not a replacement for that lockout system.
- **Privy was fully built and merged, then reconsidered - not a failure, a real architecture pivot**: client SDK wiring (email OTP login, embedded-wallet creation, a "link email" settings screen) and server-side identity-token verification (`verifyIdentityToken` from `@privy-io/node`, using just the JWT Verification Key rather than the full App Secret - deliberately narrower-scoped, since this app never needed wallet/API access, only "who verified this token") both shipped across 4 separate PRs, all merged, all passing typecheck/lint/test/boot-verify. This was NOT wasted motion - the research and the merged code are both real and correct for what Privy is good at. Zaal's objection was specific: **holding any private key server-side, even one that's currently inert (never signs anything under the Hats-gating plan), still felt like an unacceptable custody liability.** That's a legitimate, considered rejection, not a misunderstanding to correct.
- **Wallet-connect (Reown AppKit + SIWE) chosen instead, once the real requirement got clarified**: research this session established that Hats minting is admin-only and needs zero wearer signature, and that checking who wears a hat is a free, real-time on-chain read (`isWearerOfHat`, wraps `balanceOf`, dynamically re-checks eligibility + toggle modules on every call - no lag between revocation and losing access). Given that, the member's wallet NEVER needs to sign anything under the current plan - which means the actual requirement is just "a stable address we can point a read-check at," not a fully custodied signing wallet. Wallet-connect (member connects their own existing wallet, proves ownership via a signed SIWE message, we store only the public address) satisfies that with zero custody at all - stricter than even Privy's non-custodial model, since we hold literally nothing.
- **Why this fits the team specifically**: the ZAO team is web3-native already (WaveWarZ on-chain battles, ZOLs, the whole ecosystem) - most members plausibly already have a wallet from other ZAO activity, so "connect the wallet you already have" is a more natural ask for this specific audience than it would be for a general-public app. This is a case where the "make it web2 friendly" framing from the original ask (see the earlier 2026-07-14 conversation) turned out to be slightly miscalibrated to the actual audience - they're not fully web2-naive users needing everything hidden, they're web3-adjacent people who want convenience, not hand-holding.
- **Friction/real cost surfaced, not glossed over**: Reown AppKit requiring `expo prebuild` is a genuine complexity jump versus everything built so far in the mobile app, which stayed 100% Expo-managed-workflow (no native modules) through 5 prior merged slices (scaffold, login/home, all dashboard modules, EAS config, and even the now-reconsidered Privy work - Privy's `@privy-io/expo` package notably did NOT need prebuild, it worked in the managed workflow). This is the first slice that would force that jump. Worth Zaal being fully aware of before greenlighting the build, not discovered mid-implementation.
- **ethskills.com surfaced as a resource**: an AI-agent-specific Ethereum knowledge base (built by Austin Griffith/BuidlGuidl + Ethereum Foundation) meant to stop agents from hallucinating wrong contract addresses/patterns. Directly relevant to the wallet-connect + Hats-on-Base build - worth pulling from (`/ship/SKILL.md` entry point per its own docs) when actually implementing, to ground the code in verified current patterns rather than training-data recall.
- **Also in flight, separate thread**: right after requesting this handoff, Zaal pivoted to "focus on livestreaming for live events and find out what hardware we need." This is a fresh ask, not yet researched in depth this session - prior sessions researched RENTAL vendors (Beverly Boy Productions for Ellsworth/ZAOstock; Breasia Productions, AVALive $125/wk ATEM Mini Pro ISO, Red Star Pictures for ZAOville/Laurel MD - see ZAOOS research doc 1030), but "what hardware do we need" reads as a fresh needs-assessment (camera, switcher, audio, encoder, tripod, lighting checklist) rather than more vendor-shopping. Whoever picks this thread up should confirm with Zaal whether he wants a buy list, a rent list, or both, and for which event(s) specifically.

## C. Git state

- Repo: `zaostock` (bettercallzaal/ZAODEVZ, web), branch `main`, clean except this handoff doc itself (untracked, not committed - matches this repo's established pattern of `.handoffs/` staying local/uncommitted).
- Repo: `zaostock-app` (bettercallzaal/zaostock-app, mobile), branch `main`, clean, all Privy work merged (PRs #1-#7 in that repo, all squash-merged).
- No open PRs in either repo as of this handoff. No uncommitted diffs, no pending pushes.
- No worktrees remain checked out - all cleaned up as each slice merged this session.

## D. In-flight

- Background bash jobs: none pending.
- Subagents pending: none.
- Scheduled wakeups: none.
- Open AskUserQuestion: none - the Privy-vs-wallet-connect question got a real verbal answer ("i dont wanna hold keys thats alot a bad option, can we just add a simple connect wallet"), it's resolved as a decision (see Section B), just not yet built.

## E. Cold-start map (read if you are confused)

- Files touched this session (high-level - this was a long session, see Section B for the narrative):
  - `zaostock` repo: team inactivity-lockout feature + 4-issue security-audit fix pass (session started with these already in flight from the prior 2026-07-14 handoff); `/api/team/rsvps` GET route; bearer-token mobile auth bridge (`session.ts`, `verify-team-password.ts`, `/api/team/mobile-login`); Privy server verification (`verify-privy-identity.ts`, `/api/team/privy-login`, `/api/team/link-email`, `team_members.email` migration).
  - `zaostock-app` repo (new this session): full Expo/TypeScript scaffold, expo-router nav shell, real login + bearer-token auth, every Dashboard.tsx module ported to a read-only mobile screen (sponsors/artists/timeline/volunteers/budget/notes/rsvps), EAS build config + RELEASE.md runbook, and the full Privy client integration (now reconsidered - see Section B).
  - ZAOOS repo: doc 1030 Finding 8 (real ZAOville streaming vendors) - merged earlier this session, unrelated to the Privy/Hats thread.
- Skills invoked: `clipboard` (2x - Privy/App Store next-steps page, general use), `handoff` (this one).
- Memory writes: none new this session.
- Last-known mental model: the mobile app itself is feature-complete and stable (5 merged slices, all verified). The auth-provider question (Privy vs wallet-connect) is DECIDED but NOT YET BUILT - Privy's code is still live on both `main` branches even though Zaal doesn't want to ship it. Whoever resumes should treat "swap Privy for wallet-connect" as the next real slice, not treat Privy as done-and-final just because it's merged. Separately, Zaal has now moved his own attention to livestreaming hardware - that's a context-switch, not an abandonment of the Hats/wallet-connect thread.
- Open questions for the receiver: (1) does Zaal want Privy's merged code actively removed now, or left dormant/unused until wallet-connect is ready to replace it in one swap; (2) for the livestreaming hardware question, is he asking for a buy-list, confirming the rent-vs-buy decision from earlier research, or something else - don't assume, ask him directly when that thread resumes.

## Inline copy-paste block (for fast receiver paste)

```
Ingest the bundle at /Users/zaalpanthaki/Desktop/repos/zaostock/.handoffs/session-2026-07-15-privy-to-walletconnect-hats-base/README.md and follow receiver instructions at the top. 5 tasks to absorb.
```
