import { existsSync } from 'fs';
import path from 'path';

const URL_DIR = '/brand/posters';
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
 *
 * `root` is where the two files are looked for. Defaults to the real
 * public/brand/posters; poster.test.ts overrides it with a throwaway
 * mkdtemp directory so the suite never touches (and never deletes) a real
 * poster once one is in place. The returned URLs are always the public
 * site path, independent of `root`.
 */
export function getPosterFiles(root: string = path.join(process.cwd(), 'public', 'brand', 'posters')): PosterFiles | null {
  const socialAbs = path.join(root, 'event-poster-social-1080x1350.jpg');
  if (!existsSync(socialAbs)) return null;

  for (const ext of PRINT_EXTS) {
    const printAbs = path.join(root, `event-poster-print.${ext}`);
    if (existsSync(printAbs)) {
      return {
        printUrl: `${URL_DIR}/event-poster-print.${ext}`,
        printExt: ext.toUpperCase(),
        socialUrl: `${URL_DIR}/event-poster-social-1080x1350.jpg`,
      };
    }
  }
  return null;
}
