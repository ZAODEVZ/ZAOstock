import Script from 'next/script';

// Zaal's own Buy Button, pasted from the Stripe dashboard. This is the same
// Payment Link as STRIPE_LINKS.pro (buy_btn_1UHtBXKEKqFBqu9ohduWCZ4s's own
// checkout_url matches STRIPE_LINKS.pro exactly, verified against Stripe's
// API) - a second front-end onto the SAME link, not a new product or price.
// REPLACES the Pro tier's "Pay by card" button rendered via stripeLinkFor;
// the two must never sit next to each other on the page.
//
// pk_live_... below is a PUBLISHABLE key - designed for client-side code,
// safe in the repo. Not routed through an env var for secrecy (there is
// none to protect); it lives here for tidiness, next to the button id it
// belongs with.
//
// IMPORTANT TRADE-OFF, on the record rather than discovered later: this
// bypasses stripeLinkFor()'s host guard entirely. That guard exists so a
// wrong paste into STRIPE_LINKS renders nothing instead of a dead or wrong
// link - a buy-button id is just a string with no equivalent check
// available. If Stripe ever needs a second Buy Button (e.g. Supporter),
// there is no automated way to confirm a pasted id is real; verify it
// against Stripe's API before shipping, the way this one was.
const BUY_BUTTON_ID = 'buy_btn_1UHtBXKEKqFBqu9ohduWCZ4s';
const PUBLISHABLE_KEY = 'pk_live_51UHquZKEKqFBqu9oPJuVUHbRwP6jsljrV22MSKEQn7m7VxOHoGeMTawhznBcCTgF2j5Z9JpBSvGgFMiorJOwoqtG00YBk0xUJF';

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

export function StripeBuyButton() {
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
        <stripe-buy-button buy-button-id={BUY_BUTTON_ID} publishable-key={PUBLISHABLE_KEY} />
      </div>
    </>
  );
}
