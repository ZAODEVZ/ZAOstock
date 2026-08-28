import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Metadata } from 'next';
import { SiteShell } from '@/components/poster';
import { getStockTeamMember } from '@/lib/auth/session';
import { getOnePager } from '@/lib/onepagers';
import { CopyButton } from './CopyButton';
import { PrintButton } from './PrintButton';
import { OnePagerEditor } from './OnePagerEditor';
import { ActivityFeed } from './ActivityFeed';
import { listActivity } from '@/lib/onepagers';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = await getOnePager(slug).catch(() => null);
  if (!p) return { title: 'Not found' };
  return { title: p.title, description: p.purpose };
}

export default async function OnePagerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pager = await getOnePager(slug).catch(() => null);
  if (!pager) notFound();
  const activity = await listActivity(slug, 30).catch(() => []);

  const session = await getStockTeamMember();
  if (pager.visibility !== 'public' && !session) {
    return (
      <SiteShell>
      <main className="mx-auto max-w-3xl px-4 py-10 text-ink-950">
        <div className="rounded-md border-2 border-ink-950 bg-gold-300 p-6 shadow-hard">
          <h2 className="text-lg font-bold text-gold-600">Sign in required</h2>
          <p className="mt-2 text-sm text-ink-950">
            This one-pager is internal. <a href="/team" className="underline">Sign in</a> to view.
          </p>
        </div>
      </main>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
    <main className="mx-auto max-w-3xl px-4 py-10 text-ink-950">
      <div className="mb-6 flex items-center justify-between gap-4 print:hidden">
        <Link href="/onepagers" className="text-sm text-gold-600 hover:underline">
          &larr; All one-pagers
        </Link>
        <div className="flex items-center gap-2">
          <CopyButton text={pager.body} />
          <PrintButton />
        </div>
      </div>

      <header className="mb-6 border-b border-ink-950/60 pb-4 print:border-slate-300">
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <span className="rounded-full bg-paper-100 px-2 py-0.5 text-ink-950 print:bg-slate-200 print:text-slate-700">
            {pager.status}
          </span>
          <span>v{pager.version}</span>
          {pager.updated_at && <span>updated {pager.updated_at.slice(0, 10)}</span>}
          {pager.visibility === 'public' && (
            <span className="rounded-full border border-ink-950/60 bg-olive-300 px-2 py-0.5 text-olive-500">
              public link
            </span>
          )}
        </div>
        <h1 className="mt-3 text-2xl font-bold text-ink-950 print:text-slate-900">{pager.title}</h1>
        <p className="mt-1 text-sm text-ink-muted print:text-slate-700">For: {pager.audience}</p>
        {pager.meeting_date && (
          <p className="mt-1 text-xs text-gold-600 print:text-slate-700">
            Meeting: {pager.meeting_date}
            {pager.meeting_location ? ` · ${pager.meeting_location}` : ''}
          </p>
        )}
        {pager.reviewers && (
          <p className="mt-1 text-xs text-ink-muted print:hidden">Reviewers: {pager.reviewers}</p>
        )}
      </header>

      <article className="onepager-body text-sm leading-relaxed text-ink-950 print:text-slate-900 print:text-base">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{pager.body}</ReactMarkdown>
      </article>

      {session && (
        <section className="mt-10 print:hidden">
          <OnePagerEditor pager={pager} />
        </section>
      )}

      {session && activity.length > 0 && (
        <section className="mt-10 print:hidden">
          <ActivityFeed events={activity} />
        </section>
      )}

      <style>{`
        .onepager-body h1 { font-family: var(--font-display); font-size: 2rem; font-weight: 400; color: #241E15; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .onepager-body h2 { font-family: var(--font-display); font-size: 1.5rem; font-weight: 400; color: #241E15; margin-top: 1.25rem; margin-bottom: 0.5rem; }
        .onepager-body h3 { font-size: 1rem; font-weight: 800; color: #241E15; margin-top: 1rem; margin-bottom: 0.4rem; }
        .onepager-body p { margin-bottom: 0.75rem; }
        .onepager-body ul, .onepager-body ol { margin-left: 1.25rem; margin-bottom: 0.75rem; }
        .onepager-body ul { list-style: disc; }
        .onepager-body ol { list-style: decimal; }
        .onepager-body li { margin-bottom: 0.25rem; }
        .onepager-body strong { color: #241E15; font-weight: 700; }
        .onepager-body code { background: #FAF3E6; border: 1px solid rgba(36,30,21,0.6); padding: 1px 6px; border-radius: 3px; font-size: 0.85em; color: #241E15; }
        .onepager-body blockquote { border-left: 3px solid #241E15; padding-left: 1rem; margin: 1rem 0; color: #625A4E; font-style: italic; }
        .onepager-body a { color: #2E6494; text-decoration: underline; }
        .onepager-body table { border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: 0.9em; }
        .onepager-body th { background: #FAF3E6; color: #6A6256; padding: 6px 8px; text-align: left; border-bottom: 1px solid rgba(36,30,21,0.6); font-weight: 700; }
        .onepager-body td { padding: 6px 8px; border-bottom: 1px solid rgba(36,30,21,0.3); }
        .onepager-body hr { border: 0; border-top: 1px solid rgba(36,30,21,0.6); margin: 1.5rem 0; }
        @media print {
          .onepager-body h1, .onepager-body h2, .onepager-body h3 { color: #1e293b; }
          .onepager-body strong { color: #0f172a; }
          .onepager-body code { background: #f1f5f9; color: #1e293b; }
          .onepager-body blockquote { border-left-color: #241E15; color: #334155; }
          .onepager-body a { color: #1e293b; }
          .onepager-body th { background: #fef3c7; color: #92400e; }
          .onepager-body td, .onepager-body th { border-color: #e2e8f0; }
        }
      `}</style>
    </main>
    </SiteShell>
  );
}
