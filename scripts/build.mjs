import { rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

// A clean compiler output prevents removed commands from surviving upgrades and packing.
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
const result = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.json'], { stdio: 'inherit' });
process.exitCode = result.status ?? 1;
