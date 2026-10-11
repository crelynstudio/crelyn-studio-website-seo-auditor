#!/usr/bin/env node
import { parseConfig } from '../config/index.js';
import { VERSION, PRODUCT, type Lang } from '../core/types.js';
import { parseArgs } from 'node:util';
import { diff, readSnapshot, diffTerminal, diffExitCode } from '../reports/diff.js';
import { redactText } from '../reports/privacy.js';
import { colorize } from '../reports/index.js';
import { messages } from '../i18n/index.js';
import { scan } from '../crawler/index.js';
import { exitCode, writeReports } from '../reports/index.js';

const args = process.argv.slice(2);
const lang: Lang = args[args.indexOf('--lang') + 1] === 'tr' || args.includes('--lang=tr') ? 'tr' : 'en';
const m = messages(lang);
async function main() {
  if (args.includes('--help')) { console.log(m.help); return; }
  if (args.includes('--version')) { console.log(VERSION); return; }
  if (args.includes('--about')) {
    console.log(`${PRODUCT}\n${m.developer}\nhttps://crelynstudio.com\nmailto:info@crelynstudio.com\nhttps://github.com/crelynstudio\nhttps://www.behance.net/crelynstudio\nhttps://www.instagram.com/crelynstudio/\nhttps://x.com/crelynstudio\nhttps://www.threads.com/@crelynstudio`); return;
  }
  if (args[0] === 'diff') {
    const { values, positionals } = parseArgs({ args: args.slice(1), strict: true, allowPositionals: true, options: {
      format: { type: 'string', default: 'terminal' }, lang: { type: 'string', default: 'en' },
      'fail-on-new': { type: 'string', default: 'none' }
    } });
    if (positionals.length !== 2 || !['terminal', 'json'].includes(values.format!) || !['en', 'en_US', 'tr'].includes(values.lang!) || !['none', 'error', 'warning'].includes(values['fail-on-new']!)) throw new Error('CONFIG_DIFF');
    const result = diff(await readSnapshot(positionals[0]!), await readSnapshot(positionals[1]!));
    console.log(values.format === 'json' ? JSON.stringify(result, null, 2) : colorize(diffTerminal(result, lang)));
    process.exitCode = diffExitCode(result, values['fail-on-new'] as 'none' | 'error' | 'warning'); return;
  }
  let config;
  try { config = parseConfig(args); }
  catch (error) {
    console.error(`${m.invalid} [${error instanceof Error && /^[A-Z_]+$/.test(error.message) ? error.message : 'CONFIG_INVALID'}]`);
    process.exitCode = 1; return;
  }
  const controller = new AbortController();
  const abort = () => controller.abort();
  process.on('SIGINT', abort); process.on('SIGTERM', abort);
  try {
    console.error(`${m.running}: ${redactText(config.url).replace(/[\u0000-\u001f\u007f-\u009f]/g, '')}`);
    const report = await scan(config, controller.signal, (discovered, crawled, skipped) => {
      if (process.stderr.isTTY) process.stderr.write(`\r${m.discovered}: ${discovered} | ${m.pages}: ${crawled} | ${m.skipped}: ${skipped}    `);
    });
    if (process.stderr.isTTY) process.stderr.write('\n');
    const paths = await writeReports(report);
    for (const path of paths) console.error(path);
    process.exitCode = exitCode(report);
  } finally { process.off('SIGINT', abort); process.off('SIGTERM', abort); }
}
main().catch((error: unknown) => {
  const code = error instanceof Error && /^[A-Z_]+$/.test(error.message) ? error.message : 'RUNTIME_FAILED';
  console.error(`${m.fatal} [${code}]`); process.exitCode = 1;
});
