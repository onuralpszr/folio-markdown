export const welcome =
  `# Düşüncelerine yer aç.

İyi bir fikir, boş bir sayfayla başlar. **Folio**, notlarını, belgelerini ve karmaşık düşüncelerini sade bir yerde buluşturur.

> [!TIP]
> Bu belge gerçek bir Markdown dosyası. **Düzenle** düğmesine basarak yazmaya başlayabilir; tablo, formül ve diyagramları kod bilmeden ekleyebilirsin.

## Küçük bir fikirden, büyük resme

Bir projeyi anlatırken bazen birkaç kelime, bazen bir tablo, bazen de bir diyagram gerekir. Hepsi aynı sayfada, tam olması gerektiği yerde.

| Özellik | Nasıl çalışır? | Durum |
| :--- | :--- | :---: |
| Görsel düzenleme | Belgeye tıkla ve yaz | Hazır |
| Matematik | Sembollerle formül oluştur | Hazır |
| Diyagramlar | Fikirlerini birbirine bağla | Hazır |

## Fikirlerini birbirine bağla

Aşağıdaki diyagramı **Düzenle** düğmesiyle açabilirsin. Kutuları ve bağlantıları görsel olarak değiştir; Markdown'ı Folio hazırlasın.

\
\
\
`.replace(/\\\n/g, '') +
  '\n```mermaid\nflowchart LR\n  n1(["Bir fikir"])\n  n2["Keşfet"]\n  n3{"Geliştir"}\n  n4(["Paylaş"])\n  n1 --> n2\n  n2 --> n3\n  n3 --> n4\n```\n' +
  `
## Matematiğin de bir yeri var

Metnin içinde $E = mc^2$ yazabilir veya bir denkleme kendi alanını verebilirsin:

$$
f(x) = \\frac{1}{\\sqrt{2\\pi}} e^{-\\frac{x^2}{2}}
$$

## Bir sonraki adım

- [x] Yeni bir düşünceye yer aç
- [ ] Kendi belgeni oluştur
- [ ] Bir tablo veya diyagram ekle
- [ ] Dosyanı kaydet ve paylaş

---

*Dosyaların senin. Fikirlerin senin. Her şey bu bilgisayarda.*
`;
