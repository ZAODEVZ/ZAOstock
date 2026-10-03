import { describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// This test lives in src/lib/db/ but the script is at the repo root, so the
// path goes up three levels - not one, which is what a relative import here
// looks like at a glance and what I wrote first.
import { auditFile } from '../../../scripts/check-pr-review.mjs';

type Finding = { category: string; line: number; msg: string };

/**
 * The SQL-injection rule misses the tagged-template form of the call it
 * names.
 *
 * The rule is:
 *
 *     const RE_RAW_SQL =
 *       /\.(?:query|execute|\$queryRaw|\$executeRawUnsafe)\s*\(\s*`[^`]*\$\{/;
 *
 * The `\s*\(` makes an opening parenthesis mandatory. So it matches
 *
 *     db.query(`select * from t where id = ${id}`)
 *
 * and misses
 *
 *     db.$queryRawUnsafe`select * from artists where id = ${id}`
 *
 * which is the same call without parentheses - a tagged template. The
 * `$queryRaw` / `$executeRawUnsafe` names in the pattern are Prisma's, and
 * Prisma is most often written as a tag, because that is the form its own
 * documentation shows. The rule therefore does not fire on the exact usage it
 * was written for.
 *
 * Verified against the real pattern extracted from the script, not a copy:
 *
 *     db.query(`... ${id}`)      -> true
 *     db.$queryRawUnsafe`...`    -> false
 *
 * Nothing in src/ uses the tagged form today, so this is not an active hole -
 * it is a check that would pass the day someone writes the common form of the
 * call it already names.
 *
 * Each case is written to a real temporary file and passed through the real
 * auditFile, so a future refactor of that function is exercised rather than a
 * copy of the regex made here.
 */
function auditSource(source: string, name = 'probe.ts'): Finding[] {
  const dir = mkdtempSync(join(tmpdir(), 'raw-sql-'));
  const file = join(dir, name);
  writeFileSync(file, source);
  return auditFile(file);
}

const WITH_INTERPOLATION = '${id}';

describe('raw SQL interpolation', () => {
  it('flags a tagged template call, not only a parenthesised one', () => {
    const issues = auditSource(
      'export const q = (id: string) =>\n' +
        '  db.$queryRawUnsafe`select * from artists where id = ' +
        WITH_INTERPOLATION +
        '`;\n'
    );
    expect(issues.map((i: Finding) => i.category)).toContain('database');
  });

  it('flags the execute form as a tag too', () => {
    const issues = auditSource(
      'export const q = (id: string) =>\n' +
        '  db.$executeRawUnsafe`delete from artists where id = ' +
        WITH_INTERPOLATION +
        '`;\n'
    );
    expect(issues.map((i: Finding) => i.category)).toContain('database');
  });

  it('still flags the parenthesised forms it already caught', () => {
    // Regression guard: the fix must widen the rule, not replace it. These
    // are the two forms that were already firing before the change.
    for (const call of ['db.query(`select * from t where id = ', 'db.execute(`delete from t where id = ']) {
      const issues = auditSource('const q = () =>\n  ' + call + WITH_INTERPOLATION + '`);\n');
      expect(issues.map((i: Finding) => i.category)).toContain('database');
    }
  });

  it('flags the plain query tag, which the fix also has to cover', () => {
    // db.query`...` is a tag as well, so the widened rule must catch this
    // one too. Kept as its own case so a future narrowing that keeps only
    // the Prisma names fails here rather than passing quietly.
    const issues = auditSource(
      'const q = () => db.query`select * from t where id = ' + WITH_INTERPOLATION + '`;\n'
    );
    expect(issues.map((i: Finding) => i.category)).toContain('database');
  });

  it('leaves a static query alone', () => {
    // No interpolation means no injection risk, whatever the call shape.
    const issues = auditSource(
      'export const all = () => db.query`select * from artists`;\n'
    );
    expect(issues).toEqual([]);
  });

  it('leaves a parameterised query alone', () => {
    // $1-style placeholders are the safe way to do this.
    const issues = auditSource(
      'export const one = () =>\n' +
        '  db.query`select * from artists where id = $1`;\n'
    );
    expect(issues).toEqual([]);
  });
});
