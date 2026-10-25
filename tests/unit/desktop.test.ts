import test from 'node:test';
import assert from 'node:assert/strict';
import { desktopConfig } from '../../src/desktop/config.js';

test('desktop requests use the protected crawler defaults and validate untrusted input', () => {
  const config = desktopConfig({ url: ' https://example.com/path ', lang: 'tr', checkResources: true, allowPrivateNetwork: false });
  assert.equal(config.url, 'https://example.com/path');
  assert.equal(config.maxPages, 100);
  assert.equal(config.checkResources, true);
  assert.equal(config.allowPrivateNetwork, false);
  for (const value of [null, {}, { url: 'file:///etc/passwd', lang: 'en', checkResources: false, allowPrivateNetwork: false },
    { url: 'https://example.com', lang: 'xx', checkResources: false, allowPrivateNetwork: false },
    { url: 'https://example.com', lang: 'en', checkResources: 'yes', allowPrivateNetwork: false }]) {
    assert.throws(() => desktopConfig(value));
  }
});
