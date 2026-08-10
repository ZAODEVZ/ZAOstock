# ZAOstock Website Content Truth (PR 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the confirmed Black Moon after-party on the ZAOstock homepage and retire an expired lineup promise, without publishing a single performer name or any date other than October 3.

**Architecture:** Extract the handful of festival facts that already repeat across the 708-line homepage into one typed `src/content/festival.ts` module, lock those values with a vitest suite modelled on the existing `team-constants.test.ts`, then wire the homepage to read from the module and add one new section. Content only - no palette work, no layout reorder, no other route.

**Tech Stack:** Next.js (App Router, server components), TypeScript, Tailwind v4, vitest (node environment, `@` alias to `src`).

## Global Constraints

These come from Zaal on 2026-08-10 and from standing project memory. Every task's
requirements implicitly include this section. Copy values verbatim.

- PUBLISH: Black Moon as the confirmed after-party venue.
- PUBLISH: that Black Moon can host performances during the `12 PM - 6 PM` window.
- PUBLISH: the two-stage arrangement as an OPTION - main stage at the parklet, second
  stage at the bar. Never as a settled plan. The approved verb is "opens up".
- PUBLISH: `Free to attend`, RSVP destination `https://ticket.zaostock.com`.
- DO NOT PUBLISH any performer name. Not the two confirmed Maine musicians, not Sen,
  not Phelan, not DCoop.
- DO NOT PUBLISH any date other than October 3, 2026. No night-before, no Friday, no
  Sunday, no multi-day language, and no promised announcement date.
- DO NOT modify the ZAOville lineage card. Its existing "returning for ZAOstock" text
  stays exactly as-is. It is already live, so pulling it is Zaal's decision, not the
  implementer's. Task 6 raises it in the PR body instead.
- No crypto or web3 language in public copy.
- Never quote a specific ZAO member count; `100+` is the approved form.
- No deploy, no posting, no announcement, no tracker or bot writes. PR only.

**Repo:** `~/Documents/ZAOstock-canonical` (remote `ZAODEVZ/ZAOstock`). NOT
`~/Documents/zaostock`, which is an archived clone of `bettercallzaal/zao-stock`.

**Branch:** `ws/zaostock-festivals-lane-0805`, already created from `origin/main`, already
carrying the design spec commits. Commit as `Zaal Panthaki <zaalp99@gmail.com>` (already
configured in this clone).

## File Structure

| File | Responsibility |
|---|---|
| `src/content/festival.ts` | CREATE. Facts only: date, labels, venue, window, admission, RSVP URL, after-party. No JSX, no styling, no component imports. |
| `src/content/festival.test.ts` | CREATE. Locks every published value and asserts the forbidden-name rule against the module. |
| `src/app/page.tsx` | MODIFY. Reads facts from the module; gains one "After Hours" section; loses the expired lineup promise. |

---

### Task 1: The festival facts module

**Files:**
- Create: `src/content/festival.ts`
- Test: `src/content/festival.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `FESTIVAL` (a `Festival`), plus exported types `Festival` and `AfterParty`.
  Task 2, 3 and 4 import `FESTIVAL` from `@/content/festival`.

Both `dateLabel`/`shortDate` and `venue`/`shortVenue` exist on purpose: the `FactStrip`
row is visually tight and currently reads `Oct 3, 2026` / `Franklin St Parklet`, while
prose reads long-form. Keeping both spellings in one module is what stops them drifting.

- [ ] **Step 1: Write the failing test**

Create `src/content/festival.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { FESTIVAL } from './festival';

// These values are what the PUBLIC site says. They are locked here so a future
// edit cannot silently change a published fact - or publish something Zaal
// ruled out on 2026-08-10 - without a deliberate, visible change to this file.

