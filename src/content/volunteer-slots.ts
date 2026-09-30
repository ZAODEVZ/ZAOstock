// THE VOLUNTEER SIGN-UP SHEET. This file IS the sheet: zaostock.com/volunteer
// renders it, and the same page prints as the paper copy, so the two cannot
// disagree. People message Zaal; Zaal edits `taken` here and merges.
//
// Zaal, 2026-09-30: "have it more as a sign up sheet and have a virtual page
// and a in perons page too lets make it part of the repo too just a file that
// is displayed on a zaostock.com/volenteer page or something so anyone can
// see it and they message me and i can update it".
//
// Rules for editing: `taken` counts people, never names (a public page is no
// place for a volunteer's name without their say-so). Promise nothing here:
// no perks, no training, no cover. Say what the job is and when.

export interface VolunteerSlot {
  id: string;
  when: string;
  job: string;
  what: string;
  needed: number;
  taken: number;
}

export interface VolunteerDay {
  id: string;
  title: string;
  where: string;
  slots: VolunteerSlot[];
}

/** In person, Franklin Street Parklet, Ellsworth. */
export const IN_PERSON: VolunteerDay[] = [
  {
    id: 'fri',
    title: 'Friday, October 2',
    where: 'Franklin Street Parklet, 2 to 6 PM',
    slots: [
      { id: 'fri-setup', when: '2 - 6 PM', job: 'Setup', what: 'Tables, banners, decor and signs on the parklet.', needed: 3, taken: 0 },
      { id: 'fri-supplies', when: 'Before 2 PM', job: 'Supplies run', what: 'Extension cables, tape, trash bags, work lights.', needed: 1, taken: 0 },
      { id: 'fri-power', when: '2 - 4 PM', job: 'Power and cables', what: 'Find the outlets and lay cable runs out of walkways.', needed: 1, taken: 0 },
    ],
  },
  {
    id: 'sat',
    title: 'Saturday, October 3',
    where: 'Franklin Street Parklet, from 8 AM',
    slots: [
      { id: 'sat-loadin', when: '8 - 10 AM', job: 'Load-in', what: 'Help set the sound gear, cables and tables.', needed: 3, taken: 0 },
      { id: 'sat-checkin', when: '9:30 AM - 12 PM', job: 'Artist check-in', what: 'Greet the acts as they arrive for soundcheck.', needed: 1, taken: 0 },
      { id: 'sat-clock', when: '12 - 6 PM', job: 'Timekeeper', what: 'Give each act a 5-minute and a 1-minute signal so sets end on time.', needed: 1, taken: 0 },
      { id: 'sat-count', when: '12 - 6 PM', job: 'Headcount', what: 'A clicker at one end of the parklet, counting people coming in.', needed: 2, taken: 0 },
      { id: 'sat-hello', when: '12 - 6 PM', job: 'Welcome and QR sign', what: 'Point people to the sign-up QR and ask two quick questions.', needed: 1, taken: 0 },
      { id: 'sat-floater', when: '12 - 6 PM', job: 'Floater', what: 'Jenga reset, trash sweep, and the lost-and-found point at the stage.', needed: 1, taken: 0 },
      { id: 'sat-photos', when: '12 - 6 PM', job: 'Photos', what: 'Phone photos of the day, and one photo from the same spot every hour.', needed: 1, taken: 0 },
      { id: 'sat-log', when: '12 - 6 PM', job: 'Event log', what: 'Jot down anything unusual with a rough time.', needed: 1, taken: 0 },
      { id: 'sat-sign', when: '5:50 - 6:15 PM', job: 'After-party sign', what: 'Hold the sign on the street pointing to Black Moon next door.', needed: 1, taken: 0 },
      { id: 'sat-strike', when: 'From 5:50 PM', job: 'Strike', what: 'Sound gear down, cables, tables, trash, lights.', needed: 3, taken: 0 },
    ],
  },
  {
    id: 'sun',
    title: 'Sunday, October 4',
    where: 'Franklin Street Parklet, time set with the crew',
    slots: [
      { id: 'sun-loadout', when: 'Sunday', job: 'Load-out', what: 'Final pack-up and returns.', needed: 2, taken: 0 },
    ],
  },
];

/** Online, from anywhere. */
export const VIRTUAL: VolunteerDay[] = [
  {
    id: 'before',
    title: 'Before Saturday',
    where: 'From anywhere',
    slots: [
      { id: 'v-share', when: 'Any time', job: 'Share the event', what: 'Share the Facebook event or the poster with Maine friends and groups.', needed: 10, taken: 0 },
    ],
  },
  {
    id: 'day',
    title: 'Saturday, October 3',
    where: 'Online, noon to 6 PM Eastern',
    slots: [
      { id: 'v-chat', when: '12 - 6 PM', job: 'Stream chat', what: 'Welcome people in the livestream chat and answer questions.', needed: 2, taken: 0 },
      { id: 'v-social', when: '12 - 6 PM', job: 'Live posting', what: 'Post short updates and photos from the stream to socials.', needed: 1, taken: 0 },
      { id: 'v-clips', when: 'During and after', job: 'Clips', what: 'Cut short clips from the stream for sharing.', needed: 2, taken: 0 },
    ],
  },
];

/**
 * Already covered, so the sheet shows the whole picture, not only the gaps.
 * Roles only, never names: nobody on the crew has agreed to be listed here
 * (Dotfiles review of #412).
 */
export const COVERED: readonly string[] = ['MC', 'Stage managers', 'Sound', 'Livestream', 'Video', 'Stream moderation'];

export const openCount = (s: VolunteerSlot) => Math.max(0, s.needed - s.taken);
