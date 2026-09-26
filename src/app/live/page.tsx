import { Metadata } from 'next';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import { FESTIVAL } from '@/content/festival';
import { WATCH_PARTIES, fallbackChannelHref, watchHref, embedSrc } from '@/content/live';
import { getPublicLineup } from '@/lib/lineup';
import { slugify } from '@/lib/artists';
import { SiteShell, Section, TwoUp, Eyebrow, Card, SectionHeader, Countdown, AddToCalendar, LocalStartTime } from '@/components/poster';

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

// The stream test passed 2026-09-25 (Fellenz's software chain) and Zaal named
// the platform: Twitch, channel zaofestivals. See src/content/live.ts for the
// verification, the source quote, and the hard rule that the stream KEY never
// enters this repo - only the channel name, which is public.

// EVERYTHING BELOW THE PLAYER IS NOT GATED ON THAT TEST, and that is the point
// of the 2026-09-17 pass. Three things were settled on the 15 September round
// two call and none of them had reached the page: who to follow when the stream
// drops, what a watch party actually is, and that the evening is in person.
// A viewer staring at a dead player on 3 October could not learn any of it
// here. See src/content/live.ts for the decisions and their source.

export default async function LivePage() {
  const fallbackHref = fallbackChannelHref();
  const lineup = await getPublicLineup('zaostock');
  // Names and order only - never the clock. Zaal, 2026-09-12: "no set times
  // listed publicly. Not on the site, not in posts, not in the reveal copy."
  // src/content/program.ts is the one place that rule is spelled out in full.
  const acts = lineup.artists;

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
          <LocalStartTime className="mt-1" />
          <AddToCalendar className="mt-4" />
        </div>
      </Section>

      <Section>
        <Card>
          <div className="aspect-video w-full rounded-[10px] overflow-hidden bg-black">
            <iframe
              src={embedSrc()}
              className="w-full h-full"
              allowFullScreen
              title="ZAOstock live on Twitch"
            />
          </div>
          <p className="text-sm text-ink-secondary m-0 mt-3">
            <span className="font-sans font-extrabold text-ink-950">Nothing playing?</span> The stream is offline outside{' '}
            {FESTIVAL.window} on {FESTIVAL.dateLabel} - that is expected before doors and after the outdoor block ends, not a broken
            player. (One exception: this same channel also carries a pre-party stream today, Saturday 26 September, 4 to 6 PM Eastern.)
            Twitch shows its own offline screen either way, or watch straight from{' '}
            <a href={watchHref()} target="_blank" rel="noreferrer" className="text-red-700 font-bold">
              Twitch
            </a>{' '}
            directly.
          </p>
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

      {acts.length > 0 ? (
        <Section>
          <SectionHeader
            eyebrow="Who's on"
            title="Follow along with each act, in order."
            lede="No set times here - see the program for the shape of the day. This is who's playing, in the order they play."
          />
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 list-none pl-0 m-0">
            {acts.map((act, i) => {
              const links = (act.socials ?? '').trim().split(/\s+/).filter(Boolean);
              return (
                <li key={act.id}>
                  <Card className="flex items-center gap-3">
                    <span className="font-mono text-eyebrow text-ink-muted w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <div className="min-w-0">
                      <a href={`/artist/${slugify(act.name)}`} className="font-sans font-extrabold text-ink-950 hover:text-red-700 truncate block">
                        {act.name}
                      </a>
                      {links.length > 0 ? (
                        <div className="flex flex-wrap gap-x-2 text-sm">
                          {links.map((href) => (
                            <a key={href} href={href} target="_blank" rel="noreferrer" className="text-red-700 font-bold truncate">
                              {href.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ol>
        </Section>
      ) : null}

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