describe('FESTIVAL facts', () => {
  it('publishes the confirmed date, venue and window', () => {
    expect(FESTIVAL.date).toBe('2026-10-03T12:00:00-04:00');
    expect(FESTIVAL.dateLabel).toBe('Saturday, October 3, 2026');
    expect(FESTIVAL.shortDate).toBe('Oct 3, 2026');
    expect(FESTIVAL.venue).toBe('Franklin Street Parklet');
    expect(FESTIVAL.shortVenue).toBe('Franklin St Parklet');
    expect(FESTIVAL.city).toBe('Ellsworth, Maine');
    expect(FESTIVAL.window).toBe('12 PM - 6 PM');
  });

  it('publishes free admission and the RSVP destination', () => {
    expect(FESTIVAL.admission).toBe('Free to attend');
    expect(FESTIVAL.rsvpUrl).toBe('https://ticket.zaostock.com');
  });

  it('publishes Black Moon as the confirmed after-party that can host performances', () => {
    expect(FESTIVAL.afterParty.name).toBe('Black Moon');
    expect(FESTIVAL.afterParty.note).toBe('next door');
    expect(FESTIVAL.afterParty.hostsPerformances).toBe(true);
  });

  it('names no performer anywhere in the published facts', () => {
    const blob = JSON.stringify(FESTIVAL).toLowerCase();
    for (const name of ['sen', 'phelan', 'dcoop', 'david cooper']) {
      expect(blob).not.toContain(name);
    }
  });

  it('sets no date other than October 3', () => {
    const blob = JSON.stringify(FESTIVAL).toLowerCase();
    for (const token of ['friday', 'sunday', 'night-before', 'night before', 'multi-day']) {
      expect(blob).not.toContain(token);
    }
  });
});
```

Note on scope: this suite deliberately checks the FACTS MODULE, not the whole of
`page.tsx`. A page-wide name scan would fail on copy that is intentionally staying -
the ZAOville lineage card's DCoop mention (Zaal's call, see Global Constraints) and the
past ZAOville lineup names. Do not widen this test to scan `page.tsx`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/content/festival.test.ts`
Expected: FAIL - cannot resolve `./festival`.

- [ ] **Step 3: Write minimal implementation**

Create `src/content/festival.ts`:

```typescript
// Single source of truth for the festival facts that appear in more than one
// place on the public site. Facts only - no JSX, no styling.
//
// Publication rules locked by Zaal 2026-08-10: Black Moon is publishable as the
// confirmed after-party; performer names and any date other than Oct 3 are NOT
// publishable. src/content/festival.test.ts enforces both.

export type AfterParty = {
  name: string;
  note: string;
  /** Black Moon can also host performances during the main 12-6 window. */
  hostsPerformances: boolean;
};

export type Festival = {
  date: string;
  dateLabel: string;
  shortDate: string;
  venue: string;
  shortVenue: string;
  city: string;
  window: string;
  admission: string;
  rsvpUrl: string;
  afterParty: AfterParty;
};

export const FESTIVAL: Festival = {
  date: '2026-10-03T12:00:00-04:00',
  dateLabel: 'Saturday, October 3, 2026',
  shortDate: 'Oct 3, 2026',
  venue: 'Franklin Street Parklet',
  shortVenue: 'Franklin St Parklet',
  city: 'Ellsworth, Maine',
  window: '12 PM - 6 PM',
  admission: 'Free to attend',
  rsvpUrl: 'https://ticket.zaostock.com',
  afterParty: {
    name: 'Black Moon',
    note: 'next door',
    hostsPerformances: true,
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/content/festival.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
cd ~/Documents/ZAOstock-canonical
git add src/content/festival.ts src/content/festival.test.ts
git commit -m "feat(content): single source of truth for ZAOstock festival facts"
```

---

### Task 2: Wire the homepage to the facts module

**Files:**
- Modify: `src/app/page.tsx` (imports at top; `FESTIVAL_DATE` line 38; `FACTS` lines 40-45; hero lines 189-222; countdown line 243; RSVP anchors lines 146-153, 199-206, 581-588; footer line 657)

