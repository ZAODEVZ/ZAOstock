import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { QUICK_ANSWERS, faqJsonLd, PARKING_DETAIL } from './quick-answers';
import { FESTIVAL } from './festival';
import { SITE, LINEUP_NAMES, displayName } from './site';

describe('QUICK_ANSWERS', () => {
  it('draws its facts from the site sources, not retyped copies', () => {
    const all = QUICK_ANSWERS.map((x) => x.a).join('\n');
    expect(all).toContain(FESTIVAL.admission);
    expect(all).toContain(FESTIVAL.dateLabel);
    expect(all).toContain(SITE.weather);
    expect(all).toContain(PARKING_DETAIL);
  });

  it('names every act by display name, and no clock time', () => {
    const who = QUICK_ANSWERS.find((x) => x.q === 'Who is playing?')!.a;
    for (const name of LINEUP_NAMES) expect(who).toContain(displayName(name));
    expect(who).not.toMatch(/\d{1,2}:\d{2}/);
  });

  it('answers only settled questions (open with Zaal: dogs, smoking, food, restrooms, end time)', () => {
    const qs = QUICK_ANSWERS.map((x) => x.q).join(' ');
    expect(qs).not.toMatch(/dog|pet|smok|food|eat|restroom|toilet|bathroom|accessib|what time does .* end/i);
    const all = QUICK_ANSWERS.map((x) => x.a).join(' ');
    // After-party end time is unsettled (6-9 per Steve vs the poster's 6 to 10).
    expect(all).not.toMatch(/\b(9|10)\s*(pm|PM)|until (9|10)|to 10/);
    // All-ages is the parklet's; Black Moon after six is unanswered.
    expect(QUICK_ANSWERS.find((x) => x.q === 'Is it all ages?')!.a).toContain('parklet');
  });

  it('never quotes a price', () => {
    // /llms.txt rule: "Never quote a price." The free answer says free.
    for (const { a } of QUICK_ANSWERS) expect(a).not.toMatch(/\$\d/);
  });
});

describe('faqJsonLd', () => {
  it('mirrors the visible list one-for-one', () => {
    const ld = faqJsonLd();
    expect(ld['@type']).toBe('FAQPage');
    expect(ld.mainEntity.map((q) => q.name)).toEqual(QUICK_ANSWERS.map((x) => x.q));
    expect(ld.mainEntity.map((q) => q.acceptedAnswer.text)).toEqual(QUICK_ANSWERS.map((x) => x.a));
  });

  it('is rendered on /program next to the visible list, and /ellsworth reuses the parking text', () => {
    const program = readFileSync(path.join(process.cwd(), 'src/app/program/page.tsx'), 'utf8');
    expect(program).toContain('faqJsonLd()');
    expect(program).toContain('QUICK_ANSWERS.map');
    const ellsworth = readFileSync(path.join(process.cwd(), 'src/app/ellsworth/page.tsx'), 'utf8');
    expect(ellsworth).toContain('PARKING_DETAIL');
  });
});
