import Link from 'next/link';
import Image from 'next/image';
import { SITE } from '@/content/site';

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
    <footer className="border-t border-ink-950/60 py-8">
      <div className="wrap flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image src={SITE.badge.src} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover border-2 border-ink-950" />
          <div className="text-sm text-ink-secondary">
            <p className="m-0">{SITE.producedBy}</p>
            <p className="m-0">
              <a href={`mailto:${SITE.contact}`} className="text-denim-400 underline underline-offset-4 hover:text-denim-500">
                {SITE.contact}
              </a>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <nav aria-label="Footer" className="flex flex-wrap gap-5">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="font-sans text-xs font-bold uppercase tracking-[0.04em] text-ink-secondary hover:text-ink-950">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