**Interfaces:**
- Consumes: `FESTIVAL` from `@/content/festival` (Task 1).
- Produces: no new exports. Later tasks edit the same file.

There is no test in this task. It is a substitution of literals by identical values, and
its correctness is verified by rendering in Task 5, plus `typecheck`/`build`. Do not
invent a snapshot test for it.

- [ ] **Step 1: Add the import**

In `src/app/page.tsx`, after the existing `@/components/festival/TiltCard` import:

```typescript
import { FESTIVAL } from '@/content/festival';
```

- [ ] **Step 2: Replace the standalone date const**

Delete line 38 (`const FESTIVAL_DATE = '2026-10-03T12:00:00-04:00';`) and change the
`CountdownTimer` usage (around line 243) from `targetDate={FESTIVAL_DATE}` to:

```tsx
<CountdownTimer targetDate={FESTIVAL.date} eventName="ZAOstock" />
```

- [ ] **Step 3: Rewrite the FACTS const**

Replace lines 40-45 with:

```typescript
const FACTS = [
  { label: 'Date', value: FESTIVAL.shortDate },
  { label: 'Venue', value: FESTIVAL.shortVenue },
  { label: 'Time', value: FESTIVAL.window },
  { label: 'Lineup', value: 'Independent Artists' },
];
```

The rendered strings are byte-identical to today's. This step must not change what the
strip displays.

- [ ] **Step 4: Point the four RSVP links at the module**

In all four places the literal `https://ticket.zaostock.com` appears as an `href`
(header nav ~line 147, hero ~line 200, RSVP section ~line 582, and any other), replace
the literal with `{FESTIVAL.rsvpUrl}`. Leave every className, `target`, `rel`, and the
link text exactly as-is.

Verify none remain in the page:

```bash
grep -n "ticket.zaostock.com" src/app/page.tsx
```

Expected: no output. The only remaining occurrence in the repo is the definition in
`src/content/festival.ts`.

- [ ] **Step 5: Wire the hero subhead**

The hero's second line (~line 192-194) currently reads
`Free to attend. Saturday Oct 3, Ellsworth Maine.` Replace its contents with:

```tsx
            {FESTIVAL.admission}. {FESTIVAL.dateLabel}, {FESTIVAL.city}.
```

Rendered result: `Free to attend. Saturday, October 3, 2026, Ellsworth, Maine.` This is
a deliberate, small wording change - it spells the date and state out in full and is
still the same single confirmed date. Keep the surrounding `<p>` and its classes.

- [ ] **Step 6: Wire the footer strip**

The footer strip (~line 657) currently reads `ZAOstock / Oct 03 2026 / Ellsworth ME`.
Replace its contents with:

```tsx
            ZAOstock / {FESTIVAL.shortDate} / {FESTIVAL.city}
```

- [ ] **Step 7: Run typecheck and build**

Run: `npm run typecheck && npm run build`
Expected: both pass.

- [ ] **Step 8: Commit**

```bash
cd ~/Documents/ZAOstock-canonical
git add src/app/page.tsx
git commit -m "refactor(home): read festival facts from the content module"
```

---

### Task 3: The After Hours section

**Files:**
- Modify: `src/app/page.tsx` (insert immediately after the "Crossroads of Downeast" section, which closes around line 424, and before the `{/* Team */}` comment)

**Interfaces:**
- Consumes: `FESTIVAL.afterParty`, `FESTIVAL.window` (Task 1); `SectionHeader` (already imported at line 7).
- Produces: nothing consumed later.

- [ ] **Step 1: Insert the section**

Between the closing `</section>` of the Where block and the `{/* Team */}` comment:

