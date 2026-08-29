import { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import { ApplyForm } from './ApplyForm';
import { FESTIVAL } from '@/content/festival';
import { SITE } from '@/content/site';
import { SiteShell, Section, Eyebrow, Button, Card, SectionHeader, BorderedList } from '@/components/poster';

export const metadata: Metadata = {
  title: 'Volunteer',
  description: 'Sign up to volunteer at ZAOstock, a free community music festival in Ellsworth, Maine on Saturday 3 October 2026.',
  alternates: { canonical: '/apply' },
  openGraph: {
    title: 'Volunteer | ZAOstock',
    description: 'Sign up to volunteer at ZAOstock, a free community music festival in Ellsworth, Maine on Saturday 3 October 2026.',
    url: 'https://zaostock.com/apply',
    images: [OG_IMAGE],
  },
};

const ROLES: Array<{ value: string; label: string; hint: string }> = [
  { value: 'setup', label: 'Setup', hint: 'Load-in, stage rigging, tents, signage' },
  { value: 'checkin', label: 'Check-in', hint: 'Welcome, wristbands, info booth' },
  { value: 'water', label: 'Water', hint: 'Keep the crowd watered' },
  { value: 'safety', label: 'Safety', hint: 'Crowd flow, first-aid point, eyes open' },
  { value: 'teardown', label: 'Teardown', hint: 'Strike the stage, pack out, leave no trace' },
  { value: 'floater', label: 'Floater', hint: 'Wherever needed' },
  { value: 'content', label: 'Content', hint: 'Photos, short video, socials during the day' },
  { value: 'unassigned', label: 'Pick for me', hint: 'You decide where you need me' },
];

const SHIFTS: Array<{ value: string; label: string }> = [
  { value: 'early', label: 'Load-in, morning' },
  { value: 'block1', label: 'Block 1, noon to 3' },
  { value: 'block2', label: 'Block 2, 3 to 6' },
  { value: 'teardown', label: 'Teardown, evening' },
  { value: 'allday', label: 'All day, I am in' },
];

export default function ApplyPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Volunteer</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">Build the day with us.</h1>
          <p className="text-lg text-ink-secondary measure m-0">
            {FESTIVAL.dateLabel}. {FESTIVAL.venue}, {FESTIVAL.city}. Community-built, community-run: {ROLES.length - 1} roles, multiple shifts.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-16 items-start">
          <div className="flex flex-col gap-6">
            <SectionHeader eyebrow="What you get" title="On-site gear and a meal." />
            <BorderedList
              rows={[
                { term: 'Entry', detail: 'Free, like everyone' },
                { term: 'Gear', detail: 'A ZAOstock crew shirt and a meal on the day' },
                { term: 'After', detail: 'First look at next year and a standing invite to ZAO events' },
                { term: 'Commitment', detail: 'None until you say yes to a specific shift' },
              ]}
            />
            <Card>
              <Eyebrow className="mb-2">Not sure yet?</Eyebrow>
              <p className="text-sm text-ink-secondary m-0">
                Apply anyway. We reach out within a few days, answer questions, and you can opt out any time before 3 October.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button href="/program" variant="secondary" size="sm">
                  See the program
                </Button>
                <Button href={`mailto:${SITE.contact}?subject=${encodeURIComponent('ZAOstock - volunteer question')}`} external variant="ghost" size="sm">
                  Ask a question
                </Button>
              </div>
            </Card>
          </div>
          <ApplyForm roles={ROLES} shifts={SHIFTS} />
        </div>
      </Section>
    </SiteShell>
  );
}
