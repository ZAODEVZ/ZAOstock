import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { loadPressKit } from '@/lib/press-kit';
import { SITE, PARTNERS } from '@/content/site';
import { SiteShell, Section, Eyebrow, Badge, Button, Card, SectionHeader, PartnerLogo } from '@/components/poster';

// The kit's files, each with a direct download. Only files that exist in
// public/ are listed (docs/marketing/press-kit.md "Assets"); partner logos
// come from the same PARTNERS list the homepage and /partners render.
const BADGES = [
  { href: SITE.badge.src, label: 'ZAOstock 2026 badge, colour', note: 'the primary mark', alt: SITE.badge.alt },
  { href: '/brand/logos/zaostock26_badge_bw_final.png', label: 'ZAOstock 2026 badge, black and white', note: 'for single-colour print', alt: 'ZAOstock 26 badge, black and white' },
] as const;

// Static: the markdown is read once at build time, so a redeploy is what
// publishes a new docs/marketing/press-kit.md. Everything above that file's
// first `---` is MARKETING's instructions and is not rendered.
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Press',
  description: 'Press kit for ZAOstock 2026: the facts, brand files and press contact.',
  openGraph: {
    title: 'Press | ZAOstock',
    description: 'Press kit for ZAOstock 2026: the facts, brand files and press contact.',
    url: 'https://zaostock.com/press',
  },
};

/** MARKETING's file carries instructions above a `---` line and a Sources block below a second one. Render only the middle. */
function publishable(markdown: string): string {
  const parts = markdown.split(/\n---\n/);
  const middle = parts.length >= 3 ? parts.slice(1, -1).join('\n---\n') : parts.length === 2 ? parts[1] : markdown;
  // Whole-paragraph italic parentheticals are MARKETING's notes to SITE, not copy.
  return middle.replace(/^\*\([\s\S]*?\)\*\s*$/gm, '').trim();
}

type Segment = { markdown: string; hold?: string };

/**
 * The kit carries two HOLD blocks (the lineup until 1 September, the WaveWarZ
 * figure until re-pulled). Split them out so they render inside a real
 * <details>, closed by default, and cannot ship open by accident. SITE removes
 * this on the day. react-markdown escapes raw HTML, so the wrapper is JSX.
 */
