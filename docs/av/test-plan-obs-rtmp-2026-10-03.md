# ZAO x Baraza OBS-to-RTMP: test plan through 3 October 2026

Written 27 August 2026. Three stages, each with its own pass criteria. Stage
1 was due 22 August and has not run. No date below is set; every slot is UNSET
until Zaal types one. Chain and link numbers refer to
`docs/av/livestream-chain-2026-10-03.md`.

## Stage 1: the pipe, today 28 August, both topologies, both boxes

Rewritten to Zaal's 28 Aug 05:2x verdict: **test both topologies today,
repeatedly; Zaal runs the desktop test himself; encode box is either the
laptop or the desktop at home, decided by the test; destinations are X on the
WaveWarZ account, YouTube on the ZAO channel, Twitch, and as many others as
can be included.**

**What is tested:** links 3, 4, 6, 7 and 8 from the house. Not cameras, not
the parklet, not macros. Two runs minimum:
- **Run B first** (OBS straight to Restream): needs nothing from anyone.
  Proves the encoder, the Restream account, and every destination with a
  login. Do this one before anything else.
- **Run A** (OBS to Aziz's Cloudflare Live Input, then out): needs the
  ingest URL and key from Aziz. If they have not arrived, A waits and B is
  still a complete result for today.
- Repeat each on the other box if both boxes are available.

**When:** today, 28 August. Time UNSET. Each run is ten minutes plus setup.

**Who runs it:** Zaal, at the desktop or the laptop, on his own. Aziz is
needed only for run A (the ingest, and a look at the Cloudflare side after).

**Setup, from `obs/WINDOWS-SETUP.md` section 6:** Service Custom, server the
rtmps URL, the key in the field. NVENC, CBR 6000 kbps, 1080p30, keyframe 2 s,
AAC 160 kbps 48 kHz. Key goes in OBS only, never in a file, never in the topic.

**Steps, section 7 of the same doc, adjusted for what 20 Aug found:**
1. Bridge running, `http://localhost:8080/` up.
2. OBS open, "Baraza Live" collection active via WebSocket
   (`set_current_scene_collection`), not the launcher bat, which is broken.
3. ADVSS loaded. Macros NOT imported (gap 5, they target the missing v2
   collection). Step 3 of the doc's checklist is skipped and says why.
4. Pre-show scene renders, corner bug and ticker visible, no black boxes.
5. Stream settings filled.
6. Start Streaming; watch OBS stats for 3 minutes.
7. Aziz confirms playback.
8. Scene switch Pre-show > Live > BRB > Live; Aziz confirms it holds outbound.
9. Stop Streaming; note the sustained upload bitrate.

**Pass:** Aziz sees video and audio for 3 continuous minutes; dropped frames
under 1 percent in OBS stats; the scene switch shows on his side; the sustained
bitrate is at or near 6000 kbps. Write the numbers into this file.

**Fail modes and what each means:**
- Connect refused or key rejected: wrong URL or key, or the Live Input is not
  created. Aziz's side.
- Connects, Aziz sees nothing: Cloudflare input state or watch page. Aziz's side.
- Dropped frames over 1 percent on a 948 Mbps link: encoder or local, not
  network. Lower to 720p30 4500 kbps and retry, per the doc.

## Stage 2: end to end from the parklet, Friday 2 October, soundcheck night

**What is tested:** links 1, 2, 5, 6, 8, 9 together. Real desk audio, a real
camera, the parklet's real internet, the real destinations. The Doc already
says "the streaming chain end to end" must work by Friday night.

**When:** Friday 2 October, during soundcheck. Time within the evening UNSET;
Dcoop owns the soundcheck schedule.

**Who:** Aziz (rig), Ohnahji (runs the show side, can test a guest segment if
one is planned), Zaal, whoever operates the camera (UNSET), the sound operator
on duty (UNSET). Steve or his desk operator for the main outs.

**Prerequisites, each UNSET today:** internet at the parklet with a measured
upload number; the desk identified so the interface or USB out is known; at
least one camera and its operator; the destination list and the topology (A
or B) decided; where the streaming computer sits.

**Pass:** 30 continuous minutes on every destination with desk audio and
camera video; a local recording exists on the desktop for the same 30 minutes;
one deliberate disconnect and reconnect of the uplink survives with the stream
resuming; the indoor screens at Black Moon show the outdoor stream (see
`docs/av/indoor-mirror-2026-10-03.md`). Write the upload number into the AV
spec, link 5.

## Stage 3: the day, Saturday 3 October, 12:00 to 18:00 ET

The virtual window from doc 2316: 12:00 to 18:00 Eastern, crew of 5 to 10,
any two-hour slot counts. Music starts at noon (Zaal, 27 Aug), so the stream
window and the doors open together at 12:00. Aziz owns the stream staying up, Ohnahji
owns what is on it. Crew roster for the window: UNSET beyond Aziz, Ohnahji and
Motomoto (see the identity flag in the chain doc).

**Pass for the day:** the stream is up for the whole window with no gap longer
than the BRB scene covers; a recording of the full window exists locally and,
if topology A, at Cloudflare; the recording lands where
`docs/av/content-capture-2026-10-03.md` says.

## What baraza-tv PR #5 must carry before it is marked ready

PR #5 (`docs(obs): Windows desktop setup guide`, draft, untouched since 18
Aug) is a docs PR. **Nothing in it technically gates Stage 1**: the desktop is
already set up by following it. What gates Stage 1 is the ingest URL and key.

What must land in PR #5 before it comes out of draft, so the next machine does
not rediscover 20 August:
1. Section 3: ADVSS installs only to `C:\Program Files\obs-studio\` with
   elevation; the per-user plugin folder is not scanned (gap 2). And ADVSS
   1.36.1 writes its config to `plugin_config\advanced-scene-switcher\`, not
   `basic/advss/` (gap 6), so the reader path in `baraza_advss_reader.py` needs
   fixing before the dashboard's ADVSS panel means anything.
2. Section 4: `baraza-obs-launch.bat` fails on every machine on its `^`
   continuations (gap 3); the scriptable path is
   `set_current_scene_collection` over WebSocket.
3. Section 3 or a new section: macros are for the v2 collection the repo does
   not ship; do not import them into Baraza Live (gap 5).
4. Section 6 or 7: the "Camera" VLC source points at an origin-machine path
   (gap 4); repoint before any playout scene is used.
5. Prereqs: ffmpeg 8.x on PATH; ports :8080, :9001 and :4455; Python 3.12 is
   preferred, not required (gap 1).

What must come from Aziz for anything beyond a bare pipe: the
`Baraza_TV_v2.json` export. Asked in the PR body on 18 Aug and in the draft.

Whether PR #5 merges before Stage 1 is Zaal's call; it does not need to.
Whether it merges before Stage 2 matters more, because Stage 2 is the first
time someone other than Zaal may be at the machine.

## Results log

| Stage | Date | Sustained kbps | Dropped frames | Pass | Notes |
|-------|------|----------------|----------------|------|-------|
| 1, run B, desktop | 2026-08-28 | | | | destinations reached: |
| 1, run B, laptop | 2026-08-28 | | | | |
| 1, run A, desktop | 2026-08-28 or when the ingest arrives | | | | |
| 1, run A, laptop | | | | | |
| 2 | 2026-10-02 | | | | |
| 3 | 2026-10-03 | | | | |

Credit anything adopted to Build-Africa-DAO / Aziz.
