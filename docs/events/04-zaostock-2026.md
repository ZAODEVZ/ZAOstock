---
event: ZAOstock
slug: zaostock
place: Franklin Street Parklet, Ellsworth, Maine
when: Saturday 3 October 2026
status: upcoming
public-page: /
---

# ZAOstock 2026

A free, one-day, artist-built music festival in downtown Ellsworth, Maine. Part
of the 9th Annual Art of Ellsworth during Maine Craft Weekend.

## The shape of the day

One venue at a time. Noon to 16:00 at the parklet, independent artists at about
30 minutes each with the MC and partners between sets. 16:00 to 18:00 is
WaveWarZ. From 18:00 the whole street walks next door into Black Moon Public
House: DJ set 18:00 to 20:00, live set 20:00 to 22:00.

Free to attend, rain or shine, under tent cover from Wallace Events.

## Slugs, and the one that bit us

- Database slug: **`zaostock`**
- The mobile app also calls **`zaostock-2026`**, which has never existed in the
  table. It is resolved by `canonicalEventSlug()` in `src/lib/event-slugs.ts`
  before the lookup runs. Do not add a second events row for it. A second row
  splits RSVPs and lineup writes across two ids, which is the same problem one
  layer down and much harder to see.

## Dates that other things key off

- **Lineup reveal:** `SITE.lineupRevealDate`, currently 7 September 2026. It has
  already moved once, from 1 September. Never type it as a literal; read it from
  `src/content/site.ts`.
- **Submission cutoff:** `SITE.submissionCutoffDate`, 1 September 2026.
- **Event day:** 3 October 2026, `FESTIVAL.date` in `src/content/festival.ts`.

## Audience

200 to 250 in person on the parklet, about 1,000 online. The online audience is
the larger one. Broadcast and virtual is a lane with three people in it for that
reason. See `docs/team/03-broadcast-and-virtual/`.

## Links and data

- Public site: this repo, deployed at zaostock.com
- RSVP: `FESTIVAL.rsvpUrl`, ticket.zaostock.com
- Ops Room: the single day-of surface for crew and audience, `ops-room/`
- Working document: the real planning record. Ask Zaal for the link. It is
  deliberately **not** in `TEAM_DOC_URL`, and `src/lib/team-status.test.ts`
  explains why in detail

