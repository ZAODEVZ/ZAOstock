import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FESTIVAL } from '@/content/festival';
import { SITE } from '@/content/site';
import {
  ARTIST_DATES,
  BRING,
  PROVIDED,
  SOUNDCHECK,
  addMinutes,
  clock12,
  findActByCode,
} from '@/content/artist-ops';
import { SiteShell, Section, SectionHeader, Eyebrow, Card, BorderedList } from '@/components/poster';
import { ArtistForm } from '../ArtistForm';

// One page per act. The code in the URL gates THIS page only; the form on it is
// public and also lives at /backstage with no code. See src/content/artist-ops.ts.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Backstage | ZAOstock',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ code: string }>;
}

export default async function BackstagePage({ params }: Props) {
  const { code } = await params;
  const act = findActByCode(code);
  if (!act) notFound();

  const setEnd = addMinutes(act.setStart, act.minutes);

  return (
    <SiteShell>
      <Section first className="pt-10 sm:pt-14">
        <div className="max-w-[760px] space-y-6" data-backstage-act={act.key}>
          <SectionHeader
            as="h1"
            eyebrow={`Backstage - for ${act.name}`}
            title="You are on the bill."
            lede={`ZAOstock, ${FESTIVAL.dateLabel}, at the ${FESTIVAL.venue} in downtown ${FESTIVAL.city}. This page is yours: your set, the weekend, and what to bring. Please do not share the link.`}
          />

          <Card>
            <Eyebrow className="mb-2">Your set</Eyebrow>
            <p className="text-xl font-extrabold text-ink-950 m-0">
              {clock12(act.setStart)} to {clock12(setEnd)}, {act.minutes} minutes
            </p>
            <p className="text-sm text-ink-secondary mt-2 mb-0">
              On the parklet stage, Saturday 3 October. Soundcheck is {SOUNDCHECK.day}, {SOUNDCHECK.window}. Your time is
              locked; you do not need to tell us it.
            </p>
          </Card>

          <Card>
            <ArtistForm act={act} />
          </Card>

          <Card>
            <Eyebrow className="mb-3">The weekend</Eyebrow>
            <BorderedList rows={ARTIST_DATES.map((d) => ({ term: d.when, detail: d.what }))} />
          </Card>

          <Card>
            <Eyebrow className="mb-3">What to bring</Eyebrow>
            <ul className="text-sm text-ink-secondary m-0 pl-5 space-y-2">
              {BRING.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <Eyebrow className="mt-6 mb-3">What is there for you</Eyebrow>
            <ul className="text-sm text-ink-secondary m-0 pl-5 space-y-2">
              {PROVIDED.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <Eyebrow className="mb-2">About the day</Eyebrow>
            <p className="text-sm text-ink-secondary m-0">
              ZAOstock is a free, one-day music festival built by artists, part of the {SITE.series} during{' '}
              {SITE.weekend}. One stage, nothing overlaps, so every set has the whole crowd. {SITE.weather}{' '}
              {SITE.producedBy}
            </p>
            <p className="text-sm text-ink-secondary mt-3 mb-0">
              {/* There is no reveal day (Zaal, 2026-09-10). "In it", not "on it": the
                  lineup is already the names on the site; the form puts you in the posts. */}
              Every artist gets their own post with their bio and photo, and the order follows who sends their details
              first. The form is what puts you in it.
            </p>
            <p className="text-sm text-ink-secondary mt-3 mb-0">
              Anything at all: <a href={`mailto:${SITE.contact}`} className="underline">{SITE.contact}</a>.
            </p>
          </Card>
        </div>
      </Section>
    </SiteShell>
  );
}
