# Handoff - zaostock - form is at his hands, deck is next

**Written 2026-09-09** by the zaostock lane at 91% context, on orc2's call to
hand off BEFORE starting the deck rather than halfway through it.

**Receiver instructions:** read Section A, add it to your list, then read B-E as
you work. **Do the deck.** The form cannot move from this seat.

**Zaal, 2026-09-09, verbatim:** *"stop everything ... close up shop on anything
not directly tied to zaostock ... form needs to go out and then pitch deck needs
to be finalized."* Every other lane is parked. This is the only lane working.

---

## Section A - tasks to absorb

- [ ] **DO THE DECK.** Canva `DAHUiVhk1Ss` (a COPY - the ZAO-CHELLA original is untouched, keep it that way) to approval-ready. Hard rules in Section B, **plus the two late arrivals in Section B2 - one flight not two, and no artist pay figures.**
- [ ] **Apply one pending Canva edit** whose exact replacement text is already written: `~/zao-vault/projects/zaostock-deck-black-moon-overclaim-2026-09-08.md`. Two slides still claim the whole street walks inside Black Moon. The Canva MCP disconnected before I could apply it - **check the MCP is connected first.**
- [ ] **When Zaal pastes the `/viewform` URL:** substitute it into the nine messages at `~/zao-vault/projects/zaostock-nine-confirmations-2026-09-08.md` and create nine Gmail drafts in one pass. Bodies are final. **The Gmail MCP session was expired at handoff - it needs reauth.**
- [ ] **When Zaal says the secret is set:** probe with `zao-measure` using a name that does NOT exist. **404 is the pass** (auth accepted, config live, DB reachable, nothing touched). 401 = the two values disagree. 503 = it still needs the redeploy. Never test by confirming a real artist.
- [ ] **Do NOT commit `docs/marketing/press-kit.md` in the main worktree.** It is modified and unstaged, and it is STALE: local `main` is **22 commits behind** origin, so those edits duplicate work already merged in #125. Fetch and reset rather than commit.

## Section B - why (decisions and findings that are expensive to rediscover)

- **The three taps that are Zaal's, and nothing else is on the grill:** (1) make the form - `script.google.com`, paste `scripts/create-artist-form.gs`, run `createZaostockArtistForm`, paste back the `/viewform` URL; (2) `ARTIST_CONFIRM_SECRET` in **Vercel AND the form's Apps Script properties**, then **redeploy** - the var does nothing until you do; (3) contact routes for **OPEN X, Grass Rug, Michael Anderson, Lyons Den**.
- **I cannot create the form.** Apps Script runs as Zaal; the Drive API cannot create a Google Form (`create_drive_file` stores bytes without Google-native conversion). Measured: no ZAOstock form exists in `zaalp99@gmail.com`'s Drive - newest is February. Either he ran it as `info@thezao.com` (then only the URL is missing) or the run did not complete.
- **DECK MONEY RULE, sourced - do not re-derive.** Zaal: **"$5K PUBLIC, $25K INTERNAL ONLY"** (`handoffs/IN-FLIGHT.md`, nyczao row, 2026-09-09). **$5,000 is the only figure allowed on a sponsor surface. $25K appears nowhere.** Tiers stay **price on request** - three names, no prices. On 27 August four invented figures reached this deck and had to be stripped; that incident is why the rule exists.
- **State 0 of 9 confirmed honestly.** No act has countersigned. The run of show is names and times, never a confirmation claim.
- **Take the run of show from #122, do not retype it.** It is verified identical across five surfaces: `/program`, the ops room, the database, the nine memos and the deck.
- **The reveal still fires empty.** Measured at handoff: `503 Not configured`, **0 of 9 confirmed**, four days out. Both cited via `zao-measure --verify`.
- **`git add <shared-file>` stages other lanes' unstaged edits too.** I did this - commit `c1ddba9` carries a zaofractal row I did not write. Use `python3 ~/zao-vault/scripts/inflight-row.py --lane zaostock --row-file row.txt` instead. Verified: it commits 1 insertion, 1 deletion, my row only.
- **PR merge order matters: #133 before #135.** Both edit `REVEAL-RUNBOOK.md`. Each showed `CLEAN` against main and **conflicted with each other** - GitHub measures clean against main, not against siblings. #135 is rebased onto #133. All ten verified as a stack: 26 files, 165 tests, tsc clean, ops room builds, preflight fails only on the empty bill.
- **Unverified and load-bearing, on the call sheet:** nobody has asked whether the City's stage and tent are still standing on **3 October**. Four public pages promise *"rain or shine, under tent cover"*, the soundcheck plan says *"nothing needs building"*, and the broker was told *"we put up no structures"*. The record says they are installed and removed *"across the summer season"*.

