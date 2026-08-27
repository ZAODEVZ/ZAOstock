# ZAOstock one-pagers - what exists, what is missing

Written 2026-08-27 (Thursday). Lane: MARKETING. Every field a one-pager would
need that Zaal has not typed is **UNSET**.

## How one-pagers work here

Two surfaces claim the same job and it is not written down which is canonical:

| Surface | What it is | Reachable 2026-08-27 |
|---|---|---|
| `zaoos.com/stock/onepagers/<slug>` | The ZAO OS dashboard. The `/onepager` skill (`ZAO OS V1/.claude/skills/onepager/SKILL.md`) inserts into Supabase `stock_onepagers` and renders here; the bot edits via `/op <slug>` | **No** - `curl` returned no response from this sandbox. Unverified either way |
| `zaostock.com/onepagers/<slug>` | This repo, `src/app/onepagers/`. Reads a Supabase table named `onepagers` (`src/lib/onepagers.ts`), same shape as the skill's `stock_onepagers` (slug, title, audience, purpose, body, status, visibility, meeting_date, meeting_location, authors, reviewers, version) | Yes, 200 |

Two table names (`stock_onepagers` in the skill, `onepagers` in this repo) and
two domains. Whether they are the same table behind two front ends, or two
tables, is **UNSET** - the SITE lane owns `src/lib/` and the Supabase project is
returning 503, so it could not be checked from here.

The skill's structure, which every one-pager mirrors: H1 (event + date) ·
blockquote (contact, date, audience) · What it is · Why this audience / venue
· Expected scale (table) · What we bring · What we'd ask (numbered) · What
success looks like · Why now · closer "One ask above all". About 600 words.
No sponsor amounts unless Zaal states them; no fabricated attendance.

## What exists

| Slug | Where | Audience | State | Note |
|---|---|---|---|---|
| `overview` | `src/app/onepagers/overview/page.tsx` - **hard-coded**, not from the DB | Anyone, public | Live at zaostock.com/onepagers/overview | Carries stale facts, listed below. SITE-lane fix |
| `roddy-parks-rec` | Supabase, per the skill ("the seed pager") | Roddy, Parks and Rec, City of Ellsworth | **UNVERIFIED** - the DB is 503 and the skill file is older than several corrections | If it exists, it predates the single-venue correction (23 Aug) and the 11:00 open |
| anything else in the DB | Supabase | | **UNVERIFIED** | `zaostock.com/onepagers` as a guest shows "No published one-pagers yet". `listOnePagers().catch(() => [])` swallows the 503, so that message means either "none public" or "database down" - indistinguishable from outside |

### The overview page is out of date

`src/app/onepagers/overview/page.tsx`, checked against current truth:

| Line | Says | True | Owner |
|---|---|---|---|
| 154 | `12pm — late` | Outdoor window on the site is 11 AM - 6 PM (our intent, not City-cleared); evening at Black Moon | SITE |
| 67 | Black Moon "Indoor second stage + official after-party" | One venue at a time since 23 Aug | SITE |
| 76-116 | Three sponsor tiers at $500+ / $1,000+ / $5,000+ | Deck slide 9: **every tier price is UNSET**, five tier names, not three (`docs/sponsor/deck-2026-10-03.md`). The same three figures are in `src/app/llms.txt/route.ts` | SITE, after Zaal says whether the old three-tier ladder was ever his |
| 96 | "Newsletter credit (400+ editions)" | Deck says 500+ subscribers, marked VERIFY; edition count unsourced | SITE |
| 130, 464-467 | Press contact `zaal@thezao.com` | Deck and the broker draft use `info@thezao.com`; llms.txt uses a Gmail address. Three contact addresses on three surfaces | Zaal picks one |
| PARTNERS | Six partners | Site homepage has seven (adds Web3Metal); gdoc has eight (adds Bomb Squad) | SITE |

Also the skill's own "ZAOstock context" block is stale and must not be copied
into a new pager: "Aug 15 dry-run", "188 members", "Cara Romano" as the Heart
of Ellsworth contact (the gdoc says explicitly Roddy is not Cara Romano and
Chesnee Barney is the Heart of Ellsworth voice on partner status), "19-person
volunteer crew" (site says 27 teammates), "Heart of Ellsworth" as an anchor
partner (not confirmed in writing).

## What is missing

Four audiences the brief names, none with a pager on any surface this lane
can see.

### 1. Sponsor

