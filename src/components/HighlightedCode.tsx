import React from 'react';
import { common, createLowlight } from 'lowlight';
const lowlight = createLowlight(common);
export function HighlightedCode({ value, language }: { value: string; language?: string }) {
  try {
    const tree =
      language && lowlight.registered(language) ? lowlight.highlight(language, value) : null;
    const node = (n: any, i: number): React.ReactNode =>
      n.type === 'text'
        ? n.value
        : React.createElement(
            n.tagName || 'span',
            { key: i, className: n.properties?.className?.join(' ') },
            n.children?.map(node),
          );
    return <code>{tree ? tree.children.map(node) : value}</code>;
  } catch {
    return <code>{value}</code>;
  }
}
