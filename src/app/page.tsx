import { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import Image from 'next/image';
import Link from 'next/link';
import { FESTIVAL } from '@/content/festival';
import { SITE, DAY, PUBLIC_LINEUP, WAVEWARZ, PARTNERS, SERIES, ELLSWORTH } from '@/content/site';
import { SiteShell, Section, TwoUp, Eyebrow, Button, Badge, Card, Stat, SectionHeader, InfoStrip, BorderedList, PartnerTile } from '@/components/poster';

// The one link that goes in the email. Seven sections, in the order
// docs/design/redesign-2026-08-28.md sets, and no eighth. Reads nothing from
// the database, so it prerenders and needs no env to render.
//
// Overrides relayed to SITE on 2026-08-27 that beat the spec: Lyons Den is
// the only public act (Werb not fully confirmed, 20:4x); no changeover DJ
// (20:0x); DJ set 6-8 then a live set 8-10 hosted by Black Moon (ros-v7); the
// attendance figure is on /sponsor only (28 Aug brief), not here.

export const metadata: Metadata = {
  title: { absolute: 'ZAOstock 2026 | Free music festival, Ellsworth, Maine' },
  description:
    'A free, one-day, artist-built music festival on Franklin Street, downtown Ellsworth, Maine. Saturday 3 October 2026. Independent artists, one stage, music from noon.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'ZAOstock 2026',
    description: 'A free, one-day, artist-built music festival on Franklin Street, downtown Ellsworth, Maine. Saturday 3 October 2026.',
    url: 'https://zaostock.com',
    images: [OG_IMAGE],
  },
};

const STRIP = [
  { label: 'Date', value: 'Sat 3 Oct 2026' },
  { label: 'Place', value: FESTIVAL.shortVenue },
  { label: 'Music from', value: SITE.musicFrom },
  { label: 'Cost', value: 'Free' },
] as const;

const DOORS = [
  {
    eyebrow: 'For musicians',
    title: 'Made music nobody is paying you to make?',
    body: 'Submit for the lineup. A real stage, a real crowd, a full recording of your set.',
    href: '/musicians',
  },
  {
    eyebrow: 'For visual artists',
    title: 'Build the visual identity people remember.',
    body: 'Posters, motion, signage. Named credit on every surface it appears on.',
    href: '/artists',
  },
  {
    eyebrow: 'For volunteers',
    title: 'Build the day with us.',
    body: 'Setup, check-in, stage crew, content, teardown. On-site gear and a meal.',
    href: '/apply',
  },
] as const;

