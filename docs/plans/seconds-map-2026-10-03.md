# Seconds map - who covers a lead while the lead is on stage

> **Zaal, 31 August 2026:** "all of the official leads when they are performing
> can be given to the seconds."

Every lead on this day also performs. That is not a staffing gap, it is a
scheduling conflict: the same person cannot run the desk and be on the stage in
front of it. One rule solves it: **every lead has a named second, and the second
holds the role for exactly the window the lead is performing.**

> **REWRITTEN 2026-09-18.** This file was solving the wrong day. It was built on
> the 31 August order, so its windows were the old clock (Dcoop at 13:15,
> Fellenz at 15:10), and the largest gap it named, **four straight hours of
> covering Stilo through a WaveWarZ block and an evening DJ set**, does not
> exist: WaveWarZ came off the programme on 09-07 and the evening was ruled on
> 09-14 as Black Moon's own after-party with Steve on the decks. Meanwhile the
> two conflicts that are real were unwritten. A seconds map that covers an
> imaginary shift and misses a live one is worse than no seconds map.
>
> Windows now come from `src/content/program.ts` `BLOCKS` and are held to it by
> `src/content/seconds-map-sync.test.ts`.

## The conflicts, by clock

| Window | Who is on stage | What they normally hold | Second needed |
|---|---|---|---|
| 12:05-12:38 | Steve Peer (The Crown Vics) | Venue and door on the Black Moon side; he is also the route to two acts | **Katina** |
| 12:45-13:25 | OPEN X | **The PA.** They bring it and run it all day (Zaal, 15 Sept) | **UNSET, and this one is new** |
| 15:30-16:10 | DCoop | Music and AV lead, which is the desk. He is also one of the three stage managers | **UNSET. This is the gap to solve first** |
| 17:00-17:40 | Tom Fellenz | Advisor, event ops | None needed, not an operating role on the day |
| 18:00 onward | Steve (after-party DJ, Black Moon) | Venue and door | **Katina**, and see the door question below |

## What this means in practice

**OPEN X cannot run their own sound.** They bring the PA and run it for the
whole day, and they play second. For those forty minutes somebody else is on the
desk, and nobody has been named. This is not in any earlier version of this file
because the PA arrangement was settled on the 15 September call, after the file
was last touched.

**DCoop needs a second for his own set**, 15:30 to 16:10. He holds the music and
AV lead, which is the desk, and he is one of the three stage managers, so the
same forty minutes need two holes filled, not one.

**Zaal is three people on this day.** He runs the stream with the venue AV team
(15 September), he is a stage manager, and he is primary on the MC rota. None of
those has a second. He does not perform, so it is not a conflict in the sense
this file was built for, but it is the same failure shape: one person, three
roles, no cover if any of them takes ten minutes longer than planned.

**Katina covers Steve twice**, at 12:05 and again from six, and that should be
said out loud rather than assumed. The old Q22 still stands in a new form: who is
on Black Moon's door at 18:00, given Steve is the one playing the after-party?

**The stream needs no seconds for its own sake.** Zaal holds it and does not
perform. The earlier version of this file split that job between two other
people; that split was replaced on the 15 September call.

## Still genuinely unfilled: vacancies, not conflicts

| Role | Note |
|---|---|
| Third stage manager | Zaal and DCoop are two. The third name is contested: one 15 September answer says Steve Peer, the other says Maseo. It decides who holds the stage while DCoop plays at 15:30 |
| First Aid contact | **DUE NOW.** Parked by Zaal on 31 August "until ~18 September, 15 days out", which is today. The Fire Chief question waits behind it |
| Sound, 12:00 to 18:00 | One name for the whole day, or OPEN X plus a second for their own set |
| Street pointer | 18:00, during the move next door |
| Photographer, video shooter | The site still has no photography of its own. Maseo is named for video content, which is part of why the third stage manager answer matters |

## MC, a different shape, decided 31 August

Zaal, 31 August: MC is **not one person**. Zaal is primary, with Steve Peer and
one or two people from partners and supporting projects sharing it, and an open
call for volunteers.

That matters more now, not less. There are eight acts and seven changeovers, two
of which carry the event talk and a partner spot, and the between-sets voice that
was going to carry them is out (Hurricane, 2026-09-10). A rota of three or four
makes it survivable and gives partners a reason to be on the mic. DCoop has asked
for the LyonsDen intro, which is one slot already spoken for.

## The order this file is built on

The run of show is `src/content/program.ts` `BLOCKS`, and it is the only copy
anything here should be read against. Eight acts, five- to seven-minute
changeovers, music 12:05 to 17:40, street clears at 18:00. This file used to carry its own copy of
the order, from 31 August, with six acts and a battle reset at 15:50. It does not
any more, because that is how this file came to be describing a day nobody is
running.
