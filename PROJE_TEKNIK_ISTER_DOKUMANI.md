# Markdown Viewer — Proje Teknik İster Dokümanı

**Belge tarihi:** 26 Ekim 2026  
**Belge revizyonu:** 1.0  
**Çalışma adı:** Markdown Viewer  
**Ürün tipi:** Yerel dosyalarla çalışan masaüstü Markdown okuyucu ve görsel belge düzenleyici  
**Hedef platformlar:** Windows, macOS, Linux  
**Belgenin durumu:** Uygulama geliştirmesine esas olacak kapsam ve kabul sözleşmesi

> Bu belge bir uygulama planı veya özellik öneri listesi değildir. Teslim edilecek ürünün işlevlerini, çalışma kurallarını, teknik sınırlarını ve doğrulama koşullarını tanımlar. Aşağıdaki kapsam tek ürün teslimatına dahildir. “MVP”, “sonraki sürüm” veya “ileride eklenir” ayrımı bulunmaz. Geliştirme sırasında işlerin sıralanması kapsamı azaltmaz. Bu dosyanın hazırlanmış olması uygulamanın geliştirilmiş veya doğrulanmış olduğu anlamına gelmez.

## 1. Amaç ve temel ürün sözleşmesi

Uygulama, Markdown sözdizimi bilmeyen bir kişinin bir Markdown dosyasını açmasını, belgeyi biçimlendirilmiş olarak okumasını, içeriği doğrudan düzenlemesini ve tekrar Markdown olarak kaydetmesini sağlayacaktır.

Word benzeri kullanım; araç çubuğu, belge yüzeyi, doğrudan metin düzenleme, tablolar, formüller, diyagramlar, yazdırma ve dosya yönetimi anlamına gelir. Kalıcı dosya biçimi Markdown olacaktır. Ürünün davranışını belirleyen beş temel şart şunlardır:

1. Kullanıcı, desteklenen içeriği oluşturmak veya değiştirmek için Markdown, LaTeX veya Mermaid kodu yazmak zorunda kalmayacaktır.
2. Kullanıcı isterse dosyanın gerçek Markdown kaynağına erişebilecektir.
3. Kaydetme işlemi, içeriği sessizce silmeyecek, desteklenmeyen yapıları dönüştürmeyecek veya başka uygulamanın değişikliklerini ezmeyecektir.
4. Dosyalar uygulamaya özel kapalı bir biçime bağımlı olmayacaktır.
5. Temel kullanım, yardım içerikleri, matematik ve diyagram üretimi internet veya hesap gerektirmeyecektir.

### 1.1. Gereksinim dili

- **Zorunludur / olacaktır:** Teslimatın kabul şartıdır.
- **Varsayılan:** Kullanıcı ayar değiştirmediğinde uygulanacak davranıştır.
- **Korunan blok:** Görsel olarak düzenlenemeyen, özgün kaynağı saklanan içeriktir.
- **Görsel destek:** İçeriği görüntülemenin yanında kod yazmadan oluşturma ve değiştirmeyi de içerir.
- **Kaynak desteği:** İçeriğin kaynağını görüntüleme ve metin olarak değiştirme anlamına gelir; görsel destek yerine kullanılamaz.
- **Uyumluluk profili:** Dosyanın hangi Markdown uzantılarıyla yorumlandığını belirleyen açık kurallar kümesidir.

## 2. Kapsam ve kapsam sınırları

### 2.1. Teslimata dahil olanlar

- Üç platformda çalışan masaüstü uygulaması ve platforma uygun paketler.
- Okuma, görsel düzenleme, kaynak düzenleme ve bölünmüş görünüm.
- CommonMark ve GFM temelleri; tablolar, görev listeleri, bağlantılar, görseller, kod blokları.
- Görsel matematik editörü, LaTeX saklama ve matematik görüntüleme.
- Bölüm 13'te tanımlanan 16 diyagram türünün görsel oluşturulması ve düzenlenmesi.
- Dipnotlar, uyarı kutuları, açılır bölümler, YAML ön bilgiler, içindekiler.
- Çoklu sekme, isteğe bağlı klasör gezgini, arama/değiştirme, klavye ve komut menüsü.
- Güvenli kaydetme, otomatik taslak, isteğe bağlı otomatik kaydetme, kurtarma ve dosya çakışması yönetimi.
- PDF, HTML, Markdown ve taşınabilir ZIP çıktısı; tablo ve diyagram çıktıları.
- Türkçe ve İngilizce arayüz, erişilebilirlik, açık/koyu tema.
- Güncelleme kontrolü, kurulum kaldırma, imzalama altyapısı, otomatik testler ve yayın belgeleri.

### 2.2. Ürün kapsamı dışında olanlar

Bu bölüm ertelenmiş işler listesi değildir; ürünün tanımlı sınırıdır.

- Bulut dosya depolama, hesap sistemi, eşzamanlı ortak düzenleme ve ekip yönetimi.
- Yapay zekâ servisi, belge içeriğini sunucuya gönderme ve ücretli servis zorunluluğu.
- Word dosyası açma/kaydetme, DOCX biçimi, Excel hesaplama motoru, PowerPoint düzenleme.
- Tam LaTeX belge derleme, kullanıcı TeX paketlerini veya sistem komutlarını çalıştırma.
- Jupyter, kod çalıştırma, terminal veya belge içinden komut yürütme.
- MDX/JSX çalıştırma, özel JavaScript, eklenti mağazası ve üçüncü taraf çalıştırılabilir eklentiler.
- Her Markdown lehçesini ve Mermaid'in gelecekte ekleyeceği bütün türleri otomatik destekleme iddiası.
- Word ile aynı sayfalama motoru, değişiklik izleme ve masaüstü yayıncılık düzeyinde yerleşim.
- Şifreli dosya biçimi ve işletim sisteminin silinen dosyalarını kurtarma.

## 3. Kullanıcı ve kullanım senaryoları

| Kod | Senaryo | Beklenen sonuç |
| --- | --- | --- |
| US-01 | Teknik bilgisi olmayan kişi `.md` dosyasına çift tıklar | Dosya biçimlendirilmiş olarak açılır; kod görünmez |
| US-02 | Kullanıcı metni ve tabloyu değiştirir | Değişiklikler aynı Markdown dosyasına güvenle kaydedilir |
| US-03 | Kullanıcı kesir ve integral içeren formül oluşturur | Görsel şablonları doldurur; LaTeX yazmaz |
| US-04 | Kullanıcı süreç diyagramı oluşturur | Şekil ekler, bağlar ve etiketleri düzenler |
| US-05 | Teknik kullanıcı kaynağı değiştirir | Okuma ve görsel görünüm aynı içeriği yansıtır |
| US-06 | Belge USB bellekle başka bilgisayara taşınır | Portable uygulama ve yerel görseller birlikte çalışır |
| US-07 | Dosya başka programda değiştirilir | Çakışma fark edilir; değişiklikler sessizce ezilmez |
| US-08 | Uygulama beklenmedik biçimde kapanır | Son dayanıklı taslak sonraki açılışta kurtarılabilir |
| US-09 | Dosyada tanınmayan bir blok vardır | Blok korunur; belgenin geri kalanı düzenlenebilir |
| US-10 | Belge paylaşılacaktır | Kullanıcı PDF, bağımsız HTML veya varlıkları içeren ZIP alır |

## 4. Platform ve dağıtım gereksinimleri

### 4.1. Destek matrisi

| Platform | Destek hedefi | Mimari | Dağıtım |
| --- | --- | --- | --- |
| Windows | Windows 11; seçilen Electron sürümünün desteklediği sürümler | x64, ARM64 | Kullanıcı bazlı `Setup.exe`, portable `.exe` |
| macOS | macOS 14 ve üzeri; seçilen Electron sürümüyle doğrulanmış sürümler | Apple Silicon, Intel | İmzalı/noter onaylı DMG, ZIP içinde `.app` |
| Linux | Ubuntu 24.04 LTS ve 26.04 LTS masaüstü | x64, ARM64 | `.deb`, AppImage |

Destek, gerçek platform testlerinden geçen işletim sistemi/mimari kombinasyonları için ilan edilir. Electron sürümü belirlenirken bu matris doğrulanır. Uyum sağlanamayan bir kombinasyon sessizce çıkarılamaz; gerekçeli kapsam değişikliği gerektirir. Destek dışı eski sistemlerde çalışması garanti edilmez.

### 4.2. Kurulum davranışı

- Kurulum kullanıcı bazlı yapılabilmeli; Windows'ta normal kullanım için yönetici izni gerekmemelidir.
- Dosya ilişkilendirme `.md` ve `.markdown` için kullanıcı tercihiyle yapılmalıdır. Varsayılan uygulama seçimi işletim sistemi kurallarına bırakılır.
- Başlat menüsü, uygulama simgesi, sürüm, yayıncı ve kaldırma bilgileri doğru olmalıdır.
- Kurulum kaldırma kullanıcı belgelerini silmemelidir. Ayar ve kurtarma verilerinin kaldırılması ayrı, açık bir seçim olmalıdır.
- Mevcut sürüm üzerine kurulum ayarları korumalıdır.
- Portable sürüm kayıt defterine kalıcı dosya ilişkisi veya başlangıç girdisi yazmamalıdır.

### 4.3. Portable davranışı

- Windows portable dağıtımı kullanıcıya tek başlatılabilir `.exe` olarak sunulur; çalışma sırasında geçici açılım yapabilir. “Tek dosya” ifadesi çalışma anında hiç geçici dosya oluşmadığı anlamına gelmez.
- Windows'ta veri kökü başlatılan portable dosyanın yanındaki `data/` klasörüdür. Geçici açılım dizini veri kökü olarak kullanılmaz.
- macOS ve Linux'ta tam taşınabilir mod, uygulamanın yanındaki `portable.json` işaretçisiyle etkinleşir. Kurulum gerektirmeyen `.app` veya AppImage tek başına ayarların da taşınabilir olduğunu ifade etmez.
- Ayarlar, son dosyalar, kurtarma ve günlükler taşınabilir veri kökünde tutulur. Kullanıcı belgeleri oraya otomatik taşınmaz.
- Veri kökü yazılabilir değilse uygulama durumu açıklamalı; kullanıcıdan başka veri klasörü seçmesini veya geçici oturumu seçmesini istemelidir. Sessizce sistem profiline yazılmamalıdır.
- USB çıkarılması, disk dolması ve erişim kaybı kaydetme hatası olarak ele alınır; belge bellekte açık kalır.
- İşletim sistemi geçici dosyaları ve işletim sistemi kayıtları için “hiç iz bırakmaz” iddiası kullanılmaz.

## 5. Arayüz ve bilgi mimarisi

### 5.1. Ana pencere

Ana pencere aşağıdaki alanlardan oluşacaktır:

1. **Başlık alanı:** Uygulama adı, aktif dosya adı, değiştirilmiş işareti ve pencere kontrolleri.
2. **Menü:** Dosya, Düzenle, Görünüm, Ekle, Biçim, Tablo, Araçlar, Yardım.
3. **Sekme çubuğu:** Açık belgeler, kapanış düğmesi, kaydedilmemiş durum ve yeni belge düğmesi.
4. **Araç çubuğu:** Paragraf/başlık, metin biçimleri, listeler, bağlantı, görsel, tablo, matematik, diyagram.
5. **Sol panel:** İçindekiler, dosyalar ve arama sonuçları arasında geçiş.
6. **Belge alanı:** Aktif görünüm, sayfa genişliği, içerik ve kaydırma.
7. **Durum çubuğu:** Kaydetme durumu, kelime/karakter, kaynak konumu, kodlama, satır sonu ve yakınlaştırma.

- Başlangıç pencere boyutu yaklaşık 1280 × 800; desteklenen minimum 900 × 600 olacaktır.
- Dar pencerede araçlar taşma menüsüne geçer. Belge yatay taşma üretmez; geniş tablolar/kod blokları kendi içinde kaydırılır.
- 200% sistem ölçeklendirmesinde düğmeler ve pencereler kullanılabilir kalmalıdır.
- Pencere konumu ve boyutu hatırlanır; ekran kaldırıldıysa pencere görünür ekran içine taşınır.
- Belgede sonsuz beyaz sayfa değil, okunabilir genişlikte sürekli belge yüzeyi bulunur. Sayfa sınırları baskı önizlemesine aittir.

### 5.2. Başlangıç ekranı

