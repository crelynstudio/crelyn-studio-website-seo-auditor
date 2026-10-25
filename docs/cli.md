# Developer CLI / Geliştirici komut satırı

The Windows app is the primary user experience. The existing `sitemercek` CLI remains for automation and source level development. Node.js 22.18+ or 24.x is required. The npm package has **not** been published.

```sh
npm ci
npm run build
node dist/src/cli/index.js audit https://example.com --format terminal,html,json
node dist/src/cli/index.js audit https://example.com --lang tr --check-resources
node dist/src/cli/index.js --help
```

`--format json` alone writes JSON to stdout; otherwise files are saved under `reports/` unless `--output` is set. The HTML report can be opened offline. `--allow-private-network` is for trusted local/private targets only. The CLI uses the same protected crawler and report rules as the desktop app.

To compare two compatible complete scans:

```sh
node dist/src/cli/index.js audit https://example.com --format json > before.json
node dist/src/cli/index.js audit https://example.com --format json > after.json
node dist/src/cli/index.js diff before.json after.json --fail-on-new error
```

Diff reports NEW, RESOLVED, UNCHANGED and UNVERIFIED. Different scope or rule versions are rejected. Partial scans do not claim resolved findings. Exit codes: 0 complete, 1 invalid/incomplete/error, 2 threshold exceeded. Use `--help` for all options. [Report schema](report.schema.json) · [Rules](rules.md).

Türkçe: Windows uygulaması ana kullanım yoludur. Komut satırı geliştirme ve otomasyon için korunur; npm'de yayımlanmamıştır. JSON tek biçimdeyse stdout'a yazılır. Eksik veya uyumsuz taramalar “çözüldü” sonucu üretmez. Tüm seçenekler için `--help` kullanın.