```tsx
      {/* After Hours */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="After Hours" title={`${FESTIVAL.afterParty.name}, ${FESTIVAL.afterParty.note}.`} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            <div className="lg:col-span-7">
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                {FESTIVAL.afterParty.name} is confirmed as the ZAOstock after-party. The bar can also host
                performances during the {FESTIVAL.window} window, which opens up a second stage there
                alongside the main stage in the parklet.
              </p>
            </div>
            <div className="lg:col-span-5 lg:pl-8 lg:border-l border-white/[0.12]">
              <dl className="space-y-4">
                <div className="flex flex-col gap-1">
                  <dt className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-400 tracking-[0.18em]">After-party</dt>
                  <dd className="text-base text-white">{FESTIVAL.afterParty.name}, {FESTIVAL.afterParty.note}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-400 tracking-[0.18em]">Also hosts</dt>
                  <dd className="text-base text-white">Performances during {FESTIVAL.window}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
```

The verb is "opens up". Do not change it to "will have", "includes", or anything that
reads as decided - the second stage is an option, and stating it as settled breaks the
no-unconfirmed-commitments rule.

The markup deliberately mirrors the existing two-column `lg:col-span-7` /
`lg:col-span-5` pattern used by the Lineup, About and Where sections.

- [ ] **Step 2: Run typecheck and build**

Run: `npm run typecheck && npm run build`
Expected: both pass.

- [ ] **Step 3: Commit**

```bash
cd ~/Documents/ZAOstock-canonical
git add src/app/page.tsx
git commit -m "feat(home): add Black Moon after-party section"
```

---

### Task 4: Retire the expired lineup promise

**Files:**
- Modify: `src/app/page.tsx` (Lineup teaser section, lines ~250-277)

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing consumed later.

The current copy says the full lineup drops August 2026. It is mid-August and no names
may be published, so the sentence is both due and unfulfillable. It becomes a state
rather than a dated promise.

- [ ] **Step 1: Replace the body paragraph**

Change the paragraph at ~line 255-257 from:

```tsx
                A full day of independent artists with DJs between every act. The full lineup drops August 2026 once final commitments are locked.
```

to:

```tsx
                A full day of independent artists with DJs between every act. The lineup is announced once every set is locked.
```

- [ ] **Step 2: Remove the "Lineup drops" definition row**

Delete this block (~lines 261-264) entirely:

```tsx
                <div className="flex flex-col gap-1">
                  <dt className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-400 tracking-[0.18em]">Lineup drops</dt>
                  <dd className="text-base text-white">August 2026</dd>
                </div>
```

Keep the `Stage` and `Format` rows that follow it.

- [ ] **Step 3: Confirm no announcement date survives**

```bash
grep -n "August 2026" src/app/page.tsx
```

Expected: no match in the Lineup section. A match inside the `TODO[photos]` comment
block (~line 232) is pre-existing and stays - it is a code comment, not public copy.

- [ ] **Step 4: Run typecheck, lint, tests, build**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
cd ~/Documents/ZAOstock-canonical
git add src/app/page.tsx
git commit -m "fix(home): lineup copy is a state, not an expired August promise"
```

---

### Task 5: Verify the rendered page, not just the diff

**Files:** none modified.

**Interfaces:** none.

Facts can typecheck perfectly and still contradict each other on screen. This task reads
what a visitor actually sees.

- [ ] **Step 1: Confirm the dev server has the real database**

The homepage is `force-dynamic` and calls `getPublicMembers()` / `getStockCounts()` at
request time. Confirm `.env.local` points `NEXT_PUBLIC_SUPABASE_URL` at the real app DB
project `yjrlaxpjusmrfylumban`, NOT the cowork tracker `etwvzrmlxeobinrlytza`.

```bash
cd ~/Documents/ZAOstock-canonical
grep -o 'yjrlaxpjusmrfylumban\|etwvzrmlxeobinrlytza' .env.local
```

Expected: `yjrlaxpjusmrfylumban`. If it shows the other project, stop and report - an
empty team mosaic on the rendered page is the visible tell of this misconfiguration and
it is not something to work around silently.

- [ ] **Step 2: Start the dev server**

Run: `npm run dev`
Expected: ready on `http://localhost:3000`.

