# Contributing / Katkı

Install Node 24, run `npm ci --ignore-scripts`, then `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run test:package`. Keep changes narrow. New rules need stable IDs, EN/TR messages, evidence, severity, false-positive notes and local fixture tests. Route all network access through SafeHttp. Never disable TLS or robots, add telemetry, or use live third-party sites in tests. Discuss scope changes before implementation. Follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Repository: `crelynstudio/crelyn-studio-website-seo-auditor`.

Node 24 kurun, `npm ci` sonrasında yukarıdaki kontrolleri çalıştırın. Değişiklikleri dar tutun. Yeni kurala kararlı kimlik, EN/TR metin, kanıt, önem derecesi, yanlış alarm açıklaması ve yerel test ekleyin. Ağ erişimini SafeHttp üzerinden yapın. TLS/robots denetimini kaldırmayın; telemetri eklemeyin; testlerde canlı üçüncü taraf siteler kullanmayın. Kapsam değişikliğini önce konuşun. [Davranış kurallarına](CODE_OF_CONDUCT.md) uyun. Aynı mevcut depo kullanılır; yeni depo oluşturmayın.

Schema v2 snapshots are validated at the file boundary. Preserve stable rule IDs and bump RULES_VERSION when rule semantics change. Scope mismatches, partial coverage and skipped checks must never imply resolution. Add fixtures for new, resolved and unchanged issues, plus incomplete comparisons. Route assets through the same SafeHttp instance, and keep their candidate budget separate.

Do not expose the local scan service to the network or add a cloud backend. Keep the listener on loopback, validate request Host and Origin, and route website traffic only through SafeHttp. Static report scripts may only display/filter/translate existing data. Keep report text safe with textContent and escaped JSON. Snapshot input is capped at 20 MiB; imported reports still require privacy handling.

Şema/kural değişikliklerinde diff güvenliğini koruyun. Eksik taramayı çözülmüş saymayın. Yerel servisi ağa açmayın ve bulut sunucusu eklemeyin. Kaynak istekleri ortak güvenli istemciden geçmelidir.
