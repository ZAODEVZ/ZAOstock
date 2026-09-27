#!/usr/bin/env node
/**
 * Screenshot the pages a PR can change, on the PR build and on production.
 *
 *   BASE=http://localhost:3000 PROD=https://zaostock.com OUT=review-artifact \
 *     node scripts/review/capture.mjs <changed-files.txt>
 *
 * Two devices, the ones the site is judged on: an iPhone 13 profile (real
 * device emulation, as scripts/mobile-overflow-check.mjs explains, not a bare
 * 390px window) and a 1280x800 desktop. Each shot is the top 2400 CSS pixels,
 * enough to show the hero and the first sections without sending a model a
 * forty-screen image.
 *
 * Writes OUT/shots/<pr|prod>-<device>-<route>.png and OUT/shots.json. A page
 * that fails to load is recorded as an error, never silently skipped: a
 * reviewer that sees fewer pictures than it was promised must be told why.
 */
import { chromium, devices } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { routesFor } from './routes.mjs';

const BASE = process.env.BASE || 'http://localhost:3000';
const PROD = process.env.PROD || 'https://zaostock.com';
const OUT = process.env.OUT || 'review-artifact';
const MAX_H = 2400;

const files = process.argv[2] ? readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean) : [];
const routes = routesFor(files);
const DEVICES = {
  // Scale 1: the model sees layout, not retina detail, and a 3x phone shot is
  // nine times the pixels for the same finding.
  phone: { ...devices['iPhone 13'], deviceScaleFactor: 1 },
  desktop: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 },
};

const slug = (r) => (r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '_'));

mkdirSync(join(OUT, 'shots'), { recursive: true });
const browser = await chromium.launch();
const shots = [];
for (const [side, base] of [['pr', BASE], ['prod', PROD]]) {
  for (const [dev, profile] of Object.entries(DEVICES)) {
    const ctx = await browser.newContext(profile);
    const page = await ctx.newPage();
    for (const route of routes) {
      const file = `${side}-${dev}-${slug(route)}.png`;
      const rec = { side, device: dev, route, file };
      try {
        const res = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 45000 });
        rec.status = res ? res.status() : null;
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        const w = page.viewportSize().width;
        await page.screenshot({ path: join(OUT, 'shots', file), clip: { x: 0, y: 0, width: w, height: Math.min(h, MAX_H) } });
        rec.overflowX = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      } catch (e) {
        rec.error = String(e.message || e).slice(0, 300);
      }
      shots.push(rec);
    }
    await ctx.close();
  }
}
await browser.close();
writeFileSync(join(OUT, 'shots.json'), JSON.stringify({ routes, shots }, null, 2));
const bad = shots.filter((s) => s.error).length;
console.log(`captured ${shots.length - bad} of ${shots.length} shots across ${routes.length} route(s): ${routes.join(' ')}`);
