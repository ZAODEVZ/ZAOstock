# OBS stream test, 28 August 2026: results

Mirrors the clipboard prompt `clip-20260828-052013-obs-stream-test-prompt`
field for field, so the numbers from the desktop drop straight in. Fill the
verdict last. **Never paste a stream key or ingest URL anywhere in this file.**

## Verdict (write last, ten lines)

1. Path: A or B: ___
2. Box: desktop or laptop: ___
3. Bitrate to use on Oct 3: ___ kbps
4. Destinations that worked: ___
5. Destinations that did not, and why: ___
6. Worst dropped-frame number seen: ___ % (run ___)
7. Worst sustained bitrate seen: ___ kbps (run ___)
8. Disconnects across all runs: ___
9. The one thing that must be fixed before Friday 2 October soundcheck: ___
10. Runs on the winning path: ___ (three is the minimum)

## Locked settings, every run

1080p30, h264_nvenc, 6000 kbps CBR, keyframe 2 s, AAC 160 kbps, local
recording ON, file named run-<n>. Ten minutes minimum. PASS = 3 continuous
minutes seen by a phone viewer on every destination, dropped frames under 1
percent, bitrate at or near 6000.

## Destinations

One row per Restream destination. "Added" means it was armed for run 1. No
account is created for this test; no login on the box means UNSET.

| Destination | Account | Added to run 1 | Could not add, why | Phone saw video | Phone saw audio | Screenshot file |
|-------------|---------|----------------|--------------------|-----------------|-----------------|-----------------|
| X | WaveWarZ | | | | | |
| YouTube | ZAO channel (@zaofestivals) | | | | | |
| Twitch | ___ (account not named; only handle on disk is wavewarzofficial) | | | | | |
| Facebook | zaofestivals page | | | | | |
| LinkedIn | zaofestivals company or zaalp | | | | | |
| Kick | UNSET, no login | | | | | |
| TikTok | UNSET, RTMP key only | | | | | |
| Instagram | UNSET, RTMP key only | | | | | |
| Custom RTMP (Cloudflare, path A only) | Aziz's Live Input | | | | | |

## Runs

| Run | Path | Box | Start (ET) | Minutes | Sustained kbps | Dropped % | CPU % | GPU % | Disconnects | Phone viewer saw (device, destination, what) | PASS/FAIL | Notes |
|-----|------|-----|------------|---------|----------------|-----------|-------|-------|-------------|-----------------------------------------------|-----------|-------|
| 0 | none, local encode only | desktop | 2026-08-28 07:07 | 10.0 | **6000** | **0.000** | **1.5** | **29.2** | n/a | n/a, nothing was sent | n/a | Encode baseline, added because it was the part measurable without a viewer. See "Run 0" below. |
| 1 | B, OBS to Restream | desktop | | | | | | | | | | **NOT RUN** - gated, see below |
| 2 | A, OBS to Cloudflare then out | desktop | 2026-08-28 | - | - | - | - | - | - | - | **BLOCKED** | **RUN 2 blocked: no ingest key on this box.** Verified: OBS service is Restream.io not a Cloudflare ingest; no Cloudflare live-input URL or key stored anywhere on the machine; `STREAMING-BACKEND.md` still reads "Decision proposed, not yet committed". Nobody was asked for the key, per the plan. |
| 3 | winning path | laptop, or desktop at 4500 kbps if no laptop | | | | | | | | | | Laptop specs if used: CPU ___ GPU ___ RAM ___ OS ___ |
| 4 | winning path, repeat | | | | | | | | | | | Different hour from run 1 |
| 5 | winning path, repeat | | | | | | | | | | | Different hour again |

Local recording per run: file name, size, plays back cleanly (yes/no):

| Run | File | Size | Plays back |
|-----|------|------|------------|
| 1 | run-1 | | |
| 2 | run-2 | | |
| 3 | run-3 | | |
| 4 | run-4 | | |
| 5 | run-5 | | |

## Run 0 - encode baseline, desktop, 2026-08-28

Not in the original plan. Added because it is the half of the chain that can be
measured honestly without a viewer or a destination login, and it answers part
of the "which box" question.

