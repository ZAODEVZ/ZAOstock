# ZAOstock livestream chain - 3 October 2026

Written 27 August 2026. Every link in the chain from the parklet to a viewer,
what is proven, what is not, and the one link nobody has tested. Companion to
`docs/plans/av-spec-2026-10-03.md` section 6.

Ownership (Zaal, 26 Aug, grill item 28): **Aziz owns the rig and Restream.
Ohnahji owns scheduling and guests.** Aziz owns whether it is broadcasting,
Ohnahji owns what is on it.

## The chain, link by link

| # | Link | What it is | Proven? | Owner | Notes |
|---|------|------------|---------|-------|-------|
| 1 | Source, audio | Main outs of the on-site desk into an audio interface, or the desk's own USB out (Fellenz, 24 Aug) | No. Desk is UNSET (Steve's PA) | Steve for the desk, UNSET for the interface | No interface owned or bought |
| 2 | Source, video | Cameras at the parklet. Count and operators UNSET. Archived plan named an ATEM switcher from a prior ZAO event, UNVERIFIED | No | UNSET | Phones as backup, per the archived plan |
| 3 | Streaming computer | Zaal's Windows desktop, Ellsworth. Ryzen 5 3600, GTX 1660 (NVENC, Turing), 16 GB, Win 10 Pro 22H2, OBS 32.2.1 | Yes, as a machine. Specs measured 20 Aug | Aziz (rig), Zaal (hardware) | It is a desktop; where it sits on the day is UNSET |
| 4 | Encoder | OBS, h264_nvenc, CBR 6000 kbps, 1920x1080, 30 fps, keyframe 2 s, AAC 160 kbps 48 kHz, FLV | **Yes.** ffmpeg at exactly these settings, 10.1 s, 7,908,052 bytes, ~6.3 Mbps, verified with ffprobe, 20 Aug | Aziz | Everything up to the network hop |
| 5 | Uplink | Internet at the parklet | **No. Untested by anyone.** Zaal's house: 948 Mbps up, Fidium fiber, measured 20 Aug. That is not the parklet | UNSET | A 6 Mbps stream is 0.6 percent of the house link; the parklet has no number at all |
| 6 | **Ingest** | **Aziz's rtmps ingest URL and stream key** (Cloudflare Live Input, per baraza-tv `STREAMING-BACKEND.md` and `obs/WINDOWS-SETUP.md` section 6) | **No. THE untested link.** Owed by Aziz since the 22 Aug test date | Aziz | Nothing local substitutes. If one thing gets chased, this |
| 7 | Restream | In Zaal's own verdict ("Aziz = rig + Restream"). Zaal's account already runs the weekday stream to Twitch, YouTube, X | Account exists. Its place in this chain is UNSET, see below | Aziz | Two topologies fit the facts, section 2 |
| 8 | Destinations | Platforms and accounts for ZAOstock | **No. None recorded anywhere for this event** | Aziz, Zaal for accounts | Deck slide 7 note: no platform name public until the stream has run once |
| 9 | Recording | Local OBS record on the desktop, and/or Cloudflare Stream Live recording at the ingest | No. Neither configured | Aziz | The Doc wants local capture so a dropout does not lose the day |
| 10 | Indoor mirror | Screens inside Black Moon showing the outdoor stream | No. "To build" in the production plan | ZAO, no name | Needs links 1 to 8 first |

Proven links: 3 and 4. Untested links: 1, 2, 5, 6, 8, 9, 10. Link 7 exists but
is unplaced. The one that gates a test of everything downstream is **link 6**.

## Two topologies fit what is on disk, and nobody has picked one

Restream is in Zaal's verdict. Cloudflare is in the Baraza rig. Where they sit
relative to each other is not recorded. Either:

**A. OBS to Cloudflare, Cloudflare fans out.**
OBS -> rtmps Cloudflare Live Input (Aziz) -> Cloudflare Live Outputs (raw RTMP
republish, up to 1,000 per input per `STREAMING-BACKEND.md`) -> Restream RTMP
ingest -> Twitch, YouTube, X, others. Baraza's watch page gets HLS from the same
input. One extra hop before Restream.

**B. OBS to Restream directly.**
OBS -> Restream RTMP ingest -> destinations. Cloudflare and the Baraza rig are
not in the path. Simpler, and the archived `zaostream` research assumed it, but
it drops the Baraza watch page and Aziz's ingest is then not the link being
tested.

This is Aziz's call with Zaal; it is asked in `docs/drafts/aziz-2026-08-27.md`.
Until it is answered, the destinations column stays UNSET.

