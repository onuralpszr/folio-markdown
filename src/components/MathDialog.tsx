import { useT } from '../ui';
import { useEffect, useRef, useState } from 'react';
import { MathfieldElement } from 'mathlive';
import { Modal } from './Modal';
import { MathView } from './Preview';
import katex from 'katex';
import { api } from '../platform';
import { mathML, mathPNG, mathSVG } from '../core/math-export';
MathfieldElement.fontsDirectory = new URL('./fonts', window.location.href).href;
MathfieldElement.soundsDirectory = null;
const templates = [
  ['Kesir', '\\frac{#0}{#0}'],
  ['Karekök', '\\sqrt{#0}'],
  ['n. kök', '\\sqrt[#0]{#0}'],
  ['Üs', '#0^{#0}'],
  ['Alt indis', '#0_{#0}'],
  ['Toplam', '\\sum_{#0}^{#0} #0'],
  ['Çarpım', '\\prod_{#0}^{#0} #0'],
  ['İntegral', '\\int_{#0}^{#0} #0 \\, dx'],
  ['Limit', '\\lim_{x\\to #0} #0'],
  ['Matris', '\\begin{pmatrix}#0&#0\\\\#0&#0\\end{pmatrix}'],
  ['Parçalı', '\\begin{cases}#0 & #0 \\\\ #0 & #0\\end{cases}'],
  ['Türev', '\\frac{d}{dx} #0'],
  ['Vektör', '\\vec{#0}'],
  ['Hizalı denklemler', '\\begin{aligned}#0 &= #0 \\\\ #0 &= #0\\end{aligned}'],
  ['Normal metin', '\\text{#0}'],
];
export function MathDialog({
  value,
  inline,
  onApply,
  onClose,
}: {
  value: string;
  inline: boolean;
  onApply: (v: string, inline: boolean) => void;
  onClose: () => void;
}) {
  const ui = useT();

  const host = useRef<HTMLDivElement>(null),
    field = useRef<MathfieldElement | null>(null);
  const [latex, setLatex] = useState(value || 'x^2 + y^2 = r^2'),
    [isInline, setInline] = useState(inline),
    [source, setSource] = useState(false);
  const [matrixRows, setMatrixRows] = useState(2),
    [matrixCols, setMatrixCols] = useState(2),
    [matrixStyle, setMatrixStyle] = useState('pmatrix'),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(''),
    [exportScale, setExportScale] = useState(2),
    [transparent, setTransparent] = useState(false),
    [description, setDescription] = useState('');
  let valid = !!latex.trim() && latex.length <= 32768;
  try {
    if (!valid || /\\placeholder\b|#0/.test(latex)) valid = false;
    else katex.renderToString(latex, { throwOnError: true, trust: false, maxExpand: 200 });
  } catch {
    valid = false;
  }
  useEffect(() => {
    const math = new MathfieldElement();
    math.value = latex;
    math.mathVirtualKeyboardPolicy = 'manual';
    math.setAttribute('aria-label', 'Görsel matematik editörü');
    math.addEventListener('input', () => setLatex(math.value));
    host.current?.appendChild(math);
    field.current = math;
    return () => {
      math.remove();
    };
  }, []);
  const insert = (s: string) => {
    field.current?.executeCommand([
      'insert',
      s.replaceAll('#0', '#?'),
      { insertionMode: 'replaceSelection', selectionMode: 'placeholder' },
    ]);
    field.current?.focus();
    requestAnimationFrame(() => field.current?.focus());
    setLatex(field.current?.value || '');
  };
  const matrixCommand = (
    command: 'addRowAfter' | 'addColumnAfter' | 'removeRow' | 'removeColumn',
  ) => {
    const math = field.current;
    const matrices = (value: string) =>
      value
        .match(/\\begin\{([pbBvV]?matrix|cases|array|aligned)\}[\s\S]*?\\end\{\1\}/g)
        ?.join('\n') || '';
    const before = matrices(math?.value || '');
    const changed = !!before && !!math?.executeCommand(command);
    if (!changed || matrices(math!.value) === before) {
      if (changed) math!.executeCommand('undo');
      setNotice(ui('Önce matrisin içindeki bir hücreyi seçin.'));
    } else {
      setLatex(math!.value);
      setNotice('');
    }
    math?.focus();
  };
  const exportFormula = async (format: 'latex' | 'mathml' | 'svg' | 'png') => {
    setBusy(true);
    setNotice('');
    try {
      if (format === 'latex' || format === 'mathml') {
        await navigator.clipboard.writeText(format === 'latex' ? latex : mathML(latex, !isInline));
        setNotice(ui('Panoya kopyalandı.'));
      } else {
        const parsed = new DOMParser().parseFromString(
          await mathSVG(latex, !isInline),
          'image/svg+xml',
        );
        if (description.trim()) {
          const title = parsed.createElementNS('http://www.w3.org/2000/svg', 'title');
          title.textContent = description.trim();
          parsed.documentElement.prepend(title);
          parsed.documentElement.setAttribute('role', 'img');
          parsed.documentElement.setAttribute('aria-label', description.trim());
        }
        const svg = new XMLSerializer().serializeToString(parsed.documentElement);
        if (
          await api.exportFile(
            `formul.${format}`,
            format === 'svg' ? svg : await mathPNG(svg, exportScale, transparent),
            format,
          )
        )
          setNotice(ui('Formül dışa aktarıldı.'));
      }
    } catch (error) {
      setNotice((error as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title={ui('Bir formül oluştur')}
      eyebrow={ui('MATEMATİK ATÖLYESİ')}
      onClose={onClose}
      wide
      footer={
        <>
          <span className="footer-hint">{ui('LaTeX bilmen gerekmiyor.')}</span>
          <button className="button" onClick={onClose}>
            {ui('İptal')}
          </button>
          <button
            className="button primary"
            disabled={!valid}
            onClick={() => onApply(latex, isInline)}
          >
            {ui('Formülü uygula')}
          </button>
        </>
      }
    >
      <p className="muted">
        {ui('Bir yapı seç, boşlukları doldur. Alanlar arasında yön tuşları ve Tab ile ilerle.')}
      </p>
      <div className="formula-tools">
        {templates.map(([label, v]) => (
          <button key={label} onClick={() => insert(v)}>
            {ui(label)}
          </button>
        ))}
      </div>
      <div className="mathfield-host" ref={host} />
      <details className="matrix-panel">
        <summary>{ui('Matris ve determinant')}</summary>
        <div className="formula-tools">
          <label>
            {ui('Satır')}{' '}
            <input
              aria-label={ui('Matris satır sayısı')}
              type="number"
              min="1"
              max="10"
              value={matrixRows}
              onChange={(e) =>
                setMatrixRows(Math.max(1, Math.min(10, Number(e.target.value) || 1)))
              }
            />
          </label>
          <label>
            {ui('Sütun')}{' '}
            <input
              aria-label={ui('Matris sütun sayısı')}
              type="number"
              min="1"
              max="10"
              value={matrixCols}
              onChange={(e) =>
                setMatrixCols(Math.max(1, Math.min(10, Number(e.target.value) || 1)))
              }
            />
          </label>
          <select
            aria-label={ui('Matris biçimi')}
            value={matrixStyle}
            onChange={(e) => setMatrixStyle(e.target.value)}
          >
            <option value="pmatrix">( )</option>
            <option value="bmatrix">[ ]</option>
            <option value="vmatrix">{ui('Determinant | |')}</option>
            <option value="matrix">{ui('Parantezsiz')}</option>
          </select>
          <button
            onClick={() =>
              insert(
                `\\begin{${matrixStyle}}${Array.from({ length: matrixRows }, () => Array(matrixCols).fill('#0').join(' & ')).join(' \\\\ ')}\\end{${matrixStyle}}`,
              )
            }
          >
            {ui('Matrisi ekle')}
          </button>
        </div>
        <p className="muted">
          {ui('Mevcut matrisin bir hücresini seçerek satır veya sütun ekleyip silebilirsiniz.')}
        </p>
        <div className="formula-tools">
          <button onClick={() => matrixCommand('addRowAfter')}>{ui('Satır ekle')}</button>
          <button onClick={() => matrixCommand('addColumnAfter')}>{ui('Sütun ekle')}</button>
          <button onClick={() => matrixCommand('removeRow')}>{ui('Satırı sil')}</button>
          <button onClick={() => matrixCommand('removeColumn')}>{ui('Sütunu sil')}</button>
        </div>
      </details>
      <div className="symbol-strip">
        {[
          'α',
          'β',
          'γ',
          'δ',
          'θ',
          'λ',
          'μ',
          'π',
          'σ',
          'φ',
          'ω',
          '∞',
          '≠',
          '≤',
          '≥',
          '∈',
          '∪',
          '∩',
          '→',
          '±',
        ].map((s) => (
          <button key={s} onClick={() => insert(s)}>
            {s}
          </button>
        ))}
      </div>
      <div className="math-preview">
        <span className="eyebrow">{ui('BELGEDEKİ GÖRÜNÜM')}</span>
        <MathView value={latex.replace(/\\placeholder(?:\{[^}]*\})?/g, '\\square')} block />
        {!valid && (
          <p className="error-message">
            {ui(
              'Boş alanları doldurun veya desteklenmeyen komutu düzeltin. Özgün formül iptal edene kadar korunur.',
            )}
          </p>
        )}
      </div>
      <div className="dialog-options">
        <label>
          <input type="checkbox" checked={isInline} onChange={(e) => setInline(e.target.checked)} />
          {ui('Metnin içinde göster')}
        </label>
        <button className="text-button" onClick={() => setSource(!source)}>
          {source ? 'LaTeX alanını gizle' : 'LaTeX kaynağını göster'}
        </button>
      </div>
      {source && (
        <textarea
          aria-label={ui('LaTeX kaynağı')}
          className="code-input"
          value={latex}
          onChange={(e) => {
            setLatex(e.target.value);
            if (field.current) field.current.value = e.target.value;
          }}
        />
      )}
      <div className="formula-export" aria-busy={busy}>
        <span className="eyebrow">{ui('FORMÜLÜ PAYLAŞ')}</span>
        <div className="formula-tools">
          <label>
            {ui('PNG çözünürlüğü')}{' '}
            <select
              aria-label={ui('PNG çözünürlüğü')}
              value={exportScale}
              onChange={(e) => setExportScale(Number(e.target.value))}
            >
              <option value="1">1×</option>
              <option value="2">2×</option>
              <option value="3">3×</option>
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={transparent}
              onChange={(e) => setTransparent(e.target.checked)}
            />{' '}
            {ui('Saydam PNG')}
          </label>
        </div>
        <label>
          {ui('SVG açıklaması')}
          <input
            aria-label={ui('SVG açıklaması')}
            value={description}
            maxLength={2000}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={ui('Örneğin: İki satır ve üç sütunlu matris')}
          />
        </label>
        <div className="formula-tools">
          <button disabled={!valid || busy} onClick={() => void exportFormula('latex')}>
            {ui('LaTeX kopyala')}
          </button>
          <button disabled={!valid || busy} onClick={() => void exportFormula('mathml')}>
            {ui('MathML kopyala')}
          </button>
          <button disabled={!valid || busy} onClick={() => void exportFormula('svg')}>
            {ui('SVG indir')}
          </button>
          <button disabled={!valid || busy} onClick={() => void exportFormula('png')}>
            {ui('PNG indir')}
          </button>
        </div>
        <p role="status">{busy ? ui('Formül hazırlanıyor…') : notice}</p>
      </div>
    </Modal>
  );
}
