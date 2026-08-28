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
| 3 | Streaming computer | Two candidates, both stay until today's test decides (Zaal, 28 Aug): (a) the Windows desktop at home, Ryzen 5 3600, GTX 1660 (NVENC, Turing), 16 GB, Win 10 Pro 22H2, OBS 32.2.1, specs measured 20 Aug; (b) a laptop, specs UNSET, OBS install UNSET | (a) yes, as a machine; (b) no | Aziz (rig), Zaal (hardware and the test) | Which box goes to the parklet, or whether the feed comes to the house, is what the 28 Aug test settles |
| 4 | Encoder | OBS, h264_nvenc, CBR 6000 kbps, 1920x1080, 30 fps, keyframe 2 s, AAC 160 kbps 48 kHz, FLV | **Yes.** ffmpeg at exactly these settings, 10.1 s, 7,908,052 bytes, ~6.3 Mbps, verified with ffprobe, 20 Aug | Aziz | Everything up to the network hop |
| 5 | Uplink | Internet at the parklet | **No. Untested by anyone.** Zaal's house: 948 Mbps up, Fidium fiber, measured 20 Aug. That is not the parklet | UNSET | A 6 Mbps stream is 0.6 percent of the house link; the parklet has no number at all |
| 6 | **Ingest** | **Aziz's rtmps ingest URL and stream key** (Cloudflare Live Input, per baraza-tv `STREAMING-BACKEND.md` and `obs/WINDOWS-SETUP.md` section 6) | **No. THE untested link.** Owed by Aziz since the 22 Aug test date | Aziz | Nothing local substitutes. If one thing gets chased, this |
| 7 | Restream | In Zaal's own verdict ("Aziz = rig + Restream"). Zaal's account already runs the weekday stream to Twitch, YouTube, X | Account exists. Its place in this chain is decided by today's test, both topologies run (Zaal, 28 Aug) | Aziz, Zaal runs the test | Section 2 |
| 8 | Destinations | Zaal, 28 Aug: X on the WaveWarZ account, YouTube on the ZAO channel, Twitch, and "as many places as we can include in the stream test". Candidate list in section 3 | No. Named, not yet streamed to | Aziz, Zaal for logins | Deck slide 7 note still holds: no platform name public until the stream has run once |
| 9 | Recording | Local OBS record on the desktop, and/or Cloudflare Stream Live recording at the ingest | No. Neither configured | Aziz | The Doc wants local capture so a dropout does not lose the day |
| 10 | Indoor mirror | Screens inside Black Moon showing the outdoor stream | No. "To build" in the production plan | ZAO, no name | Needs links 1 to 8 first |

Proven links: 3 and 4. Untested links: 1, 2, 5, 6, 8, 9, 10. Link 7 exists but
is unplaced. The one that gates a test of everything downstream is **link 6**.

## Two topologies, and the 28 August test runs BOTH

Zaal, 28 Aug 05:2x: **test both today, repeatedly; Zaal runs the desktop test
himself; no verdict until the test says.** So this section is the two things
being tested, not a choice waiting on anyone. Either:

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

Decided by the test, not by a person. Results go in the test plan's log, one
row per topology per run. Until a run passes, neither is the Oct 3 path.

## Destinations: candidates for the 28 August test

Zaal's verdict names three and says to add every place we can. "Login on
record" below means a handle for that platform is written somewhere on disk
(vault, repo); it does not mean a password is anywhere, and who holds the
login is UNSET on every row until Zaal says.

| Destination | Restream supports it | Account | Handle on disk | Login holder |
|-------------|----------------------|---------|----------------|--------------|
| X | Yes | WaveWarZ account (Zaal, 28 Aug) | `x.com/WaveWarZ` | UNSET |
| YouTube | Yes | ZAO channel (Zaal, 28 Aug) | `youtube.com/@zaofestivals` | UNSET |
| Twitch | Yes | Account not named by Zaal; the only Twitch handle on disk is `twitch.tv/wavewarzofficial`; Zaal's weekday stream also goes to Twitch on an account not recorded | see left | UNSET |
| Facebook | Yes, page or profile | `facebook.com/zaofestivals` | yes | UNSET |
| LinkedIn | Yes, personal or company | `linkedin.com/company/zaofestivals`, `linkedin.com/in/zaalp` | yes | UNSET |
| Kick | Yes | No handle on disk | no | UNSET |
| TikTok, Instagram | Via RTMP key only | No handle on disk for live | no | UNSET |
| Custom RTMP | Yes | Aziz's Cloudflare Live Input (topology A), or the Baraza watch page as a second output under topology B | n/a | Aziz |
| Farcaster | Not a Restream destination | Post the live link there instead (socials rule: via Firefly) | n/a | n/a |

What the test should try: every row with a handle on disk that Zaal can log
into this morning. What it must not do: create accounts, or name a platform
publicly before a run passes.

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

1. Aziz: rtmps ingest URL and stream key (link 6), needed for topology A only;
   topology B can run this morning without it.
2. The 28 Aug test: both topologies, both boxes, every destination with a
   login; results in the test plan log. Zaal runs it.
3. Aziz: `Baraza_TV_v2.json` export (macros), and the "Camera" media path.
4. Zaal: internet at the parklet, a measured number (link 5).
5. Steve: which desk, so link 1 can be bought or borrowed.
6. Run the ten-minute test in `obs/WINDOWS-SETUP.md` section 7. Then Friday
   2 October, end to end, from the parklet.
