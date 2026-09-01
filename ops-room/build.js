#!/usr/bin/env node
/**
 * Builds ops-room.html from ops-room.src.html.
 *
 * The ops room ships as one self-contained file: no server, no CDN for its own
 * assets, no build step for whoever opens it. That means the theme, the marks
 * and the photographs are inlined as data URIs at build time. Photographs come
 * from the site's own public/zao folder so there is one copy of each, not two.
 *
 *   node ops-room/build.js
 *
 * Output: ops-room/ops-room.html (git-ignored; it is generated, not authored).
 * Edit ops-room.src.html, never the built file.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HERE = __dirname;
const SRC = path.join(HERE, 'ops-room.src.html');
const OUT = path.join(HERE, 'ops-room.html');
// The deployed copy. public/ is served verbatim by Next, so this is the file
// zaostock.com/ops actually returns. It is GENERATED, and committing a
// generated file invites drift: edit the source, forget to rebuild, and the
// live board silently serves yesterday's. src/lib/ops-room.test.ts fails when
// the stamp below stops matching the source, so the drift cannot go unnoticed.
const DEPLOY = path.join(HERE, '..', 'public', 'ops', 'index.html');
const MAX_MB = 15; // the artifact host refuses anything over 16

function b64(p) {
  if (!fs.existsSync(p)) { console.error('missing asset: ' + p); process.exit(1); }
  return fs.readFileSync(p).toString('base64');
}
const jpeg = (p) => 'data:image/jpeg;base64,' + b64(p);
const png = (p) => 'data:image/png;base64,' + b64(p);

const img = {
  badge: png(path.join(HERE, 'assets', 'badge.png')),
  zao: jpeg(path.join(HERE, 'assets', 'zao.jpg')),
  stage: jpeg(path.join(HERE, 'assets', 'img-stage.jpg')),
  crowd: jpeg(path.join(HERE, 'assets', 'img-crowd.jpg')),
  zaal: jpeg(path.join(HERE, 'assets', 'img-zaal.jpg'))
};

const theme = {
  title: 'ZAOSTOCK',
  artist: 'Iman Afrikah',
  src: 'data:audio/mpeg;base64,' + b64(path.join(HERE, 'assets', 'zaostock.mp3'))
};

let src = fs.readFileSync(SRC, 'utf8');
for (const [token, value] of [
  ['/*__IMG__*/{}', JSON.stringify(img)],
  ['/*__THEME__*/null', JSON.stringify(theme)]
]) {
  if (!src.includes(token)) { console.error('placeholder missing in source: ' + token); process.exit(1); }
  src = src.replace(token, value);
}

// Stamp the source's hash into the output so a stale build is detectable
// without rebuilding 4.7 MB of inlined assets to find out.
//
// The anchor is the <title>, not </head>: this file is an artifact fragment and
// has no <head> at all. A .replace() on a token that is not there returns the
// string unchanged and reports nothing, so the first attempt at this stamped
// nothing while the build still printed "built" - exactly the silent-success
// shape the stamp exists to catch. Hence the explicit check, matching how the
// placeholder substitution below already fails.
const TITLE = '<title>ZAOstock Ops Room</title>';
if (!src.includes(TITLE)) { console.error('stamp anchor missing in source: ' + TITLE); process.exit(1); }
const srcHash = crypto.createHash('sha256').update(fs.readFileSync(SRC)).digest('hex').slice(0, 16);
src = src.replace(TITLE, TITLE + '\n<meta name="ops-room-src" content="' + srcHash + '">');
if (!src.includes('ops-room-src')) { console.error('stamp failed to apply'); process.exit(1); }

fs.writeFileSync(OUT, src);
fs.mkdirSync(path.dirname(DEPLOY), { recursive: true });
fs.writeFileSync(DEPLOY, src);
const mb = Buffer.byteLength(src, 'utf8') / 1048576;
console.log('built ops-room/ops-room.html  ' + mb.toFixed(2) + ' MB  src ' + srcHash);
console.log('deployed copy -> public/ops/index.html');
if (mb > MAX_MB) { console.error('over budget: 16 MB is the ceiling'); process.exit(1); }
