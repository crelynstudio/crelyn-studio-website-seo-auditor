# SiteMercek

**Website Quality & Technical SEO CLI** · Developed by Crelyn Studio
**Find what broke. Fix what matters.**

```sh
sitemercek audit https://example.com
sitemercek diff before.json after.json --fail-on-new error
```

These commands use a locally installed package. **0.3.0-preview.1 is a development preview; the npm package has not been published.** [Türkçe documentation](README.tr.md).

SiteMercek checks static HTML, broken internal links and technical SEO from your terminal. It writes local JSON snapshots and standalone HTML reports. It starts no HTTP server and has no browser application, account, API key or telemetry.

## Terminal output

Actual local fixture output (timing varies):

```text
SiteMercek 0.3.0-preview.1 | Scan summary
http://127.0.0.1:4765/
Complete | Pages: 3 | Skipped: 1
Error: 2 | Warning: 2 | Information: 2
[Error] HTTP_001 HTTP request failed.
  http://127.0.0.1:4765/missing
```

[Full recorded Turkish output](docs/examples/terminal-tr.txt). Fixture data is synthetic.

## Quick start

Node.js **22.18+ or 24.x**, npm and Git. CI checks Node 22 and 24 on Windows, Linux and macOS.

```sh
git clone https://github.com/crelynstudio/crelyn-studio-website-seo-auditor.git
cd crelyn-studio-website-seo-auditor
npm ci
npm run build
node dist/src/cli/index.js --help
node dist/src/cli/index.js audit https://example.com --format html,json
```

Installation needs registry access. Auditing needs access to the target and DNS. Saved HTML reports work offline, including filters and language switching.

### Install the local package

```sh
npm pack
npm install --global ./crelynstudio-sitemercek-0.3.0-preview.1.tgz
sitemercek --version
sitemercek audit https://example.com --max-pages 100
sitemercek audit https://example.com --lang tr --format html,json
```

Global installation may require a user-writable npm prefix. `npm run test:package` verifies a temporary local installation instead. `site-audit` remains a transitional alias; prefer `sitemercek`.

**After a future npm publication only**, the intended command is `npx @crelynstudio/sitemercek audit https://example.com`. Package ownership and publication are not implied by this preview.

### Local fixture

In one terminal:

```sh
node examples/demo-server.mjs
```

In another:

```sh
node dist/src/cli/index.js audit http://127.0.0.1:4765 --allow-private-network --lang tr --format terminal,html,json
```

The server above is an explicit test fixture. The audit command never starts it. Stop the fixture with Ctrl+C.

## Features

- Bounded same-origin crawling, URL deduplication, robots.txt and sitemap discovery.
- HTTP failures, broken internal links, redirect chains, titles, descriptions, H1/heading structure, canonical conflicts, noindex and duplicate metadata.
- Contextual passive HTTPS header observations, without a security or ranking score.
- Optional image, script and stylesheet checks through the same protected HTTP client.
- EN/TR terminal messages, local JSON snapshots, searchable offline HTML with language/severity filters.
- Snapshot comparison and explicit CI thresholds.

```sh
sitemercek audit https://example.com --check-resources --max-resources 100 --max-pages 50
```

Resource checks cover `img[src]`, `script[src]` and `link[rel=stylesheet][href]` in static HTML. External origins are ignored. Page and resource candidate budgets are separate; shared URLs reuse the HTTP cache. Resources retain robots, origin, DNS/IP, redirect, rate, deadline and body-size limits. No CSS imports, srcset, dynamic DOM or browser rendering.

Run `sitemercek --help` for all options. Defaults: 100 pages, depth 4, concurrency 2, timeout 10000 ms, 100 resources when enabled. Limits: 1000 pages/resources, depth 10, concurrency 2; starts at least 500 ms apart. Sitemap seeds start at depth zero.

## HTML report

Open generated `.html` directly as a file. No server or external scripts/fonts are required. The viewer supports EN/TR, search, severity filters, affected URLs, evidence, fixes, rule documentation, scan scope and skipped checks. It cannot start another audit.

![Static HTML report, synthetic local fixture](docs/screenshots/report-tr-desktop.png)

