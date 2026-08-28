import { SITE, SERIES } from '@/content/site';
import { SiteShell, Section, Eyebrow, Button, Card, SectionHeader, BorderedList } from '@/components/poster';

// One component, three personas (/musicians, /artists, /event-organizers).
// Rebuilt on the poster shell per docs/design/redesign-2026-08-28.md route 5.

export interface EntryPageCTA {
  label: string;
  href: string;
  primary?: boolean;
}

export interface EntryPageProps {
  /** "musicians", "artists", "event-organizers" */
  personaSlug: string;
  /** Display label for the persona, e.g. "Musicians" */
  personaLabel: string;
  /** Big hero headline */
  hero: string;
  /** One-line subhead under the hero */
  subhead: string;
  /** "If you plug in" list */
  youGet: string[];
  /** "In return" list */
  weAsk: string[];
  /** Optional facts strip for this persona */
  facts?: ReadonlyArray<{ term: string; detail: string }>;
  /** Action CTAs at bottom of page */
  ctas: EntryPageCTA[];
  /** Optional final note (e.g. eligibility, deadline) */
  footnote?: string;
}

const DOORS = [
  { slug: 'musicians', label: 'Musicians', href: '/musicians', line: 'Submit for the lineup.' },
  { slug: 'artists', label: 'Visual artists', href: '/artists', line: 'Posters, motion, signage.' },
  { slug: 'event-organizers', label: 'Organizers', href: '/event-organizers', line: 'Host the next one in 2027.' },
] as const;

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-none m-0 p-0 flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-base text-ink-950">
          <span className="font-mono text-eyebrow font-bold text-denim-400 pt-1.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function EntryPage(props: EntryPageProps) {
  const { personaSlug, personaLabel, hero, subhead, youGet, weAsk, facts, ctas, footnote } = props;
  const others = DOORS.filter((d) => d.slug !== personaSlug);

  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">For {personaLabel}</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">{hero}</h1>
          <p className="text-lg text-ink-secondary measure m-0">{subhead}</p>
        </div>
      </Section>

      {facts && facts.length > 0 ? (
        <Section>
          <SectionHeader eyebrow="The facts" title="What is settled, and what is not." className="mb-6" />
          <BorderedList rows={facts} className="max-w-[760px]" />
        </Section>
      ) : null}

      <Section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader eyebrow="What you get" title="If you plug in" className="mb-5" />
            <List items={youGet} />
          </div>
          <div>
            <SectionHeader eyebrow="What we ask" title="In return" className="mb-5" />
            <List items={weAsk} />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="How to plug in" title="Pick a door." className="mb-6" />
        <div className="flex flex-wrap gap-3 mb-8">
          {ctas.map((cta, i) => (
            <Button key={i} href={cta.href} external={cta.href.startsWith('mailto:')} variant={cta.primary ? 'primary' : 'secondary'} size="lg">
              {cta.label}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-[760px]">
          {others.map((d) => (
            <Card key={d.slug} href={d.href} interactive>
              <Eyebrow className="mb-2">For {d.label.toLowerCase()}</Eyebrow>
              <p className="font-sans font-extrabold text-h4 text-ink-950 m-0">{d.line}</p>
              <span className="inline-block mt-3 text-sm text-denim-400 font-semibold underline underline-offset-4">See the door</span>
            </Card>
          ))}
        </div>
        {footnote ? <p className="text-sm text-ink-muted measure mt-8 m-0">{footnote}</p> : null}
        <p className="text-sm text-ink-secondary mt-6 m-0">
          Questions:{' '}
          <a href={`mailto:${SITE.contact}`} className="text-denim-400 underline underline-offset-4 hover:text-denim-500">
            {SITE.contact}
          </a>
          . ZAOstock is one chapter in the ZAO Festivals series: {SERIES.map((s) => s.name).join(', ')}.
        </p>
      </Section>
    </SiteShell>
  );
}
