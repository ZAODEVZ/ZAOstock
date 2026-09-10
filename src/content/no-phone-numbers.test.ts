import { describe, expect, it } from 'vitest';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';

// Decision 0006: artist phone numbers live only in the form's responses sheet,
// never in this public repo. This fails if ANY tracked file carries a
// phone-shaped string. Same pattern as the older docs/team-only check in
// registry.test.ts, widened to every file.
//
// Keep it narrow. A legitimate public number (a venue's line, a vendor) goes in
// ALLOWED by exact value, never by loosening PHONE. A broad guard gets deleted
// the first time it cries wolf.
const PHONE = /(\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/g;

/**
 * Exact strings allowed to match, each with its reason. All three are public
 * BUSINESS lines of AV vendors researched for ZAOville (July 2026), in
 * .handoffs/session-2026-07-14-team-access-hats-streaming/README.md. Found by
 * this guard on its first run, 2026-09-10. No person's number belongs here.
 */
const ALLOWED: Record<string, string> = {
  '888-462-7808': 'Beverly Boy Productions, toll-free business line',
  '(301-490-3155': 'Breasia Productions, Laurel MD, business line',
  '(703-531-8406': 'AVALive, business line',
};

/**
 * The shape-test fixtures below. They are fictional (555-01xx is the range
 * reserved for fiction) and they live in THIS file, so this file is the one
 * place they are exempt. Found by CI on 2026-09-10: the guard's first local run
 * passed only because this file was not yet tracked, so `git ls-files` never
 * handed the guard to itself. Exempted by exact value and by path, never by
 * loosening PHONE; any other number in this file still fails.
 */
const SELF = 'src/content/no-phone-numbers.test.ts';
const FIXTURES = ['207-555-0142', '(207) 555-0142', '207.555.0142', '+1 207 555 0142', '+1-207-555-0142'];

const BINARY = /\.(png|jpe?g|gif|webp|avif|ico|mp3|mp4|woff2?|ttf|otf|pdf|zip)$/i;

function trackedTextFiles(): string[] {
  const out = execSync('git ls-files -z', { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return out.split('\0').filter((f) => f && !BINARY.test(f) && f !== 'package-lock.json');
}

function phoneHits(text: string): string[] {
  return [...text.matchAll(PHONE)].map((m) => m[0]).filter((hit) => !(hit in ALLOWED));
}

describe('no phone numbers in this public repo (decision 0006)', () => {
  it('has a file list to scan - an empty scan is not a pass', () => {
    // The red side of the harness: if git ls-files silently returned nothing,
    // the check below would pass on zero files.
    expect(trackedTextFiles().length).toBeGreaterThan(100);
  });

  it('matches the shapes a pasted number actually takes', () => {
    for (const shape of FIXTURES) {
      expect(phoneHits(`call ${shape} today`), shape).toHaveLength(1);
    }
    // and not the numbers this repo is full of
    for (const safe of ['2026-09-10', '12:05', '1,452 battles', '$5,000', 'v0.19.0', '4000 x 4000']) {
      expect(phoneHits(safe), safe).toEqual([]);
    }
  });

  it('finds none in any tracked file', () => {
    const files = trackedTextFiles();
    // The guard must be scanning itself, or the exemption below is hiding nothing.
    expect(files).toContain(SELF);
    const offenders = files.flatMap((rel) => {
      let hits = phoneHits(readFileSync(path.join(process.cwd(), rel), 'utf8'));
      if (rel === SELF) {
        const extra = [...hits];
        for (const f of FIXTURES) extra.splice(extra.indexOf(f), extra.includes(f) ? 1 : 0);
        hits = extra;
      }
      return hits.map((h) => `${rel}: ${h}`);
    });
    expect(offenders).toEqual([]);
  });
});
