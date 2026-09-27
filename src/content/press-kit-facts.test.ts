import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { SITE } from './site';

/**
 * THE PRESS KIT CANNOT DRIFT FROM THE WEATHER LINE OR THE RSVP DOOR.
 *
 * Same structural reason as press-kit-lineup.test.ts and
 * press-kit-partners.test.ts: `docs/marketing/press-kit.md` is static
 * markdown and cannot import `SITE` or `FESTIVAL`, so nothing stops it
 * silently disagreeing with the live site.
 *
 * Both rows drifted for real. The Weather row still read "under tent cover
 * from Wallace Events" after Zaal killed that exact framing 2026-09-24 (it
 * promises the tent is the bad-weather answer; the room next door is) - the
 * app pages were fixed, this one was not. The RSVP row printed
 * ticket.zaostock.com - the raw Luma redirect - to journalists, the same
 * funnel-skip class of bug fixed across the app in #350/#351: a PR (#355)
 * already fixed src/lib/press-kit.ts's fallback PLACEHOLDER_MARKDOWN, which
 * is invisible whenever the real file exists, and it always does. Found by
 * Poidhz with a live watcher that reported STILL-OLD after seventeen
 * minutes rather than going quiet.
 */

const KIT = path.join(process.cwd(), 'docs/marketing/press-kit.md');
const text = () => readFileSync(KIT, 'utf8');

describe('press kit facts', () => {
  it('quotes the live weather line verbatim, not a paraphrase of it', () => {
    const md = text();
    expect(
      md.includes(SITE.weather),
      `\nThe press kit's Weather row does not contain SITE.weather verbatim.\n` +
        `Quote it exactly - a paraphrase can carry the same false claim a\n` +
        `differently-worded line already got killed for. SITE.weather is:\n` +
        `  "${SITE.weather}"\n`,
    ).toBe(true);
  });

  it('never promises the tent is the bad-weather answer', () => {
    // Killed 2026-09-24 (Zaal): pairing "rain or shine" with tent cover
    // implies the tent is what makes bad weather fine. It is not - the room
    // next door is. See src/app/program/page.tsx's GOOD_TO_KNOW comment.
    const md = text().toLowerCase();
    expect(md.includes('under tent cover')).toBe(false);
  });

  it('sends journalists to /tickets, never the raw ticket.zaostock.com redirect', () => {
    // Same class as #350/#351: a bare ticket.zaostock.com 302s straight to
    // Luma and skips the Pro Ticket funnel entirely. /tickets is the door.
    const md = text();
    expect(md.includes('ticket.zaostock.com')).toBe(false);
    expect(md.includes('zaostock.com/tickets')).toBe(true);
  });
});
