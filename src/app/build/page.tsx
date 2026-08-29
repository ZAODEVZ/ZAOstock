import { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { OG_IMAGE } from '@/lib/meta';
import { SITE } from '@/content/site';
import { SiteShell, Section, Eyebrow, Button } from '@/components/poster';

// The builder kit. docs/builders/build-on-zaostock-2026-08-29.md is the
// source; this route renders it at build time, the same way /press renders
// the press kit. Written 29 Aug 2026 for the ZABAL Gamez builder battle.
export const dynamic = 'force-static';

const KIT_PATH = path.join(process.cwd(), 'docs', 'builders', 'build-on-zaostock-2026-08-29.md');

export const metadata: Metadata = {
  title: 'Build on ZAOstock',
  description: 'Five things the festival needs built, what exists, where it plugs in, and how to show it live: the builder kit for ZAOstock 2026.',
  alternates: { canonical: '/build' },
  openGraph: {
    title: 'Build on ZAOstock | ZAOstock',
    description: 'Five things the festival needs built, what exists, where it plugs in, and how to show it live.',
    url: 'https://zaostock.com/build',
    images: [OG_IMAGE],
  },
};

export default function BuildPage() {
  const markdown = readFileSync(KIT_PATH, 'utf8').replace(/^# [^\n]*\n/, '').trim();

  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Builders · ZAOstock 2026</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">Build on ZAOstock.</h1>
          <article className="press-body text-base text-ink-950">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </article>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="https://github.com/ZAODEVZ/ZAOstock" external size="sm">
              The site repo
            </Button>
            <Button href="/press" variant="secondary" size="sm">
              Press kit and logos
            </Button>
            <Button href="/program" variant="secondary" size="sm">
              The program
            </Button>
            <Button href={`mailto:${SITE.contact}`} external variant="secondary" size="sm">
              {SITE.contact}
            </Button>
          </div>
        </div>
      </Section>

      <style>{`
        .press-body h2 { font-family: var(--font-display); font-weight: 400; font-size: 2rem; line-height: 1.05; letter-spacing: -0.01em; margin: 2rem 0 0.75rem; text-wrap: balance; }
        @media (min-width: 640px) { .press-body h2 { font-size: 2.5rem; } }
        .press-body h3 { font-family: var(--font-display); font-weight: 400; font-size: 1.75rem; line-height: 1.1; margin: 1.75rem 0 0.5rem; }
        .press-body p { margin: 0 0 0.75rem; max-width: 65ch; color: var(--color-ink-950); }
        .press-body p:first-of-type { font-size: 1.125rem; color: var(--color-ink-secondary); }
        .press-body ul, .press-body ol { margin: 0 0 0.75rem 1.25rem; max-width: 65ch; }
        .press-body ul { list-style: disc; }
        .press-body ol { list-style: decimal; }
        .press-body li { margin-bottom: 0.35rem; }
        .press-body strong { font-weight: 700; }
        .press-body a { color: var(--color-denim-400); text-decoration: underline; text-underline-offset: 4px; overflow-wrap: anywhere; }
        .press-body a:hover { color: var(--color-denim-500); }
        .press-body code { font-family: var(--font-mono); font-size: 0.875em; background: var(--color-paper-200); border: 1px solid rgba(36, 30, 21, 0.6); border-radius: 4px; padding: 1px 6px; overflow-wrap: anywhere; }
        .press-body table { display: block; overflow-x: auto; max-width: 100%; width: 100%; border: 1px solid rgba(36, 30, 21, 0.6); border-radius: 14px; border-collapse: separate; border-spacing: 0; margin: 1rem 0; font-size: 0.875rem; }
        .press-body thead:empty, .press-body th:empty { display: none; }
        .press-body th { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-ink-muted); text-align: left; padding: 10px 20px; border-bottom: 1px solid rgba(36, 30, 21, 0.6); }
        .press-body td { padding: 10px 20px; border-top: 1px solid rgba(36, 30, 21, 0.6); vertical-align: top; }
        .press-body tr:first-child td { border-top: 0; }
        .press-body td:first-child { font-weight: 700; color: var(--color-ink-muted); letter-spacing: 0.04em; white-space: nowrap; }
        .press-body td:last-child { font-weight: 600; }
      `}</style>
    </SiteShell>
  );
}
