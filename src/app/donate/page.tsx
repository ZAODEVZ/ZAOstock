import { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import { FESTIVAL } from '@/content/festival';
import { SITE, SERIES, SUPPORT_TIERS, PRO_TICKET, PRO_ROUND, PAYPAL_URL } from '@/content/site';
import { SiteShell, Section, TwoUp, Eyebrow, Button, Card, SectionHeader, BorderedList } from '@/components/poster';

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Two ways to give: PayPal for fiat or Giveth for crypto. Funds cover artist pay and materials for ZAOstock 2026 in Ellsworth, Maine.',
  alternates: { canonical: '/donate' },
  openGraph: {
    title: 'Donate | ZAOstock',
    description: 'Support ZAOstock 2026. PayPal or Giveth.',
    url: 'https://zaostock.com/donate',
    images: [OG_IMAGE],
  },
};

const GIVETH_URL = 'https://giveth.io/project/sustaining-zao-festivals-creativity-technology';
const WALLET = '0xEb3E8a944A6c1D536c6F38334c23354E1A0C6aAB';
const PRESETS = [10, 25, 50, 100];

export default function DonatePage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Two ways to give</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">Fund the music.</h1>
          <p className="text-lg text-ink-secondary measure m-0">
            ZAOstock 2026 is a free, community-built, one-day music festival in Ellsworth, Maine on {FESTIVAL.shortDate}. Funds cover artist pay and the materials for the day. The festival runs at break-even.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
          <Card>
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <Eyebrow>Fiat · PayPal</Eyebrow>
              <span className="font-mono text-eyebrow text-ink-muted">Fastest path</span>
            </div>
            <h2 className="font-display font-normal text-h3 text-ink-950 m-0">Send via PayPal</h2>
            <p className="text-sm text-ink-secondary m-0 mt-2">
              Direct to <span className="font-mono text-ink-950">paypal.me/zaalpanthaki</span>, the project&apos;s collection account. Card or PayPal balance.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {PRESETS.map((n) => (
                <Button key={n} href={`${PAYPAL_URL}/${n}`} external variant="secondary" size="sm">
                  ${n}
                </Button>
              ))}
            </div>
            <div className="mt-4">
              <Button href={PAYPAL_URL} external>
                Send PayPal
              </Button>
            </div>
          </Card>
          <Card>
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <Eyebrow>Crypto · Giveth</Eyebrow>
              <span className="font-mono text-eyebrow text-ink-muted">Wallet required</span>
            </div>
            <h2 className="font-display font-normal text-h3 text-ink-950 m-0">Send via Giveth</h2>
            <p className="text-sm text-ink-secondary m-0 mt-2">
              Wallet to wallet to <span className="font-mono text-ink-950">thezao.eth</span>. USDC on Base preferred; works on Ethereum, Base, Optimism, Polygon, Gnosis, Arbitrum and Celo. No platform cut on Giveth; GIVbacks from $5.
            </p>
            <p className="font-mono text-[11px] text-ink-muted break-all m-0 mt-2">{WALLET}</p>
            <div className="mt-4">
              <Button href={GIVETH_URL} external variant="secondary">
                Send crypto
              </Button>
            </div>
          </Card>
        </div>
      </Section>

      <Section id="pro-ticket">
        <TwoUp>
          <SectionHeader
            eyebrow="Pro Ticket"
            title="Free to attend. The first round of crowdfunding starts now."
            lede={`ZAOstock is free for anyone who wants to show up. We are raising the next ${PRO_ROUND.roundTotal} toward making it happen, at ${SUPPORT_TIERS[0].price} or ${PRO_TICKET.price}. ${PRO_ROUND.countsRule} Both credit you by name.`}
          />
          <div className="flex flex-col gap-4">
            {SUPPORT_TIERS.map((tier) => (
              <Card key={tier.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-[2.25rem] leading-none text-red-500">{tier.price}</span>
                  {tier.spots ? <Eyebrow>{tier.spots}</Eyebrow> : null}
                </div>
                <h3 className="font-display font-normal text-h3 text-ink-950 m-0 mt-2">{tier.name}</h3>
                <ul className="list-disc pl-5 m-0 mt-3 text-sm text-ink-950 flex flex-col gap-1">
                  {tier.gets.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                <div className="mt-4">
                  <Button href={`${PAYPAL_URL}/${tier.amount}`} external variant={tier.id === 'pro' ? 'primary' : 'secondary'}>
                    Chip in {tier.price}
                  </Button>
                </div>
              </Card>
            ))}
            <p className="text-[13px] text-ink-muted m-0">
              {PRO_ROUND.goal}. After taking the {PRO_TICKET.name}, email {SITE.contact} so we can schedule your 1:1.
            </p>
          </div>
        </TwoUp>
      </Section>

      <Section>
        <TwoUp>
          <div className="flex flex-col gap-6">
            <SectionHeader eyebrow="Where it goes" title="The real costs of the day." lede="Artist travel and pay, sound and stage production, and the materials it takes to put on a free, all-day festival." />
            <BorderedList
              rows={[
                { term: 'Who you give to', detail: 'ZAO Festivals, the events arm of The ZAO. The PayPal handle is the project’s collection account, not an individual.' },
                { term: 'Questions', detail: SITE.contact },
              ]}
            />
          </div>
          <div>
            <Eyebrow className="mb-3">ZAO Festivals so far</Eyebrow>
            <BorderedList rows={SERIES.map((e) => ({ term: e.name, detail: `${e.place}, ${e.when}` }))} />
          </div>
        </TwoUp>
      </Section>
    </SiteShell>
  );
}
