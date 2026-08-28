import { Metadata } from 'next';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { SuggestForm } from './SuggestForm';
import { SiteShell, Section, Eyebrow, Badge, SectionHeader } from '@/components/poster';

export const metadata: Metadata = {
  title: 'Suggestions',
  description: 'Drop a suggestion for ZAOstock. Anyone can submit. We credit the contributors.',
  openGraph: {
    title: 'Suggestions | ZAOstock',
    description: 'Drop a suggestion for ZAOstock. Anyone can submit. We credit the contributors.',
    url: 'https://zaostock.com/suggest',
  },
};

export const dynamic = 'force-dynamic';

type Suggestion = { id: string; name: string | null; suggestion: string; status: string; created_at: string };

/** Null when the database is unreachable, so the page can say so instead of throwing. */
async function getPublic(): Promise<Suggestion[] | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('suggestions')
      .select('id, name, suggestion, status, created_at')
      .neq('status', 'archived')
      .order('created_at', { ascending: false })
      .limit(80);
    if (error) return null;
    return (data as Suggestion[]) || [];
  } catch {
    return null;
  }
}

const STATUS_TONE: Record<string, 'outline' | 'denim' | 'gold'> = {
  new: 'outline',
  reviewing: 'denim',
  actioned: 'gold',
  wontfix: 'outline',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default async function SuggestPage() {
  const suggestions = await getPublic();

  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Suggestion box</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">Drop an idea.</h1>
          <p className="text-lg text-ink-secondary measure m-0">Anyone can submit. Good ideas get credited and actioned. The team reviews every entry.</p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-16 items-start">
          <SuggestForm />
          <div>
            <SectionHeader eyebrow="Recent" title="What people have suggested." className="mb-5" />
            {suggestions === null ? (
              <p className="text-sm text-ink-muted m-0">The list reads from the database, which is unavailable right now. Suggestions still reach the team by email.</p>
            ) : suggestions.length === 0 ? (
              <p className="text-sm text-ink-muted m-0">No suggestions yet. Be the first.</p>
            ) : (
              <ul className="list-none m-0 p-0 flex flex-col gap-3">
                {suggestions.map((s) => (
                  <li key={s.id} className="grain bg-paper-200 border border-ink-950/60 rounded-md p-4">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge tone={STATUS_TONE[s.status] || 'outline'}>{s.status}</Badge>
                      <span className="font-mono text-eyebrow text-ink-muted">{formatDate(s.created_at)}</span>
                      {s.name ? <span className="font-mono text-eyebrow text-ink-secondary">by {s.name}</span> : null}
                    </div>
                    <p className="text-sm text-ink-950 whitespace-pre-wrap m-0">{s.suggestion}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
