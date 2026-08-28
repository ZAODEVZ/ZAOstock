import { Metadata } from 'next';
import { SiteShell, Eyebrow, Button, SectionHeader } from '@/components/poster';
import { FESTIVAL } from '@/content/festival';

export const metadata: Metadata = {
  title: 'ZAO Guide to Acadia National Park | ZAOstock',
  description:
    'The ZAO Guide to Acadia National Park - getting in, Cadillac Mountain reservations, the 5 must-see spots, and a multi-day excursion plan for ZAOstock weekend in Ellsworth, Maine.',
  openGraph: {
    title: 'ZAO Guide to Acadia National Park | ZAOstock',
    description:
      'Getting in, Cadillac Mountain reservations, the 5 must-see spots, and a multi-day excursion plan. ZAOstock, October 3, 2026.',
    url: 'https://zaostock.com/acadia',
  },
};

// ---------------------------------------------------------------------------
// CONTENT - seeded from research doc 1034 (2026-07-11). NPS.gov + AllTrails +
// Recreation.gov sourced. Refine as booking windows / closures update.
// ---------------------------------------------------------------------------

const MUST_SEE: { name: string; note: string }[] = [
  { name: '1. Cadillac Mountain', note: 'Highest point on the US East Coast, 360-degree views. Go for golden hour/sunset around Oct 3. Summit Road reservation required if driving (see below).' },
  { name: '2. Jordan Pond + the Bubbles', note: 'The most-photographed spot in the park - twin-peak reflection in the pond. Best early morning before wind picks up.' },
  { name: '3. Otter Cliffs + Boulder Beach', note: 'Dramatic granite cliffs that glow rust-red at sunrise, accessible via the flat, paved Ocean Path.' },
  { name: '4. Bass Harbor Head Light', note: "Maine's most-photographed lighthouse - it's been on a US quarter and an NPS stamp. Golden hour, sunrise or sunset." },
  { name: '5. Schoodic Peninsula', note: 'The "quiet side" of Acadia, on the mainland rather than Mount Desert Island. Same dramatic pink-granite coastline, a fraction of the crowds.' },
];

const GETTING_IN: { label: string; detail: string }[] = [
  { label: 'Distance', detail: "About 25 miles / 30-40 minutes from Ellsworth via Route 3, on the Mount Desert Island / Bar Harbor side." },
  { label: 'Cadillac Mountain reservation', detail: 'Required May 20-Oct 25, 2026 to drive to the summit ($6/vehicle, booked on Recreation.gov). 30% of slots release 90 days ahead, the rest 2 days ahead - the window for an Oct 3 visit opened around July 5. No reservation needed if you hike or bike to the summit instead.' },
  { label: 'Island Explorer shuttle', detail: 'Free shuttle bus running through October 12, 2026 - connects Ellsworth-area hotels, Bar Harbor, and the main park destinations. A good way to skip the parking crunch.' },
  { label: 'What\'s open Oct 3', detail: 'Park Loop Road (through Dec 1), Schoodic Loop Road (year-round), and Hulls Cove Visitor Center (through Oct 31) are all open. Seawall/Schoodic Woods campgrounds close Oct 12, Blackwoods closes Oct 19 - only relevant if staying past the festival.' },
];

const EXCURSIONS: { name: string; difficulty: string; time: string; note: string }[] = [
  { name: 'Ocean Path Trail', difficulty: 'Easy', time: '1.5-2 hrs', note: 'Sand Beach to Otter Point, 4.4mi round trip, flat and well-maintained. The most inclusive real "I hiked in Acadia" experience - anyone can do it in normal shoes.' },
  { name: 'Schoodic Peninsula loop drive', difficulty: 'Easy', time: '2-3 hrs', note: 'Car-based with short optional walks - includes people who can\'t or don\'t want to hike. Quieter side of the park, dramatic sunset spot at Ravens Nest.' },
  { name: 'Bar Harbor lighthouse/wildlife boat cruise', difficulty: 'Very easy', time: '2-3 hrs, ~$45-65/person', note: 'Seals, eagles, and 3+ lighthouses from the water - a good group activity when people want to sit down.' },
  { name: 'Great Head Trail loop', difficulty: 'Moderate', time: '1-1.5 hrs', note: '1.8mi loop around Sand Beach, rocky headland with real trail feel but still short.' },
  { name: 'Jordan Pond loop', difficulty: 'Easy', time: '1-1.5 hrs', note: '3.3mi, flat, genuinely peaceful - pairs well with popovers at the Jordan Pond House.' },
  { name: 'Gorham Mountain loop', difficulty: 'Moderate-hard', time: '1.5-2 hrs', note: '1.6mi, 400ft gain, real granite scrambling - the opt-in for whoever wants a real hike, not the group default.' },
];

