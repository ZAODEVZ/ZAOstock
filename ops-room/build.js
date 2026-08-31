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

const HERE = __dirname;
const SRC = path.join(HERE, 'ops-room.src.html');
const OUT = path.join(HERE, 'ops-room.html');
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

fs.writeFileSync(OUT, src);
const mb = Buffer.byteLength(src, 'utf8') / 1048576;
console.log('built ops-room/ops-room.html  ' + mb.toFixed(2) + ' MB');
if (mb > MAX_MB) { console.error('over budget: 16 MB is the ceiling'); process.exit(1); }
