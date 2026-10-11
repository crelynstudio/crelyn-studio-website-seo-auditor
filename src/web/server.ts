import http from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { parseConfig } from '../config/index.js';
import { scan } from '../crawler/index.js';
import { renderHtml } from './page.js';
import { PRODUCT } from '../core/types.js';

export function createWebServer() {
  const token = randomBytes(32).toString('hex');
  let busy = false;
  const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Cache-Control', 'no-store');
    const host = `127.0.0.1:${(server.address() as import('node:net').AddressInfo).port}`;
    const reply = (status: number, value: unknown) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(value)); };
    if (req.headers.host !== host) { reply(403, { error: 'HOST_DENIED' }); return; }
    if (req.method === 'GET' && req.url === '/') {
      try { const page = await renderHtml(undefined, token); res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(page); }
      catch { reply(500, { error: 'INTERFACE_UNAVAILABLE' }); }
      return;
    }
    if (req.method !== 'POST' || req.url !== '/api/audit') { reply(404, { error: 'NOT_FOUND' }); return; }
    const supplied = Buffer.from(String(req.headers['x-audit-token'] ?? ''));
    const expected = Buffer.from(token);
    if (req.headers.origin !== `http://${host}` || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) { reply(403, { error: 'ORIGIN_DENIED' }); return; }
    if (busy) { reply(409, { error: 'AUDIT_BUSY' }); return; }
    if (!req.headers['content-type']?.startsWith('application/json')) { reply(400, { error: 'CONTENT_TYPE' }); return; }
    busy = true;
    const controller = new AbortController();
    const abort = () => { if (!res.writableEnded) controller.abort(); };
    res.on('close', abort);
    try {
      let length = 0;
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        length += chunk.length;
        if (length > 16384) { reply(413, { error: 'BODY_TOO_LARGE' }); return; }
        chunks.push(chunk);
      }
      const input: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      if (!input || typeof input !== 'object') throw new Error('INPUT');
      const data = input as Record<string, unknown>;
      if (typeof data.url !== 'string' || data.url.length > 8192 || typeof data.maxPages !== 'number' || !Number.isInteger(data.maxPages) || data.maxPages < 1 || data.maxPages > 100 || !['tr', 'en_US'].includes(String(data.lang)) || typeof data.allowPrivateNetwork !== 'boolean') throw new Error('INPUT');
      const args = [data.url, '--max-pages', String(data.maxPages), '--lang', String(data.lang)];
      if (data.allowPrivateNetwork) args.push('--allow-private-network');
      const config = parseConfig(args);
      const result = await scan(config, controller.signal);
      if (!res.destroyed) reply(200, result);
    } catch { if (!res.destroyed) reply(400, { error: 'INVALID_INPUT' }); }
    finally { busy = false; res.off('close', abort); }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  return server;
}

export async function startWebServer(port = 4173) {
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT_INVALID');
  const server = createWebServer();
  await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  console.log(`${PRODUCT}\nhttp://127.0.0.1:${(server.address() as import('node:net').AddressInfo).port}\nCtrl+C`);
  const stop = () => { server.closeAllConnections(); server.close(); };
  process.once('SIGINT', stop); process.once('SIGTERM', stop);
  return server;
}
