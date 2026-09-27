# ZAOstock stream run sheet, 3 October 2026

The stream as a show: what the viewer sees and hears at each point of the day,
and who cues it. Times, acts and gaps come from `src/content/program.ts`
`BLOCKS`, which is the run of show. **Nothing on stage is moved here.**

> **REWRITTEN 2026-09-18.** The first version was built on 28 August from ros
> v7 and had gone badly out of date. It ran **five acts** (the day has eight),
> it still gave **Hurricane** the 15:45 hand-off and a **WaveWarZ** block from
> 16:00, both off the programme since 2026-09-07 and 09-10, it used the old
> 30-minute sets with 5 and 10 minute changeovers rather than the 09-10 retime,
> and it named **Aziz and Ohnahji** as the two owners, which the 15 September
> call replaced. A sheet that misleads the person running the show is worse
> than no sheet, and this one is read on the day.

**Set times appear in this file on purpose.** It is a crew document, not a
public one. Zaal's rule of 2026-09-12 is that no set time is published: not on
the site, not in posts. Do not "fix" this file by removing the clock, and do
not copy rows out of it into anything public.

## Who owns it

**Zaal runs the stream, video and audio, with the venue AV team** (15 September
call). He emailed for an AV contact and went to the site that evening to
confirm the audio can run through the interface. That replaces the 26 August
split of Aziz on the rig and Ohnahji on the show; neither name is load bearing
here any more, and where this sheet says a cue is somebody's, it means whoever
Zaal has on that job on the day.

**IMan and Thy Revolution run the online side** (co-leads since 31 August):
roughly 1,000 people online against 200 to 250 on the street.

**Zaal holds the MC mic** (his ruling, 2026-09-26: "im going to mc today"). A
v1 script exists for every changeover and the welcome/close, unreviewed by
Zaal - `~/zao-vault/projects/zaostock-mc-script-2026-10-03.md`. The MC column
below is that script, condensed to what each cue needs.

Still UNSET, and each one changes a cue below: the camera count, the sound
operator's name, the partner list on the desk, and whether anyone is
producing a guest segment.

## What the viewer is told, settled 15 September

- **zaostock.com/live is the main link.** Everywhere else carries it. It is the
  link that goes in every post, every bio and every reply.
- **If the stream drops, the Telegram chat is the channel** (`telegram.thezao.com`).
  Anyone on the ground sees it, and if Zaal misses it someone tells him. The
  /live page says so beside the player, so a viewer looking at a dead picture
  does not have to guess.
- **Watch parties have no single format.** One channel carries clean event
  audio from a ZAO account; every other host takes that audio and does their
  own take on it in their own room. Zaal posts the full list on the day.
- **No platform is named publicly until a run passes.**
  `docs/av/livestream-chain-2026-10-03.md` item 8. The stream test is set for
  19 to 21 September (ruled 2026-09-18), and `WATCH_HREF` on /live stays null
  until it passes.

## Scenes and overlays, named once

Scene names are roles, not the Baraza collection's labels; map them in OBS once
the collection question is settled.

| Scene | What it is | Audio |
|-------|------------|-------|
| PRE-SHOW | Holding card: ZAOstock mark, "starts at noon", partner logos, date | Music bed, UNSET source; not the outdoor PA |
| STAGE WIDE | Main camera on the stage | Desk main outs |
| STAGE CLOSE | Second camera or a zoomed shot, if a second camera exists (UNSET) | Desk main outs |
| MC | Same camera on whoever holds the MC mic; lower-third "ZAOstock" | Desk, MC mic up |
| PARTNER | Partner card, or a live MC read over STAGE WIDE | Desk, or the card's own audio |
| HOLD | "Next up: ___" card with the next act, partner bug | Music bed or desk ambience |
| MOVE | "We are walking next door" card, or a handheld shot of the walk | Desk until strike, then bed |
| SIGN-OFF | Thanks card, where the recording will live, partner logos | Music bed |
| BRB | Fault card, "back in a moment" | Silence or bed |

Always on: corner bug (ZAOstock), ticker with the next act, partner logo
rotation (list UNSET). The lower-third with the act name fades in at each act's
first bar and out after 20 seconds, and comes back on at the last song.

**There is no WAVEWARZ scene.** WaveWarZ came off the 3 October programme on
2026-09-07.

## Before the day

| When | What | Who |
|------|------|-----|
| 19 to 21 Sept (ruled 2026-09-18) | **The stream test.** The one thing gating the watch link | Zaal, and he pins IMan when he runs it |
| Fri 2 Oct, 4 to 7 PM | Soundcheck, every act, mandatory. The end to end test belongs beside it: desk audio, camera, parklet uplink, destinations, local recording | Zaal with the venue AV team |

## Saturday, before noon

| Time | What | Who | Notes |
|------|------|-----|-------|
| 08:00 | Stream desk powered where it will sit | Rig lead | Which box UNSET |
| 08:15 | Desk main outs into the interface or USB, level check against the PA line checks | Rig lead with the sound operator | OPEN X brings and runs the PA all day |
| 10:30 | Rig check: camera framed, overlays render, destinations armed but not live, recording path has space | Rig lead | About 16 GB for six hours at 6 Mbps |
| 10:30 | Show side check: the run order card matches this sheet, partner list on the desk | Online side, IMan and Rev | |
| 11:00 | MC mic check on stage, and the stream hears it | Rig lead, MC | MC is Zaal (ruled 2026-09-26) |
| 11:50 | Go live on PRE-SHOW, ten minutes early so a noon click lands on a picture | Rig lead | |
| 11:50 | Post the live link: zaostock.com/live, everywhere at once. The link, never a platform | Online side | |
| 11:55 | Local recording ON, and check the file is growing | Rig lead | A dropout must not lose the day |