function splitHolds(markdown: string): Segment[] {
  const markers: Array<{ re: RegExp; label: string }> = [
    { re: /\*\*HOLD until 1 September\.\*\*[\s\S]*?(?=\n## |$)/, label: 'Held until 1 September' },
    { re: /\*\*HOLD - re-pull before publishing\.\*\*[^\n]*/, label: 'Re-pull before publishing' },
  ];
  let segments: Segment[] = [{ markdown }];
  for (const m of markers) {
    segments = segments.flatMap((seg) => {
      if (seg.hold) return [seg];
      const match = seg.markdown.match(m.re);
      if (!match || match.index === undefined) return [seg];
      const before = seg.markdown.slice(0, match.index);
      const after = seg.markdown.slice(match.index + match[0].length);
      return [{ markdown: before }, { markdown: match[0].trim(), hold: m.label }, { markdown: after }];
    });
  }
  return segments.filter((s) => s.markdown.trim().length > 0);
}

export default function PressPage() {
  const kit = loadPressKit();
  const segments = kit.source === 'file' ? splitHolds(publishable(kit.markdown)) : [{ markdown: kit.markdown }];

  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Press</Eyebrow>
          {kit.source === 'placeholder' ? (
            <div className="mt-3">
              <Badge tone="gold">Placeholder - full kit coming</Badge>
            </div>
          ) : null}
          <article className="press-body mt-4 text-base text-ink-950">
            {segments.map((seg, i) =>
              seg.hold ? (
                <details key={i}>
                  <summary>{seg.hold}</summary>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{seg.markdown}</ReactMarkdown>
                </details>
              ) : (
                <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}>
                  {seg.markdown}
                </ReactMarkdown>
              ),
            )}
          </article>
        </div>
      </Section>

      {/* The kit itself: every file a newsroom can take today, each with a direct download. */}
      <Section id="kit">
        <SectionHeader
          eyebrow="Press kit"
          title="Files you can use today."
          lede={`The official mark in two versions and the partner logos as supplied. Credit the mark to Samantha "Candy", CandyToyBox. Photos and artist bios are not available yet; ask.`}
          className="mb-6"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
          {BADGES.map((b) => (
            <Card key={b.href} className="p-0">
              <div className="flex items-center justify-center bg-paper-100 border-b-2 border-ink-950 p-5">
                <Image src={b.href} alt={b.alt} width={SITE.badge.width} height={SITE.badge.height} sizes="240px" className="h-[180px] w-auto rounded-sm border-2 border-ink-950" />
              </div>
              <div className="p-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-sans font-extrabold text-base text-ink-950 m-0">{b.label}</p>
                  <p className="text-[13px] text-ink-muted m-0 mt-0.5">PNG, {b.note}</p>
                </div>
                <Button href={b.href} external variant="secondary" size="sm">
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {PARTNERS.some((p) => p.logoSrc) ? (
          <>
            <h3 className="font-sans font-extrabold text-h4 text-ink-950 m-0 mb-3">Partner logos</h3>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 m-0 p-0 list-none">
              {PARTNERS.filter((p) => p.logoSrc).map((p) => (
                <li key={p.name} className="grain bg-paper-200 border border-ink-950/60 rounded-md px-4 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <PartnerLogo src={p.logoSrc!} name={p.name} />
                    <span className="font-sans font-bold text-sm text-ink-950 truncate">{p.name}</span>
                  </div>
                  <a href={p.logoSrc} download className="shrink-0 text-sm text-denim-400 font-semibold underline underline-offset-4 hover:text-denim-500">
                    Download
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-[13px] text-ink-muted mt-3 m-0 measure">Each partner owns its mark. Use them as supplied, next to the ZAOstock mark, and not on their own.</p>
          </>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={`mailto:${SITE.contact}`} external variant="primary" size="sm">
            Press contact
          </Button>
          <Button href="/partners" variant="secondary" size="sm">
            All partners
          </Button>
          <Button href="/program" variant="secondary" size="sm">
            The program
          </Button>
        </div>
      </Section>

      <style>{`
        .press-body h1 { font-family: var(--font-display); font-weight: 400; font-size: 2.75rem; line-height: 1.05; letter-spacing: -0.01em; margin: 0 0 1rem; text-wrap: balance; }
        @media (min-width: 640px) { .press-body h1 { font-size: 3.5rem; } }
        .press-body h2 { font-family: var(--font-display); font-weight: 400; font-size: 2rem; line-height: 1.05; letter-spacing: -0.01em; margin: 2rem 0 0.75rem; text-wrap: balance; }
        @media (min-width: 640px) { .press-body h2 { font-size: 2.5rem; } }
        .press-body h3 { font-family: var(--font-display); font-weight: 400; font-size: 1.75rem; line-height: 1.1; margin: 1.5rem 0 0.5rem; }
        .press-body p { margin: 0 0 0.75rem; max-width: 65ch; color: var(--color-ink-950); }
        .press-body p:first-of-type { font-size: 1.125rem; color: var(--color-ink-secondary); }
        .press-body ul, .press-body ol { margin: 0 0 0.75rem 1.25rem; max-width: 65ch; }
        .press-body ul { list-style: disc; }
        .press-body ol { list-style: decimal; }
        .press-body li { margin-bottom: 0.25rem; }
        .press-body strong { font-weight: 700; }
        .press-body em { color: var(--color-ink-secondary); }
        .press-body a { color: var(--color-denim-400); text-decoration: underline; text-underline-offset: 4px; overflow-wrap: anywhere; }
        .press-body table { display: block; overflow-x: auto; max-width: 100%; }
        .press-body a:hover { color: var(--color-denim-500); }
        .press-body code { font-family: var(--font-mono); font-size: 0.875em; background: var(--color-paper-200); border: 1px solid rgba(36, 30, 21, 0.6); border-radius: 4px; padding: 1px 6px; overflow-wrap: anywhere; }
        .press-body table { width: 100%; border: 1px solid rgba(36, 30, 21, 0.6); border-radius: 14px; border-collapse: separate; border-spacing: 0; overflow: hidden; margin: 1rem 0; font-size: 0.875rem; }
        .press-body thead:empty, .press-body th:empty { display: none; }
        .press-body th { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-ink-muted); text-align: left; padding: 10px 20px; border-bottom: 1px solid rgba(36, 30, 21, 0.6); }
        .press-body td { padding: 10px 20px; border-top: 1px solid rgba(36, 30, 21, 0.6); vertical-align: top; }
        .press-body tr:first-child td { border-top: 0; }
        .press-body td:first-child { font-weight: 700; color: var(--color-ink-muted); letter-spacing: 0.04em; }
        .press-body td:last-child { font-weight: 600; }
        .press-body details { background: var(--color-paper-200); border: 2px solid var(--color-ink-950); border-radius: 14px; padding: 12px 20px; margin: 1rem 0; box-shadow: var(--shadow-hard); }
        .press-body summary { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-gold-600); cursor: pointer; }
        .press-body hr { border: 0; border-top: 1px solid rgba(36, 30, 21, 0.6); margin: 1.5rem 0; }
      `}</style>
    </SiteShell>
  );
}
