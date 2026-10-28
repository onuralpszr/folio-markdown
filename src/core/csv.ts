export function parseCSV(text: string, separator = ','): string[][] {
  const rows: string[][] = [],
    row: string[] = [];
  let cell = '',
    quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (quoted || !cell) quoted = !quoted;
      else cell += c;
    } else if (c === separator && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell);
      rows.push([...row]);
      row.length = 0;
      cell = '';
    } else cell += c;
  }
  if (quoted) throw new Error('CSV içinde kapanmamış tırnak var.');
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}
export function stringifyCSV(rows: string[][], separator = ',', safe = true) {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          let s = cell;
          if (safe && /^[=+\-@\t\r]/.test(s)) s = "'" + s;
          return s.includes(separator) || /["\r\n]/.test(s)
            ? '"' + s.replaceAll('"', '""') + '"'
            : s;
        })
        .join(separator),
    )
    .join('\r\n');
}
export function tableMarkdown(rows: string[][]) {
  if (!rows.length) return '';
  const width = Math.max(...rows.map((r) => r.length));
  const line = (row: string[]) =>
    '| ' +
    Array.from({ length: width }, (_, i) =>
      (row[i] || '').replaceAll('\\', '\\\\').replaceAll('|', '\\|').replace(/\r?\n/g, '<br>'),
    ).join(' | ') +
    ' |';
  return [line(rows[0]), line(Array(width).fill('---')), ...rows.slice(1).map(line)].join('\n');
}
