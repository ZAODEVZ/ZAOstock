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
| 1 | B, OBS to Restream | desktop | | | | | | | | | | |
| 2 | A, OBS to Cloudflare then out | desktop | | | | | | | | | | If no ingest key on this box: "RUN 2 blocked: no ingest key on this box" |
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

## What the verdict unblocks

Copy the verdict into `docs/plans/zaal-only-STREAM.md` lines 4 (path), 8
(gear, now unblocked), 10 (box), and into the Stage 1 rows of the results log
in `docs/av/test-plan-obs-rtmp-2026-10-03.md`. Then the Friday 2 October
Stage 2 test is the only test left.

Nothing else goes out from this test: destinations unlisted or private where
the platform allows, no posts, no announced streams.
