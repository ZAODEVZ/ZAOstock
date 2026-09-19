#!/usr/bin/env node
/**
 * ZAOstock event poster: take Candy's final file, unaltered, and produce
 * the two sizes the site needs.
 *
 * WHY THIS EXISTS. Zaal, relayed 2026-09-19: "Candy IS delivering the final
 * event poster... do NOT design a competing poster." Three people are
 * waiting on it (Katelin at the Ellsworth Area Chamber, Steve Peer, any
 * Fogtown/Heart of Ellsworth cross-promotion), and the file is expected
 * tonight or Sunday night (week-review-2026-09-19.md). This script is the
 * mechanism so that the moment it lands, publishing it is a re-run, not new
 * code: one command, two files out, nothing designed here.
 *
 * WHAT "UNALTERED" MEANS, in this script:
 * - The print file is a byte-identical copy, format preserved. No resize,
 *   no recompress, no crop. Whatever resolution Candy sends is what prints.
 * - The social crop is 1080x1350 (Instagram portrait, 4:5) using `fit:
 *   contain` - the WHOLE image is padded onto that canvas, never cropped or
 *   cut. Nothing of Candy's artwork is trimmed to make the ratio.
 * - The pad colour is a judgment call this script does NOT make silently:
 *   default is white (--bg to override, any sharp-parseable colour, e.g.
 *   "#141e27" for the ink token or "transparent"). Look at the actual
 *   output before publishing - a colour that was fine as a guess may clash
 *   with her real artwork.
 *
 * USAGE
 *   node scripts/prep-poster.mjs <path-to-candys-file> [--bg <color>]
 *
 * Writes:
 *   public/brand/posters/event-poster-print.<ext>
 *   public/brand/posters/event-poster-social-1080x1350.jpg
 *
 * Exit code 0 on success, 1 on a bad or missing input file.
 */

import sharp from 'sharp';
import { existsSync, copyFileSync, mkdirSync } from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const input = args[0];
const bgFlagIndex = args.indexOf('--bg');
const bg = bgFlagIndex !== -1 ? args[bgFlagIndex + 1] : '#ffffff';

if (!input) {
  console.error('Usage: node scripts/prep-poster.mjs <path-to-candys-file> [--bg <color>]');
  process.exit(1);
}
if (!existsSync(input)) {
  console.error(`No such file: ${input}`);
  process.exit(1);
}

const OUT_DIR = path.join(process.cwd(), 'public', 'brand', 'posters');
mkdirSync(OUT_DIR, { recursive: true });

const ext = path.extname(input).toLowerCase() || '.png';
const printPath = path.join(OUT_DIR, `event-poster-print${ext}`);
const socialPath = path.join(OUT_DIR, 'event-poster-social-1080x1350.jpg');

copyFileSync(input, printPath);

const meta = await sharp(input).metadata();
await sharp(input)
  .resize(1080, 1350, { fit: 'contain', background: bg })
  .flatten({ background: bg })
  .jpeg({ quality: 90 })
  .toFile(socialPath);

console.log(`Print file (unaltered, ${meta.width}x${meta.height}): ${printPath}`);
console.log(`Social crop (1080x1350, padded on ${bg}, nothing cut): ${socialPath}`);
console.log('\nLook at the social crop before publishing - the pad colour is a guess, not a decision.');
