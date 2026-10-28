import { useT } from '../ui';
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import katex from 'katex';
import { Copy, Expand, ImageOff, LockKeyhole, TriangleAlert } from 'lucide-react';
import { parse, headings } from '../core/markdown';
import { api } from '../platform';
import { HighlightedCode } from './HighlightedCode';

export function safeHTML(html: string) {
  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true, svg: true, mathMl: true },
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'style', 'foreignObject'],
    FORBID_ATTR: ['onload', 'onclick', 'onerror', 'srcset', 'poster', 'background', 'xlink:href'],
    ADD_TAGS: ['math', 'semantics', 'annotation'],
  });
  const template = document.createElement('template');
  template.innerHTML = clean;
  for (const element of template.content.querySelectorAll('*')) {
    if (
      element.hasAttribute('src') &&
      !/^data:image\/(png|jpeg|webp|gif);base64,/i.test(element.getAttribute('src') || '')
    )
      element.removeAttribute('src');
    if (
      element.hasAttribute('style') &&
      /url\s*\(|expression|@import/i.test(element.getAttribute('style') || '')
    )
      element.removeAttribute('style');
    if (
      element.tagName.toLowerCase() === 'image' &&
      !element.getAttribute('href')?.startsWith('data:image/')
    )
      element.removeAttribute('href');
  }
  return template.innerHTML;
}
export function MathView({ value, block = false }: { value: string; block?: boolean }) {
  const ui = useT();

  try {
    if (value.length > 32768) throw new Error('Formula size limit');
    return (
      <span
        className={block ? 'math-display' : 'math-inline'}
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(value, {
            displayMode: block,
            throwOnError: true,
            trust: false,
            maxExpand: 200,
            output: 'htmlAndMathml',
          }),
        }}
      />
    );
  } catch {
    return (
      <span className="formula-error">
        <TriangleAlert size={14} />
        {ui('Geçersiz formül')}
        <code>{value}</code>
      </span>
    );
  }
}
let sequence = 0;
let queue: Promise<unknown> = Promise.resolve();
const diagramCache = new Map<string, { svg: string; id: string }>();
export function sanitizeSVG(source: string) {
  const template = document.createElement('template');
  template.innerHTML = DOMPurify.sanitize(source, {
    USE_PROFILES: { svg: true },
    FORBID_TAGS: ['foreignObject', 'script', 'a', 'image'],
    FORBID_ATTR: ['onclick', 'onload'],
  });
  const cleanCSS = (css: string) =>
    css
      .replace(/@import[^;]+;?/gi, '')
      .replace(/url\s*\(\s*(['"]?)(.*?)\1\s*\)/gi, (match, _quote, target) =>
        target.trim().startsWith('#') ? match : 'none',
      )
      .replace(/expression\s*\([^)]*\)/gi, 'none');
  for (const element of template.content.querySelectorAll('*')) {
    if (element.tagName.toLowerCase() === 'style')
      element.textContent = cleanCSS(element.textContent || '');
    for (const attribute of [...element.attributes]) {
      if (['href', 'xlink:href'].includes(attribute.name) && !attribute.value.startsWith('#'))
        element.removeAttribute(attribute.name);
      else if (attribute.value.includes('url(') || attribute.name === 'style')
        element.setAttribute(attribute.name, cleanCSS(attribute.value));
    }
  }
  return template.innerHTML;
}
export function MermaidView({
  source,
  onEdit,
  compact = false,
}: {
  source: string;
  onEdit?: () => void;
  compact?: boolean;
}) {
  const ui = useT();

  const [svg, setSvg] = useState(''),
    [error, setError] = useState(''),
    [full, setFull] = useState(false);
  useEffect(() => {
    let active = true;
    setError('');
    setSvg('');
    const id = 'diagram-' + ++sequence;
    queue = queue
      .catch(() => {})
      .then(async () => {
        if (!active) return;
        try {
          if (source.length > 262144) throw new Error('Diyagram çizim boyutu sınırını aşıyor.');
          let drawing = diagramCache.get(source);
          if (!drawing) {
            const raw = await api.renderDiagram(source, id);
            drawing = { id, svg: sanitizeSVG(raw) };
            diagramCache.set(source, drawing);
            if (diagramCache.size > 30) diagramCache.delete(diagramCache.keys().next().value!);
          }
          if (active) setSvg(drawing.svg.replaceAll(drawing.id, id));
        } catch (e: any) {
          if (active)
            setError(e.message?.split('\n').slice(0, 3).join('\n') || 'Diyagram çizilemedi.');
        } finally {
          document.getElementById('d' + id)?.remove();
        }
      });
    return () => {
      active = false;
    };
  }, [source]);
  const drawing = <div className="mermaid-drawing" dangerouslySetInnerHTML={{ __html: svg }} />;
  return (
    <div className={`diagram-preview ${compact ? 'compact' : ''}`}>
      {!compact && (
        <div className="diagram-caption">
          <span>
            <span className="tiny-dot" />
            {ui('MERMAID DİYAGRAMI')}
          </span>
          <div>
            {onEdit && <button onClick={onEdit}>{ui('Düzenle')}</button>}
            <button title={ui('Büyüt')} onClick={() => setFull(true)}>
              <Expand size={14} />
            </button>
            <button
              title={ui('Mermaid kopyala')}
              onClick={() => navigator.clipboard.writeText(source)}
            >
              <Copy size={14} />
            </button>
          </div>
        </div>
      )}
      {error ? (
        <div className="render-error">
          <TriangleAlert size={20} />
          <span>
            {ui('Diyagram çizilemedi')}
            <small>{error}</small>
          </span>
        </div>
      ) : svg ? (
        drawing
      ) : (
        <div className="loading-diagram">{ui('Diyagram hazırlanıyor…')}</div>
      )}
      {full && (
        <div className="modal-shade" onClick={() => setFull(false)}>
          <div className="fullscreen-diagram" onClick={(e) => e.stopPropagation()}>
            <button className="button" onClick={() => setFull(false)}>
              {ui('Kapat')}
            </button>
            {drawing}
            <button className="button" onClick={() => api.exportFile('diyagram.svg', svg, 'svg')}>
              {ui('SVG indir')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export function AssetView({
  src,
  alt,
  documentId,
}: {
  src: string;
  alt: string;
  documentId: string;
}) {
  const [url, setUrl] = useState(''),
    [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setUrl('');
    setFailed(false);
    if (src.startsWith('data:image/') && !src.startsWith('data:image/svg')) setUrl(src);
    else
      api
        .asset(documentId, src)
        .then((data) => {
          if (active) {
            if (data.startsWith('data:image/svg')) {
              const clean = sanitizeSVG(
                new TextDecoder().decode(
                  Uint8Array.from(atob(data.split(',')[1]), (c) => c.charCodeAt(0)),
                ),
              );
              setUrl(
                'data:image/svg+xml;base64,' +
                  btoa(
                    Array.from(new TextEncoder().encode(clean), (c) => String.fromCharCode(c)).join(
                      '',
                    ),
                  ),
              );
            } else setUrl(data);
          }
        })
        .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, [src, documentId]);
  return url ? (
    <img src={url} alt={alt} />
  ) : (
    <span className="missing-asset">
      {failed ? <ImageOff size={18} /> : <LockKeyhole size={18} />} {alt || src}
      <small>
        {/^https?:/.test(src)
          ? 'Uzak görsel gizliliğiniz için yüklenmedi'
          : 'Görsel yüklenemedi veya erişim izni gerekiyor'}
      </small>
    </span>
  );
}
export function Preview({
  source,
  documentId,
  onDiagramEdit,
}: {
  source: string;
  documentId: string;
  onDiagramEdit?: (source: string, offset: number, end: number) => void;
}) {
  const ui = useT();

  const openLink = (url: string) => {
    const task = /^(https?|mailto):/i.test(url) ? api.external(url) : api.navigate(documentId, url);
    void task.catch((error) =>
      window.dispatchEvent(new CustomEvent('folio-notify', { detail: error.message })),
    );
  };
  const tree = parse(source),
    hs = headings(source);
  let hi = 0;
  const footnotes = tree.children.filter((n: any) => n.type === 'footnoteDefinition');
  const definitions = Object.fromEntries(
    tree.children.filter((n: any) => n.type === 'definition').map((n: any) => [n.identifier, n]),
  );
  const render = (n: any, i: number): React.ReactNode => {
    const c = () => n.children?.map(render);
    const key = `${n.type}-${n.position?.start.offset ?? i}`;
    switch (n.type) {
      case 'text':
        return n.value;
      case 'paragraph':
        return (
          <p key={key} data-offset={n.position?.start.offset}>
            {c()}
          </p>
        );
      case 'heading':
        return React.createElement(
          'h' + n.depth,
          { key, id: hs[hi++]?.id, 'data-offset': n.position.start.offset },
          c(),
        );
      case 'strong':
        return <strong key={key}>{c()}</strong>;
      case 'emphasis':
        return <em key={key}>{c()}</em>;
      case 'delete':
        return <s key={key}>{c()}</s>;
      case 'inlineCode':
        return <code key={key}>{n.value}</code>;
      case 'break':
        return <br key={key} />;
      case 'thematicBreak':
        return <hr key={key} data-offset={n.position?.start.offset} />;
      case 'link':
        return (
          <a
            key={key}
            href={n.url}
            title={n.title}
            onClick={(e) => {
              if (!n.url.startsWith('#')) {
                e.preventDefault();
                openLink(n.url);
              }
            }}
          >
            {c()}
          </a>
        );
      case 'linkReference': {
        const d = definitions[n.identifier];
        return (
          <a
            key={key}
            href={d?.url || '#'}
            onClick={(e) => {
              e.preventDefault();
              if (d) openLink(d.url);
            }}
          >
            {c()}
          </a>
        );
      }
      case 'image':
        return <AssetView key={key} src={n.url} alt={n.alt || ''} documentId={documentId} />;
      case 'inlineMath':
        return <MathView key={key} value={n.value} />;
      case 'math':
        return (
          <div key={key} className="formula-block" data-offset={n.position?.start.offset}>
            <MathView value={n.value} block />
          </div>
        );
      case 'code':
        return n.lang === 'mermaid' ? (
          <MermaidView
            key={key}
            source={n.value}
            onEdit={
              onDiagramEdit
                ? () => onDiagramEdit(n.value, n.position.start.offset, n.position.end.offset)
                : undefined
            }
          />
        ) : (
          <div className="code-wrap" key={key} data-offset={n.position?.start.offset}>
            <div className="code-label">
              {n.lang || 'plain text'}
              <button
                aria-label={ui('Kodu kopyala')}
                onClick={() => navigator.clipboard.writeText(n.value)}
              >
                <Copy size={13} />
              </button>
            </div>
            <pre>
              <HighlightedCode value={n.value} language={n.lang} />
            </pre>
          </div>
        );
      case 'blockquote': {
        const first = n.children?.[0]?.children?.[0];
        const match = first?.value?.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/);
        if (match) {
          const copy = structuredClone(n);
          copy.children[0].children[0].value = first.value.slice(match[0].length);
          return (
            <aside
              className={`callout ${match[1].toLowerCase()}`}
              key={key}
              data-offset={n.position?.start.offset}
            >
              <strong>
                {
                  (
                    {
                      NOTE: 'Not',
                      TIP: 'İpucu',
                      IMPORTANT: 'Önemli',
                      WARNING: 'Uyarı',
                      CAUTION: 'Dikkat',
                    } as any
                  )[match[1]]
                }
              </strong>
              {copy.children.map(render)}
            </aside>
          );
        }
        return (
          <blockquote key={key} data-offset={n.position?.start.offset}>
            {c()}
          </blockquote>
        );
      }
      case 'list':
        return n.ordered ? (
          <ol key={key} start={n.start} data-offset={n.position?.start.offset}>
            {c()}
          </ol>
        ) : (
          <ul
            key={key}
            data-offset={n.position?.start.offset}
            className={n.children.some((x: any) => x.checked !== null) ? 'task-list' : ''}
          >
            {c()}
          </ul>
        );
      case 'listItem':
        return (
          <li key={key}>
            {typeof n.checked === 'boolean' && (
              <input aria-label={ui('Görev durumu')} type="checkbox" checked={n.checked} readOnly />
            )}
            {c()}
          </li>
        );
      case 'table':
        return (
          <div className="table-scroll" key={key} data-offset={n.position?.start.offset}>
            <table>
              <thead>
                <tr>
                  {n.children[0].children.map((cell: any, j: number) => (
                    <th key={j} style={{ textAlign: n.align[j] || undefined }}>
                      {cell.children.map(render)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {n.children.slice(1).map((row: any, j: number) => (
                  <tr key={j}>
                    {row.children.map((cell: any, k: number) => (
                      <td key={k} style={{ textAlign: n.align[k] || undefined }}>
                        {cell.children.map(render)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'footnoteReference':
        return (
          <sup key={key}>
            <a href={'#fn-' + n.identifier}>
              {ui('[')}
              {n.label || n.identifier}
              {ui(']')}
            </a>
          </sup>
        );
      case 'footnoteDefinition':
      case 'definition':
      case 'yaml':
        return null;
      case 'html': {
        const details = n.value.match(
          /^<details\b([^>]*)>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>\s*([\s\S]*?)<\/details>\s*$/i,
        );
        if (details)
          return (
            <details
              key={key}
              className="document-details"
              data-offset={n.position?.start.offset}
              open={/\bopen\b/i.test(details[1])}
            >
              <summary>{details[2].replace(/<[^>]*>/g, '')}</summary>
              <Preview source={details[3]} documentId={documentId} />
            </details>
          );
        return (
          <div
            className="safe-html"
            key={key}
            dangerouslySetInnerHTML={{ __html: safeHTML(n.value) }}
          />
        );
      }
      default:
        return <span key={key}>{c?.() || n.value}</span>;
    }
  };
  return (
    <div className="markdown-body">
      {tree.children.map(render)}
      {footnotes.length > 0 && (
        <section className="footnotes">
          <hr />
          {footnotes.map((n: any) => (
            <div id={'fn-' + n.identifier} key={n.identifier}>
              <sup>{n.label || n.identifier}</sup>
              {n.children.map(render)}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
