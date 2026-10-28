import { useEffect, useRef } from 'react';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { basicSetup } from 'codemirror';
import { indentWithTab } from '@codemirror/commands';

export function SourceEditor({
  value,
  onChange,
  dark,
  onView,
  onScroll,
}: {
  value: string;
  onChange: (s: string) => void;
  dark: boolean;
  onView?: (v: EditorView) => void;
  onScroll?: (offset: number) => void;
}) {
  const container = useRef<HTMLDivElement>(null),
    view = useRef<EditorView | null>(null),
    callback = useRef(onChange),
    scrollCallback = useRef(onScroll);
  callback.current = onChange;
  scrollCallback.current = onScroll;
  useEffect(() => {
    if (!container.current) return;
    const instance = new EditorView({
      parent: container.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          markdown(),
          keymap.of([indentWithTab]),
          EditorView.lineWrapping,
          EditorView.theme(
            {
              '&': {
                height: '100%',
                fontSize: '13px',
                backgroundColor: dark ? '#222620' : '#fdfcf9',
              },
              '.cm-scroller': {
                overflow: 'auto',
                fontFamily: '"SFMono-Regular", Consolas, monospace',
                lineHeight: '1.8',
              },
              '.cm-content': { padding: '28px 20px' },
              '.cm-gutters': {
                background: dark ? '#222620' : '#f7f6f2',
                border: 'none',
                color: '#aaa99f',
              },
              '&.cm-focused': { outline: 'none' },
              '.cm-activeLine': { backgroundColor: '#8392750b' },
            },
            { dark },
          ),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) callback.current(update.state.doc.toString());
          }),
        ],
      }),
    });
    const scroll = () =>
      scrollCallback.current?.(instance.lineBlockAtHeight(instance.scrollDOM.scrollTop).from);
    instance.scrollDOM.addEventListener('scroll', scroll);
    view.current = instance;
    onView?.(instance);
    return () => {
      instance.scrollDOM.removeEventListener('scroll', scroll);
      instance.destroy();
      view.current = null;
    };
  }, [dark]);
  useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value)
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
  }, [value]);
  return <div className="source-editor" ref={container} />;
}
