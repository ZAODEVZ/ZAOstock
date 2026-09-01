import { describe, it, expect } from 'vitest';
import { FORM_POLICY, DATABASE_AVAILABLE, formIsLive, surfaceIsLive, emailByDesign, type FormSurface } from './forms-status';

// Zaal, 2026-08-29: the volunteer sign-up, the ideas box and the RSVP stay as
// forms; musician submissions and riders become an email link, and the cypher
// page is dropped entirely. These tests pin that decision so a later edit
// cannot quietly put a music intake back on a form,
// and pin the rule that no form renders while the write path is down - which
// is what made 23 August cost us a submission.

const SURFACES: FormSurface[] = ['volunteer', 'ideas', 'rsvp', 'musician-submission', 'rider'];

describe('form policy', () => {
  it('keeps the volunteer, ideas and RSVP surfaces as forms', () => {
    expect(FORM_POLICY.volunteer).toBe('form');
    expect(FORM_POLICY.ideas).toBe('form');
    expect(FORM_POLICY.rsvp).toBe('form');
  });

  it('sends the music intakes to email', () => {
    expect(FORM_POLICY['musician-submission']).toBe('email');
    expect(FORM_POLICY.rider).toBe('email');
  });

  // This assertion used to be wrapped in `if (!DATABASE_AVAILABLE)`, so it
  // tested nothing at all the moment anyone flipped the flag - it went quiet
  // exactly when the state it guards became reachable, and stayed green. The
  // rule is now checked in both states, unconditionally, by passing the state
  // in rather than reading today's value.
  it('never renders a form while the database is unavailable, whatever the flag says today', () => {
    for (const s of SURFACES) expect(surfaceIsLive(FORM_POLICY[s], false)).toBe(false);
  });

  it('renders exactly the three form surfaces once the database is up', () => {
    const live = SURFACES.filter((s) => surfaceIsLive(FORM_POLICY[s], true));
    expect(live).toEqual(['volunteer', 'ideas', 'rsvp']);
  });

  it('wires the shipped helper to the same rule as the flag it reads', () => {
    for (const s of SURFACES) {
      expect(formIsLive(s)).toBe(surfaceIsLive(FORM_POLICY[s], DATABASE_AVAILABLE));
    }
  });

  it('separates a decision from an outage', () => {
    for (const s of SURFACES) {
      expect(emailByDesign(s)).toBe(FORM_POLICY[s] === 'email');
      // an email-by-design surface is never live, whatever the database is doing
      if (emailByDesign(s)) expect(formIsLive(s)).toBe(false);
    }
  });

  it('covers every surface', () => {
    expect(Object.keys(FORM_POLICY).sort()).toEqual([...SURFACES].sort());
  });
});
