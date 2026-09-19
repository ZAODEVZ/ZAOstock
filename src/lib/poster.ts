import { existsSync } from 'fs';
import path from 'path';

const DIR = 'brand/posters';
const PRINT_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];

export interface PosterFiles {
  printUrl: string;
  printExt: string;
  socialUrl: string;
}

/**
 * Candy's final event poster, once scripts/prep-poster.mjs has run on her
 * file (see that script's header for why nothing here designs a poster).
 * Returns null until BOTH files exist on disk - a half-published poster
 * (print with no social crop, or the reverse) is worse than showing
 * neither, and /design must not link a file that 404s.
 */
export function getPosterFiles(): PosterFiles | null {
  const socialRel = `${DIR}/event-poster-social-1080x1350.jpg`;
  if (!existsSync(path.join(process.cwd(), 'public', socialRel))) return null;

  for (const ext of PRINT_EXTS) {
    const printRel = `${DIR}/event-poster-print.${ext}`;
    if (existsSync(path.join(process.cwd(), 'public', printRel))) {
      return { printUrl: `/${printRel}`, printExt: ext.toUpperCase(), socialUrl: `/${socialRel}` };
    }
  }
  return null;
}
