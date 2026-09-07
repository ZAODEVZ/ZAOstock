import { describe, it, expect } from 'vitest';
import { SITE, DAY } from '@/content/site';

// SITE.windowLabel is the festival's public "when". It is not decoration: it is
// interpolated straight into the press kit's facts table
// (`src/lib/press-kit.ts`, the `| When |` row), which is the document that goes
// to journalists.
//
// Measured 2026-09-02, it disagrees with the site's own programme.
//
//   SITE.windowLabel   'Noon - 6 PM'
//   DAY, last slot     '8 - 10 PM', Black Moon Public House, "Live set"
//
// So the press kit tells a reporter the festival ends at six while /program
// shows two more billed slots after that - Stilo's DJ set 6 to 8 and the live
// set 8 to 10. Those are acts on the bill, not an after-party: the production
// plan has the day "programmed end to end from 12:00 to 22:00 with no open
// time" (Zaal, 31 August).
//
// This is the same failure shape the repo keeps catching - a wrong value that
// renders perfectly and reads as correct. Nothing errors. A reporter simply
// prints the wrong end time.
//
// The fix is a copy decision and it is Zaal's, not this test's: either the
// public window becomes the whole day, or the indoor half is deliberately
// framed as a separate evening and the press kit says so. Until he settles it,
// this pins the disagreement rather than hiding it, exactly as
// `lineup-reveal.test.ts` pins the site-versus-app lineup gap. It fails the
// moment anyone changes one side without the other, which is the prompt to
// change both.
// RESOLVED 2026-09-07, by the second route this comment names.
//
// Zaal settled it: the indoor half IS a separate evening. North Creek, roughly
// 6 to 9, hosted AND underwritten by Black Moon on their own premises and their
// own licence (Steve Peer's own mail, 26 August). Our insurance covers the
// 12-6pm OUTDOOR event only (Zaal to the broker, 3 September).
//
// So 'Noon - 6 PM' is not a wrong end time any more. It is the correct window for
// OUR event, and what follows is somebody else's evening that our crowd is invited
// to. The old two rows, 6-8 DJ and 8-10 live, also ran an hour past what the
// venue owner paying for it described.
//
// The pin below therefore changes shape: it no longer holds a contradiction open,
// it holds the RESOLUTION in place. The last row must still be Black Moon's, and
// it must still read as theirs rather than as a billed ZAO slot.
describe('the public window and the programme must not disagree silently', () => {
  it('keeps the window as OUR event, and the evening as Black Moon\'s', () => {
    expect(SITE.windowLabel).toBe('Noon - 6 PM');
    const last = DAY[DAY.length - 1];
    expect(last.where).toContain('Black Moon');
    expect(last.time).toBe('6 - 9 PM');
    // The framing is the whole point of the resolution: if this stops reading as
    // Black Moon's own evening, the window label becomes a wrong end time again.
    expect(last.what).toContain('Black Moon');
  });

  // Whatever the label says, it has to start when the music starts. That half
  // has never been in doubt and should stay pinned to the constant rather than
  // to a literal.
  it('starts at the hour music starts', () => {
    expect(SITE.windowLabel.startsWith(SITE.musicFrom)).toBe(true);
  });
});
