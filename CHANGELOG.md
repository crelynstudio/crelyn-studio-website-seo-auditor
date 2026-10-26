# Changelog

## 0.4.0-beta.1 — Windows beta, 2026-10-26

- Add Windows desktop UI for starting, following and stopping website scans without a terminal.
- Group similar findings by rule and severity; show affected pages, evidence and suggested fixes.
- Add local HTML/JSON save dialogs and EN/TR light interface using the supplied brand palette.
- Keep the protected crawler and developer CLI; add a narrow sandboxed Electron bridge and request validation.
- Rename the app to Website SEO Auditor and add a frameless 16:9 Windows window.
- Add an original app mark and Windows installer build. The installer is unsigned.
- Rewrite the main guides for desktop users and retain advanced CLI instructions separately.

## 0.3.0-preview.1 — 2026-10-11

- Restore SiteMercek as a CLI-only Website Quality & Technical SEO tool.
- Remove the browser audit server, web command, scan form/API and browser-only tests.
- Preserve offline HTML reports with EN/TR, search, severity filters, evidence and documentation.
- Set npm target @crelynstudio/sitemercek; keep site-audit as a transitional alias.
- Add opt-in same-origin asset checks with a separate budget and shared protected cache.
- Add heading-level and duplicate-description observations.
- Add response-header allowlisting and post-analysis sensitive-value masking.
- Add schema v2 scope/rule metadata and snapshot/diff NEW/RESOLVED/UNCHANGED/UNVERIFIED output.
- Refuse unsafe comparisons; add --fail-on-new CI thresholds and JSON stdout.
- Clean builds prevent stale removed commands from shipping; validate local production package installs in CI.
- Rewrite CLI documentation and regenerate actual fixture reports. No npm publication or GitHub Release.

## 0.2.0-preview.1 — 2026-10-11

- Rename to Crelyn Website SEO Auditor; site-audit command with sitemercek compatibility alias.
- Add a local browser audit workspace, cancellation, filters, coverage, and offline HTML/JSON downloads.
- Add English (US)/Turkish selection and Crelyn Studio developer card.
- Protect the loopback API with Host/Origin/session-token checks and bounded input.
- Replace the README with English setup, privacy, usage, and actual UI screenshots.
- Correct Git ignore scope so report source code is included in clean checkouts.
- Use default web port 4187 to separate this workspace from cached apps at a reused preview origin.

## 0.1.0-preview.1 — 2026-10-11

- Initial local CLI preview: bounded same-origin HTTP crawling, robots/sitemap discovery, evidence-based SEO/link/passive health checks, EN/TR reports.
