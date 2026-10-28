import { test, expect } from '@playwright/test';
import { promises as fs } from 'node:fs';

test('opens, edits visually, and preserves unrelated Markdown source', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('.document-scroll h1:visible')).toHaveText('Düşüncelerine yer aç.');
  await expect(page.locator('.document-scroll .mermaid-drawing:visible svg')).toBeVisible();
  await page.getByRole('button', { name: 'Düzenle', exact: true }).first().click();
  const heading = page.locator('.tiptap h1');
  await heading.click();
  await page.keyboard.press('End');
  await page.keyboard.insertText(' Harika.');
  await page.getByRole('button', { name: 'Kaynak', exact: true }).click();
  await expect(page.locator('.cm-content')).toContainText('Harika.');
  await expect(page.locator('.cm-content')).toContainText('```mermaid');
  expect(errors).toEqual([]);
});

test('creates a table and a formula without syntax', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('button', { name: /Yeni belge/ })
    .first()
    .click();
  await page.getByRole('button', { name: 'Ekle', exact: true }).click();
  await page.getByRole('button', { name: 'Tablo', exact: true }).click();
  await page.getByRole('button', { name: 'Tabloyu ekle' }).click();
  await expect(page.locator('.tiptap table')).toBeVisible();
  await page.getByRole('button', { name: 'Ekle', exact: true }).click();
  await page.getByRole('button', { name: 'Matematik formülü' }).click();
  await expect(page.locator('math-field')).toBeVisible();
  await page.getByRole('button', { name: 'Kesir', exact: true }).click();
  await expect(page.locator('math-field')).toBeFocused();
  await page.keyboard.type('1');
  await page.keyboard.press('Tab');
  await page.keyboard.type('2');
  const entered = await page.locator('math-field').evaluate((field: any) => field.value);
  expect(entered).not.toContain('placeholder');
  await page.getByRole('button', { name: 'Formülü uygula' }).click();
  await expect(page.locator('.tiptap .editable-formula')).toBeVisible();
});

test('all sixteen generated diagrams parse and render', async ({ page }) => {
  await page.goto('/');
  const results = await page.evaluate(async () => {
    const { diagramKinds, newDiagram, diagramSource } = await import(
      '/src/core/diagrams.ts' as any
    );
    const { getMermaid } = await import('/src/core/mermaid.ts' as any);
    const mermaid = await getMermaid();
    const results: { kind: string; error?: string }[] = [];
    for (const [kind] of diagramKinds) {
      try {
        const source = diagramSource(newDiagram(kind));
        await mermaid.parse(source);
        const result = await mermaid.render('test-' + kind.replace(/\W/g, ''), source);
        if (!result.svg.includes('<svg')) throw new Error('No SVG');
        results.push({ kind });
      } catch (e: any) {
        results.push({ kind, error: e.message });
      }
    }
    return results;
  });
  expect(
    results.filter((r) => r.error),
    JSON.stringify(results, null, 2),
  ).toEqual([]);
});

test('diagram workshop creates, modifies, and reopens a visual diagram', async ({ page }) => {
  page.on('dialog', (d) => d.accept());
  await page.goto('/');
  await page
    .locator('.document-scroll .diagram-caption')
    .getByRole('button', { name: 'Düzenle', exact: true })
    .click();
  await expect(page.getByRole('heading', { name: 'Düşüncelerini görselleştir' })).toBeVisible();
  const first = page.getByRole('textbox', { name: 'Öğe etiketi' }).first();
  await first.fill('Yeni başlangıç');
  await page.getByRole('button', { name: 'Diyagramı uygula' }).click();
  await expect(page.locator('.document-scroll .diagram-preview:visible')).toContainText(
    'Yeni başlangıç',
  );
  await page
    .locator('.document-scroll .diagram-caption')
    .getByRole('button', { name: 'Düzenle', exact: true })
    .click();
  await expect(page.getByRole('textbox', { name: 'Öğe etiketi' }).first()).toHaveValue(
    'Yeni başlangıç',
  );
});

