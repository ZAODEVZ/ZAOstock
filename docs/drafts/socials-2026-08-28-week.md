# ZAOstock socials - seven days, Fri 28 Aug to Thu 3 Sep 2026

**DRAFTS. Nothing posted.** Zaal posts, top to bottom per platform. Written
2026-08-27 (Thursday). Lane: MARKETING.

Rules applied, from `~/.claude/skills/socials/skill.md` and the platform
profiles: every post opens with **ZM**. No emojis, no hashtags, no em dashes,
no "excited/thrilled/amazing", no work-day times, contribution over
celebration. **No times of day** anywhere in this calendar - not for posting,
and not in the copy. Each post cites the file its facts come from. Anything not
on disk is **UNSET** and the post carries a hold.

Platform order per the skill: Firefly (X + Farcaster, one post, 280 max) ·
X GC · Farcaster /zao GC · Telegram · Discord · LinkedIn · Facebook. Not every
day gets every platform - a quick day gets Firefly and the GCs; the reveal gets
all seven.

## Facts this week can use, and where each lives

| Fact | File |
|---|---|
| Saturday 3 October, Franklin Street Parklet, Ellsworth, free | `src/content/festival.ts` |
| Music starts at noon | Zaal, typed 27 Aug 19:3x, relayed by the orchestrator |
| WaveWarZ battlers may be named: Stilo, Jango, Lui, Quan; Hurricane MC | Zaal, typed 27 Aug 19:3x; roster at `src/app/team/plan/page.tsx` DAY[1] |
| Outdoors until six, then Black Moon next door | `src/app/program/page.tsx` BLOCKS |
| Evening: Stilo DJs from six, live music to close; no changeover DJ | Zaal, typed 27 Aug 20:0x running order. PRODUCTION's ros-v2 supersedes |
| Werb and Lyons Den confirmed, public | `src/app/page.tsx:397,404` |
| Five confirmed acts total (names gated until 1 Sep) | `src/app/team/plan/page.tsx` DAY[0] |
| Lineup reveal 1 September | `docs/plans/production-plan-2026-10-03.md` section 6 |
| Musician submission cutoff 3 September | production plan section 6, locked at the 12 May standup (`docs/standup/2026-05-12-tue-recap.md:36`) |
| WaveWarZ block, audience decides, in the street and online | `src/app/program/page.tsx` BLOCKS[1] |
| WaveWarZ: 1,452 battles, 913.9 SOL lifetime, measured 2026-08-27 15:47 UTC | `docs/sponsor/deck-2026-10-03.md:154-155` |
| Seven partners, time and skill, no cash | `src/app/page.tsx:101-112, 546-548` |
| Tent, rain or shine, Wallace Events | production plan section 4 |
| 9th Annual Art of Ellsworth, Maine Craft Weekend | `src/app/page.tsx:486` |
| Every car to Acadia passes through; free to listen from the sidewalk | `src/app/page.tsx:261,479` |
| Volunteer page exists at /apply; musician submit at /musicians/submit | `src/app/apply/page.tsx`, `src/app/musicians/page.tsx:40` |
| Public forms are OFF | `src/lib/forms-status.ts`, `src/components/FormsUnavailable.tsx` |

## Facts this week must NOT use

- **Any hour other than noon and six.** Music starts at noon (Zaal, typed 27 Aug 19:3x).
  `src/content/festival.ts` still reads 11 AM until SITE moves it; never quote
  the site's hour.
- **Any of the four proposed acts** (The Crown Vics, DJ Aquavantes, The Somes
  Sound, North Creek). Zaal 2026-08-27.
- **Attendance, budget, sponsor tiers, prices.** All UNSET.
- **Tax-deductible.** There is no fiscal sponsor.
- **Heart of Ellsworth as a partner.** Not until confirmed in writing
  (`src/app/page.tsx:102-104`).
- **A Facebook event link.** Card cc314651 is overdue; no event exists.
- **Artist handles for tagging.** Not collected anywhere (gdoc Links and
  Assets). Every tag below is UNSET.
- **A link to /press.** No such route exists (`docs/marketing/press-2026-08-27.md`).

---

## Fri 28 Aug - two names, four days to the rest

Angle: the two public names, and the reveal date. Quick update.

**Firefly (X + Farcaster /zao)** - 159 chars
> ZM. Werb and Lyons Den are confirmed for ZAOstock, Saturday October 3, Franklin Street, Ellsworth. Free. The rest of the lineup lands September 1. zaostock.com

**X GC**
> ZM. reveal is tuesday. werb and lyons den are already out there, three more names go public with them. if you know either of them, now is a good week to tell them you are coming.

**Farcaster /zao GC**
> ZM. lineup reveal for ZAOstock is september 1. werb and lyons den are the two names already public, three more on tuesday, plus the WaveWarZ block. zaostock.com/program

