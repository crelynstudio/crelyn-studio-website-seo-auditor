import http from 'node:http';
const server = http.createServer((req, res) => {
  if (req.url === '/robots.txt') { res.end('User-agent: *\nAllow: /'); return; }
  if (req.url === '/sitemap.xml') { res.setHeader('Content-Type', 'application/xml'); res.end('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>http://127.0.0.1:4765/</loc></url><url><loc>http://127.0.0.1:4765/about</loc></url></urlset>'); return; }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (req.url === '/') res.end('<!doctype html><html lang="tr"><title>Örnek Atölye</title><meta name="description" content="SiteMercek için yapay test sitesi"><h1>Örnek Atölye</h1><a href="/about">Hakkında</a><a href="/missing">Bilerek bozuk bağlantı</a></html>');
  else if (req.url === '/about') res.end('<!doctype html><html lang="tr"><title>Örnek Atölye</title><meta name="robots" content="noindex"><h1>Hakkında</h1><p>Bu veriler yalnızca yerel deneme içindir.</p></html>');
  else { res.writeHead(404); res.end('<title>Bulunamadı</title><h1>404</h1>'); }
});
server.on('error', error => { console.error(error.code); process.exitCode = 1; });
server.listen(4765, '127.0.0.1', () => console.log('Demo / Örnek: http://127.0.0.1:4765 — Ctrl+C'));
const stop = () => { server.closeAllConnections(); server.close(); };
process.on('SIGINT', stop); process.on('SIGTERM', stop);
