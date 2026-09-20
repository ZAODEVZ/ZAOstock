import { Metadata } from 'next';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import { FESTIVAL } from '@/content/festival';
import { WATCH_PARTIES, fallbackChannelHref } from '@/content/live';
import { SiteShell, Section, TwoUp, Eyebrow, Button, Card, SectionHeader, Countdown } from '@/components/poster';

export const metadata: Metadata = {
  title: 'Live',
  description: `Watch ZAOstock 2026 from anywhere. The stream, the running order, and every way to follow along on ${FESTIVAL.dateLabel}.`,
  alternates: { canonical: '/live' },
  openGraph: {
    title: 'Live | ZAOstock',
    description: `Watch ZAOstock 2026 from anywhere on ${FESTIVAL.dateLabel}.`,
    url: 'https://zaostock.com/live',
    images: [OG_IMAGE],
  },
  twitter: twitterCard('Live | ZAOstock', `Watch ZAOstock 2026 from anywhere on ${FESTIVAL.dateLabel}.`),
};

// The stream chain (docs/av/livestream-chain-2026-10-03.md) is untested past
// the encoder: no platform, account or ingest is confirmed, and that doc's own
// rule is not to name a platform publicly before a run passes. So this page
// holds the slot without a link or an embed until that test does. Whoever
// lands the confirmed watch link drops it into WATCH_HREF below; nothing else
// on the page needs to change.
const WATCH_HREF: string | null = null;

// EVERYTHING ELSE ON THIS PAGE IS NOT GATED ON THAT TEST, and that is the point
// of the 2026-09-17 pass. Three things were settled on the 15 September round
// two call and none of them had reached the page: who to follow when the stream
// drops, what a watch party actually is, and that the evening is in person.
// A viewer staring at a dead player on 3 October could not learn any of it
// here. See src/content/live.ts for the decisions and their source.

export default function LivePage() {
  const fallbackHref = fallbackChannelHref();

  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Watch from anywhere</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">ZAOstock, live.</h1>
          <p className="text-lg text-ink-secondary measure m-0">
            {FESTIVAL.dateLabel}, {FESTIVAL.window}, from {FESTIVAL.venue} in {FESTIVAL.city}. This page is where the stream plays. Bookmark it.
          </p>
          <Countdown className="mt-4" />
        </div>
      </Section>

      <Section>
        <Card>
          <div className="aspect-video w-full rounded-[10px] border border-dashed border-gold-500/50 bg-paper-200 flex flex-col items-center justify-center gap-2 text-center p-6">
            <span className="font-mono text-eyebrow uppercase tracking-[0.1em] text-ink-muted">Stream not live yet</span>
            <p className="text-sm text-ink-secondary m-0 max-w-[440px]">
              The player goes here once the watch link is confirmed. Check back closer to {FESTIVAL.shortDate}, or on the day itself.
            </p>
            {WATCH_HREF ? (
              <Button href={WATCH_HREF} external className="mt-2">
                Watch now
              </Button>
            ) : null}
          </div>
          {fallbackHref ? (
            <p className="text-sm text-ink-secondary m-0 mt-4">
              <span className="font-sans font-extrabold text-ink-950">If the picture stops on the day,</span> go to the{' '}
              <a href={fallbackHref} target="_blank" rel="noreferrer" className="text-red-700 font-bold">
                Telegram chat
              </a>
              . Somebody on the ground is always in there, and that is where we say what is happening and when it is back.
            </p>
          ) : null}
        </Card>
      </Section>

      <Section>
        <TwoUp>
          <SectionHeader
            eyebrow="How to follow along"
            title="Four ways in, if you can't make the parklet."
            lede="No account or app required for any of them."
          />
          <div className="flex flex-col gap-4">
            <Card>
              <h3 className="font-sans font-extrabold text-h4 text-ink-950 m-0">On this page</h3>
              <p className="text-sm text-ink-secondary m-0 mt-2">The stream plays here for the full window, {FESTIVAL.window}. No sign-up.</p>
            </Card>
            <Card>
              <h3 className="font-sans font-extrabold text-h4 text-ink-950 m-0">At a watch party</h3>
              <p className="text-sm text-ink-secondary m-0 mt-2">
                There is no single format. One channel carries clean event audio, and every host takes that audio and does their own thing
                over it, in their own room, for their own people.{' '}
                {WATCH_PARTIES.length === 0
                  ? 'The full list of places to watch goes out on the day itself.'
                  : 'Running so far:'}
              </p>
              {WATCH_PARTIES.length > 0 ? (
                <ul className="list-disc pl-5 m-0 mt-3 text-sm text-ink-950 flex flex-col gap-1">
                  {WATCH_PARTIES.map((party) => (
                    <li key={party.href}>
                      <a href={party.href} target="_blank" rel="noreferrer" className="text-red-700 font-bold">
                        {party.host}
                      </a>
                      , {party.where}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Card>
            <Card>
              <h3 className="font-sans font-extrabold text-h4 text-ink-950 m-0">Host one yourself</h3>
              <p className="text-sm text-ink-secondary m-0 mt-2">
                Take the audio, put it in your room, talk over it however you like. Nobody has to ask. Tell us it is happening and it goes on
                the list that goes out on the day.
              </p>
            </Card>
            <Card>
              <h3 className="font-sans font-extrabold text-h4 text-ink-950 m-0">In Ellsworth</h3>
              <p className="text-sm text-ink-secondary m-0 mt-2">
                The real thing is free and all ages at {FESTIVAL.venue}. See the <a href="/program" className="text-red-700 font-bold">program</a> and the{' '}
                <a href="/artists" className="text-red-700 font-bold">lineup</a>.
              </p>
            </Card>
          </div>
        </TwoUp>
      </Section>

      <Section>
        <Card>
          <Eyebrow>After six</Eyebrow>
          <p className="text-sm text-ink-secondary m-0 mt-2">
            The stream runs with the parklet. When the music outdoors finishes, the day moves next door to Black Moon Public House for the
            after-party, and that part is in person only. See the <a href="/program" className="text-red-700 font-bold">program</a> for how the
            day runs.
          </p>
        </Card>
      </Section>
    </SiteShell>
  );
}
