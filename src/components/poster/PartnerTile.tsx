import type { Partner } from '@/content/site';
import { Badge } from './primitives';

// One partner, one tile. The logo box is height-locked (40px under 960, 48px
// at 960 and up; docs/marketing/partner-logo-strip-spec.md) so wordmarks and
// badges read at the same weight. When no file exists the tile is text only
// and says so: never a broken image, never a placeholder box.
//
// Intrinsic sizes of the files in public/partners/ (DESIGN.md: every image has
// width and height). A file not listed here still renders; it just cannot
// reserve its box before load.
const LOGO_SIZE: Record<string, { width: number; height: number }> = {
  '/partners/black-moon.png': { width: 373, height: 400 },
  '/partners/star-977.png': { width: 756, height: 400 },
  '/partners/wallace-events.png': { width: 1000, height: 307 },
  '/partners/wavewarz.png': { width: 800, height: 800 },
  '/partners/coc-concertz.png': { width: 400, height: 400 },
  '/partners/bomb-squad.png': { width: 281, height: 400 },
  '/partners/black-moon.jpg': { width: 717, height: 717 },
  '/partners/star-977.jpg': { width: 399, height: 211 },
  '/partners/coc-concertz.jpg': { width: 1024, height: 1024 },
};

export function PartnerLogo({ src, name, className }: { src: string; name: string; className?: string }) {
  const size = LOGO_SIZE[src];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static file, sized by CSS height, no optimisation pass wanted on partner marks
    <img
      src={src}
      alt={`${name} logo`}
      width={size?.width}
      height={size?.height}
      loading="lazy"
      className={className ?? 'h-10 lg:h-12 w-auto max-w-[160px] object-contain object-left'}
    />
  );
}

export function PartnerTile({ partner, showComing }: { partner: Partner; showComing?: boolean }) {
  const { name, role, logoSrc } = partner;
  return (
    <li className="grain bg-paper-200 border border-ink-950/60 rounded-md px-4 py-4 flex flex-col gap-3 list-none">
      {logoSrc ? (
        <div className="h-10 lg:h-12 flex items-center">
          <PartnerLogo src={logoSrc} name={name} />
        </div>
      ) : showComing ? (
        <div className="h-10 lg:h-12 flex items-center">
          <Badge>Logo coming</Badge>
        </div>
      ) : null}
      <div>
        <p className="font-sans font-bold text-sm text-ink-950 m-0">{name}</p>
        {role !== 'UNSET' ? <p className="text-[13px] text-ink-muted m-0 mt-0.5">{role}</p> : null}
      </div>
    </li>
  );
}
