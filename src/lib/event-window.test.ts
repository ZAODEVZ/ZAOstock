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
describe('the public window and the programme must not disagree silently', () => {
  it('pins the known gap so changing one side trips the other', () => {
    expect(SITE.windowLabel).toBe('Noon - 6 PM');
    expect(DAY[DAY.length - 1].time).toBe('8 - 10 PM');
    expect(DAY[DAY.length - 1].where).toContain('Black Moon');
  });

  // Whatever the label says, it has to start when the music starts. That half
  // has never been in doubt and should stay pinned to the constant rather than
  // to a literal.
  it('starts at the hour music starts', () => {
    expect(SITE.windowLabel.startsWith(SITE.musicFrom)).toBe(true);
  });
});
