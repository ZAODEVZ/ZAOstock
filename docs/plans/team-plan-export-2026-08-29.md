# The Plan (moved out of the /team dashboard, 29 August 2026)

This is the content of `zaostock.com/team/plan` as it stood when the dashboard
was retired on 29 August 2026, so it can live in the working document instead.
Statuses, owners and dates are as they were on 27-28 August; prune in the doc.
Card ids refer to the cowork board rows they tracked.

## The day

- 12:00 doors, sets 12:05 to 15:45. Artists, outdoors on the parklet. Changeovers are the MC plus partner spots, no DJ (Zaal, 27 Aug). Running order per the run of show; four acts confirmed, Werb not fully confirmed and wanted for WaveWarZ. The running order is Zaal's plan and not public before 1 September.
- 16:00 to 18:00. WaveWarZ, still outdoors. Stilo, Jango, Lui, Quan battling; Hurricane MCing.
- 18:00 to 20:00. DJ set, indoors at Black Moon. Stilo DJing, confirmed on our side. Two hours, no gap before the live set.
- 20:00 to 22:00. Live set hosted by Black Moon. Steve's act, name not on disk; Crown Vics booked, unnamed publicly until 1 September. After 22:00 nothing until the licence hour is typed.

## Cannot be recovered later

These have a window that closes. Everything else can slip a week; these cannot.

- The artist roster. Owner Zaal, this week. Three acts confirmed at the time; contracts, set times, the poster and the reveal wait on this list.
- Event insurance, a permit condition, not diligence. UNASSIGNED, was due 21 Aug (card 89e9da61). Brokers researched and ranked; a phone call, not a decision. (Jagger draft sits in Gmail Drafts as of 29 Aug.)
- Sound and PA: confirm what Steve's offer actually covers. Zaal, was due 1 Aug (7d0cf2b0). Gear, channel count, setup and strike, operator, power, cancellation.
- Fiscal sponsor replacement. UNASSIGNED, 26 Aug (6386c0c7). Note: retired as a question on 30 Apr / 7 May; ZAOstock has no fiscal sponsor and sponsorship is a commercial spend.
- Artist contracts carrying the Friday soundcheck clause. UNASSIGNED, 24 Aug (34ae259d).
- Local-business baseline, a normal Saturday before the day. Zaal, before 3 Oct. Black Moon first.

## Blocks the announcement

- Pitch deck v1, three variants. Zaal, was due 21 Aug (8556d703). Words written; assembly remaining. (HTML deck landed 28 Aug.)
- Sponsor tiers and discount authority. Zaal, was due 21 Aug (b80026fc). Gated on the deck. (Site now says packages on request.)
- Brand kit for ZAOstock and The ZAO plus print deliverables. Samantha, 30 Aug (801d6743).
- The poster. Zaal to delegate, was due 20 Aug (53e3ff3a). Cannot start until set times exist.
- Artist house, Arbor Camp. Zaal, 24 Aug (9e2ad6a8). Housing is the remaining nut.
- Transport with Bendigo. Zaal, 15 Sep (b24c0323).

## Promotion surfaces

All cheap, all overdue, all independent. Good delegation candidates.

- Photos onto zaostock.com. Zaal, was due 20 Aug (27dfa999). Still the one visual gap on 29 Aug.
- Partner section: Star 97.7 and Black Moon logos. Zaal, was due 20 Aug (fbcf1d46). DONE 28 Aug (/partners, six logos).
- Black Moon logo onto partner surfaces. Zaal, was due 23 Aug (80cdef1b). DONE on the site; poster and backdrop still Candy's.
- Facebook event. Zaal, was due 21 Aug (cc314651).
- Facebook page. Zaal, no date (161567c3).
- Star 97.7 radio appearance with Paul. UNASSIGNED, 5 Sep (236edf76).
- Heart of Ellsworth org video onto the site. Zaal, 24 Aug (b090e2bf).
- Follow up with Colleen. Iman, no date (f105182b).

## Day-of operations

Each one needs a name against it before late September.

- First Aid contact and kit, no dedicated person (Zaal, 27 Aug). Zaal, no date (71716c06).
- Stage managers, parklet and Black Moon, both unnamed. Sequential, so one person could cover both. UNASSIGNED, before 3 Oct.
- Sound cover for the WaveWarZ block, since Stilo is battling in it. UNASSIGNED, before 3 Oct.
- Livestream and virtual, split: Aziz owns the rig and Restream, Ohnahji owns scheduling and guests, Motomoto in the crew. Closed 27 Aug (bb2b9326).
- Fire permit for the fire spinning. Zaal, was due 21 Aug (c03f74b5). (Fire time and place are Dcoop's to say, 28 Aug.)
- LiDAR venue scan for the Decentraland build. Zaal, no date (ca119cdf). (Now a builder-battle track, zaostock.com/build.)

## Livestream, the Baraza OBS rig

Aziz owns the rig half of the livestream split, and the Baraza TV OBS build is that rig.

- Aziz: the rtmps ingest URL and stream key (Cloudflare Live Input), THE blocker. Zaal to chase, was due 22 Aug (654b9aba). Encode path proven end to end; the ingest endpoint is the only untested link.
- Zaal: send Aziz the Windows desktop specs. Was due 22 Aug. Zaal owes specs; Aziz owes the plugin list and the ingest URL.
- Relay the plugin answer to Motomoto: the only true third-party plugin is Advanced Scene Switcher; obs-websocket v5 and Browser Source ship inside OBS 28+; 64-bit VLC and Python 3.12 are machine deps.
- Aziz: export Baraza_TV_v2.json from the origin machine. Before any test. The ask is in baraza-tv PR #5.
- Run the 10-minute test, then mark baraza-tv PR #5 ready for review. Zaal and Aziz, after the ingest URL lands.

## What Monday has to settle

- Sound: what Steve's PA offer covers, and a named backup started in parallel.
- The city: what form the insurance certificate takes, and whether the Art of Ellsworth exemption covers our permit window.
- The daytime is full: one venue at a time from noon gives the slots; Steve's offer to fill blanks is a reserve, not a need.
- Who covers sound during WaveWarZ.
- Stage manager for the parklet and one for Black Moon after six.
- Who asks Black Moon for the normal-Saturday baseline, and by when.
- Livestream: has Aziz sent the rtmps ingest URL and key.

Six items above had no owner. An unassigned item is not waiting on anybody, which means it is not moving.