- Yeni belge, dosya aç ve klasör aç eylemleri.
- Son açılan en fazla 20 dosya; sabitleme ve listeden kaldırma.
- Kurtarılabilir belgeler varsa belirgin kurtarma alanı.
- Yerel örnek belge ve çevrimdışı kısa kullanım rehberi.
- Eksik dosyalarda “Bul” ve “Listeden kaldır” seçenekleri; boş dosya yaratılmaz.
- Yakın geçmiş listesi tümüyle temizlenebilir; yalnızca meta veri silinir.

### 5.3. Komut erişimi

- Tüm temel işlemler menülerden erişilebilir olmalıdır; kullanıcı `/` komutunu bilmek zorunda değildir.
- İsteğe bağlı `/` menüsü paragraf başında açılır; yazıyla filtrelenir. Kod bloğunda otomatik açılmaz.
- Komut paleti Windows/Linux'ta `Ctrl+Shift+P`, macOS'ta `Cmd+Shift+P` ile açılır.
- Seçili metnin yanında hafif biçimlendirme menüsü bulunur; klavye erişimi korunur.
- Simgelerin erişilebilir adı ve araç ipucu olur. Kaydetme yalnız renk veya simgeyle anlatılmaz.

## 6. Görünüm ve düzenleme modeli

### 6.1. Okuma görünümü

- Dosya varsayılan olarak biçimlendirilmiş okuma görünümünde açılır. “Son kullanılan görünümü hatırla” ayarı bu davranışı değiştirebilir.
- Metin seçilebilir, kopyalanabilir, aranabilir; bağlantılar ve içindekiler çalışır.
- Görev kutuları, tablolar ve diyagramlar okuma görünümünde belgeyi değiştirmez. Düzenleme için “Düzenle” eylemi kullanılır.
- Kod bloklarında kopyala, diyagramlarda büyüt ve formüllerde kopyala işlemleri bulunur.
- Salt okunur dosyalar okunabilir; düzenlemeye geçilirse kayıt için farklı dosya gerekeceği açıkça belirtilir.

### 6.2. Görsel düzenleme

- Kullanıcı belgeye doğrudan yazabilir; başlık ve biçimler araç çubuğuyla uygulanır.
- Biçimler seçili metne, seçim yoksa sonraki yazıya uygulanır.
- Enter paragraf oluşturur; Shift+Enter desteklenen bağlamlarda satır kırar.
- Liste ve alıntılarda Enter/Backspace davranışı yaygın kelime işlemci alışkanlıklarına uyar; boş öğede Enter bloktan çıkarır.
- Yazılan `# `, `- `, `1. ` gibi kısayollar isteğe bağlı otomatik biçimlenir. Geri al işlemi dönüşümü geri çevirebilir.
- Formül ve diyagram birer düzenlenebilir belge nesnesidir. Çift tıklama veya klavyeyle “Düzenle” ilgili editörü açar.
- Nesneler klavyeyle seçilebilir, kopyalanabilir, taşınabilir ve silinebilir.
- Düzenlenebilir içerikte görünüm değiştirmek seçim, kaydırma ve geri alma geçmişini korur.

### 6.3. Kaynak görünümü

- Gerçek Markdown kaynağı gösterilir; ayrı ve tutarsız ikinci belge oluşturulmaz.
- Sözdizimi renklendirme, satır numarası, satıra git, girintileme, satır kaydırma ve eşleşen parantez desteği bulunur.
- Kaynakta matematik ve Mermaid için hata konumu ve ilgili görsel editöre geçiş eylemi bulunur.
- Geçici geçersiz içerik yazılabilir ve kaynak olarak kaydedilebilir. Görsel yorumlama hataları dosya kaydetmeyi gereksiz yere engellemez.
- Görsel moda geçişte dönüştürülemeyen alanlar korunan blok olur; kaynak silinmez veya önceki geçerli sürümle değiştirilmez.

### 6.4. Bölünmüş görünüm ve odak modu

- Kaynak ve önizleme yan yana; dar ekranda üst üste gösterilir.
- Önizleme düzenleme bitiminden en geç 300 ms sonra güncellenir; pahalı diyagram işleri bu sürenin dışında yükleniyor durumuyla gösterilir.
- Eşzamanlı kaydırma kaynak konumu/blok eşlemesiyle yapılır, yüzde bazlı yaklaşık eşleme temel yöntem değildir.
- Odak modu yan panelleri ve araçları gizler; çıkış eylemi her zaman erişilebilir kalır.
- Uygulama genelinde 50–200% yakınlaştırma ve 100%'e dönme bulunur.

## 7. Markdown uyumluluk sözleşmesi

### 7.1. Profil

Varsayılan profilin adı **Genişletilmiş Markdown** olacaktır. Şu bileşenleri kapsar:

- CommonMark temel blok ve satır içi yapıları.
- GFM tabloları, görev listeleri, üstü çizili metin ve otomatik bağlantılar.
- `$...$` metin içi ve `$$...$$` blok matematik.
- `mermaid` dil etiketli çitli kod bloklarında diyagramlar.
- `[^kimlik]` dipnot referansları ve tanımları.
- GitHub biçimli NOTE, TIP, IMPORTANT, WARNING, CAUTION uyarıları.
- Güvenli alt kümede `<details>` / `<summary>` açılır bölümleri.
- Belgenin başında YAML front matter.

“GFM uyumlu” ifadesi matematik, dipnot veya diyagramların GFM standardının parçası olduğu anlamında kullanılmaz. Bu uzantılar dosya uyumluluk ekranında ayrı gösterilir.

### 7.2. Metin biçimleri ve bloklar

| Kimlik | İçerik | Görsel davranış ve dosya kuralı |
| --- | --- | --- |
| MD-01 | Paragraflar | Boş satırlar, sert/yumuşak kırılmalar korunur; yeni paragraf standart Markdown olarak yazılır |
| MD-02 | H1–H6 | Menüden seçilir; yeni başlıklar ATX biçiminde yazılır; mevcut setext başlıklar değiştirilmedikçe korunur |
| MD-03 | Kalın/italik | Ayrı veya birlikte uygulanabilir; araç çubuğu seçim durumunu gösterir |
| MD-04 | Üstü çizili | GFM çift tilde ile saklanır |
| MD-05 | Satır içi kod | Markdown özel karakterleri metin olarak kalır; gerekli uzunlukta ters tırnak kullanılır |
| MD-06 | Alıntı | İç içe paragraf ve liste destekler; seviye artır/azalt işlemi bulunur |
| MD-07 | Madde/sayı listesi | İç içe öğe, çok paragraflı öğe ve başlangıç numarası destekler |
| MD-08 | Görev listesi | Kutular görsel düzenlemede tıklanır; işaret ve metin birlikte taşınır |
| MD-09 | Yatay ayırıcı | Ekle menüsünden yerleştirilir; YAML ile karışmayacak bağlamda yazılır |
| MD-10 | Kaçış/özel karakter | Literal işaretler yanlışlıkla biçimlendirmeye dönüşmez |
| MD-11 | Bağlantı referansları | Mevcut referans biçimi korunur; ortak tanım değişikliği etkilenen bağlantıları bildirir |
| MD-12 | HTML yorumları | Kaynakta korunur; okuma ve çıktıda görünmez; editörde isteğe bağlı işaretlenir |

Altı çizili yazı, keyfi metin rengi, yazı tipi ve yazı boyutu belge biçimi olarak sunulmaz. Bunlar standart Markdown ile taşınamaz. Belge temasındaki font/boyut ayarı içeriği değiştirmez.

### 7.3. İçindekiler ve başlık bağlantıları

- Yan panelde belge yapısından otomatik içindekiler üretilir; dosyaya eklenmez.
- Başlıkta görünür metin, düzey ve hedef bulunur. Tekrarlanan başlıklara sıralı son ek atanır.
- Başlık hedefi algoritması belgelenir ve sabit testlerle doğrulanır; farklı araçlarla birebir aynı sonuç garanti edilmez.
- Kullanıcı “İçindekiler ekle” seçerse normal Markdown bağlantı listesi üretilir; güncelleme açık bir işlemdir.
- Başlık değişince uygulama tarafından üretilmiş içindekiler için güncelleme uyarısı gösterilir; serbest yazılmış bağlantılar kendiliğinden değiştirilmez.

## 8. Tablolar

### 8.1. Oluşturma ve temel düzenleme

- Ekle menüsünde ızgara seçimi ve satır/sütun sayısı girişi bulunur; varsayılan 3 sütun × 3 gövde satırıdır. Başlık satırı ayrıca oluşturulur.
- Yeni tabloda en az bir sütun ve bir başlık satırı bulunur. Son gövde satırı silinebilir; son sütun silinirse tablo silme onayı gösterilir.
- Hücreye tıklanarak yazılır. Kalın, italik, üstü çizili, kod, bağlantı ve metin içi matematik uygulanabilir.
- Hücrede blok liste, iç içe tablo, blok formül veya blok diyagram oluşturulmaz.
- Tab/Shift+Tab hücreler arasında ilerler; son hücrede Tab yeni gövde satırı açar.
- Enter hücre düzenlemesini tamamlar; Shift+Enter desteklenen HTML satır kırımı olarak kaydedilir ve uyumluluk göstergesine yansır.
- Bağlam menüsünde önce/sonra satır veya sütun ekle, sil, temizle ve hizalama bulunur.
- Satırlar ve sütunlar tutamaçla veya klavyeyle yeniden sıralanabilir. Başlık satırı gövde içine sürüklenmez.

### 8.2. Çoklu işlem ve veri aktarımı

- Dikdörtgen hücre seçimi, kopyala, kes, yapıştır ve temizle desteklenir.
- Panodan TSV veya güvenli HTML tablo yapıştırılabilir. Hedef yetersizse tablo genişletme açıkça uygulanır; mevcut veri sessizce ezilmez.
- CSV/TSV dosyasını tablo olarak içe alma bulunur. Ayraç, kodlama, başlık satırı ve önizleme gösterilir.
- Seçili tablo CSV veya TSV olarak dışa aktarılabilir; CSV formül enjeksiyonuna karşı elektronik tablo güvenli çıktı seçeneği varsayılan açık olur ve yapılan dönüşüm belirtilir.
- CSV alıntılama, çift tırnak, satır sonu ve Türkçe karakterler standart kurallarla ele alınır.
- Hücredeki `|` ve ters eğik çizgiler doğru kaçışlanır; satır sonları tablonun yapısını bozmaz.

### 8.3. Standart sınırlar

- GFM tablolarında hücre birleştirme, rowspan/colspan, kalıcı hücre rengi ve kalıcı sütun piksel genişliği oluşturulmaz. Arayüz bu komutları sunmaz.
- Sütun genişliği okuma kolaylığı için oturum ayarı olabilir; Markdown'a gizlice HTML tablo yazılmaz.
- HTML'den gelen birleştirilmiş tablo korunan HTML blok olarak açılır. “GFM tablosuna dönüştür” işlemi kaybolacak özelliklerin önizlemesiyle ve açık onayla yapılır.
- Tablo hesaplama yapmaz; hücreler metindir. `=SUM(...)` çalıştırılmaz.
- Hedef destek sınırı tek tabloda 5.000 hücre ve 100 sütundur. Daha büyük mevcut tablo korunur; performans nedeniyle kaynakta düzenleme önerilebilir. Bu sınır dosyayı açmayı veya kaydetmeyi engellemez.

## 9. Bağlantılar ve görseller

### 9.1. Bağlantılar

- Bağlantı penceresinde görünen metin, hedef ve isteğe bağlı başlık bulunur.
- Web, e-posta, belge içi başlık ve göreli yerel dosya bağlantısı desteklenir.
- Düzenleme görünümünde normal tıklama seçim/düzenleme; Ctrl/Cmd+tıklama bağlantıyı açma davranışıdır.
- `http`, `https` ve `mailto` izinli açma türleridir. Yerel dosya hedefi çözümlenmiş yoluyla gösterilip kullanıcı eylemiyle açılır.
- `javascript:`, `vbscript:`, rastgele özel protokol ve çalıştırılabilir dosya başlatma engellenir. Belge bir komut taşıyıcısı olamaz.
- Harici web bağlantıları sistem tarayıcısında açılır. Uygulama içinde ayrıcalıklı uzak sayfa yüklenmez.
- Göreli bağlantı belgenin klasörüne göre çözülür; dosya kaydedilmemişse kullanıcı önce hedef klasörü seçer.

### 9.2. Görsel ekleme ve saklama

