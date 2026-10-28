let ready: Promise<(typeof import('mermaid'))['default']> | undefined;
export function getMermaid() {
  return (ready ||= (async () => {
    const { default: mermaid } = await import('mermaid');
    mermaid.initialize({
      maxEdges: 1000,
      maxTextSize: 262144,
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      look: 'classic',
      htmlLabels: false,
      suppressErrorRendering: true,
      fontFamily: 'Inter, sans-serif',
      themeVariables: {
        primaryColor: '#e9efdf',
        primaryTextColor: '#354439',
        primaryBorderColor: '#94a386',
        lineColor: '#9aa58b',
        secondaryColor: '#f4f1e7',
        tertiaryColor: '#f8f7f2',
        fontSize: '14px',
      },
      flowchart: { htmlLabels: false, curve: 'basis' },
    });
    // Mermaid 12.2.0's Sankey CSV lexer incorrectly accepts ASCII labels only.
    // Widen just its two text character classes; standard Mermaid source is unchanged.
    // Covered by real browser parse/render tests with Turkish labels. Version is pinned.
    const diagram = await mermaid.mermaidAPI.getDiagramFromText('sankey-beta\nA,B,1');
    const parser = (diagram as any).getParser();
    const lexer = parser.parser?.lexer || parser.lexer;
    if (!lexer || !lexer.rules[6] || !lexer.rules[8])
      throw new Error('Sankey lexer API changed; compatibility patch needs review.');
    for (const index of [6, 8])
      lexer.rules[index] = new RegExp(
        lexer.rules[index].source.replaceAll('\\u007E', '\\uFFFF'),
        lexer.rules[index].flags,
      );
    return mermaid;
  })());
}
