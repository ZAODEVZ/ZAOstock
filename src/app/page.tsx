import { Metadata } from 'next';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import Image from 'next/image';
import EllsworthVideo from '@/components/EllsworthVideo';
import Link from 'next/link';
import { FESTIVAL, NEXT_EDITION, nextEditionLine } from '@/content/festival';
import { SITE, PLAYED_NAMES, LINEUP_NAMES_NOTE, PARTNERS, ELLSWORTH, displayName } from '@/content/site';
import { SiteShell } from '@/components/poster';
import { HomeHero } from './HomeHero';
import { RadioPlayer } from '@/components/RadioPlayer';
import { RADIO_SESSIONS, STAR_977_URL } from '@/content/media';
import s from './home.module.css';
import { EventJsonLd } from '@/components/EventJsonLd';

// THE HOMEPAGE IN CANDY'S LOOK. Zaal, 2026-09-10, of her site build: "this is
// what the site should look like". Her layout, her art, her CSS (ported into
// home.module.css); the site's own verified copy in every block.
//
// Deliberately NOT carried over from her build, each for a recorded reason:
// - "A whole day of art, peace & music" and the Art / Peace / Music tags: they
//   echo Woodstock's "3 Days of Peace & Music", the same reason she retired the
//   badge. The tags here are Free / All ages / Rain or shine.
// - "Est. 2017" in her footer: untrue, this is the first ZAOstock.
// - Her lineup cards (acoustic sets, local bands, an on-site open mic) and "full
//   schedule drops closer to the date": there is no open mic, and the real eight
//   acts are named here with the running order on /program.
// - "a hand-built stage": the stage is rented.
// - Placeholder partners ("Local businesses"): the real eight are listed.
// - The admission ticket graphic: entry is free; RSVP goes to Luma.
//
// PAST TENSE, 2026-10-04. ZAOstock 2026 happened on 3 October (Zaal: "pushing
// eveything zaostock to the past"). The page is now the record of the day: no
// RSVP, no countdown, no rain-or-shine badge. The calls to action are "Watch the
// replay" (/live) and "Support the artists" (/tickets). The FESTIVAL DAY BANNER
// at the top is owned by another change and is left as it was.
//
// Reads nothing from the database, so it prerenders and needs no env to render.

export const metadata: Metadata = {
  title: { absolute: 'ZAOstock 2026 | A free music festival, Ellsworth, Maine' },
  description:
    `A free, artist-built music festival on Franklin Street, downtown Ellsworth, Maine, held ${FESTIVAL.dateLabel}. ${PLAYED_NAMES.length} independent acts played, one stage. Watch the replay.`,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'ZAOstock 2026',
    description: `A free, one-day, artist-built music festival on Franklin Street, downtown Ellsworth, Maine, held ${FESTIVAL.dateLabel}.`,
    url: 'https://zaostock.com',
    images: [OG_IMAGE],
  },
  twitter: twitterCard(
    'ZAOstock 2026',
    `A free, one-day, artist-built music festival on Franklin Street, downtown Ellsworth, Maine, held ${FESTIVAL.dateLabel}.`,
  ),
};

// The bill in running order, split into three panels. Names only: set times
// live in one public place, /program.
//
// Closing is the last THREE acts, not two - Zaal, relayed 2026-09-19: "Just
// move dcoop", matching his 14 Sept headliners ruling and the Day 270
// newsletter edition, which already treats DCoop/LyonsDen/Fellenz as one
// closing block. Grouping label only: the running order stays 1-8, /program
// is untouched, still no times anywhere.
const PANELS = [
  { kicker: 'Opening', img: '/brand/elements/acoustic_guitar_yellow.webp', acts: PLAYED_NAMES.slice(0, 3) },
  { kicker: 'The afternoon', img: '/brand/home/electric_guitar_blue_semihollow.webp', acts: PLAYED_NAMES.slice(3, -3) },
  { kicker: 'Closing', img: '/brand/home/vintage_microphone_with_cable.webp', acts: PLAYED_NAMES.slice(-3) },
] as const;

