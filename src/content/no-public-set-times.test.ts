import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { BLOCKS, publicSlots } from './program';

// Zaal, 2026-09-12: "no set times listed publicly. Not on the site, not in
// posts, not in the reveal copy. Name the act, not the slot." That reversed his
// 2026-09-10 call, which had made /program the one public place set times live,
// so the grid came down. His pick, from four options: an act still reads its own
// time on its own backstage page, because otherwise eight acts ask him
// individually.
//
// Day boundaries survive: noon and six pin no act, and people have to know when
// to turn up.

const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');
const CLOCK = /\b\d{1,2}:[0-5]\d\b/;

describe('no set times in public', () => {
  it('hands the page rows with no clock on them', () => {
    const rows = BLOCKS.flatMap(publicSlots);
    expect(rows.length).toBeGreaterThan(8);
    for (const row of rows) {
      expect(row, 'a published row carries a time field').not.toHaveProperty('time');
      expect(`${row.label} ${row.detail ?? ''}`, row.label).not.toMatch(CLOCK);
    }
  });

  it('still keeps every act, in order, with the changeovers folded away', () => {
    const outdoor = publicSlots(BLOCKS[0]);
    expect(outdoor.filter((s) => s.tone === 'set').map((s) => s.label)).toEqual([
      'The Crown Vics', 'OPEN X', 'Grass Rug', 'Acadia Rising', 'Michael Anderson',
      'DCoop', 'Lyons Den', 'Fellenz',
    ]);
    expect(outdoor.some((s) => s.label === 'Changeover')).toBe(false);
  });

  it('renders no time on /program, and does not reach for one', () => {
    const page = read('src/app/program/page.tsx');
    expect(page).not.toMatch(/\{s\.time\}|s\.time/);
    const jsxText = page.split('\n').filter((l) => !l.trim().startsWith('//'));
    // "Noon to six" and "From six" are day boundaries; a digit clock is not.
    expect(jsxText.filter((l) => CLOCK.test(l) && /className|>/.test(l))).toEqual([]);
  });

  it('keeps the clock off the public ops board', () => {
    for (const f of ['ops-room/ops-room.src.html', 'public/ops/index.html']) {
      const src = read(f);
      expect(src, f).toContain('forPublic ? "" : hhmm(s.t)');
      // The lounge's now/next line says where, not when.
      expect(src, f).not.toMatch(/hhmm\(slot\.t\) \+ " to " \+ hhmm\(slot\.e\)/);
    }
  });

  it('sends an artist to their own page, not to /program', () => {
    for (const f of ['scripts/create-artist-form.gs', 'src/content/artist-ops.ts']) {
      const lines = read(f).split('\n').filter((l) => !l.trim().startsWith('//') && !l.trim().startsWith('*'));
      expect(lines.filter((l) => /zaostock\.com\/program/.test(l)), f).toEqual([]);
    }
  });
});
