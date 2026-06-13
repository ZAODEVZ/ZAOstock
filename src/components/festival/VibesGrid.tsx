import { TiltCard } from './TiltCard';

interface Vibe {
  src: string;
  alt: string;
  caption: string;
  tag: string;
  span?: string;
}

const VIBES: Vibe[] = [
  {
    src: '/zao/wavewarz-banner.jpg',
    alt: 'WaveWarZ live stage with crowd',
    caption: 'WaveWarZ live battle, Miami 2024',
    tag: 'IRL · Miami',
    span: 'col-span-2 row-span-2',
  },
  {
    src: '/zao/wavewarz-zaal.jpg',
    alt: 'Zaal performing at WaveWarZ',
    caption: 'Live cipher recording on site',
    tag: 'Cipher',
  },
  {
    src: '/zao/zabal-art.jpeg',
    alt: 'Geometric community art',
    caption: 'Creative energy across the day',
    tag: 'Art',
  },
  {
    src: '/zao/zaal-real.jpg',
    alt: 'Zaal photo at event',
    caption: 'Run by community, for community',
    tag: 'Community',
  },
];

export function VibesGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 auto-rows-[160px] sm:auto-rows-[200px]">
      {VIBES.map((v) => (
        <TiltCard key={v.src} className={v.span || ''}>
          <figure className="relative h-full w-full overflow-hidden border border-white/[0.12] rounded-xl bg-[#0d1b2a] group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={v.src}
              alt={v.alt}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[#f5a623] block">
                {v.tag}
              </span>
              <p className="text-xs sm:text-sm text-white font-semibold mt-1 leading-tight">{v.caption}</p>
            </figcaption>
          </figure>
        </TiltCard>
      ))}
    </div>
  );
}
