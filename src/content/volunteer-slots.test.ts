import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { IN_PERSON, VIRTUAL, signedUp } from './volunteer-slots';
import { FESTIVAL, NEXT_EDITION } from './festival';

// Guards for the public volunteer sheet (src/content/volunteer-slots.ts).
// Zaal's rule for this page, relayed with the spec on 2026-09-30 and again
// when it reopened for 2027 on 2026-10-08: promise nothing. No training, no
// cover, no age policy, no "you'll get". And the 2027 edition has only two
// facts (festival.ts NEXT_EDITION), so the sheet must not carry 2026 places
// or dates forward as if they were arranged for 2027.

const ALL = [...IN_PERSON, ...VIRTUAL];
const slots = ALL.flatMap((d) => d.slots);
const text = ALL.flatMap((d) => [d.title, d.where, ...d.slots.flatMap((s) => [s.job, s.what])]).join('\n');

describe('volunteer sheet', () => {
  it('has unique slot ids', () => {
    const ids = slots.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('counts people with whole non-negative numbers', () => {
    for (const s of slots) {
      expect(Number.isInteger(s.taken) && s.taken >= 0).toBe(true);
      expect(Number.isInteger(s.lastYear) && s.lastYear > 0).toBe(true);
    }
    expect(signedUp(ALL)).toBe(slots.reduce((n, s) => n + s.taken, 0));
  });

  it('promises nothing', () => {
    const promise = /\b(you'?ll get|we'?ll (give|provide|cover|train)|training|trained|free (food|meal|ticket|shirt|t-shirt|entry)|perks?|guarantee|insurance|insured|reimburse|paid|stipend|age|minimum age|18\+|21\+)\b/i;
    expect(text).not.toMatch(promise);
  });

  it('does not carry 2026 places or dates into the 2027 sheet', () => {
    const stale = /\b(Franklin|Parklet|Black Moon|Jenga|October|Oct\b|2026)\b/i;
    expect(text).not.toMatch(stale);
    expect(text).not.toContain(FESTIVAL.dateLabel);
  });

  it('never types the 2027 date or a place into the sheet; the page reads NEXT_EDITION', () => {
    expect(text).not.toContain(NEXT_EDITION.dateLabel);
    expect(text).not.toContain(NEXT_EDITION.date);
    const file = readFileSync(path.join(__dirname, 'volunteer-slots.ts'), 'utf8');
    expect(file).not.toContain(NEXT_EDITION.dateLabel);
  });
});
