import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import ipaddr from 'ipaddr.js';

export function normalizeUrl(input: string, base?: string): string {
  let url: URL;
  try { url = new URL(input, base); } catch { throw new Error('URL_INVALID'); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('URL_SCHEME');
  if (url.username || url.password) throw new Error('URL_CREDENTIALS');
  url.hash = '';
  return url.href;
}
export function publicAddress(address: string): boolean {
  try {
    let parsed = ipaddr.parse(address);
    if (parsed.kind() === 'ipv6' && (parsed as ipaddr.IPv6).isIPv4MappedAddress()) {
      parsed = (parsed as ipaddr.IPv6).toIPv4Address();
    }
    return parsed.range() === 'unicast';
  } catch { return false; }
}
export type Resolver = (host: string) => Promise<{ address: string; family: number }[]>;
export const resolveHost: Resolver = host => lookup(host, { all: true, verbatim: true });
export async function safeAddresses(url: URL, allowPrivate: boolean, resolver: Resolver = resolveHost) {
  const host = url.hostname.replace(/^\[|\]$/g, '');
  const addresses = isIP(host) ? [{ address: host, family: isIP(host) }] : await resolver(host);
  if (!addresses.length) throw new Error('DNS_EMPTY');
  if (!allowPrivate && addresses.some(a => !publicAddress(a.address))) throw new Error('NETWORK_PRIVATE');
  return addresses;
}
