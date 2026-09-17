# ZAOstock artist-series direction prompt

Zaal, 2026-09-17, his reason verbatim: "we can share more directional info
with the agent." The problem with what we did before (hand the Paragraph AI
agent a finished body to paste): the agent's own rich embed cards and link
previews never got used, because pasted markdown cannot produce them. Every
per-artist edition was hand-written from scratch, eight times. And on the two
times the agent DID rewrite something, it drifted - because it was given
prose to imitate rather than rules to obey.

This file is the fix: one reusable **direction prompt**, not a finished body.
Fill in the named slots for the artist of the day, hand the whole block to
the Paragraph agent (Mode B or Mode C in
`~/.claude/skills/newsletter/SKILL.md`), and let it write - with real embed
cards for the links, which is the entire reason to drive the agent instead of
pasting.

Versioned here, in the repo, on purpose - not in a `/clipboard` clip. A clip
is for one edition. This is infrastructure for all eight (and reused after
the eight, for any future one-artist-at-a-time series).

## Two counts that look alike and are not

This prompt fills two different numbers about "which one is this," and
confusing them is exactly the Day 259 LyonsDen bug (rule 5 below): calling
her both "the second artist revealed" and "the second act locked in" as if
they were the same claim restated, when in fact one of the two source ideas
was never a real second fact to begin with.

- **Running-order position** (`ACT_NUMBER` / `ACT_TOTAL`): where the artist
  falls in the day's playing order. Comes from the artist's own page
  (`setOrder`) and `/program`. **Never print this as a raw "Act N of M" in
  the body** - translate it into what it means for a listener: act 1 opens
  the afternoon, the last act closes the outdoor block before the street
  clears, a middle act is framed by who plays before and after if that is
  known and confirmed on the page.
- **Series publish position** (`SERIES_NUMBER`): how many artists this
  newsletter series has covered, including today's. **This is NOT a fact on
  zaostock.com or /program - the site has no concept of "which newsletter
  edition."** It comes from the newsletter's own publish history (count the
  prior artist-series editions - `~/bin/zao-newsletter-published-check`
  joined against `published/` on `origin/main`, the same mechanism
  `SKILL.md` Step Zero already uses to find the last edition). Whoever fills
  this slot supplies it explicitly; the agent must never infer, guess, or
  recompute it, and the fact gate does not apply to it because it is not a
  zaostock.com fact - it is an editorial fact about the newsletter itself.

State the series position exactly once, in the exact form below. Never say
it two different ways in the same piece, and never imply an artist was
secret, unconfirmed, or held back before this - every published artist
confirmed in writing before their page went up; "publishing" is a release
cadence, not a reveal.

## The prompt

Copy this whole block, fill in every `{SLOT}`, and hand it to the agent.
Nothing in the numbered rules is optional or paraphrasable - restate them in
full every time, because a long rewrite drifts without them (the same
reason `SKILL.md`'s Mode B operating manual insists on restating format
rules on every refinement pass).

