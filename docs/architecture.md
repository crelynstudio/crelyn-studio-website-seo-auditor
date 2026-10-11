# Architecture

Data flow: CLI → validated configuration → SafeHttp → crawler/parsers → analyzers → redacted snapshot → terminal/JSON/static HTML.

- `src/config`: strict CLI options, bounded budgets, en/en_US/tr normalization.
- `src/core`: types, SiteMercek identity, package/rule version.
- `src/network`: native HTTP(S), all-answer DNS policy, pinned sockets, shared cache, safe redirects, request/deadline/size/rate budgets, header allowlist.
- `src/parsers`: robots, sitemap and static HTML. Resources and headings are bounded to 10,000 per document.
- `src/crawler`: same-origin page queue and sitemap discovery. Optional `resources.ts` shares SafeHttp and has a separate candidate budget. External resources are ignored.
- `src/analyzers`: pure evidence-based checks with stable IDs and contextual recommendations.
- `src/i18n`: EN/TR rule and CLI catalogs.
- `src/reports/privacy.ts`: post-analysis masking; unmodified URLs stay in the live network cache only.
- `src/reports/diff.ts`: bounded snapshot reads, Ajv schema validation, conservative comparison and CI thresholds.
- `src/reports/html.ts`, `assets/report.js/css`: standalone viewer only; no scan form, token, fetch API or HTTP server.

Four production dependencies: HTML parsing (cheerio), XML validation/parsing (fast-xml-parser), IP classification (ipaddr.js), snapshot validation (Ajv). Ajv was already a development dependency and is now included at runtime for untrusted imported reports.

Schema v2 adds rule version, explicit scope and checked resource results. Legacy v1 reports cannot be diffed safely; rescan. The TypeScript report type retains v1 for existing programmatic report rendering. Findings retain rule, severity, confidence, page/source/target, observed/expected evidence, translated message/fix and documentation link.

Diff identity includes severity so escalations are new. Invalid canonical observations distinguish multiple issues at one URL. Equal scope and complete identical URL/redirect coverage are required for new/resolved results. Partial coverage uses UNVERIFIED; skipped SEO checks cannot resolve existing findings. Different scope/rule versions fail explicitly.

The clean build removes only generated dist output before TypeScript compilation, preventing removed web commands from surviving packaging. npm ships compiled JS, viewer assets, schema and documentation. Tests and source are in Git; test files are excluded from the npm package.

Türkçe: CLI doğrulanan ayarlarla güvenli istemciyi çalıştırır; tarayıcı yalnızca kaydedilen raporu görüntüler. Kaynak kontrolünün ayrı bütçesi vardır. Şema v2 kapsam/kural sürümünü kaydeder. Eksik/uyumsuz karşılaştırmada çözüldü iddiası yapılmaz. Yeni kural için iki dilde metin, test, kanıt ve kural belgesi ekleyin.
