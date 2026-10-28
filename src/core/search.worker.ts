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
    let index = 0;
    const result =
      replacement === undefined
        ? undefined
        : targetIndex === undefined
          ? source.replace(expression, replacement)
          : source.replace(expression, (...args) => {
              const match = args[0],
                named = typeof args.at(-1) === 'object',
                offset = args.at(named ? -3 : -2) as number;
              if (index++ !== targetIndex) return match;
              return replacement.replace(/\$(\$|&|`|'|\d{1,2})/g, (token, k) =>
                k === '$'
                  ? '$'
                  : k === '&'
                    ? match
                    : k === '`'
                      ? source.slice(0, offset)
                      : k === "'"
                        ? source.slice(offset + match.length)
                        : typeof args[+k] === 'string'
                          ? args[+k]
                          : token,
              );
            });
    self.postMessage({ matches, result });
  } catch (e: any) {
    self.postMessage({ matches: [], error: e.message });
  }
};