const GOOD_TO_KNOW: { label: string; detail: string }[] = [
  { label: 'Weather', detail: 'Daytime highs roughly 55-65°F, dropping to the 40s at night. October is Maine\'s wettest month historically - bring a real waterproof layer, not just a light jacket.' },
  { label: 'Sunrise / sunset', detail: 'Sunrise runs ~7:00-7:15 AM, sunset ~6:15-6:30 PM in early October - useful for planning excursion start times.' },
  { label: 'Fall foliage, honestly', detail: 'Peak color for this region lands in the Oct 10-27 window, not Oct 1-3. Expect early color starting on exposed high points and near water - genuinely pre-peak, but still a real backdrop.' },
];

export default function AcadiaPage() {
  return (
    <SiteShell>
      <div className="wrap max-w-[860px] py-10 sm:py-14 space-y-12">
        {/* Hero */}
        <section className="space-y-3">
          <Eyebrow tone="denim">ZAO Guide</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1">
            Acadia National Park
          </h1>
          <p className="text-lg text-ink-secondary measure m-0">
            Ellsworth is the gateway - Acadia is about 25 miles away. Whether you have an
            afternoon or a few extra days around ZAOstock, here&apos;s what&apos;s actually worth doing,
            what needs a reservation, and what to skip.
          </p>
        </section>

        {/* Getting in */}
        <section>
          <SectionHeader className="mb-5" eyebrow="Getting in" title="Plan the logistics first." />
          <div className="space-y-3">
            {GETTING_IN.map((g) => (
              <div key={g.label} className="grain bg-paper-200 border border-ink-950/60 rounded-md p-4">
                <div className="font-sans font-extrabold text-ink-950">{g.label}</div>
                <p className="text-sm text-ink-secondary mt-1 m-0">{g.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Must-see */}
        <section>
          <SectionHeader className="mb-5" eyebrow="Must-see" title="5 spots, ranked." />
          <div className="space-y-3">
            {MUST_SEE.map((m) => (
              <div key={m.name} className="grain bg-paper-200 border border-ink-950/60 rounded-md p-4">
                <div className="font-sans font-extrabold text-ink-950">{m.name}</div>
                <p className="text-sm text-ink-secondary mt-1 m-0">{m.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Excursions */}
        <section>
          <SectionHeader className="mb-5" eyebrow="Staying a few extra days?" title="Multi-day excursion plan." />
          <p className="text-base text-ink-secondary mb-4 measure">
            Ranked for a mixed group of varying fitness - musicians and attendees, not a hiking club.
            Suggested framing for 3 days: Day 1 downtown Ellsworth, Day 2 Ocean Path + Jordan Pond +
            Cadillac sunset, Day 3 Schoodic loop drive or the boat cruise.
          </p>
          <div className="space-y-3">
            {EXCURSIONS.map((e) => (
              <div key={e.name} className="grain bg-paper-200 border border-ink-950/60 rounded-md p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-sans font-extrabold text-ink-950">{e.name}</div>
                  <span className="font-mono text-eyebrow font-bold uppercase tracking-[0.12em] text-gold-600 shrink-0">{e.difficulty}</span>
                </div>
                <p className="font-mono text-eyebrow text-ink-muted mt-1 m-0">{e.time}</p>
                <p className="text-sm text-ink-secondary mt-1 m-0">{e.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Good to know */}
        <section>
          <SectionHeader className="mb-5" eyebrow="Good to know" title="Weather and timing." />
          <div className="space-y-3">
            {GOOD_TO_KNOW.map((g) => (
              <div key={g.label} className="grain bg-paper-200 border border-ink-950/60 rounded-md p-4">
                <div className="font-sans font-extrabold text-ink-950">{g.label}</div>
                <p className="text-sm text-ink-secondary mt-1 m-0">{g.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="grain bg-paper-200 border-2 border-ink-950 rounded-md p-6 shadow-hard">
          <h2 className="font-display font-normal text-[2rem] leading-[1.05] tracking-[-0.01em] sm:text-h2 m-0">Coming to ZAOstock?</h2>
          <p className="text-base text-ink-secondary mt-2 m-0">
            {FESTIVAL.dateLabel}. {FESTIVAL.venue}, {FESTIVAL.city}. {FESTIVAL.admission}, music from noon.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href={FESTIVAL.rsvpUrl} external>
              RSVP free
            </Button>
            <Button href="/program" variant="secondary">
              The program
            </Button>
            <Button href="/ellsworth" variant="ghost">
              Visiting Ellsworth
            </Button>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