// Past tense (2026-10-04): the 2026 sheet and RSVP are closed, so each card
// now points at what is still open - the replay, the support tiers, a thank-you
// to the crew, and the contact lines.
const PLUG_IN = [
  { n: '01', who: 'Everyone', what: 'Watch the replay', href: '/live' },
  { n: '02', who: 'Supporters', what: 'Back the artists', href: '/tickets' },
  { n: '03', who: 'Musicians', what: NEXT_EDITION.name, href: '/musicians' },
  { n: '04', who: 'Sponsors & press', what: 'Get in touch', href: '/sponsor' },
] as const;

export default function HomePage() {
  return (
    <SiteShell>
      <EventJsonLd />
      {/* AFTER THE DAY. Replaces the 3 October "ZAOstock is today" banner
          (Zaal, 2026-10-03, relayed by the seat: prepare the post-festival flip). */}
      <div className="bg-denim-600 text-onfill">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-3">
          <p className="m-0 font-sans font-extrabold text-base sm:text-lg">
            Thank you, Ellsworth. ZAOstock 2026 is a wrap.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/live" className="inline-flex items-center rounded-pill bg-onfill px-[18px] py-[9px] text-sm font-bold uppercase tracking-[0.08em] text-ink-950 hover:bg-paper-200">
              Watch the replay
            </Link>
            <Link href="/tickets" className="inline-flex items-center rounded-pill border-[1.5px] border-onfill px-[18px] py-[9px] text-sm font-bold uppercase tracking-[0.08em] text-onfill hover:bg-onfill/10">
              Support the artists
            </Link>
          </div>
        </div>
      </div>
      <div className={s.home}>
        {/* 1. The flight down Franklin Street */}
        <HomeHero>
          <div className={`${s.tagrow} ${s.anim} ${s.d1}`}>
            <span>Held {FESTIVAL.shortDate}</span>
            <span>Free entry</span>
            <span>All ages</span>
          </div>
          <Image
            className={`${s.logo} ${s.anim} ${s.d2}`}
            src="/brand/home/zaostock_logo_new.webp"
            alt="ZAOstock 2026: the word ZAOSTOCK set in the antlers of a gold moose."
            width={1000}
            height={1000}
            priority
          />
          <h1 className={`${s.display} ${s.big} ${s.anim} ${s.d3}`}>
            {/* Search and screen readers get the festival, not just the venue:
                the visible H1 names the parklet, which alone ranks for nothing
                anyone searches (SEO audit 2026-09-29). */}
            <span className="sr-only">ZAOstock 2026, a free music festival in Ellsworth, Maine, at the </span>
            Franklin St{' '}
            <br />
            <em>Parklet</em>
          </h1>
          <div className={`${s.details} ${s.anim} ${s.d4}`}>
            Ellsworth, Maine &nbsp;&bull;&nbsp; <b>{FESTIVAL.dateLabel}</b> &nbsp;&bull;&nbsp; Free and all ages
          </div>
          <div className={`${s.cta} ${s.anim} ${s.d4}`} style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link href="/live" className={s.btn}>
              Watch the replay
            </Link>
            <Link href="/tickets" className={`${s.btn} ${s.ghost}`}>
              Support the artists
            </Link>
          </div>
        </HomeHero>

        {/* 2. The day */}
        <section className={s.section} id="day">
          <div className={s.wrap}>
            <div className={s.dayWrap}>
              <div>
                <div className={s.kicker}>The day</div>
                <h2 className={s.title}>
                  One street.
                  <br />
                  <em>One stage.</em>
                </h2>
                <p className={s.lede}>
                  Franklin Street closed to traffic and opened up for the day: independent artists on the parklet stage from noon to six, with our MC and our partners between sets. The after-party ran at Black Moon next door.
                </p>
                <p className={s.lede}>
                  It was part of the {SITE.series} during {SITE.weekend}.
                </p>
                <Link href="/program" className={`${s.btn} ${s.ghost}`}>
                  The running order
                </Link>
              </div>
              <div className={s.dayVisual}>
                <div className={s.frame}>
                  <Image src="/brand/elements/sign_franklin_st_parklet.webp" alt={`A ${FESTIVAL.venue} street sign`} width={620} height={350} unoptimized />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. The lineup */}
        <section className={`${s.section} ${s.tint}`} id="lineup">
          <div className={s.wrap}>
            <div className={s.kicker}>Artist-built</div>
            <h2 className={s.title}>
              The <em>lineup</em>
            </h2>
            <p className={s.lede}>
              {PLAYED_NAMES.length} independent acts played back to back on one stage. {LINEUP_NAMES_NOTE}{' '}
              <Link href="/program" className={s.link}>
                The running order
              </Link>
            </p>
            <div className={s.lineupWrap}>
              {PANELS.map((p) => (
                <div key={p.kicker} className={s.panel}>
                  {/* next/image, not a raw <img>: measured on the live site
                      2026-10-01, these three were the only images on the page
                      without loading="lazy", so every mobile visitor on cell
                      service downloaded all of them before scrolling - 40 KB
                      (acoustic_guitar_yellow) + 83 KB (electric_guitar_blue_
                      semihollow) + 37 KB (vintage_microphone_with_cable) = 160
                      KB of the initial payload, for images that sit two
                      screens down. Through /_next/image at w=640&q=75 the
                      microphone is 15 KB. width/height are required by
                      next/image; the CSS crops it, so only the ratio matters. */}
                  <Image src={p.img} alt="" width={640} height={640} />
                  <div className={s.fade} />
                  <div className={s.panelTxt}>
                    <div className={s.kicker}>{p.kicker}</div>
                    {p.acts.map((a) => (
                      <h3 key={a}>{displayName(a)}</h3>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* On the radio. Zaal, 2026-10-01: the two Star 97.7 sessions, one tap to
            play. The 30-second ad and the rest of the coverage stay on /media. */}
        <section className={s.section} id="radio">
          <div className={s.wrap}>
            <div className={s.kicker}>On the radio</div>
            <h2 className={s.title}>
              Hear it on <em>Star 97.7</em>
            </h2>
            <p className={s.lede}>
              Zaal on air with{' '}
              <a href={STAR_977_URL} target="_blank" rel="noopener noreferrer" className={s.link}>
                Star 97.7
              </a>
              , our local radio partner, talking about the festival ahead of the day. Press play.
            </p>
            <div className="flex flex-col gap-3 max-w-[760px]">
              {RADIO_SESSIONS.map((r) => (
                <RadioPlayer key={r.src} src={r.src} title={r.title} detail={r.detail} seconds={r.seconds} />
              ))}
            </div>
            <p className={s.lede} style={{ marginTop: 18 }}>
              <Link href="/media" className={s.link}>
                More press and radio
              </Link>
            </p>
          </div>
        </section>

        {/* 4. Why Ellsworth, over the parklet footage from the v11 build */}
        <section className={`${s.section} ${s.ellSection}`} id="ellsworth">
          <div className={s.ellBg} aria-hidden="true">
            {/* Decorative and silent. The video fetches only once this
                section is visible, and never on Save-Data, 2g-class
                connections, or reduced motion (poster covers all cases). */}
            <EllsworthVideo />
            <div className={s.ellBgFade} />
          </div>
          <div className={s.wrap}>
            <div className={s.ellWrap}>
              <div className={s.ellPhotos}>
                <div>
                  <Image src="/brand/home/historic_main_street_storefronts.webp" alt="Main Street storefronts" width={680} height={694} unoptimized />
                </div>
                <div>
                  <Image src="/brand/home/lighthouse_island_landscape.webp" alt="A lighthouse and pines" width={680} height={917} unoptimized />
                </div>
              </div>
              <div className={s.ellCopy}>
                <div className={s.kicker}>Downeast Maine</div>
                <h2 className={s.title}>
                  Why <em style={{ color: 'var(--sun)' }}>Ellsworth</em>
                </h2>
                <p>
                  The gateway to Acadia National Park. {ELLSWORTH.historic} ZAOstock added a new music experience to Ellsworth&apos;s calendar of downtown events, part of the 9th Annual Art of Ellsworth.
                </p>
                <p style={{ marginTop: 16 }}>
                  <Link href="/ellsworth" className={s.link} style={{ color: 'inherit' }}>
                    About Ellsworth
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Plug in */}
        <section className={`${s.section} ${s.tint}`} id="plugin">
          <div className={`${s.wrap} ${s.center}`}>
            <div className={s.kicker}>Stay in touch</div>
            <h2 className={s.title}>
              Watch, <em>support</em>,
              <br />
              or get in touch
            </h2>
            <p className={s.lede} style={{ margin: '0 auto' }}>
              ZAOstock ran on volunteers and local talent. Thank you to everyone who gave a day to it.
            </p>
            <div className={s.plugGrid}>
              {PLUG_IN.map((p) => (
                <Link key={p.href} href={p.href} className={s.plugCard}>
                  <div className={s.num}>{p.n}</div>
                  <h3>{p.who}</h3>
                  <span className={s.mini}>{p.what} &rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Partners: the real eight, logos as supplied */}
        <section className={s.section} id="partners">
          <div className={`${s.wrap} ${s.center}`}>
            <div className={s.kicker}>With thanks to</div>
            <h2 className={s.title}>
              Our <em>partners</em>
            </h2>
            <p className={s.lede} style={{ margin: '0 auto' }}>
              Every partner had a named point of contact on the ZAO team.
            </p>
            <ul className={s.partnerGrid}>
              {PARTNERS.map((p) => (
                <li key={p.name} className={s.partnerCard}>
                  <div className={s.partnerLogo}>
                    {p.logoSrc ? <Image src={p.logoSrc} alt={`${p.name} logo`} width={280} height={112} /> : null}
                  </div>
                  <span className={s.partnerName}>{p.name}</span>
                  <span className={s.partnerRole}>{p.role}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 30 }}>
              <Link href="/sponsor" className={`${s.btn} ${s.ghost}`}>
                Talk about a future edition
              </Link>
            </div>
          </div>
        </section>

        {/* 7. Thank you, Ellsworth */}
        <section className={s.close} id="thanks">
          <div className={`${s.wrap} ${s.closeInner}`}>
            <div className={s.kicker}>Saturday, 3 October 2026</div>
            <h2 className={s.title}>
              Thank you,
              <br />
              <em>Ellsworth</em>
            </h2>
            <p className={s.lede} style={{ margin: '0 auto 22px', color: 'inherit' }}>
              ZAOstock 2026 happened on Franklin Street. Thank you to the artists, the crew, our partners and everyone who came.
            </p>
            <div className={s.cta} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              <Link href="/live" className={s.btn}>
                Watch the replay
              </Link>
              <Link href="/tickets" className={`${s.btn} ${s.ghost}`}>
                Support the artists
              </Link>
            </div>
            {/* The next edition: the date and nothing else is set. Read from
                NEXT_EDITION so a move changes one file. */}
            <p className={s.lede} style={{ margin: '0 auto', color: 'inherit', fontWeight: 700 }}>
              {nextEditionLine()}
            </p>
            <Image className={s.brush} src="/brand/home/zaostock_brush_lettering_black.webp" alt="ZAOstock" width={700} height={235} unoptimized />
            <Link href="/festivals" className={s.link} style={{ color: 'inherit', fontSize: 14 }}>
              What came before: the ZAO Festivals series
            </Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
