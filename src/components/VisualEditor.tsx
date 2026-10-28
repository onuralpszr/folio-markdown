import { useT } from '../ui';
import { createContext, useContext, useEffect, useRef } from 'react';
import {
  useEditor,
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from '@tiptap/react';
import { Node, Extension, type Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Pencil, ShieldCheck } from 'lucide-react';
import { bindLedger, project, serialize, type Ledger } from '../core/markdown';
import { AssetView, MathView, MermaidView, Preview } from './Preview';

export type BlockEdit = { kind: string; value: string; apply: (value: string) => void };
const requestEdit = (detail: BlockEdit) =>
  window.dispatchEvent(new CustomEvent('folio-edit-block', { detail }));
const BlockEditContext = createContext<(detail: BlockEdit) => void>(requestEdit);
let currentDocumentId = '';
function SpecialView({ node, updateAttributes }: NodeViewProps) {
  const request = useContext(BlockEditContext);
  const ui = useT();

  const { kind, value } = node.attrs;
  const edit = () => request({ kind, value, apply: (value) => updateAttributes({ value }) });
  return (
    <NodeViewWrapper className={`special-node special-${kind}`} contentEditable={false}>
      {kind === 'diagram' ? (
        <MermaidView source={value} onEdit={edit} />
      ) : kind === 'math' ? (
        <div className="editable-formula" onDoubleClick={edit}>
          <MathView value={value} block />
          <button className="node-edit" aria-label={ui('Formülü düzenle')} onClick={edit}>
            <Pencil size={13} />
          </button>
        </div>
      ) : (
        <div className="special-card">
          <div className="special-label">
            <span>
              <ShieldCheck size={14} />
              {(
                {
                  yaml: 'Belge özellikleri',
                  footnote: 'Dipnot',
                  protected: 'Korunan içerik',
                  alert: 'Bilgi kutusu',
                  details: 'Açılır bölüm',
                } as any
              )[kind] || kind}
            </span>
            <button onClick={edit}>
              <Pencil size={13} />
              {ui('Düzenle')}
            </button>
          </div>
          {kind === 'yaml' ? (
            <pre>{value.replace(/^---\r?\n|\r?\n---$/g, '')}</pre>
          ) : kind === 'protected' ? (
            <pre>{value}</pre>
          ) : (
            <Preview source={value} documentId={currentDocumentId} />
          )}
        </div>
      )}
    </NodeViewWrapper>
  );
}
const Special = Node.create({
  name: 'specialBlock',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes: () => ({ kind: { default: 'protected' }, value: { default: '' } }),
  parseHTML: () => [{ tag: 'div[data-special]' }],
  renderHTML: ({ node }) => ['div', { 'data-special': node.attrs.kind }, node.attrs.value],
  addNodeView: () => ReactNodeViewRenderer(SpecialView),
});
function InlineFormulaView({ node, updateAttributes }: NodeViewProps) {
  const request = useContext(BlockEditContext);
  return (
    <NodeViewWrapper
      as="span"
      className="inline-formula-edit"
      contentEditable={false}
      onDoubleClick={() =>
        request({
          kind: 'inlineMath',
          value: node.attrs.value,
          apply: (value) => updateAttributes({ value }),
        })
      }
    >
      <MathView value={node.attrs.value} />
    </NodeViewWrapper>
  );
}
const InlineFormula = Node.create({
  name: 'formulaInline',
  inline: true,
  group: 'inline',
  atom: true,
  addAttributes: () => ({ value: { default: '' } }),
  parseHTML: () => [{ tag: 'span[data-formula]' }],
  renderHTML: ({ node }) => ['span', { 'data-formula': true }, node.attrs.value],
  addNodeView: () => ReactNodeViewRenderer(InlineFormulaView, { as: 'span' }),
});
function InlineAssetView({ node }: NodeViewProps) {
  return (
    <NodeViewWrapper as="span" contentEditable={false}>
      <AssetView src={node.attrs.src} alt={node.attrs.alt} documentId={currentDocumentId} />
    </NodeViewWrapper>
  );
}
const InlineAsset = Node.create({
  name: 'inlineAsset',
  inline: true,
  group: 'inline',
  atom: true,
  addAttributes: () => ({ src: { default: '' }, alt: { default: '' }, title: { default: null } }),
  parseHTML: () => [
    {
      tag: 'img',
      getAttrs: (el) => ({
        src: (el as HTMLElement).getAttribute('src'),
        alt: (el as HTMLElement).getAttribute('alt'),
      }),
    },
  ],
  renderHTML: ({ node }) => ['img', node.attrs],
  addNodeView: () => ReactNodeViewRenderer(InlineAssetView, { as: 'span' }),
});
const SourceInline = Node.create({
  name: 'sourceInline',
  inline: true,
  group: 'inline',
  atom: true,
  addAttributes: () => ({ value: { default: '' } }),
  parseHTML: () => [{ tag: 'span[data-source-inline]' }],
  renderHTML: ({ node }) => [
    'span',
    { 'data-source-inline': true, class: 'source-inline' },
    node.attrs.value,
  ],
});
const Origins = Extension.create({
  name: 'sourceOrigins',
  addGlobalAttributes: () => [
    {
      types: [
        'paragraph',
        'heading',
        'blockquote',
        'bulletList',
        'orderedList',
        'taskList',
        'codeBlock',
        'horizontalRule',
        'table',
        'specialBlock',
      ],
      attributes: { origin: { default: null, rendered: false } },
    },
  ],
});
const cellAttributes = {
  align: {
    default: null,
    parseHTML: (element: HTMLElement) => element.style.textAlign || null,
    renderHTML: (attributes: any) =>
      attributes.align ? { style: `text-align: ${attributes.align}` } : {},
  },
};
const AlignedCell = TableCell.extend({
  addAttributes() {
    return { ...this.parent?.(), ...cellAttributes };
  },
});
const AlignedHeader = TableHeader.extend({
  addAttributes() {
    return { ...this.parent?.(), ...cellAttributes };
  },
});
const MixedTaskList = TaskList.extend({ content: '(taskItem | listItem)+' });
const lowlight = createLowlight(common);

export function VisualEditor({
  source,
  documentId,
  onChange,
  onReady,
  onBlockEdit,
}: {
  source: string;
  documentId: string;
  onChange: (source: string) => void;
  onReady: (editor: Editor) => void;
  onBlockEdit?: (detail: BlockEdit) => void;
}) {
  const initial = useRef(project(source)),
    ledger = useRef<Ledger>(initial.current.ledger),
    last = useRef(source),
    change = useRef(onChange);
  change.current = onChange;
  currentDocumentId = documentId;
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          codeBlock: false,
          link: { openOnClick: false, autolink: false },
          underline: false,
        }),
        CodeBlockLowlight.configure({ lowlight }),
        Table.configure({ resizable: true }),
        TableRow,
        AlignedHeader,
        AlignedCell,
        MixedTaskList,
        TaskItem.configure({ nested: true }),
        Special,
        InlineFormula,
        InlineAsset,
        SourceInline,
        Origins,
      ],
      content: initial.current.doc,
      editorProps: {
        attributes: {
          class: 'markdown-body visual-document',
          'aria-label': 'Görsel belge düzenleyici',
          spellcheck: 'true',
        },
        handleDOMEvents: {
          dblclick: (_view, event) => {
            const target = event.target as HTMLElement;
            if (target.closest('a')) {
              event.preventDefault();
              return true;
            }
            return false;
          },
        },
      },
      onCreate: ({ editor }) => {
        bindLedger(editor.getJSON(), ledger.current);
        onReady(editor);
      },
      onUpdate: ({ editor }) => {
        const next = serialize(editor.getJSON(), ledger.current);
        last.current = next;
        change.current(next);
      },
      onSelectionUpdate: ({ editor }) => onReady(editor),
    },
    [],
  );
  useEffect(() => {
    if (!editor || source === last.current) return;
    const next = project(source);
    ledger.current = next.ledger;
    const task = setTimeout(() => {
      if (editor.isDestroyed) return;
      editor.commands.setContent(next.doc, { emitUpdate: false });
      bindLedger(editor.getJSON(), ledger.current);
      last.current = source;
    }, 0);
    return () => clearTimeout(task);
  }, [source, editor]);
  return (
    <BlockEditContext.Provider value={onBlockEdit || requestEdit}>
      <EditorContent editor={editor} />
    </BlockEditContext.Provider>
  );
}
