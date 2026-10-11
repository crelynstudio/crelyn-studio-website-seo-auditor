import http from 'node:http';
import https from 'node:https';
import { Transform, Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGunzip, createInflate, createBrotliDecompress } from 'node:zlib';
import { setTimeout as delay } from 'node:timers/promises';
import type { ScanConfig } from '../core/types.js';
import { normalizeUrl, safeAddresses, type Resolver } from './url.js';

export interface HttpResult {
  url: string; status: number; headers: Record<string, string>; body: string; redirects: string[];
}
export class NetworkError extends Error {
  constructor(public code: string, public redirects: string[] = []) { super(code); }
}
const LIMIT = 2 * 1024 * 1024;
function limiter() {
  let size = 0;
  return new Transform({ transform(chunk: Buffer, _encoding, callback) {
    size += chunk.length;
    callback(size > LIMIT ? new NetworkError('BODY_TOO_LARGE') : null, chunk);
  } });
}
export class SafeHttp {
  private lastStart = 0;
  private rateTail = Promise.resolve();
  private active = 0;
  private waiters: (() => void)[] = [];
  private cache = new Map<string, Promise<HttpResult>>();
  private resourceCache = new Map<string, Promise<HttpResult>>();
  private requests = 0;
  public allowed: (url: string) => boolean = () => true;
  constructor(private config: ScanConfig, private signal: AbortSignal, private resolver?: Resolver) {}

