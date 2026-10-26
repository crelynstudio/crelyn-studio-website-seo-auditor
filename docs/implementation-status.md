# Implementation status / Geliştirme durumu

**2026-10-26 · `0.5.0-beta.1` · local review candidate / yerel inceleme adayı**

The Windows Electron beta `v0.4.0-beta.1` remains the latest public release. This candidate replaces that desktop shell with a local browser UI and retains the protected crawler and CLI. It is not on GitHub yet.

Implemented: English/Turkish navigation and settings, scan progress/cancel, overview from actual scan counts, grouped findings with evidence/fixes, per-page issue bars/table, coverage and limit details, and local HTML/JSON export. The UI assets do not use the purchased UI8 icon pack.

Verified locally: typecheck and lint passed; all 32 automated tests passed; the production dependency audit reported zero vulnerabilities; the source package passed a clean install and audit/report smoke test. Headless Chromium checked desktop and 390px mobile layouts, keyboard focus, EN/TR switching, findings, settings and HTML/JSON downloads with no page errors. The downloaded HTML opened offline, and its findings were visible. Three real English screenshots were captured from the running candidate.

A Windows x64 portable preview was built with the official Node.js 24.19.0 runtime and extracted into a separate directory. Its VBS launcher started the bundled runtime with no visible browser during the automated check; the extracted copy then passed the full browser scan, reporting, language and shutdown flow. Its temporary ZIP measured **39,083,225 bytes**, compared with **123,710,752 bytes** for the published Electron installer. These are different distribution formats, but the portable preview is about 68% smaller. The preview ZIP is not a final release artifact. A human double-click in the user's desktop has not been performed, to avoid interrupting their work.

Still required before release: user design/product approval, a final package and release-content review, and a last independent check of the approved archive. No public update is authorized before approval.

Türkçe: Önceki Windows betası yayımdadır. Bu sürüm yerel web arayüzü için inceleme adayıdır; henüz GitHub'a yüklenmedi.
