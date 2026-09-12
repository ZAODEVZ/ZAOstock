import type { Metadata } from 'next';
import Image from 'next/image';
import { SiteShell, Section, SectionHeader, Card, Button, Eyebrow, Badge } from '@/components/poster';
import { COLOURS, FONTS, MARKS, RULES, SIGNS, ILLUSTRATIONS, type KitArt } from '@/content/design-kit';

export const metadata: Metadata = {
  title: 'Design kit | ZAOstock',
  description: 'The ZAOstock marks, colours, type and the rules for using them. Every file downloads.',
};

// One tile per piece of Candy's artwork: the image on paper, its name, and the
// file itself as the download.
function ArtGrid({ items, cols }: { items: readonly KitArt[]; cols: string }) {
  return (
    <div className={`grid gap-3 ${cols}`}>
      {items.map((a) => (
        <a
          key={a.file}
          href={a.file}
          download
          className="group flex flex-col overflow-hidden rounded-[14px] border-[1.5px] border-gold-500/60 bg-paper-200 shadow-hard no-underline transition-transform hover:-translate-y-0.5"
        >
          {/* A light plate in both modes: the art is drawn for cream. */}
          <span className="flex h-[140px] items-center justify-center bg-onfill p-3">
            {/* unoptimized: these are Candy's own small webps. Through the optimiser a
                160px file came back unscaled for a 640w request, and the
                browser drew it at a quarter of its size. */}
            <Image src={a.file} alt={a.name} width={a.width} height={a.height} unoptimized className="max-h-[116px] max-w-full w-auto h-auto" />
          </span>
          <span className="flex items-center justify-between gap-2 border-t border-gold-500/40 px-3 py-2">
            <span className="text-sm font-bold text-ink-950">{a.name}</span>
            <span className="font-mono text-[11px] text-ink-muted group-hover:text-ink-950">WEBP</span>
          </span>
        </a>
      ))}
    </div>
  );
}

export default function DesignKitPage() {
  return (
    <SiteShell>
      <Section first className="pt-10 sm:pt-14">
        <SectionHeader
          as="h1"
          eyebrow="Design kit"
          title="The ZAOstock look, to take away."
          lede="Our marks, colours and type, with the few rules that keep them looking right. Every file downloads. For press copy and partner logos, see the press page."
        />
      </Section>

      <Section id="marks">
        <SectionHeader eyebrow="Marks" title="Logos" className="mb-6" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MARKS.map((m) => (
            <Card key={m.file} className="p-0">
              <div className={`flex items-center justify-center border-b-2 border-ink-950 p-5 ${m.dark ? 'bg-night' : 'bg-paper-100'}`}>
                <Image src={m.file} alt={m.alt} width={m.width} height={m.height} sizes="240px" className="h-[180px] w-auto" />
              </div>
              <div className="p-5 flex flex-wrap items-center justify-between gap-3">
                <div className="max-w-[28ch]">
                  <p className="font-sans font-extrabold text-base text-ink-950 m-0">{m.name}</p>
                  <p className="text-[13px] text-ink-muted m-0 mt-0.5">{m.format}. {m.note}</p>
                </div>
                <Button href={m.file} external variant="secondary" size="sm">
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="signage">
        <SectionHeader
          eyebrow="Signage"
          title="Signs for the day"
          lede={'Directional and welcome signs from Candy\u2019s design system, at web size for screens and posts. Print versions come from her master files, so ask before printing any of these.'}
          className="mb-6"
        />
        <ArtGrid items={SIGNS} cols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" />
      </Section>

      <Section id="illustrations">
        <SectionHeader eyebrow="Illustrations" title="The poster pieces" lede="Hand-drawn pieces to build a post or a flyer from. Keep them whole: no recolouring or cropping." className="mb-6" />
        <ArtGrid items={ILLUSTRATIONS} cols="grid-cols-2 sm:grid-cols-4" />
        <p className="text-[13px] text-ink-muted mt-4 m-0">Signage and illustrations by Samantha &ldquo;Candy&rdquo;, CandyToyBox.</p>
      </Section>

      <Section id="colours">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          {/* The front page's palette since 2026-09-10 (Zaal: "Front page's").
              Candy's earlier design-system inks, first drawn from the retired
              2026 badge, are what /team still wears. */}
          <SectionHeader
            eyebrow="Colour"
            title="The colours"
            lede="Candy's palette from her site build, the one every public page wears. The site's token name comes first, her name for the colour in the line. When your system is in dark mode, her dark variant takes over."
          />
          <Button href="/design/zaostock-colours.css" variant="secondary" size="sm">
            Download the palette
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COLOURS.map((c) => (
            <div key={c.token} className="flex items-start gap-3 rounded-[14px] border-[1.5px] border-gold-500/60 bg-paper-200 p-3 shadow-hard">
              <span className="h-12 w-12 shrink-0 rounded-[8px] border border-ink-950/20" style={{ background: c.hex }} aria-hidden />
              <div>
                <p className="font-mono text-sm font-bold text-ink-950 m-0">
                  {c.token} <span className="font-normal">{c.hex}</span>
                </p>
                <p className="text-[13px] text-ink-secondary m-0 mt-0.5">{c.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="type">
        <SectionHeader eyebrow="Type" title="Three families" lede="All three are open-licence and free to download from Google Fonts." className="mb-6" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FONTS.map((f) => (
            <Card key={f.family}>
              <Eyebrow className="mb-2">{f.weights}</Eyebrow>
              <p className="font-sans font-extrabold text-xl text-ink-950 m-0">{f.family}</p>
              <p className="text-sm text-ink-secondary mt-2 mb-4">{f.use}</p>
              <Button href={f.url} external variant="secondary" size="sm">
                Get {f.family}
              </Button>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="components">
        <SectionHeader eyebrow="Components" title="Buttons and badges" lede="The site's own, drawn live from the same code the pages use." className="mb-6" />
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <Button href="#components" size="sm">Primary</Button>
            <Button href="#components" variant="secondary" size="sm">Secondary</Button>
            <Badge tone="gold">Gold badge</Badge>
            <Badge tone="denim">Denim badge</Badge>
            <Badge>Outline badge</Badge>
          </div>
        </Card>
      </Section>

      <Section id="rules">
        <SectionHeader eyebrow="Usage" title="The rules" className="mb-6" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {RULES.map((r) => (
            <Card key={r.title}>
              <p className="font-sans font-extrabold text-base text-ink-950 m-0 mb-2">{r.title}</p>
              <ul className="text-sm text-ink-secondary m-0 pl-5 space-y-1.5">
                {r.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>
    </SiteShell>
  );
}