## The day

Eight acts, five- to seven-minute changeovers, music 12:05 to 17:40, street
clears at 18:00. Two changeovers carry the MC and a partner spot; the rest are
a swap behind a HOLD card.

| Time | What | Scene | Cue | MC (script v1) | Notes |
|------|------|-------|-----|-----------------|-------|
| 12:00 | Welcome on the mic, 5 min | PRE-SHOW to MC | Cut at the first word | Zaal: who he is, what ZAOstock is, the shape of the day, three housekeeping lines, thanks City of Ellsworth/Black Moon/Heart of Ellsworth, intros The Crown Vics | |
| 12:05 | 1. THE CROWN VICS, 33 | STAGE WIDE, lower-third at first bar | Cut on the downbeat | | Opens the day |
| 12:38 | Changeover 1 (7 min): the MC, the six o'clock move, Art of Ellsworth, a partner spot | MC, then PARTNER, then HOLD "Next: OPEN X" | HOLD for the last two minutes | Zaal thanks Star 97.7 and Wallace Events, then intros OPEN X | |
| 12:45 | 2. OPEN X, 40 | STAGE WIDE | Cut on the downbeat | | They also run the PA all day |
| 13:25 | Changeover 2 (5 min): swap only | HOLD "Next: Grass Rug" | HOLD the whole 5 | Zaal credits WE THE MEDIA (filming) and Bomb Squad (merch/crew), then intros Grass Rug | |
| 13:30 | 3. GRASS RUG, 33 | STAGE WIDE | Cut on the downbeat | | |
| 14:03 | Changeover 3 (7 min): swap only | HOLD "Next: Acadia Rising" | HOLD the whole 7 | Zaal thanks COC Concertz/Thy Revolution and Artizen, then intros Acadia Rising | |
| 14:10 | 4. ACADIA RISING, 33 | STAGE WIDE | Cut on the downbeat | | Routed through Sen |
| 14:43 | Changeover 4 (7 min): the MC and a partner spot | MC, PARTNER, HOLD "Next: Michael Anderson" | | Zaal on WaveWarZ and the supporter page, then intros Michael Anderson | |
| 14:50 | 5. MICHAEL ANDERSON, 33 | STAGE WIDE | Cut on the downbeat | | Solo piano, brings his own keyboard |
| 15:23 | Changeover 5 (7 min): the MC and our partners | MC, PARTNER, HOLD "Next: DCoop" | | THE ROLL CALL - Zaal thanks all ten partners by name, then intros DCoop | |
| 15:30 | 6. DCOOP, 40 | STAGE WIDE | Cut on the downbeat | | He is also the music and AV lead, so AV cover during his own set is an open role |
| 16:10 | Changeover 6 (5 min): swap only | HOLD "Next: LyonsDen" | HOLD the whole 5 | Zaal flags the eating window (Black Moon, next door), then intros LyonsDen Rez Muzik himself | Supersedes the earlier DCoop-gives-the-intro plan; Zaal is sole MC all day |
| 16:15 | 7. LYONSDEN, 40 | STAGE WIDE | Cut on the downbeat | | Filming consent still outstanding: settle it before the first bar |
| 16:55 | Changeover 7 (5 min): swap only | HOLD "Next: Tom Fellenz" | HOLD the whole 5 | Zaal thanks the crew (names UNSET, from crew roster), then intros Tom Fellenz, closing the outdoor stage | |
| 17:00 | 8. TOM FELLENZ, 40, closes the outdoor block | STAGE WIDE | Cut on the downbeat | | |
| 17:40 | Music ends. Thanks, where the recording will live, and that the evening is next door and in person | MC, then SIGN-OFF | Hold SIGN-OFF two minutes, then stop | Zaal: eight-act roll call, thanks partners and crew, points to Black Moon/North Creek, closes with thezao.com | |
| 18:00 | Street clears. Recording OFF, check the file, strike | Rig lead | | | |

**Overrun rule (Zaal, 27 Aug):** an act that runs over loses the time from its
own changeover and the next act still starts on the grid. The stream follows
the grid, not the overrun.

## If it drops

1. Cut to BRB. Do not leave a frozen frame up.
2. Say it in the **Telegram chat**, one line, what is happening.
3. Local recording keeps rolling whatever the uplink is doing.
4. When it is back, cut to STAGE WIDE on the next downbeat, not mid-song.
5. Post once in Telegram that it is back. Nothing else needs saying.

## After 18:00

The outdoor rig is being struck and the evening moves next door to Black Moon
Public House, which is their stage and their licence. **The stream ends with
the parklet.** Streaming the evening would need a camera and a feed off the
house PA inside Black Moon, neither of which is planned, so it is a second rig
rather than a longer run of this one. zaostock.com/live tells a remote viewer
the evening is in person, and the desk carries the question if Zaal wants that
changed.

## What this sheet cannot fill

- The camera count, and therefore whether STAGE CLOSE exists at all.
- The partner list on the desk, and whether spots are read live or played.
- The sound operator's name, and AV cover during DCoop's own set.
- Whether anyone is producing a guest segment for the online side.
