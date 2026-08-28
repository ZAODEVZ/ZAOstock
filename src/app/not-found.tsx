import type { Metadata } from 'next';
import { FESTIVAL } from '@/content/festival';
import { SiteShell, Section, Eyebrow, Button } from '@/components/poster';

export const metadata: Metadata = {
  title: 'Not found',
  description: 'That page does not exist.',
};

export default function NotFound() {
  return (
    <SiteShell>
      <Section first>
        <div className="max-w-[640px] py-12">
          <Eyebrow tone="denim">ZAO Festivals presents ZAOstock</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-4">Lost the beat.</h1>
          <p className="text-lg text-ink-secondary mt-4 measure">
            That page does not exist. The festival is {FESTIVAL.dateLabel} at the {FESTIVAL.venue} in {FESTIVAL.city}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/program" variant="primary">Program</Button>
            <Button href="/press" variant="secondary">Press</Button>
            <Button href="/" variant="secondary">Home</Button>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