```
You are drafting one ZAOstock artist-series newsletter edition for
Paragraph. Follow every rule below exactly. Do not improvise around them.

RULE 1 - THE FACT GATE. Every number, name, date and link in this edition
comes from {ARTIST_NAME}'s own page at {ARTIST_PAGE_URL} and from
https://zaostock.com/program. If a fact is not on one of those two pages,
it does not go in - not from an EPK, not from a DM, not from memory. There
is no per-artist set time anywhere on the site or in the codebase; do not
state or imply one. Confirm every link you use returns 200 before using it.

RULE 2 - THE VOICE. Normal sentence case. Numerals for numbers, not spelled
out. No emojis. No em dashes - use a comma or a period instead. No crypto or
web3 language. Open with "zm" then "year of the zabal day {DAY_NUMBER}" on
its own line. {DAY_NUMBER} is given to you below - never calculate it
yourself, you have no clock. Close with exactly:
"- BetterCallZaal on behalf of the ZABAL Team"

RULE 3 - NEVER WRITE THESE THREE SENTENCES, in any form, in any edition:
  - "It reads the record not your word."
  - "Builders building for builders."
  - "The quiet work compounds."
These have each been inserted into a ZAOstock artist post before and cut
before publishing. If you have produced any of them before, you will
produce them again unless told not to. You are told not to.

RULE 4 - THE MONEY RULE. No dollar amounts anywhere in this edition. No
ticket tiers, no Pro Ticket, no price of any kind. The closing call to
action is exactly this sentence, word for word, nothing added and nothing
removed: "RSVP is free at ticket.zaostock.com so we know how many people to
plan for. If you want to put something behind the day you can donate at
zaostock.com/tickets."

RULE 5 - ONE DESCRIPTION OF WHERE THIS ARTIST STANDS, STATED ONCE. State
{ARTIST_NAME}'s place in the publish series exactly once, in exactly this
form: "Now {he/she/they} is the {SERIES_NUMBER} act we are publishing for
Ellsworth." Do not also describe them as "revealed," "locked in," "the
latest," or any other second phrasing of the same idea anywhere else in the
piece. Never imply any artist was secret or unconfirmed before their page
went up - every artist confirmed in writing first; publishing one at a time
is a release cadence, not a reveal.

RULE 6 - EMBED CARDS, NOT BARE URLS. This is the reason you are being
directed instead of handed finished text: use real embed cards / link
previews for {ARTIST_NAME}'s page and for the /program link, not plain
pasted URLs. That is the whole value of writing through you rather than
pasting markdown.

RULE 7 - SHOW ME THE FULL BODY AND DO NOT PUBLISH. Zaal publishes. Every
draft ends here, with the full body shown, not sent.

THE FACTS FOR TODAY'S ARTIST (verified live before this prompt was written -
do not re-verify by guessing, and do not add any fact not listed here):

  Artist name:              {ARTIST_NAME}
  Artist page:               {ARTIST_PAGE_URL}
  Program link:               https://zaostock.com/program
  Running-order position:     act {ACT_NUMBER} of {ACT_TOTAL}
    -> translate this into what it means for a listener (opens the
       afternoon / closes the outdoor block / etc.), never print "act N
       of M" as a raw fraction
  What makes this artist different from the other seven:
    {DIFFERENTIATOR}
  Artist's own links (use every one, each already checked live):
    {ARTIST_OWN_LINKS}
  Series publish position (see "two counts" above - NOT a zaostock.com
  fact, supplied by the newsletter operator):
    {SERIES_NUMBER}
  Day number (from edition-facts.sh, do not recompute):
    {DAY_NUMBER}

THE FIXED FESTIVAL FACTS (these do not change per artist and are already
verified - restate them, do not alter them):

  ZAOstock is a free music festival on Saturday 3 October, on the Franklin
  Street Parklet in downtown Ellsworth, Maine. One stage, eight acts, noon
  to six. At six the street clears, and Black Moon Public House next door
  hosts its own evening from six. It is part of the 9th annual Art of
  Ellsworth, during Maine Craft Weekend.

  We publish each artist one at a time, and only after they have confirmed
  in writing and sent a bio and a photo. So the page fills slowly, and
  nobody is on it who has not said yes.

Write the body now. Use {ARTIST_NAME}'s bio from their page for the
paragraphs about who they are and what they play - do not invent
descriptive language their own page does not support. Show me the full
body. Do not publish.
```

## Worked example and proof: Tom Fellenz, Day 260

The test case, per Zaal's brief: today's edition, Tom Fellenz, already
staged and fact-checked as clip `zaostock-fellenz-day260-0917`. The clip
stays untouched as the control - this section runs the prompt above against
the same facts and reports where the result would be better, worse, or
drifted from the control, per the ask.

**Facts independently re-verified for this test** (not merely copied from
the clip):

- `bash ~/.claude/skills/newsletter/edition-facts.sh` run live: day of year
  260, matching the clip's "Day 260" claim.
- All six links curled live and independently: `zaostock.com/artist/tom-fellenz`,
  `/program`, `ticket.zaostock.com`, `zaostock.com/tickets`,
  `x.com/fellenzmusic`, `youtube.com/tfellenz/videos` - all 200.
- His page's own data: `"setOrder":8` - act 8 of 8, the last act, matching
  the clip's "closes the outdoor block."
