# Implementation status / Geliştirme durumu

**2026-10-26 · `0.5.0-beta.2` · approved beta / onaylanan beta**

This beta replaces the Windows Electron shell with a local browser UI and retains the protected crawler and CLI. The earlier `v0.4.0-beta.1` remains available in release history.

Implemented: English/Turkish navigation and settings, scan progress/cancel, overview from actual scan counts, grouped findings with evidence/fixes, per-page issue bars/table, coverage and limit details, and local HTML/JSON export. The UI assets do not use the purchased UI8 icon pack.

Beta 2 refreshes the shared SVG app mark with a browser window and checked magnifier in the existing violet palette. About displays the running version from local server metadata. Integration checks assert agreement with the package version and confirm that the offline HTML embeds the exact same logo. A duplicated 1,250-line stylesheet block was removed while preserving the later effective rules and mobile fixes.

Verified for beta 2 on Node.js 24.19.0: `npm run typecheck`, `npm run lint`, `npm test` (32 passed), `npm run test:package` (44-file package, clean production install, CLI, diff and HTML/JSON audit), and `npm audit --json` (zero known vulnerabilities across all installed dependencies). `git diff --check` passed. Headless Chromium checked a synthetic local scan, findings, pages, settings, version display, EN/TR switching and persistence after reload, HTML/JSON downloads, offline HTML including its logo, keyboard skip link and reduced-motion mobile rendering. All six sections were checked for document overflow at 320, 390, 768 and 1440 pixels: 24 layout checks passed with no console or page errors. Three real English README screenshots were refreshed.

Browser verification script: `.verification/beta2-smoke.py` (local, ignored); captures and downloaded sample reports: `.verification/beta2/`. Re-run with the installed Python Playwright runtime and `.agents/skills/webapp-testing/scripts/with_server.py`, starting `node .verification/review-server.mjs` on port 4766 and `node examples/demo-server.mjs` on port 4765. These are development checks, not distribution files.

User approval was received. The beta 2 ZIP was built from the bundled Node.js 24.19.0 runtime, extracted to a separate directory, and passed a local scan plus HTML/JSON export there. Dark theme is not offered; real-device and human double-click launcher checks were not performed for beta 2.

Türkçe: Beta 2 logosu yenilendi, Hakkında ekranına sürüm eklendi ve 1.250 satırlık yinelenen stil bloğu kaldırıldı. Tip kontrolü, lint, 32 otomatik test, temiz paket kurulumu, bağımlılık denetimi ve 24 tarayıcı yerleşim kontrolü geçti. Yerel örnek sitede tarama, bulgular, rapor indirme, çevrimdışı HTML ve dil tercihinin hatırlanması doğrulandı. Gerçek ekran görüntüleri güncellendi. Kullanıcı yayını onayladı; son ZIP ayrı klasöre açılıp tarama ve rapor dışa aktarma yeniden doğrulandı. Koyu tema sunulmuyor; gerçek cihaz ve insan tarafından çift tıklama kontrolü yapılmadı.