  get(raw: string, robots = false): Promise<HttpResult> {
    const url = normalizeUrl(raw);
    const key = `${robots ? 'robots:' : ''}${url}`;
    const existing = this.cache.get(key);
    if (existing) return existing;
    const pending = this.follow(url, robots);
    this.cache.set(key, pending);
    return pending;
  }
  private async follow(raw: string, robots: boolean): Promise<HttpResult> {
    const chain: string[] = [];
    let url = raw;
    for (let hop = 0; hop <= 5; hop++) {
      this.signal.throwIfAborted();
      if (new URL(url).origin !== new URL(this.config.url).origin) throw new NetworkError('REDIRECT_ORIGIN', chain);
      if (!robots && !this.allowed(url)) throw new NetworkError('ROBOTS_DENIED', chain);
      if (chain.includes(url)) throw new NetworkError('REDIRECT_LOOP', [...chain, url]);
      chain.push(url);
      let result: HttpResult;
      try {
        let resource = this.resourceCache.get(url);
        if (!resource) { resource = this.resource(url); this.resourceCache.set(url, resource); }
        result = await resource;
      } catch (error) {
        throw new NetworkError(error instanceof NetworkError ? error.code : 'NETWORK_FAILED', chain);
      }
      if ([301, 302, 303, 307, 308].includes(result.status)) {
        if (!result.headers.location) throw new NetworkError('REDIRECT_LOCATION', chain);
        if (hop === 5) throw new NetworkError('REDIRECT_LIMIT', chain);
        try { url = normalizeUrl(result.headers.location, url); }
        catch { throw new NetworkError('REDIRECT_LOCATION', chain); }
      } else return { ...result, redirects: chain.slice(0, -1) };
    }
    throw new NetworkError('REDIRECT_LIMIT', chain);
  }
  private async resource(url: string): Promise<HttpResult> {
    let result = await this.limitedRequest(url);
    if ([429, 503].includes(result.status)) {
      const header = result.headers['retry-after'];
      const seconds = header && /^\d+$/.test(header) ? Number(header) : header ? (Date.parse(header) - Date.now()) / 1000 : 1;
      if (Number.isFinite(seconds) && seconds >= 0 && seconds <= 5) {
        await delay(Math.max(500, seconds * 1000), undefined, { signal: this.signal });
        result = await this.limitedRequest(url);
      }
    }
    return result;
  }
  private async limitedRequest(url: string): Promise<HttpResult> {
    if (this.active >= this.config.concurrency) await new Promise<void>(resolve => this.waiters.push(resolve));
    else this.active++;
    try {
      this.signal.throwIfAborted();
      if (++this.requests > this.config.maxPages * 12 + 32) throw new NetworkError('REQUEST_BUDGET');
      return await this.request(url);
    } finally {
      const next = this.waiters.shift();
      if (next) next(); else this.active--;
    }
  }
  private async rateSlot(): Promise<void> {
    let release!: () => void;
    const previous = this.rateTail;
    this.rateTail = new Promise<void>(resolve => { release = resolve; });
    await previous;
    try {
      await delay(Math.max(0, this.lastStart + 500 - Date.now()), undefined, { signal: this.signal });
      this.lastStart = Date.now();
    } finally { release(); }
  }
  private async request(raw: string): Promise<HttpResult> {
    const dnsStarted = Date.now();
    const dnsSignal = AbortSignal.any([this.signal, AbortSignal.timeout(this.config.timeout)]);
    const url = new URL(raw);
    let addresses;
    try {
      addresses = await new Promise<Awaited<ReturnType<typeof safeAddresses>>>((resolve, reject) => {
        const abort = () => reject(new NetworkError('TIMEOUT'));
        dnsSignal.addEventListener('abort', abort, { once: true });
        safeAddresses(url, this.config.allowPrivateNetwork, this.resolver).then(resolve, reject)
          .finally(() => dnsSignal.removeEventListener('abort', abort));
        if (dnsSignal.aborted) abort();
      });
    } catch (error) {
      throw error instanceof NetworkError ? error : new NetworkError(error instanceof Error && error.message === 'NETWORK_PRIVATE' ? 'NETWORK_PRIVATE' : 'DNS_FAILED');
    }
    const remaining = Math.max(1, this.config.timeout - (Date.now() - dnsStarted));
    await this.rateSlot();
    const signal = AbortSignal.any([this.signal, AbortSignal.timeout(remaining)]);
    const pinned = addresses[0]!;
    return new Promise((resolve, reject) => {
      // Direct sockets deliberately ignore proxy environment variables; DNS is pinned per request.
      const request = (url.protocol === 'https:' ? https : http).get(url, {
        agent: false, signal, family: pinned.family,
        lookup: (_host, _options, callback) => callback(null, pinned.address, pinned.family),
        headers: { 'User-Agent': 'SiteMercek/0.1 (+https://github.com/crelynstudio)', 'Accept-Encoding': 'gzip, deflate, br' }
      }, response => {
        const headers: Record<string, string> = {};
        for (const [key, value] of Object.entries(response.headers)) if (value !== undefined && !['set-cookie', 'www-authenticate'].includes(key)) headers[key] = Array.isArray(value) ? value.join(', ') : value;
        const status = response.statusCode ?? 0;
        if ([301, 302, 303, 307, 308].includes(status)) {
          response.destroy();
          resolve({ url: raw, status, headers, body: '', redirects: [] });
          return;
        }
        const chunks: Buffer[] = [];
        const sink = new Writable({ write(chunk: Buffer, _encoding, callback) { chunks.push(chunk); callback(); } });
        const encoding = headers['content-encoding'];
        const decoder = encoding === 'gzip' ? createGunzip() : encoding === 'deflate' ? createInflate() : encoding === 'br' ? createBrotliDecompress() : undefined;
        if (encoding && encoding !== 'identity' && !decoder) { response.destroy(); reject(new NetworkError('ENCODING_UNSUPPORTED')); return; }
        const streams = decoder ? [response, limiter(), decoder, limiter(), sink] : [response, limiter(), sink];
        pipeline(streams, { signal }).then(() => resolve({ url: raw, status, headers, body: Buffer.concat(chunks).toString('utf8'), redirects: [] }), reject);
      });
      request.on('error', error => reject(error instanceof NetworkError ? error : new NetworkError(signal.aborted ? 'TIMEOUT' : 'NETWORK_FAILED')));
    });
  }
}
