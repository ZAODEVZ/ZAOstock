import { describe, it, expect } from 'vitest';
import { nextAct } from './act-nav';

const ROSTER = [{ slug: 'the-crown-vics' }, { slug: 'open-x' }, { slug: 'tom-fellenz' }];

describe('nextAct', () => {
  it('returns the following act', () => {
    expect(nextAct(ROSTER, 'the-crown-vics')?.slug).toBe('open-x');
  });

  it('wraps from the last act to the first', () => {
    expect(nextAct(ROSTER, 'tom-fellenz')?.slug).toBe('the-crown-vics');
  });

  it('returns null for an act not on the roster', () => {
    expect(nextAct(ROSTER, 'not-an-act')).toBeNull();
  });

  it('returns null when the act is the only one, rather than linking to itself', () => {
    expect(nextAct([{ slug: 'open-x' }], 'open-x')).toBeNull();
  });
});
