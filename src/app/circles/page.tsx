import { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import { SiteShell } from '@/components/poster';
import { CirclesView } from './CirclesView';

export const metadata: Metadata = {
  title: 'ZAOstock Circles',
  description: 'Eight circles for the Oct 3 festival. Anyone can join. Zaal coordinates by default until someone volunteers.',
  alternates: { canonical: '/circles' },
  openGraph: {
    title: 'ZAOstock Circles',
    description: 'Eight circles for the Oct 3 festival. Anyone can join.',
    url: 'https://zaostock.com/circles',
    images: [OG_IMAGE],
  },
};

export const dynamic = 'force-dynamic';

export default function CirclesPage() {
  return (
    <SiteShell>
    <div className="mx-auto max-w-5xl px-4 py-10 text-ink-950">
      <header className="mb-8">
        <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] text-ink-950 m-0">Circles</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Eight circles for ZAOstock Oct 3. Pick what you want to work on. Multiple is fine. Zero is fine. Coordinators rotate when someone volunteers - no schedule, no rules.
        </p>
      </header>
      <CirclesView />
    </div>
    </SiteShell>
  );
}
