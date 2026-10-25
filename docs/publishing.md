# Beta publication / Beta yayını

**Current status: local candidate. No GitHub push or Release has been made.** Publication waits for the user's hands-on acceptance.

**Güncel durum: yerel aday. GitHub'a gönderim veya Release yayını yapılmadı.** Yayın için kullanıcının uygulamayı deneyip son ürünü onaylaması bekleniyor.

- Existing repository: `crelynstudio/crelyn-studio-website-seo-auditor`.
- Repository description: `Private Windows website audit with clear technical SEO and broken-link findings.`
- Topics: `website-audit`, `technical-seo`, `broken-links`, `windows`, `desktop-app`, `open-source`.
- Proposed tag: `v0.4.0-beta.1`; mark the GitHub Release as **pre-release**.
- Proposed title: `SiteMercek 0.4.0 beta 1 for Windows`.
- Release asset: `SiteMercek-0.4.0-beta.1-win-x64-setup.exe`, only after user acceptance and a final clean rebuild.
- No npm publication, Microsoft Store listing, automatic update or signing claim.

## Draft release notes

SiteMercek now runs as a Windows desktop app. Enter a website address to scan public pages, review grouped findings, and save local HTML or JSON reports. English and Turkish interfaces are included. The protected crawler and developer CLI remain available.

**Beta limitations:** Windows x64 only; installer currently unsigned, so Windows may show a publisher or SmartScreen warning. Static HTML only. Authentication, JavaScript rendered pages and external origins are not checked. Reports should be reviewed before sharing because secret masking is best effort. No automatic updates.

## Taslak sürüm notları

SiteMercek artık Windows masaüstünde çalışıyor. Bir site adresi girerek herkese açık sayfaları tarayabilir, benzer sorunları birlikte inceleyebilir ve HTML veya JSON raporunu cihazına kaydedebilirsin. İngilizce ve Türkçe arayüz bulunur. Korumalı tarama motoru ile geliştiricilere yönelik komut satırı aracı korunmuştur.

**Beta sınırları:** Yalnızca Windows x64. Kurulum dosyası imzasızdır; Windows yayıncı veya SmartScreen uyarısı gösterebilir. Statik HTML taranır. Oturum açma, JavaScript ile oluşan sayfalar ve dış kökenler incelenmez. Gizli veri maskelemesi her olası metni yakalayamayacağından raporu paylaşmadan önce kontrol et. Otomatik güncelleme yoktur.

## Before publishing

1. User tests the actual Windows build and approves the final product and publication text.
2. Run `npm ci`, typecheck, lint, all tests, package test, `npm run dist:win` and a clean app launch.
3. Verify install/uninstall, EN/TR, scan/cancel, reports, offline viewing and Windows signature status.
4. Check the installer SHA-256 and attach that checksum to the release notes.
5. Push the reviewed `repo/` contents to `main`; verify GitHub Actions. Create the pre-release from the tested commit and upload the installer.

## Yayından önce

1. Kullanıcı gerçek Windows derlemesini dener; son ürünü ve yayın metnini onaylar.
2. Temiz bağımlılık kurulumunu, tip kontrolünü, lint ve testleri, paket testini ve Windows derlemesini çalıştır.
3. Kurulum/kaldırma, iki dil, tarama/durdurma, rapor kaydı, raporun çevrimdışı açılması ve imza durumunu kontrol et.
4. Kurulum dosyasının SHA-256 değerini sürüm notlarına ekle.
5. İncelenen `repo/` içeriğini `main` dalına gönder; GitHub Actions sonucunu doğrula. Test edilen commit için ön sürüm oluştur ve kurulum dosyasını ekle.
