import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE } from '@/content/site';
import {
  ARTIST_DATES,
  BRING,
  PROVIDED,
  SOUNDCHECK,
  addMinutes,
  clock12,
  findActByCode,
  missingItems,
} from '@/content/artist-ops';
import { getArtistOpsStatus, slugify } from '@/lib/artists';
import { BackstageAsks } from './BackstageAsks';

// One page per act, gated by the code in the URL. No site nav, no footer -
// this is a private sheet, not a page of the public site, per Zaal's
// 2026-09-16 review: the old version "looked like a public site page" and
// that was part of what made it feel wrong to fill in.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Backstage | ZAOstock',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ code: string }>;
}

export default async function BackstagePage({ params }: Props) {
  const { code } = await params;
  const act = findActByCode(code);
  if (!act) notFound();

  const setEnd = addMinutes(act.setStart, act.minutes);
  // Never lets a query failure or a name mismatch take the rest of the page
  // down with it - see the comment on getArtistOpsStatus.
  const status = await getArtistOpsStatus(act.name).catch(() => null);
  const missing = status ? missingItems(status) : null;

  return (
    <div className="site min-h-[100dvh] bg-paper-100 text-ink-950">
      <div className="mx-auto max-w-[560px] px-4 py-8 sm:py-12 space-y-6">
        <div>
          <p className="font-sans text-eyebrow font-extrabold uppercase tracking-[0.16em] text-ink-muted m-0 mb-1">
            Backstage
          </p>
          <h1 className="font-display font-normal text-[2rem] leading-[1.05] text-ink-950 m-0">{act.name}</h1>
          <p className="text-sm text-ink-secondary mt-2 mb-0">
            You are on the ZAOstock bill, Saturday 3 October, Franklin Street Parklet, Ellsworth. This page is yours -
            please do not share the link.
          </p>
        </div>

        {missing && missing.length > 0 && (
          <section className="rounded-[14px] border-[1.5px] border-gold-500/60 bg-paper-200 p-5">
            <p className="font-sans text-eyebrow font-extrabold uppercase tracking-[0.16em] text-denim-400 m-0 mb-3">
              What we still need from you
            </p>
            <BackstageAsks code={code} missing={missing} />
          </section>
        )}

        {missing && missing.length === 0 && (
          <section className="rounded-[14px] border-[1.5px] border-gold-500/60 bg-paper-200 p-5">
            <p className="font-sans text-eyebrow font-extrabold uppercase tracking-[0.16em] text-denim-400 m-0 mb-2">
              You are all set
            </p>
            <p className="text-sm text-ink-950 m-0">
              Your page is live:{' '}
              <a href={`https://zaostock.com/artist/${slugify(act.name)}`} className="underline font-bold">
                zaostock.com/artist/{slugify(act.name)}
              </a>
            </p>
          </section>
        )}

        <section className="rounded-[14px] border-[1.5px] border-gold-500/60 bg-paper-200 p-5">
          <p className="font-sans text-eyebrow font-extrabold uppercase tracking-[0.16em] text-ink-muted m-0 mb-2">
            Your set
          </p>
          <p className="text-xl font-extrabold text-ink-950 m-0">
            {clock12(act.setStart)} to {clock12(setEnd)}, {act.minutes} minutes
          </p>
          <p className="text-sm text-ink-secondary mt-2 mb-0">
            On the parklet stage. Soundcheck is {SOUNDCHECK.day}, {SOUNDCHECK.window}. Your time is locked; you do not
            need to tell us it.
          </p>
        </section>

        <details className="rounded-[14px] border-[1.5px] border-gold-500/60 bg-paper-200 p-5">
          <summary className="font-sans text-eyebrow font-extrabold uppercase tracking-[0.16em] text-ink-muted cursor-pointer">
            The weekend, what to bring, what is there for you
          </summary>
          <div className="mt-4 space-y-4">
            <dl className="m-0 space-y-3">
              {ARTIST_DATES.map((d, i) => (
                <div key={i}>
                  <dt className="text-xs font-bold text-ink-muted m-0">{d.when}</dt>
                  <dd className="text-sm text-ink-950 m-0 mt-0.5">{d.what}</dd>
                </div>
              ))}
            </dl>
            <div>
              <p className="text-xs font-bold text-ink-muted m-0 mb-1">Bring</p>
              <ul className="text-sm text-ink-secondary m-0 pl-5 space-y-1">
                {BRING.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-ink-muted m-0 mb-1">There for you</p>
              <ul className="text-sm text-ink-secondary m-0 pl-5 space-y-1">
                {PROVIDED.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </details>

        <p className="text-sm text-ink-secondary text-center">
          Anything at all:{' '}
          <a href={`mailto:${SITE.contact}`} className="underline">
            {SITE.contact}
          </a>
        </p>
      </div>
    </div>
  );
}
