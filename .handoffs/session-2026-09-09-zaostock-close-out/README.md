# Handoff - zaostock - the form is out, the repo is clear, design moves to Candy Toy Box

**Written 2026-09-09** by the zaostock lane, closing out a session that started
with a stuck artist form and ended with an empty PR queue.

**Receiver instructions:** read Section A, add it to your list, then read B-E as
you work. Everything in A is a HUMAN action. Nothing mechanical is left before
the reveal.

**THIS REPO IS PUBLIC.** No contact details, no artist pay figures, no internal
budget numbers appear below, and none may be added. The vault carries the
filled-in and the per-person; this file carries the product.

---

## Section A - tasks to absorb

- [ ] **Send the eight remaining artist messages.** Bodies are written, personalised with each act's slot, at `~/.zao/clipboard/clip-20260909-123451-zaostock-artist-messages-eight.html`. Dcoop already replied and submitted. **This is the only thing standing between us and a lineup on 13 September.**
- [ ] **SEND THE INSURANCE BROKER EMAIL. It was written 27 August, marked "FIRST send tomorrow", and as of 2026-09-09 the quote is still UNSET, so it appears never to have gone.** The parklet permit waits on the certificate naming the City as additional insured, the certificate waits on the quote, and the quote waits on this one email. **This is the only open item that can CANCEL the event rather than degrade it.** The draft is corrected and paste-ready at `docs/drafts/msg-john-jagger-2026-08-27.md` (PR #143). **Any Gmail draft made from the 27 August text is STALE - it told an underwriter the whole event moves indoors at six, described WaveWarZ battles that are off the programme, and asserted the City's stage is already standing. Do not send it.**
- [ ] **Set the Friday 2 October soundcheck time.** UNSET in all nine deal memos while the form and every message ask acts to commit to "Friday evening". The first artist who says yes will ask what time.
- [ ] **Confirm Hurricane's departure airport.** `Houston TX` is already in the artists table and finance has been treating the flight as unpriceable because nobody named a city. Fares climb inside 14 days, which for 3 October starts **19 September**. The message already asks him.
- [ ] **Copy form responses into Supabase by hand, and name who builds the wayfinding signs.** The Apps Script automation is dead, so a submission no longer becomes a `confirmed` row. Intake checklist and the exact UPDATE are in Section E.

## Section B - why (decisions and findings that are expensive to rediscover)

- **THE ARTIST FORM IS LIVE AND VERIFIED.** A hand-run Apps Script created it at 09:05:41 after failing at 06:39:06 with "An unknown error has occurred". Verified by fetching it anonymously in a headless browser: no sign-in wall, all eight questions render, all nine acts in the dropdown. Then verified again by a real artist, Dcoop, who submitted and confirmed it opened with no login.
- **THREE Google Workspace settings each force a login, and turning off one is not enough.** In order of discovery: `Collect email addresses`, then `Restrict to users in the organisation` (which produces "You need access" rather than a sign-in page), then `Limit to 1 response` (which silently requires sign-in to identify the respondent). All three had to be off. A form made in a Workspace account defaults to locked.
- **An artifact-backed form was built first and RETIRED.** Viewer writes returned `not_granted`: the artifact database is never granted to a signed-out browser, so nine artists on nine phones would all have failed. It rendered perfectly while saving nothing, which is why the page was rewritten to verify its own save by reading it back before showing success.
- **"Tested, works" meant three different things in one afternoon** - the page loaded, the act name appeared in a dropdown, and finally a row existed. The discriminator that ended it was asking which of two exact on-screen strings appeared, because the code makes them mutually exclusive. Ask for the string, not the verdict.
- **$5,000 is the BUDGET, not a sponsorship tier price.** The ledger entry is labelled `zaostock-budget` and its note reads "a number can be true and out of bounds". It was one step from being printed as a sponsorship level. Tiers stay price-on-request.
- **`ARTIST_CONFIRM_SECRET` and the 503 are irrelevant.** They authenticated the Apps Script calling `/api/admin/confirm-artist`. Nothing calls that route. The 503 is real and blocks nothing. Two lanes independently sent Zaal back to set it; both were wrong. **Do not spend a redeploy on it.**
- **TWELVE PRs merged, and the ordering hazard fired exactly as predicted.** #135 flipped to CONFLICTING the instant #133 merged, because it had been rebased onto #133's commits and the squash-merge replaced them. Rebuilt as #140 from its own two commits on current main. **General lesson: a rebase onto a sibling does not survive that sibling being squash-merged.**
- **Six false claims were live on the public site and are now gone**, each with a guard: a specific member count with crypto framing, an on-chain payment description, a stale battle count, the claim that the whole street walks indoors at six (on `/` and `/program`), and two daily standup times that nobody holds. **Guards pin VALUES not files, and CLAIMS not wordings** - the first crowd rule matched "moves inside" and passed cleanly over four live instances of "walks next door".
- **`llms.txt` carried a seventh error no page check could see**, because it is a route rather than a page: it still published the superseded 6-to-8 and 8-to-10 evening. That is the surface an assistant reads when asked about this festival.
- **The reveal preflight cries wolf during a deploy**, reporting the lineup endpoint unreachable while a direct request returns 200. And `bash script | tail` returns tail's exit code, so a failing preflight reads as exit 0. Check the exit code without a pipe.
- **Do NOT send the Google planning doc to outside advisors.** It carries tier prices, a named artist's pay, and a figure the doc itself says in bold must never appear in a ZAOstock pitch. A clean, figure-free brief was written for that purpose instead.
- **DESIGN IS MOVING TO CANDY TOY BOX**, who will supply new logos, design and a pitch deck. The deck built this session (Section C) is a working reference, not the final artefact, and may be superseded entirely.

## Section C - repo state

- `origin/main` at `f2bd1c6`. **The PR queue is EMPTY** except two dependabot bumps deliberately held.
- **Merged 2026-09-09**, each verified MERGED rather than assumed: #128 #129 #130 #131 #132 #133 #134 #136 #137 #138 #139 #140. #135 closed, superseded by #140.
- **ON HOLD until after 3 October:** #113 (iron-session 8 to 9) and #114 (pino 9 to 10). Both major bumps; #113 holds the `/team` login sessions. Green CI on a dependency bump means the build compiled, not that the behaviour still works. Reasoning is recorded as a comment on each PR. **re-check 2026-10-06.**
- **A local worktree may be 30+ commits behind `origin/main`, and `git pull` fails on untracked `.handoffs/` bundles.** Every branch this session was cut from `origin/main` in a worktree. Do the same.
- **`docs/marketing/press-kit.md` is modified and unstaged in the main checkout, and it is STALE.** Those edits duplicate work already merged. Fetch and reset rather than commit them.
- **The sponsor deck is a separate repo with NO REMOTE:** `~/Desktop/repos/zaostock-deck`, on `main`, three commits, clean. Repo creation on GitHub was blocked twice: `bettercallzaal` cannot create in the ZAODEVZ org, and a personal fallback was denied by the permission classifier. One command from Zaal creates it.

## Section D - in-flight

- No background jobs running. Nothing outbound was sent by this lane.
- **This lane can no longer send mail or read Drive.** The estate moved from Zaal's Claude account to the ZAO one for usage limits, so Gmail and both Drive connectors are GONE rather than expired. `gdocs` is separately dead: its OAuth app is stuck in Testing and returns `Error 403: access_denied`. **Stop asking for reconnects.** Anything outbound goes through Zaal via the clipboard pages.
- **A working browser exists** and it found bugs nothing else did: the local headless Chromium at `~/Library/Caches/ms-playwright/chromium_headless_shell-1208/`. Both MCP browser bridges are down estate-wide. Use `--dump-dom` and `--screenshot`, and always run a control on the same host so a bot block is not mistaken for a real failure. One control this session was itself a 404, which made it worthless; the conclusion held on stronger evidence.

## Section E - cold-start map

**Files touched:** `handoffs/status/zaostock.md` and `handoffs/needs-zaal.md` in the vault (grill rewritten three times as reality changed); `src/content/site.ts`, `src/content/site.test.ts`, `src/app/sponsor/page.tsx`, `src/app/page.tsx`, `src/app/program/page.tsx`, `src/app/meetings/page.tsx`, `src/app/llms.txt/route.ts` via PR #139; `~/Desktop/repos/zaostock-deck/` (whole package).

**Skills invoked:** `artifact-capabilities` (established that a signed-out viewer never gets the database, which retired the artifact form); `clipboard` (four pages: Dcoop, the eight artists, two Timo drafts); `handoff` (this).

**Deliverables not in this repo:** the sponsor deck at `~/Desktop/repos/zaostock-deck`; the final flyer with `zaostock.com` added and the ticket panel corrected to "SUPPORT FROM $20 / NOT NEEDED TO GET IN"; a figure-free operational brief published as a private artifact for an outside advisor.

**The intake, since the automation is dead.** Do not mark an act confirmed unless the confirmation box was ticked AND the photo link actually opens - a dead link is a missing photo, and the reveal publishes what the row says. Every write carries `event_id`, never name alone, which is the exact bug #132 and #140 fix:

```
update artists set status='confirmed', photo_url='<link>', bio='<bio>',
  city='<city>', links='<links>'
where event_id = '6fb757e2-ce45-4847-8bba-72b716c0d4e2' and name = '<exact name>';
```

Then confirm the count moved by exactly one, and run `scripts/reveal-preflight.sh`.

**Mental model:** The reveal fires 13 September and everything mechanical for it is shipped, deployed and passing. The preflight is green on every check except `ZERO acts on the bill`, which is not a code problem. One of nine acts has replied. The remaining work is people: eight messages, one certificate, one soundcheck time, one airport.

**Open questions for Zaal:**
- ~~**Is there one flight or two?**~~ **ANSWERED 2026-09-09.** Zaal, verbatim: "its just hurricane flying, fellenz is driving." **ONE flight, Hurricane's.** Fellenz drives, and Dcoop drives because he hauls a PA that cannot be checked. The record describing Fellenz flying into Portland was stale and has been corrected at its source. Anyone pricing travel prices ONE flight, from `Houston TX` per the artists table, and confirms the airport with him before booking. Fares climb inside 14 days, so from **19 September**. Any ask built on two or three flights is a multiple of the real number.
- **Does the Candy Toy Box work supersede the deck**, or sit alongside it?
- **Black Moon gift certificate value** is recorded as both $20 and about $25 per person, and the headcount owed is UNSET.
