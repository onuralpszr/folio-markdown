/// <reference lib="webworker" />
self.onmessage = (
  event: MessageEvent<{
    source: string;
    query: string;
    regex: boolean;
    caseSensitive: boolean;
    wholeWord?: boolean;
    replacement?: string;
    targetIndex?: number;
  }>,
) => {
  const { source, query, regex, caseSensitive, wholeWord, targetIndex } = event.data;
  // Plain text replacements must not expand $ patterns such as $$ or $&.
  const replacement = regex
    ? event.data.replacement
    : event.data.replacement?.replaceAll('$', '$$$$');
  try {
    let pattern = regex ? query : query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (wholeWord) pattern = `(?<![\\p{L}\\p{N}_])(?:${pattern})(?![\\p{L}\\p{N}_])`;
    const expression = new RegExp(pattern, caseSensitive ? 'gu' : 'giu');
    const matches: { 0: string; index: number }[] = [];
    for (const m of source.matchAll(expression)) {
      matches.push({ 0: m[0], index: m.index! });
      if (matches.length === 10000) break;
    }
    // Replace only the selected match with a sticky copy so $ patterns match Replace all.
    const at = (offset: number) => {
      const single = new RegExp(pattern, expression.flags.replace('g', '') + 'y');
      single.lastIndex = offset;
      return single;
    };
    const result =
      replacement === undefined
        ? undefined
        : targetIndex === undefined
          ? source.replace(expression, replacement)
          : matches[targetIndex]
            ? source.replace(at(matches[targetIndex].index), replacement)
            : source;
    self.postMessage({ matches, result });
  } catch (e: any) {
    self.postMessage({ matches: [], error: e.message });
  }
};
self.postMessage({ ready: true });
