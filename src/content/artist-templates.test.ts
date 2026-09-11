import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

// The artist templates are generators: a deal memo, a rider or an outreach mail
// is copied out of them and sent to an artist. On 2026-09-10 nine deal memos
// were corrected in the vault for naming ENTERACT, and the template that made
// them still named it. Zaal, 2026-09-10: "enteract is not a partner neither is
// we 3 metal" (vault decisions/enteract-and-we3metal-are-not-partners.md).

const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');

// The estate's full retired set, exactly as ~/bin/zao-retired-names has it
// (CASELESS, plus SANG as a case-sensitive word), so the templates are held to
// the same list as every other repo. Change it there first, then here.
const RETIRED_CASELESS = /magnetiq|songjam|enteract|web3 ?metal|we3 ?metal/i;
const RETIRED_SANG = /\bSANG\b/;

describe('what the artist templates put in writing', () => {
  it('names nothing retired in anything copied to an artist', () => {
    const memo = read('docs/music/artist-deal-memo-template.md');
    // The memo body runs from its own title to the usage notes; the Updates
    // log after it is history and is never sent.
    const body = memo.slice(memo.indexOf('# Deal Memo - '), memo.indexOf('## How to use this template'));
    expect(body.length).toBeGreaterThan(1000);
    for (const [name, text] of [
      ['deal memo body', body],
      ['outreach templates', read('docs/music/artist-outreach-templates.md')],
      ['rider template', read('docs/music/artist-rider-template.md')],
    ] as const) {
      expect(text, name).not.toMatch(RETIRED_CASELESS);
      expect(text, name).not.toMatch(RETIRED_SANG);
    }
  });

  it('puts the festival on the right weekday', () => {
    // 3 October 2026 is a Saturday. Two templates said Friday.
    expect(new Date(Date.UTC(2026, 9, 3)).getUTCDay()).toBe(6);
    for (const f of ['docs/music/artist-deal-memo-template.md', 'docs/music/artist-outreach-templates.md', 'docs/music/artist-rider-template.md']) {
      expect(read(f), f).not.toMatch(/Friday,? October 3|Friday,? 3 October/i);
    }
  });
});
