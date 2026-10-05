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
    // The rain answer was advice for attending; it went with the past-tense rewrite.
    expect(all).not.toContain(SITE.weather);
    expect(QUICK_ANSWERS.map((x) => x.q).join(' ')).not.toMatch(/rain|park/i);
    // Parking was advice for attending and left the list; /ellsworth still renders PARKING_DETAIL (tested below).
    expect(all).not.toContain(PARKING_DETAIL);
  });

  it('names every act by display name, and no clock time', () => {
    const who = QUICK_ANSWERS.find((x) => x.q === 'Who was on the bill?')!.a;
    for (const name of LINEUP_NAMES) expect(who).toContain(displayName(name));
    expect(who).not.toMatch(/\d{1,2}:\d{2}/);
  });

  it('answers only settled questions (open with Zaal: dogs, smoking, food, restrooms, end time)', () => {
    const qs = QUICK_ANSWERS.map((x) => x.q).join(' ');
    expect(qs).not.toMatch(/dog|pet|smok|food|eat|restroom|toilet|bathroom|accessib|what time does .* end/i);
    const all = QUICK_ANSWERS.map((x) => x.a).join(' ');
    // The end time is Black Moon's close (10 PM, ruled 2026-09-27); quick answers leave it to /afterparty.
    expect(all).not.toMatch(/\b(9|10)\s*(pm|PM)|until (9|10)|to 10/);
    // All-ages: the parklet's, plus Black Moon's own flyer for after six.
    expect(QUICK_ANSWERS.find((x) => x.q === 'Was it all ages?')!.a).toContain('parklet');
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
