# Matematik destek envanteri

Görsel giriş MathLive, belge görünümü KaTeX kullanır. MathML, KaTeX'in güven ayarı kapalı MathML çıktısından alınır. SVG, ayrı Web Worker içinde MathJax 4.1.3 ve yerel TeX font yollarıyla üretilir; SVG içindeki çizim yolları dosyaya gömülür. PNG bu SVG'den 1×, 2× veya 3×, beyaz veya saydam arka planla oluşturulur. Çevrimiçi font servisi kullanılmaz. SVG'ye kullanıcı açıklaması eklenebilir.

## Çalıştırılarak doğrulanan yapılar

Uçtan uca `formula renderer intersection` testi aşağıdaki 18 örneği gerçek KaTeX MathML ve MathJax SVG motorlarından geçirir. Test, bütün LaTeX dilinin desteklendiği anlamına gelmez.

| Grup | Örnek |
| --- | --- |
| Üs/alt indis | `x^2+y_1=3` |
| İç içe kesir | `\frac{1}{\frac{2}{3}}` |
| Dereceli kök | `\sqrt[3]{x}` |
| Toplam | `\sum_{i=1}^{n}i` |
| Çarpım | `\prod_{i=1}^{n}i` |
| Limit | `\lim_{x\to 0}\frac{\sin x}{x}` |
| İntegral | `\int_0^1 x\,dx` |
| Çoklu integral | `\iint_D f(x,y)\,dx\,dy` |
| Türev | `\frac{d}{dx}x^2` |
| Matris | `\begin{pmatrix}1&2\\3&4\end{pmatrix}` |
| Determinant | `\begin{vmatrix}a&b\\c&d\end{vmatrix}` |
| Parçalı fonksiyon | `\begin{cases}x&x>0\\-x&x\le 0\end{cases}` |
| Hizalı denklemler | `\begin{aligned}a&=b\\c&=d\end{aligned}` |
| Yunan harfleri/kümeler | `\alpha+\beta\in\mathbb{R}` |
| Vektör/aksan | `\vec{x}+\hat{y}` |
| Normal metin | `\text{Area}=\pi r^2` |
| Mantık/ilişki | `\forall x\in A\Rightarrow x\notin B` |
| İptal çizgisi | `\cancel{x}+1` |

İkinci uçtan uca test, görsel panelden 2×3 matris eklemeyi, satır eklemeyi, MathML panosunu, gerçek SVG/PNG dosyasını ve PNG içindeki dolu çizim piksellerini doğrular. Kesir testinde klavyeyle pay/payda doldurulur; boş formülün yanlışlıkla kabul edilmesine güvenilmez.

## Sınırlar ve hata davranışı

- Tam etkileşimli giriş sınırı 32 KiB'dir. Boş yer tutucular tamamlanmadan Uygula ve çıktı düğmeleri açılmaz.
- KaTeX genişletme sınırı 200'dür; güven ayarı kapalıdır. SVG çalışanı da makro sınırı uygular, 5 saniyede bitmezse sonlandırılır.
- SVG paketleri base, AMS, newcommand, textmacros, configmacros, mathtools, cancel ve boldsymbol ile sınırlıdır. Ağdan ek paket yüklenmez. SVG motorunun desteklemediği bir ifade hata verir; boş/yanlış çizim başarı sayılmaz.
- SVG filtrelemesi betik, foreignObject, dış görsel ve etkin bağlantıları kaldırır; yalnız dosya içi glif başvuruları kullanılır.
- PNG uzun kenarı 16.384 pikseli veya toplam 32 milyon pikseli aşarsa SVG kullanılması istenir.
- SVG açıklaması çıktı işlemine aittir; standart Markdown içinde formüle bağlı ayrı bir açıklama alanı henüz saklanmaz.
- MathLive/KaTeX'in bütün komutlarının bire bir eşitliği iddia edilmez. Desteklenmeyen kaynak korunur ve hata görünür; görsel iptal belgeyi değiştirmez.