[Open the sample HTML](docs/examples/demo-tr.html) · [JSON snapshot](docs/examples/demo-tr.json) · [Report schema v2](docs/report.schema.json)

## Snapshot / Diff

```sh
sitemercek audit https://example.com --format json > before.json
# Deploy your changes, then repeat with the same options.
sitemercek audit https://example.com --format json > after.json
sitemercek diff before.json after.json
sitemercek diff before.json after.json --format json --fail-on-new warning
```

JSON alone, without `--output`, goes to stdout. Progress/errors go to stderr. Multiple formats or `--output <directory>` save uniquely named files without overwriting.

Diff emits **NEW**, **RESOLVED**, **UNCHANGED** and **UNVERIFIED**. Identity uses stable rule ID, severity, normalized page/source/target URLs, and invalid canonical evidence where needed. Repeated identical findings are deduplicated. Severity escalation is a new issue.

Schema v2 records rule version, origin/start URL, page/depth/resource budgets, resource mode, private-network policy and completion. Different scope or rule versions are rejected. Both scans must be complete with identical checked page/resource URL sets and redirect destinations for new/resolved classifications. SEO checks that did not execute cannot resolve prior findings. Changed coverage or partial/aborted scans retain common findings and classify unmatched findings as UNVERIFIED; exit 1. This conservative policy may require another comparable scan after the site graph changes.

Legacy schema v1 requires a fresh scan. Snapshots larger than 20 MiB, malformed snapshots and masked URL identities are rejected. Redaction may make sensitive URLs unsuitable for diff; remove secrets from target URLs rather than bypassing masking.

## CI/CD

Use a trusted baseline snapshot created with identical options:

```sh
node dist/src/cli/index.js audit https://your-site.example --format json > after.json
node dist/src/cli/index.js diff before.json after.json --fail-on-new error
```

In CI, check the audit exit status before running diff. The first command may exit 1 for incomplete coverage. [Repository CI](.github/workflows/ci.yml) tests the supported OS/Node matrix, including local package installation. Audit requests still need authorized network access.

| Exit | Meaning |
| --- | --- |
| 0 | Complete audit/diff; configured threshold not exceeded |
| 1 | Invalid input, runtime failure, incomplete scan/diff or incompatible snapshots |
| 2 | Complete audit exceeds `--fail-on error\|warning`, or diff has new findings meeting `--fail-on-new error\|warning` |

Threshold defaults are `none`. Warnings include errors for gating; information does not trigger a threshold. `NO_COLOR`, CI and non-TTY output disable terminal colors.

## Security and scope

All requests use DNS/IP validation and pinned connections; private/reserved networks are denied by default. Redirects stay on the same origin, TLS verification stays enabled, retries are bounded, and robots failures deny crawling. `--allow-private-network` is only for trusted local/private targets; other safeguards remain active.

Reports use a response-header allowlist and mask common token, credential, cookie, sensitive query, Basic/Bearer and JWT patterns. HTML uses escaped embedded JSON, textContent and a hashed script under a restrictive CSP. Masking is best effort: arbitrary page text, path segments or unknown secret formats can still contain sensitive data. Review reports before sharing.

Static-source observations do not describe JavaScript-rendered DOM. Missing tags may exist after rendering. SEO advice is contextual and gives no Google ranking guarantee. No authentication/session crawling, external-origin audits, accessibility audit, telemetry, automatic fixes or SaaS infrastructure.

[Security model](docs/security-model.md) · [Rules](docs/rules.md) · [Architecture](docs/architecture.md) · [Report a vulnerability](SECURITY.md)

## Contributing

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run test:package
```

Tests use local fixtures/injected DNS, not third-party websites. Package installation uses the npm registry. [Contribution guide](CONTRIBUTING.md) · [Changelog](CHANGELOG.md)

## Developer and license

**Developed by Crelyn Studio** · [Website](https://crelynstudio.com) · [Contact](mailto:info@crelynstudio.com) · [GitHub](https://github.com/crelynstudio)

Source code: [MIT](LICENSE). Crelyn Studio names, marks and logos remain separate brand assets; MIT does not grant trademark rights. This is a preview, without an independent security audit.
