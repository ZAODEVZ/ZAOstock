import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import { MusicianSubmitForm } from './SubmitForm';
import { SiteShell, Section, Eyebrow, Button, Card, SectionHeader, BorderedList } from '@/components/poster';

export const metadata: Metadata = {
  title: 'Submit your music',
  description: 'Submit your music to ZAO Festivals: ZAOstock, CoC ConcertZ and the next ZAO shows. Artist name, track ideas, audio links, contact. Open all year, reviewed on a rolling basis.',
  alternates: { canonical: '/musicians/submit' },
  openGraph: {
    title: 'Submit your music | ZAO Festivals',
    description: 'Submit your music to ZAO Festivals. Open all year, reviewed on a rolling basis.',
    url: 'https://zaostock.com/musicians/submit',
    images: [OG_IMAGE],
    type: 'website',
  },
};

export default function MusicianSubmitPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Music submissions</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">Submit your music.</h1>
          <p className="text-lg text-ink-secondary measure m-0">
            One door for every ZAO stage: ZAOstock, CoC ConcertZ, and the shows that come next. Open all year. The music team reviews on a rolling basis and reaches out when a slot fits.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-16 items-start">
          <div className="flex flex-col gap-6">
            <SectionHeader eyebrow="What we need now" title="Rough is fine." lede="No polished masters or artwork yet. Initial materials are enough for selection; final materials are asked for once you are confirmed for a date." />
            <BorderedList
              rows={[
                { term: 'Who', detail: 'Artist name and a contact email' },
                { term: 'What', detail: 'A few track or song ideas you would play' },
                { term: 'Links', detail: 'Audio anywhere: Audius, SoundCloud, Spotify, Dropbox' },
                { term: 'Bio', detail: 'A short one' },
                { term: 'Travel', detail: 'Where from, if you would need support' },
                { term: 'When', detail: 'Any time. There is no closing date' },
              ]}
            />
            <Card>
              <Eyebrow className="mb-2">What happens next</Eyebrow>
              <p className="text-sm text-ink-secondary m-0">
                The music team reviews every submission and reaches out at the email you gave when a stage or a date fits. Independent and ZAO-vetted only; this is not pay-to-play.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button href="/musicians" variant="secondary" size="sm">
                  Back to musicians
                </Button>
              </div>
            </Card>
          </div>
          <div className="zs-form">
            <MusicianSubmitForm />
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
