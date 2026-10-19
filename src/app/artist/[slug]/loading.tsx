import { SiteShell, Section, Card } from '@/components/poster';

// Shown while an artist page streams in (ZAOOS doc 2507, item 16). The page is
// force-dynamic and waits on Supabase, so a slow round-trip used to leave a
// blank tab. The skeleton mirrors the final layout: the 96px photo circle, the
// name and its two lines, then two cards, inside the same 760px column, so
// nothing jumps when the real page replaces it. No animation, so there is
// nothing for prefers-reduced-motion to switch off.
export default function Loading() {
  return (
    <SiteShell>
      <Section first className="pt-10 sm:pt-14">
        <div className="max-w-[760px] space-y-6" aria-busy="true" aria-label="Loading artist">
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-full bg-paper-200 border-2 border-ink-950/20 flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-3 pt-1">
              <div className="h-3 w-24 rounded bg-ink-950/10" />
              <div className="h-7 w-2/3 rounded bg-ink-950/10" />
              <div className="h-4 w-1/3 rounded bg-ink-950/10" />
            </div>
          </div>
          <Card>
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-ink-950/10" />
              <div className="h-3 w-full rounded bg-ink-950/10" />
              <div className="h-3 w-4/5 rounded bg-ink-950/10" />
            </div>
          </Card>
          <Card>
            <div className="h-3 w-1/2 rounded bg-ink-950/10" />
          </Card>
        </div>
      </Section>
    </SiteShell>
  );
}
