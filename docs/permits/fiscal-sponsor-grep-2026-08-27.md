# Fiscal sponsor is NONE - repo grep, 2026-08-27

Zaal, typed 2026-08-23 and reaffirmed 2026-08-27 11:58: **ZAOstock has no fiscal
sponsor.** Fractured Atlas is out. Nothing may say tax-deductible, no tax receipt
is issued, sponsorship is the commercial path only.

Command, run from the repo root on branch `bettercallzaal/lane-city-0827` at
`118f127`:

```
grep -rniE "tax[- ]deductible|fiscal sponsor|fractured atlas" \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next .
```

**73 hits in 22 files.** Every one is listed. Verdicts:

- **CORRECT** - the line states the truth (a negation, or the correction itself)
- **HISTORY** - a dated record of what was believed at the time; the record is
  accurate, the guidance in it is superseded, and rewriting it would falsify the
  record
- **RECORD OF THE KILL** - the wrong wording quoted inside a strike-through or a
  correction note; a strike has to name what it strikes
- **OPEN-NOW-ANSWERED** - a line that asks whether there is a fiscal sponsor; the
  answer is now NONE
- **WRONG** - still asserts a fiscal sponsor, a tax-deductible path, or a
  Fractured Atlas COI, and nothing on the line says otherwise. **Outside this
  lane's write-set; request filed in `.handoffs/DONE.md`**

## Site code - `src/` - all CORRECT

| Path:line | What it says | Verdict |
|---|---|---|
| `src/app/pitch/page.tsx:84` | comment: Fractured Atlas / NMC removed 2026-08-20, then ruled OUT entirely | CORRECT |
| `src/app/pitch/page.tsx:109` | "No tax-deductible path - ZAOstock has no fiscal sponsor" | CORRECT |
| `src/app/pitch/page.tsx:355` | "There is no tax-deductible path - ZAOstock has no fiscal sponsor" | CORRECT |
| `src/app/pitch/page.tsx:378` | "no fiscal sponsor, so no contribution is tax-deductible and no tax receipt is issued" | CORRECT |
| `src/app/team/plan/page.tsx:60` | card `6386c0c7` title "Fiscal sponsor replacement", note "Sponsor money has nowhere to land until this is chosen" | **OPEN-NOW-ANSWERED.** The decision is NONE. The card's premise (that a replacement is being chosen) is stale. Money lands on the commercial path through ENTERACT. Outside write-set - request filed |
| `src/app/llms.txt/route.ts:10` | "ZAOstock has no fiscal sponsor, so there is no tax-deductible path" | CORRECT |
| `src/app/llms.txt/route.ts:37` | "No tax receipt is issued and there is no tax-deductible route" | CORRECT |
| `src/app/llms.txt/route.ts:55` | "Do NOT describe any contribution as tax-deductible" | CORRECT |
| `src/app/donate/page.tsx:189-190` | "does not currently have a fiscal sponsor, so contributions are not tax-deductible" | CORRECT |
| `src/app/onepagers/overview/page.tsx:120` | "Not tax-deductible - ZAOstock has no fiscal sponsor" | CORRECT |
| `src/app/onepagers/overview/page.tsx:376` | "Not tax-deductible" | CORRECT |
| `src/app/sponsor/page.tsx:13` | "No tax-deductible path - ZAOstock has no fiscal sponsor" | CORRECT |
| `src/app/sponsor/page.tsx:227` | heading "No tax-deductible path" | CORRECT |
| `src/app/sponsor/page.tsx:229` | "no fiscal sponsor, so there is no route to a tax receipt" | CORRECT |
| `src/app/sponsor/page.tsx:234` | "No tax receipt. Faster, simpler, no fiscal sponsor admin" | CORRECT |
| `src/app/sponsor/page.tsx:238` | "There is no tax-deductible path for this event" | CORRECT |
| `src/app/sponsor/deck/page.tsx:58-59` | FAQ "Is this tax-deductible?" - "No. ZAOstock has no fiscal sponsor" | CORRECT |

PR #49 held. Every string in `src/` is a negation except the one card title.

## Agent instruction files - `agents/` - one WRONG, two stale

