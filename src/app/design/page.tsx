import type { Metadata } from 'next';
import Image from 'next/image';
import { SiteShell, Section, SectionHeader, Card, Button, Eyebrow } from '@/components/poster';
import { COLOURS, FONTS, MARKS, RULES } from '@/content/design-kit';

export const metadata: Metadata = {
  title: 'Design kit | ZAOstock',
  description: 'The ZAOstock marks, colours, type and the rules for using them. Every file downloads.',
};

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
              <div className={`flex items-center justify-center border-b-2 border-ink-950 p-5 ${m.dark ? 'bg-ink-950' : 'bg-paper-100'}`}>
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

      <Section id="colours">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <SectionHeader eyebrow="Colour" title="The poster inks" />
          <Button href="/design/zaostock-colours.css" variant="secondary" size="sm">
            Download the palette
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COLOURS.map((c) => (
            <div key={c.token} className="flex items-start gap-3 rounded-md border-2 border-ink-950 bg-paper-200 p-3">
              <span className="h-12 w-12 shrink-0 rounded-sm border-2 border-ink-950" style={{ background: c.hex }} aria-hidden />
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
