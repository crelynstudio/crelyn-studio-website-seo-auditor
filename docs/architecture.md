# Architecture / Mimari

Browser UI (`web/`) → loopback-only Node HTTP service (`src/web/server.ts`) → existing SafeHttp crawler → analyzers → redacted in-memory report → browser views and HTML/JSON downloads. The CLI shares the same crawler and report modules.

- The HTTP service binds only to `127.0.0.1` on a random port. Static routes use an explicit file allowlist; API POSTs require the exact local Origin, and every request requires the expected Host. There is no CORS grant.
- `POST /api/scan` validates URL, language, page/depth limits and flags through `parseConfig`; only one scan runs at once. `GET /api/state` reports progress; `POST /api/cancel` aborts. `GET /api/report` and `/api/report.html` expose the redacted current report on the local interface.
- Browser code uses `textContent` to render site-controlled data. CSP blocks inline scripts and remote content. Settings are stored locally in the browser; the current report stays in server memory until the process exits.
- The crawler still enforces URL normalization, private-address blocking by default, DNS pinning, robots policy, request budgets, response size/time limits and same-origin scope. [Security model](security-model.md).

Türkçe: Tarayıcı arayüzü yalnızca yerel Node servisine bağlanır. Servis mevcut güvenli tarama motorunu kullanır; raporu maskeleyerek bellekte tutar ve HTML/JSON olarak indirir. Sunucu kapandığında geçerli rapor belleği temizlenir.