test('unsafe HTML never runs and remote images do not load', async ({ page }) => {
  await page.goto('/');
  const text =
    '# Güvenlik\n\n<script>window.evil=true</script>\n\n<img src="https://example.com/tracker" onerror="window.evil=true">\n\n![uzak](https://example.com/private.png)';
  await page
    .getByRole('button', { name: /Yeni belge/ })
    .first()
    .click();
  await page.getByRole('button', { name: 'Kaynak', exact: true }).click();
  await page.locator('.cm-content').click();
  await page.keyboard.insertText(text);
  await page.getByRole('button', { name: 'Oku', exact: true }).click();
  expect(await page.evaluate(() => (window as any).evil)).toBeUndefined();
  await expect(page.locator('.document-scroll .missing-asset:visible')).toContainText('yüklenmedi');
});

test('captures light and dark desktop layouts', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.document-scroll .mermaid-drawing:visible svg')).toBeVisible();
  await page.screenshot({ path: 'docs/screenshots/folio-light.png', fullPage: true });
  await page.getByRole('button', { name: 'Ayarlar', exact: true }).click();
  await page.getByRole('button', { name: 'Koyu', exact: true }).click();
  await page.getByRole('button', { name: 'Tamam', exact: true }).click();
  await page.screenshot({ path: 'docs/screenshots/folio-dark.png', fullPage: true });
});

test('switches interface language without translating document content', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ayarlar', exact: true }).click();
  await page.getByRole('combobox', { name: 'Interface language' }).selectOption('en');
  await expect(page.getByRole('heading', { name: 'A space of your own' })).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'New document', exact: false }).first(),
  ).toBeVisible();
  await expect(page.locator('.document-scroll h1:visible')).toHaveText('Düşüncelerine yer aç.');
});

test('searches and replaces with a bounded worker', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Belgede ara', exact: true }).click();
  await page.getByRole('textbox', { name: 'Aranacak metin' }).fill('Folio');
  await expect(page.locator('.search-results')).toContainText('Folio');
  await page.getByRole('textbox', { name: 'Yeni metin', exact: true }).fill('Atölye');
  await page.getByRole('button', { name: 'Değiştir', exact: true }).click();
  await page.getByRole('button', { name: 'Kapat', exact: true }).click();
  await expect(page.locator('.document-scroll .markdown-body:visible')).toContainText('Atölye');
});

test('undo survives switching between source and visual views', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Düzenle', exact: true }).first().click();
  const heading = page.locator('.tiptap h1');
  await heading.click();
  await page.keyboard.press('End');
  await page.keyboard.insertText(' Yeni.');
  await page.getByRole('button', { name: 'Kaynak', exact: true }).click();
  await expect(page.locator('.cm-content')).toContainText('Yeni.');
  await page.getByRole('button', { name: 'Geri al', exact: true }).click();
  await page.getByRole('button', { name: 'Oku', exact: true }).click();
  await expect(page.locator('.document-scroll h1:visible')).toHaveText('Düşüncelerine yer aç.');
});

test('exports actual document HTML with offline fonts and rendered diagram labels', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.document-scroll .mermaid-drawing svg')).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Dışa aktar', exact: true }).click();
  await page.getByRole('button', { name: 'Bağımsız HTML', exact: true }).click();
  const file = await download,
    filename = await file.path();
  const html = await fs.readFile(filename!, 'utf8');
  expect(html).toContain('Düşüncelerine yer aç.');
  expect(
    await page.evaluate(
      (value) => new DOMParser().parseFromString(value, 'text/html').body.textContent,
      html,
    ),
  ).toContain('Bir fikir');
  expect(html).toContain('data:font/');
  expect(html).not.toContain('contenteditable="true"');
  expect(html).not.toContain('<script');
});

