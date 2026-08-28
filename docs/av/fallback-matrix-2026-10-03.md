# Fallback matrix: every link in the chain, its failure, its backup

Written 27 August 2026. One row per link of the ten-link chain in
`docs/av/livestream-chain-2026-10-03.md`. "Backup on record" means it is
written down somewhere on disk as an offer, a plan or a proven alternative,
with the source named. UNSET means no backup exists anywhere and nobody has
been asked. The PA itself sits upstream of link 1 and its backups are in
`docs/plans/av-spec-2026-10-03.md` section 8.

| # | Link | How it fails | Backup on record | Source | Owner | Status |
|---|------|--------------|------------------|--------|-------|--------|
| 1 | Source, audio (desk main outs into interface or USB) | No interface, wrong desk, level too hot, cable pulled | A camera's own mic as a last resort; Fellenz's note that many desks have USB out so a separate interface may not be needed | Doc AV LIST, stream and capture | UNSET for the interface; Aziz for the level | UNSET. No interface owned. Zaal open to buying one |
| 2 | Source, video (cameras) | No camera, no operator, battery, card full | Phones as backup cameras | Archived `zaostream` research, 2026-08-27 archive | UNSET | UNSET. No primary camera either; the ATEM in the research is UNVERIFIED |
| 3 | Streaming computer (desktop at home or a laptop; both candidates until the 28 Aug test decides, Zaal) | Won't boot, crashes under load, cannot be moved to the parklet | Whichever box the test does not pick is the backup for the one it does; "desktop plus VPS or Pi fallback" also discussed on the 18 Aug call | Zaal 28 Aug; doc 2316 | Zaal for the boxes, Aziz for the rig | Laptop specs and OBS install UNSET; VPS or Pi never built |
| 4 | Encoder (OBS, NVENC 6000 CBR 1080p30) | Dropped frames, GPU fault | Drop to 720p30 at 3000 to 4500 kbps; x264 veryfast if NVENC fails | `obs/WINDOWS-SETUP.md` section 6 | Aziz | On record and cheap; needs one settings change |
| 5 | Uplink (internet at the parklet) | No signal, under 3 Mbps, drops mid-set | Starlink Roam plus a hotspot on a second carrier; cellular on the phone that is there | Archived `zaostream` research | Aziz decides, Zaal buys | UNSET: nothing measured, nothing bought, no carrier coverage checked. See `docs/av/power-internet-requirements.md` |
| 6 | Ingest (Aziz's Cloudflare Live Input) | Key wrong, input not live, Aziz unreachable | Topology B: OBS straight into Restream's own RTMP ingest, which Zaal's account already has | Chain doc, topology B | Aziz | Exists as a path. Not a decision. Drops the Baraza watch page |
| 7 | Restream | Account issue, destination auth expired, Restream outage | Stream to one destination directly from OBS with its native key | Standard OBS; nothing on disk records it for this event | Aziz | UNSET which destination would be the one |
| 8 | Destinations | Platform rejects the stream, account suspended, one platform down | The other destinations keep running; Restream isolates a failed one | Restream's own behaviour; no ZAOstock destinations recorded | Aziz | UNSET until the destination list exists |
| 9 | Recording | Local record not enabled, disk full, Cloudflare not recording | Local OBS record and Cloudflare record are each other's backup, if both are on | Doc AV LIST asks for local capture; Cloudflare records at the input per `STREAMING-BACKEND.md` | Aziz | Neither configured. UNSET disk space on the desktop |
| 10 | Indoor mirror (Black Moon screen) | No TV, no wifi, stream itself down | Option 3, a cable or local endpoint from the parklet, which survives every failure above it | `docs/av/indoor-mirror-2026-10-03.md` | UNSET | UNSET. Black Moon not yet asked |

## Failures that take out more than one link

| Failure | Links lost | What survives | What to do that day |
|---------|-----------|---------------|---------------------|
| Parklet power fails | 1, 2, 3, 4 and the PA | Nothing on the stream; the show itself stops | Generator, UNSET on every count. This is the PA's failure first |
| Parklet internet fails | 5, 6, 7, 8, 10 (option 1 and 2) | 3, 4, 9: OBS keeps recording locally | Record the day; the recording is the capture. Indoor mirror only by cable |
| Aziz unreachable on the day | 6, and 7 to 9 if he alone holds the accounts | Whatever Zaal's own Restream account can do | Topology B from Zaal's account. Needs Zaal to hold a login for every destination, UNSET whether he does |
| Desktop fails | 3 to 9 | The PA and the show | No second machine exists. UNSET |
| The streaming desk position has no power | 3, 4 | Everything else | An extension run from the stage circuits; the cable plan is UNSET |

## What has a backup today, honestly

Two links have a backup that exists without anyone doing anything: link 4
(lower the encoder settings) and link 6 (go direct to Restream). Link 8 has one
by construction once destinations exist. Everything else is UNSET, and links 2,
3 and 5 have no primary either.

## Who fills this in

Aziz for links 3 to 9. Zaal for 1, 2 and 5 purchases, and for whether he holds
the destination logins. Black Moon for 10. The generator row belongs to the
power file and to Steve.
