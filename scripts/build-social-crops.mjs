#!/usr/bin/env node
/**
 * Social-sized crops of the primary moose mark, for a profile picture, a
 * cover/banner and a story/post - the single most-wanted thing the
 * 2026-09-20 /brand audit found missing (measured against Discord, Slack,
 * GitHub, Portland arts council, SXSW and Figma's own brand pages - not one
 * of the six had this either).
 *
 * The moose is white-on-transparent, so every size here composites it onto
 * the ink-950 brand colour (#2E2015, design-kit.ts) rather than shipping a
 * transparent file that vanishes on whatever background a platform gives
 * it. Contrast between the two is checked after generation, not assumed -
 * see the PR that added this script for the measured ratio.
 *
 * USAGE
 *   node scripts/build-social-crops.mjs
 *
 * Writes (all from public/brand/logos/zaostock26_moose.png, unaltered
 * source - only resized and given a background, never redrawn):
 *   public/brand/social/profile-1000x1000.png
 *   public/brand/social/cover-1500x500.png
 *   public/brand/social/story-1080x1920.png
 */

import sharp from 'sharp';
import path from 'path';

const SOURCE = path.join(process.cwd(), 'public', 'brand', 'logos', 'zaostock26_moose.png');
const OUT_DIR = path.join(process.cwd(), 'public', 'brand', 'social');
const INK_950 = '#2E2015';

const SIZES = [
  // [name, width, height, moose-scale - the fraction of the shorter canvas
  // edge the moose's own edge fills, leaving margin so it never touches
  // the frame]
  ['profile-1000x1000', 1000, 1000, 0.8],
  ['cover-1500x500', 1500, 500, 0.72],
  ['story-1080x1920', 1080, 1920, 0.68],
];

for (const [name, w, h, scale] of SIZES) {
  const mooseSize = Math.round(Math.min(w, h) * scale);
  const moose = await sharp(SOURCE).resize(mooseSize, mooseSize).toBuffer();
  await sharp({ create: { width: w, height: h, channels: 4, background: INK_950 } })
    .composite([{ input: moose, gravity: 'center' }])
    .png()
    .toFile(path.join(OUT_DIR, `${name}.png`));
  console.log(`${name}.png (${w}x${h}, moose at ${mooseSize}px)`);
}

console.log('\nDone. Source moose file untouched - these are new files, not edits.');