- PNG, JPEG, WebP, GIF ve güvenli SVG desteklenir. GIF hareketini durdurma ve azaltılmış hareket tercihi bulunur.
- Sürükle-bırak, panodan yapıştırma ve dosya seçme aynı varlık sürecinden geçer.
- Kullanıcı yerel görseli ilişkilendirmeyi veya belgeye ait klasöre kopyalamayı seçebilir; varsayılan kopyalamadır.
- Varlık klasörü varsayılan olarak `<belge-adı>.assets/` olur. Dosya adları güvenli, benzersiz ve platformlar arası taşınabilir üretilir.
- Pano görseli PNG olarak yazılır. Özgün dosyadan kopyalanan görsel onaysız yeniden sıkıştırılmaz.
- Kaydedilmemiş belgenin görselleri geçici belge alanına yazılır; ilk kaydetmede hedef varlık klasörüne alınır.
- Görsel ayarlarında alternatif metin ve Markdown başlık alanı vardır. Ayrı altyazı standart paragraf olarak eklenebilir.
- Görsel boyutu belge sütununa uyarlanır. Kullanıcı ölçeği görüntü ayarıdır; standart Markdown'a taşınmayan piksel boyutu vaat edilmez.
- Eksik görselde yer tutucu, kaynak yolu ve “Dosyayı bul” eylemi gösterilir. Kaynak bağlantı silinmez.
- Silinen görsel bloğunun fiziksel dosyası otomatik silinmez. Kullanılmayan varlık temizliği liste/önizleme ve açık onay gerektirir.
- Uzak görseller varsayılan yüklenmez. Belge/oturum için izin veya “Yerel kopya indir” kullanıcı eylemi gerekir. İndirme boyut ve tür denetimine tabidir.
- SVG içindeki betik, olay işleyici, dış kaynak ve etkin içerik çalıştırılmaz.

### 9.3. Farklı kaydetme

Farklı klasöre kaydetmede kullanıcı “Bağımlılıkları kopyala” veya “Mevcut dosyalara bağlantıyı koru” seçer. Varsayılan kopyalamadır. Göreli bağlantılar yeni dosya konumuna göre yeniden hesaplanır. Harici veya kök dışı hedefler önizlemede görünür. Kaynak belge ve kaynak varlıklar silinmez.

## 10. Kod blokları

- Çitli kod bloğu oluşturma, dil seçme, otomatik dil tahmini önerisi ve kod kopyalama bulunur.
- En az JavaScript, TypeScript, HTML, CSS, JSON, YAML, Python, SQL, Bash, PowerShell, Java, C#, C/C++, Rust, Go, XML ve düz metin renklendirilir.
- Bilinmeyen dil etiketi korunur; düz metin gösterilir.
- Kod içindeki Markdown yorumlanmaz; kod çalıştırılmaz.
- Kodun içerdiği ters tırnaklara göre güvenli çit uzunluğu seçilir; dil ve içerik kayıpsız saklanır.
- Satır numarası ve satır kaydırma görüntü ayarıdır. Bunlar kaynak koduna yazılmaz.
- Kaynak düzenleyici ile belge içindeki kod alanının kısayolları çakışmamalıdır. Tab kod alanında girinti; Esc sonrası normal odak dolaşımıdır.
- Mermaid ve matematik bloklarına ait editör eylemleri bulunur; bu bloklar yanlışlıkla normal koda dönüştürülmez.

## 11. Matematik ve LaTeX

### 11.1. Genel davranış

- Metin içi ve ayrı satırda matematik desteklenir; dosyada sırasıyla `$...$` ve `$$...$$` kullanılır.
- Gelen `\(...\)` ve `\[...\]` biçimleri matematik uyumluluk seçeneğiyle tanınır; değiştirilmedikçe özgün ayraçları korunur.
- Sayıların yanındaki para birimi işaretleri otomatik formüle dönüşmez. Ayraç kuralları kaynak yardımında örneklerle açıklanır.
- Kod blokları, satır içi kod, HTML öznitelikleri ve kaçışlanmış dolar işaretlerinde matematik ayrıştırılmaz.
- Görsel formül seçildiğinde düzenle, satır içi/blok değiştir, LaTeX kopyala, MathML kopyala ve görsel olarak dışa aktar işlemleri bulunur.
- Formül penceresi geçici bir çalışma alanıdır; Uygula belgeye tek işlem yazar, İptal hiçbir değişiklik yapmaz.

### 11.2. Görsel formül editörü

Editör MathLive tabanlı matematik giriş alanı ve sembol/şablon paleti kullanacaktır. Sadece LaTeX metin kutusu ve önizleme sunmak bu gereksinimi karşılamaz.

| Grup | Zorunlu yapılar ve davranış |
| --- | --- |
| Temel | Sayılar, değişkenler, dört işlem, eşitlik/eşitsizlik, parantez |
| Yapısal | Kesir, iç içe kesir, kök, n'inci kök, üs, alt indis, birlikte alt/üst indis |
| Analiz | Toplam, çarpım, limit, integral, çoklu integral, türev şablonları |
| Matris | Satır/sütun seçimi, elemanlar arasında Tab, satır/sütun ekle/sil; determinant |
| Parçalı | Koşullu/parçalı fonksiyon satırları ve koşul alanları |
| Semboller | Yunan harfleri, kümeler, mantık, oklar, ilişkiler, sonsuzluk |
| Düzen | Hizalı denklem satırları, normal metin, vurgu/aksan, vektör |

- Kullanıcı şablon seçer ve yer tutucuları doldurur; yön tuşları ve Tab ile alanlar arasında ilerler.
- Mevcut formül tekrar açıldığında yapısal alanlar düzenlenebilir kalır.
- Gelişmiş kullanıcı için LaTeX sekmesi bulunur; görsel görünüm ile aynı formül modelini kullanır.
- Görsel editör ve belge görüntüleyici ortak destek alt kümesinde aynı anlamı ve yapıyı göstermelidir.
- Desteklenmeyen komut kırmızı hata kartıyla gösterilir; özgün formül korunur. Uygulama yanlış bir formülü sessizce doğruymuş gibi çizmez.
- Boş formül oluşturulmaz; mevcut formülü boşaltıp uygulamak silme işlemi olarak açıkça belirtilir.
- Formül motoru hesap makinesi veya sembolik ispat motoru değildir; matematiksel doğruluk kontrolü iddia edilmez.

### 11.3. Motor ve güvenlik

- Belge içi çizim KaTeX ile; görsel giriş MathLive ile yapılır. Her iki kütüphanenin kesişimindeki desteklenen komutlar test envanterine alınır.
- Kullanıcı makroları belge kapsamında sınırlı genişletmeyle desteklenebilir; dosya sistemi, ağ veya komut çalıştırma yetkisi verilmez. Arayüzden sunulan kapsam yalnız güvenli metinsel makrolardır.
- KaTeX güven ayarı kapalı tutulur; dış bağlantı/HTML üreten tehlikeli komutlar izinli değildir.
- Kaynak uzunluğu en fazla 32 KiB olan formüller tam etkileşimli destek kapsamındadır. Daha büyük formüller korunur, çizim isteğe bağlı yapılır.
- Döngüsel makro, aşırı genişleme ve ayrıştırma hatası arayüzü kilitlememelidir.
- SVG/PNG formül çıktısı çevrimdışı, en az 1×/2× çözünürlük seçimi ve saydam arka plan seçeneğiyle alınır.
- Formül çıktısı belge içi erişilebilir açıklamayı desteklemelidir; kullanıcı açıklama ekleyebilir.

## 12. Diyagram altyapısı ve ortak çalışma kuralları

### 12.1. Zorunlu çalışma modeli

- Diyagramlar dosyada `mermaid` çitli kod bloğu olarak saklanır; resme çevrilip kaynakları kaybedilmez.
- “Ekle → Diyagram” tür seçicisi, başlangıç şablonu ve boş diyagram seçenekleri sunar.
- Her türün kendi görsel düzenleme arayüzü olur. Bir Mermaid kod kutusu göstermek görsel editör gereksinimini karşılamaz.
- Grafik türlerinde tuval; veri/zaman türlerinde form, liste ve tablo tabanlı düzenleme kullanılabilir. Kullanıcı kod yazmadan aynı sonucu üretmelidir.
- Editörde araç paneli, çalışma alanı, özellikler ve canlı önizleme bulunur. Küçük ekranda özellikler çekmeceye alınır.
- Uygula bütün değişikliği tek belge işlemi olarak kaydeder. İptal kaynak, düzen ve önizlemeyi eski halinde bırakır.
- Tuvalde yakınlaştır, sığdır, çoklu seç, çoğalt, sil, geri al/ileri al ve otomatik düzenle bulunur.
- Her tuval işleminin klavye veya liste/form karşılığı vardır. Sadece sürüklemeyle tamamlanan zorunlu işlem olamaz.
- Düğüm kimlikleri uygulama tarafından üretilir; kullanıcı görünen etiketi düzenler. Kimlik ile etiket karıştırılmaz.
- Türkçe karakterler, tırnaklar ve Mermaid anahtar sözcükleri güvenli biçimde kaçışlanır.
- Kenar silme, düğüm silme ve bağlı öğeleri etkileyen işlemler açık kapsamla gösterilir; geri alınabilir.
- Diyagram editöründe SVG/PNG dışa aktarma, Mermaid kopyalama, açıklama ve başlık alanları bulunur.

### 12.2. Yerleşim ve taşınabilirlik

- Mermaid çoğu türde yerleşimi kendi hesaplar. Dosyanın başka uygulamada aynı piksel koordinatlarıyla çizileceği garanti edilmez.
- Tuvalde yapılan konum düzeni uygulama yan verisinde tutulabilir; düğümler ve bağlantılar standart Mermaid kaynağında bulunur.
- Yan veri yoksa diyagram otomatik yerleşimle tamamen çalışmalıdır. Yan veri içeriği yeniden kurmak için zorunlu olamaz.
- Tema seçimleri uygulama görünüm ayarıdır; kullanıcı açıkça “Diyagram temasını dosyaya yaz” demedikçe Mermaid içine tema yönergesi eklenmez.
- Karanlık temada metin ve çizgiler okunur kalır. Baskı ve açık tema çıktısı ayrı doğrulanır.

### 12.3. İçe alınan Mermaid ve kaynak koruma

- Desteklenen türlerde uygulamanın ürettiği bütün kaynaklar tekrar görsel olarak düzenlenebilmelidir.
- Harici kaynaklar sürüme sabitlenmiş parser ile tanınır. Desteklenen semantik yapı ve öznitelikler görsel modele aktarılır.
- Yorumlar, boşluklar ve değiştirilmeyen yönergeler özgün konumlarıyla korunur. Yapısal dönüşüm yorum yerini değiştirecekse önizleme gösterilir.
- Tür desteklense bile editörde modellenemeyen karmaşık yapı bulunduğunda tüm blok kendiliğinden yeniden üretilmez.
- Böyle bir blok için güvenli görüntüleme, kaynağı düzenleme ve “Görsel modele dönüştür” bulunur. Son seçenek kaldırılacak öznitelikleri tek tek gösterir; kullanıcı onayı olmadan uygulanmaz.
- Bu istisna, bu dokümanda zorunlu olarak tanımlanmış görsel özellikleri eksik bırakmak için kullanılamaz.
- Bilinmeyen tür veya söz dizimi hatası belgeyi açmayı/kaydetmeyi engellemez; blok korunur ve hata ilgili yerde gösterilir.

### 12.4. Güvenli çizim

- Mermaid güvenli yapılandırma ile, ayrıcalıksız ve ağ erişimi olmayan çizim ortamında çalışır.
- Diyagram içinden JavaScript, tıklama callback'i, uzak görsel, keyfi HTML veya dosya erişimi çalıştırılmaz.
- Üretilen SVG temizlenir; aktif içerik ve dış referanslar kaldırılır.
- Tek çizim görevi en fazla 5 saniye çalışır; süre aşımında görev iptal edilir ve kaynak korunur.
- Kullanıcıya yeniden dene ve kaynak görüntüle sunulur; sonsuz yeniden deneme olmaz.
- Tam etkileşimli hedef tek diyagramda 500 düğüm/1.000 bağlantı veya veri tabanlı türlerde 2.000 kayıt; kaynak boyutu 256 KiB'dir. Üzeri içerik silinmeden kaynak/isteğe bağlı çizim moduna alınır.

## 13. Diyagram türlerinin ayrıntılı isterleri

Aşağıdaki 16 türün tamamı teslimata dahildir. Mermaid sürümü ve üreteçleri bu türleri destekleyen tek bir doğrulanmış sürüme sabitlenir. Yeni Mermaid sürümleri kapsamı kendiliğinden değiştirmez.

