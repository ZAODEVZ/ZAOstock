# Friday 2 October 2026: soundcheck night, AV run sheet

Written 27 August 2026. Built from the AV LIST and RUN OF SHOW tabs of the
Doc snapshot and the production plan. The Doc says four things about Friday
and nothing else; everything the Doc does not say is UNSET here, not guessed.
No performer names in this file: the repo is public and the lineup reveal is
1 September. Acts are numbered as in the production plan grid.

**What the Doc says, verbatim in substance:**
1. Mandatory for everyone playing, and it goes into the artist contracts.
2. Checks happen at whichever stage the act actually plays, so the night runs
   outside and inside.
3. The outdoor stage is already standing from the summer concert series;
   nothing needs building. It doubles as a filming and recording night.
4. What must be working by Friday night: the full outdoor PA, the streaming
   chain end to end, and enough of the indoor rig to check the DJ setup.

Also on record: the Friday soundcheck covers sound, not setup (Improvements
tab); Dcoop owns it (people map); Fogtown Brewing is the target for a Friday
night performance after the soundcheck (Doc, standup notes); the ZAOville
lessons ask for earlier sound setup, more room per artist, more spare mics and
cables, and wiring run properly rather than taped down.

## Start time, and the one thing it depends on

Friday start: **UNSET.** The Doc gives no time. It depends on when Steve's PA
arrives and is up (AV spec question 4, setup times, UNSET) and on whether acts
are travelling in that day. Fogtown after the soundcheck puts an end on the
night, also UNSET.

## Who arrives when

Every time UNSET. The list is who must be on site for the night to do what the
Doc says it does.

| Who | Why on Friday | Arrives | Status |
|-----|---------------|---------|--------|
| PA owner and crew (Steve Peer, or whoever he sources) | The full outdoor PA must be up and working by Friday night. Setup time is theirs | UNSET | PA still sourcing |
| Dcoop | Owns the soundcheck. Runs the order, keeps time, holds the artist list | UNSET | Named |
| Sound operator, outdoor | Runs the desk for every outdoor check. If the Saturday 12:00 to 16:00 operator is a different person from the WaveWarZ operator, both come Friday | UNSET | NEEDS NAME, both |
| Sound operator, indoor | Runs the indoor check | UNSET | NEEDS NAME |
| Each outdoor act, 1 to 5 | Their check, on the outdoor stage | UNSET, per act | Mandatory, in contracts |
| The four WaveWarZ competitors and the host | Battle mic and playback check, outdoor stage | UNSET | Locked as performers; Friday attendance not recorded |
| The DJ covering changeovers | Confirm the DJ rig plugs into the outdoor PA and what plays during the 18:00 walk | UNSET | DJ proposed only (Steve's list) |
| The 18:15 DJ set | Indoor DJ check, the one thing the Doc requires indoors | UNSET | Set confirmed by the artist |
| Steve's crew and the evening act | Indoor check if they want one; both proposed, not booked | UNSET | Proposed |
| Aziz | Stream chain end to end, Stage 2 of the test plan | UNSET, remote or on site UNSET | Named |
| Camera operator | Filming night, and the video half of Stage 2 | UNSET | Nobody |
| Zaal | Everything above that has no name, and the parklet internet measurement | UNSET | |
| Black Moon (Steve or Katina) | Indoor access, house power, the screen for the indoor mirror | UNSET | |

## Order of checks

The Doc is silent on order. The order below is PROPOSED and follows one rule:
what cannot be tested without something else goes after that thing.

| # | Check | Where | Needs first | Pass |
|---|-------|-------|-------------|------|
| 1 | PA up: mains, subs, monitors, desk, power from the parklet circuits | Outdoor | Power answer from the City (see `docs/av/power-internet-requirements.md`) | Pink noise or a track through every speaker, every monitor mix, no hum. Circuit load written down |
| 2 | Line check of every input: vocal mics, instrument mics, DI boxes, MC mic, the DJ rig, battle mics and playback | Outdoor | 1 | Every channel labelled on the desk and heard in mains and monitors. Spares counted |
| 3 | Desk to stream: main outs into the interface or USB, level into OBS | Outdoor | 2, and the interface question (AV spec section 6) | Desk audio in OBS meters, no clipping at the loudest check |
| 4 | Act checks, one at a time, at the outdoor stage | Outdoor | 2 | Each act signs off its monitor mix. Order among acts UNSET; Dcoop sets it. Every act is recorded (filming night) |
| 5 | WaveWarZ check: battle mics, playback source, host mic, and the voting display if there is one | Outdoor | 2 | Four handhelds and the host heard clean at once; the beats run from the source that will be used Saturday |
| 6 | Changeover rehearsal: one full act-to-act swap with the DJ covering, timed | Outdoor | 4 | Under the grid's changeover length, with the DJ audible the whole time |
| 7 | Stream chain end to end, Stage 2 | Outdoor to the world | 3, a camera, the parklet internet, Aziz's ingest, the destinations | Per `docs/av/test-plan-obs-rtmp-2026-10-03.md` Stage 2: 30 minutes on every destination, local recording exists, one uplink drop survived |
| 8 | Indoor mirror: the outdoor stream on the Black Moon screen | Indoor | 7 | Picture inside while the stream runs outside |
| 9 | Indoor DJ check: controller, mixer, connection to the house | Indoor | Black Moon open, house PA question answered | The 18:15 set's rig heard through whatever the house PA is |
| 10 | Walk-in music for the 18:00 move | The door | A source that is not the outdoor PA | Music plays at the door with the outdoor rig off |
| 11 | Lighting for the 16:00 to 18:00 block, if any is coming | Outdoor, after dark | Bomb Squad or whoever is asked | Lit stage on camera after sunset |
| 12 | Outdoor strike rehearsal, or at least the plan for it said out loud | Outdoor | 1 | Who strikes at 18:00 Saturday and how long it takes |

Checks 1 to 3 gate everything. Check 7 is the one most likely to fail on
something nobody controls on the night (the ingest, the uplink), which is why
Stage 1 of the test plan runs from the house before this.

## Must pass before Saturday

From the Doc, plus what the AV work since has added. If any of these fails on
Friday, the fallback in `docs/av/fallback-matrix-2026-10-03.md` starts that
night, not Saturday morning.

| Must pass | Source | If it fails |
|-----------|--------|-------------|
| Full outdoor PA, every input, every monitor | Doc | Backups on record: college AV, Katina's Nextdoor route, Dcoop's monitors, Dcoop buying gear |
| Streaming chain end to end | Doc | Stream runs on whatever passed; anything after the failed link is dropped for Saturday |
| Indoor rig enough for the DJ set | Doc | The 18:15 set plays on its own gear, if the artist brings any; UNSET |
| Every act checked | Doc, mandatory in contracts | An unchecked act gets a line check in its changeover slot, which the grid has no slack for |
| Parklet upload speed written down | AV spec link 5 | Stream at 720p or not at all; see the fallback matrix |
| Local recording proven | Content capture | Cloudflare recording if topology A; else nothing is captured |
| Indoor screen shows the stream | Indoor mirror | Black Moon has no daytime mirror; the footfall fix is lost |

## What Friday is not

Not the setup night. Load-in, vendor setup, First Aid position, merch table
and signage are the Saturday 06:00 block, which cannot be written until the
City answers on vehicle access and load-in times (Improvements tab, item 3).

## Who fills this in

Dcoop: the start time, the act order, and who from his crew is on the desk.
Steve: PA arrival time. Aziz: on site or remote. Zaal: every UNSET name.
