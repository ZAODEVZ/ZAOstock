import { describe, it, expect, vi } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

// src/lib/press-kit.ts imports 'server-only', which throws outside a React
// server bundle. Stub it so the module loads under vitest.
vi.mock('server-only', () => ({}));
const { loadPressKit, PLACEHOLDER_MARKDOWN } = await import('./press-kit');
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

  it('names no performer before the 7 September reveal', () => {
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