### DG-01 — Akış diyagramı / Flowchart

- Başlangıç/bitiş, işlem, karar, veri, alt süreç, veritabanı ve açıklama şekilleri.
- Yukarıdan aşağı, aşağıdan yukarı, soldan sağa, sağdan sola akış yönü.
- Bağlantı oluşturma, ok tipi, düz/kesikli/kalın çizgi, bağlantı etiketi ve bağlantı yönü.
- Alt gruplar oluşturma, adlandırma, içine öğe taşıma ve grup bağlantıları.
- Evet/hayır dalları, döngüler ve birden fazla giriş/çıkış.
- Etiketler biçimlendirmeden önce güvenli metin olarak işlenir. Şekil değişikliği bağlantıları kaybetmez.
- Çıktı `flowchart` bildirimi kullanır; eski `graph` kaynakları içe alınabilir.

### DG-02 — Sıralama diyagramı / Sequence

- Katılımcı/aktör ekle, adlandır, sırala ve sil.
- Gönderen/alıcı seçerek mesaj ekle; senkron, asenkron ve dönüş mesajı seçimi.
- Mesaj sırasını liste veya çizim üzerinden değiştir.
- Aktivasyon, not, kendi kendine mesaj ve otomatik numaralandırma.
- `alt/else`, `opt`, `loop`, `par`, `break`, `critical` çerçeveleri; iç içe kapsam görsel ağaçla düzenlenir.
- Katılımcı silme, ona bağlı mesajların sayısını gösterir; işlem geri alınabilir.
- Çıktı `sequenceDiagram` olur; mesaj kronolojisi açık sıra modelinden üretilir.

### DG-03 — Sınıf diyagramı / Class

- Sınıf, açıklama/stereotip, alan ve metot oluşturma.
- Alan/metot için ad, tür, görünürlük, parametreler ve dönüş türü form alanları.
- Kalıtım, gerçekleştirme, association, dependency, aggregation ve composition bağlantıları.
- İlişki etiketi, uç etiketleri ve çokluk değerleri.
- Namespace/gruplama, yön ve sınıf açıklamaları.
- Çıktı `classDiagram`; serbest sınıf gövdesi yerine düzenlenebilir üyeler modeli tutulur.

### DG-04 — Varlık ilişki diyagramı / ER

- Varlık ve alan ekle; alan adı/türü, PK/FK/UK işaretleri ve açıklama düzenle.
- İki varlık arasında ilişki oluştur; bire bir, bire çok, çoğa çok ve opsiyonellik seç.
- Tanımlayıcı/tanımlayıcı olmayan ilişki ve ilişki adı.
- Alan ve varlık sıralama; bağlı varlık silmede ilişki uyarısı.
- Çıktı `erDiagram`. Veri tabanı bağlantısı veya gerçek şema değişikliği yapılmaz.

### DG-05 — Durum diyagramı / State

- Başlangıç, bitiş, normal ve bileşik durumlar.
- Durumlar arası geçiş; olay/koşul/eylem etiketleri metin alanlarıyla düzenlenir.
- İç içe durum, choice, fork/join ve notlar.
- Bileşik durum içindeki öğeler ağaç ve tuvalden yönetilir; grup taşımada kapsam korunur.
- Geçersiz başlangıç/bitiş bağlantıları kaynak üretiminden önce gösterilir.
- Çıktı `stateDiagram-v2`.

### DG-06 — Gantt

- Proje başlığı, bölüm, görev, kilometre taşı ve bağımlılık.
- Görev formunda ad, kimlik, başlangıç tarihi, bitiş veya süre; tamamlandı/aktif/kritik işaretleri.
- Takvim seçici ve gün bazında zaman çizgisi; başlangıç/bitiş tutamaçları form ile eşdeğer çalışır.
- Önceki göreve bağlı başlama; döngüsel bağımlılık ve bitişin başlangıçtan önce olması engellenir.
- Hafta sonu/tarih hariç tutma ve tarih formatı ayarları.
- Tarihler zaman dilimsiz takvim tarihidir; platform değişince bir gün kaymaz.
- Çıktı `gantt`; kritik işaret otomatik kritik yol hesabı yapıldığı anlamına gelmez.

### DG-07 — Zaman çizelgesi / Timeline

- Başlık, dönem, bölüm ve dönem altındaki birden fazla olay.
- Liste veya kart görünümünde dönem/olay ekleme ve sıralama.
- Dönem etiketi serbest metindir; tarihe zorla çevrilmez.
- Çıktı `timeline`; olayların sırası kullanıcının açık sırasını korur.

### DG-08 — Zihin haritası / Mindmap

- Tek kök; alt öğe, kardeş öğe, yeniden adlandırma ve dal taşıma.
- Klavyeyle Tab alt öğe, Enter kardeş; bağlama göre açık araç ipuçları.
- Desteklenen temel düğüm şekilleri; dal katlama yalnız görüntü ayarı.
- Kökün başka dal altına taşınması ve ağaç döngüsü engellenir.
- Çıktı `mindmap`; girinti kullanıcıya yazdırılmaz, modelden üretilir.

### DG-09 — Pasta grafik / Pie

- Başlık, etiket ve sayısal değer tablosu; ekle/sil/sırala.
- Ondalık ve Türkçe sayı girişi arayüz diline göre ayrıştırılır; kaynakta standart sayısal biçime çevrilir.
- Negatif, NaN ve sonsuz değer reddedilir; sıfır toplam durumunda açıklayıcı boş görünüm.
- Değer/yüzde gösterimi ve lejant; kaynak yalnız desteklenen Mermaid seçeneklerini taşır.
- Çıktı `pie`; grafik altındaki veri tablosu erişilebilir kalır.

### DG-10 — Kullanıcı yolculuğu / Journey

- Başlık, aşamalar, görevler, katılımcılar ve 1–5 memnuniyet puanı.
- Katılımcı çoklu seçimi, aşama/görev sıralama ve puan açıklaması.
- Puan için yalnız sürgü değil sayısal/klavye girişi de bulunur.
- Çıktı `journey`.

### DG-11 — Git grafiği / GitGraph

- Başlangıç dalı, dal oluşturma, checkout, commit, merge ve cherry-pick işlemlerini sıralı araçlarla ekle.
- Commit kimliği, mesaj/etiket ve desteklenen commit tipi alanları.
- Mevcut olmayan dala checkout, aynı isimli dal, imkânsız merge ve olmayan commit'ten cherry-pick engellenir.
- İşlem silindiğinde ona bağımlı sonraki işlemler listelenir; sessizce geçersiz kaynak üretilmez.
- Çıktı `gitGraph`; gerçek Git deposunda işlem yapılmaz.

### DG-12 — Dört bölge grafiği / Quadrant

- Başlık, X/Y ekseni uç etiketleri ve dört bölgenin adı.
- Etiketli nokta ekleme; tuvalde taşıma veya 0–1 koordinatlarını formda girme.
- Nokta listesi, seçme, çoğaltma ve silme.
- Sınır dışı koordinatlar işaretlenir; otomatik ve sessiz kırpma yapılmaz.
- Çıktı `quadrantChart`.

### DG-13 — XY grafik

- Başlık, kategori veya sayısal X ekseni, Y ekseni etiketi ve aralığı.
- Çizgi ve sütun serileri; veri tablosuyla seri ekle/sil ve değer düzenle.
- Seri uzunluğu/etiket sayısı uyumu ve geçerli eksen aralığı denetlenir.
- Mermaid sürümünün desteklemediği çoklu eksen veya grafik özelliği arayüzde sunulmaz.
- Çıktı sabitlenen Mermaid sürümünün doğrulanmış `xychart-beta` sözdizimidir; beta adı ürün kabul testlerinden muafiyet oluşturmaz.

### DG-14 — Sankey

- Kaynak, hedef, ağırlık satırlarından oluşan veri tablosu; düğümler otomatik veya listeden oluşturulur.
- Pozitif sonlu ağırlık, boş etiket ve kendine bağlantı denetimi.
- Döngü desteklenmiyorsa hata ilgili satırlarda gösterilir; çiziciye kilitleyen veri gönderilmez.
- CSV alıntılama gerektiren etiketler üreteç tarafından kaçışlanır.
- Çıktı sabitlenen Mermaid sürümünde doğrulanmış `sankey-beta` sözdizimidir.

### DG-15 — Gereksinim diyagramı / Requirement

- Requirement ve desteklenen requirement alt türleri; element oluşturma.
- Kimlik, açıklama, risk, doğrulama yöntemi; element için tür ve belge referansı.
- Contains, copies, derives, satisfies, verifies, refines, traces ilişkileri, doğru yönle oluşturulur.
- İzinli alan değerleri açılır seçimle sunulur; kullanıcı kod anahtar sözcüğü bilmez.
- Çıktı `requirementDiagram`.

### DG-16 — Kanban

- Sütun ve kart ekle, adlandır, sırala; kartı sütunlar arasında taşı.
- Kart başlığı ve sabitlenen Mermaid sürümünün desteklediği sorumlu, öncelik ve görev kimliği alanları.
- Klavyeyle “Önceki/sonraki sütuna taşı” ve sıralama.
- Harici görev URL'leri sadece güvenli bağlantı olarak ele alınır; proje yönetim servisine veri gönderilmez.
- Çıktı `kanban`.

### 13.1. Tür değiştirme

Tür değiştirmenin her çift için anlamlı bir dönüşümü yoktur. Varsayılan davranış yeni diyagram oluşturmak ve mevcut diyagramı korumaktır. Yalnız önceden tanımlanmış, veri kaybetmeyen dönüştürmeler doğrudan yapılabilir. Veri kaybı ihtimalinde eski/yeni önizleme ve açık onay gerekir. Kaynak değiştirerek türü değiştirmek her zaman mümkündür; geçersiz sonuç korunur ve hata gösterilir.

## 14. Dipnot, uyarı, açılır bölüm ve üst bilgi

### 14.1. Dipnotlar

- İmleçte dipnot ekle; açıklamayı küçük panelde düzenle; referanstan açıklamaya ve geri git.
- Yeni dipnotlara benzersiz kimlik atanır; gösterim sırası belgedeki ilk kullanıma göre numaralanır.
- Açıklama paragraf, liste ve kod içerebilir. Yinelenen referans aynı tanıma gider.
- Son referans silindiğinde tanım otomatik yok edilmez; kullanıcıya kullanılmayan tanımı temizleme sunulur.
- Var olan kimlikler, tanım konumu ve kullanılmayan tanımlar değiştirilmedikçe korunur.
- PDF ve HTML çıktısında dipnotlar okunabilir ve bağlantılı olmalıdır.

### 14.2. Uyarı kutuları

- Not, ipucu, önemli, uyarı ve dikkat türleri görsel menüden seçilir.
- Dosyada `> [!NOTE]` ailesiyle saklanır; uygulamaya özel HTML/CSS zorunlu değildir.
- Tür ve içerik ayrı düzenlenir; ikon ve metin birlikte kullanılır, sadece renk kullanılmaz.
- Bu uzantıyı bilmeyen okuyucuda içerik alıntı olarak anlaşılır kalır.

### 14.3. Açılır bölümler

- Başlık/özet, gövde ve açık/kapalı başlangıç seçimi.
- `<details>` ve `<summary>` güvenli alt kümesi kullanılır. JavaScript veya keyfi HTML öznitelikleri eklenmez.
- Gövdede desteklenen Markdown içeriği uygulamanın belirlenmiş HTML/Markdown ayrıştırma kuralına göre işlenir. Dış araçlarda gövde yorumlamasının değişebileceği uyumluluk ekranında belirtilir.
- Baskıda varsayılan olarak tüm bölümler açılır; “Ekrandaki gibi” seçeneği ayrıca bulunur.

### 14.4. YAML front matter

- Yalnız dosya başındaki `---` sınırları içinde tanınır; yatay ayırıcıyla karışmaz.
- Özellikler panelinde anahtar/değer, sayı, boolean, liste ve iç içe nesne düzenleme bulunur.
- Yorumlar, sıralama ve bilinmeyen anahtarlar korunur. Ham YAML sekmesi bulunur.
- Güvenli YAML şeması kullanılır; nesne oluşturma etiketleri çalıştırılmaz; alias genişlemesi sınırlanır.
- Hatalı YAML belgeyi açmayı engellemez; panel hata gösterir, kaynak korunur.
- Başlık, etiket ve tarih alanları isteğe bağlıdır; uygulama bunları izinsiz eklemez veya değiştirmez.

