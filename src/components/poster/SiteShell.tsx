import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

// Opt-in shell for public routes. /team/** keeps its own look until after
// 3 October (DESIGN.md), so this is not in the root layout.
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-paper-100 text-ink-950">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