## Section B2 - LATE ARRIVALS, both deck-critical, received after the bundle was drafted

**1. FINANCE CORRECTION - it is ONE artist flight, not two. Read before the deck is called final.**

From `finance-hq`, on Zaal's word: **Dcoop DRIVES.** This lane recorded it on
1 September in `projects/zaostock-lane-state-2026-09-01.md` - *"Dcoop drives,
brings gear as backup PA only"* - and finance budgeted him a flight on 7 September
because that file had not been read. Corrected in six places on 8 September.

He is **hauling a PA, which cannot be checked as luggage**, so the driving is
load-bearing rather than incidental. The travel support already agreed with him
covers the drive - fuel, wear, his time. **Nothing further is owed him for travel.**

- **The remaining flight is Hurric4n3IKE's alone.** Any travel sponsor ask that
  assumes two flights is **DOUBLE the real number** and overstates the ask.
- **DO NOT put the flight figure in the deck.** Finance is explicit: it is a
  placeholder somebody invented, **never a quoted fare**, because nobody has said
  which city Hurric4n3IKE flies from. Two honest options: describe the ask as
  covering **one artist's travel with no number**, or get finance the origin city
  and they will price a real fare the same day.
- **Chase the origin city this week regardless of the deck.** Fares climb sharply
  inside 14 days, which for 3 October starts around **19 September**.
- **HARD RULE from Zaal: no artist pay figures in the deck or the form.** Public
  copy says a performance fee is agreed privately with each act, **never an
  amount**. Per-act numbers stay in finance-hq.

Everything else on the ZAOstock money side is current per finance: the artist
ledger, the cash timeline against paycheck dates, and the sized sponsor asks.
**Finance is parked except ZAOstock, so ask them directly** - `finance-hq-d0`.

**2. ARTIZEN MAY HOLD THE FORM KEYS.** orc2: artizen has Drive and Gmail reach
this lane does not, and has been told "zaostock form". **I have already asked it**
(2026-09-09) to search `info@thezao.com`'s Drive for the form and send back the
public `/viewform` URL, and to run the Apps Script under that account only if it
genuinely has it. **Check for its reply before assuming the form is still blocked
on Zaal** - it may already be unblocked. Coordinate with `zaoartizen-62`; this
lane owns the form, artizen holds the keys.

## Section C - repo state

- Branch `main` at `cf57537`, **22 commits behind** `origin/main` (`621085c`). `git pull` fails on the untracked `.handoffs/` bundles - **use a worktree from `origin/main`**, which is how every PR this session was built.
- **13 open PRs.** Mine are **#128-#138**; the rest are dependabot (#113, #114).
- Uncommitted: `docs/marketing/press-kit.md` - stale, see Section A.

## Section D - in-flight

- No background jobs running.
- **Gmail MCP session EXPIRED** - blocks nine drafts and one Steve draft edit.
- **Canva MCP was disconnected** at last attempt - blocks the deck. Re-test before starting.
- Nothing outbound was sent this session. Three Gmail drafts are staged unsent: Dcoop, Fogtown, Steve.

## Section E - cold-start map

**Files touched:** 11 findings in `~/zao-vault/projects/zaostock-*-2026-09-08.md`; `handoffs/status/zaostock.md` (corrections at top, three-tap grill, deck brief); `handoffs/IN-FLIGHT.md` (via `inflight-row.py`); the nine memos in `~/zao-vault/projects/zaostock-memos-2026/`; PRs #128-#138 in the repo.

**Skills invoked:** `artifact-design` (stakeholder board + poster, both since deleted from the artifact gallery); `handoff` (this).

**Memory writes:** `feedback_correct_claims_where_read.md`, `feedback_blocking_questions_and_recheck_dates.md`.

**Mental model:** The form chain is fully built and blocked on three taps only Zaal can do. The deck is the next piece of work and is untouched today beyond a text sweep. Everything else in this lane is either shipped as a PR, recorded as a finding, or explicitly parked.

**Open questions for Zaal:** the three taps, and whether the deck's ZAO-PALOOZA appendix (pages 24-31) should be deleted - a UI click I cannot do.