- [ ] **Step 3: Read the rendered homepage text**

Fetch the rendered page and extract its text:

```bash
curl -s http://localhost:3000 | sed -e 's/<[^>]*>/ /g' -e 's/  */ /g' > /tmp/zaostock-home.txt
```

- [ ] **Step 4: Assert what a visitor sees**

```bash
grep -c "Black Moon" /tmp/zaostock-home.txt          # expect >= 2
grep -c "12 PM - 6 PM" /tmp/zaostock-home.txt        # expect >= 3
grep -o "Franklin St[a-z]* Parklet" /tmp/zaostock-home.txt | sort -u
grep -c "Free to attend" /tmp/zaostock-home.txt      # expect >= 2
grep -i "full lineup drops" /tmp/zaostock-home.txt   # expect NO match
grep -iE "phelan|[^a-z]sen[^a-z]|friday|sunday|night.before" /tmp/zaostock-home.txt
```

The last command must return no performer name and no second date. A `DCoop` match in
the ZAOville lineage card is EXPECTED and correct - that copy is deliberately untouched
per the Global Constraints.

Report the actual output of each command. Do not summarise them as "looks right".

- [ ] **Step 5: Stop the dev server**

---

### Task 6: Open PR 1

**Files:** none modified.

**Interfaces:** none.

- [ ] **Step 1: Merge main and push**

```bash
cd ~/Documents/ZAOstock-canonical
git fetch origin main && git merge origin/main --no-edit
npm run typecheck && npm run lint && npm run test && npm run build
git push -u origin ws/zaostock-festivals-lane-0805
```

- [ ] **Step 2: Open the PR**

```bash
gh pr create --repo ZAODEVZ/ZAOstock --base main \
  --title "Content truth: Black Moon after-party, retire expired lineup promise" \
  --body "$(cat <<'EOF'
Content-only pass on the homepage from the 2026-08-03 ZAO-VILLE catch-up, where updating
the website was called the biggest priority. No visual reskin - that comes later, once
the Woodstock-homage flyers are final.

## What changed
- New `src/content/festival.ts` holds the facts that repeat across the page (date, venue,
  12-6 window, free admission, RSVP URL, after-party), with a vitest suite locking every
  published value.
- New "After Hours" section: Black Moon named as the confirmed after-party, that it can
  host performances during the 12 PM - 6 PM window, and the second stage stated as an
  option ("opens up"), not a commitment.
- Lineup copy no longer promises "the full lineup drops August 2026". It is mid-August
  and that promise is due; it is now a state, with no artist named and no new date set.

## Publication rules followed
- No performer names published. Not the Maine musicians, not Phelan, not DCoop.
- No date other than October 3. No night-before, no Friday/Sunday, nothing multi-day.
- Free to attend, RSVP at ticket.zaostock.com, both retained.

## FLAGGED FOR ZAAL - not changed in this PR
The ZAOville lineage card still reads that DCoop "performed at ZAO-CHELLA Miami 2024,
returning for ZAOstock". That places a named performer at ZAOstock in public copy, which
is what the no-names rule exists to prevent - but the line is ALREADY LIVE on the site,
so removing it and leaving it are both meaningful choices. Left untouched deliberately.
Your call.

## Verification
typecheck, lint, vitest, build all pass. Rendered homepage read via dev server to confirm
the date, venue, window and after-party details appear consistently and no forbidden name
or date is on the page.
EOF
)"
```

- [ ] **Step 3: Report the PR URL**

Report the URL. Do not merge it. No deploy, no posting anywhere.

---

## PR 2 is not in this plan

The locals-first homepage reorder is deliberately excluded. It gets its own plan and its
own branch cut from this one after PR 1 is reviewed, so its diff reads purely as moved
blocks. Do not start it as part of this plan.
