#!/usr/bin/env node
import { parseConfig } from '../config/index.js';
import { VERSION, type Lang } from '../core/types.js';
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
    console.log(`SiteMercek\n${m.developer}\nhttps://crelynstudio.com\nmailto:info@crelynstudio.com\nhttps://github.com/crelynstudio\nhttps://www.behance.net/crelynstudio\nhttps://www.instagram.com/crelynstudio/\nhttps://x.com/crelynstudio\nhttps://www.threads.com/@crelynstudio`); return;
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
    console.error(`${m.running}: ${config.url.replace(/[\u0000-\u001f\u007f-\u009f]/g, '')}`);
    const report = await scan(config, controller.signal, (discovered, crawled, skipped) => {
      if (process.stderr.isTTY) process.stderr.write(`\r${m.discovered}: ${discovered} | ${m.pages}: ${crawled} | ${m.skipped}: ${skipped}    `);
    });
    if (process.stderr.isTTY) process.stderr.write('\n');
    const paths = await writeReports(report);
    for (const path of paths) console.error(path);
    process.exitCode = exitCode(report);
  } finally { process.off('SIGINT', abort); process.off('SIGTERM', abort); }
}
main().catch(() => { console.error(`${m.fatal} [RUNTIME_FAILED]`); process.exitCode = 1; });
