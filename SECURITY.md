# Security / Güvenlik

This is a preview without an independent security audit. Report suspected vulnerabilities privately to the project contact [info@crelynstudio.com](mailto:info@crelynstudio.com). Do not publish secrets, exploit targets or personal data in public issues. Include version, minimal local reproduction, expected/actual behavior and impact. A dedicated advisory channel and response SLA are not established yet.

Bu önizleme bağımsız güvenlik denetiminden geçmedi. Şüpheli açıkları proje iletişim adresi [info@crelynstudio.com](mailto:info@crelynstudio.com) üzerinden özel olarak bildirin. Herkese açık bildirimlerde sır, hedef veya kişisel veri paylaşmayın. Sürüm, küçük yerel tekrar örneği, beklenen/gerçek davranış ve etkiyi ekleyin. Özel güvenlik duyuru kanalı veya yanıt süresi taahhüdü henüz yoktur.

## Report privacy

Response headers use an explicit allowlist: content-type/encoding, redirect location, retry-after, CSP, HSTS, nosniff, X-Robots-Tag, X-Frame-Options and Referrer-Policy. Cookie/authentication/custom tracing headers are excluded. Common sensitive URL parameters, URL credentials, Basic/Bearer values, JWT patterns and mailto/tel targets are masked after analysis; network/cache identities remain intact during scanning.

Masking cannot identify every secret embedded in arbitrary page text, path segments or unknown formats. Inspect saved output before sharing. Masked URL identities are rejected by diff to prevent collisions. Imported snapshots are schema-validated and bounded to 20 MiB. Legacy or incompatible reports fail rather than claiming issues were resolved.

HTML reports use escaped JSON, textContent and a hashed script with connect-src none. The desktop renderer uses context isolation, a sandbox and a narrow IPC bridge; the crawler runs in the privileged process. There is no HTTP service or scan API. Telemetry, cookie persistence and auth forwarding are absent.

Türkçe: Başlık izin listesi ve analiz sonrası maskeleme uygulanır. Serbest metin/yol parçalarındaki her sır tanınamaz; paylaşmadan kontrol edin. Maskelenmiş URL kimliği diff için reddedilir. HTML raporu sunucusuzdur ve ağ isteği yapamaz.
