// Shared metadata bits for the public pages. The root opengraph-image.tsx
// only reaches routes that do not set their own openGraph object; every
// public page does, so each one lists the image explicitly.
export const OG_IMAGE = { url: '/opengraph-image', width: 1200, height: 630, alt: 'ZAOstock 2026, Saturday 3 October, Franklin Street Parklet, Ellsworth, Maine' } as const;