Path: none. Local recording only, no network leg.

```
Duration       601.5 s (10 min), uninterrupted
Frames         18,045 encoded / 18,057 output / 30.00 fps flat
Dropped        0 of 18,057 = 0.000 %
Render missed  2 of 20,378 = 0.010 %
CPU            min 1.4  max 1.7  avg 1.5 %
GPU total      min 21   max 37   avg 29.2 %
GPU NVENC      min 31   max 40   avg 36.8 %
Temp           38 C -> 41 C, flat after two minutes
```

Measured in the file with ffprobe, not read off the OBS stats dock:

```
video    h264 1920x1080 30/1     6,000,916 bps
audio    aac 48 kHz stereo         159,937 bps
overall  6,168,933 bps, 463,826,717 bytes
keyframes  I-frames at exactly 2.000 s intervals
audio      max -57.1 dB, mean -73.8 dB - real room tone, not a silent
           track (digital silence sits near -91 dB)
```

**Reading:** the desktop holds the locked settings for ten minutes with the GPU
encoder at roughly a third of a GTX 1660. 6000 kbps CBR is not stressing this
box. It says nothing about the network, the RTMP handshake, Restream's fan-out,
or what a viewer sees.

### A settings trap worth recording

Setting the profile parameters over the OBS WebSocket and reading them back is
**not** proof the encoder used them. On the first attempt every value read back
correct while the encoder still ran Simple-mode defaults:

```
[obs-nvenc: 'simple_video_recording'] rate_control: CQP   keyint: 250
```

Two causes: output mode does not switch on a running OBS (`Mode=Advanced` lands
in `basic.ini` but the current output keeps going until restart), and the stream
and record encoders read **separate** files - writing only `streamEncoder.json`
left recording at bitrate 10000 / keyint 250. After a restart and writing
`recordEncoder.json` too:

```
[obs-nvenc: 'advanced_video_recording'] codec: H264  rate_control: CBR
                                        bitrate: 6000  keyint: 60  preset: p5
[FFmpeg aac encoder: 'Track1'] bitrate: 160, stereo, track 1
```

`keyint: 60` at 30 fps is the 2 s keyframe. Confirm encoder settings from the
`[obs-nvenc: ...] settings:` block in the OBS log after an output starts, and
ideally in the output file too.

Also found and fixed: the profile specified `CoreAudio_AAC`, and the log showed
`CoreAudio AAC encoder not installed on the system or couldn't be loaded`. That
would have failed at airtime. Now `ffmpeg_aac`.

## Why runs 1, 3, 4 and 5 were not recorded

Not a tooling gap and not a slip - four requirements in the plan need a human
with logins and a second device:

| Plan requirement | Status |
|---|---|
| "Add every destination Restream offers that we hold a login for" | Needs a Restream sign-in |
| "Set every destination to unlisted or private" | Needs Twitch / YouTube / X sign-ins |
| "Confirm on a phone that X, YouTube and Twitch show video AND audio" | Needs a second device |
| PASS = 3 continuous min seen by a viewer on every destination | Follows from the above |

The privacy step is the blocking one. Streaming without it would have put a live
**public** test on ZAO's Twitch, YouTube and X channels with no way to make it
private, which is the opposite of what the plan asks for. So no stream was sent.

Confirmed ready on the box, so run 1 is roughly ten minutes once someone is
signed in: OBS stream service set to Restream, key present in OBS settings (not
recorded here), reconnect on with 25 retries at 2 s, encoder verified as
`h264_nvenc` CBR 6000 keyint 2 s with AAC 160.

Run 3 needs the laptop, which is a different machine - OBS there cannot be
driven from the desktop.

## What the verdict unblocks

Copy the verdict into `docs/plans/zaal-only-STREAM.md` lines 4 (path), 8
(gear, now unblocked), 10 (box), and into the Stage 1 rows of the results log
in `docs/av/test-plan-obs-rtmp-2026-10-03.md`. Then the Friday 2 October
Stage 2 test is the only test left.

Nothing else goes out from this test: destinations unlisted or private where
the platform allows, no posts, no announced streams.
