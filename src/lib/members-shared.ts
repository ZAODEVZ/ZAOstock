// Client-safe member helpers and types. NO server/DB imports here so client
// components can use these without pulling the service-role Supabase client
// (which is server-only) into the browser bundle. Server code re-exports these
// from '@/lib/members'.

export interface PublicMember {
  id: string;
  name: string;
  role: string;
  scope: string;
  secondary_scope: string;
  bio: string;
  links: string;
  photo_url: string;
  status_text: string;
  skills: string;
  slug: string;
}

export interface ParsedLink {
  href: string;
  display: string;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function parseLinks(raw: string): ParsedLink[] {
  return raw
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((token) => {
      const hasProtocol = /^https?:\/\//i.test(token);
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(token);
      const isHandle = token.startsWith('@');
      if (isEmail) {
        return { href: `mailto:${token}`, display: token };
      }
      if (isHandle) {
        return { href: `https://x.com/${token.slice(1)}`, display: token };
      }
      const href = hasProtocol ? token : `https://${token}`;
      return { href, display: token };
    });
}
