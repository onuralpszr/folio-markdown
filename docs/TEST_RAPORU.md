# Yerel doğrulama raporu

Tarih: 27 Ekim 2026. Ortam: macOS 26.6.2, Apple M4, ARM64, 24 GiB bellek.

| Denetim | Sonuç |
| --- | --- |
| TypeScript ve üretim derlemesi | Geçti |
| Çekirdek/dosya/arşiv testleri | 4 dosyada 55 test geçti |
| Tarayıcı ve gerçek Electron uçtan uca akışları | 17 senaryo geçti |
| Bağımlılık güvenlik taraması | Son yerel npm audit: 0 bilinen açık; `npm-audit.json` |
| macOS ARM64 | DMG ve ZIP üretildi; gerçek `.app` çalıştırıldı |
| Gerçek macOS paketi | Ayrı profilde 7 kontrol geçti: dosya açma/kayıt, diyagram, ZIP çalışanı, karşılama görünümü, çevrimdışı formül SVG ve PNG |
| Windows x64 | Setup ve Portable üretildi; Windows üzerinde çalıştırılmadı |
| Linux x64 | AppImage ve DEB üretildi; Linux üzerinde çalıştırılmadı |
| Diğer mimariler | CI hedefleri var; bu çalışmada çalıştırılmadı |
| İmzalama/noter onayı | Yerel imzalama kimliği yok; paketler yayıncı sertifikasıyla imzalı değil |

Testler kaynak koruma, dosya çakışmaları, yerel varlıklar, kötü amaçlı ZIP örnekleri, 16 diyagram çizimi, görsel düzenleme, çevrimdışı çıktı, matematik envanteri, ayar içe aktarma ve ayrı süreçlerde arama/çizim sınırlarını kapsar. Gerçek paket kontrolü `scripts/smoke-packaged.mjs` ile ayrı bir kullanıcı profilinde yapılır.

Test sayısı kabul kriteri sayısı değildir. Büyük belgelerin p95 süre/bellek hedefleri, WCAG taraması, her platformda kurulum/kaldırma/güncelleme, imzalı dağıtım ve gelişmiş düzenleyici ayrıntıları henüz tam kabulden geçmedi. Güncel açık maddeler `TESLIMAT_KONTROLU.md` içindedir. Bu rapor tam production-ready onayı vermez.
