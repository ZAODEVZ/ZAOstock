import Link from 'next/link';
import Image from 'next/image';
import { SITE } from '@/content/site';

// Night in both modes, carrying on from the homepage's closing section. The
// white moose needs a dark ground, and night is one that never flips.
const LINKS = [
  { href: '/program', label: 'Program' },
  { href: '/press', label: 'Press' },
  { href: '/partners', label: 'Partners' },
  { href: '/build', label: 'Build' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/ellsworth', label: 'Ellsworth' },
  { href: '/acadia', label: 'Acadia' },
];

export function Footer() {
  return (
    <footer className="bg-night text-onfill/80 py-10 border-t border-onfill/10">
      <div className="wrap flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 shrink-0 rounded-full bg-night border border-onfill/20 flex items-center justify-center overflow-hidden">
            <Image src={SITE.logo.src} alt="" width={40} height={40} className="h-9 w-9 object-contain" />
          </span>
          <div className="text-sm">
            <p className="m-0">{SITE.producedBy}</p>
            <p className="m-0">
              <a href={`mailto:${SITE.contact}`} className="text-gold-400 underline underline-offset-4 hover:text-onfill">
                {SITE.contact}
              </a>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <nav aria-label="Footer" className="flex flex-wrap gap-5">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-onfill/70 hover:text-onfill">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