test('terminates pathological regex without blocking the app', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const { searchDocument } = await import('/src/core/search.ts' as any);
    try {
      await searchDocument('a'.repeat(30000) + '!', '(a+)+$', true, true);
      return 'unexpected success';
    } catch (error: any) {
      return error.message;
    }
  });
  expect(result).toContain('süre sınırı');
  await page.getByRole('button', { name: 'Ayarlar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Kendine göre bir alan' })).toBeVisible();
});

test('renders collapsible Markdown and edits its body visually', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Yeni belge', exact: true }).click();
  await page.getByRole('button', { name: 'Kaynak', exact: true }).click();
  await page.locator('.cm-content').click();
  await page.keyboard.insertText(
    '<details>\n<summary>Ayrıntı</summary>\n\n**Gizli içerik**\n\n</details>\n',
  );
  await page.getByRole('button', { name: 'Oku', exact: true }).click();
  await page.locator('.document-details summary').click();
  await expect(page.locator('.document-details strong')).toBeVisible();
  await page.getByRole('button', { name: 'Düzenle', exact: true }).first().click();
  await page.locator('.special-details .special-label button').click();
  await expect(page.locator('.mini-editor .tiptap')).toBeVisible();
  await page.locator('.mini-editor .tiptap p').click();
  await page.keyboard.press('End');
  await page.keyboard.insertText(' eklendi');
  await page.getByRole('button', { name: 'Uygula', exact: true }).click();
  await page.getByRole('button', { name: 'Kaynak', exact: true }).click();
  await expect(page.locator('.cm-content')).toContainText('eklendi');
  await expect(page.locator('.cm-content')).toContainText('</details>');
});

test('previewing an external Mermaid dialect never drops its comments', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Yeni belge', exact: true }).click();
  await page.getByRole('button', { name: 'Kaynak', exact: true }).click();
  await page.locator('.cm-content').click();
  await page.keyboard.insertText(
    '```mermaid\nflowchart LR\n%% korunacak yorum\nn1["Bir"] --> n2["İki"]\n```\n',
  );
  await page.getByRole('button', { name: 'Oku', exact: true }).click();
  await page
    .locator('.diagram-caption')
    .getByRole('button', { name: 'Düzenle', exact: true })
    .click();
  await expect(page.getByRole('textbox', { name: 'Mermaid kaynağı' })).toContainText(
    'korunacak yorum',
  );
  await page.getByRole('button', { name: 'Önizleme', exact: true }).click();
  await page.getByRole('button', { name: 'Diyagramı uygula' }).click();
  await page.getByRole('button', { name: 'Kaynak', exact: true }).click();
  await expect(page.locator('.cm-content')).toContainText('%% korunacak yorum');
});