## 15. Dosya, sekme ve klasör yönetimi

### 15.1. Dosya işlemleri

- Yeni, Aç, Son kullanılan, Kaydet, Farklı kaydet, Tümünü kaydet, Yeniden adlandır, Kapat ve Çık.
- Çoklu dosya seçimi ve dosyaları pencereye bırakma desteklenir.
- Markdown dosyası bırakma yeni sekmede açar; görsel bırakma düzenleme alanındaysa görsel ekler. Belirsiz durumda seçenek gösterilir.
- Kanonik yol/file ID ile aynı dosya iki kez açılmaz; mevcut sekme odaklanır. Symlink, yol büyük/küçük harfi ve platform davranışı dikkate alınır.
- Aynı dosyayı birden çok pencerede eşzamanlı düzenleme desteklenmez; mevcut açık pencereye yönlendirilir. Birden çok bağımsız uygulama örneğinde disk çakışması koruması çalışır.
- Yeniden adlandırma hedef çakışmasını denetler. Varlık klasörü adını değiştirmek ayrı seçenek olur; ilişkiler güncellenir.
- İşletim sistemi “Birlikte aç”, dosyaya çift tıklama ve komut satırında dosya yolları ile açma desteklenir.

### 15.2. Sekmeler

- Sekmeleri sürükle sırala, sabitle, kapat, diğerlerini kapat ve kapatılan son sekmeyi geri aç.
- Kaydedilmemiş sekmede belirgin nokta ve durum metni bulunur.
- Kapanışta Kaydet / Kaydetme / İptal seçenekleri; birden çok belgede dosya listesiyle toplu seçim.
- Kaydet başarısızsa sekme kapanmaz. Tümünü kaydette dosya bazında sonuç gösterilir; bir hata diğer belgelerin sonucunu gizlemez.
- Oturum geri açma ayarı; disk dosyaları ve taslaklar doğru sürüm seçimiyle geri yüklenir.

### 15.3. Klasör gezgini

- Kullanıcı açıkça klasör açar; ağaçta Markdown dosyaları, alt klasörler ve isteğe bağlı görseller gösterilir.
- Yeni dosya/klasör, yeniden adlandır, işletim sisteminde göster ve çöp kutusuna taşı.
- Kalıcı silme varsayılan eylem değildir. Çöp kutusu kullanılamıyorsa açık uyarı ve iptal seçeneği gerekir.
- Gizli dosyalar ve `.git`, `node_modules`, derleme klasörleri varsayılan gizlenir.
- Symlink döngüleri izlenmez; kök dışına çıkan bağlantı açıkça işaretlenir.
- Klasör açmak bütün diski indeksleme veya ağ taraması başlatmaz.

## 16. Kaynak koruma, belge modeli ve dönüşüm

### 16.1. Kaynak temel gerçektir

Uygulamada tek belge oturumu bulunur. Kaynak metin, özgün baytlar, ayrıştırma ağacı, görsel editör izdüşümü ve kaynak konum haritası bu oturuma bağlıdır. Görsel editörün HTML çıktısı Markdown kaynağının yerine temel gerçek olarak kullanılamaz.

- Dosya hiç değiştirilmeden kaydedilirse içerik baytları aynı kalmalıdır. Gereksiz dosya yazımı yapılmamalıdır.
- Görsel değişiklikte yalnız etkilenen en küçük güvenli kaynak alanı yeniden üretilir.
- Bir blok içindeki değişiklik o bloğun biçimini normalize edebilir; bu durum ilgili blokla sınırlıdır. Liste kapsamı veya referans tanımı gibi yapısal etkiler açık kurallarla genişletilir.
- Belgenin tümünü Markdown → HTML → Markdown turuna sokarak kaydetmek yasaktır.
- Boş satırlar, HTML yorumları, referans tanımları, bilinmeyen bloklar ve değiştirilmemiş çit türleri korunur.
- Yeni bloklar belgede algılanan biçim tercihlerini kullanır; belirsizse belgelenmiş varsayılanlar uygulanır.
- “Belge biçimini standartlaştır” ayrı komuttur; fark önizlemesi ve kullanıcı onayı olmadan çalışmaz.

### 16.2. Korunan blok davranışı

- Düzenlenemeyen içerik yerinde bir kart veya güvenli önizleme olarak görünür; özgün kaynak birebir saklanır.
- Kartta neden, kaynak görüntüle, kaynak düzenle ve destekleniyorsa dönüştür eylemleri bulunur.
- Kart taşınabilir, kopyalanabilir ve açık kullanıcı eylemiyle silinebilir. Silme geri alınabilir.
- Blok içeren belgeyi kaydetmek için kullanıcı dönüşüm yapmaya zorlanmaz.
- Ham HTML güvenli alt kümede okunabilir; script, iframe, form ve etkin içerik çalıştırılmaz. Temizlenmiş gösterim kaynağı değiştirmez.

### 16.3. Kodlama ve satır sonu

- Yeni dosya UTF-8, BOM'suz oluşturulur. Yeni dosyanın satır sonu varsayılan LF'dir.
- Mevcut UTF-8 BOM ve CRLF/LF tercihleri korunur. Karışık satır sonları değiştirilmemiş bölgelerde aynen kalır.
- Geçersiz UTF-8 sessizce replacement karakterine çevrilmez. Yeniden açma penceresinde Windows-1254, Windows-1252, UTF-16 LE/BE ve UTF-8 seçimi/önizlemesi sunulur.
- Alternatif kodlamalı dosyada özgün kodlama korunabilir; yeni karakter o kodlamada temsil edilemiyorsa kayıt engellenir ve UTF-8'e geçme/farklı kaydetme sunulur.
- Kodlama veya satır sonu dönüştürme açık komuttur; belge değişikliği olarak işaretlenir.
- Sonda yeni satır bulunup bulunmaması mevcut dosyada korunur; yeni dosyada bir son yeni satır varsayılandır.

## 17. Güvenli kaydetme ve dosya çakışmaları

### 17.1. Kaydetme işlemi

Her kaydetme aşağıdaki işlem sırasına uymalıdır:

1. Hedef yol, erişim ve belge sürümünü sabitle.
2. Dosyanın son okunan disk sürümüyle hâlâ eşleştiğini denetle; yalnız mtime değil kimlik, boyut ve içerik özeti kullan.
3. Aynı hedef dizinde benzersiz geçici dosyaya yeni içeriği yaz.
4. Dosya verisini dayanıklı yazma çağrısıyla tamamla; desteklenen platformda dizin meta verisini de dayanıklı hale getir.
5. Değiştirme öncesinde son disk sürümünü yeniden denetle; eşzamanlı değişiklikte dur ve çakışma akışına gir.
6. Platformun atomik değiştirme/yeniden adlandırma mekanizmasını kullan. İzinleri ve mümkün olan meta veriyi koru.
7. Sonucu doğrula; başarıdan sonra disk taban sürümünü ve kaydedilmiş revizyonu güncelle.
8. Kullanıcı yazmaya devam etmişse yalnız kaydedilen revizyon temiz sayılır; daha yeni değişiklikler değiştirilmiş durumda kalır.

- Kontrol/değiştirme arasında işletim sisteminin önleyemediği yarışlar için artık risk belgelenir; işletim sistemi destekliyorsa kilit/koşullu işlem kullanılır. Ağ dosya sistemlerinde yerel disk düzeyi atomiklik garanti edilmez.
- Atomik değiştirme yapılamıyorsa güvenliği azaltan doğrudan üzerine yazma sessizce denenmez; farklı kaydetme veya açık hata sunulur.
- İzin hatası, disk dolması ve antivirüs kilidi mevcut dosyayı sıfır bayta indirmemelidir.
- Kaydetme başarıyla tamamlanmadan “Kaydedildi” gösterilemez.
- Symlink hedefi kullanıcıya anlaşılır gösterilir; bağlantının kendisini yanlışlıkla normal dosyayla değiştirmekten kaçınılır.
- Varlık eklemede önce varlıklar hazırlanır, sonra belge kaydedilir. Başarısızlıkta eski belge çalışır kalır; artan kullanılmayan dosyalar temizleme listesine alınır.

### 17.2. Harici değişiklikler

- Dosya izleyici ve pencere odaklandığında yeniden kontrol birlikte kullanılır.
- Yerel değişiklik yoksa disk değişikliği imleç/kaydırma mümkün olduğunca korunarak yeniden yüklenir; kullanıcıya bilgi verilir.
- Yerel değişiklik varsa otomatik yeniden yükleme veya üzerine kaydetme yapılmaz.
- Kullanıcıya Diskteki sürümü aç, Değişiklikleri karşılaştır, Birleştir, Farklı kaydet seçenekleri sunulur.
- Üç yönlü birleştirme taban sürüm / yerel / disk üzerinden yapılır. Çakışmayan değişiklikler önizlenir; çakışan alanlar kullanıcı seçimi olmadan tamamlanmaz.
- “Benim sürümümle değiştir” eylemi disk sürümünü yedekler ve açık onay ister.
- Dosya silinmiş/taşınmışsa açık içerik korunur. Yeniden oluştur veya yeni konuma kaydet seçenekleri sunulur; otomatik boş dosya oluşturulmaz.

## 18. Otomatik taslak, otomatik kaydetme ve kurtarma

### 18.1. Ayrı kavramlar

- **Otomatik taslak:** Hedef Markdown dosyasına dokunmadan uygulama veri alanında kurtarma kopyası oluşturur; varsayılan açıktır.
- **Otomatik kaydet:** Gerçek dosyaya yazma işlemi; varsayılan kapalıdır. Kullanıcı açıkça etkinleştirir.
- Taslak kaydı ile dosya kaydı durum çubuğunda birbirinden ayrılır.

### 18.2. Süre ve saklama

- Yazma durduktan 2 saniye sonra, sürekli yazmada en geç 10 saniyede bir dayanıklı taslak kaydedilir.
- Son dayanıklı taslağa kadar kurtarma garanti hedefidir; güç kesilmesinden önce diske aktarılmamış son tuşlar için garanti verilmez.
- Otomatik kaydet açıkken 2 saniye boşta kalınca normal güvenli kaydetme akışı çalışır. Kaydedilmemiş belgeye kullanıcı hedef seçmeden dosya oluşturulmaz.
- Her belge için son 20 başarılı kayıt sürümü; varsayılan 30 gün veya toplam 500 MiB sınırıyla yerel sürüm geçmişi tutulur. Ayarlar değiştirilebilir.
- Kurtarılmamış yeni belge taslakları kullanıcı silmedikçe normal süre temizliğinde kaldırılmaz. Alan sınırına ulaşınca yeni kaydın riskte olduğu açıkça bildirilir.
- Yerel geçmiş ve taslaklar hassas içerik taşıyabilir; konumu ve temizleme eylemi ayarlarda görünür. Uygulama seviyesinde şifreli oldukları iddia edilmez.

### 18.3. Kurtarma

- Beklenmedik kapanış sonrası her taslak için dosya adı, zaman, disk sürümü ve önizleme gösterilir.
- Kurtarılan içerik önce ayrı taslak olarak açılır; mevcut disk dosyasının üzerine otomatik yazılmaz.
- Kurtar, farklı kaydet, karşılaştır ve sil eylemleri bulunur.
- Taslak bozuksa son geçerli taslak denenir; bozuk veri tanılama için kullanıcı kontrolünde tutulur.
- Kullanıcının “Kaydetme” diyerek kapattığı değişiklikler bir sonraki açılışta kendiliğinden geri getirilmez; isteğe bağlı geçmişte bulunabilir.

## 19. Geri alma, pano ve işlem bütünlüğü

- Metin, tablo, formül, diyagram ve blok taşıma aynı belge geri alma zincirine katılır.
- Görünüm değiştirme, arama ve yakınlaştırma belge geçmişine yazılmaz.
- Kaydetmek geri alma geçmişini temizlemez. Değişiklikler geri alınarak kaydedilmiş içeriğe dönülürse belge temiz duruma geçer.
- Açık formül/diyagram penceresinde geri alma o pencerenin çalışma alanında işler; Uygula sonrasında belge geçmişinde tek işlem olur.
- Panoya düz metin, güvenli HTML ve uygulama içi blok verisi birlikte yazılabilir. Uygulama içi veri güvenilmeyen giriş olarak doğrulanır.
- Normal yapıştırma desteklenen biçimi korur; biçimsiz yapıştırma salt metin ekler.
- Word/web yapıştırmasında script, olay işleyici ve uzak kaynaklar çalıştırılmaz. Taşınamayan biçimler için sadeleştirme bildirimi gösterilir.
- Undo geçmişi bellek sınırına göre yönetilir; çok büyük işlemde geçmiş silinecekse önceden bilgi verilir. Taslak ve disk sürümleri bundan bağımsızdır.