| Field | Value |
|---|---|
| Slug | `sponsor-local` (LOCAL variant; `sponsor-general`, `sponsor-online` later) |
| Audience | Heart of Ellsworth partner banks and downtown businesses - the deck's "realistic Presenting and Platform buyers" (`docs/sponsor/deck-2026-10-03.md` header). Named recipients: **UNSET** - the Chamber's three contacts (Peter Farragher, Kaitlen Workman, Heather) are the front door per the Local Network tab, and no bank is named on disk |
| Purpose | One conversation, then a yes or no (deck slide 12) |
| What it is | Deck slides 1, 5, 6, 8 - all sourced |
| Expected scale | **UNSET** - attendance is Zaal's to type. Sourced substitutes: free; 4M+ cars through Ellsworth in 2025; town of ~8,000 (`src/app/page.tsx:261`, deck slide 4) |
| What we bring | Deck slide 11 (pre / during / post), the measurement promise (slide 8) |
| What we'd ask | **UNSET** - five tier prices, the early-close discount and date. Tier names and benefits are settled (slide 9). Sponsor-an-artist price **UNSET** (slide 10) |
| Why now | Poster prints week of 1 Sep; reveal 1 Sep; the last useful close is the last day a sponsor still reaches print - date **UNSET** |
| Blocked on | Zaal typing seven fields (deck "What Zaal must type") |

### 2. Partner

| Field | Value |
|---|---|
| Slug | `partner-inkind` |
| Audience | A business offering time, venue or infrastructure, not cash. Existing model: the seven on the site (`src/app/page.tsx:101-112`) |
| Purpose | Confirm an in-kind agreement and a named point of contact on each side |
| What it is | Same spine as sponsor, minus tiers |
| What we bring | Partner card on the site with logo, name on the poster strip and the backdrop, named in the recap (deck slide 11; `docs/marketing/partner-logos.md`) |
| What we'd ask | A logo (vector or transparent PNG), a named contact, the role line in their words, and whatever the offer is |
| Open | Whether in-kind counts at retail value toward a sponsor tier is a rule in the deck (slide 9 notes); the value is **UNSET** per partner |
| Blocked on | Nothing. This one can be written today from sourced material. Not written in this round because the brief asks which are missing, not for the pagers themselves |

### 3. Venue

| Field | Value |
|---|---|
| Slug | `venue-black-moon` (the only venue in the plan); `venue-fogtown` if the Fri 2 Oct night lands |
| Audience | Steve Peer and Katina, Black Moon Public House; Fogtown Brewing (target for Fri 2 Oct, gdoc Aug 24 decisions) |
| Purpose | Black Moon: the production plan already IS this document (`docs/plans/production-plan-2026-10-03.md`, sections 2-5) and is going to Steve. A one-pager would be a summary of it, not a new ask |
| Open items | The PA handoff at six; porta potty count and ADA unit; wristbands; which of four acts are booked; downbeat (production plan section 5) |
| Fogtown | Ask was Zaal, in person, 25 Aug. Outcome **UNSET** |
| Blocked on | Steve answering section 5 |

### 4. City

| Field | Value |
|---|---|
| Slug | `city-ellsworth` |
| Audience | Roddy, Director of Parks, Recreation and Facilities, City of Ellsworth. Explicitly not Cara Romano (gdoc Local Network) |
| Purpose | Not the permit - that is filed and with the City (gdoc, Roddy confirmed 25 Aug). The open questions: does the parklet permit cap an 11:00 amplified start; vendor rules (allowed, fee, permit, cap); parklet capacity; power circuits; load-in; noise cut-off; insurance certificate form and deadline; Art of Ellsworth umbrella vs the Chapter 14 45-day notice (production plan section 8, gdoc Local Network) |
| State | A draft message to Roddy is a **CITY-lane** deliverable (`docs/drafts/roddy-2026-08-27.md`, their write-set). A one-pager for him would duplicate it. Recommend: no city one-pager until the CITY lane's draft is sent and answered |
| Blocked on | CITY lane |

## Recommendation

Write `partner-inkind` first - it is fully sourced and unblocked. The sponsor
pager waits on the same seven fields as the deck. Venue and city already have
documents in flight in other lanes.

Whether new pagers go into the DB via the skill's SQL or into this repo is
**UNSET** until someone confirms which table the two front ends read. Do not
insert into Supabase from any lane until the project is confirmed as the real
ZAOstock production project (standing rule: two Supabase servers are wired
with different refs).

## Sources

- `ZAO OS V1/.claude/skills/onepager/SKILL.md` - the skill, read 2026-08-27
- `src/app/onepagers/page.tsx`, `src/app/onepagers/[slug]/page.tsx`,
  `src/app/onepagers/overview/page.tsx`, `src/lib/onepagers.ts`
- `curl https://zaostock.com/onepagers` and `/onepagers/overview`, 2026-08-27
  (200, guest view, "No published one-pagers yet"); `curl https://zaoos.com/stock/onepagers`
  (no response)
- `docs/sponsor/deck-2026-10-03.md`, `docs/plans/production-plan-2026-10-03.md`
- `docs/plans/gdoc-1B78AVonJS3-snapshot-2026-08-27.md` - Local Network, Aug 24
  standup
