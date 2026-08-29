import { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import { CypherForm } from './CypherForm';
import { FESTIVAL } from '@/content/festival';
import { SiteShell, Section, Eyebrow, Button, Card, SectionHeader } from '@/components/poster';

export const metadata: Metadata = {
  title: 'The cypher',
  description: 'Sign up to be part of the ZAOstock cypher, a live multi-artist collaborative track created at the festival on Saturday 3 October 2026.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/cypher' },
  openGraph: {
    title: 'The cypher | ZAOstock',
    description: 'Sign up to be part of the ZAOstock cypher, a live multi-artist collaborative track created at the festival.',
    url: 'https://zaostock.com/cypher',
    images: [OG_IMAGE],
  },
};

const WHO = ['Rappers, vocalists, singers', 'Producers, with a laptop and a beat or two', 'Instrumentalists: guitar, bass, horns, keys, drums', 'Spoken word and poets', 'Anyone who wants to add a voice to the day'];

export default function CypherPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">The cypher</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">One track, many voices.</h1>
          <p className="text-lg text-ink-secondary measure m-0">
            A live multi-artist collaborative track, built on site at ZAOstock on {FESTIVAL.shortDate}. Bring verses, beats or an instrument.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-16 items-start">
          <div className="flex flex-col gap-6">
            <SectionHeader
              eyebrow="What a cypher is"
              title="Built live."
              lede="Vocalists trade verses, producers cook the beat on the spot, instrumentalists add texture. The ZAOstock cypher is recorded, mixed and released after the festival; every contributor gets credit and share."
            />
            <Card>
              <Eyebrow className="mb-2">Who should sign up</Eyebrow>
              <ul className="list-disc pl-5 m-0 text-sm text-ink-950 flex flex-col gap-1">
                {WHO.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
              <p className="text-sm text-ink-muted m-0 mt-3">You do not need to be on the main lineup. The cypher is open.</p>
              <div className="mt-4">
                <Button href="/program" variant="secondary" size="sm">
                  See the program
                </Button>
              </div>
            </Card>
          </div>
          <CypherForm />
        </div>
      </Section>
    </SiteShell>
  );
}
