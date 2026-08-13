# ZAOstock Locals-First Homepage Reorder (PR 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorder the homepage so an Ellsworth local reaches when, where, the after-party and the RSVP button before sponsorship tracks, the Pro Ticket ask and festival lineage.

**Architecture:** Pure section moves inside `src/app/page.tsx`. Zero copy changes, zero markup changes, zero new components. The diff must read as "these blocks moved" and nothing else.

**Tech Stack:** Next.js (App Router, server components), TypeScript, Tailwind v4, vitest.

## Global Constraints

- NO copy changes. Not one word. Wording was settled in PR 1 (merged as `7be207e`).
  Any wording change belongs in a different PR.
- NO markup changes - no className edits, no wrapper changes, no component swaps.
- The publication rules from PR 1 still hold and are unaffected by moving blocks: no
  performer names, no date other than October 3, Black Moon publishable, free to attend
  with `ticket.zaostock.com`.
- The ZAOville lineage card stays exactly as-is, including its DCoop mention. Still
  Zaal's call, still not the implementer's.
- No deploy, no posting, no tracker or bot writes. PR only.

**Repo:** `~/Documents/ZAOstock-canonical` (remote `ZAODEVZ/ZAOstock`) - CONFIRMED canonical
on 2026-08-13. NOT `~/Documents/zaostock` (archived `bettercallzaal/zao-stock`), NOT
`bettercallzaal/zaostock` (archived), NOT `bettercallzaal/zao-festivals` (a private
Expo/React Native team dashboard, a different product entirely).

**Branch:** `ws/zaostock-locals-first-reorder-0813`, cut fresh from `origin/main` at
`7be207e`. PR 1's branch is merged and must not be reused.

## Section order

Current (14 top-level sections):

```
Header, Hero, Countdown, Lineup, About, Manifesto+stats, Plug in, Where,
After Hours, Team, Partners, Pro Ticket, Volunteer+RSVP, Sponsors, Lineage, Footer
```

Target:

```
Header, Hero, Countdown, Where, After Hours, Volunteer+RSVP, Lineup, Plug in,
About, Manifesto+stats, Team, Partners, Pro Ticket, Sponsors, Lineage, Footer
```

SPEC GAP, resolved here: the design spec's target order omitted "Manifesto + stats bento"
(How We Run It). It is placed immediately after About, which is where it sits adjacent
today. This is a deliberate, recorded choice, not an oversight.

The `TODO[photos]` comment block currently trailing the Hero travels with the Hero. It is
a code comment, not public copy.

---

### Task 1: Reorder the sections

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new.

- [ ] **Step 1: Record a content fingerprint before the change**

Because this is a pure move, the multiset of lines in the file must be IDENTICAL before
and after. Capture the baseline:

```bash
cd ~/Documents/ZAOstock-canonical
sort src/app/page.tsx > /tmp/page-before-sorted.txt
wc -l src/app/page.tsx
```

- [ ] **Step 2: Move the blocks**

Reorder the top-level `<section>` blocks in the component's returned JSX to the target
order above. Move whole blocks including their leading `{/* Name */}` comment. Do not
retype any line - cut and paste so the content cannot drift.

- [ ] **Step 3: Prove it was a pure move**

```bash
cd ~/Documents/ZAOstock-canonical
sort src/app/page.tsx > /tmp/page-after-sorted.txt
diff /tmp/page-before-sorted.txt /tmp/page-after-sorted.txt && echo "PURE MOVE CONFIRMED"
```

Expected: `PURE MOVE CONFIRMED`. Any diff output means a line was altered, added or lost -
stop and fix before continuing. This check is the whole point of the task; do not skip it
or treat a non-empty diff as acceptable.

- [ ] **Step 4: Verify**

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

Expected: typecheck clean, lint 0 errors (5 pre-existing `<img>` warnings), 22/22 tests,
build compiles.

- [ ] **Step 5: Commit**

```bash
cd ~/Documents/ZAOstock-canonical
git add src/app/page.tsx
git commit -m "refactor(home): locals-first section order"
```

---

### Task 2: Verify the rendered order

**Files:** none modified.

The sorted-lines check proves nothing was reworded. This task proves the ORDER actually
changed in what a visitor sees.

- [ ] **Step 1: Start the dev server**

The homepage is `force-dynamic` and reads Supabase at request time, and this clone has no
`.env.local` (pre-existing gap, surfaced to Zaal, not to be worked around by sourcing
credentials). Use throwaway placeholders so the Supabase calls fail on the error path the
code already handles:

```bash
cd ~/Documents/ZAOstock-canonical
NEXT_PUBLIC_SUPABASE_URL="https://yjrlaxpjusmrfylumban.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="placeholder-not-a-real-key" \
SESSION_SECRET="placeholder-local-render-check-only-32chars" \
npx next dev --turbopack --port 3111 &
```

The team roster will render its "Full roster coming soon" fallback. That is expected and
means this run is NO evidence about the roster.

- [ ] **Step 2: Extract the rendered section order**

```bash
curl -s http://localhost:3111/ | sed -e 's/<[^>]*>/ /g' -e 's/  */ /g' > /tmp/zaostock-home-2.txt
grep -oE "Community Music Festival|Countdown|Crossroads of Downeast|After Hours|Join In|The Lineup|How To Plug In|About|How We Run It|The Team|Partners|Pro Ticket|Sponsors|Lineage" /tmp/zaostock-home-2.txt | awk '!seen[$0]++'
```

Expected first appearances, in this order: Countdown, Crossroads of Downeast, After Hours,
Join In, The Lineup, How To Plug In, About, How We Run It, The Team, Partners, Pro Ticket,
Sponsors, Lineage.

Report the actual output. Do not summarise it as "looks right".

- [ ] **Step 3: Confirm the anchors still resolve**

```bash
grep -c 'id="rsvp"' /tmp/zaostock-home-2.txt
grep -c 'id="pro-ticket"' /tmp/zaostock-home-2.txt
```

Both anchors are id-based and must survive the move. (The `sed` strips tags, so check the
raw HTML instead if these return 0.)

- [ ] **Step 4: Stop the dev server**

---

### Task 3: Open PR 2

- [ ] **Step 1: Merge main, verify, push**

```bash
cd ~/Documents/ZAOstock-canonical
git fetch origin main && git merge origin/main --no-edit
npm run typecheck && npm run lint && npm run test && npm run build
git push -u origin ws/zaostock-locals-first-reorder-0813
```

- [ ] **Step 2: Open the PR**

Body must state: pure move verified by sorted-line equality, the Manifesto+stats spec gap
and how it was resolved, the rendered-order output, and the same standing caveats (RSC
payload inflates string counts, roster unverified under placeholder credentials, missing
`.env.local` is pre-existing and Zaal's to handle).

- [ ] **Step 3: Report the URL. Do not merge.**
