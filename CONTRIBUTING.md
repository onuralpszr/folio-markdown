# Geliştirme ve katkı rehberi

Folio, yerel Markdown dosyalarını koruyarak görsel düzenleme sunan bir masaüstü uygulamasıdır. Değişikliklerin kapsamı [açık kabul maddeleriyle](docs/TESLIMAT_KONTROLU.md) birlikte değerlendirilir.

## Yerel kurulum

Node.js 24 veya üzeri ve npm kullanın:

```bash
npm ci
npm run desktop
```

Arayüz önizlemesi için `npm run dev` kullanılabilir. Yerel dosya yetkileri ve işletim sistemi entegrasyonları Electron uygulamasında doğrulanmalıdır.

## Değişiklikleri doğrulama

```bash
npm test
npm run build
npx playwright install chromium
npx playwright test
```

Linux üzerinde Electron testleri için bir grafik oturumu veya `xvfb-run -a npx playwright test` gerekir. macOS paketi oluşturulduktan sonra `node scripts/smoke-packaged.mjs` gerçek uygulama paketini geçici, ayrılmış bir profilde kontrol eder.

Depo kökündeki `.mcp.json`, MCP destekleyen kod asistanlarına Playwright MCP sunucusunu tanıtır. `npm run dev` açıkken asistan `http://127.0.0.1:5173` adresindeki arayüzü yalıtılmış bir Chromium profiliyle açıp inceleyebilir.

## Beklenen davranış

- Belgenin değişmeyen kaynak dilimlerini koruyun. Kaynak/görsel geçişlerini ve ortak geri almayı değerlendirin.
- Kaydetme hatası veya dış değişiklik durumunda kullanıcının içeriğini koruyun; sessizce üzerine yazmayın.
- Belge içeriğine Node, komut çalıştırma veya sınırsız ağ erişimi vermeyin.
- Görsel editör pencerelerinde İptal belgeyi değiştirmemelidir; Uygula tek bir düzenleme işlemi üretmelidir.
- Yeni arayüz metinleri için Türkçe ve İngilizce karşılıkları ekleyin.
- Test raporlarında çalıştırılan ortamı belirtin. Paket üretmek, o platformda çalıştırma testinin yerine geçmez.

## Pull request içeriği

Çözülen sorunu, kullanıcının göreceği davranışı ve ilgili doğrulama sonuçlarını açıklayın. İsterlerde değişiklik gerekiyorsa bunu açıkça belirtin. Kişisel belgeleri, erişim anahtarlarını, kurtarma taslaklarını ve büyük derleme çıktılarını depoya eklemeyin.

## Paketleme

Platform komutları ve imzalama gereksinimleri [yayınlama rehberinde](docs/YAYINLAMA.md) açıklanır. Üçüncü taraf lisans bildirimi ve bağımlılık envanteri paketleme sırasında üretilir. İmzalama anahtarları kaynak depoda tutulmaz.
