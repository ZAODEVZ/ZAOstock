import type { Partner } from '@/content/site';
import { Badge } from './primitives';

// One partner, one tile. The logo box is height-locked (40px under 960, 48px
// at 960 and up; docs/marketing/partner-logo-strip-spec.md) so wordmarks and
// badges read at the same weight. When no file exists the tile is text only
// and says so: never a broken image, never a placeholder box.
//
// The logo sits on a light plate that never flips: several marks are dark
// artwork on transparent and would vanish on a dark-mode card.
//
// Intrinsic sizes of the files in public/partners/ (DESIGN.md: every image has
// width and height). A file not listed here still renders; it just cannot
// reserve its box before load.
// 2026-09-16 logo audit: three entries here (black-moon.jpg, star-977.jpg,
// coc-concertz.jpg) named files that do not exist in public/partners/ - every
// real logoSrc in PARTNERS is a .png, so those three were dead and
// unreachable. artizen.png was missing entirely, so its <img> rendered with
// no explicit width/height (a layout-shift risk none of the other six had).
export const LOGO_SIZE: Record<string, { width: number; height: number }> = {
  '/partners/black-moon.png': { width: 373, height: 400 },
  '/partners/star-977.png': { width: 756, height: 400 },
  '/partners/wallace-events.png': { width: 1000, height: 307 },
  '/partners/wavewarz.png': { width: 800, height: 800 },
  '/partners/coc-concertz.png': { width: 400, height: 400 },
  '/partners/bomb-squad.png': { width: 281, height: 400 },
  '/partners/artizen.png': { width: 1206, height: 257 },
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
    <li className="bg-paper-200 border-[1.5px] border-gold-500/60 rounded-[14px] shadow-hard px-4 py-4 flex flex-col gap-3 list-none">
      {logoSrc ? (
        <div className="h-12 lg:h-14 self-start flex items-center rounded-[8px] bg-onfill px-2">
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
