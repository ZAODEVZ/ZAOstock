import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

// Opt-in shell for public routes. /team/** keeps its own look until after
// 3 October (DESIGN.md), so this is not in the root layout.
//
// `site` switches on the front page's look (globals.css, .site). `lightOnly`
// is for the printable pages, whose documents are drawn on white and would
// read wrongly inside a dark page.
export function SiteShell({ children, lightOnly = false }: { children: ReactNode; lightOnly?: boolean }) {
  return (
    <div className={`site${lightOnly ? ' site-light' : ''} min-h-[100dvh] flex flex-col bg-paper-100 text-ink-950`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-paper-100 focus:px-4 focus:py-3 focus:font-sans focus:text-sm focus:font-bold focus:text-ink-950 focus:[box-shadow:var(--shadow-focus)]"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
