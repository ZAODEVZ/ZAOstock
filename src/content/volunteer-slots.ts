// THE VOLUNTEER SIGN-UP SHEET. This file IS the sheet: zaostock.com/volunteer
// renders it, and the same page prints as the paper copy, so the two cannot
// disagree. People message Zaal; Zaal edits `taken` here and merges.
//
// Zaal, 2026-09-30: "have it more as a sign up sheet and have a virtual page
// and a in perons page too lets make it part of the repo too just a file that
// is displayed on a zaostock.com/volenteer page or something so anyone can
// see it and they message me and i can update it".
//
// Zaal, 2026-10-08, on reopening it after the 2026 festival: "lets open it up
// and make it better". So this is now the sheet for ZAOstock 2027. The 2026
// sheet (Franklin Street, 2 to 4 October) is in git history at #412.
//
// WHAT 2027 MAY SAY. ZAOstock 2027 has two facts: the date in NEXT_EDITION and
// that the place is not set (src/content/festival.ts). So nothing here names a
// venue, a street, a time of day, an after-party or a livestream as if it were
// arranged. Jobs are described relative to festival day, and `lastYear` is the
// one number we actually have: how many people the job took in 2026. A 2027
// head count is not invented until the place is known.
//
// Rules for editing: `taken` counts people, never names (a public page is no
// place for a volunteer's name without their say-so). Promise nothing here:
// no perks, no training, no cover. Say what the job is and when.
// src/content/volunteer-slots.test.ts enforces both.

export interface VolunteerSlot {
  id: string;
  job: string;
  what: string;
  /** How many people this job took at ZAOstock 2026. History, not a 2027 target. */
  lastYear: number;
  /** People signed up for 2027 so far, counted, never named. */
  taken: number;
}

export interface VolunteerDay {
  id: string;
  title: string;
  where: string;
  slots: VolunteerSlot[];
}

const TO_BE_SET = 'Place and times to be set';

/** In person, at the 2027 festival. Place to be announced. */
export const IN_PERSON: VolunteerDay[] = [
  {
    id: 'before',
    title: 'The day before',
    where: TO_BE_SET,
    slots: [
      { id: 'setup', job: 'Setup', what: 'Tables, banners, decor and signs.', lastYear: 3, taken: 0 },
      { id: 'supplies', job: 'Supplies run', what: 'Extension cables, tape, trash bags, work lights.', lastYear: 1, taken: 0 },
      { id: 'power', job: 'Power and cables', what: 'Find the outlets and lay cable runs out of walkways.', lastYear: 1, taken: 0 },
    ],
  },
  {
    id: 'day',
    title: 'Festival day',
    where: TO_BE_SET,
    slots: [
      { id: 'loadin', job: 'Load-in', what: 'Help set the sound gear, cables and tables.', lastYear: 3, taken: 0 },
      { id: 'checkin', job: 'Artist check-in', what: 'Greet the acts as they arrive for soundcheck.', lastYear: 1, taken: 0 },
      { id: 'clock', job: 'Timekeeper', what: 'Give each act a 5-minute and a 1-minute signal so sets end on time.', lastYear: 1, taken: 0 },
      { id: 'count', job: 'Headcount', what: 'A clicker at the entrance, counting people coming in.', lastYear: 2, taken: 0 },
      { id: 'hello', job: 'Welcome', what: 'Say hello and point people to the sign-up.', lastYear: 1, taken: 0 },
      { id: 'floater', job: 'Floater', what: 'Trash sweep, resets, and the lost-and-found point.', lastYear: 1, taken: 0 },
      { id: 'photos', job: 'Photos', what: 'Phone photos of the day, and one photo from the same spot every hour.', lastYear: 1, taken: 0 },
      { id: 'log', job: 'Event log', what: 'Jot down anything unusual with a rough time.', lastYear: 1, taken: 0 },
      { id: 'strike', job: 'Strike', what: 'Sound gear down, cables, tables, trash, lights.', lastYear: 3, taken: 0 },
    ],
  },
  {
    id: 'after',
    title: 'The day after',
    where: TO_BE_SET,
    slots: [
      { id: 'loadout', job: 'Load-out', what: 'Final pack-up and returns.', lastYear: 2, taken: 0 },
    ],
  },
];

/** Online, from anywhere. */
export const VIRTUAL: VolunteerDay[] = [
  {
    id: 'v-before',
    title: 'Before the festival',
    where: 'From anywhere',
    slots: [
      { id: 'v-share', job: 'Share ZAOstock', what: 'Tell Maine friends and groups about ZAOstock 2027 when there is something to share.', lastYear: 10, taken: 0 },
    ],
  },
  {
    id: 'v-day',
    title: 'Festival day',
    where: 'Online, if the day is livestreamed',
    slots: [
      { id: 'v-chat', job: 'Stream chat', what: 'Welcome people in the livestream chat and answer questions.', lastYear: 2, taken: 0 },
      { id: 'v-social', job: 'Live posting', what: 'Post short updates and photos to socials.', lastYear: 1, taken: 0 },
      { id: 'v-clips', job: 'Clips', what: 'Cut short clips for sharing, during and after the day.', lastYear: 2, taken: 0 },
    ],
  },
];

export const signedUp = (days: VolunteerDay[]): number =>
  days.reduce((sum, d) => sum + d.slots.reduce((s, x) => s + x.taken, 0), 0);
