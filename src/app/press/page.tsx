import { Metadata } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { loadPressKit, PRESS_CONTACT } from '@/lib/press-kit';

// Static: the markdown is read once at build time, so a redeploy is what
// publishes a new press-kit.md. Nothing here touches the database.
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Press | ZAOstock',
  description: 'Press kit for ZAOstock 2026: the facts, brand files and press contact.',
  openGraph: {
    title: 'Press | ZAOstock',
    description: 'Press kit for ZAOstock 2026: the facts, brand files and press contact.',
    url: 'https://zaostock.com/press',
  },
};

export default function PressPage() {
  const kit = loadPressKit();

  return (
    <div className="min-h-[100dvh] bg-[#0a1628] text-white pb-16">
      <header className="sticky top-0 z-40 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xs text-gray-400 hover:text-[#f5a623]">
            &larr; ZAOstock
          </Link>
          <span className="text-xs text-gray-500">Press</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {kit.source === 'placeholder' && (
          <p className="text-xs text-[#f5a623] uppercase tracking-wider font-bold">
            Placeholder - full kit coming
          </p>
        )}

        <article className="press-body text-sm leading-relaxed text-gray-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{kit.markdown}</ReactMarkdown>
        </article>

        <p className="text-xs text-gray-500">
          Press contact: <a href={`mailto:${PRESS_CONTACT}`} className="text-[#f5a623] underline">{PRESS_CONTACT}</a>
        </p>
      </div>

      <style>{`
        .press-body h1 { font-size: 1.75rem; font-weight: 800; color: #fff; letter-spacing: -0.01em; margin-bottom: 0.75rem; }
        .press-body h2 { font-size: 1.125rem; font-weight: 700; color: #f5a623; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .press-body h3 { font-size: 1rem; font-weight: 700; color: #fbbf24; margin-top: 1rem; margin-bottom: 0.4rem; }
        .press-body p { margin-bottom: 0.75rem; }
        .press-body ul, .press-body ol { margin-left: 1.25rem; margin-bottom: 0.75rem; }
        .press-body ul { list-style: disc; }
        .press-body ol { list-style: decimal; }
        .press-body li { margin-bottom: 0.25rem; }
        .press-body strong { color: #fff; font-weight: 700; }
        .press-body code { background: #0d1b2a; padding: 1px 6px; border-radius: 3px; font-size: 0.85em; color: #c7d2fe; }
        .press-body blockquote { border-left: 3px solid rgba(245, 166, 35, 0.5); padding-left: 1rem; margin: 1rem 0; color: #cbd5e1; font-style: italic; }
        .press-body a { color: #f5a623; text-decoration: underline; }
        .press-body table { border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: 0.9em; }
        .press-body th { background: rgba(245, 166, 35, 0.1); color: #f5a623; padding: 6px 8px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: 700; }
        .press-body td { padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.06); vertical-align: top; }
        .press-body hr { border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 1.5rem 0; }
      `}</style>
    </div>
  );
}
