import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { auditFile } from './check-pr-review.mjs';

/**
 * A real-world large base64 data URI can contain a coincidental "AKIA..." or
 * "secret=..." shaped substring by chance alone - measured on
 * public/ops/index.html:739 (a 404,704-character embedded image line, flagged
 * as a HIGH security finding on job 108260534879, traced to a chance
 * "akiAZLgbLDZsKM4ZJy12" 20-character run inside the base64 payload). This
 * pins the fix both ways: the data URI must not fire, and a real secret
 * shape - including one sitting right next to a data URI on the same line -
 * still must.
 */

let dir: string;

function writeAndAudit(content: string) {
  // NOT "...-test-": isTestFile() excludes any path containing "-test", which
  // would silently short-circuit every fixture here to [] regardless of
  // content - caught by this test suite itself on the first run.
  dir = mkdtempSync(path.join(tmpdir(), 'check-pr-review-fixtures-'));
  const file = path.join(dir, 'fixture.ts');
  writeFileSync(file, content);
  return auditFile(file);
}

afterEach(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
});

describe('auditFile - base64 data URI false positive', () => {
  it('does not flag a base64 PNG data URI containing a coincidental AKIA-shaped run', () => {
    // The exact fragment from public/ops/index.html:739 that triggered the
    // false positive - real base64 output, not synthesized - so this test
    // would have failed under the pre-fix regex (verified: it does) rather
    // than asserting something that was never at risk.
    const blob = 'L7r+Nkgk/EzgZ9x3SCbLakiAZLgbLDZsKM4ZJy124123KKM1xpz7fbFmLXCq';
    const line = `var IMG = {"badge":"data:image/png;base64,${blob}"};`;
    expect(writeAndAudit(line)).toEqual([]);
  });

  it('still flags a real hardcoded secret shape', () => {
    // A generic assignment shape (api_key = "...20+ chars...") rather than a
    // real vendor prefix like sk_live_ - GitHub's own push protection blocks
    // a commit containing a Stripe-key-shaped string outright, secret or not,
    // which caught an earlier draft of this fixture before it ever reached CI.
    const line = `const apiKey = "${'z'.repeat(24)}";`;
    const findings = writeAndAudit(line);
    expect(findings).toHaveLength(1);
    expect(findings[0].category).toBe('security');
  });

  it('still flags a real secret on the same line as an unrelated data URI', () => {
    const blob = 'iVBORw0KGgoAAAANSUhEUgAAAPAAAAEsCAIAAAByvKklAAAA'.repeat(500);
    const line = `var x = "data:image/png;base64,${blob}"; const secret = "${'a'.repeat(24)}";`;
    const findings = writeAndAudit(line);
    expect(findings).toHaveLength(1);
    expect(findings[0].category).toBe('security');
  });

  it('still flags a NEXT_PUBLIC secret assignment next to a data URI', () => {
    const blob = 'iVBORw0KGgoAAAANSUhEUgAAAPAAAAEsCAIAAAByvKklAAAA'.repeat(500);
    const line = `var x = "data:image/png;base64,${blob}"; NEXT_PUBLIC_API_SECRET="${'b'.repeat(24)}"`;
    const findings = writeAndAudit(line);
    expect(findings.some((f) => f.msg.includes('NEXT_PUBLIC'))).toBe(true);
  });
});