export default function HomePage() {
  return (
    <SiteShell>
      {/* 1. Hero */}
      <Section first className="pt-12 sm:pt-16 pb-12 sm:pb-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:gap-16 items-center">
          <div>
            <Eyebrow tone="denim">Community music festival · Ellsworth, Maine</Eyebrow>
            <h1 className="font-display font-normal text-display m-0 mt-3.5 mb-4 text-ink-950">
              ZAO<span className="text-gold-600">stock</span>
            </h1>
            <p className="text-lg text-ink-secondary max-w-[620px] m-0 mb-1.5">
              A free, one-day, artist-built music festival on Franklin Street, downtown Ellsworth, Maine.
            </p>
            <p className="text-lg font-bold text-ink-950 max-w-[620px] m-0 mb-7">
              Independent artists. One stage. Music from noon.
            </p>
            <InfoStrip items={STRIP} className="mb-8" />
            <div className="flex flex-wrap gap-3">
              <Button href={FESTIVAL.rsvpUrl} external size="lg">
                RSVP free
              </Button>
              <Button href="/program" variant="secondary" size="lg">
                See the program
              </Button>
            </div>
            <p className="mt-3.5 text-[13px] text-ink-muted m-0">{SITE.weather}</p>
          </div>
          <Image
            src={SITE.badge.src}
            alt={SITE.badge.alt}
            width={SITE.badge.width}
            height={SITE.badge.height}
            sizes="(min-width: 1024px) 360px, 320px"
            priority
            className="w-full max-w-[320px] mx-auto lg:max-w-none rounded-lg border-[2.5px] border-ink-950 shadow-hard-lg"
          />
        </div>
      </Section>

      {/* 2. The day */}
      <Section id="day">
        <TwoUp>
          <SectionHeader
            eyebrow="The day"
            title="Outside, then in."
            lede="One venue at a time. At six the whole street walks next door."
          />
          <div className="flex flex-col gap-4">
            <BorderedList
              mono
              rows={DAY.map((d) => ({
                term: d.time,
                detail: (
                  <span>
                    <span className="block">{d.where}</span>
                    <span className="block text-ink-secondary font-normal">{d.what}</span>
                  </span>
                ),
              }))}
            />
            <Link href="/program" className="text-denim-400 font-semibold underline underline-offset-4 hover:text-denim-500 self-start">
              The full program
            </Link>
          </div>
        </TwoUp>
      </Section>

      {/* 3. Lineup */}
      <Section id="lineup">
        <TwoUp>
          <SectionHeader
            eyebrow="The lineup"
            title="Independent artists. One stage."
            lede={`${PUBLIC_LINEUP.join(' and ')} ${PUBLIC_LINEUP.length === 1 ? 'is' : 'are'} confirmed. The full lineup is announced on ${SITE.lineupRevealLabel}.`}
          />
          <div className="flex flex-col gap-4">
            <BorderedList
              rows={[
                { term: 'Confirmed so far', detail: PUBLIC_LINEUP.join(', ') },
                { term: 'WaveWarZ', detail: `${WAVEWARZ.battlers.join(', ')}. ${WAVEWARZ.mc} on the mic` },
                { term: 'Between sets', detail: 'Our MC and our partners' },
              ]}
            />
            <div>
              <Badge tone="gold">Lineup reveal · {SITE.lineupRevealLabel}</Badge>
            </div>
          </div>
        </TwoUp>
      </Section>

      {/* 4. Why Ellsworth */}
      <Section id="ellsworth">
        <TwoUp>
          <div className="flex flex-col gap-6">
            <SectionHeader
              eyebrow="Why Ellsworth"
              title="Every car heading to Acadia passes through."
              lede={`Over four million people drove through in 2025. ${ELLSWORTH.historic} Part of the ${SITE.series} during ${SITE.weekend}.`}
            />
            <div className="flex flex-wrap gap-10">
              <Stat value={ELLSWORTH.driveThrough.value} label={ELLSWORTH.driveThrough.label} />
              <Stat value={ELLSWORTH.artOfEllsworth.value} label={ELLSWORTH.artOfEllsworth.label} />
            </div>
          </div>
          <Card className="p-0">
            <div className="flex items-center justify-center bg-paper-100 py-6 border-b-2 border-ink-950">
              <Image src={SITE.icons.lighthouse} alt="" width={220} height={220} style={{ height: 110, width: 'auto' }} />
            </div>
            <div className="p-5">
              <Eyebrow>Ellsworth · Maine</Eyebrow>
              <p className="font-sans font-extrabold text-lg text-ink-950 m-0 mt-1.5 mb-1">{FESTIVAL.shortVenue}</p>
              <p className="text-[13px] text-ink-muted m-0">Downtown, at the gateway to Acadia National Park.</p>
              <Link href="/ellsworth" className="inline-block mt-3 text-sm text-denim-400 font-semibold underline underline-offset-4 hover:text-denim-500">
                Getting here
              </Link>
            </div>
          </Card>
        </TwoUp>
      </Section>

      {/* 5. Doors */}
      <Section id="doors">
        <SectionHeader eyebrow="How to plug in" title="Pick a door." className="mb-6" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {DOORS.map((d) => (
            <Card key={d.href} href={d.href} interactive>
              <Eyebrow className="mb-2.5">{d.eyebrow}</Eyebrow>
              <h3 className="font-sans font-extrabold text-h4 text-ink-950 m-0 mb-2.5">{d.title}</h3>
              <p className="text-sm text-ink-secondary m-0 mb-3.5">{d.body}</p>
              <span className="text-sm text-denim-400 font-semibold underline underline-offset-4">See the door</span>
            </Card>
          ))}
        </div>
      </Section>

      {/* 6. Partners and sponsors */}
      <Section id="partners">
        <SectionHeader
          eyebrow="Partners"
          title="Partners give time, venue and infrastructure."
          lede="Each has a confirmed agreement and a named point of contact on the ZAO team."
          className="mb-6"
        />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 list-none m-0 p-0">
          {PARTNERS.map((p) => (
            <PartnerTile key={p.name} partner={p} />
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <p className="text-base text-ink-secondary m-0 measure">Sponsors put money behind a named artist or the day. Talk to us.</p>
          <Button href="/sponsor" variant="secondary">
            Sponsor ZAOstock
          </Button>
          <Link href="/partners" className="text-denim-400 font-semibold underline underline-offset-4 hover:text-denim-500">
            All partners
          </Link>
        </div>
      </Section>

      {/* 7. Where it comes from */}
      <Section id="series">
        <SectionHeader eyebrow="Where it comes from" title="What came before." lede="ZAOstock is the first in Maine." className="mb-6" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SERIES.map((e, i) => (
            <Card key={e.name} className="p-0">
              <div className={['h-3 border-b-2 border-ink-950', i === 0 ? 'bg-red-500' : i === 1 ? 'bg-denim-400' : 'bg-olive-400'].join(' ')} />
              <div className="p-5">
                <Eyebrow>{e.when}</Eyebrow>
                <p className="font-sans font-extrabold text-base text-ink-950 m-0 mt-1.5">{e.name}</p>
                <p className="text-[13px] text-ink-secondary m-0 mt-1">{e.place}</p>
                <p className="text-[13px] text-ink-muted m-0 mt-1.5">{e.note}</p>
              </div>
            </Card>
          ))}
        </div>
        <Link href="/festivals" className="inline-block mt-6 text-denim-400 font-semibold underline underline-offset-4 hover:text-denim-500">
          The ZAO Festivals series
        </Link>
      </Section>
    </SiteShell>
  );
}