**Telegram**
> ZM. ZAOstock lineup drops Sept 1. Werb and Lyons Den are public already. zaostock.com

Sources: `src/app/page.tsx:397`, `docs/plans/production-plan-2026-10-03.md`
section 6, `src/app/team/plan/page.tsx` DAY[0] (five confirmed, so "three
more" is arithmetic, not a new claim).

Hold: if the roster count changes before Friday, "three more" changes with it.

---

## Sat 29 Aug - the shape of the day

Angle: one venue at a time. Outdoors, then next door. Standard.

**Firefly** - 228 chars
> ZM. ZAOstock runs one stage at a time. Outdoors on the Franklin Street Parklet from noon until six, then the whole thing walks next door into Black Moon and keeps going. One crowd, one street, one bar. Free. zaostock.com/program

**Farcaster /zao GC**
> ZM. the ZAOstock day, in one line: parklet until six, Black Moon after six with Stilo on the decks as the street walks in. we dropped the second simultaneous stage on purpose - a street with 200 people on it looks full, two rooms with 100 each look empty. zaostock.com/program

**Discord**
> ZM. ZAOstock schedule shape is up on zaostock.com/program. Independent artists back to back outdoors, WaveWarZ battles after the sets, then everything moves inside Black Moon Public House next door. Rain or shine, there is a tent. Question for the room: who is driving up from where?

**Facebook**
> ZM. ZAOstock is Saturday October 3 on Franklin Street in downtown Ellsworth, and it is free. Music outdoors on the parklet through the day, then everyone walks next door into Black Moon for the evening. It is part of the 9th Annual Art of Ellsworth during Maine Craft Weekend. Bring the family, stay for dinner downtown. zaostock.com

Sources: `src/app/program/page.tsx` BLOCKS and the page copy at lines 122,
171, 180-183; `docs/plans/production-plan-2026-10-03.md` section 1 (the "one
crowd" reasoning, the 200/100 line is Zaal's own from that section);
production plan section 4 (tent); `src/app/page.tsx:486` (Art of Ellsworth).

---

## Sun 30 Aug - WaveWarZ

Angle: the battle block, with the measured numbers. Standard.

**Firefly** - 240 chars
> ZM. WaveWarZ has run 1,452 battles online. On October 3 it runs in the street: Stilo, Jango, Lui and Quan battling, Hurricane on the mic, and the audience decides, in person and online. Franklin Street, Ellsworth. Free. zaostock.com/program

**X GC**
> ZM. 1,452 battles and 913.9 SOL through WaveWarZ so far, measured thursday. ZAOstock puts the format on the parklet stage with a street crowd voting. stilo, jango, lui and quan are battling, hurricane is on the mic. tag them if you know them.

**Farcaster /zao GC**
> ZM. WaveWarZ numbers as of thursday: 1,452 battles, 913.9 SOL lifetime. at ZAOstock the battle block runs on the parklet stage with the crowd voting from the sidewalk and the stream voting online. same format, on a street. zaostock.com/program

**Telegram**
> ZM. WaveWarZ block at ZAOstock is confirmed - battles on the parklet stage, audience decides. 1,452 battles run so far. zaostock.com/program

Sources: `docs/sponsor/deck-2026-10-03.md:154-155` (figures, measured
2026-08-27 15:47 UTC from `wavewarz.info/api/public/stats`); `src/app/program/page.tsx`
BLOCKS[1]; `docs/plans/production-plan-2026-10-03.md` section 4 (WaveWarZ
confirmed, ZAO supplies it).

Battlers cleared for public (Zaal, typed 27 Aug 19:3x): Stilo, Jango, Lui, Quan
battling; Hurricane MCing. Roster line: `src/app/team/plan/page.tsx` DAY[1].

---

## Mon 31 Aug - tomorrow

Angle: the eve. Quick update, GCs only plus Firefly. Nothing new is claimed.

**Firefly** - 131 chars
> ZM. Tomorrow the ZAOstock lineup goes public. Five acts, the WaveWarZ block, one street in Ellsworth, October 3. Free. zaostock.com

**X GC**
> ZM. tomorrow is the reveal. five names. if any of you want to co-post, the copy goes out tomorrow and you can quote it.

**Farcaster /zao GC**
> ZM. reveal tomorrow. five acts plus WaveWarZ. poster prints the same week so if you have a wall in ellsworth or bar harbor that wants one, say so.

Sources: `src/app/team/plan/page.tsx` DAY[0] (five), production plan section 6
(1 Sep), gdoc "Poster print - Candy - print week of Sep 1"
(`docs/plans/gdoc-1B78AVonJS3-snapshot-2026-08-27.md`).


---

## Tue 1 Sep - THE REVEAL

**HOLD - do not post until Zaal confirms, on the day, that the five names
below are still the lineup and how each is spelled.** The roster database is
unreadable and the count has moved three times in four days (gdoc Links and
Assets "Data we cannot see right now"). Handles for tagging are UNSET - not
collected anywhere.

Image: the poster's digital version if Candy has it; otherwise
`public/brand/logos/zaostock26_badge_official.png`.

Announcement size. All seven platforms.

**Firefly** - 243 chars
> ZM. The ZAOstock lineup. Werb. Lyons Den. Fellenz. Dcoop. Acadia Rising. Plus WaveWarZ live in the street. Saturday October 3, Franklin Street Parklet, Ellsworth, Maine. Outdoors from noon until six, then Black Moon. Free. zaostock.com/program

Tags: UNSET x5. Add handles once collected.

**X GC**
> ZM. it is out. werb, lyons den, fellenz, dcoop, acadia rising, and the WaveWarZ block. every one of them is an independent artist nobody is paying to make the music they make. quote the main post, tag the acts you know, and if you are within driving distance of ellsworth on october 3 this is the one.

**Farcaster /zao GC**
> ZM. ZAOstock lineup is public: werb, lyons den, fellenz, dcoop, acadia rising, plus WaveWarZ battles on the parklet stage. five sets, then the whole street moves into Black Moon at six with Stilo on the decks. this is what the season has been building toward. zaostock.com/program

**Telegram**
> ZM. ZAOstock lineup is live: Werb, Lyons Den, Fellenz, Dcoop, Acadia Rising + WaveWarZ. Oct 3, Ellsworth, free. zaostock.com/program

**Discord**
> ZM. Lineup for ZAOstock, Saturday October 3 in Ellsworth, Maine: Werb, Lyons Den, Fellenz, Dcoop and Acadia Rising on the outdoor stage, WaveWarZ battles after, then Black Moon Public House for the evening. Free to attend. Full schedule at zaostock.com/program. If you are coming, drop your city below so we can see who is travelling.

**LinkedIn**
> ZM. ZAOstock, a free one-day independent music festival in Ellsworth, Maine, announced its lineup today: Werb, Lyons Den, Fellenz, Dcoop and Acadia Rising, plus a live run of WaveWarZ, the online music-battle format that has run 1,452 battles and plays out live on the parklet stage.
>
> The day runs on the Franklin Street Parklet until six and then moves next door into Black Moon Public House. It is produced by ZAO Festivals, the events arm of The ZAO, as part of the 9th Annual Art of Ellsworth during Maine Craft Weekend, with seven local and ecosystem partners giving time, venue and infrastructure rather than cash.
>
> Saturday October 3. Free.
>
> zaostock.com/program

**Facebook**
> ZM. Here is the ZAOstock lineup for Saturday October 3 on Franklin Street in Ellsworth: Werb, Lyons Den, Fellenz, Dcoop and Acadia Rising, all independent artists, followed by WaveWarZ, where musicians battle live and the crowd picks the winner. Then everybody heads next door to Black Moon for the evening. It is free, it is rain or shine under a tent, and it is part of Art of Ellsworth weekend. Every car heading to Acadia passes through downtown that day, so come early and stay for dinner. zaostock.com

Sources: `src/app/team/plan/page.tsx` DAY[0] (the five names, marked five
CONFIRMED); `src/app/page.tsx:397` (two already public); `src/app/program/page.tsx`
BLOCKS; `docs/sponsor/deck-2026-10-03.md:154` (1,452); `src/app/page.tsx:101-112`
(seven partners), `:261,479` (Acadia), `:486` (Art of Ellsworth); production
plan section 4 (tent); gdoc Start Here (ZAO Festivals, events arm of The ZAO);
`src/app/musicians/page.tsx:10` ("music nobody is paying you to make" - the
X GC line paraphrases the site's own copy).

Spellings confirmed (Zaal, typed 27 Aug 19:3x): Lyons Den, Dcoop, Fellenz.

Not in any of these posts, deliberately: the four proposed
acts, the evening act, attendance, sponsors, Heart of Ellsworth, a /press link.

---

## Wed 2 Sep - the partners

Angle: who is already in, no cash. Standard. Also the day after the reveal, so
a natural quote of Tuesday's post.

**Firefly** - 236 chars
> ZM. Seven partners are giving ZAOstock time, venue and infrastructure, and none of it is cash. Town of Ellsworth, Black Moon, Star 97.7, Wallace Events, WaveWarZ, ENTERACT, Web3Metal. That is how a free festival gets built. zaostock.com

**Farcaster /zao GC**
> ZM. partner list for ZAOstock as it stands on the site: Town of Ellsworth (the parklet), Black Moon (the evening), Star 97.7 (radio), Wallace Events (the tent), WaveWarZ (the battles), ENTERACT (production), Web3Metal (community). every one is time and skill, no money changed hands. if you run something in downeast maine and want on this list, reply.

**LinkedIn**
> ZM. A free festival is a stack of partners. ZAOstock on October 3 in Ellsworth, Maine has seven so far, and the deal with each is the same: time, venue or infrastructure, not money. The Town of Ellsworth provides the parklet. Black Moon Public House hosts the evening. Star 97.7 carries it on air. Wallace Events puts up the tent. WaveWarZ brings the battle format. ENTERACT covers production. Web3Metal brings a community surface.
>
> Each has a confirmed agreement and a named point of contact on our side. Sponsorship is a separate track and it is open.
>
> zaostock.com

Sources: `src/app/page.tsx:101-112` (names, roles, confirmed flags),
`:546-548` ("Partners give time and skill. No cash."), `:121` (the
/sponsor/deck link, so "sponsorship is open" is a pointer to an existing page,
not a tier claim).

Hold: **Bomb Squad** was resolved a partner on 24 Aug but is not on the site
list, and **COC Concertz** is undecided (`docs/marketing/partner-logos.md`). This
post names the seven on the site. If the SITE lane adds Bomb Squad before
Wednesday, "seven" becomes "eight" and the name goes in. Do not add COC
Concertz without Zaal.

---

## Thu 3 Sep - submission cutoff

**HOLD - public forms are OFF** (`src/lib/forms-status.ts`,
`src/components/FormsUnavailable.tsx`; Supabase project returns 503). A "submit
today" post sends people to a page that says forms are unavailable. **Post only
if the SITE lane reports forms live by Thursday. Otherwise skip the day, or run
the fallback below.**

Angle if forms are live: last day. Quick update.

**Firefly** - 170 chars
> ZM. Last day to submit for the ZAOstock lineup. Independent music, October 3, Ellsworth, Maine. Made something nobody is paying you to make? zaostock.com/musicians/submit

**Farcaster /zao GC**
> ZM. musician submissions for ZAOstock close today. the lineup went public tuesday and a couple of slots are still being filled from submissions. zaostock.com/musicians/submit

**Telegram**
> ZM. Submissions close today. zaostock.com/musicians/submit

Sources: `docs/plans/production-plan-2026-10-03.md` section 6 ("3 September -
Musician submission cutoff. Anything not in gets swapped"), locked at the 12
May standup (`docs/standup/2026-05-12-tue-recap.md:36`);
`src/app/musicians/page.tsx:10,40`.

Hold on "a couple of slots": the daytime is FULL per production plan section 2
("five slots and five acts, and the daytime is booked"). The cutoff now feeds
the reserve and the swap list, not open slots. **Cut that clause** unless Zaal
says otherwise; the Firefly line does not make the claim.

**Fallback if forms are still off** - Firefly only, 167 chars
> ZM. Two days since the ZAOstock lineup went public. Werb, Lyons Den, Fellenz, Dcoop, Acadia Rising, WaveWarZ. October 3, Ellsworth, free. Tell one person. zaostock.com

Source: Tuesday's post; nothing new claimed.

---

## Seven days, one table

| Day | Angle | Platforms | Hold |
|---|---|---|---|
| Fri 28 Aug | Two public names, reveal date | Firefly, X GC, FC GC, TG | roster count |
| Sat 29 Aug | One venue at a time | Firefly, FC GC, Discord, FB | none |
| Sun 30 Aug | WaveWarZ, measured numbers, battlers named | Firefly, X GC, FC GC, TG | none - battlers cleared 27 Aug |
| Mon 31 Aug | Eve of reveal | Firefly, X GC, FC GC | none |
| Tue 1 Sep | **Reveal** | all seven | **Zaal confirms five names on the day (spellings settled); handles UNSET; image UNSET** |
| Wed 2 Sep | Seven partners, no cash | Firefly, FC GC, LinkedIn | Bomb Squad / COC Concertz |
| Thu 3 Sep | Submission cutoff | Firefly, FC GC, TG | **forms must be live; fallback provided** |

## What this calendar does not cover, and who owns it

- **The newsletter edition for 1 Sep.** The reveal is "coordinated with the
  newsletter, a press release, and ZABAL Season 2" (gdoc What We Need). The
  press release is drafted at `docs/drafts/press-release-2026-09-01.md`. The
  newsletter is `/newsletter` on Paragraph and was not in today's four items;
  Zaal runs it. The ZABAL Season 2 tie-in is UNSET and belongs to the
  zabalgamez lane.
- **Instagram.** The ZAOstock IG handle is not written down anywhere (gdoc
  Links and Assets). UNSET; nothing drafted.
- **Star 97.7 on-air slot, 5 Sep.** Outside the window; card 236edf76,
  UNASSIGNED.
- **Clipboard HTML.** The socials skill outputs an HTML clipboard page. Not
  built - this lane's write-set is markdown drafts; Zaal or `/socials` can
  render this file when he is ready to post.
