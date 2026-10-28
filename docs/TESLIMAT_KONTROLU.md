# Teknik isterlere göre teslimat kontrolü

**Kontrol tarihi:** 27 Ekim 2026. Bu dosya, kapsamı değiştiren bir revizyon değildir. Ürünün mevcut uygulamasını ve henüz kapanmamış kabul maddelerini açıkça ayırır. Açık madde “sonraki sürüme taşındı” anlamına gelmez; teknik isterin üretim kabulü hâlâ açıktır.

## Çalıştırılarak doğrulananlar

- Üretim derlemesi ve TypeScript denetimi.
- Değiştirilmemiş Markdown örneklerinde byte eşitliği; bir blok değişince ilgisiz kaynak dilimlerini koruma.
- UTF-8 BOM, UTF-16 BOM, satır sonu ve dış değişiklik kontrolleri.
- Atomik kayıt, silinmiş hedef ve eski disk özetiyle kaydetmeyi reddetme.
- 16 türde üretilen Mermaid kaynağının ayrıştırılması ve SVG çizimi; varsayılan modellerin kaynak turu.
- Görsel metin, tablo ve formül oluşturma; diyagramı düzenleyip yeniden açma.
- Kaynak/görsel görünüm arasında ortak geri alma.
- Türkçe/İngilizce ana arayüz ve açık/koyu tema.
- Düzenli ifade aramasının ayrı çalışanda süre sınırıyla durdurulması.
- Açılır bölümün Markdown içeriğini koruma, okuma ve görsel düzenleme.
- Ham HTML etkin içeriğinin çalışmaması ve uzak görsellerin otomatik yüklenmemesi.
- Yerel klasörde dosya oluşturma/yeniden adlandırma, arama/değiştirme ve kayıtlı oturum bilgisi.
- Gerçek PDF dosyası üretimi; HTML çıktısında fontların gömülmesi ve diyagram etiketlerinin bulunması.
- ZIP dosyalarında yol kaçışı, çakışan ad, çalıştırılabilir içerik ve CRC bozulmalarını reddetme.
- Gerçek macOS `.app` paketinde dosya açma/kaydetme, ayrı süreçte diyagram çizimi ve ZIP içe aktarma.

Testlerin kapsamı sınırlıdır. Örneğin bir tablo ekleme testinin geçmesi, bütün tablo kısayollarının veya her pano kaynağının doğrulandığı anlamına gelmez. Güncel sayılar `npm test` ve `npm run test:e2e` çıktısından alınmalıdır; test sayısı kabul kriteri sayısı değildir.

## Özellik düzeyinde açık işler

| Alan | Mevcut durum | Tam kabul için kalan |
| --- | --- | --- |
| Görsel diyagramlar | 16 türde temel tuval/form, kaynak ve çizim var | Teknik isterdeki ileri seçeneklerin tümü henüz yok: bileşik durum/fork/join, sınıf namespace ve uç çoklukları, Kanban kart metadata/taşıma, Gantt hariç günler gibi ayrıntılar |
| Harici Mermaid | Tanınmayan sözdizimi kaynak modunda korunur; dönüşüm onayı var | Her dış lehçe için semantik parser ve dönüşümde özellik bazında kayıp listesi tamamlanmadı |
| Diyagram yerleşimi | Tuval konumları düzenleme oturumunda kullanılabilir | Konum yan verisinin kalıcı saklanması ve tekrar açılışta geri yüklenmesi tamamlanmadı |
| Matematik | Görsel giriş, boyut seçmeli matris/determinant, satır/sütun işlemleri, LaTeX/MathML kopyalama, SVG/PNG çıktı; çözünürlük ve saydamlık seçimi; 18 yapılık çizim envanteri var | Her LaTeX komutunu kapsayan motor eşitliği kanıtlanmadı; belge içinde kalıcı kullanıcı formül açıklamaları açık |
| Markdown profili | CommonMark/GFM, dolar ayraçlı matematik, Mermaid, dipnot/YAML ve details var | `\\(...\\)` / `\\[...\\]` için seçilebilir uyumluluk desteği tamamlanmadı |
| Tablolar | Temel görsel işlemler, taşıma, TSV ve CSV/TSV var | Her çoklu hücre/Word/Excel pano kombinasyonu, HTML birleştirilmiş tabloyu dönüştürme ve kapsamlı klavye testleri açık |
| Görseller | Kopyalama, göreli yollar, farklı kaydetmede taşıma ve güvenli SVG var | Uzak görseli açık izinle yerel indirme, eksik görsel yeniden bağlama ve kullanılmayan varlık temizleme arayüzleri açık |
| Arama | Kaynak araması, regex süre sınırı ve klasörde düz metin arama var | Görünür metin kapsamında arama, seçim içinde arama ve tüm çapraz blok arama seçenekleri açık |
| Baskı | Gerçek PDF, bağımsız HTML ve temel yatay yön var | Uygulama içi PDF önizlemesi; Letter, kenar boşluğu, başlık/altlık ve bütün sayfalama kabul örnekleri açık |
| Komutlar | Temel kısayollar ve komut menüsü var | Özelleştirilebilir kısayol paneli, `/` menüsü ve seçili metin yüzen araç çubuğu açık |
| Yazım denetimi | Electron editöründe sistem desteği etkin | Türkçe/İngilizce çevrimdışı sözlüklerin bütün platformlara paketlenmesi doğrulanmadı |
| Ayarlar | Tema, dil, font, boyut, genişlik, otomatik kayıt, oturum ve dışa aktarım var | Ayar dosyası doğrulama, önizleme ve uygulama tamamlandı; tüm saklama ayarları ve kullanıcı sözlüğü açık |
| Büyük belgeler | Açılış ve çizim boyut sınırları var | Tam artımlı parse, büyük belge modu ve dokümandaki p95 bellek/CPU/zaman hedeflerinin tamamı kanıtlanmadı |
| Erişilebilirlik | Klavye yolları, modal odak sınırı ve erişilebilir adlar var | WCAG 2.2 AA tam tarama; ekran okuyucu, yüksek DPI ve yüksek kontrast manuel kabulü açık |
| Dil | Türkçe/İngilizce ana arayüz çalışıyor | Bazı yeni alanlar, hata metinleri ve işletim sistemi menülerinde çeviri kapsamı eksik |

