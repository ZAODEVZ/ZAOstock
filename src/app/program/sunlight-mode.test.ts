import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { BLOCKS } from '@/content/program';

describe('Sunlight Mode & Program Controls accessibility', () => {
  const controlsSrc = readFileSync(
    path.join(process.cwd(), 'src/app/program/ProgramControls.tsx'),
    'utf8',
  );
  const cssSrc = readFileSync(
    path.join(process.cwd(), 'src/app/globals.css'),
    'utf8',
  );

  it('uses a stable, namespaced localStorage key', () => {
    expect(controlsSrc).toContain("STORAGE_KEY = 'zaostock_sunlight_mode'");
  });

  it('supports automatic prefers-contrast media query detection', () => {
    expect(controlsSrc).toContain("prefers-contrast: more");
    expect(cssSrc).toContain("@media (prefers-contrast: more)");
  });

  it('implements full ARIA toolbar and pressed attributes for screen readers', () => {
    expect(controlsSrc).toContain('role="toolbar"');
    expect(controlsSrc).toContain('aria-pressed={activeVenue ===');
    expect(controlsSrc).toContain('aria-pressed={sunlight}');
    expect(controlsSrc).toContain('aria-label=');
  });

  it('maps stage filters to the exact block IDs defined in run of show', () => {
    for (const b of BLOCKS) {
      const blockId = `b-${b.start.replace(':', '')}`;
      expect(controlsSrc).toContain(blockId);
    }
  });

  it('elevates muted ink to primary ink without violating brand anti-patterns', () => {
    expect(cssSrc).toContain('--color-ink-secondary: var(--color-ink-950)');
    expect(cssSrc).toContain('--color-ink-muted: var(--color-ink-950)');
  });
});
