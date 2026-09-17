import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE } from '@/content/site';
import { ARTIST_DATES, BRING, PROVIDED, SOUNDCHECK, addMinutes, clock12, findActByCode } from '@/content/artist-ops';
import { slugify } from '@/lib/artists';

// One page per act, gated by the code in the URL. No site nav, no footer -
// this is a private sheet, not a page of the public site, per Zaal's
// 2026-09-16 review: the old version "looked like a public site page" and
// that was part of what made it feel wrong to fill in.
//
// NO ON-PAGE FORM as of 2026-09-17 (Zaal: "remove the form and just ask
// them in the message what we still need from each of them"). The native
// fill-in-fields form this replaced (2026-09-16, BackstageAsks +
// PATCH /api/backstage/<code>) is still the write mechanism when the seat
// or Zaal enters what an artist sends back - the PATCH route is untouched -
// but the artist is never shown a form to fill in themselves. The ask now
// lives in the outreach message sent to each artist (per-artist, computed
// from missingItems() at send time), and the reply channel is the email
// line at the bottom of this page.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Backstage',
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

        <section className="rounded-[14px] border-[1.5px] border-gold-500/60 bg-paper-200 p-5">
          <p className="font-sans text-eyebrow font-extrabold uppercase tracking-[0.16em] text-ink-muted m-0 mb-3">
            Your flyer
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element -- a generated route, not a static asset next/image can optimize */}
          <img
            src={`/artist/${slugify(act.name)}/flyer`}
            alt={`${act.name} - ZAOstock, Saturday 3 October, Franklin Street Parklet, Ellsworth, Maine`}
            className="w-full rounded-[10px] border-[1.5px] border-ink-950/20"
          />
          <div className="mt-3 flex flex-wrap gap-4">
            <a href={`/artist/${slugify(act.name)}/flyer`} download className="text-sm font-bold underline text-ink-950">
              Download (wide)
            </a>
            <a href={`/artist/${slugify(act.name)}/flyer?variant=ig`} download className="text-sm font-bold underline text-ink-950">
              Download (Instagram)
            </a>
          </div>
        </section>

        <section className="rounded-[14px] border-[1.5px] border-gold-500/60 bg-paper-200 p-5">
          <p className="font-sans text-eyebrow font-extrabold uppercase tracking-[0.16em] text-denim-400 m-0 mb-2">
            Your page
          </p>
          <p className="text-sm text-ink-950 m-0">
            <a href={`https://zaostock.com/artist/${slugify(act.name)}`} className="underline font-bold">
              zaostock.com/artist/{slugify(act.name)}
            </a>
          </p>
        </section>

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
