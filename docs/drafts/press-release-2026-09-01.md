# Draft press release - ZAOstock lineup reveal, 1 September 2026

**DO NOT SEND.** Draft only. Hold lines are marked. Nothing goes to The
Ellsworth American or anyone else without Zaal.

- **For:** Gabe Goode, Production Manager, The Ellsworth American (the only
  press contact on the Local Network tab). Reusable for any outlet.
- **From:** Zaal Panthaki, info@thezao.com
- **Send when:** 1 September, with the reveal. The poster prints the same week,
  so press and print promo land together (gdoc Local Network, item 2).
- **Drafted:** 2026-08-27
- **Lane:** MARKETING

## Holds before this can go

1. **The names.** Four confirmed as of Zaal, typed 27 Aug 20:4x: Lyons Den (placed after Dcoop in
   the running order, Zaal, typed 27 Aug 21:2x), Dcoop, Fellenz, Acadia Rising. Werb is out until
   confirmed; Sen is in the order but not confirmed for print. The
   roster database is unreadable and the count has moved three times in four
   days. Zaal re-confirms the morning of 1 Sep.
2. **Spellings settled** (Zaal, typed 27 Aug 19:3x): Lyons Den, Dcoop, Fellenz.
3. **Music starts at noon** (Zaal, typed 27 Aug 19:3x). The draft says noon. The site's
   `festival.ts` still reads 11 AM until SITE moves it back.
4. **Quote lines** are UNSET. Two are marked. Zaal writes his own; a Black Moon
   quote needs Steve Peer's words, not ours.
5. **Attendance, budget, sponsor names:** none appear. Do not add.
6. **Proposed acts:** The Crown Vics, DJ Aquavantes, The Somes Sound, North
   Creek do not appear. If any is confirmed before 1 Sep, Zaal says so and it
   is added then.

---

## Subject

ZAOstock announces its lineup - free all-day music festival on Franklin Street,
Ellsworth, Saturday 3 October

## Body

FOR RELEASE 1 SEPTEMBER 2026

ELLSWORTH, MAINE - ZAOstock, a free one-day music festival on the Franklin
Street Parklet, has announced its lineup for Saturday 3 October 2026.

Independent artists play the outdoor stage from noon: **[HOLD - Lyons Den,
Fellenz, Dcoop, Acadia Rising - confirm all four hold on 1 Sep; add Werb and
Sen only if Zaal confirms them]**. Lyons Den was announced earlier this
summer.

From four to six the street turns into WaveWarZ, a live music-battle format
where artists go head to head and the audience decides, in the street and
online. Stilo, Jango, Lui and Quan battle, with Hurricane on the mic.

At six, everything moves next door into Black Moon Public House for the
evening: a DJ set as the street walks in, then live music to close.

The event is free to attend and runs outdoors on the parklet until six, rain or
shine under tent cover from Wallace Events. It is part of the 9th Annual Art of
Ellsworth during Maine Craft Weekend, and is produced by ZAO Festivals, the
events arm of The ZAO.

**[QUOTE - Zaal - UNSET]**

Partners giving time, venue and infrastructure include the Town of Ellsworth,
Black Moon Public House, Star 97.7, Wallace Events, WaveWarZ, ENTERACT,
Web3Metal and COC Concertz. **[HOLD - add Bomb Squad if it is on the site list
by 1 Sep]** *(COC Concertz confirmed a partner by Zaal, typed 27 Aug 20:3x.)*

**[QUOTE - Black Moon, Steve Peer's own words or none - UNSET]**

Musicians who want to be considered for the remaining slots can submit at
zaostock.com/musicians **[HOLD - only if public forms are live; they are off
behind PUBLIC_FORMS_ENABLED as of 27 Aug]**. Volunteers can sign up at
zaostock.com/apply **[same hold]**.

Schedule and details: zaostock.com/program

Contact: Zaal Panthaki, info@thezao.com

---

## Every fact above, sourced

| Claim | Source |
|---|---|
| Free, Saturday 3 October 2026, Franklin Street Parklet, Ellsworth | `src/content/festival.ts` |
| Music starts at noon | Zaal, typed 27 Aug 19:3x |
| Battlers Stilo, Jango, Lui, Quan; Hurricane MC | Zaal, typed 27 Aug 19:3x; `src/app/team/plan/page.tsx` DAY[1] |
| Four confirmed acts, names | `src/app/team/plan/page.tsx` DAY[0] minus Werb (Zaal, typed 27 Aug 20:4x); Lyons Den public at `src/app/page.tsx:397` |
| No changeover DJ claimed | Zaal, typed 27 Aug 20:0x: no DJ Aquavantes |
| WaveWarZ 4-6, audience decides | `src/app/program/page.tsx` BLOCKS[1]; `docs/plans/production-plan-2026-10-03.md` section 4 |
| Move to Black Moon at six, DJ set then live music to close | Zaal, typed 27 Aug 20:0x running order; `src/app/program/page.tsx` BLOCKS[2-3] lags it |
| Tent, rain or shine, Wallace Events | production plan section 4 |
| 9th Annual Art of Ellsworth, Maine Craft Weekend | `src/app/page.tsx:486,495` |
| ZAO Festivals, events arm of The ZAO | gdoc Start Here |
| Partner list | `src/app/page.tsx:101-112` |
| Forms off | `src/lib/forms-status.ts`, `src/components/FormsUnavailable.tsx` |
| info@thezao.com | `docs/drafts/email-john-jagger-2026-08-27.md` |
