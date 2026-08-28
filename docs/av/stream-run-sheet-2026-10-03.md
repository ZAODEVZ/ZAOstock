# ZAOstock stream run sheet, 3 October 2026

The stream as a show. Built 28 August 2026 from `docs/plans/ros-5min-2026-10-03.md`
v7 (on `ws/fold-2026-08-28`, PR #57): times, acts and gaps are the ros's;
nothing on stage is moved here. This file says what the viewer sees and hears
at each of those times, and who cues it.

Two owners, per Zaal (26 Aug): **Aziz owns whether it is broadcasting** (rig,
encoder, scenes, destinations, recording). **Ohnahji owns what is on it**
(segments, guests, callers, chat, the stream as a show). Where a cue is
Zaal's or the MC's, it says so. UNSET where nobody has said.

Window per doc 2316: 12:00 to 18:00 ET, crew of 5 to 10 in two-hour slots.
Music starts at noon (Zaal, 27 Aug). Whether anything streams after 18:00 is
UNSET (section 5).

## Scenes and overlays, named once

Scene names are the roles, not the Baraza collection's labels; map them in OBS
once the collection question (v2 export) is settled.

| Scene | What it is | Audio |
|-------|------------|-------|
| PRE-SHOW | Holding card: ZAOstock mark, "starts at noon", sponsor logos, date | Music bed, UNSET source; not the outdoor PA |
| STAGE WIDE | Main camera on the stage | Desk main outs |
| STAGE CLOSE | Second camera or a zoomed shot, if a second camera exists (UNSET) | Desk main outs |
| MC | Same camera on whoever holds the MC mic; lower-third "ZAOstock" | Desk, MC mic up |
| SPONSOR | Sponsor sting or card; live MC read over STAGE WIDE if Q8 says live | Desk, or the sting's own audio |
| HOLD | "Next up: ___" card with the next act, sponsor bug, tip or Respect QR | Music bed or desk ambience |
| VIRTUAL | Ohnahji's segment: guest or caller, split with a stage shot | Guest audio, ducked stage |
| WAVEWARZ | Stage wide with the WaveWarZ overlay; vote overlay only if Q18 says the vote is live | Desk |
| MOVE | "We are walking next door" card, or a handheld shot of the walk if a camera goes | Desk until strike, then bed |
| SIGN-OFF | Thanks card, where the recording will live, sponsor logos | Music bed |
| BRB | Fault card, "back in a moment" | Silence or bed |

Always on: corner bug (ZAOstock), ticker with the next act, sponsor logo
rotation (list UNSET, sponsor deck), tip or Respect QR (from the archived
zaostream plan; whether it is used is UNSET). Lower-third with the act name
fades in at each act's first bar and out after 20 seconds; on again at the
last song.

## Before the stream

| Time | Cue | Owner | Status |
|------|-----|-------|--------|
| Fri 2 Oct, soundcheck | Stage 2 test end to end: desk audio, camera, parklet uplink, every destination, local recording, indoor screen. `docs/av/test-plan-obs-rtmp-2026-10-03.md` | Aziz rig, Ohnahji watches the show side | Must pass before Saturday |
| 08:00 | Stream desk powered where it will sit; box per the 28 Aug test result | Aziz | Box UNSET until the test |
| 08:15 | Desk main outs into the interface or USB; level check against the PA line checks | Aziz with the sound operator (name waits) | Interface UNSET, gated on the 28 Aug test |
| 10:30 | Stream rig check (ros row): camera framed, overlays render, bridge up, destinations armed but not live, local recording path has space | Aziz | Space needed: about 16 GB for six hours at 6 Mbps |
| 10:30 | Show side check: run order card matches the ros, sponsor list on the desk, virtual guests confirmed for their slots, chat moderator logged in | Ohnahji | Guests UNSET, moderator UNSET |
| 11:00 | MC mic check on stage; stream hears it | Aziz, MC (name waits) | |
| 11:45 | Content: the empty street shot, recorded not streamed | Shooter (name waits) | |
| 11:50 | Go live on PRE-SHOW to every destination. PROPOSED: ten minutes early so a noon click lands on a picture | Aziz | PROPOSED, Zaal or Ohnahji to confirm |
| 11:50 | Post the live links: X (WaveWarZ), YouTube (ZAO channel), Twitch, Farcaster via Firefly (Farcaster is a post, not a destination) | Ohnahji, or MARKETING per the socials rule | Who posts UNSET |
| 11:55 | Local recording ON. Check the file is growing | Aziz | |

## The day, cue by cue

| Time | On stage (ros v7) | On screen | Cue | Owner | Q or UNSET |
|------|-------------------|-----------|-----|-------|------------|
| 12:00 | INTRO on the mic, 5 min | MC, lower-third "Welcome to ZAOstock" | Cut PRE-SHOW to MC at the first word | Aziz | Q7: who speaks, what is said |
| 12:05 | 1. THE CROWN VICS, 30 | STAGE WIDE, lower-third at first bar | Cut on the downbeat | Aziz | |
| 12:35 | Changeover 10: MC talks the event, the 6pm move, Art of Ellsworth, plus a sponsor spot | MC, then SPONSOR, then HOLD with "Next: Acadia Rising" | Sponsor spot as the MC reads it; HOLD for the last two minutes | Aziz cuts, Ohnahji calls the order | Q1 (10 confirmed?), Q8 (live or sting) |
| 12:45 | 2. ACADIA RISING (Sen), ~30 | STAGE WIDE | Cut on the downbeat | Aziz | |
| 13:15 | Changeover 5: swap only | HOLD "Next: Dcoop", sponsor bug | No MC segment; HOLD the whole 5 | Aziz | Q12 (only real with shared backline) |
| 13:20 | 3. DCOOP, ~30 | STAGE WIDE | Cut on the downbeat. AV cover during his set: name waits | Aziz | |
| 13:50 | Changeover 5: swap only | HOLD "Next: Lyons Den" | HOLD the whole 5 | Aziz | |
| 13:55 | 4. LYONS DEN, ~30 | STAGE WIDE | Cut on the downbeat | Aziz | Q3 answered |
| 14:25 | Changeover 10: event talk, WaveWarZ pitch, sponsor spot | MC, SPONSOR, then VIRTUAL if Ohnahji has a guest, else HOLD "Next: Fellenz" | First natural VIRTUAL slot of the day | Ohnahji calls it, Aziz cuts | Guest UNSET |
| 14:35 | 5. FELLENZ, ~30, closes the outdoor block | STAGE WIDE | Cut on the downbeat | Aziz | Q2 |
| 15:05 | OPEN STRETCH, about 40 min: one dream act if time, else MC and sponsor spots | If an act: STAGE WIDE. If not: the main VIRTUAL block of the day, Ohnahji's guests and callers, split with the street | This is Ohnahji's window; plan 30 minutes of show for it and drop it if an act lands | Ohnahji | Q4, Q5; guests UNSET |
| 15:45 | Battle stage reset: MC and sponsor spots, hands to Hurricane | MC, SPONSOR, HOLD "WaveWarZ at 4" | Sponsor spots read live | Aziz | |
| 16:00 | WAVEWARZ STORY, Hurricane with Stilo. Lights on | STAGE CLOSE on the two of them, WaveWarZ overlay on; capture this clean (content-capture row 6a) | Cut to close, lower-thirds for both | Aziz; the clip is the content shooter's too | Q16 length, Q17 lights |
| 16:15 | Rules, bracket, how to vote | WAVEWARZ, vote instructions as an on-screen card (online vote link, UNSET what it is) | Card on for the whole explanation | Ohnahji supplies the card, Aziz shows it | Q18 |
| 16:25 | Battle 1 | WAVEWARZ, battler lower-thirds; vote overlay if live | Cut with the flow; no HOLD | Aziz | Q18 |
| 16:50 | Voting window: Hurricane plus sponsor spots | WAVEWARZ with a "vote now" card, then SPONSOR | Vote card up the whole window | Ohnahji | Q19 |
| 17:00 | Battle 2 | WAVEWARZ | | Aziz | |
| 17:25 | Voting window | As 16:50 | | Ohnahji | |
| 17:35 | FINAL. Low sun, sunset 18:12 | WAVEWARZ; exposure check as the light drops | Camera exposure is the cue here, not the scene | Aziz | Q17 lights, Q20 prize |
| 17:55 | Result. Hurricane walks the crowd next door. Stilo plays out on the outdoor PA | WAVEWARZ for the result, then MOVE | Result card if a winner name is allowed on screen (UNSET) | Aziz | Q20 |
| 18:00 | Outdoor PA strike begins. THE MOVE. Stilo DJ set 18:00 to 20:00 inside | MOVE, then SIGN-OFF | Stream audio source ends with the strike; switch to bed before the desk goes | Aziz | Section 5: does anything stream after this |
| 18:05 | | SIGN-OFF card two minutes, then stop streaming on every destination | Stop recording after the stream, not before; confirm the file closed | Aziz | |
| 18:10 | | | Copy the local recording off the box before anything is powered down; where it lands: ArDrive, folder UNSET (content-capture) | Aziz | UNSET |

## Faults, what the viewer sees

| Fault | Screen | Who calls it |
|-------|--------|--------------|
| Desk audio lost | STAGE WIDE with camera audio if the camera has a mic, else BRB | Aziz |
| Camera lost | HOLD with desk audio; the show continues as radio | Aziz |
| Uplink drops | Nothing to cut; OBS keeps recording locally. Restream or Cloudflare shows the destinations' own "offline" until reconnect; on reconnect, BRB for ten seconds then back | Aziz. Fallback matrix link 5 |
| One destination fails | Others continue; do not stop the stream to fix one platform | Ohnahji notes it in chat |
| Act overruns | Nothing on screen changes; overrun rule is the stage manager's (YES, 27 Aug) | Stage manager (name waits) |

## Virtual crew slots

Doc 2316: 5 to 10 people, any two-hour slot counts. Three slots cover the
window; two people per slot is the minimum for a chat moderator and a segment
producer. Every name UNSET.

| Slot | Rig (Aziz's side) | Show (Ohnahji's side) |
|------|-------------------|-----------------------|
| 12:00 to 14:00 | Aziz, plus UNSET | Ohnahji, chat moderator UNSET |
| 14:00 to 16:00 | UNSET | UNSET; the 14:25 and 15:05 VIRTUAL slots are in this shift |
| 16:00 to 18:00 | UNSET | UNSET; vote cards and the result |

## 5. After 18:00

The window ends at 18:00 and the outdoor rig is being struck. Streaming the
indoor evening (Stilo 18:00 to 20:00, Steve's set 20:00 to 22:00) would need a
camera and an audio feed from the house PA inside Black Moon, neither of which
is planned. **UNSET.** If Zaal wants the evening on the stream, that is a
second rig, not a longer run of this one.

## What this sheet cannot fill

- Q7, Q8, Q16, Q18, Q19, Q20 from the ros: intro words, sponsor spots live or
  recorded, story length, vote on screen or not, who reads sponsor spots in
  the voting windows, prize. Each changes a cue above.
- Ohnahji's guests for 14:25 and the 15:05 block.
- Whether a second camera exists (STAGE CLOSE), gated on the 28 Aug test like
  the rest of the gear.
- The online vote link and whether a winner's name goes on screen.
- Every crew name.
