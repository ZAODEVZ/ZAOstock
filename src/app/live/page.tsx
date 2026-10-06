import { Metadata } from 'next';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import { FESTIVAL } from '@/content/festival';
import { WATCH_PARTIES, fallbackChannelHref, replaysHref } from '@/content/live';
import { getPublicLineup } from '@/lib/lineup';
import { slugify } from '@/lib/artists';
import { displayName } from '@/content/site';
import { SiteShell, Section, TwoUp, Eyebrow, Card, SectionHeader, Button, BUTTON_BASE, BUTTON_VARIANT, BUTTON_SIZE } from '@/components/poster';
import { ShareButton } from '@/components/ShareButton';
import { ReplayPlayer } from '@/components/ReplayPlayer';
import { EventJsonLd } from '@/components/EventJsonLd';

export const metadata: Metadata = {
  title: `Watch live, ${FESTIVAL.shortDate}, noon to 6 PM Eastern`,
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

// The running order is read straight from Supabase at render, not through the
// lineup API, so without this the page is prerendered and a day-of lineup
// correction would reach /live only on the next deploy. 60s ISR (Zaal,
// 2026-09-27, board #137). Artists are confirmed by hand DB write, so there is
// no confirm hook to call revalidatePath from.
export const revalidate = 60;

export default async function LivePage() {
  const fallbackHref = fallbackChannelHref();
  const lineup = await getPublicLineup('zaostock');
  // Names and order only - never the clock. Zaal, 2026-09-12: "no set times
  // listed publicly. Not on the site, not in posts, not in the reveal copy."
  // src/content/program.ts is the one place that rule is spelled out in full.
  const acts = lineup.artists;

  return (
    <SiteShell>
      <EventJsonLd />
      {/* AFTER THE DAY (was the festival-day layout). Zaal, 2026-10-03, at the venue: "lets add more cta
          buttons on the live page and less whitepspace". The player now sits in
          the first section, straight under a short heading, so on a 390px phone
          it is on the first screen; the action buttons sit right under it. The
          calendar buttons and the countdown are gone from the top: it is today. */}
      <Section first className="pt-6 sm:pt-10">
        <Eyebrow tone="denim">Thank you for watching</Eyebrow>
        <h1 className="font-display font-normal text-[2.25rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-2 mb-2">The stream has ended.</h1>
        <p className="text-base sm:text-lg text-ink-secondary measure m-0 mb-3">
          ZAOstock streamed live on {FESTIVAL.dateLabel} from {FESTIVAL.venue} in {FESTIVAL.city}. The whole day is recorded below, in six parts.
        </p>
        <div id="replay">
          <ReplayPlayer />
        </div>
        {/* Watching from home has no other way to give. Zaal, 2026-09-27:
            "we deff need a place for ppl to just go to the live website
            and one button is the donate button." Label matches /tickets since
            2026-09-30: "something there for supporting the artists". */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button href="/tickets" variant="primary" size="sm">
            Support the artists
          </Button>
          <Button href={replaysHref()} external variant="secondary" size="sm">
            All parts on Twitch
          </Button>
          <Button href="/afterparty" variant="secondary" size="sm">
            After-party
          </Button>
          <Button href="/media" variant="secondary" size="sm">
            Press and radio
          </Button>
          <Button href="/feedback" variant="secondary" size="sm">
            How was it? Tell us
          </Button>
          <ShareButton
            url="https://zaostock.com/live"
            title="ZAOstock, live from Ellsworth, Maine"
            className={`${BUTTON_BASE} ${BUTTON_VARIANT.secondary} ${BUTTON_SIZE.sm}`}
          />
        </div>
        <p className="text-sm text-ink-secondary m-0 mt-3">
          <span className="font-sans font-extrabold text-ink-950">Nothing playing?</span> The live stream is offline now that the day is over; the recording above
          plays from Twitch, which keeps past broadcasts for a limited time.
        </p>
        {fallbackHref ? (
          <p className="text-sm text-ink-secondary m-0 mt-2">
            <span className="font-sans font-extrabold text-ink-950">If the picture stops on the day,</span> go to the{' '}
            <a href={fallbackHref} target="_blank" rel="noreferrer" className="text-red-700 font-bold">
              Telegram chat
            </a>
            . Somebody on the ground is always in there, and that is where we say what is happening and when it is back.
          </p>
        ) : null}
      </Section>

      <Section id="watch-parties">
        <TwoUp>
          <SectionHeader
            eyebrow="How to follow along"
            title="Four ways in, for anyone who could not make the parklet."
            lede="No account needed to watch."
          />
          <div className="flex flex-col gap-4">
            <Card>
              <h3 className="font-sans font-extrabold text-h4 text-ink-950 m-0">On this page</h3>
              <p className="text-sm text-ink-secondary m-0 mt-2">The stream played here for the full window, {FESTIVAL.window}. No sign-up.</p>
            </Card>
            <Card>
              <h3 className="font-sans font-extrabold text-h4 text-ink-950 m-0">At a watch party</h3>
              <p className="text-sm text-ink-secondary m-0 mt-2">
                There is no single format. One channel carries clean event audio, and every host takes that audio and does their own thing
                over it, in their own room, for their own people.{' '}
                {WATCH_PARTIES.length === 0
                  ? 'The full list of places to watch goes out on the day itself.'
                  : 'On the list:'}
              </p>
              {WATCH_PARTIES.length > 0 ? (
                <ul className="list-disc pl-5 m-0 mt-3 text-sm text-ink-950 flex flex-col gap-1">
                  {WATCH_PARTIES.map((party) => (
                    <li key={party.host}>
                      {party.href ? (
                        <a href={party.href} target="_blank" rel="noreferrer" className="text-red-700 font-bold">
                          {party.host}
                        </a>
                      ) : (
                        <span className="font-bold">{party.host}</span>
                      )}
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
            eyebrow="The lineup"
            title="Every act on the bill, in running order."
            lede="Each act has its own page with a bio and links."
          />
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 list-none pl-0 m-0">
            {acts.map((act, i) => {
              const slug = slugify(act.name);
              return (
                <li key={act.id}>
                  <Card className="flex items-center gap-3">
                    <span className="font-mono text-eyebrow text-ink-muted w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <div className="min-w-0">
                      <a href={`/artist/${slug}`} className="font-sans font-extrabold text-ink-950 hover:text-red-700 truncate block">
                        {displayName(act.name)}
                      </a>
                      {/* Zaal, 2026-09-26: point every act at its own ZAOstock
                          page rather than scattering external social links here -
                          that page (ArtistProfileView.tsx) is where all of an
                          act's socials already render. */}
                      <a href={`/artist/${slug}`} className="text-sm text-red-700 font-bold truncate block">
                        zaostock.com/artist/{slug}
                      </a>
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
            The stream ran with the parklet. When the music outdoors finished, the day moved next door to Black Moon Public House for the
            after-party, and that part was in person only, so it is not in the recording. See the <a href="/afterparty" className="text-red-700 font-bold">after-party page</a>.
          </p>
        </Card>
      </Section>
    </SiteShell>
  );
}