Bu maddeler nedeniyle mevcut pakete “teknik isterlerin tamamını karşılayan production-ready teslimat” onayı verilmemiştir. Çalışan uygulama, kaynak kodu ve testler incelemeye uygundur.

## Ortam ve yayın bağımlılıkları

- macOS ARM64 paketi bu bilgisayarda oluşturulup çalıştırıldı.
- Windows x64 Setup/Portable ve Linux x64 AppImage/DEB paketleri çapraz derlemeyle üretildi. Bu işletim sistemlerinde çalıştırılmadılar. macOS Intel paketi yerelde üretilmedi; gerçek platform testleri açık.
- Yerel ortamda geçerli kod imzalama kimliği bulunmadı. İmzalama, Apple noter onayı ve imzalı güncelleme çevrimi yayıncı kimlikleriyle yapılmalıdır.
- GitHub Actions dosyası depoda bulunur. Yerel test raporu, GitHub üzerinde başarılı bir CI çalışması yapıldığının kanıtı değildir; güncel durum Actions ekranından kontrol edilmelidir.
- Uzak yayın kanalı yapılandırılmadı. Uygulama bu durumu açıkça gösterir; sahte bir “güncelsiniz” sonucu üretmez.

## Kabul kriterlerinin izlenebilirliği

| Kriter grubu | Durum |
| --- | --- |
| AC-01–AC-06 | Temel belge akışları ve seçilmiş kaynak koruma örnekleri doğrulandı; bütün Markdown kombinasyonları için tam kanıt değil |
| AC-07–AC-10 | Tablo/görsel altyapısı uygulanmış; ayrıntılı pano ve varlık kabul örnekleri kısmen açık |
| AC-11–AC-17 | Görsel matematik ve 16 diyagramın temel akışları mevcut; yukarıdaki gelişmiş işlevler nedeniyle tam kapanmış değil |
| AC-18–AC-28 | Kodun çalıştırılmaması, geri alma, kayıt/çakışma, kurtarma, kodlama ve arama için testler var; bütün platform hata enjeksiyonları tamamlanmadı |
| AC-29–AC-31 | PDF/HTML/ZIP temel çıktıları doğrulandı; tüm baskı düzeni ve büyük varlık örnekleri açık |
| AC-32–AC-33 | Ağ/etkin içerik/IPC sınırlamaları ve bazı saldırı örnekleri doğrulandı; kapsamlı bağımsız güvenlik incelemesi yapılmadı |
| AC-34–AC-36 | macOS paket kontrolü var; diğer platformlar ve çıkarılabilir medya senaryolarının tümü açık |
| AC-37–AC-39 | Çeviri, erişilebilirlik ve performansın tam kabulü açık |
| AC-40–AC-42 | Güncelleme/paketleme/meta veri altyapısı var; imzalı yayın ve gerçek kaldırma/güncelleme çevrimi açık |
| AC-43–AC-46 | Geçmiş, modal iptali, konum ve erişilebilir komut altyapısı var; tüm birleşik sınır örnekleri tamamlanmadı |
