import { describe, it, expect } from 'vitest';
import { stripComments, extractField } from './check-fact-dedup.mjs';

/**
 * stripComments() drops comment-only lines so a comment naming a fact for
 * its own sake doesn't count as rendered copy. Found 2026-09-27 (Dotfiles,
 * reviewing #356): when a JSX comment closes mid-line and a real component
 * follows on the same line, the whole line was dropped, comment and
 * trailing rendered code together. That is exactly the rendered-copy case
 * this check exists to catch, so a fact sitting right after the comment's
 * close on the same line was invisible to it.
 */
describe('stripComments keeps content that follows a mid-line comment close', () => {
  it('keeps trailing code when a single-line JSX comment closes and more follows', () => {
    const stripped = stripComments('{/* comment */} eight acts');
    expect(stripped).toContain('eight acts');
  });

  it('keeps trailing code when a multi-line JSX comment closes and more follows on its last line', () => {
    const stripped = stripComments('{/* start\ncontinuation */} eight acts');
    expect(stripped).toContain('eight acts');
  });

  it('still drops a multi-line JSX comment with nothing trailing its close', () => {
    const stripped = stripComments('{/* start\ncontinuation */}\nnormal code');
    expect(stripped).not.toContain('start');
    expect(stripped).not.toContain('continuation');
    expect(stripped).toContain('normal code');
  });

  it('leaves ordinary code untouched', () => {
    expect(stripComments('const eight = "acts";')).toBe('const eight = "acts";');
  });

  it('still drops a // line comment and a JSDoc-style /* */ block in full', () => {
    const stripped = stripComments('// eight acts\n/**\n * eight acts\n */\nconst x = 1;');
    expect(stripped).not.toContain('eight acts');
    expect(stripped).toContain('const x = 1;');
  });
});

/**
 * extractField() is a regex over the raw source text of festival.ts, and it
 * used to match only a SINGLE-quoted value. That made this check's coverage a
 * function of a formatting choice nobody made on purpose: the day
 * `eslint --fix` reformatted those literals to double quotes - exactly what it
 * does to a file it touches - `check:facts` kept printing "clean" while
 * enforcing nothing.
 *
 * The measured control against origin/main @ 6a9d737, with six facts planted
 * as literals on /program and the script re-run in both states:
 *
 *   festival.ts as committed (single quotes) -> 6 found, exit 1
 *   the same literals, double quotes        -> 1 found, exit 1
 *
 * Five of six facts stopped being checked, and no line of the output said so.
 * These cases pin both quote styles so neither can be dropped again.
 */
describe('extractField reads a fact regardless of quote style', () => {
  it('reads a single-quoted value', () => {
    expect(extractField("  venue: 'Franklin Street Parklet',", 'venue')).toBe('Franklin Street Parklet');
  });

  it('reads a double-quoted value - the case that silently disabled the check', () => {
    expect(extractField('  venue: "Franklin Street Parklet",', 'venue')).toBe('Franklin Street Parklet');
  });

  it('reads a value containing spaces and a dash without truncating it', () => {
    expect(extractField('  window: "12 PM - 6 PM",', 'window')).toBe('12 PM - 6 PM');
  });

  it('returns null for a key that is not present at all', () => {
    expect(extractField("  city: 'Ellsworth, Maine',", 'venue')).toBeNull();
  });

  it('does not satisfy `venue` from a longer key that ends in it', () => {
    // \b anchors on a word boundary, so `shortVenue` must never be read as
    // `venue` - a false positive here would report one fact's value as
    // another's and send a contributor to the wrong import.
    expect(extractField("  shortVenue: 'Franklin St Parklet',", 'venue')).toBeNull();
  });

  it('reads the FESTIVAL literal object value, not the type declaration above it', () => {
    const src = [
      'type Festival = {',
      '  venue: string;',
      '};',
      'export const FESTIVAL: Festival = {',
      "  venue: 'Franklin Street Parklet',",
      '};',
    ].join('\n');
    expect(extractField(src, 'venue')).toBe('Franklin Street Parklet');
  });

  it('returns null for a backtick template literal, so the check fails closed rather than passing quietly', () => {
    // Backticks were never handled and still are not. What matters is that
    // the failure is now LOUD: loadFacts() records the fact as missing and
    // main() exits 2 with UNKNOWN, instead of reporting a clean run.
    expect(extractField('  venue: `Franklin Street Parklet`,', 'venue')).toBeNull();
  });
});
