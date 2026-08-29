# Build on ZAOstock

**For the ZABAL Gamez builder battle, Saturday 29 August noon to Sunday 30 August noon (ET), and anyone else who wants to build something the festival can use on 3 October.**

ZAOstock is a free, one-day, artist-built music festival on Franklin Street in downtown Ellsworth, Maine, Saturday 3 October 2026. Music from noon on the parklet stage, two hours of WaveWarZ battles from four, then the whole street walks next door into Black Moon Public House at six. Produced by ZAO Festivals, the events arm of The ZAO. Everything below is real, on disk, and yours to build on.

## The loop: build, then call Zaal

You do not need to wait for the closing Space. When you have something to show, at any hour, reach Zaal directly. He opens a Space on the WaveWarZ X account and puts the stream up at zabalgamez.com/live so you can share it live. Extra Spaces can appear at any hour of the battle. Ship in the open; show early; show twice.

- Battle: 24 hours, noon Saturday to noon Sunday, ET. Opening Space in the first hour, closing Space in the last hour, both on the WaveWarZ X account (links posted when they are created).
- Watch: https://zabalgamez.com/live
- The battle itself trades at https://wavewarz.com
- Format, judging signals and prizes: https://zabalgamez.com/august

## Five things the festival needs

Pick one. Each track lists what already exists, what is missing, and where your build plugs in. None of them is a toy: the thing you build is what runs on 3 October if it works.

### 1. Organization: help the crew run the day

What exists:

- A team dashboard at https://zaostock.com/team (4-letter code login for the organizing team): members, todos, volunteers, RSVPs, sponsors, notes, activity, budget.
- Eight "circles" (workgroups anyone can join) at https://zaostock.com/circles. The page exists; its API is failing in production today (a database mismatch, being fixed).
- Public intake forms that already write to the dashboard: volunteer sign-up (https://zaostock.com/apply), musician submissions (https://zaostock.com/musicians/submit), ideas (https://zaostock.com/suggest), and the artist rider (https://zaostock.com/musicians/rider).
- The run of show in five-minute rows, the production plan, the AV spec and the livestream chain, all in the public repo under `docs/plans/` and `docs/av/`.

What is missing: a day-of view. Stage manager, MC, crews and volunteers each need one screen that says what is happening now, what is next, who is where, and what changed. Today that lives in a markdown table.

Build: a run-of-show board (phone first) that reads the five-minute grid, shows now / next / who, lets the stage manager mark a slot started, late or done, and pushes the change to everyone on it. Bonus: a volunteer check-in that writes back to the dashboard's volunteers table.

### 2. Ticketing with Unlock Protocol

What exists:

- RSVP is free and runs on Luma: https://ticket.zaostock.com (redirects to the Luma event).
- The Pro Ticket: $50, 20 spots, round-one goal $1,000, on https://zaostock.com/donate, paid by PayPal or Giveth. Pro Ticket buyers are credited by name on the site; that is the only recognition tier, on purpose.
- The ZAO's standing decision (7 August 2026): Unlock Protocol on Base is the membership rail. The money door stays ZAO-owned; no platform takes a cut between The ZAO and its people. Unlock's DAO team is in the weekly ZAO room.

What is missing: an onchain ticket. Nothing on Unlock exists for ZAOstock yet.

Build: an Unlock lock on Base for the Pro Ticket (and, if you like, a free key for the plain RSVP as proof of attendance), a checkout that lands on the donate page, and a key-holder view: your name on the credit list, your perks, your day-of QR. Keep the festival page words plain: "Pro Ticket", "your ticket", never the protocol's name on the attendee-facing surface.

### 3. Decentraland, with Quan

What exists:

- Quan (Chris Marshall) is the Decentraland contact and one of the four WaveWarZ battlers on 3 October.
- An open item on The ZAO's board: scan the Franklin Street parklet (LiDAR), export a GLB, and stand it up in Decentraland. The "Decentraland x COC x ZAO" Space has been queued since mid-August and not yet held.
- The livestream chain for 3 October is specified in the repo (`docs/av/livestream-chain-2026-10-03.md`): one stream, outdoors until six, indoors after.

What is missing: any ZAOstock presence in Decentraland.

Build: a Decentraland scene of the parklet stage that plays the 3 October stream on the big screen, carries the partner banner and the badge, and gives the online 1,000 a place to stand together. Quan can tell you what the stage looks like; the badge and logos are in the press kit below.

### 4. A WaveWarZ front end for the event

What exists:

- WaveWarZ runs online all year; on 3 October it takes the parklet stage from 16:00 to 18:00. The story at 16:00 (Hurricane with Stilo), rules and bracket at 16:15, Battle 1 at 16:25, a voting window at 16:50, Battle 2 at 17:00, voting at 17:25, the Final at 17:35, the result at 17:55, then Hurricane walks the crowd next door. Battlers: Stilo, Jango, Lui, Quan. Hurricane on the mic. The audience decides, in the street and online.
- Public stats: `GET https://wavewarz.info/api/public/stats` returns `volume`, `liveBattle`, `artistPayouts`, `traderClaims` and `battles` totals (1,468 battles as of 29 August). The battle site is https://wavewarz.com.
- The program page: https://zaostock.com/program.

What is missing: the in-person layer. Two hundred people on a street cannot vote on wavewarz.com from a phone in the sun without help, and the stage has no screen output.

Build: a ZAOstock-skinned battle view in two sizes: a big-screen mode for the stage (bracket, who is on, live vote, the sponsor spot between rounds, the result) and a phone mode for the crowd (one tap to vote, one tap to the live battle). Use the poster identity in the press kit so it reads as the same event.

### 5. A collaboration and bounty board on POIDH

What exists:

- poidhz, The ZAO's POIDH bounty operation: https://github.com/bettercallzaal/zpoidh (public; rounds, judging pages, leaderboard, a fork-ready `org.config.json`). Iman runs the rounds.
- A live bounty right now: WaveWarZ Twitch clips, https://poidh.xyz/base/bounty/1330, open until Sunday 30 August 11:59 PM PT, winner by POIDH consensus vote.
- The ZAO's payout path for contributors is x402 over POIDH (same 7 August decision as track 2).
- Volunteer roles for 3 October: setup, check-in, stage crew, content, teardown (https://zaostock.com/apply).

What is missing: a board where festival tasks are bounties with proof. Today tasks live in the team dashboard and get done by whoever is asked.

Build: a ZAOstock collaboration board on POIDH: each open task (a photo set of every partner's storefront, a clip of each set, the parklet scan, signage) is a bounty with a photo-proof close, a leaderboard of who did what, and a link back into the dashboard so the crew sees it. Fork poidhz; do not start from zero.

## Facts you can use (all public)

| | |
|---|---|
| Date | Saturday 3 October 2026 |
| Where | Franklin Street Parklet, Ellsworth, Maine; Black Moon Public House next door from six |
| Cost | Free. Optional Pro Ticket, $50 |
| Music | Noon to 4 PM live sets; 4 to 6 PM WaveWarZ; 6 to 8 PM DJ set and 8 to 10 PM live set at Black Moon |
| Expected | 200 to 250 in person, about 1,000 online |
| Lineup | Lyons Den confirmed; WaveWarZ battlers Stilo, Jango, Lui, Quan with Hurricane on the mic; the rest revealed 1 September |
| Partners | Town of Ellsworth, Black Moon Public House, Star 97.7, Wallace Events, WaveWarZ, COC Concertz, ENTERACT, Web3Metal, Bomb Squad |
| Series | 9th Annual Art of Ellsworth, Maine Craft Weekend |
| Produced by | ZAO Festivals, the events arm of The ZAO |
| Contact | info@thezao.com |

Where to read more: https://zaostock.com/llms.txt (the whole site in one text file), https://zaostock.com/program, https://zaostock.com/partners, https://zaostock.com/press, https://zaostock.com/sponsor.

## Code, data and assets

- Site repo, public: https://github.com/ZAODEVZ/ZAOstock (Next.js 16, React 19, Tailwind 4, Supabase). Facts live in `src/content/festival.ts` and `src/content/site.ts`; the design system is `DESIGN.md`; brand tokens in `docs/brand/`.
- Public API today: `GET /api/events` and `GET /api/events/zaostock-2026/lineup` (both degraded while the production database is repointed; the lineup falls back to a committed list). Forms: `POST /api/apply`, `POST /api/musicians/submit`, `POST /api/suggestions`, `POST /api/events/rsvp`.
- Press kit with the badge (colour and mono) and every partner logo as PNG: https://zaostock.com/press
- Identity: Boogaloo for display, Rubik for body, Space Mono for labels; paper `#F2E6D3`, ink `#241E15`, red `#D2402A`, gold `#E5AC3B`, denim `#2E6494`, olive `#7C8A3D`. Screen-printed poster, hard ink outlines, no gradients. Credit the badge to Samantha "Candy", CandyToyBox.
- WaveWarZ public stats: https://wavewarz.info/api/public/stats
- POIDH: https://poidh.xyz and the poidhz repo above.

## Rules for anything you ship publicly

1. Names: only Lyons Den and the four battlers plus Hurricane are public before 1 September. The repo carries planning documents with other names; those are not public copy. Do not print them.
2. No prices, tiers or sponsor numbers anywhere; packages are on request. No "tax-deductible", no fiscal sponsor claim: ZAOstock has neither.
3. Partners are the nine listed above and no one else, however friendly the conversation.
4. Attendee-facing words lead with the music. Your tool can run on Base; the festival page does not say so.
5. Spellings: ZAOstock, ZAOville, WaveWarZ, ZABAL Gamez, The ZAO, COC Concertz, ZAO-PALOOZA, ZAO-CHELLA, BetterCallZaal, Lyons Den, Dcoop, Fellenz.
6. No emojis and no em dashes in copy that ships on ZAOstock surfaces.

## How to hand it back

Open a pull request to the site repo, or link your own repo and a live URL. Then reach Zaal: he opens the Space, you show it on the stream, and if it runs, it runs on 3 October.
