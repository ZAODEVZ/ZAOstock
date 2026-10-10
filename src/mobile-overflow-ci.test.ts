import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The mobile-overflow job has to keep existing, and it has to keep testing the
 * pull request's own build.
 *
 * Background: scripts/mobile-overflow-check.mjs was written and worked, but no
 * CI job invoked it, so it guarded nothing. Wiring it up is one line; losing it
 * again later is silent, because nothing fails when a job disappears. This is a
 * source-level guard for that: a missing job cannot be noticed by running the
 * tests, so the tests have to be what notices it.
 */
const WORKFLOW = join(process.cwd(), '.github', 'workflows', 'ci.yml');
const CHECK = join(process.cwd(), 'scripts', 'mobile-overflow-check.mjs');

describe('mobile overflow CI job', () => {
  const workflow = readFileSync(WORKFLOW, 'utf8');

  it('has a job that runs the mobile overflow check', () => {
    expect(workflow).toMatch(/^\s{2}mobile:\s*$/m);
    // Not a bare `run:` match: the step captures the exit code, so the line
    // reads `npm run check:mobile-overflow || status=$?`. What matters is
    // that the job invokes it, not how the line is punctuated.
    expect(workflow).toMatch(/npm run check:mobile-overflow/);
  });

  it('points the check at the build under test, not at production', () => {
    // BASE must be the local server. The checker's own default is
    // https://zaostock.com, so without this the job would report on
    // production while claiming to report on the pull request.
    expect(workflow).toMatch(/BASE:\s*http:\/\/127\.0\.0\.1:3111/);
  });

  it('fails the job when the server never comes up', () => {
    // Otherwise a broken start looks exactly like a clean run.
    const job = workflow.slice(workflow.indexOf('\n  mobile:'));
    expect(job).toMatch(/did not come up on :3111/);
    expect(job).toMatch(/exit 1/);
  });

  it('propagates the check exit code instead of swallowing it', () => {
    const job = workflow.slice(workflow.indexOf('\n  mobile:'));
    expect(job).toMatch(/check:mobile-overflow \|\| status=\$\?/);
    expect(job).toMatch(/exit "\$status"/);
  });

  it('installs a browser before the check needs one', () => {
    // The checker launches chromium; without this step the job dies on a
    // missing executable, which reads as a broken check rather than a
    // missing prerequisite.
    const job = workflow.slice(workflow.indexOf('\n  mobile:'));
    expect(job).toMatch(/playwright install/);
  });

  it('does not read untrusted PR text into a run step', () => {
    // No ${{ }} at all in this workflow, which keeps PR titles and bodies out
    // of the shell. Cheap to assert, and the whole file is visible in a diff.
    expect(workflow).not.toContain('${{');
  });
});

describe('the check the job depends on', () => {
  it('defaults to production but accepts an override', () => {
    // Guarded because the job relies on that override. If the checker ever
    // stops honouring BASE, the job silently starts testing the wrong thing
    // and still goes green.
    const check = readFileSync(CHECK, 'utf8');
    expect(check).toMatch(/process\.env\.BASE/);
  });

  it('exits non-zero when it finds an overflow', () => {
    const check = readFileSync(CHECK, 'utf8');
    expect(check).toMatch(/if \(failures > 0\)[\s\S]{0,200}process\.exit\(1\)/);
  });
});
