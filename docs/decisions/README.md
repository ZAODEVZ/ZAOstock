# Decisions

Dated, numbered, and superseded rather than edited.

## Why this exists

On 24 August 2026 the people map recorded, as Zaal's own decision, that the
virtual lane had **no lead deliberately**: "get people together and let them
suggest the shape", and it said explicitly that the blank was an answer rather
than an oversight.

Four days later the lane had two leads, split by platform.

Both were real decisions. Neither was wrong. But the second one silently
overwrote the first, and the only reason anyone can see that today is that
whoever wrote the newer map noticed and left a note saying "a decision reversed
four days later is worth Zaal seeing rather than quietly overwriting".

That should not depend on someone noticing. A decision that reverses another one
should say so, in a file, with both dates.

## The rules

1. **One decision per file**, numbered `NNNN-short-name.md`. Numbers are never
   reused, even if a decision is later reversed.
2. **Never edit a decided file to change the decision.** Write a new one and set
   `supersedes:` in its front matter. The old file gets `superseded-by:`.
3. **Date and attribute everything.** Who decided, and when. "Zaal, 27 August"
   is worth more than the cleanest possible prose.
4. **Record the ones that stayed open too.** A deliberate blank is a decision,
   and the 24 August entry above is exactly why.

## The log

| # | Decision | Decided | Status |
|---|----------|---------|--------|
| [0001](0001-team-dashboard-retired.md) | The team dashboard is retired, the document is the tool | 2026-08-29, Zaal | active |
| [0002](0002-virtual-lane-has-two-leads.md) | The virtual lane has two leads, split by platform | 2026-08-27, Zaal | active, supersedes an unwritten 24 Aug call |
| [0003](0003-event-slug-aliases.md) | Client event slugs are aliased, never given their own events row | 2026-09-01, Iman | active |