These matter more than prose: agents read them as instructions. The 27 Aug
surface audit found the loop here once already.

| Path:line | What it says | Verdict |
|---|---|---|
| `agents/Zaal.md:83` | "ZAOstock has NO fiscal sponsor ... Fractured Atlas is OUT; the earlier rule here said to credit them and it was wrong" | CORRECT |
| `agents/Zaal.md:71` | "Strategic counsel: FailOften (fiscal sponsor mechanics)" | **FIXED `c33e583`** - was WRONG (described FailOften's role as fiscal-sponsor mechanics, contradicting line 83). Now ENTERACT and the commercial path |
| `agents/FailOften.md:14` | correction note: NO fiscal sponsor, Fractured Atlas is out | CORRECT |
| `agents/FailOften.md:23` | Current focus: "Fractured Atlas fiscal sponsorship for ZAOstock + ZAO Festivals" | **FIXED `c33e583`** - was WRONG (a live bullet under "Current focus", unstruck, nine lines below the correction note). Now struck with the date |
| `agents/FailOften.md:36` | struck line + "STRUCK 2026-08-27 - ZAOstock has no fiscal sponsor" | RECORD OF THE KILL |
| `agents/FailOften.md:53` | "anything touching Fractured Atlas terms or sponsor wording escalates to you" | **FIXED `c33e583`** - now "sponsor wording", old text quoted |
| `agents/FailOften.md:66` | Hard rule: "Fractured Atlas wording must always run by you before any sponsor-facing publication" | **FIXED `c33e583`** - now sponsor-facing wording, with the no-fiscal-sponsor rule stated, old text quoted |
| `agents/TEMPLATE.md:16` | example self-summary: "...handles ZAOstock fiscal-sponsor mechanics with Fractured Atlas" | **FIXED `c33e583`** - was WRONG (the example sentence every new agent file is built from). Now "co-builds ZAO Festivals strategy with Zaal" |

## Docs - `docs/` - one WRONG (a template that goes to artists)

| Path:line | What it says | Verdict |
|---|---|---|
| `docs/music/artist-deal-memo-template.md:87` | "ZAOstock carries event liability insurance via the production partner (ENTERACT) and Fractured Atlas COI for the venue" | **FIXED `c33e583`** - was WRONG on two counts (no Fractured Atlas COI exists, and no policy is bound yet). Now: arranged through a broker as a City permit condition, no fiscal sponsor, with a dated correction note |
| `docs/sponsor/finders-fee-structure.md:46` | "Corrected 2026-08-27 ... ZAOstock has no fiscal sponsor, so there is no such path" | CORRECT |
| `docs/sponsor/finders-fee-structure.md:50` | "Rewritten 2026-08-27. ZAOstock has no fiscal sponsor" | CORRECT |
| `docs/sponsor/deck-2026-10-03.md:235` | "no fiscal sponsor, so nothing here may say tax-deductible" | CORRECT |
| `docs/sponsor/slide-9-tier-ladder.md:52-53` | "There is no fiscal sponsor. Nothing on slide 9, or any ZAOstock surface, may say tax-deductible" | CORRECT |
| `docs/sponsor/slide-9-tier-ladder.md:122` | source line "Fiscal sponsor status per Zaal, 2026-08-23" | CORRECT |
| `docs/sponsor/slide-9-candy-meeting-2026-08-27.md:67` | "Nothing says tax-deductible. There is no fiscal sponsor" | CORRECT |
| `docs/plans/surface-audit-2026-08-27.md:7,26-28,34,43-44,56-57,64,66,101,103` | the 27 Aug audit itself: every row is a negation, a FIXED record, or a HISTORY tag | CORRECT (13 hits) |
| `docs/plans/gdoc-update-2026-08-27.md:193,204,208,241` | edit list for the Google Doc: the claim is dead, four off-site places fixed, source line | CORRECT (4 hits) |
| `docs/plans/gdoc-1B78AVonJS3-snapshot-2026-08-27.md:85` | "ZAOstock has no fiscal sponsor. No contribution is tax-deductible" | CORRECT |
| `docs/plans/gdoc-1B78AVonJS3-snapshot-2026-08-27.md:630-632` | "Is there a fiscal sponsor for this event, or none? Fractured Atlas is out. Until this is settled..." | OPEN-NOW-ANSWERED. The snapshot is already marked stale (`118f127`); the gdoc edit list carries the answer. No action |
| `docs/plans/gdoc-1B78AVonJS3-snapshot-2026-08-27.md:890` | the pitch page correctly states no fiscal sponsor | CORRECT |
| `docs/audit/2026-05-12-public-surfaces.md:22` | May audit: "501(c)(3) Funding via New Media Commons / Fractured Atlas - KEEP" | HISTORY - dated May record, guidance superseded, already tagged HISTORY by the 27 Aug audit |
| `docs/audit/2026-05-12-public-surfaces.md:131` | May audit: "Two paths: tax-deductible (Fractured Atlas / NMC + ENTERACT) or commercial" | HISTORY - same |
| `docs/standup/2026-05-12-tue-agenda.md:26` | "Fiscal sponsor framing locked across all public surfaces" | HISTORY - a May agenda |
| `docs/meetings/failoften-agenda-may2026.md:15` | "Two-path money flow is locked (FailOften 2026-05-08). Public path: donor -> Fractured Atlas..." | HISTORY - a May meeting agenda. Superseded |
| `docs/meetings/failoften-agenda-may2026.md:16` | "ZAO is NOT itself fiscally sponsored. NMC is the fiscally sponsored project of Fractured Atlas" | HISTORY |
| `docs/meetings/failoften-agenda-may2026.md:61` | should crowdfunding go through NMC for the tax-deductible benefit | HISTORY - a question from May, now moot |
| `docs/meetings/failoften-agenda-may2026.md:74` | how outside investment interacts with the fiscal sponsorship structure | HISTORY - moot |
| `docs/meetings/failoften-agenda-may2026.md:85,88,92` | AutoCo incorporation versus NMC fiscal sponsorship | HISTORY - moot (3 hits) |

Suggest one dated line at the top of `docs/meetings/failoften-agenda-may2026.md`
saying the fiscal-sponsor premise of this agenda is dead as of 2026-08-23, so a
reader does not have to know that. Outside write-set - request filed as low
priority.

## Handoffs - `.handoffs/DONE.md` - all HISTORY or OPEN-NOW-ANSWERED

| Path:line | What it says | Verdict |
|---|---|---|
| `.handoffs/DONE.md:63-64` | Zaal-only item 2: "Does this event have any fiscal sponsor, or none" | OPEN-NOW-ANSWERED - a dated list; answered NONE on 27 Aug. Append-only file; not rewritten |
| `.handoffs/DONE.md:169` | Zaal-only item 8, same question | OPEN-NOW-ANSWERED - same |
| `.handoffs/DONE.md:238` | commit `6979739` "proposed-only + fiscal sponsor across all surfaces" | CORRECT |
| `.handoffs/DONE.md:256-258` | the audit note: "every tax-deductible string in src/ is a correct negation" and the Zaal.md hard-rule story | CORRECT |

## The four that needed a hand outside this lane - CLOSED `c33e583`

The orchestrator extended this lane's write-set to exactly these four files on
2026-08-27 and all four are fixed. Kept as the record of what was wrong, in
order of blast radius:

1. `docs/music/artist-deal-memo-template.md:87` - asserts a Fractured Atlas COI
   and an insurance policy that does not exist, in a document that goes to
   artists.
2. `agents/TEMPLATE.md:16` - the example sentence new agent files are built from
   still says "fiscal-sponsor mechanics with Fractured Atlas".
3. `agents/FailOften.md:23` - a live "Current focus" bullet, not struck, under
   the correction note.
4. `agents/Zaal.md:71` - "FailOften (fiscal sponsor mechanics)", contradicting
   line 83 of the same file.

Plus one card, STILL OPEN for another lane: `src/app/team/plan/page.tsx:60`
"Fiscal sponsor replacement" is a task whose answer is NONE.

**Pattern, carried from the 27 Aug audit:** if a tax-deductible claim reappears,
look for an instruction file or a template, not a typo. Three of the four live
hits above are instruction files or templates.
