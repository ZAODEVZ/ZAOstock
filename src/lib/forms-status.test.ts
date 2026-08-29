import { describe, it, expect } from 'vitest';
import { FORM_POLICY, DATABASE_AVAILABLE, formIsLive, emailByDesign, type FormSurface } from './forms-status';

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

  it('never renders a form while the database is unavailable', () => {
    if (!DATABASE_AVAILABLE) {
      for (const s of SURFACES) expect(formIsLive(s)).toBe(false);
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
