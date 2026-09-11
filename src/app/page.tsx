import { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import Image from 'next/image';
import Link from 'next/link';
import { FESTIVAL } from '@/content/festival';
import { SITE, LINEUP_NAMES, LINEUP_NAMES_NOTE, PARTNERS, ELLSWORTH } from '@/content/site';
import { SiteShell, Countdown } from '@/components/poster';
import { HomeHero } from './HomeHero';
import s from './home.module.css';

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
// Reads nothing from the database, so it prerenders and needs no env to render.

export const metadata: Metadata = {
  title: { absolute: 'ZAOstock 2026 | Free music festival, Ellsworth, Maine' },
  description:
    'A free, one-day, artist-built music festival on Franklin Street, downtown Ellsworth, Maine. Saturday 3 October 2026. Independent artists, one stage, music from noon.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'ZAOstock 2026',
    description: 'A free, one-day, artist-built music festival on Franklin Street, downtown Ellsworth, Maine. Saturday 3 October 2026.',
    url: 'https://zaostock.com',
    images: [OG_IMAGE],
  },
};

// The bill in running order, split into three panels. Names only: set times
// live in one public place, /program.
const PANELS = [
  { kicker: 'Opening', img: '/brand/elements/acoustic_guitar_yellow.webp', acts: LINEUP_NAMES.slice(0, 3) },
  { kicker: 'The afternoon', img: '/brand/home/electric_guitar_blue_semihollow.webp', acts: LINEUP_NAMES.slice(3, 6) },
  { kicker: 'Closing', img: '/brand/home/vintage_microphone_with_cable.webp', acts: LINEUP_NAMES.slice(6) },
] as const;

const PLUG_IN = [
  { n: '01', who: 'Artists', what: 'Submit work', href: '/artists' },
  { n: '02', who: 'Musicians', what: 'Apply to play', href: '/musicians' },
  { n: '03', who: 'Volunteers', what: 'Sign up', href: '/apply' },
  { n: '04', who: 'Sponsors & press', what: 'Get in touch', href: '/sponsor' },
] as const;

export default function HomePage() {
  return (
    <SiteShell>
      <div className={s.home}>
        {/* 1. The flight down Franklin Street */}
        <HomeHero>
          <div className={`${s.tagrow} ${s.anim} ${s.d1}`}>
            <span>Free</span>
            <span>All ages</span>
            <span>Rain or shine</span>
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
            Franklin St
            <br />
            <em>Parklet</em>
          </h1>
          <div className={`${s.details} ${s.anim} ${s.d4}`}>
            Ellsworth, Maine &nbsp;&bull;&nbsp; <b>Saturday, October 3, 2026</b> &nbsp;&bull;&nbsp; Free, all ages
          </div>
          <div className={`${s.cta} ${s.anim} ${s.d4}`}>
            <a href={FESTIVAL.rsvpUrl} target="_blank" rel="noopener noreferrer" className={s.btn}>
              RSVP free
            </a>
          </div>
          <Countdown onDark className={s.count} />
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
                  Franklin Street closes to traffic and opens up for the day: independent artists on the parklet stage from noon to six, with our MC and our partners between sets. At six the street clears, and Black Moon next door hosts their own evening.
                </p>
                <p className={s.lede}>
                  Part of the {SITE.series} during {SITE.weekend}.
                </p>
                <Link href="/program" className={`${s.btn} ${s.ghost}`}>
                  See the program
                </Link>
              </div>
              <div className={s.dayVisual}>
                <div className={s.frame}>
                  <Image src="/brand/elements/sign_franklin_st_parklet.webp" alt="A Franklin Street Parklet street sign" width={620} height={350} unoptimized />
                </div>
                <div className={s.sunBadge}>
                  Rain or
                  <br />
                  shine
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
              Eight independent acts, back to back on one stage. {LINEUP_NAMES_NOTE}{' '}
              <Link href="/program" className={s.link}>
                The running order
              </Link>
            </p>
            <div className={s.lineupWrap}>
              {PANELS.map((p) => (
                <div key={p.kicker} className={s.panel}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- decorative, cropped by CSS */}
                  <img src={p.img} alt="" />
                  <div className={s.fade} />
                  <div className={s.panelTxt}>
                    <div className={s.kicker}>{p.kicker}</div>
                    {p.acts.map((a) => (
                      <h3 key={a}>{a}</h3>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Why Ellsworth */}
        <section className={s.section} id="ellsworth">
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
                  The gateway to Acadia National Park. {ELLSWORTH.historic} The Heart of Ellsworth ran {ELLSWORTH.heartEvents.value} events with {ELLSWORTH.heartSponsors.value} sponsors in 2025, and ZAOstock plugs into that calendar rather than competing with it.
                </p>
                <p style={{ marginTop: 16 }}>
                  <Link href="/ellsworth" className={s.link} style={{ color: 'inherit' }}>
                    Getting here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Plug in */}
        <section className={`${s.section} ${s.tint}`} id="plugin">
          <div className={`${s.wrap} ${s.center}`}>
            <div className={s.kicker}>How to plug in</div>
            <h2 className={s.title}>
              Play, make,
              <br />
              <em>help</em>, or cover it
            </h2>
            <p className={s.lede} style={{ margin: '0 auto' }}>
              ZAOstock runs on volunteers and local talent. There is a seat at the table whichever way you want in.
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
              Every partner has a named point of contact on the ZAO team.
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
                Become a partner
              </Link>
            </div>
          </div>
        </section>

        {/* 7. See you on Franklin Street */}
        <section className={s.close} id="rsvp">
          <div className={`${s.wrap} ${s.closeInner}`}>
            <div className={s.kicker}>Free &middot; All ages &middot; Rain or shine</div>
            <h2 className={s.title}>
              See you on
              <br />
              <em>Franklin Street</em>
            </h2>
            <a href={FESTIVAL.rsvpUrl} target="_blank" rel="noopener noreferrer" className={s.btn}>
              RSVP free
            </a>
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
