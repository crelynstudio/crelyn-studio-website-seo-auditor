# Architecture

Data flow: CLI or loopback browser API → validated configuration → SafeHttp → crawler/parsers → analyzers → report.

- src/config: strict input validation; en_US is normalized to the existing en report schema value.
- src/core: shared types, product identity, version.
- src/network: standard-library HTTP(S), all-answer DNS policy, pinned sockets, rate and resource budgets, safe redirects.
- src/parsers: bounded robots, sitemap, and static HTML parsing.
- src/crawler: same-origin queue, sitemap traversal, URL deduplication, explicit coverage/skips, abort.
- src/analyzers: pure checks with evidence and contextual recommendations; failures are visible.
- src/i18n: English/Turkish rule catalogs; language-independent technical IDs.
- src/reports: terminal sanitization, JSON, unique exclusive file creation.
- src/web/server.ts: loopback server, exact Host and Origin checks, session token, bounded inputs, single active audit, disconnect cancellation.
- src/web/page.ts and assets/web.js/css: shared browser workspace and standalone reports. Page data enters through safely escaped JSON and textContent; an exact CSP hash permits only the embedded application script. Exported HTML removes the session token and denies network connections.

No frontend framework or build-time bundler is needed. Three production dependencies provide HTML parsing, XML validation/parsing, and IP classification. Node native HTTP lets the scanner pin DNS answers without a proxy path.

Findings include stable rule ID, severity, confidence, affected URL, optional source/target, observed/expected evidence, localized message and recommendation. Schema version remains 1; only failed findings are emitted, with skipped checks recorded separately. Absence of a finding is never a universal pass.

To add a rule, extend RuleId and both catalogs, add pure analyzer logic and local tests, and document it in rules.md. Severity changes affect CLI exit thresholds.

Repository root is repo/ within the local workspace. Product assets are shipped within the repository; runtime does not depend on the parent template.
