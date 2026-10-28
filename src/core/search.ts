export type Match = { 0: string; index: number };
export function searchDocument(
  source: string,
  query: string,
  regex: boolean,
  caseSensitive: boolean,
  replacement?: string,
  wholeWord = false,
  targetIndex?: number,
): Promise<{ matches: Match[]; result?: string }> {
  if (!query) return Promise.resolve({ matches: [] });
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./search.worker.ts', import.meta.url), { type: 'module' });
    const timer = setTimeout(() => {
      worker.terminate();
      reject(new Error('Arama süre sınırını aştı. Daha basit bir ifade kullanın.'));
    }, 500);
    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker.terminate();
      if (e.data.error) reject(new Error('Geçersiz arama ifadesi: ' + e.data.error));
      else resolve(e.data);
    };
    worker.onerror = () => {
      clearTimeout(timer);
      worker.terminate();
      reject(new Error('Arama tamamlanamadı.'));
    };
    worker.postMessage({
      source,
      query,
      regex,
      caseSensitive,
      replacement,
      wholeWord,
      targetIndex,
    });
  });
}
