export interface SocialToken {
  text: string;
  href: string | null;
}

const SEPARATOR_ONLY = /^[-|/,]+$/;
const HAS_PROTOCOL = /^https?:\/\//i;
// A dotted host, optionally followed by a path. No spaces (tokens are
// already whitespace-split) and no "@" - handles are text, not links,
// unless the stored value already spells out a URL.
const BARE_DOMAIN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+(?:\/\S*)?$/i;

/**
 * Splits a stored `socials` string into link/plain-text tokens for display.
 * A token is a link only when it is already a URL or a bare domain; a
 * standalone separator ("-", "|", "/", ",") is dropped, and a handle
 * ("@name") stays plain text since the platform isn't inferable from the
 * stored data (fix for the #241 regression, 2026-09-19).
 */
export function parseSocials(raw: string): SocialToken[] {
  return raw
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
    .filter((token) => !SEPARATOR_ONLY.test(token))
    .map((token) => {
      if (HAS_PROTOCOL.test(token)) {
        return { text: token, href: token };
      }
      if (!token.startsWith('@') && BARE_DOMAIN.test(token)) {
        return { text: token, href: `https://${token}` };
      }
      return { text: token, href: null };
    });
}
