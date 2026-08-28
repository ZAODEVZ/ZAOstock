# Outdoor power and internet: the three items nobody has answered

Written 27 August 2026. The Doc names them together: *power circuits on the
parklet (waiting on the city), whether there is workable internet outdoors,
and where the stream actually goes - no platform, account or operator is
recorded anywhere.* This file states what each needs, the exact question to
ask, and the fallback if the answer is no. Every figure that is not on disk is
UNSET.

## 1. Parklet power

**What is known.** Steve confirmed electricity for both stages (production
plan, row 2). Indoor power is Black Moon's house. Parklet power is "the one to
pin down": how many circuits, what amperage, and where on the parklet they
are, is unanswered, and the City has not been asked in writing. The outdoor
stage is standing from the concert series that shares the parklet (the Doc
calls it summer in one place and spring in another; the City and WERU fund
that series, not ZAOstock), so the stage has been powered before; what fed it
is not recorded.

**What draws power on Saturday.** No wattage on file for any of it; the draw
is UNSET until Steve's gear list arrives.

| Load | Where | Draw |
|------|-------|------|
| Main PA, subs, monitors | Stage | UNSET |
| Mixing desk and outboard | Front of house or side of stage; the desk position matters for cable runs | UNSET |
| Backline: amps, keys | Stage | UNSET |
| DJ rig | Stage | UNSET |
| Lighting for 16:00 to 18:00 | Stage | UNSET; Bomb Squad's gear if asked |
| Streaming computer, interface, camera chargers | Wherever the stream desk sits, UNSET | Desktop PC; UNSET |
| Merch, First Aid, vendor if any | Parklet edges | UNSET |

**Wiring.** ZAOville's own lesson: run cords under the deck with hookups, not
taped across the ground. Who runs and strikes the cable: UNSET.

### The exact question for the City

For the CITY lane to place in `docs/drafts/roddy-2026-08-27.md`, on the same
thread as the permit questions. Written to get numbers back, not a yes.

> On power for the parklet on 3 October: what electrical service is available
> at the stage and along the parklet, how many circuits, what amperage each,
> and where the outlets or panel are? The summer concert series ran on
> something and we would like to run on the same. If there is a City electrician
> or a contact who knows the panel, a name is enough. And if the service is not
> sufficient for a full PA, monitors, backline and lighting through to 18:00,
> is a generator allowed on the parklet, and is there a noise or placement
> condition on one?

### If the answer is no, or not enough

**Generator.** UNSET on every count: size (no draw figure to size it from),
source (rent or borrow, nobody named), price, placement, fuel, and whether the
permit allows one, which is the last clause of the question above. A generator
also puts a noise floor under the stream audio, so its placement is an AV
question as well as a permit one. Owner: UNSET; Steve confirmed electricity so
the first ask is his.

## 2. Internet outdoors

**What is known.** Nothing measured at the parklet. Zaal's house in Ellsworth
measures 948 Mbps up on Fidium fiber, which says the town has fiber and says
nothing about the street. Heart of Ellsworth and Black Moon may have wifi that
reaches the parklet; not recorded.

**What the stream needs.** From the proven encode and the setup doc: 6000 kbps
sustained upload at 1080p30, with the setup doc's own fallback of 720p30 at
3000 to 4500 kbps "if the upload link is under ~10 Mbps". So the number to
measure is sustained upload at the stage position, and the threshold is about
10 Mbps for 1080p, with 720p viable below it. Also needed: the OBS WebSocket
and the bridge are local, so a dead internet still lets OBS run and record.

**Who measures it.** UNSET. It is a phone speed test standing where the stream
desk will sit, on whatever network is there, done once on a weekday and once
on a Saturday afternoon when the street is busy. Zaal is the person in
Ellsworth.

### The question, and who it goes to

Not a City question. Two asks:
- Black Moon (Steve or Katina): does your wifi reach the parklet, and can the
  stream use it on 3 October? Same conversation as the indoor mirror screen.
- Heart of Ellsworth: is there any public or business wifi on Franklin Street,
  or a business that would share a wired connection for the day?

### If the answer is no, or under 10 Mbps

**Bonded cellular.** UNSET on every count: carrier coverage at the parklet
(no one has checked which carriers have signal on Franklin Street), a bonding
device or a plain hotspot, price, and whether a second carrier is available for
failover. The archived `zaostream` research proposed Starlink Roam as primary
plus a hotspot on a different carrier as failover; nothing was bought and its
price is not carried here. Owner: Aziz owns the rig staying up, so the decision
is his once a measurement exists; buying is Zaal's.

**The floor.** If nothing reaches 3 Mbps, the stream does not run from the
parklet. OBS still records locally to the desktop, and the recording is the
capture (see `docs/av/content-capture-2026-10-03.md`). The indoor mirror then
needs the cable option (option 3 in `docs/av/indoor-mirror-2026-10-03.md`),
which does not need internet at all.

## 3. Where the stream goes

**What is known.** Aziz owns the rig and Restream (Zaal, 26 Aug). Zaal's
weekday stream already goes to Twitch, YouTube and X through Restream. The
deck says no platform name goes public until the stream has run once. The
Baraza pipe is Cloudflare Stream Live. Zaal, 28 Aug: both topologies get
tested today, repeatedly, by him; no verdict until the test says (A and B in
`docs/av/livestream-chain-2026-10-03.md`). Destinations named the same day: X
on the WaveWarZ account, YouTube on the ZAO channel, Twitch, and as many more
as the test can include; candidate table in the chain doc.

**What is needed:** a topology, a destination list with the account for each,
an operator for the stream side (Aziz) and for chat and the show side
(Ohnahji), and one full run before Friday 2 October. All UNSET except the two
names.

**The question.** Answered in part on 28 Aug (platforms above). Still open:
which Twitch account, and who holds each login.

### If there is no answer by Friday 2 October

The Stage 2 test runs to whatever Zaal's Restream account already has
configured, because that exists today and needs nothing from anyone. That is a
fallback, not a decision, and it should be written down as one if it happens.

## Summary, one line each

| Item | Ask | Of whom | Fallback | Fallback status |
|------|-----|---------|----------|-----------------|
| Parklet power | Circuits, amperage, location, generator allowed | Roddy, via the CITY lane's draft | Generator | UNSET: size, source, price, permit |
| Internet outdoors | Does wifi reach the stage; measure upload there | Black Moon, Heart of Ellsworth; Zaal measures | Bonded cellular or Starlink plus hotspot | UNSET: coverage, device, price |
| Where the stream goes | Topology: today's test, both. Destinations: X (WaveWarZ), YouTube (ZAO), Twitch, plus as many as possible | Zaal runs the test; logins UNSET | Zaal's existing Restream destinations | Named 28 Aug; not yet streamed to |
