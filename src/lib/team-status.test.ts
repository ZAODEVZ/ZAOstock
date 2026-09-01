import { describe, it, expect } from 'vitest';
import { TEAM_DOC_URL, TEAM_DASHBOARD_RETIRED } from './team-status';

// A TRIPWIRE, not a unit test.
//
// /team is publicly reachable. Measured on production, 2026-09-01:
// `GET /team` returns 200 with no cookie. robots.txt disallows it, but that is
// crawler etiquette, not access control - anyone with the URL sees the page.
//
// src/app/team/TeamRetired.tsx renders an "Open the working document" BUTTON the
// moment TEAM_DOC_URL stops being 'UNSET'. And the working document is currently
// readable by anyone who has its link: its export endpoint returned HTTP 200 and
// 131,777 bytes of text/plain with no cookies and no Google session, measured
// 2026-09-01. It carries dollar figures, sponsor discount rules, the Black Moon
// bar-percentage negotiation, insurance and permit positions, and who is
// personally funding gear. Found by Iman, 2026-08-31; re-verified independently.
//
// So setting TEAM_DOC_URL today would publish all of that from a public page in
// one edit, with nothing failing and nothing warning. The mailto fallback that
// stands in for it is accidentally the safe behaviour.
//
// THIS TEST EXISTS TO MAKE THAT EDIT IMPOSSIBLE TO DO BY ACCIDENT.
//
// If you are here because CI went red: that is the tripwire working. Before you
// change the expectation below, change the DOCUMENT'S SHARING first, then delete
// this test in the same commit that sets the URL, and say in the commit message
// that you restricted it. Do not just update the string to make the test pass.

describe('TEAM_DOC_URL cannot be published by accident', () => {
  it('stays UNSET while the working document is readable by anyone with the link', () => {
    expect(TEAM_DOC_URL).toBe('UNSET');
  });

  it('is never a URL while /team is a public page', () => {
    expect(TEAM_DOC_URL).not.toMatch(/^https?:\/\//);
    expect(TEAM_DOC_URL).not.toContain('docs.google.com');
  });

  it('still reflects a retired dashboard, which is why the doc is the tool', () => {
    expect(TEAM_DASHBOARD_RETIRED).toBe(true);
  });
});
