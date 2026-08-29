import { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import { SITE } from '@/content/site';
import { MEETINGS } from '@/content/site';
import { SiteShell, Section, Eyebrow, Button, SectionHeader, BorderedList, Card } from '@/components/poster';

// Replaces /circles. Zaal, 29 August: the eight circles "will become meetings",
// twice a day at 11:30 and 17:00 ET. So this page is the two times and what
// each one is for, and nothing else: no login, no database, no sign-up. The
// circles page it replaces was a dashboard feature that has been failing
// publicly since the dashboard was retired.
export const metadata: Metadata = {
  title: 'Meetings',
  description: 'ZAOstock runs on two open meetings a day, 11:30 AM and 5 PM Eastern, until 3 October. Anyone building the festival can join either one.',
  alternates: { canonical: '/meetings' },
  openGraph: {
    title: 'Meetings | ZAOstock',
    description: 'Two open meetings a day, 11:30 AM and 5 PM Eastern, until 3 October.',
    url: 'https://zaostock.com/meetings',
    images: [OG_IMAGE],
  },
};

export default function MeetingsPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">How ZAOstock gets built</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">
            Two meetings a day, until the third of October.
          </h1>
          <p className="text-lg text-ink-secondary measure m-0">
            There is no sign-up sheet and no committee. If you are building any part of this festival, come to
            either meeting with the one thing you are working on. Everything decided goes straight into the
            working document, so missing one costs you nothing.
          </p>
        </div>
      </Section>

      <Section id="times">
        <SectionHeader eyebrow="The two times" title="Same times, every day." className="mb-6" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {MEETINGS.map((m) => (
            <Card key={m.time}>
              <Eyebrow>{m.label}</Eyebrow>
              <p className="font-display font-normal text-h2 text-ink-950 m-0 mt-2 tabular">{m.time}</p>
              <p className="text-sm text-ink-muted m-0 mt-1">{m.zone}</p>
              <p className="text-base text-ink-secondary m-0 mt-3">{m.what}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="how">
        <SectionHeader eyebrow="How they run" title="Short, and written down." className="mb-6" />
        <BorderedList
          rows={[
            { term: 'Bring one thing', detail: 'What you are working on, or the one question stopping you. Half-formed is fine.' },
            { term: 'Thirty minutes', detail: 'Both meetings are short on purpose. If something needs an hour it gets its own call.' },
            { term: 'Typed as we go', detail: 'Decisions go into the working document during the meeting, not after, so the document is always what we agreed.' },
            { term: 'Nobody is required', detail: 'Come when you have something. No attendance, no titles, no tiers.' },
          ]}
        />
      </Section>

      <Section id="join">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader
            eyebrow="Getting in"
            title="Ask for the link."
            lede="The invite carries the working document, which is where the run of show, the plan and who is doing what all live."
          />
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button href={`mailto:${SITE.contact}?subject=ZAOstock%20meetings`} external>
              {SITE.contact}
            </Button>
            <Button href="/build" variant="secondary">
              Building something?
            </Button>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
