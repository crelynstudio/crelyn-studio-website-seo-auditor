import { parseArgs } from 'node:util';
import { normalizeUrl } from '../network/url.js';
import type { ScanConfig } from '../core/types.js';

export function parseConfig(args: string[]): ScanConfig {
  const { values, positionals } = parseArgs({ args, allowPositionals: true, strict: true, options: {
    lang: { type: 'string', default: 'en' }, 'max-pages': { type: 'string', default: '100' },
    'max-depth': { type: 'string', default: '4' }, concurrency: { type: 'string', default: '2' },
    timeout: { type: 'string', default: '10000' }, format: { type: 'string', default: 'terminal' },
    output: { type: 'string' }, 'fail-on': { type: 'string', default: 'none' },
    'allow-private-network': { type: 'boolean', default: false },
    'check-resources': { type: 'boolean', default: false }, 'max-resources': { type: 'string', default: '100' }
  } });
  if (positionals[0] === 'audit') positionals.shift();
  if (positionals.length !== 1) throw new Error('CONFIG_URL');
  const number = (key: 'max-pages' | 'max-depth' | 'concurrency' | 'timeout' | 'max-resources', min: number, max: number) => {
    const raw = values[key]!;
    const n = Number(raw);
    if (!/^\d+$/.test(raw) || !Number.isSafeInteger(n) || n < min || n > max) throw new Error('CONFIG_RANGE');
    return n;
  };
  if (!['en', 'en_US', 'tr'].includes(values.lang!)) throw new Error('CONFIG_LANG');
  if (!['error', 'warning', 'none'].includes(values['fail-on']!)) throw new Error('CONFIG_FAIL');
  const formats = [...new Set(values.format!.split(','))];
  if (!formats.length || formats.some(f => !['terminal', 'html', 'json'].includes(f))) throw new Error('CONFIG_FORMAT');
  return {
    url: normalizeUrl(positionals[0]!), lang: values.lang === 'tr' ? 'tr' : 'en',
    maxPages: number('max-pages', 1, 1000), maxDepth: number('max-depth', 0, 10),
    concurrency: number('concurrency', 1, 2), timeout: number('timeout', 100, 60000),
    formats: formats as ScanConfig['formats'], output: values.output,
    failOn: values['fail-on'] as ScanConfig['failOn'], allowPrivateNetwork: values['allow-private-network']!,
    checkResources: values['check-resources']!, maxResources: number('max-resources', 1, 1000)
  };
}
