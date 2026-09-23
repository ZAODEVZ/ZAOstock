import Script from 'next/script';

// Zaal's own Buy Buttons, pasted from the Stripe dashboard. `pro`'s Payment
// Link is STRIPE_LINKS.pro (buy_btn_1UHtBXKEKqFBqu9ohduWCZ4s's own
// checkout_url matches STRIPE_LINKS.pro exactly, verified against Stripe's
// API) - a second front-end onto the SAME link, not a new product or price.
// Zaal, 2026-09-23: "i like the embed... this page should have those both
// on the first screen" - both tiers render through this component once a
// tier has an id here.
//
// `supporter` is UNSET on purpose. Adding a real id here without verifying
// it against Stripe's API the way `pro`'s was is exactly the mistake the
// comment below warns about - a wrong paste renders a broken widget with no
// automated check to catch it, unlike stripeLinkFor()'s host guard for a
// plain link.
//
// pk_live_... below is a PUBLISHABLE key - designed for client-side code,
// safe in the repo. Not routed through an env var for secrecy (there is
// none to protect); it lives here for tidiness, next to the button ids it
// belongs with.
const BUY_BUTTONS: Partial<Record<'supporter' | 'pro', string>> = {
  pro: 'buy_btn_1UHtBXKEKqFBqu9ohduWCZ4s',
  // supporter: 'buy_btn_...' - paste here once Zaal has generated one from
  // the dashboard for the Supporter Payment Link, and verify it against
  // Stripe's API the way pro's was before shipping.
};
const PUBLISHABLE_KEY = 'pk_live_51UHquZKEKqFBqu9oPJuVUHbRwP6jsljrV22MSKEQn7m7VxOHoGeMTawhznBcCTgF2j5Z9JpBSvGgFMiorJOwoqtG00YBk0xUJF';

/** Whether a tier has a real Buy Button id on file, without exposing the id itself. */
export function hasBuyButton(tierId: string): boolean {
  return tierId in BUY_BUTTONS && Boolean(BUY_BUTTONS[tierId as keyof typeof BUY_BUTTONS]);
}

// React 19 moved the JSX namespace under React itself (React.JSX), not the
// old ambient global `JSX` - augmenting that no longer does anything here.
declare module 'react' {
  // TS's JSX declaration-merging for a custom element requires the
  // `namespace` keyword; there is no ES2015-module equivalent for this
  // specific pattern.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'buy-button-id': string;
        'publishable-key': string;
      };
    }
  }
}

export function StripeBuyButton({ tierId }: { tierId: 'supporter' | 'pro' }) {
  const buyButtonId = BUY_BUTTONS[tierId];
  if (!buyButtonId) return null;

  return (
    <>
      <Script src="https://js.stripe.com/v3/buy-button.js" strategy="afterInteractive" />
      {/* Stripe renders this custom element inside a closed shadow DOM, so its
          white card can never pick up the site's own palette - in dark mode
          that's a stark white rectangle floating on a near-black card
          (--color-paper-200 goes to #2C2115). Framing it with the site's own
          card border/shadow/padding tokens gives it a deliberate boundary in
          both themes, rather than leaving a foreign widget to float bare.
          Caught from a live screenshot in dark mode, 2026-09-21. */}
      <div className="rounded-[14px] border-[1.5px] border-gold-500/60 shadow-hard p-2 bg-paper-100">
        <stripe-buy-button buy-button-id={buyButtonId} publishable-key={PUBLISHABLE_KEY} />
      </div>
    </>
  );
}
