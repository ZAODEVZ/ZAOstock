import { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import Link from 'next/link';
import { SiteShell, Eyebrow, Button, SectionHeader } from '@/components/poster';
import { FESTIVAL } from '@/content/festival';

export const metadata: Metadata = {
  title: 'Visiting Ellsworth, Maine',
  description:
    'Everything you need for ZAOstock weekend in Ellsworth, Maine - getting here, where to stay, where to eat, and what to do in the gateway to Acadia National Park.',
  alternates: { canonical: '/ellsworth' },
  openGraph: {
    title: 'Visiting Ellsworth, Maine | ZAOstock',
    description:
      'Getting here, where to stay, where to eat, and what to do in Ellsworth - the gateway to Acadia National Park. October 3, 2026.',
    url: 'https://zaostock.com/ellsworth',
    images: [OG_IMAGE],
  },
};

// ---------------------------------------------------------------------------
// CONTENT - seeded from web research (2026-06), parking/restroom plan from
// research doc 1032 (2026-07-11). Refine/expand with exact addresses, links.
// ---------------------------------------------------------------------------

// Gated - see the section comment below before ever setting this.
const HOE_VIDEO_URL: string | null = null;

const GETTING_HERE: { mode: string; detail: string }[] = [
  { mode: 'By car', detail: 'About 40 min (30 mi) from Bangor, ~3 hrs (135 mi) from Portland, and ~5 hrs from Boston. Route 1 / Route 1A run right through downtown.' },
  { mode: 'Bangor International (BGR)', detail: 'Nearest major airport, ~40 min away. A direct shuttle bus runs to Ellsworth twice daily (~35 min). Best bet for most travelers.' },
  { mode: 'Hancock County-Bar Harbor (BHB)', detail: 'Smaller regional airport ~20 min away, with seasonal Cape Air service (including from Boston). Closest to the venue.' },
  { mode: 'Parking', detail: 'A public parking lot plus free street parking right near the Franklin Street Parklet - no shuttle needed.' },
];

const STAY: { name: string; note: string }[] = [
  { name: 'Hampton Inn Ellsworth/Bar Harbor', note: 'One of the newest hotels in town. Indoor heated saltwater pool, breakfast included.' },
  { name: 'Comfort Inn Ellsworth - Bar Harbor', note: 'Indoor saltwater pool and hot tub, free WiFi, daily continental breakfast.' },
  { name: 'Colonial Inn Ellsworth', note: '85-room property, renovated in 2016. Central to downtown.' },
  { name: 'Hawthorn Extended Stay by Wyndham', note: 'Suites with full kitchens - good for a multi-night stay. Breakfast + onsite laundry.' },
  { name: 'Book early', note: 'Ellsworth is the Acadia gateway and early October is foliage season - rooms go fast. Reserve ahead.' },
];

const EAT: { name: string; note: string }[] = [
  { name: 'Black Moon Public House', note: 'The ZAOstock afterparty venue. Start here after the show.' },
  { name: 'Union River Lobster Pot', note: 'Seasonal seafood on the banks of the Union River downtown - lobster and a famous slice of pie.' },
  { name: 'Cleonice', note: 'Mediterranean bistro in the historic 1938 Luchini building on Main Street.' },
  { name: 'Serendib', note: 'Award-winning Indian and Sri Lankan cuisine.' },
  { name: 'Provender Kitchen + Bar', note: 'Chef-driven contemporary American at 112 Main St, 4.5-star. Reservations recommended.' },
  { name: "Finn's Irish Pub", note: 'Irish food and pub fare at 156 Main St, 4.4-star, casual.' },
  { name: 'Fogtown Brewing', note: 'Taproom with a dog-friendly beer garden.' },
  { name: 'Airline Brewing Company', note: 'British-style local beers and classic pub fare.' },
];

const DO: { name: string; note: string }[] = [
  { name: 'Acadia National Park', note: 'Ellsworth is the gateway - about 25 mi to Bar Harbor and the park. See the full ZAO Guide to Acadia for must-see spots, reservations, and excursion plans.' },
  { name: 'Union River Sculpture Trail', note: 'New granite sculptures by Maine artists along the Riverwalk - first installations launching Fall 2026.' },
  { name: 'Woodlawn Museum, Gardens & Park', note: 'The historic Black House on 180 acres - gardens, trails, and a croquet court.' },
  { name: 'Birdsacre (Stanwood Wildlife Sanctuary)', note: 'Rescued birds and miles of quiet walking trails, plus the Stanwood homestead museum.' },
  { name: 'Downtown Ellsworth', note: '19th-century Main Street: galleries (Courthouse Gallery, Atlantic Art Glass), shops, and cafes climbing up from the river.' },
];

const GOOD_TO_KNOW: { label: string; detail: string }[] = [
  { label: 'Weather', detail: 'Early October runs roughly 58-62°F by day, ~44°F at night - crisp and breezy, with the season just turning toward fall color. Pack layers and a jacket; ZAOstock is outdoors.' },
  { label: 'Daylight', detail: 'About 11 hours of daylight, sunrise ~6:48 AM, sunset ~5:49 PM. The festival runs noon-6 PM, finishing near golden hour.' },
  { label: 'Rain', detail: 'Roughly a 1-in-3 chance of rain on any given fall day - a packable rain layer is smart.' },
  { label: 'Island Explorer shuttle', detail: "Free shuttle bus connecting Ellsworth-area hotels, Bar Harbor, and Acadia - running through October 12, 2026. Good way to skip the park's parking crunch." },
  { label: 'Restrooms', detail: 'On-site portable restrooms (including ADA-accessible units) near the stage/food area, plus walkable downtown restroom access nearby.' },
];

export default function EllsworthPage() {
  return (
    <SiteShell>
      <div className="wrap max-w-[860px] py-10 sm:py-14 space-y-12">
        {/* Hero */}
        <section className="space-y-3">
          <Eyebrow tone="denim">Plan your weekend</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1">
            Ellsworth, Maine
          </h1>
          <p className="text-lg text-ink-secondary measure m-0">
            Crossroads of Downeast Maine and the gateway to Acadia National Park. Home to ZAOstock on
            October 3, 2026 at the Franklin Street Parklet, as part of the 9th Annual Art of Ellsworth
            during Maine Craft Weekend.
          </p>
        </section>

        {/* About Ellsworth - Heart of Ellsworth's own org video.
            DOUBLE GATE, both must clear before HOE_VIDEO_URL is set:
            1. Chesnee Barney's hold (ZAOOS doc 2279, 2026-08-13): the video is NOT
               public until Heart of Ellsworth runs its own planned push - their
               YouTube is mid-migration off an old Gmail.
            2. A real hosted URL exists (none does yet, for the same reason).
            When both clear: set the const, done. Copy below is deliberately about
            the TOWN - Heart of Ellsworth is credited as the video's maker, never
            framed as a ZAOstock partner (not approved; see doc 2279). */}
        {HOE_VIDEO_URL ? (
          <section>
            <SectionHeader className="mb-5" eyebrow="About Ellsworth" title="The town, in its own words." />
            <p className="text-base text-ink-secondary mb-4 measure">
              A short film about downtown Ellsworth, made by Heart of Ellsworth.
            </p>
            <div className="rounded-md border-2 border-ink-950 bg-paper-200 overflow-hidden aspect-video shadow-hard">
              <iframe
                src={HOE_VIDEO_URL}
                title="About Ellsworth - a film by Heart of Ellsworth"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        ) : null}

        {/* Getting here */}
        <section>
          <SectionHeader className="mb-5" eyebrow="Getting here" title="How to reach Ellsworth." />
          <div className="space-y-3">
            {GETTING_HERE.map((g) => (
              <div key={g.mode} className="grain bg-paper-200 border border-ink-950/60 rounded-md p-4">
                <div className="font-sans font-extrabold text-ink-950">{g.mode}</div>
                <p className="text-sm text-ink-secondary mt-1 m-0">{g.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Where to stay */}
        <section>
          <SectionHeader className="mb-5" eyebrow="Where to stay" title="Beds near the venue." />
          <div className="space-y-3">
            {STAY.map((s) => (
              <div key={s.name} className="grain bg-paper-200 border border-ink-950/60 rounded-md p-4">
                <div className="font-sans font-extrabold text-ink-950">{s.name}</div>
                <p className="text-sm text-ink-secondary mt-1 m-0">{s.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Eat & drink */}
        <section>
          <SectionHeader className="mb-5" eyebrow="Eat & drink" title="Where to refuel." />
          <div className="space-y-3">
            {EAT.map((e) => (
              <div key={e.name} className="grain bg-paper-200 border border-ink-950/60 rounded-md p-4">
                <div className="font-sans font-extrabold text-ink-950">{e.name}</div>
                <p className="text-sm text-ink-secondary mt-1 m-0">{e.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Things to do */}
        <section>
          <SectionHeader className="mb-5" eyebrow="Things to do" title="Make a weekend of it." />
          <div className="space-y-3">
            {DO.map((d) => (
              <div key={d.name} className="grain bg-paper-200 border border-ink-950/60 rounded-md p-4">
                <div className="font-sans font-extrabold text-ink-950">{d.name}</div>
                <p className="text-sm text-ink-secondary mt-1 m-0">{d.note}</p>
              </div>
            ))}
          </div>
          <Link
            href="/acadia"
            className="mt-4 inline-block text-sm text-denim-400 font-semibold underline underline-offset-4 hover:text-denim-500"
          >
            Full ZAO Guide to Acadia National Park &rarr;
          </Link>
        </section>

        {/* Good to know */}
        <section>
          <SectionHeader className="mb-5" eyebrow="Good to know" title="Before you come." />
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
            <Button href="/acadia" variant="ghost">
              The Acadia guide
            </Button>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
