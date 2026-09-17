#!/usr/bin/env node
/**
 * ZAOstock mobile overflow check.
 *
 * WHY THIS EXISTS. The 2026-09-16 site audit flagged horizontal overflow as a
 * BLOCKER on all five pages below, screenshotted with:
 *
 *   Google Chrome --headless --disable-gpu --no-sandbox --use-mock-keychain
 *     --window-size=390,844 --screenshot=<file> <url>
 *
 * --window-size sets a 390px desktop WINDOW - no device scale factor, no
 * mobile user agent, no meta-viewport emulation. The page laid out as a very
 * narrow desktop tab and the screenshot cropped at 390px, which looks
 * identical to real overflow in a static PNG. Re-measured with real device
 * emulation (Playwright, iPhone 13 and Pixel 7 profiles - real viewport,
 * device scale factor, mobile UA, meta-viewport respected): every page's
 * scrollWidth matched its viewport width exactly, on every element. The
 * finding was downgraded from BLOCKER to "not reproducible, method artifact"
 * (zaostock-site-audit-2026-09-16.md, corrected by the seat).
 *
 * This script is the replacement instrument, so the next audit does not
 * reproduce the same false positive: real device emulation, not a bare
 * window size.
 *
 * USAGE
 *   node scripts/mobile-overflow-check.mjs            # against production
 *   BASE=http://localhost:3000 node scripts/mobile-overflow-check.mjs
 *
 * Exit code 0 = every page clean on every device. 1 = at least one overflow.
 */

import { chromium, devices } from 'playwright';

const BASE = (process.env.BASE || 'https://zaostock.com').replace(/\/$/, '');

const PAGES = [
  ['home', '/'],
  ['program', '/program'],
  ['artists', '/artists'],
  ['artist-dcoop', '/artist/dcoop'],
  ['tickets', '/tickets'],
];

const DEVICES = ['iPhone 13', 'Pixel 7'];

async function checkPage(browser, deviceName, name, path) {
  const context = await browser.newContext({ ...devices[deviceName] });
  const page = await context.newPage();
  try {
    await page.goto(`${BASE}${path}`, { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const result = await page.evaluate(() => {
      const winWidth = window.innerWidth;
      const docWidth = document.documentElement.scrollWidth;
      const overflowers = [];
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > winWidth + 1 && r.width > 0) {
          overflowers.push({
            tag: el.tagName,
            text: (el.textContent || '').trim().slice(0, 40),
            right: Math.round(r.right),
          });
        }
      });
      return { winWidth, docWidth, overflowers: overflowers.slice(0, 5) };
    });
    return result;
  } finally {
    await context.close();
  }
}

async function main() {
  const browser = await chromium.launch();
  let failures = 0;

  for (const deviceName of DEVICES) {
    console.log(`\n${deviceName}`);
    for (const [name, path] of PAGES) {
      const r = await checkPage(browser, deviceName, name, path);
      const ok = r.docWidth <= r.winWidth && r.overflowers.length === 0;
      const label = ok ? 'PASS' : 'FAIL';
      console.log(`  ${label}  ${name.padEnd(14)} scrollWidth=${r.docWidth} viewport=${r.winWidth}`);
      if (!ok) {
        failures += 1;
        r.overflowers.forEach((o) => console.log(`         ${o.tag} right=${o.right} "${o.text}"`));
      }
    }
  }

  await browser.close();

  if (failures > 0) {
    console.log(`\n${failures} page/device combination(s) overflow.`);
    process.exit(1);
  }
  console.log('\nNo overflow on any page, on any device.');
}

main();
