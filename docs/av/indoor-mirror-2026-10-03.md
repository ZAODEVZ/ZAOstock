# Indoor mirror: the outdoor stream on screens inside Black Moon

Written 27 August 2026. From the Doc's "Still open": *Black Moon has no
daytime trade under this plan, because everyone is outside 12 to 6. Screens
inside showing the outdoor stream would fix it.* The production plan lists it
under "What we supply" as ZAO, **To build**, and tells Steve it is the fix for
his daytime footfall. Nobody is named and nothing has been asked of Black Moon.

Cost: UNSET throughout. No price is on file for anything below and none is
guessed.

## What it needs

| Piece | What | Who provides | Status |
|-------|------|--------------|--------|
| Screen or screens | At least one TV visible from the bar. Black Moon is a pub; whether it has TVs and how many is **not recorded anywhere on disk** | Black Moon, if they have them. Otherwise UNSET | UNSET. Ask Steve or Katina |
| Player | Something that turns a feed into HDMI: a laptop in a browser, a Chromecast or Apple TV on the pub's network, or an HDMI cable from a box | UNSET | UNSET |
| Feed | One of the three options below | Aziz (rig) | Depends on the chain |
| Internet at Black Moon | Needed for options 1 and 2. Not recorded | Black Moon | UNSET. Ask with the screens |
| Audio | Whether the bar plays the stream audio or runs muted with the pub's own music. Muted is the safe default in a bar with no PA of its own until 18:00 | Black Moon decides | UNSET |
| Someone to set it up and check it | Ten minutes on Friday night and again at 10:30 Saturday | UNSET | Part of the Stage 2 pass in the test plan |

## Three ways to get the picture inside, cheapest to most robust

**1. The public stream, on a TV.** Open the YouTube or Twitch stream (whatever
destination is chosen, currently UNSET) on a smart TV, a Chromecast, or a
laptop over HDMI. Needs: Black Moon internet, one screen, one device. Latency
10 to 30 seconds behind the street, which is fine for a bar. Fails if the
public stream fails, so it is not a backup for anything, and it is the one that
needs nothing from Aziz beyond the stream existing. Nothing to buy if the pub
has a TV and wifi.

**2. The Baraza watch page.** If topology A (OBS to Cloudflare) is chosen, the
Cloudflare Live Input has an HLS playback URL and Baraza's watch page renders
it. Same needs as option 1, lower latency than a public platform, and it works
even if a public destination has a problem. Only exists if topology A.

**3. A second local endpoint, no internet needed.** A cable or a local link
from the parklet to the bar: HDMI over a long run, or an SDI or NDI feed from a
switcher if one exists (the ATEM in the archived research is UNVERIFIED), or a
second OBS output to a local RTMP or SRT receiver in the bar. Near-zero
latency, immune to the parklet's untested uplink. Needs cable across whatever
sits between the parklet and the door ("next door" per the deck) and a receiver
device. Most work, only option that survives an internet failure.

**Recommendation for the first ask:** option 1, because it costs nothing to
find out. Ask Black Moon two questions: do you have a TV we can put the stream
on, and does your wifi reach it. If both are yes, the mirror is a device and a
Friday-night check. If the pub has no internet, option 3 is the only one.

## Also at Black Moon, same conversation

The Doc records that Black Moon is **willing to host iPads running
Decentraland** so physical attendees can meet virtual ones. Same internet, same
bar, same ask. The Decentraland mirror itself is not built (LiDAR scan planned,
no date). Do not promise the iPads until the mirror exists; the TV can go up
without it.

## Who fills this in

Zaal asks Steve or Katina the two questions. Aziz confirms which feed. The
screen and device owner is UNSET until Black Moon answers.
