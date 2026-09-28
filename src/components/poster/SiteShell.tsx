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
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
