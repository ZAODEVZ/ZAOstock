import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// The festival MusicEvent renders on the festival pages only (card 10180,
// 2026-10-06). It used to sit in the root layout, so /zaoville and /privacy
// claimed to be ZAOstock 2026 too.
const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');
// Rendering it, not naming it: a comment that mentions the component is fine.
const RENDERS = /from '@\/(content\/event-jsonld|components\/EventJsonLd)'|<EventJsonLd\b|JSON\.stringify\(eventJsonLd\)/;

describe('festival event structured data is scoped to the festival pages', () => {
  it('is not in the root layout', () => {
    const layout = read('src/app/layout.tsx');
    expect(layout).not.toMatch(RENDERS);
  });

  it.each(['src/app/page.tsx', 'src/app/program/page.tsx', 'src/app/live/page.tsx', 'src/app/artist/[slug]/page.tsx'])(
    '%s renders <EventJsonLd />',
    (p) => {
      expect(read(p)).toContain('<EventJsonLd />');
    },
  );

  it.each(['src/app/zaoville/page.tsx', 'src/app/privacy/page.tsx'])('%s does not', (p) => {
    expect(read(p)).not.toMatch(RENDERS);
  });
});