## 20. Arama ve değiştirme

- Belge içinde düz metin, büyük/küçük harf, tam sözcük ve düzenli ifade araması.
- Sonraki/önceki, eşleşme sayısı, seçim içinde ara, tekini ve tümünü değiştir.
- Kaynak kapsamı ile görünür metin kapsamı açıkça seçilir. Görsel metin araması Markdown işaretlerini sonuç olarak sunmaz.
- Formül/diyagram etiketleri aranabilir; değiştirme ilgili modele uygulanabiliyorsa görsel işlem yapılır. Ham kaynak değiştirme ayrı kapsamdır.
- Korunan blokların kaynağı ancak kaynak aramasına dahildir.
- Tümünü değiştir önce adet ve önizleme gösterir; tek geri alma işlemi olarak uygulanır.
- Regex işlemi ana arayüz dışında çalışır ve süre sınırı vardır; patolojik ifade uygulamayı kilitlemez.
- Açık klasörde isteğe bağlı çoklu dosya arama vardır; gizli/dışlanan klasör kuralları geçerlidir.
- Çoklu dosyada değiştirme dosya bazında önizleme, seçim, yedek ve disk çakışması kontrolü gerektirir. Bazı dosyalar başarısızsa kısmi sonuç açıkça raporlanır.

## 21. Dışa aktarma ve yazdırma

### 21.1. PDF ve baskı

- A4/Letter, dikey/yatay, kenar boşlukları, ölçek, başlık/altlık ve sayfa numarası.
- Baskı önizlemesi gerçek PDF/baskı yerleşimini gösterir; ayrı yaklaşık HTML önizlemesiyle yanıltılmaz.
- Açık/koyu uygulama temasından bağımsız varsayılan beyaz baskı teması.
- Başlıklar, kod, formül, tablo ve diyagramlar kesilmeden veya açık taşma uyarısıyla yerleşir.
- Uygun uzun tablolar sayfalanır; başlık satırı tekrar eder. Çok geniş tabloda yatay sayfa veya küçültme önerilir.
- Bölünemeyen büyük diyagram sayfaya sığdırılır; okunamayacak kadar küçülüyorsa önizlemede bildirilir.
- Tüm yerel fontlar ve çizim varlıkları hazır olmadan çıktı alınmaz.
- Metin aranabilir/seçilebilir olmalı; bütün sayfa ekran görüntüsü olarak PDF'e basılmamalıdır.
- Dipnotlar, başlık bağlantıları ve web bağlantıları doğrulanır. PDF/UA veya PDF/A sertifikasyonu bu kapsamda iddia edilmez.
- Kaynakta geçersiz blok varsa hata yer tutucusunu dahil etme veya iptal seçimi sunulur; bozuk içerik sessizce atılmaz.

### 21.2. HTML

- “Tek HTML” çıktısında CSS, yerel fontlar ve kullanıcıca seçilen yerel görseller gömülür; varsayılan çıktı ağ gerektirmez.
- Formüller ve diyagramlar statik, temizlenmiş içerik olarak yer alır; Mermaid/JavaScript çalıştırma zorunluluğu olmaz.
- Uzak görsel yükleme izinleri çıktıya otomatik taşınmaz. Kullanıcıya eksik/harici bağımlılık listesi sunulur.
- Semantik başlıklar, tablolar, alternatif metinler ve bağlantılar korunur.
- Ham HTML kaynağındaki etkin içerik çıktı içinde etkinleştirilmez.
- İsteğe bağlı klasörlü HTML çıktısı varlıkları ayrı klasöre yazar; göreli yollar çalışır.

### 21.3. Markdown ve paket

- Markdown çıktısı mevcut profil veya “Temel CommonMark” uyumluluk seçimiyle alınabilir.
- Temel profile dönüşümde tablo, formül, diyagram ve uyarı gibi yapılar için dönüşüm önizlemesi gösterilir; özgün dosya değişmez.
- Taşınabilir ZIP; bir Markdown dosyası, kullanılan yerel varlıklar, varsa isteğe bağlı görünüm yan verisi ve bir manifest içerir.
- Arşiv yolları göreli ve güvenlidir; `../`, mutlak yol ve dizin dışına çıkarma yoktur.
- Kök dışındaki yerel dosyalar kullanıcı seçimi olmadan pakete alınmaz. Dosya adları ve boyutlar paket önizlemesinde gösterilir.
- ZIP içe aktarma ayrı geçici alanda güvenle yapılır; zip-slip, zip-bomb ve çakışan dosyalar denetlenir. Kullanıcı hedefi seçmeden mevcut dosyalar ezilmez.
- Uygulama özel ZIP biçimine bağımlı değildir; paket normal arşiv araçlarıyla açılabilir.

## 22. Ayarlar ve kişiselleştirme

- Açık, koyu ve sistem teması; renkler erişilebilir kontrastla tanımlanır.
- Arayüz dili Türkçe/İngilizce; kullanıcı seçimi kalıcıdır. Belge içeriği veya kaynak anahtar sözcükleri çevrilmez.
- Belge ve kod fontu, okuma genişliği, satır yüksekliği; sistem fontlarına ek olarak çevrimdışı varsayılan fontlar.
- Varsayılan görünüm, son oturumu açma, sekme davranışı, içindekiler ve yan paneller.
- Yazım denetimi Türkçe/İngilizce yerel sözlüklerle çevrimdışı çalışır; kod, LaTeX ve Mermaid kaynakları denetlenmez. Kullanıcı sözlüğü yönetilebilir.
- Otomatik taslak, otomatik kaydet, geçmiş saklama, varlık kopyalama ve uzak görsel izinleri.
- Kaynak girinti genişliği, satır kaydırma, yeni dosya satır sonu ve Markdown otomatik biçimleme.
- Klavye kısayollarını yeniden atama; çakışma gösterimi ve varsayılanlara dönme.
- Ayarları JSON olarak dışa/içe aktarma; şema doğrulama ve kişisel dosya yollarını dahil etme seçimi.
- Ayar sıfırlama belgeleri silmez. Bozuk ayar dosyası yedeklenir ve güvenli varsayılanlarla açılır.

## 23. Erişilebilirlik ve yerelleştirme

- Arayüz için WCAG 2.2 AA ilkeleri hedeflenir; otomatik testlere ek olarak elle doğrulama yapılır.
- Tüm işlemler klavyeyle yapılabilir. Odak görünürdür; modalda odak tutulur ve kapanınca önceki öğeye döner.
- Ekran okuyucuya düğme adları, durum mesajları, form hataları ve tablo başlıkları aktarılır.
- Formüller MathML veya uygun erişilebilir eşdeğerle; diyagramlar kullanıcı açıklaması ve yapısal liste/veri tablosuyla sunulur.
- Düğüm tuvali tek başına erişilebilirlik çözümü sayılmaz; eşdeğer liste/form görünümü zorunludur.
- Yüksek kontrast, azaltılmış hareket ve sistem metin ölçeği tercihleri dikkate alınır.
- Renk tek anlam taşıyıcısı olmaz; hata, görev durumu ve ilişki tipleri metin/simgeyle de belirtilir.
- Tarih ve sayı girişi arayüz diline uyar; dosyaya yazılan makine biçimleri yerelden bağımsızdır.
- Türkçe `İ/ı`, birleşik Unicode karakterleri, emoji ve çift yönlü metin düzenleme testleri bulunur. Metin kendiliğinden Unicode normalizasyonuna uğratılmaz.
- Arayüz metinleri kod içine dağınık gömülmez; yerelleştirme anahtarları ve çeviri kapsam denetimi kullanılır.

## 24. Teknik mimari

### 24.1. Teknoloji kararları

| Katman | Teknoloji / yaklaşım | Sorumluluk |
| --- | --- | --- |
| Masaüstü | Electron, Electron Forge/Vite entegrasyonu veya eşdeğer Vite derleme; paketleme electron-builder | Pencere, dosya sistemi, menü, platform entegrasyonu |
| Arayüz | React + TypeScript, Vite | Ürün arayüzü ve görünüm yönetimi |
| Görsel metin | Tiptap / ProseMirror çekirdeği | Şemalı metin düzenleme ve özel bloklar |
| Kaynak editörü | CodeMirror 6 | Markdown ve blok kaynakları |
| Markdown | micromark/remark ekosistemi + kaynak konumlu özel adaptör | Profil ayrıştırma ve kontrollü kaynak yamalama |
| Matematik | MathLive + KaTeX | Görsel giriş ve güvenli belge çizimi |
| Diyagram | Mermaid + tür bazlı model/parser adaptörleri | Standart kaynak ve çizim |
| Grafik tuvali | React Flow, gerektiğinde ELK tabanlı yerleşim | Düğüm/kenar etkileşimi |
| YAML | Yorum ve kaynak aralıklarını koruyabilen YAML Document API | Front matter düzenleme |
| Güvenlik | DOMPurify veya eşdeğer doğrulanmış temizleyici, CSP, şema doğrulama | HTML/SVG/IPC girdi sınırı |
| Test | Vitest, Playwright ve Electron entegrasyon testleri | Birim, özellik tabanlı, kullanıcı akışı ve platform testleri |
| Dağıtım | electron-builder ve platform CI işleri | İmzalı kurulum ve portable paketler |

Sürümler geliştirme başlangıcında birbiriyle uyumlu kararlı sürümler olarak seçilip lockfile'a sabitlenir. Tiptap'ın beta Markdown paketine dosya bütünlüğü sorumluluğu devredilmez. Kaynak koruyan adaptör ürünün kendi modülüdür. Kütüphane seçimi yükümlülükleri kendiliğinden sağlamaz; bu belgedeki davranışlar uygulama ve testlerle tamamlanır.

### 24.2. Süreç sınırları

- **Main:** Dosya/klasör erişimi, güvenli kaydetme, izleme, oturum verisi, güncelleme, baskı ve platform menüleri.
- **Preload:** Yalnız izinli, dar ve tipli işlemleri açan köprü. Genel `fs`, shell veya sınırsız IPC dışarı verilmez.
- **Renderer:** Arayüz ve editör; Node entegrasyonu kapalı, context isolation ve sandbox açık.
- **Çalışanlar/yardımcı süreçler:** Ayrıştırma, pahalı arama, fark/birleştirme ve uygun matematik/diagram hesaplamaları. DOM gerektiren çizim ayrı sandbox renderer'da yapılır.
- Belge içeriği hiçbir süreçte çalıştırılabilir kod olarak değerlendirilmez.

### 24.3. Modül sınırları

Önerilen kaynak düzeni:

```text
src/
  main/                 # Dosya, kayıt, izleme, platform ve güncelleme
  preload/              # Tipli ve kısıtlı köprü
  renderer/
    shell/              # Pencere içi yerleşim, menüler, sekmeler
    editor/             # Görsel ve kaynak editör bağlantıları
    features/           # Tablo, matematik, diyagram ve dışa aktarma UI
  core/
    document/           # Oturum, revizyon, işlem ve kaynak haritası
    markdown/           # Profil, parser, kaynak koruma ve serializer
    diagrams/           # 16 türün model/parser/serializer/validation modülü
    math/               # Formül modeli, destek ve güvenlik kuralları
    assets/             # Varlık çözümleme ve paketleme
  shared/               # Şemalar, tipler, hata kodları ve i18n sözleşmeleri
tests/
  fixtures/             # Uyumluluk ve kötü amaçlı giriş örnekleri
  unit/
  integration/
  e2e/
  visual/
docs/                   # Mimari, kullanıcı ve yayın belgeleri
```

İş kuralları React bileşenleri içine gömülmez. Parser/serializer modülleri arayüz olmadan test edilebilir. Her diyagram türü aynı sözleşmeyi uygular; tek dev dosyada koşul zinciriyle yönetilmez.

### 24.4. Temel veri sözleşmeleri

