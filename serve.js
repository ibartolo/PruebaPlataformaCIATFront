// Servidor local SOLO para probar el prototipo (HLS necesita HTTP, no file://).
// Uso:  node serve.js   ->  abrir  http://localhost:8080
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 8080;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.m3u8': 'application/vnd.apple.mpegurl',
  '.ts': 'video/mp2t',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf'
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const fp = path.join(root, p);
  if (!fp.startsWith(root)) { res.writeHead(403); return res.end('403'); }
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); return res.end('404 Not Found'); }
    const ext = path.extname(fp).toLowerCase();
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, () => console.log('Sirviendo el prototipo en  http://localhost:' + port));
