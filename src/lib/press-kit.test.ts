import { describe, it, expect, vi } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

// src/lib/press-kit.ts imports 'server-only', which throws outside a React
// server bundle. Stub it so the module loads under vitest.
vi.mock('server-only', () => ({}));
const { loadPressKit, PLACEHOLDER_MARKDOWN, publishable, PRESS_KIT_PATH } = await import('./press-kit');
const { SITE } = await import('@/content/site');

describe('press kit loader', () => {
  it('serves the placeholder when docs/marketing/press-kit.md is absent', () => {
    const kit = loadPressKit(path.join(tmpdir(), 'does-not-exist-press-kit.md'));
    expect(kit.source).toBe('placeholder');
    expect(kit.markdown).toBe(PLACEHOLDER_MARKDOWN);
  });

  it('serves the file when it exists and is non-empty', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'press-kit-'));
    const file = path.join(dir, 'press-kit.md');
    writeFileSync(file, '# Real kit\n\nBody.\n');
    const kit = loadPressKit(file);
    expect(kit.source).toBe('file');
    expect(kit.markdown).toContain('# Real kit');
  });

  it('falls back to the placeholder when the file is empty', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'press-kit-'));
    const file = path.join(dir, 'press-kit.md');
    writeFileSync(file, '   \n');
    expect(loadPressKit(file).source).toBe('placeholder');
  });
});

const PRESS_UNSET_FIELDS = ['Press photos | **UNSET**', 'Attendance figure | **UNSET**', 'Quotes | **UNSET**'];

describe('press kit placeholder', () => {
  const blob = PLACEHOLDER_MARKDOWN.toLowerCase();

  it('carries the published facts', () => {
    expect(PLACEHOLDER_MARKDOWN).toContain('Saturday, October 3, 2026');
    expect(PLACEHOLDER_MARKDOWN).toContain(SITE.windowLabel);
    expect(PLACEHOLDER_MARKDOWN).toContain('Noon');
    expect(PLACEHOLDER_MARKDOWN).toContain('Franklin Street Parklet');
    expect(PLACEHOLDER_MARKDOWN).toContain('Free to attend');
    expect(PLACEHOLDER_MARKDOWN).toContain('info@thezao.com');
  });

  // There is no reveal day since 2026-09-10 (Zaal). The placeholder used to
  // announce one three times; it now says how acts are announced instead.
  it('announces each act in its own post, and names no reveal day', () => {
    expect(PLACEHOLDER_MARKDOWN).toContain('Each artist is announced in their own post, with their bio and photo');
    expect(PLACEHOLDER_MARKDOWN).not.toMatch(/13 September|reveal/i);
  });

  it('names no performer before the reveal', () => {
    for (const name of ['werb', 'fellenz', 'lyons den', 'dcoop', 'acadia rising', 'stilo', 'north creek', 'aquavantes', 'sen', 'phelan']) {
      expect(blob).not.toContain(name);
    }
  });

  it('types no figure Zaal has not typed', () => {
    expect(blob).not.toMatch(/\$\s?\d/);
    expect(blob).not.toMatch(/\b\d[\d,]*\s*(people|attendees|attendance)\b/);
    expect(PRESS_UNSET_FIELDS.every((f) => PLACEHOLDER_MARKDOWN.includes(f))).toBe(true);
  });

  it('never claims a tax-deductible path', () => {
    expect(blob).not.toContain('tax-deductible recognition');
    expect(blob).not.toContain('501(c)');
    // This used to REQUIRE the disclaimer "no contribution is tax-deductible".
    // Zaal struck that sentence from the public site on 2026-08-31, so the test
    // now enforces what the rule actually says: never make the positive claim.
    // Silence is compliant; asserting deductibility is not.
    expect(blob).not.toContain('tax deductible');
    expect(blob).not.toContain('tax-deductible');
  });
});

// The kit is rendered by react-markdown, which ESCAPES raw HTML rather than
// hiding it. Until 2026-09-12 the kit's own note to itself - "<!-- re-check:
// ... -->" - was printed on /press, where a journalist reads it.
describe('what /press renders out of the kit', () => {
  const kit = readFileSync(PRESS_KIT_PATH, 'utf8');

  it('strips internal HTML comments', () => {
    expect(kit).toContain('<!--');
    expect(publishable(kit)).not.toContain('<!--');
    expect(publishable('a\n\n<!-- note -->\n\nb')).toBe('a\n\nb');
  });

  it('carries the day as the program has it, not the retimed-away version', () => {
    // Retimed 2026-09-10 ("option b"): seven-minute changeovers, music 12:05
    // to 5:46. The kit still said 5:55 and five-minute on 2026-09-12, on the
    // public page, two days after /program was corrected.
    const text = publishable(kit);
    expect(text).not.toMatch(/5:55|17:55|five-minute changeover|30 to 40 minute/i);
    // No set time for any act, opener included (Zaal, 2026-09-12: "no set times
    // listed publicly"). The day's boundaries are not a slot, so they stay.
    expect(text).not.toMatch(/\b\d{1,2}:[0-5]\d\b/);
    expect(text).toContain('noon to six');
    expect(text).toContain('seven-minute changeovers');
  });
});