| Model | Asgari alanlar / kural |
| --- | --- |
| DocumentSession | Oturum ID, kanonik yol, kaynak, revizyon, kaydedilmiş revizyon, kodlama, satır sonu, profil, tanılar |
| DiskBaseline | File ID, boyut, mtime, içerik özeti, son okunan kaynak; çakışma tabanı |
| SourceNode | Tür, kaynak aralığı, özgün dilim, semantik değer, çocuklar ve destek seviyesi |
| DocumentTransaction | Taban revizyon, kaynak yamaları, seçim eşlemesi, geri alma bilgisi |
| AssetReference | Belgedeki hedef, çözümlenmiş dosya, tür, sahiplik, dış/yerel ve paket izni |
| DiagramDocument | Tür, şema revizyonu, semantik model, özgün kaynak, tanılar ve yan yerleşim anahtarı |
| RecoverySnapshot | Belge ID, kaynak revizyonu, zaman, checksum, taban dosya kimliği ve geçici varlıklar |
| AppSettings | Şema revizyonu, görünüm, düzenleme, gizlilik, kayıt ve kısayollar |

Kaynak aralıklarının byte offset ile JavaScript UTF-16 konumları arasındaki dönüşümü merkezi modülde yapılır; emoji ve çok baytlı karakterlerde seçim/kaynak eşleşmesi bozulmaz. Bütün asenkron sonuçlar belge revizyonuyla etiketlenir; eski revizyonun önizlemesi yeni belgeyi ezemez.

## 25. IPC, izin ve güvenlik sözleşmesi

- Her IPC çağrısında giriş/çıkış şeması, maksimum boyut, hata kodu ve iptal davranışı tanımlıdır.
- Dosya seçici main süreçte çalışır. Renderer keyfi yol göndererek bütün diski okuyamaz; açık belge/klasör yetkisine bağlı kimlik kullanır.
- Yerel görseller uygulama protokolü üzerinden izinli köklerle sunulur. URL çözümleme, percent-encoding ve symlink kaçışları denetlenir.
- Belge göreli referansının izinli kök dışına çıkması otomatik dosya okuma hakkı vermez; tek dosya veya klasör izni alınır.
- Özel uygulama protokolü path traversal, MIME karışıklığı ve etkin HTML sunma saldırılarına kapalıdır.
- CSP; uzak script, inline script ve `eval` çalıştırmayı engeller. Üretim geliştirici sunucusuna bağlı değildir.
- Navigasyon, yeni pencere ve izin istekleri varsayılan reddedilir; güvenli dış bağlantılar kontrollü açılır.
- HTML, SVG, YAML, pano, ZIP, Mermaid ve ayar içe aktarma güvenilmeyen girdidir.
- Ağ isteği yalnız kullanıcının uzak görsel eylemi veya açık güncelleme tercihiyle yapılır. Telemetri ve içerik yükleme bulunmaz.
- Bağımlılıklar lisans/güvenlik taramasından geçer; çözümlenmemiş kritik veya sömürülebilir yüksek riskli açıkla dağıtım yapılmaz.
- Üretimde imza anahtarları, erişim tokenları ve sertifika parolaları kaynak depoda veya uygulama paketinde bulunmaz.

## 26. Performans ve kaynak bütçeleri

Bu değerler temenni değil, yayın öncesinde ölçülmesi gereken hedeflerdir. Referans bilgisayar: 4 fiziksel çekirdek, 16 GiB RAM, SSD ve desteklenen işletim sistemi. Donanım, işletim sistemi, paket türü ve ölçüm yöntemi rapora yazılır. Süreler üretim paketinde en az 20 koşunun p95 değeridir; ağ indirme zamanı dahil değildir.

| Ölçüm | Kabul hedefi |
| --- | --- |
| Kurulu uygulama soğuk açılış, kullanılabilir boş pencere | ≤ 3 saniye |
| Portable açılış, ilk açılım dahil | ≤ 6 saniye; platform güvenlik taraması ayrıca raporlanır |
| 1 MiB düz Markdown açma | ≤ 1,5 saniye |
| 10 MiB / 100.000 satır kaynak dosyası | ≤ 5 saniye; kaynak odaklı büyük belge modu kullanılabilir |
| Normal belgede tuş → görsel yanıt | p95 ≤ 50 ms |
| 1 MiB normal belge kaydetme | Yerel SSD'de ≤ 500 ms; dayanıklı yazma dahil |
| 500 düğüm / 1.000 kenar akış diyagramı | ≤ 5 saniye veya açık zaman aşımı; UI yanıt vermeye devam eder |
| 20 sekme arasında geçiş | Hazır sekmede ≤ 150 ms |
| Boş uygulama toplam bellek | ≤ 300 MiB hedefi |
| 1 MiB normal belge toplam bellek | ≤ 450 MiB hedefi; süreçlerin toplamı ölçülür |
| Boşta CPU | Süregelen iş yokken ortalama bir çekirdeğin %1'inden az |

- Büyük dosyada ilk önce metin ve belge iskeleti gösterilir; diyagramlar görünür alana yaklaştıkça çizilir.
- Tüm belgeyi her tuşta yeniden ayrıştırma yerine artımlı/ertelenmiş işler ve revizyonlu önbellek kullanılır.
- 10 MiB veya 100.000 satır üzerinde büyük belge modu önerilir; 50 MiB üzeri açılış öncesi uyarı ve kaynak modu seçimi sunulur.
- Büyük belge modu, desteklenmeyen içerik veya yüksek maliyet nedeniyle veri silmez. Görsel editör sınırı açıkça gösterilir.
- İçe aktarılan tek görsel için varsayılan sınır 25 MiB; kullanıcı bilinçli olarak artırabilir. ZIP açılımı varsayılan 500 MiB ve 10.000 girişle sınırlandırılır.
- Uzun işler ilerleme, iptal ve hata sonucu sunar. İptal yarım belge değişikliği bırakmaz.

## 27. Hata ve durum yönetimi

### 27.1. Belge durumları

Belge oturumu en az şu durumları açıkça ayırt eder: yükleniyor, temiz, değiştirilmiş, kaydediliyor, kayıt hatası, disk çakışması, salt okunur, diskten kayıp, kurtarılmış taslak. Ayrıştırma/çizim hataları belge kayıt durumundan ayrı tanılardır.

- Aynı anda yalnız bir kaydetme yürür; bekleyen yeni revizyon sıraya alınır. Eski kayıt tamamlanınca yeni içerik temiz sayılmaz.
- Hata bildirimi belge adı ve yapılabilecek eylemi içerir.
- Toast kapanması hata çözümü sayılmaz. Kalıcı sorun durum çubuğunda ve ilgili panelde kalır.
- Teknik ayrıntılar kopyalanabilir bir ayrıntı alanında bulunur; ana mesaj anlaşılır Türkçe/İngilizcedir.

### 27.2. Asgari hata sınıfları

`FILE_NOT_FOUND`, `ACCESS_DENIED`, `DISK_FULL`, `FILE_LOCKED`, `EXTERNAL_CONFLICT`, `ENCODING_ERROR`, `PARSE_ERROR`, `RENDER_TIMEOUT`, `ASSET_MISSING`, `EXPORT_FAILED`, `RECOVERY_FAILED`, `UNSAFE_CONTENT`, `UPDATE_FAILED`.

- Kayıt hatasında yeniden dene, farklı kaydet ve hata ayrıntısı.
- Çizim hatasında kaynak konumu, güvenli önizleme ve yeniden dene.
- Çıktı hatasında yarım dosya final dosya adıyla bırakılmaz; var olan çıktı ezilmez.
- İşlem logu içerik veya formül/diyagram kaynağını varsayılan olarak kaydetmez.

## 28. Gizlilik, günlükler ve yerel veriler

- Kullanıcı hesabı ve uygulama sunucusu yoktur; belgeler yerel dosya sistemindedir.
- Telemetri ve otomatik crash içeriği gönderimi bulunmaz.
- Günlükler boyuta göre döner; varsayılan toplam 20 MiB. Dosya içerikleri, pano ve kimlik bilgileri loglanmaz.
- Tanılama paketi kullanıcı eylemiyle oluşturulur; sürüm, platform ve temizlenmiş hata bilgileri içerir. Kullanıcı önizleyip kaydeder; otomatik gönderilmez.
- Dosya yolları kişisel bilgi sayılır; tanılama dışa aktarımında varsayılan maskelenir.
- Son dosyalar, önbellek, geçmiş, taslak ve sözlük verileri için ayrı temizleme eylemleri bulunur.
- Otomatik önbellek temizliği açık/kurtarılmamış taslakların tek kopyasını silmez.
- Uzak görsel açma karşı tarafa ağ bilgisi gönderebileceğinden izin metni bunu kısa ve somut şekilde açıklar.

## 29. Güncelleme ve yayın yönetimi

- Uygulamada “Güncellemeleri denetle” bulunur. İlk kullanımda otomatik denetim tercihi sunulur; seçim yapılmazsa kapalı kalır.
- Denetim isteği belge içeriği veya dosya listesi göndermez.
- Kurulu Windows/macOS sürümünde indirme, imza doğrulama, yayın notu ve yeniden başlatma akışı bulunur. Etkinleştirmek için yayın uç noktası ve sertifikalar yapılandırılmış olmalıdır.
- Portable sürümde varsayılan güncelleme yeni paketi indirme bağlantısı ve doğrulama bilgisidir; çalışan dosya sessizce kendini değiştirmez.
- Linux `.deb` paketinde sistem paket yöneticisi veya açık indirme; AppImage için doğrulanmış yeni paket akışı kullanılır. Desteklenmeyen otomatik kurulum varmış gibi gösterilmez.
- Güncelleme için yeniden başlatmadan önce tüm değişiklikler kaydedilir veya kurtarma taslağı güvenceye alınır; kullanıcı kapanışı iptal edebilir.
- Sürüm numarası SemVer düzenindedir. Yayın notu, checksum, SBOM ve lisans bildirimleri her yayında üretilir.
- Ayar/veri şeması yükseltmeleri sürümlüdür; işlem öncesi yedeklenir. Eski sürümün yeni şemayı sessizce bozması önlenir.
- Windows paketleri uygun kod imzalama ile; macOS paketleri Developer ID imzası ve notarization ile dağıtılır. Kimlik ve sertifika erişimi yayın ön koşuludur; eksikse paket test amaçlı olarak açıkça etiketlenir ve genel dağıtım kabulü tamamlanmış sayılmaz.
- Güncelleme imzası ile işletim sistemi kod imzası ayrı denetlenir. Checksum tek başına yayıncı kimliğini doğrulamaz.

## 30. Test stratejisi

### 30.1. Birim ve özellik tabanlı testler

- CommonMark/GFM örnekleri ve ürün uzantıları; parse/serialize ve kaynak yaması.
- Değiştirilmemiş dosya için byte eşitliği; BOM, CRLF, karışık satır sonu ve kodlama.
- Rastgele Unicode, kaçış, iç içe liste, çit ve tablo değerleriyle özellik tabanlı testler.
- 16 diyagram türü için model → Mermaid → model semantik eşitliği; tüm zorunlu alanların örnekleri.
- Matematik destek envanteri; MathLive/KaTeX ortak alt kümesi ve hatalı komutlar.
- YAML yorum/sıra koruma; referans/dipnot bağlantı bütünlüğü.

### 30.2. Entegrasyon testleri

- Atomik kayıt; hata enjeksiyonuyla yazma, flush, yeniden adlandırma ve disk sürümü denetimi.
- Disk dolması, dosya kilidi, erişim değişimi, symlink, dosya silme ve USB benzeri hedef kaybı.
- Arka arkaya değişiklik ve kayıt; eski revizyonun temiz işaretlenmemesi.
- Dosya izleyici ile uygulamanın kendi kayıtlarını ayırt etme; harici değişiklik ve birleştirme.
- Kesilmiş/bozuk taslaktan kurtarma; geçmiş temizleme sınırları.
- Kaynak/görsel/bölünmüş görünümde işlem ve undo bütünlüğü.

### 30.3. Uçtan uca ve görsel testler

- Dosya aç → düzenle → tablo/formül/diyagram ekle → kaydet → kapat → tekrar aç.
- Her diyagram türü için kod yazmadan oluşturma ve yeniden düzenleme.
- PDF/HTML/ZIP dışa aktarım; bağlantı, font, görsel ve taşınabilirlik doğrulaması.
- Açık/koyu tema, yüksek DPI, küçük pencere ve Türkçe/İngilizce arayüz.
- Klavyeyle tam akış; en az Windows ekran okuyucusu ve macOS VoiceOver ile manuel kontrol.
- İmzalı üretim paketinden platform/mimari başına kurulum, açılış, dosya ilişkisi ve kaldırma.
- Windows portable paketi temiz kullanıcı profili ve USB benzeri yazılabilir klasörde test edilir.
- macOS karantina/notarization ve Linux X11/Wayland temel kullanım akışları doğrulanır.

### 30.4. Güvenlik ve dayanıklılık testleri