test('matrix controls and standalone formula exports work without network fonts', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('button', { name: 'Ekle', exact: true }).click();
  await page.getByRole('button', { name: 'Matematik formülü' }).click();
  await page.getByText('Matris ve determinant', { exact: true }).click();
  await page.getByRole('spinbutton', { name: 'Matris sütun sayısı' }).fill('3');
  await page.getByRole('button', { name: 'Matrisi ekle', exact: true }).click();
  const matrix = await page.locator('math-field').evaluate((field: any) => field.value);
  expect(matrix).toContain('pmatrix');
  expect((matrix.match(/&/g) || []).length, matrix).toBe(4);
  await page.getByRole('button', { name: 'Satır ekle', exact: true }).click();
  const expanded = await page.locator('math-field').evaluate((field: any) => field.value);
  expect((expanded.match(/&/g) || []).length, expanded).toBe(6);
  await page.getByRole('button', { name: 'LaTeX kaynağını göster' }).click();
  await page
    .getByRole('textbox', { name: 'LaTeX kaynağı' })
    .fill('\\begin{pmatrix}1&2&3\\\\4&5&6\\end{pmatrix}');
  await page.getByRole('button', { name: 'MathML kopyala' }).click();
  await expect(page.locator('.formula-export [role=status]')).toContainText('Panoya kopyalandı.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('<mtable');
  const svgDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'SVG indir' }).click();
  await expect(page.locator('.formula-export [role=status]')).toContainText(
    'Formül dışa aktarıldı.',
    { timeout: 12000 },
  );
  const svg = await fs.readFile((await (await svgDownload).path())!, 'utf8');
  expect(svg).toContain('<path');
  expect(svg).not.toContain('foreignObject');
  expect(svg).not.toMatch(/https?:\/\/(?!www\.w3\.org)/);
  const pngDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'PNG indir' }).click();
  const png = await fs.readFile((await (await pngDownload).path())!);
  expect(png.subarray(1, 4).toString()).toBe('PNG');
  const pixels = await page.evaluate(async (encoded) => {
    const image = new Image();
    image.src = 'data:image/png;base64,' + encoded;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);
    return {
      width: image.width,
      height: image.height,
      dark: [...context.getImageData(0, 0, image.width, image.height).data].filter(
        (v, i) => i % 4 !== 3 && v < 128,
      ).length,
    };
  }, png.toString('base64'));
  expect(pixels.width).toBeGreaterThan(50);
  expect(pixels.height).toBeGreaterThan(30);
  expect(pixels.dark).toBeGreaterThan(100);
});

test('formula renderer intersection supports the documented structural inventory', async ({
  page,
}) => {
  await page.goto('/');
  const results = await page.evaluate(async () => {
    const { mathSVG, mathML } = await import('/src/core/math-export.ts' as any);
    const formulas = [
      'x^2+y_1=3',
      '\\frac{1}{\\frac{2}{3}}',
      '\\sqrt[3]{x}',
      '\\sum_{i=1}^{n}i',
      '\\prod_{i=1}^{n}i',
      '\\lim_{x\\to 0}\\frac{\\sin x}{x}',
      '\\int_0^1 x\\,dx',
      '\\iint_D f(x,y)\\,dx\\,dy',
      '\\frac{d}{dx}x^2',
      '\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}',
      '\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}',
      '\\begin{cases}x&x>0\\\\-x&x\\le 0\\end{cases}',
      '\\begin{aligned}a&=b\\\\c&=d\\end{aligned}',
      '\\alpha+\\beta\\in\\mathbb{R}',
      '\\vec{x}+\\hat{y}',
      '\\text{Area}=\\pi r^2',
      '\\forall x\\in A\\Rightarrow x\\notin B',
      '\\cancel{x}+1',
    ];
    const failures = [];
    for (const latex of formulas) {
      try {
        if (!mathML(latex, true).includes('<math')) throw new Error('MathML');
        if (!(await mathSVG(latex, true)).includes('<path')) throw new Error('SVG');
      } catch (error: any) {
        failures.push({ latex, error: error.message });
      }
    }
    return failures;
  });
  expect(results).toEqual([]);
});

test('settings import validates first and applies only after preview', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ayarlar', exact: true }).click();
  const settings = {
    theme: 'dark',
    font: 'sans',
    width: 800,
    fontSize: 16,
    autosave: false,
    restore: true,
    language: 'tr',
  };
  await page
    .getByLabel('Ayar dosyası', { exact: true })
    .setInputFiles({
      name: 'ayarlar.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(settings)),
    });
  await expect(page.getByRole('heading', { name: 'Ayar önizlemesi' })).toBeVisible();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Ayarları uygula' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page
    .getByLabel('Ayar dosyası', { exact: true })
    .setInputFiles({
      name: 'gecersiz.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify({ ...settings, width: 0, theme: 'light' })),
    });
  await expect(page.getByRole('heading', { name: 'Ayar önizlemesi' })).toHaveCount(0);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(
    page.getByText(
      'Ayar dosyasında eksik, bilinmeyen veya geçersiz bir alan var. Ayarlar değiştirilmedi.',
      { exact: true },
    ),
  ).toBeVisible();
});
