# What each position decides

The roster in [`README.md`](README.md) says who. This says what they get to
settle without asking, and where the handoffs are.

The point of writing decision rights down is not ceremony. It is that on the day
there is no time to work out who calls something, and the default when nobody
knows is that the question goes to Zaal, who is already holding the city, the
money and the partners.

---

## 01. Lead

**Zaal.** Owns the event. Breaks every tie.

Escalate and do not decide alone:

- Any sponsor close, partner ratification, or money movement
- Any change to the lineup reveal date
- Any change to team structure, or to who leads what
- Anything that would name an unconfirmed act or partner in public

## 02. Music and AV

Owns the sound and the schedule of the music. Artist liaison, set order,
soundcheck, sound backups.

Decides alone: set order changes on the day, backup routing, soundcheck timing.

Hands off to **03 Broadcast** when the question is what the stream shows rather
than what the room hears. Hands off to **01 Lead** for anything involving an
artist's terms.

## 03. Broadcast and virtual

Owns the online half of the event, which is the **larger** half: about 1,000
online against 200 to 250 on the parklet.

Split by platform, and the line is sharp:

- **Aziz owns whether it is broadcasting.** Rig, encoder, bitrate, OBS to RTMP,
  destinations, staying up.
- **Ohnahji owns what is on it.** Scheduling, guests, virtual segments, hosts
  and callers, the run of the stream as a show.
- **Iman owns online operations**, including the Ops Room, the single day-of
  surface for crew and audience.
- **Motomoto is crew and does not lead a half.** Do not route a decision here
  expecting a call.

If a decision touches both halves, Zaal breaks the tie. See
[`../decisions/0002-virtual-lane-has-two-leads.md`](../decisions/0002-virtual-lane-has-two-leads.md),
including the two things about this lane that are still not settled.

## 04. Design and brand

Owns the brand kit, the print list, the poster, partner logos, wireframes and
the photo gallery.

Decides alone: layout, treatment, and anything inside the design system in
`src/app/globals.css` and `docs/brand/`.

Hands off to **01 Lead** before anything goes to print that names a partner, a
price or a performer.

## 05. Partnerships and city

Owns partner relationships and the city lane: permits, certificates, circuits,
vehicle access, vendors.

Decides alone: nothing that commits the event. A partnership is not real until
it is `confirmed: true` with a named `poc` in `src/content/site.ts`, and that
edit goes through Zaal.

**Standing rule:** there is no fiscal sponsor. Sponsorship is the commercial
path only, a marketing spend. Nothing describes a contribution as
tax-deductible, and the negative disclaimer is deliberately not printed either.

## 06. Ops and infrastructure

Owns the systems the rest of the team runs on: the repo, the deploy, the bots,
the coordination tooling.

Decides alone: anything that does not change what the public sees or what the
event promises.

Hands off to **01 Lead** for anything that changes a public claim, a date, or a
number on the site.

## 07. Advisors

Counsel, not owners.

Nothing on the day should ever be blocked waiting on an advisor. No advisor goes
on a public surface until they have personally agreed to be there.

---

## The one rule that covers the rest

If you are about to make a call and you cannot find your position above, or the
call spans two positions, **escalate rather than negotiate sideways.** Zaal
breaking a tie in one message costs less than two lanes quietly building
incompatible plans for a week.