- Kötü amaçlı HTML/SVG, Mermaid callback, tehlikeli protokol, YAML alias bombası.
- ZIP path traversal/bombası, dosya adı çakışması ve arşiv içi symlink.
- Regex kilitleme, çok büyük formül, çizim süre aşımı ve parser fuzz testleri.
- IPC yetki aşımı, izinli kök dışına erişim, URL encoding/path traversal.
- Güncellemede bozuk imza, yarım indirme, eski sürüm ve yanlış platform paketi.

## 31. Kabul kriterleri

Aşağıdaki kriterlerin tamamı teslimat kapısıdır. Her kriter için test/kanıt, çalıştırılan platform ve sonuç raporu bulunacaktır.

| Kimlik | Kabul kriteri |
| --- | --- |
| AC-01 | Markdown bilmeyen kullanıcı yalnız menü/araçlarla belge oluşturur, açar ve kaydeder |
| AC-02 | Okuma, görsel, kaynak ve bölünmüş görünüm tek belgeyi tutarlı gösterir |
| AC-03 | Değiştirilmeden kaydedilen test dosyaları byte bazında aynıdır |
| AC-04 | Tek paragraf değişikliği ilgisiz blokların kaynak dilimlerini değiştirmez |
| AC-05 | Bilinmeyen bloklar ve yorumlar aç/düzenle/kaydet turunda kaybolmaz |
| AC-06 | Temel Markdown/GFM isterlerinin tamamı görsel araçlarla oluşturulabilir |
| AC-07 | Tablo oluşturma, satır/sütun, hizalama, pano ve CSV/TSV işlemleri çalışır |
| AC-08 | Standartta olmayan tablo biçimleri kayıp uyarısı olmadan dönüştürülmez |
| AC-09 | Görsel ve bağlantı yolları kaydet/farklı kaydet/ZIP taşıma sonrası çalışır |
| AC-10 | Panodan eklenen görsel yeniden açıldığında kaybolmaz |
| AC-11 | Formül şablonları LaTeX yazmadan oluşturulur ve tekrar yapısal düzenlenir |
| AC-12 | Matematik hatası kaynak içeriğini silmez ve arayüzü kilitlemez |
| AC-13 | DG-01–DG-16 türlerinin her biri kod yazmadan oluşturulup düzenlenir |
| AC-14 | Uygulamanın ürettiği her diyagram yeniden görsel modele kayıpsız açılır |
| AC-15 | Harici Mermaid kaynağındaki desteklenmeyen alanlar onaysız silinmez |
| AC-16 | Diyagram etiketlerinde Türkçe karakter, tırnak ve anahtar sözcükler güvenle saklanır |
| AC-17 | Dipnot, uyarı, açılır bölüm ve YAML özellikleri görsel olarak düzenlenir |
| AC-18 | Kod blokları renklendirilir, kopyalanır ve hiçbir koşulda çalıştırılmaz |
| AC-19 | Görünüm değiştirip geri almak belgeyi ve undo geçmişini bozmaz |
| AC-20 | Kaydetme hatası eski dosyayı bozmaz ve yeni içeriği açık tutar |
| AC-21 | Harici dosya değişikliği kaydetme öncesi yakalanır; sessiz üzerine yazma olmaz |
| AC-22 | Üç yönlü birleştirmede çözümlenmemiş çatışma kullanıcıya açıkça gösterilir |
| AC-23 | Son dayanıklı taslak zorla kapanış sonrası kurtarılır |
| AC-24 | Taslak kaydı, gerçek dosya kaydı olarak gösterilmez |
| AC-25 | Eski kayıt işlemi sonradan yazılan revizyonu temiz işaretlemez |
| AC-26 | Çoklu sekme kapatmada hatalı kayıt yüzünden belge kaybolmaz |
| AC-27 | UTF-8, BOM, CRLF/LF ve alternatif kodlama kuralları testlerden geçer |
| AC-28 | Belge ve klasör arama/değiştirme önizleme ve geri alma kurallarına uyar |
| AC-29 | PDF çıktısı seçilebilir metin, okunabilir tablolar, formüller ve diyagramlar içerir |
| AC-30 | Bağımsız HTML çevrimdışı açılır; belge kaynaklı etkin kod çalıştırmaz |
| AC-31 | ZIP paketi temiz klasöre çıkarılıp açıldığında yerel varlıklar bulunur |
| AC-32 | Uzak görseller kullanıcı tercihi olmadan ağ isteği başlatmaz |
| AC-33 | Belge içinden script, keyfi protokol, komut veya yetkisiz dosya okuma yapılamaz |
| AC-34 | Üç platformun paketleri destek matrisi üzerinde kurulup açılır |
| AC-35 | Portable mod ayarları/kurtarmayı doğru taşınabilir veri alanına yazar |
| AC-36 | Portable veri alanı yazılamıyorsa sessiz profil değiştirme yapılmaz |
| AC-37 | Türkçe ve İngilizce arayüzde eksik metin anahtarı bulunmaz |
| AC-38 | Klavye, odak, kontrast ve ekran okuyucu kontrolleri tamamlanır |
| AC-39 | Bölüm 26 performans hedefleri üretim paketinde ölçülüp karşılanır |
| AC-40 | Güncelleme bozuk/yanlış imzalı paketi reddeder; açık belgeleri korur |
| AC-41 | Kurulum kaldırma kullanıcı belgelerini silmez |
| AC-42 | Lisans envanteri, SBOM, checksum ve yayın belgeleri eksiksizdir |
| AC-43 | Sürüm geçmişinden geri yükleme mevcut dosyayı onaysız ezmez |
| AC-44 | Kullanıcı tarafından iptal edilen modal/uzun işlem belgeye yarım değişiklik bırakmaz |
| AC-45 | Kaynak tanıları ve kaynak konumu emoji/Türkçe karakterlerde doğru eşleşir |
| AC-46 | Bütün zorunlu özelliklerin menü veya erişilebilir form karşılığı vardır |

## 32. Geliştirme ve teslimat çıktıları

Teslimat aşağıdaki öğelerin tamamını kapsar:

1. Kaynak kod, bağımlılık lockfile'ı, örnek ortam dosyası ve lisans dosyaları.
2. Tekrarlanabilir yerel geliştirme, test ve üretim derleme komutları.
3. Platform/mimari başına kurulum ve portable/kurulumsuz paketler.
4. CI yapılandırmaları; test, güvenlik taraması, paketleme ve imzalama adımları.
5. Kaynak koruma ve desteklenen Markdown profilini anlatan mimari karar kayıtları.
6. Her diyagram türü için model, destek matrisi, parser/serializer testleri ve görsel örnek.
7. Matematik destek envanteri ve görsel şablon testleri.
8. Türkçe/İngilizce çevrimdışı kullanıcı rehberi, kısayol listesi ve örnek belgeler.
9. Kurtarma, veri klasörü, portable kullanım ve hata giderme rehberi.
10. Yayınlama, imzalama, güncelleme sunucusu ve geri dönüş prosedürleri.
11. Test raporu, kabul kriteri izlenebilirlik tablosu ve performans ölçümleri.
12. Sürüm notları, checksum, SBOM ve üçüncü taraf lisans bildirimleri.

Yerel geliştirme imzasız paketle yapılabilir. Kullanıcıya dağıtılan profesyonel paketlerin imzalama ve platform kabulü ayrı, tamamlanması zorunlu yayın kapısıdır. Sertifika hesabı, yayıncı kimliği ve yayın adresi kod içinde uydurulmaz; yapılandırma girdisi olarak yönetilir.

## 33. Uygulama kararları ve kalite kapıları

### 33.1. Kapsamı değiştirmeyen uygulama sırası

Bu bir sürüm planı değildir. Bağımlılıklar nedeniyle geliştirme şu sırayla yürütülür: kaynak koruyan belge çekirdeği ve güvenli kayıt; metin/tablo/görsel işlemleri; matematik; 16 türün diyagram adaptörleri; dışa aktarma; platform dağıtımı ve bütünleşik kabul. Her alt iş tamamlanmış sayılmadan kendi testlerini geçer; ürün kabulü tüm kapsam tamamlandığında yapılır.

### 33.2. Kritik teknik doğrulamalar

- Kaynak koruma, görsel metin editörü ve tek undo zincirinin birlikte çalışması.
- MathLive/KaTeX ortak alt kümesinin formül açma/düzenleme/kaydetme turu.
- Her Mermaid türünde kaynak → model → kaynak güvenilirliği ve bilinmeyen yapıların korunması.
- Windows/macOS/Linux üzerinde atomik dosya değişimi ve arıza senaryoları.
- Tek HTML/PDF çıktısının gerçek belge görünümü ve çevrimdışı varlıkları.

Bu doğrulamalarda başarısız bir yaklaşım, özelliği ertelemek için gerekçe değildir; teknik yaklaşım değiştirilir veya ölçülebilir kapsam değişikliği kullanıcıya açıkça sunulur. Gereksinimler sessizce daraltılmaz.

### 33.3. Değişiklik yönetimi

- Yeni istek veya teknik zorunluluk bu dosyada revizyonla işlenir.
- Her değişiklik etkilenen gereksinimleri, veri uyumluluğunu ve kabul kriterlerini belirtir.
- Bir özelliğin “gösteriliyor” olması “görsel düzenleniyor” gereksinimini karşılamaz.
- Yalnız geliştirme ortamında çalışması platform teslimatı sayılmaz.
- Bilinen veri kaybı, çakışma veya güvenlik sorunu açıkken ürün tamamlandı olarak işaretlenmez.

## 34. Referanslar ve doğrulama notları

Aşağıdaki kaynaklar teknik yaklaşımın dayandığı birincil belgelerdir. Ürün gereksinimleri bu belgedeki sözleşmedir; bağlantılı kütüphanenin bütün yetenekleri otomatik ürün kapsamı değildir. Kütüphanelerin durum ve sürümleri geliştirme başlangıcında yeniden doğrulanır. Araştırma tarihi: 26 Ekim 2026.

- [CommonMark belirtimi](https://spec.commonmark.org/): Temel Markdown davranışları için normatif kaynak.
- [GitHub Flavored Markdown belirtimi](https://github.github.io/gfm/): Tablo, görev listesi ve diğer GFM uzantıları; özellikle tablo hücrelerinin blok içerik sınırı.
- [Tiptap tablo uzantısı](https://tiptap.dev/docs/editor/extensions/nodes/table): Düzenleme altyapısındaki tablo komutları; Markdown'da taşınabilirlik ayrı kuraldır.
- [Tiptap matematik uzantısı](https://tiptap.dev/docs/editor/extensions/nodes/mathematics): Matematik düğümleri ve KaTeX çizim bağlantısı.
- [Tiptap Markdown kurulum belgeleri](https://tiptap.dev/docs/editor/markdown/getting-started/installation): Araştırma tarihinde beta olarak işaretlenen paket; kaynak koruma çekirdeğinin yerine kullanılmaz.
- [MathLive matematik alanı](https://cortexjs.io/mathfield/): Yapısal matematik girişi ve sanal klavye.
- [KaTeX desteklenen işlevler](https://katex.org/docs/supported.html): Çizim motorunun komut kapsamı.
- [Mermaid sözdizimi referansı](https://mermaid.js.org/intro/syntax-reference.html): Türler, kaynak biçimi ve yapılandırma davranışları. Görsel editör ürün tarafından hazırlanır.
- [React Flow](https://reactflow.dev/pro): Grafik tuvali altyapısı; temel kütüphane ile ücretli örnek/destek hizmetlerinin lisansları ayrı değerlendirilir.
- [Electron güvenlik rehberi](https://www.electronjs.org/docs/latest/tutorial/security): Süreç izolasyonu, sandbox ve güvenilmeyen içerik sınırları.
- [electron-builder hedefleri](https://www.electron.build/v26/docs/targets/): Kurulum, portable paketler ve platforma göre güncelleme seçenekleri.

## 35. Tamamlanmış ürün tanımı

Ürün; kullanıcı Markdown, LaTeX veya Mermaid yazmadan bu dokümandaki bütün destekli içerikleri oluşturup düzenleyebildiğinde, dosyaları güvenli ve taşınabilir biçimde kaydedebildiğinde, kaynak bütünlüğü testleri geçtiğinde, bütün hedef platform paketleri doğrulandığında ve AC-01–AC-46 kabul kriterlerinin tamamı kanıtlandığında tamamlanmış sayılır. Eksik bir özellik “sonraki sürüm” etiketiyle teslimat dışına çıkarılamaz.
