import { SITE } from '@/content/site';

// One question, asked by the public artist pages and the public lineup API:
// has the lineup reveal date passed? Pure, so it can be tested without the
// server-only Supabase client. SITE.lineupRevealDate is '2026-09-07'.
export function lineupIsPublic(now: Date = new Date()): boolean {
  return now.toISOString().slice(0, 10) >= SITE.lineupRevealDate;
}
