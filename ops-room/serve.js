const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = __dirname, PORT = 4173;
http.createServer((req, res) => {
  let f = decodeURIComponent(req.url.split('?')[0]);
  if (f === '/') f = '/zaostock-ops-room.html';
  const p = path.join(ROOT, f);
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end('not found'); }
  const ext = path.extname(p).toLowerCase();
  const type = ext === '.html' ? 'text/html; charset=utf-8' : ext === '.mp3' ? 'audio/mpeg' : 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  fs.createReadStream(p).pipe(res);
}).listen(PORT, () => console.log('ZAOstock ops room on http://localhost:' + PORT));
