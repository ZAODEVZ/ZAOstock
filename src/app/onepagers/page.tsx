import Link from 'next/link';
import { Metadata } from 'next';
import { SiteShell } from '@/components/poster';
import { getStockTeamMember } from '@/lib/auth/session';
import { listOnePagers } from '@/lib/onepagers';

export const metadata: Metadata = {
  title: 'ZAOstock One-Pagers',
  description: 'Briefing docs for sponsors, partners, venues, and city contacts.',
};

export const dynamic = 'force-dynamic';

const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-paper-100 text-ink-950',
  review: 'bg-gold-300 text-gold-600 border border-ink-950/60',
  final: 'bg-olive-300 text-olive-500 border border-ink-950/60',
  sent: 'bg-denim-300 text-denim-500 border border-ink-950/60',
  archived: 'bg-paper-100 text-ink-muted',
};

export default async function OnePagersPage() {
  const session = await getStockTeamMember();
  const all = await listOnePagers().catch(() => []);
  // Public guests see only the rich overview onepager. Internal teammates see all.
  const visible = session
    ? all
    : all.filter((p) => p.visibility === 'public' && p.slug === 'overview');

  return (
    <SiteShell>
    <main className="mx-auto max-w-4xl px-4 py-10 text-ink-950">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gold-600">One-Pagers</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Briefing docs for sponsors, partners, venues, and city contacts. Each is a single page meant to be printed, emailed, or shared. Drafted via Claude <code className="rounded bg-paper-200 px-1 py-0.5 text-xs">/onepager</code> skill or DM the team bot. Edited inline below.
        </p>
      </header>

      {!session && (
        <div className="mb-6 rounded-lg border border-ink-950/60 bg-gold-300 px-4 py-3 text-sm text-gold-600">
          You&apos;re viewing as a guest - only public one-pagers are listed. <a href="/team" className="underline">Sign in</a> to see internal drafts.
        </div>
      )}

      {visible.length === 0 ? (
        <div className="rounded-xl border border-ink-950/60 bg-paper-200 p-8 text-center text-sm text-ink-muted">
          No published one-pagers yet — check back soon.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((p) => (
            <Link
              key={p.slug}
              href={`/onepagers/${p.slug}`}
              className="group block rounded-xl border border-ink-950/60 bg-paper-200 p-5 transition hover:border-ink-950/60 hover:bg-paper-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-ink-950 group-hover:text-gold-600">{p.title}</h2>
                  <p className="mt-1 text-sm text-ink-muted">For: {p.audience}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-950">{p.purpose}</p>
                  {p.meeting_date && (
                    <p className="mt-2 text-xs text-gold-600">
                      Meeting: {p.meeting_date}
                      {p.meeting_location ? ` · ${p.meeting_location}` : ''}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      STATUS_COLOR[p.status] ?? STATUS_COLOR.draft
                    }`}
                  >
                    {p.status}
                  </span>
                  <span className="text-[10px] text-ink-muted">v{p.version}</span>
                  {p.visibility === 'public' && (
                    <span className="rounded-full border border-ink-950/60 bg-olive-300 px-2 py-0.5 text-[10px] text-olive-500">
                      public
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
    </SiteShell>
  );
}
