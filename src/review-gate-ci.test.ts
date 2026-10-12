import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The review gate has to be graded by main's copy of its script.
 *
 * `npm run check:review` runs scripts/check-pr-review.mjs from the checked out
 * tree, which on a pull request is the pull request. A pull request that
 * edits the gate was therefore graded by its own edit. The workflow now runs
 * the script as it is on origin/main, and this test is what notices if that
 * step is removed, because nothing fails when a workflow step disappears.
 *
 * It cannot notice a pull request that rewrites the workflow itself. That
 * needs a branch rule on the two files, outside this repository's code.
 */
const workflow = readFileSync(join(process.cwd(), '.github', 'workflows', 'ci.yml'), 'utf8');
const job = workflow.slice(workflow.indexOf('\n  review:'));

describe('review gate CI job', () => {
  it('exists', () => {
    expect(workflow).toMatch(/^\s{2}review:\s*$/m);
  });

  it("reads the gate script out of origin/main, not out of the pull request's tree", () => {
    expect(job).toMatch(/git show origin\/main:scripts\/check-pr-review\.mjs > "\$gate"/);
    expect(job).toMatch(/node "\$gate"/);
  });

  it('keeps the copy outside the working tree', () => {
    // A copy written into the repository could be picked up as a changed file.
    expect(job).toMatch(/gate="\$RUNNER_TEMP\//);
  });

  it('fetches full history, so origin/main is there to read', () => {
    expect(job).toMatch(/fetch-depth:\s*0/);
  });

  it('fails when the base copy cannot be read or prints no verdict', () => {
    // Otherwise a script that exits 0 having checked nothing reads as a pass.
    expect(job).toMatch(/\[ ! -s "\$gate" \]/);
    expect(job).toMatch(/grep -q "OVERALL VERDICT" "\$log"/);
    expect(job.match(/exit 2/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it("passes the base copy's exit code through", () => {
    expect(job).toMatch(/node "\$gate" > "\$log" 2>&1 \|\| status=\$\?/);
    expect(job).toMatch(/exit "\$status"/);
  });

  it('runs the base copy before the pull request copy', () => {
    const base = job.indexOf('node "$gate"');
    const own = job.indexOf('- run: npm run check:review');
    expect(base).toBeGreaterThan(-1);
    expect(own).toBeGreaterThan(base);
  });

  it('warns when the pull request edits the gate or this workflow', () => {
    expect(job).toMatch(/git diff --quiet origin\/main HEAD -- scripts\/check-pr-review\.mjs \.github\/workflows\/ci\.yml/);
    expect(job).toMatch(/::warning::/);
  });

  it('gives every job a read-only token', () => {
    expect(workflow).toMatch(/^permissions:\n\s{2}contents: read$/m);
    expect(workflow).not.toMatch(/pull_request_target/);
  });
});
