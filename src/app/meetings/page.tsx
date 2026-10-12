import { Metadata } from 'next';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import { SITE } from '@/content/site';
import { FESTIVAL } from '@/content/festival';
import { SiteShell, Section, Eyebrow, Button, SectionHeader, BorderedList } from '@/components/poster';

// PAST TENSE, 2026-10-04: ZAOstock happened, so the page says how it got built.
// The no-fixed-slot rule below still holds.
//
// Replaces /circles. This page published two fixed daily meetings, 11:30 and
// 17:00 ET, from 29 August until 2026-09-09, when Zaal said plainly that they
// do not happen. A page telling the public to turn up somewhere nobody is, is
// worse than no page, so the times are gone and what remains is the route in.
//
// Do NOT re-add a recurring time here unless someone is actually holding it.
// site.test.ts fails the build if a published page carries one.
export const metadata: Metadata = {
  title: 'Meetings',
  description: 'How ZAOstock 2026 got built, and how to reach the team about a future edition.',
  alternates: { canonical: '/meetings' },
  openGraph: {
    title: 'Meetings | ZAOstock',
    description: `How ZAOstock got built, ahead of ${FESTIVAL.shortDate}, and how to reach the team.`,
    url: 'https://zaostock.com/meetings',
    images: [OG_IMAGE],
  },
  twitter: twitterCard('Meetings | ZAOstock', `How ZAOstock got built, ahead of ${FESTIVAL.shortDate}, and how to reach the team.`),
};

export default function MeetingsPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">How ZAOstock gets built</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">
How it got built.
          </h1>
          <p className="text-lg text-ink-secondary measure m-0">
            There was no sign-up sheet and no committee. Everything decided went into the working document,
            so nothing depended on being in the room at a particular hour. To talk about a future edition,
            get in touch.
          </p>
        </div>
      </Section>

      <Section id="times">
        <SectionHeader
          eyebrow="When"
          title="No fixed weekly slot, on purpose."
          lede="We are a volunteer team with jobs, and a standing meeting nobody attends is worse than none. We meet when there is something to decide. Say what you are working on and we will find an hour that works for you."
          className="mb-6"
        />
      </Section>

      <Section id="how">
        <SectionHeader eyebrow="How they run" title="Short, and written down." className="mb-6" />
        <BorderedList
          rows={[
            { term: 'Bring one thing', detail: 'What you are working on, or the one question stopping you. Half-formed is fine.' },
            { term: 'Short', detail: 'Kept deliberately short. If something needs an hour it gets its own call.' },
            { term: 'Typed as we go', detail: 'Decisions go into the working document during the meeting, not after, so the document is always what we agreed.' },
            { term: 'Nobody is required', detail: 'Turn up when you have something. No attendance, no titles, no tiers.' },
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
