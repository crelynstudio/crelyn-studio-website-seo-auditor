# Implementation and verification status

**2026-10-11 · v0.2.0-preview.1 · Development preview**

The user authorized UI improvements, English/Turkish selection, English README, renaming, and public GitHub source publication. User hands-on acceptance of the preview remains a separate check.

## Implemented

- Local browser workspace with URL form, bounded page budget, explicit private-network exception, run/cancel, coverage, severity/search filters, evidence, and JSON/standalone HTML export.
- English (US)/Turkish interface, persisted preference, translated findings and developer card with real Crelyn Studio logo/contact/social links.
- CLI with site-audit command and sitemercek compatibility alias; en_US input accepted while schema v1 retains en/tr.
- Safe bounded same-origin crawler and technical SEO/link/passive health checks.
- Exact loopback Host/Origin and per-session token validation, bounded JSON request body, one active audit, and disconnect cancellation.
- English README, actual screenshots/fixture reports, MIT code license and separate brand-rights notice.

## Verification

Local environment: Windows, Node 24.19.0, npm 11.17.0, system Chrome controlled by Playwright. Local fixture and injected resolver tests do not crawl third-party sites.

The checks cover type/lint/build, crawler and CLI behavior, schema validation, private IP/DNS/redirect/rate/byte/timeout budgets, robots/sitemap parsing, and report escaping. Web integration checks cover Host/Origin/token rejection, input/body bounds, busy requests, blocked private targets, and successful local audits.

Local results: 21 tests passed, none failed or skipped; typecheck, lint, build, and JavaScript syntax check passed. A clean source export installed with npm ci and passed the same 21 tests/typecheck/lint. An npm tarball was unpacked into a separate directory, installed with production dependencies only, and generated HTML/JSON reports successfully. npm audit reported zero vulnerabilities at check time. The UI detector reported no findings. These results do not replace an independent security review.

Browser verification covers English/Turkish switching and persistence, three-page/six-finding scan, severity/search/empty results, keyboard evidence disclosure, logo/social links, JSON/HTML download, token-free saved HTML, offline filtering/language change, desktop/mobile layout without horizontal overflow, and zero unexpected external requests or browser errors. Screenshots show synthetic local fixture data.

Run the documented checks in README to reproduce. GitHub Actions provides the Node 22/24 matrix on Windows/Linux/macOS; inspect the actual workflow result on the repository rather than assuming configuration means success.

## Limits and remaining manual checks

- This is a preview; the user has not yet performed hands-on acceptance.
- No independent penetration test, live hostile-network test, real third-party target crawl, or physical Windows Ctrl+C test.
- Light theme only; full accessibility audits and all assistive technologies are not verified.
- No JavaScript target rendering, legacy charset conversion, authentication/session crawling, external origins, or overall SEO/security score.
- Reports may contain sensitive target data. No npm publication, stable release, or hosted deployment.
- Local ignored node_modules/dist remain for easy preview. Ignored .verification retains temporary copies after an earlier cleanup was blocked by automatic approval review; it is excluded from GitHub.

## Try it

Run npm run web, open http://127.0.0.1:4173, start node examples/demo-server.mjs in a second terminal, and audit http://127.0.0.1:4765 with the trusted local network checkbox enabled. Expect 3 pages and 2 errors/2 warnings/2 information findings. Switch languages, filter findings, and open an exported HTML offline.
