// Shared metadata bits for the public pages. The root opengraph-image.tsx
// only reaches routes that do not set their own openGraph object; every
// public page does, so each one lists the image explicitly.
export const OG_IMAGE = { url: '/opengraph-image', width: 1200, height: 630, alt: 'ZAOstock 2026, Saturday 3 October, Franklin Street Parklet, Ellsworth, Maine' } as const;

/**
 * Twitter Card, mirroring a page's own Open Graph title/description rather
 * than the root layout's generic ones.
 *
 * Every page here already sets its own `openGraph.title`/`description` -
 * Next.js does not fall back to those for `twitter`, so a page that skips
 * this keeps the root layout's "ZAOstock 2026" card no matter what its own
 * Open Graph card says. Measured live 2026-09-20: true on 8 of 9 sampled
 * routes (/artists was the one exception, hand-wired already).
 */
export function twitterCard(title: string, description: string, images?: readonly (string | { url: string })[]) {
  return { card: 'summary_large_image' as const, title, description, ...(images ? { images: [...images] } : {}) };
}

/**
 * A meta description cut with `.slice(0, n)` chops the last word in half
 * whenever the text runs past the limit - measured live on 6 of 8 artist
 * pages (2026-09-19 UI audit, ZAOOS doc 2507). Backs off to the last space
 * inside the limit instead, so a search result or a share card always ends
 * on a whole word.
 */
export function truncateAtWord(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim();
}
