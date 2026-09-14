import { describe, expect, it } from 'vitest';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';

// Decision 0006 says no phone numbers AND no email addresses in this public
// repo. Only the phone half was ever guarded. Found 2026-09-14 by measuring
// rather than assuming: `gh repo view` says PUBLIC, and four tracked files
// carried a real address, three of them an insurance broker's work email. He
// never agreed to appear in a public repo.
//
// This is the email half, deliberately written as a near-copy of
// no-phone-numbers.test.ts. Two guards that read the same are two guards a
// person can check at a glance; a clever shared abstraction would be one more
// thing to be wrong.
//
// Keep it narrow, same as its sibling. A legitimate address goes in ALLOWED by
// exact value with its reason, never by loosening EMAIL. A broad guard gets
// deleted the first time it cries wolf.
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

/**
 * Addresses that may appear, each with its reason.
 *
 * `info@thezao.com` is the whole point of a public contact address. The
 * `.invalid` one is a reserved TLD that can never resolve, and the file it sits
 * in describes it as fabricated. Zaal's own address is the repo owner's
 * commit-author identity: it is already in the metadata of every commit he
 * signs, so redacting it from a doc that tells a session what to set as author
 * would break the instruction and hide nothing.
 *
 * No third party's address belongs here. If someone else's turns up, the answer
 * is to remove it, not to add a line below.
 */
const ALLOWED: Record<string, string> = {
  'zaalp99@gmail.com': "the owner's own commit-author identity, already in the metadata of every commit he signs; redacting the line that tells a session what to set as author would break the instruction and hide nothing",
  'you@somewhere.com': 'a placeholder shown inside a form input on /musicians/rider, reaches nobody',
};

/**
 * The org's own domain is allowed as a pattern, not case by case. What decision
 * 0006 protects is OTHER PEOPLE: an artist, a broker, a vendor who never agreed
 * to appear in a public repo. An address at thezao.com is the org publishing a
 * way to reach itself, which is the opposite of that.
 *
 * `.invalid` is reserved by RFC 2606 and can never resolve, so a string ending
 * in it is incapable of reaching anyone.
 */
const ALLOWED_DOMAINS = /@(thezao\.com|zaostock\.com|example\.(com|org|net))$|\.invalid$/i;

/**
 * Shape fixtures, and the strings that must NOT match. They live in THIS file,
 * so this file is where they are exempt - the same trap the phone guard fell
 * into on 2026-09-10, when its first local run passed only because the file was
 * untracked and `git ls-files` never handed the guard to itself. Exempt by
 * exact path, never by loosening EMAIL: any OTHER address in this file fails.
 */
const SELF = 'src/content/no-emails.test.ts';
const FIXTURES = [
  'someone@a-real-agency.com',
  'first.last+tag@sub.domain.co.uk',
  'BOOKING@Venue.NET',
];
const NOT_EMAILS = [
  '@types/node',
  'next@15.0.0',
  'a@b',
  'twitter @zaostock',
  'user@ but nothing after',
];

const BINARY = /\.(png|jpe?g|gif|webp|avif|ico|mp3|mp4|woff2?|ttf|otf|pdf|zip)$/i;

function trackedTextFiles(): string[] {
  const out = execSync('git ls-files -z', { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return out.split('\0').filter((f) => f && !BINARY.test(f) && f !== 'package-lock.json');
}

function emailHits(text: string): string[] {
  return [...text.matchAll(EMAIL)]
    .map((m) => m[0])
    .filter((hit) => !(hit.toLowerCase() in ALLOWED) && !ALLOWED_DOMAINS.test(hit));
}

describe('no email addresses in this public repo (decision 0006)', () => {
  it('has a file list to scan - an empty scan is not a pass', () => {
    // The red side of the harness. If git ls-files silently returned nothing,
    // the real check would pass on zero files and report success.
    expect(trackedTextFiles().length).toBeGreaterThan(100);
  });

  it('matches the shapes a pasted address actually takes, and nothing else', () => {
    for (const shape of FIXTURES) {
      expect(emailHits(`write to ${shape} today`), shape).toHaveLength(1);
    }
    for (const safe of NOT_EMAILS) {
      expect(emailHits(safe), safe).toEqual([]);
    }
  });

  it('scans itself, so its own fixtures cannot hide a real address', () => {
    expect(trackedTextFiles()).toContain(SELF);
  });

  it('finds no address in any tracked file', () => {
    const files = trackedTextFiles();
    const offenders = files.flatMap((rel) => {
      // This file's fixtures are exempt by path; anything else in it is not.
      const hits = emailHits(readFileSync(path.join(process.cwd(), rel), 'utf8'));
      const real = rel === SELF ? hits.filter((h) => !FIXTURES.includes(h)) : hits;
      return real.map((hit) => `${rel}: ${hit.replace(/^(..).*@/, '$1***@')}`);
    });
    expect(
      offenders,
      offenders.length
        ? `A public repo must carry no email address (decision 0006). Move it to the vault and leave a pointer.\n${offenders.join('\n')}`
        : '',
    ).toEqual([]);
  });
});
