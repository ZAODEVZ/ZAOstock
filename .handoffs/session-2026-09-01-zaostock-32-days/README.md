# Session handoff - 2026-09-01

> from MacBook-Air-5, ZAODEVZ/ZAOstock @ main -> to the zj lane
> doc: .handoffs/session-2026-09-01-zaostock-32-days/README.md
> chain: none

## Receiver instructions (read me FIRST, then do exactly this)

1. Read ALL sections below (A through E) before responding to anything.
2. Section C has no diff. The tree is clean and everything is merged.
3. Create TaskList entries from section A.
4. Use section B as your "why" - do NOT re-litigate decisions captured there
   unless new info surfaces.
5. Section D is what is still running.
6. Section E is the cold-start map.
7. Once integrated, message back: "Ingested handoff zaostock-32-days. 5 tasks
   queued. Ready."
8. If you /handoff later, your bundle's `chain:` points BACK to this path.

**Verification convention used throughout.** Every claim below carries the
command that produced it, and a date. Do not restate any of it from memory in a
later document - re-run the command. On 2026-09-01 a lane brief in this estate
carried three claims that were false when written, and one had replicated into a
second document before anyone checked.

---

## A. Tasks to absorb (paste these into your TODO list)

- [ ] **Fix the artists table before Mon 7 Sep.** The lineup reveal fires
      AUTOMATICALLY at Ellsworth midnight, right or wrong. Measured 2026-09-01:
      `select status, count(*) from artists group by status` returns 9 rows, all
      `wishlist`, 0 `confirmed`. They are a stale list from an earlier phase
      (AttaBotty, Clejan, Duo Do Musica, Joseph Goats, Stilo World, Fellenz) and
      **Lyons Den, the only public act, is not among them.** So this is not "add
      the acts", it is "add the real ones and deal with nine wrong ones".
      Procedure: `docs/events/REVEAL-RUNBOOK.md` (Iman, #93). It is good - follow
      it rather than improvising.
- [ ] **Resolve the flyer contradiction.** The /ops board marks it done: "Candy
      flyer finished. 100 copies print this week." Four changes were never made -
      the Bomb Squad logo (`public/partners/bomb-squad.png`), the phantom outdoor
      DJ line, the missing 20:00-22:00 block, and the ENTERACT + Town of Ellsworth
      logos which have no files anywhere. A hundred printed copies is not
      something you quietly redo. Candy is ON HOLD by Zaal's instruction - he
      messaged her directly and nothing else goes her way until she replies.
- [ ] **Arbor Camp site visit, Mon 7 Sep.** Two things are fixable before then and
      both cost minutes: the open inquiry (65585319, 1-4 Oct) says **ONE GUEST**,
      so they will quote for one person; and **their rates have never been
      captured** because the Hostaway booking engine renders prices client-side.
      Leaving that visit with a number is the whole job. Brief:
      `~/zao-vault/projects/arbor-camp-tour-2026-09-07.md`.
- [ ] **Aziz: the stream.** The rtmps ingest URL and stream key (Cloudflare Live
      Input) have been owed since 22 August. Underneath it is the bigger one, from
      the /ops board: "Stream destination: no platform, account or operator
      recorded anywhere." The key is useless without somewhere to send it. The
      wifi test at Black Moon and on Ellsworth public wifi needs NOBODY and has
      never been done - if it cannot carry, the whole virtual plan changes.
- [ ] **Give /ops an owner.** It is live at https://zaostock.com/ops and it is a
      BUILD-TIME SNAPSHOT: it only moves when someone runs `node ops-room/build.js`
      and commits. It went stale within hours of launch (see B). Paper is the
      obvious owner - he became virtual co-organizer on 31 Aug.

## B. Why - decisions, pivots, corrections

- **The `artists` table is WRONG, not empty.** I reported it as empty first, to
  both Zaal and Iman, and that was incorrect. It holds 9 rows, all linked to
  `zaostock`, all `wishlist`. The lineup API filters on confirmed status so it
  returns `[]`, which reads identically to an empty table. Correction issued
  2026-09-01. Do not repeat the original claim.
- **`/ops` is a build-time snapshot, and a drift test guards it.** The build
  stamps a hash of `ops-room.src.html` into the output; `src/lib/ops-room.test.ts`
  fails if the deployed copy came from different source, and its failure message
  is the fix (`node ops-room/build.js`). Verified by editing the source without
  rebuilding - the test fails and names the command. What that does NOT solve is
  ownership: within hours of launch the board still said the site forms were off,
  when they had been turned back on the same day (#96 fixed that one item).
- **The tax disclaimer was struck from seven public surfaces, and the guardrail
  was deliberately KEPT.** There is a difference between a disclaimer ("not
  tax-deductible") and a guardrail ("never describe a contribution as
  tax-deductible"). The first was removed on Zaal's instruction; the second stays
  in `llms.txt` and the agent files, because it forbids a FALSE POSITIVE claim.
  Silence is compliant; asserting a deduction would be untrue. A line was added to
  `agents/Zaal.md` saying the disclaimer is deliberately not printed, because an
  agent reading the old rule could reasonably re-add one.
- **Both ticket tiers are patronage, NOT admission.** The brief arrived framed as
  "$50 is standard admission, $20 is the cheaper option". The live copy says
  otherwise twice. Three tests now pin it: the free-admission line must render
  before any price, and the page must keep saying in words that paying is not
  admission. Two prices under a heading that says "Tickets" is exactly what a
  reader mistakes for a paywall.
- **$20 counting toward the $1,000 goal is a REVERSIBLE DEFAULT from orcresearch,
  not Zaal's decision.** 20 x $50 = $1,000 exactly, so the goal was originally
  "sell the Pro Ticket round". Changing it is one predicate. The goal string was
  also rewritten because "20 people, $1,000" silently asserted $50 each.
- **RLS is answered and closed - do not re-open it.** Measured 2026-09-01 against
  the production project: all 23 tables have RLS on, exactly one policy each, and
  every policy targets `{service_role}` alone. No policy grants `anon` anything,
  so a publishable key reads ZERO rows everywhere. Zaal does not need to paste a
  key and no RLS audit is needed. Recorded as
  `docs/decisions/0004-anon-key-reads-nothing.md`. It expires the moment a
  publishable key is introduced for any client-side read.
- **The submission API route was left orphaned on purpose.** Zaal asked to remove
  the submission spot "and dont change anythign" else. `/api/musicians/submit`
  still exists, is POST-only, returns 405 on GET, and nothing links to it. Removing
  it is a separate call and his to make. `submissionCutoffLabel` and
  `submissionCutoffDate` were likewise left in place, marked unused in a comment,
  rather than deleted.
- **The recurring failure shape this week, worth carrying.** Five separate bugs
  had one form: something reported success while broken, and the failure was
  indistinguishable from the working state. The press-kit hold matched a hardcoded
  string; the reveal compared dates in UTC so it would have fired 4 hours early;
  a test PINNED the wrong instant as correct and passed; the volunteer forms were
  dark for 9 days for an outage that had ended; and the ops-room build stamp
  silently no-opped on a missing anchor while still printing "built". When
  reviewing anything here, ask what a broken version would look like - if the
  answer is "the same", add a guard.
- **Stanley Subaru is recorded three contradictory ways** across the vault's
  archived capital folder: "real win" with a "six-bank consortium", "already a
  known sponsor", and "sponsor prospect". It is in no CRM row and is not among the
  nine confirmed partners in `src/content/site.ts`. Unresolved. Do not cite it as
  a sponsor.

## C. Git state

- Branch: `main` (ahead 0, behind 0, dirty 0 files, untracked 0)
- Push status: everything merged
- Last commit: `b19abbb - fix(ops): the board said the site forms were off, and they are on (#96)`
- Uncommitted diff: **none**. Clean tree.

**Merged this session** (measured `gh pr list --state merged`, 2026-09-01):

| PR | What |
|---|---|
| #81 | Lineup reveal moved to 7 Sep across 8 files; press-kit hold regex derived from the constant |
| #82 | `/tickets` - the Pro Ticket had no front door; header CTA skipped past it |
| #84 | Tax disclaimer struck from 7 surfaces; Candy footer credit removed site-wide |
| #85 | Lint unblocked - main was red and failing EVERY PR in the repo |
| #86 | Reveal compared dates in UTC; would have fired 8pm on the 6th in Ellsworth |
| #87 | Two tripwires: doc URL cannot be published by accident; lineup surfaces cannot drift |
| #88 | Submission form removed from the site, 6 entry points |
| #89 | Two support tiers, $20 and $50; goal states which tiers count |
| #92 | Volunteer, ideas and RSVP forms back on after 9 dark days |
| #94 | Ops room served at `/ops` with a drift guard |
| #95 | Decision 0004 - the publishable key reads nothing |
| #96 | Ops board corrected: it said the forms were off |

Iman's, merged in parallel: **#83** (ops room), **#90** (three tests asserting
their own bug), **#91** (roster, events registry, decision log), **#93** (reveal
runbook).

## D. In-flight

- Background bash jobs: **none**
- Subagents pending: **none**
- Scheduled wakeups: **none**
- Open AskUserQuestion: **no**
- Open PRs: **none**. Queue is empty.

## E. Cold-start map

**Verified live 2026-09-01** (`curl -o /dev/null -w "%{http_code}"`): `/`,
`/tickets`, `/donate`, `/program`, `/press`, `/musicians`, `/musicians/rider`,
`/apply`, `/suggest`, `/partners`, `/ops`, `/sponsor` all **200**.
`/musicians/submit` correctly **404**. Repo health: **110 tests pass**, `tsc` 0,
`eslint` 0. `/ops` source stamp matches the repo (`614207ad9fd613d3`).

- Files touched this session:
  - `src/content/site.ts` - reveal date/label, `SUPPORT_TIERS`, `PRO_ROUND`, Candy credit removed
  - `src/app/tickets/page.tsx` + `tickets.test.ts` - new page, two tiers, free-framing tests
  - `src/app/donate/page.tsx` - single-sourced prices, tax row struck
  - `src/app/musicians/` - `submit/` deleted; `page.tsx` and `rider/` de-linked
  - `src/lib/lineup-reveal.ts` + test - timezone fix, disagreement tripwire
  - `src/lib/team-status.test.ts` - new, TEAM_DOC_URL tripwire
  - `src/lib/forms-status.ts` - `DATABASE_AVAILABLE` true
  - `src/lib/press-kit.ts` + test - disclaimer struck, test inverted
  - `src/app/robots.ts`, `sitemap.ts` - `/ops` disallowed, `/tickets` listed
  - `ops-room/build.js`, `public/ops/index.html`, `src/lib/ops-room.test.ts` - deploy + drift guard
  - `agents/Zaal.md` - the do-not-re-add-the-disclaimer line
  - `docs/decisions/0004-anon-key-reads-nothing.md` + README index row
  - `eslint.config.mjs` - scoped override for `ops-room/*.js`
- Skills invoked: `/meeting` (Dcoop call -> ZAOOS doc 2453), `/clipboard` (x4),
  `/agentic-issue` (ZAOOS#3383, the bot `<think>` leak), `/quick-grill`,
  `/handoff` (this).
- Memory writes: `feedback_zaoos_public_no_pii.md` (new),
  `project_zaostock_contact_channel_gap.md` (new),
  `feedback_ask_plainly_for_open_values.md` (new, then CORRECTED - see below).
- Vault writes: `decisions/lineup-reveal-is-7-september.md`,
  `decisions/paper-is-zaostock-virtual-co-organizer.md`,
  `projects/zaostock-lane-state-2026-09-01.md`,
  `projects/zaostock-sponsor-pipeline-2026-09-01.md`,
  `projects/arbor-camp-tour-2026-09-07.md`,
  `projects/zaostock-roster-and-channels-2026-08-31.md`, `people/Paper.md`.
- **Last-known mental model:** The repo is in good shape - clean tree, empty PR
  queue, all surfaces green. The work has shifted from fixing the site to fixing
  the EVENT. Six days to the lineup reveal, which fires automatically whether or
  not the database is right, and the database is not right. The other four tasks
  in section A are event logistics, not code.
- **Open questions for the receiver, all Zaal's:**
  - Which acts go into the `artists` table as `confirmed`? Only Lyons Den is
    public. The runbook cannot answer this; only he can.
  - Is the Fractured Atlas -> New Media Commons -> ENTERACT fiscal-sponsor path
    open to ZAOstock? One answer decides whether every 501(c)(3) grant in the
    pipeline is a live lead or a dead column. ZAOstock currently has NO fiscal
    sponsor (his decision, 23 Aug, reaffirmed 27 Aug).
  - Stanley Subaru: sponsor or prospect? Three files disagree.
  - The organizing doc is still readable by anyone with the link. Re-verified
    2026-09-01: export endpoint returns HTTP 200 and 131,777 bytes with no cookies
    and no session. A tripwire stops the SITE linking it; nothing protects the
    document. Only he can change its sharing.

**One correction about working with Zaal, carried deliberately.** Mid-session I
concluded he rejects `AskUserQuestion` pickers, after five were "rejected", and
wrote that to memory. **That was wrong.** He was pressing "Chat about this", the
escape hatch at the bottom of the picker, which arrives as a rejection. He was
engaging, not refusing. The memory was corrected. Pickers are fine; a rejection
often means he wants to discuss that specific option. Ask in plain prose only for
open VALUES he alone holds - a handle, a price, a name.
