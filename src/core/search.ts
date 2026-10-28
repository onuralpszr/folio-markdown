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
    const expire = (message: string, delay: number) =>
      setTimeout(() => {
        worker.terminate();
        reject(new Error(message));
      }, delay);
    // A cold worker can take seconds to load, so the 500 ms limit starts once it is ready.
    let timer = expire('Arama başlatılamadı.', 15000);
    worker.onmessage = (e) => {
      clearTimeout(timer);
      if (e.data.ready) {
        timer = expire('Arama süre sınırını aştı. Daha basit bir ifade kullanın.', 500);
        return;
      }
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
