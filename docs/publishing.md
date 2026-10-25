# Windows beta release / Windows beta sürümü

**Version:** `v0.4.0-beta.1` · **Type:** GitHub pre-release · **Platform:** Windows x64

**Sürüm bağlantısı:** [SiteMercek 0.4.0 beta 1](https://github.com/crelynstudio/crelyn-studio-website-seo-auditor/releases/tag/v0.4.0-beta.1)

- Existing repository: `crelynstudio/crelyn-studio-website-seo-auditor`.
- Repository description: `Private Windows website audit with clear technical SEO and broken-link findings.`
- Topics: `website-audit`, `technical-seo`, `broken-links`, `windows`, `desktop-app`, `open-source`.
- Tag: `v0.4.0-beta.1`; GitHub Release is marked **pre-release**.
- Title: `SiteMercek 0.4.0 beta 1 for Windows`.
- Download: `SiteMercek-0.4.0-beta.1-win-x64-setup.exe`.
- SHA-256: `FD235A0E4BCF9B96EA8F8273267DBEB9253755B1D522DFC059817EFE4E115F1F`.
- No npm publication, Microsoft Store listing, automatic update or signing claim.

## Release notes

SiteMercek now runs as a Windows desktop app. Enter a website address to scan public pages, review grouped findings, and save local HTML or JSON reports. English and Turkish interfaces are included. The protected crawler and developer CLI remain available.

**Beta limitations:** Windows x64 only; installer currently unsigned, so Windows may show a publisher or SmartScreen warning. Static HTML only. Authentication, JavaScript rendered pages and external origins are not checked. Reports should be reviewed before sharing because secret masking is best effort. No automatic updates.

## Sürüm notları

SiteMercek artık Windows masaüstünde çalışıyor. Bir site adresi girerek herkese açık sayfaları tarayabilir, benzer sorunları birlikte inceleyebilir ve HTML veya JSON raporunu cihazına kaydedebilirsin. İngilizce ve Türkçe arayüz bulunur. Korumalı tarama motoru ile geliştiricilere yönelik komut satırı aracı korunmuştur.

**Beta sınırları:** Yalnızca Windows x64. Kurulum dosyası imzasızdır; Windows yayıncı veya SmartScreen uyarısı gösterebilir. Statik HTML taranır. Oturum açma, JavaScript ile oluşan sayfalar ve dış kökenler incelenmez. Gizli veri maskelemesi her olası metni yakalayamayacağından raporu paylaşmadan önce kontrol et. Otomatik güncelleme yoktur.

## Verification and limits

Source verification includes a clean dependency install, typecheck, lint, 31 automated tests, package test, dependency audit and Windows packaging. A packaged desktop build completed a sample site scan and saved JSON. The final installer was not installed and uninstalled automatically because that would interrupt the user's desktop. The installer has no code signature. User feedback remains welcome during beta.

## Doğrulama ve sınırlar

Kaynak doğrulaması temiz bağımlılık kurulumu, tip kontrolü, lint, 31 otomatik test, paket testi, bağımlılık denetimi ve Windows paketlemesini içerir. Paketlenmiş masaüstü derlemesi örnek siteyi taradı ve JSON kaydetti. Son kurulum dosyasının kurulum/kaldırma denemesi kullanıcının masaüstünü bölmemek için otomatik yapılmadı. Kurulum dosyasında kod imzası yoktur. Beta boyunca kullanıcı geri bildirimi alınır.
