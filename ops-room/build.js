#!/usr/bin/env node
/**
 * Builds the ops room from ops-room.src.html. Two outputs from one source:
 *
 *   ops-room/ops-room.html     the artifact copy. Everything inlined as data
 *                              URIs: theme, marks, photographs. The artifact
 *                              host blocks media from any other origin, so
 *                              this one has to carry its own.
 *   public/ops/index.html      the deployed copy, what zaostock.com/ops returns.
 *                              The marks and photographs stay inline (about
 *                              400 KB, and the board has to draw on a parklet
 *                              with bad signal). The theme is LINKED from
 *                              public/ops/assets/, because inlining 3.2 MB of
 *                              MP3 as base64 made the page 4.96 MB and took up
 *                              to a minute to open on a phone. Same origin, so
 *                              the site's CSP is happy, and the browser caches
 *                              it after the first play.
 *
 *   node ops-room/build.js
 *
 * Edit ops-room.src.html, never the built files. ops-room.html is git-ignored;
 * public/ops/index.html is committed, and src/lib/ops-room.test.ts fails when
 * its stamp stops matching the source, so a stale deploy cannot go unnoticed.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HERE = __dirname;
const SRC = path.join(HERE, 'ops-room.src.html');
const OUT = path.join(HERE, 'ops-room.html');
const DEPLOY = path.join(HERE, '..', 'public', 'ops', 'index.html');
const DEPLOY_ASSETS = path.join(HERE, '..', 'public', 'ops', 'assets');
const THEME_FILE = 'zaostock.mp3';
const MAX_MB = 15; // the artifact host refuses anything over 16
const MAX_DEPLOY_MB = 1; // the site copy has no excuse to be heavy

function read(p) {
  if (!fs.existsSync(p)) { console.error('missing asset: ' + p); process.exit(1); }
  return fs.readFileSync(p);
}
const b64 = (p) => read(p).toString('base64');
const jpeg = (p) => 'data:image/jpeg;base64,' + b64(p);
const png = (p) => 'data:image/png;base64,' + b64(p);

const img = {
  badge: png(path.join(HERE, 'assets', 'badge.png')),
  zao: jpeg(path.join(HERE, 'assets', 'zao.jpg')),
  stage: jpeg(path.join(HERE, 'assets', 'img-stage.jpg')),
  crowd: jpeg(path.join(HERE, 'assets', 'img-crowd.jpg')),
  zaal: jpeg(path.join(HERE, 'assets', 'img-zaal.jpg'))
};

const themeMeta = { title: 'ZAOSTOCK', artist: 'Iman Afrikah' };
const themeInline = Object.assign({}, themeMeta, {
  src: 'data:audio/mpeg;base64,' + b64(path.join(HERE, 'assets', THEME_FILE))
});
const themeLinked = Object.assign({}, themeMeta, { src: '/ops/assets/' + THEME_FILE });

const source = fs.readFileSync(SRC, 'utf8');

// Stamp the source's hash into every output so a stale build is detectable
// without rebuilding to find out. Hashed with line endings normalised to LF: a
// Windows checkout with autocrlf hands the build CRLF while CI reads LF, and the
// same source would otherwise stamp two different hashes. The test normalises
// the same way, so the stamp means "same source", not "same operating system".
const srcHash = crypto.createHash('sha256').update(source.replace(/\r\n/g, '\n')).digest('hex').slice(0, 16);

// The anchor is the <title>, not </head>: this file is an artifact fragment and
// has no <head> at all. A .replace() on a token that is not there returns the
// string unchanged and reports nothing, so every substitution below checks its
// anchor first and fails loudly rather than printing "built" over nothing.
const TITLE = '<title>ZAOstock Ops Room</title>';

// The source is an artifact fragment: the artifact host wraps it in a document
// that already declares a charset and a viewport. The site copy is served as-is,
// so it has to declare both itself, or a phone lays it out 980 px wide and
// shrinks the whole board to fit.
const SITE_HEAD = '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n';

function build(theme, head) {
  let out = source;
  for (const [token, value] of [
    ['/*__IMG__*/{}', JSON.stringify(img)],
    ['/*__THEME__*/null', JSON.stringify(theme)],
    [TITLE, (head || '') + TITLE + '\n<meta name="ops-room-src" content="' + srcHash + '">']
  ]) {
    if (!out.includes(token)) { console.error('placeholder missing in source: ' + token); process.exit(1); }
    out = out.replace(token, value);
  }
  if (!out.includes('ops-room-src')) { console.error('stamp failed to apply'); process.exit(1); }
  return out;
}

const mb = (s) => Buffer.byteLength(s, 'utf8') / 1048576;

const artifact = build(themeInline);
fs.writeFileSync(OUT, artifact);
console.log('built ops-room/ops-room.html      ' + mb(artifact).toFixed(2) + ' MB  (artifact, everything inline)  src ' + srcHash);
if (mb(artifact) > MAX_MB) { console.error('over budget: 16 MB is the ceiling'); process.exit(1); }

const deployed = build(themeLinked, SITE_HEAD);
fs.mkdirSync(DEPLOY_ASSETS, { recursive: true });
fs.copyFileSync(path.join(HERE, 'assets', THEME_FILE), path.join(DEPLOY_ASSETS, THEME_FILE));
fs.writeFileSync(DEPLOY, deployed);
console.log('built public/ops/index.html       ' + mb(deployed).toFixed(2) + ' MB  (site, theme linked from /ops/assets/)');
console.log('copied public/ops/assets/' + THEME_FILE);
if (mb(deployed) > MAX_DEPLOY_MB) { console.error('the site copy is over ' + MAX_DEPLOY_MB + ' MB; something got inlined that should be linked'); process.exit(1); }
