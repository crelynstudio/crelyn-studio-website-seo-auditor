# Implementation status / Uygulama durumu

**2026-10-26 · 0.4.0-beta.1 · Windows beta**

Windows Electron shell now connects the existing SafeHttp crawler to a local interface. It validates URL/options in the privileged process, keeps the renderer isolated and sandboxed, denies permissions and arbitrary navigation, supports progress/cancel, and saves HTML/JSON through a system dialog. The report groups findings by rule and severity. Theme uses the supplied light palette; EN/TR text is local.

The previous 0.3.0-preview.1 was a CLI-only source preview. The CLI remains for developers but is no longer the primary user flow. The purchased UI8 icons are excluded from the open source repository because their terms prohibit redistributing raw assets.

This file records implementation state. The installer remains unsigned. See [publishing.md](publishing.md) for release details and verification limits.

Türkçe: Windows beta arayüzü hazırlandı. Kurulum dosyası imzasızdır; kullanıcı denemesi ve geri bildirimler sürüm boyunca devam eder.
