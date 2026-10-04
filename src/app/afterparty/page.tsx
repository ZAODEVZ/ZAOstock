import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { OG_IMAGE } from '@/lib/meta';
import { FESTIVAL } from '@/content/festival';
import { AFTER_PARTY } from '@/content/site';
import { SiteShell, Section, Eyebrow, Card, Button } from '@/components/poster';

// /afterparty - Black Moon's own flyer and the details from it, on its own
// page (Zaal, 2026-09-30). The evening is Black Moon's event; this page lists
// it and does not describe it as a second ZAOstock stage.
//
// PAST TENSE, 2026-10-04: the day has passed. The page states what was billed,
// with Black Moon's flyer, and does not claim the evening ran as listed (the
// owner has not confirmed it).

const TITLE = 'After-party at Black Moon';
const DESCRIPTION = `The ZAOstock after-party was billed at ${AFTER_PARTY.venue}, ${AFTER_PARTY.address}, ${FESTIVAL.shortDate}: doors ${AFTER_PARTY.doors}, music ${AFTER_PARTY.music} to ${AFTER_PARTY.end}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/afterparty' },
  openGraph: { title: `${TITLE} · ZAOstock 2026`, description: DESCRIPTION, url: 'https://zaostock.com/afterparty', images: [OG_IMAGE], type: 'website' },
  twitter: { card: 'summary_large_image', title: `${TITLE} · ZAOstock 2026`, description: DESCRIPTION },
};

export default function AfterPartyPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
          <div>
            <Eyebrow tone="denim">{FESTIVAL.dateLabel} · after six</Eyebrow>
            <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">
              The after-party.
            </h1>
            <p className="text-lg text-ink-secondary measure m-0">
              The ZAOstock after-party was billed at {AFTER_PARTY.venue} next door: doors {AFTER_PARTY.doors}, music {AFTER_PARTY.music} to {AFTER_PARTY.end}.
            </p>
            <Card className="mt-6">
              <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="font-bold text-ink-950">Where</dt>
                <dd className="m-0 text-ink-secondary">{AFTER_PARTY.venue}, {AFTER_PARTY.address}</dd>
                <dt className="font-bold text-ink-950">Doors</dt>
                <dd className="m-0 text-ink-secondary">{AFTER_PARTY.doors}</dd>
                <dt className="font-bold text-ink-950">Music</dt>
                <dd className="m-0 text-ink-secondary">{AFTER_PARTY.music} to {AFTER_PARTY.end}</dd>
                <dt className="font-bold text-ink-950">Ages</dt>
                <dd className="m-0 text-ink-secondary">{AFTER_PARTY.ages}</dd>
                <dt className="font-bold text-ink-950">On the bill</dt>
                <dd className="m-0 text-ink-secondary">{AFTER_PARTY.lineup.join(', ')}</dd>
              </dl>
            </Card>
            <p className="text-sm text-ink-muted m-0 mt-4">
              Billed at {AFTER_PARTY.venue}, on their own premises. Earlier in the day was{' '}
              <Link href="/program" className="underline hover:no-underline">the ZAOstock program</Link>, noon to six on the parklet.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button href={AFTER_PARTY.flyer} external variant="secondary">
                Open the flyer
              </Button>
            </div>
          </div>
          <div className="rounded-md overflow-hidden border border-ink-950/40">
            <Image
              src={AFTER_PARTY.flyer}
              alt={`Black Moon Pub presents the after-party, ${FESTIVAL.shortDate}: ${AFTER_PARTY.music}, ${AFTER_PARTY.ages.toLowerCase()}, ${AFTER_PARTY.lineup.join(', ')}. ${AFTER_PARTY.address}.`}
              width={1125}
              height={1500}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
