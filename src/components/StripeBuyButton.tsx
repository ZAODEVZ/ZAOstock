import Script from 'next/script';

// Zaal's own Buy Buttons, pasted from the Stripe dashboard. Each id is
// generated FROM its tier's own Payment Link (STRIPE_LINKS in site.ts) -
// confirmed by Stripe's own docs (research doc 2542): a buy-button-id has
// no existence independent of the Payment Link selected when it was
// created in the dashboard, so the two always point at the same checkout.
// `pro`'s checkout_url was verified against STRIPE_LINKS.pro exactly via
// Stripe's API before shipping - a second front-end onto the SAME link,
// not a new product or price. Zaal, 2026-09-23: "i like the embed... this
// page should have those both on the first screen" - every tier renders
// through this component once it has an id here.
//
// pk_live_... below is a PUBLISHABLE key - designed for client-side code,
// safe in the repo. Not routed through an env var for secrecy (there is
// none to protect); it lives here for tidiness, next to the button ids it
// belongs with. Per doc 2542: this ONE key is shared across every embedded
// button on the site, so revoking it in the Stripe dashboard breaks all of
// them at once until this file is redeployed with the new key.
const BUY_BUTTONS: Partial<Record<'fan' | 'supporter' | 'pro', string>> = {
  // `fan` and `supporter` were pasted from Zaal directly, matched by eye
  // against their own STRIPE_LINKS Payment Link - NOT yet verified against
  // Stripe's API the way `pro`'s checkout_url was. This session had no
  // Stripe secret key available to run that check. Re-verify both before
  // relying on either for real money, same as pro's was confirmed.
  fan: 'buy_btn_1UIyccKEKqFBqu9oamQBf5ls',
  supporter: 'buy_btn_1UJ01jKEKqFBqu9o9a6drc7d',
  pro: 'buy_btn_1UHtBXKEKqFBqu9ohduWCZ4s',
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

export function StripeBuyButton({ tierId }: { tierId: 'fan' | 'supporter' | 'pro' }) {
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
