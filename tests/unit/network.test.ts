import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUrl, publicAddress, safeAddresses } from '../../src/network/url.js';
import { parseConfig } from '../../src/config/index.js';

test('URL normalization preserves meaningful path/query differences', () => {
  assert.equal(normalizeUrl('HTTP://EXAMPLE.COM:80/A/?b=2&a=1#x'), 'http://example.com/A/?b=2&a=1');
  for (const value of ['file:///etc/passwd', 'https://u:p@example.com', 'junk', 'data:text/plain,x']) assert.throws(() => normalizeUrl(value));
});
test('private, reserved, metadata and mapped addresses are blocked', async () => {
  for (const ip of ['127.0.0.1', '10.0.0.1', '172.16.0.1', '192.168.1.1', '169.254.169.254', '0.0.0.0', '224.0.0.1', '::1', 'fe80::1', 'fc00::1', '::ffff:127.0.0.1', '2001:db8::1']) assert.equal(publicAddress(ip), false, ip);
  assert.equal(publicAddress('8.8.8.8'), true);
  await assert.rejects(safeAddresses(new URL('http://example.com'), false, async () => [{ address: '8.8.8.8', family: 4 }, { address: '10.0.0.1', family: 4 }]), /NETWORK_PRIVATE/);
  await assert.rejects(safeAddresses(new URL('http://0x7f000001'), false), /NETWORK_PRIVATE/);
  assert.equal((await safeAddresses(new URL('http://127.0.0.1'), true))[0]!.address, '127.0.0.1');
});
test('CLI defaults and hard bounds', () => {
  const config = parseConfig(['https://example.com']);
  assert.equal(config.concurrency, 2); assert.equal(config.maxPages, 100);
  assert.equal(config.allowPrivateNetwork, false);
  for (const args of [['--max-pages', '0'], ['--concurrency', '3'], ['--timeout', 'NaN'], ['--format', 'xml'], ['--lang', 'de'], ['--wat']]) assert.throws(() => parseConfig(['https://example.com', ...args]));
});
test('DNS policy is re-evaluated when answers change', async () => {
  let calls = 0;
  const resolver = async () => [{ address: calls++ === 0 ? '8.8.8.8' : '127.0.0.1', family: 4 }];
  await safeAddresses(new URL('https://rebind.test/'), false, resolver);
  await assert.rejects(safeAddresses(new URL('https://rebind.test/next'), false, resolver), /NETWORK_PRIVATE/);
});
