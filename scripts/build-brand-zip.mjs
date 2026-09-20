#!/usr/bin/env node
/**
 * The "download everything" zip for /brand - the single strongest pattern
 * across the 2026-09-20 reference-page audit (Discord's brand kit, closest
 * Figma got). A volunteer who wants everything currently clicks 13 times;
 * this is one click instead.
 *
 * Zips exactly what /brand shows and nothing else - not every file under
 * public/brand/, which also holds the homepage's own animation frames
 * (public/brand/home/flight/*.webp, 80 files) that are not brand assets
 * anyone would want to build with. The scope here is the five sections on
 * the page: logos, posters, textures, the logo animation, and the one font
 * this page links.
 *
 * A committed static file, not a route that zips on request: these files
 * change rarely, and a Vercel serverless function zipping ~12 MB on every
 * download is complexity this doesn't need. Same "build once, commit the
 * output" shape as scripts/prep-poster.mjs.
 *
 * USAGE
 *   node scripts/build-brand-zip.mjs
 *
 * Writes: public/brand/zaostock-brand-kit.zip
 * Requires the `zip` command (present on macOS, Linux and GitHub Actions
 * runners by default - not adding a new npm dependency for this).
 */

import { execFileSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public', 'brand', 'zaostock-brand-kit.zip');

// Paths relative to ROOT, exactly matching what /brand's LOGOS, POSTERS,
// TEXTURES, video section and font link serve.
const INCLUDE = [
  'public/brand/logos',
  'public/brand/posters',
  'public/brand/textures',
  'public/brand/video',
  'public/brand/social',
  'public/fonts/Boogaloo-Regular.ttf',
];

if (existsSync(OUT)) rmSync(OUT);

execFileSync('zip', ['-r', '-X', OUT, ...INCLUDE], { cwd: ROOT, stdio: 'inherit' });

console.log(`\nWrote ${OUT}`);
