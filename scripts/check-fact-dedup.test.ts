import { describe, it, expect } from 'vitest';
import { stripComments } from './check-fact-dedup.mjs';

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