## The Baraza rig, status read 27 August

From `~/zao-vault/handoffs/baraza.md` (desktop lane, 20 Aug) and
`gh pr view 5 --repo Build-Africa-DAO/baraza-tv` run today.

**PR #5** `docs(obs): Windows desktop setup guide (OBS + bridge + RTMP test)`,
branch `zaal/obs-windows-setup`. State: **OPEN, still DRAFT, mergeable, zero
reviews, zero comments, last updated 2026-08-18T14:38:07Z.** Nine days
untouched. Aziz has not responded to the two asks in its body (export
`Baraza_TV_v2.json`, confirm the plugin list). The desktop lane's 20 Aug
findings (gaps 1 to 6 below) are in the vault handoff, not yet in the PR.

What is done on the desktop (20 Aug):
- OBS 32.2.1, 64-bit VLC 3.0.23, Python 3.13.3 with all bridge deps, ffmpeg
  8.1.2, Advanced Scene Switcher 1.36.1 installed (needed an elevated click;
  Zaal did it at the machine).
- Bridge live on :8080 HTTP and :9001 WS; 30 of 30 overlay URLs serve content.
- `Baraza_Live.json` imported: 23 scenes, 30 browser sources, 1 VLC source.
- OBS WebSocket on :4455 with auth. Password in local config, never committed.
- Encode path proven (link 4 above).

What is still broken or missing:
- Gap 5: all 52 ADVSS macros target scenes from the "Baraza TV v2" collection,
  which the repo does not ship. Zero overlap with `Baraza_Live.json`. Macros
  deliberately not imported. The automation layer is inert until Aziz exports
  `Baraza_TV_v2.json`.
- Gap 4: the single VLC source, "Camera", points at an absolute media path on
  Aziz's origin machine (path withheld here, repo is public). PLAYOUT scene
  shows black until repointed.
- Gap 3: `baraza-obs-launch.bat` fails on the `^` continuations inside the
  quoted PowerShell block, on every machine. Start OBS normally;
  `cl.set_current_scene_collection("Baraza Live")` over WebSocket is the
  scriptable path.
- Gap 6: `baraza_advss_reader.py` reads a config path ADVSS 1.36.1 no longer
  writes, so `/api/advss/status` is `configFound: false` forever. Reader fix
  needed.
- Gap 1: the plugin list that was going to Aziz was missing ffmpeg 8.x on PATH,
  ports :8080 and :9001, and overstated Python 3.12 (3.13 works via fallback).

Untouched: Zaal's own OBS collections, Untitled (6 scenes) and WW1 (7 scenes),
intact on disk. `user.ini` backed up before anything touched it.

## The Oct 3 virtual window

From doc 2316 (18 Aug call, Zaal, Iman, Aziz): **12:00 to 18:00 Eastern,
virtual crew of 5 to 10, any two-hour slot counts.** The deck repeats it as
"5-10 virtual crew in two-hour shifts across the 12-6 window". Note the
in-person day opens at noon (Zaal, 27 Aug), so the window and the doors
match. Also from that call, not built: a Decentraland mirror of Franklin Street
from a LiDAR scan (Zaal to get the LiDAR camera, no date), and iPads at Black
Moon running it. No crew names for the window are on disk beyond Aziz, Ohnahji
and Motomoto.

## One identity flag, not resolved here

Doc 2316 records, as a CRM finding, that "Aziz" and "Motomoto" are two contact
rows for the same person (Craig track name `azizmotomoto`), and titles the call
"Motomoto ZAOstock Virtual-Side Catch-up" with Aziz as attendee. The people map
of 27 Aug lists Motomoto as a separate crew member who "does not lead a half".
One of these is wrong. Zaal knows which. It changes nothing in the chain table
but it changes who the Aziz draft is addressed to and whether the Motomoto
plugin relay is a second message or the same one.

## What unblocks a full test, in order

1. Aziz: rtmps ingest URL and stream key (link 6). Zaal sends the specs first;
   that is the trade Aziz named on 18 Aug.
2. Aziz: which topology, A or B (link 7 and 8).
3. Aziz: `Baraza_TV_v2.json` export (macros), and the "Camera" media path.
4. Zaal: internet at the parklet, a measured number (link 5).
5. Steve: which desk, so link 1 can be bought or borrowed.
6. Run the ten-minute test in `obs/WINDOWS-SETUP.md` section 7. Then Friday
   2 October, end to end, from the parklet.
