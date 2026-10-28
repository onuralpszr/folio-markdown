import { useT } from '../ui';
import { lazy, Suspense, useMemo, useState } from 'react';
import type { Editor } from '@tiptap/core';
import type { BlockEdit } from './VisualEditor';
const NestedMath = lazy(() =>
  import('./MathDialog').then((module) => ({ default: module.MathDialog })),
);
const NestedDiagram = lazy(() =>
  import('./DiagramDialog').then((module) => ({ default: module.DiagramDialog })),
);
const MiniEditor = lazy(() =>
  import('./VisualEditor').then((module) => ({ default: module.VisualEditor })),
);
import { parseDocument } from 'yaml';
import { print } from '../core/markdown';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from './Modal';
export function BlockDialog({
  kind,
  value,
  documentId,
  onApply,
  onClose,
}: {
  kind: string;
  value: string;
  documentId: string;
  onApply: (s: string) => void;
  onClose: () => void;
}) {
  const ui = useT();
  const [miniEditor, setMiniEditor] = useState<Editor | null>(null),
    [nested, setNested] = useState<BlockEdit | null>(null),
    [detailsOpen, setDetailsOpen] = useState(/<details[^>]*\bopen\b/i.test(value));

  const titles: Record<string, string> = {
    link: 'Bir bağlantı ekle',
    image: 'Görsel bağlantısı',
    alert: 'Bir bilgi kutusu ekle',
    details: 'Açılır bölüm',
    footnote: 'Dipnot',
    yaml: 'Belge özellikleri',
    protected: 'Korunan kaynak',
    code: 'Kod bloğu',
  };
  const [raw, setRaw] = useState(value),
    [type, setType] = useState(value.match(/^> \[!(\w+)\]/)?.[1] || 'NOTE'),
    [label, setLabel] = useState(
      kind === 'details'
        ? value.match(/<summary>(.*?)<\/summary>/s)?.[1] || 'Daha fazla bilgi'
        : kind === 'footnote'
          ? value.match(/^\[\^([^\]]+)\]/)?.[1] || 'not1'
          : '',
    ),
    [url, setUrl] = useState('');
  const [body, setBody] = useState(
    kind === 'alert'
      ? value.replace(/^> \[!\w+\]\r?\n?/, '').replace(/^> ?/gm, '')
      : kind === 'details'
        ? value
            .replace(/^<details[^>]*>\s*<summary>.*?<\/summary>\s*/s, '')
            .replace(/\s*<\/details>$/, '')
        : kind === 'footnote'
          ? value.replace(/^\[\^[^\]]+\]:\s*/, '').replace(/^ {4}/gm, '')
          : '',
  );
  const [language, setLanguage] = useState('javascript'),
    [sourceMode, setSourceMode] = useState(kind === 'protected');
  const yaml = useMemo(
    () => parseDocument(kind === 'yaml' ? value.replace(/^---\r?\n|\r?\n---\s*$/g, '') : ''),
    [],
  );
  const [props, setProps] = useState<[string, string][]>(() => {
    try {
      const data = yaml.toJS({ maxAliasCount: 100 });
      return Object.entries(data || {}).map(([k, v]) => [
        k,
        typeof v === 'string' ? v : JSON.stringify(v),
      ]);
    } catch {
      return [];
    }
  });
  const [error, setError] = useState('');
  function apply() {
    try {
      if (sourceMode) {
        onApply(raw);
        return;
      }
      if (kind === 'link') {
        const target = url.trim();
        if (/^(javascript|vbscript|data):/i.test(target))
          throw new Error('Bu bağlantı türüne izin verilmiyor.');
        onApply(
          print({
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'link',
                    url: target,
                    children: [{ type: 'text', value: label || target }],
                  },
                ],
              },
            ],
          }).trimEnd(),
        );
      } else if (kind === 'image')
        onApply(
          print({
            type: 'root',
            children: [{ type: 'paragraph', children: [{ type: 'image', url, alt: label }] }],
          }).trimEnd(),
        );
      else if (kind === 'alert')
        onApply(
          `> [!${type}]\n` +
            body
              .split('\n')
              .map((s) => '> ' + s)
              .join('\n'),
        );
      else if (kind === 'details')
        onApply(
          `<details${detailsOpen ? ' open' : ''}>\n<summary>${label.replace(/[<>]/g, '')}</summary>\n\n${body}\n\n</details>`,
        );
      else if (kind === 'footnote')
        onApply(
          `[^${label.replace(/[^\p{L}\p{N}_-]/gu, '') || 'not'}]: ${body.replace(/\n/g, '\n    ')}`,
        );
      else if (kind === 'code') {
        const fence = '`'.repeat(
          Math.max(3, ...[...body.matchAll(/`{3,}/g)].map((m) => m[0].length + 1)),
        );
        onApply(fence + language + '\n' + body + '\n' + fence);
      } else if (kind === 'yaml') {
        const keys = props.map(([k]) => k);
        if (new Set(keys).size !== keys.length || keys.some((k) => !k.trim()))
          throw new Error('Özellik adları boş olamaz ve benzersiz olmalı.');
        const copy = yaml.clone();
        for (const item of [...((copy.contents as any)?.items || [])])
          if (!keys.includes(String(item.key?.value))) copy.delete(String(item.key?.value));
        props.forEach(([key, val]) => {
          let value: unknown = val;
          try {
            value = JSON.parse(val);
          } catch {
            /* String value. */
          }
          copy.set(key, value);
        });
        onApply('---\n' + copy.toString() + '---');
      }
    } catch (e: any) {
      setError(e.message);
    }
  }
  return (
    <>
      {' '}
      <Modal
        title={titles[kind] || 'İçeriği düzenle'}
        eyebrow={ui('BELGE ARAÇLARI')}
        onClose={onClose}
        footer={
          <>
            <button
              className="text-button"
              onClick={() => {
                if (!sourceMode) {
                  if (kind === 'alert')
                    setRaw(
                      `> [!${type}]\n` +
                        body
                          .split('\n')
                          .map((line) => '> ' + line)
                          .join('\n'),
                    );
                  else if (kind === 'details')
                    setRaw(
                      `<details${detailsOpen ? ' open' : ''}>\n<summary>${label}</summary>\n\n${body}\n\n</details>`,
                    );
                  else if (kind === 'footnote')
                    setRaw(`[^${label}]: ${body.replace(/\n/g, '\n    ')}`);
                  else if (kind === 'code') setRaw('```' + language + '\n' + body + '\n```');
                }
                setSourceMode(!sourceMode);
              }}
            >
              {sourceMode ? 'Görsel alanlar' : 'Kaynak'}
            </button>
            <span className="spacer" />
            <button className="button" onClick={onClose}>
              {ui('İptal')}
            </button>
            <button className="button primary" onClick={apply}>
              {ui('Uygula')}
            </button>
          </>
        }
      >
        {sourceMode ? (
          <>
            <p className="muted">
              {ui('Özgün kaynak korunur. Değişiklik yalnız bu bloğa uygulanır.')}
            </p>
            <textarea
              className="code-input"
              aria-label={ui('Blok kaynağı')}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
            />
          </>
        ) : (
          <div className="form-stack">
            {['link', 'image'].includes(kind) && (
              <>
                <label>
                  {kind === 'link' ? 'Görünen metin' : 'Alternatif metin'}
                  <input value={label} onChange={(e) => setLabel(e.target.value)} />
                </label>
                <label>
                  {ui('Hedef')}
                  <input
                    placeholder={
                      kind === 'link' ? 'https://… veya #başlık' : 'gorseller/fotograf.png'
                    }
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </label>
                {kind === 'image' && (
                  <p className="muted">
                    {ui(
                      'Yerel görsel eklemek için araç çubuğundaki “Dosyadan görsel” seçeneğini kullanabilirsin.',
                    )}
                  </p>
                )}
              </>
            )}
            {kind === 'alert' && (
              <label>
                {ui('Tür')}
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  {[
                    ['NOTE', 'Not'],
                    ['TIP', 'İpucu'],
                    ['IMPORTANT', 'Önemli'],
                    ['WARNING', 'Uyarı'],
                    ['CAUTION', 'Dikkat'],
                  ].map(([v, l]) => (
                    <option value={v} key={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {['details', 'footnote'].includes(kind) && (
              <label>
                {kind === 'details' ? 'Özet / başlık' : 'Dipnot kimliği'}
                <input value={label} onChange={(e) => setLabel(e.target.value)} />
              </label>
            )}
            {kind === 'code' && (
              <label>
                {ui('Dil')}
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {[
                    'javascript',
                    'typescript',
                    'html',
                    'css',
                    'json',
                    'yaml',
                    'python',
                    'sql',
                    'bash',
                    'powershell',
                    'java',
                    'csharp',
                    'cpp',
                    'rust',
                    'go',
                    'xml',
                    'text',
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            )}
            {kind === 'details' && (
              <label className="setting-toggle">
                <span>Başlangıçta açık göster</span>
                <input
                  type="checkbox"
                  checked={detailsOpen}
                  onChange={(e) => setDetailsOpen(e.target.checked)}
                />
              </label>
            )}
            {['alert', 'details', 'footnote'].includes(kind) && (
              <div className="mini-editor">
                <div className="mini-toolbar">
                  {[
                    ['Kalın', 'toggleBold'],
                    ['İtalik', 'toggleItalic'],
                    ['Liste', 'toggleBulletList'],
                    ['Alıntı', 'toggleBlockquote'],
                  ].map(([label, command]) => (
                    <button
                      key={command}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() =>
                        miniEditor && (miniEditor.chain().focus() as any)[command]().run()
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <Suspense fallback={<p>İçerik hazırlanıyor…</p>}>
                  <MiniEditor
                    source={body}
                    documentId={documentId}
                    onChange={setBody}
                    onReady={setMiniEditor}
                    onBlockEdit={setNested}
                  />
                </Suspense>
              </div>
            )}
            {kind === 'code' && (
              <label>
                {ui('İçerik')}
                <textarea
                  aria-label={ui('Blok içeriği')}
                  rows={7}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </label>
            )}
            {kind === 'yaml' && (
              <>
                <p className="muted">
                  {ui(
                    'Belgenin başında saklanan özellikler. Sayı, doğru/yanlış, liste ve nesne değerleri JSON biçiminde de girilebilir.',
                  )}
                </p>
                {props.map(([key, val], i) => (
                  <div className="property-row" key={i}>
                    <input
                      aria-label={ui('Özellik adı')}
                      placeholder={ui('Özellik')}
                      value={key}
                      onChange={(e) =>
                        setProps(props.map((p, j) => (i === j ? [e.target.value, p[1]] : p)))
                      }
                    />
                    <input
                      aria-label={ui('Özellik değeri')}
                      placeholder={ui('Değer')}
                      value={val}
                      onChange={(e) =>
                        setProps(props.map((p, j) => (i === j ? [p[0], e.target.value] : p)))
                      }
                    />
                    <button
                      aria-label={ui('Özelliği sil')}
                      onClick={() => setProps(props.filter((_, j) => j !== i))}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button className="button" onClick={() => setProps([...props, ['', '']])}>
                  <Plus size={14} />
                  {ui('Özellik ekle')}
                </button>
              </>
            )}
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
      </Modal>
      <Suspense fallback={null}>
        {nested &&
          (['math', 'inlineMath'].includes(nested.kind) ? (
            <NestedMath
              value={nested.value}
              inline={nested.kind === 'inlineMath'}
              onClose={() => setNested(null)}
              onApply={(value) => {
                nested.apply(value);
                setNested(null);
              }}
            />
          ) : nested.kind === 'diagram' ? (
            <NestedDiagram
              value={nested.value}
              onClose={() => setNested(null)}
              onApply={(value) => {
                nested.apply(value);
                setNested(null);
              }}
            />
          ) : (
            <BlockDialog
              kind={nested.kind}
              value={nested.value}
              documentId={documentId}
              onClose={() => setNested(null)}
              onApply={(value) => {
                nested.apply(value);
                setNested(null);
              }}
            />
          ))}
      </Suspense>
    </>
  );
}