- No per-artist set time anywhere in the page's HTML or structured data -
  the only times present are the event-level `12:00:00` / `18:00:00`
  (noon to six), not a per-act clock.
- His bio on the live page is word-for-word what the clip's draft body
  uses - confirmed via `scripts/reveal-preflight.sh`'s live lineup fetch.
- Series position: `scripts/reveal-preflight.sh` shows Michael Anderson,
  DCoop, LyonsDen and Tom Fellenz all published on the live page as of this
  write. The clip's "third act we are publishing" excludes Michael Anderson
  from the newsletter-series count because he has not yet had a newsletter
  edition written about him - a live page is not the same fact as a
  newsletter edition, exactly the distinction "two counts" above exists to
  keep straight. Taking the clip's own claim (DCoop Day 258, LyonsDen Day
  259) at face value, since this repo cannot independently read Paragraph's
  publish history, `SERIES_NUMBER` = "third."

**Slots filled:**

```
  Artist name:              Tom Fellenz
  Artist page:              https://zaostock.com/artist/tom-fellenz
  Running-order position:   act 8 of 8
  What makes this artist different:
    He closes the outdoor block and plays around an hour of original
    music - an acoustic guitar instrumentalist styled by 70s and 80s
    progressive rock, smooth jazz and acoustic folk, with a cinematic
    quality to his playing.
  Artist's own links:
    X: https://x.com/fellenzmusic
    YouTube: https://www.youtube.com/tfellenz/videos
  Series publish position: third
  Day number: 260
```

**Tracing the rules against this input** (a manual dry run of the prompt's
own instructions against the verified facts above, done here because this
session has no access to invoke the actual Paragraph AI agent - the honest
limit of this proof, noted rather than glossed over):

- Rule 1 (fact gate): every fact above traces to the artist page or
  `/program`, independently reverified, not copied from the clip. Matches
  the control.
- Rule 2 (voice): opener, numerals, no em dash, sign-off all directly
  specified - nothing left for the agent to guess, matching the control's
  voice exactly.
- Rule 3 (ban list): the three banned sentences are named explicitly here
  where the old flow only ever caught them after the fact, twice. This is
  new coverage the control draft did not have going in - it was written by
  a person first, then would have been checked against the agent's rewrite
  only if the agent touched it. The direction prompt puts the ban up front
  instead of relying on a catch after the fact.
- Rule 4 (money): the exact closing sentence is specified word for word,
  matching the control's closing line exactly, including "zaostock.com/tickets"
  rather than any dollar figure.
- Rule 5 (one description): the prompt forces exactly the "Now he is the
  third act we are publishing for Ellsworth" form and forbids a second
  phrasing - this is the rule that would have caught the actual Day 259 bug
  ("second artist revealed" and "second act locked in" both appearing) had
  it existed then. New coverage, not present in the control's own
  generation path.
- Rule 6 (embed cards): this is the one place the direction-prompt approach
  is categorically better than the control, which is plain markdown with
  bare URLs (`https://zaostock.com/artist/tom-fellenz`,
  `https://zaostock.com/program` as literal pasted text). Driving the agent
  through Mode B/C lets it render those as real cards - the whole reason
  this file exists.
- Rule 7 (do not publish): both the control and this prompt agree - Zaal
  publishes.

**Where this could drift, watched for, not yet observed:** the agent still
composes the connecting prose (how the differentiator sentence reads, the
exact transition into "his page, with his bio and his music"). Rules 1-5
constrain the facts and the forbidden phrasings tightly enough that a
drifted sentence should be catchable by eye against the fact list even
without a word-for-word match to the control - but the control is prose
written by a person, and the agent's prose will not be identical to it
sentence-for-sentence. That is expected and fine; identical phrasing was
never the goal, matching facts and voice rules is.

## Reuse

For the next artist, copy the prompt block, fill the seven slots (plus the
running-order and series-position pair), leave the two fixed-facts
paragraphs and the seven rules untouched, and hand it to the agent through
Mode B or Mode C. When all eight artists have run through this once, the
same shape reuses for any future one-subject-at-a-time series (a sponsor
series, a volunteer spotlight) by swapping the fixed festival paragraph.
