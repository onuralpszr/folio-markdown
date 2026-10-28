import DOMPurify from 'dompurify';
import katex from 'katex';

export function mathML(latex: string, display: boolean) {
  const html = katex.renderToString(latex, {
    displayMode: display,
    output: 'mathml',
    throwOnError: true,
    trust: false,
    maxExpand: 200,
  });
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const math = parsed.querySelector('math');
  if (!math) throw new Error('MathML üretilemedi.');
  math.setAttribute('xmlns', 'http://www.w3.org/1998/Math/MathML');
  return math.outerHTML;
}

export function mathSVG(latex: string, display: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./math-svg.worker.ts', import.meta.url), { type: 'module' });
    const finish = (error?: Error, svg?: string) => {
      clearTimeout(timer);
      worker.terminate();
      if (error) reject(error);
      else resolve(svg!);
    };
    const timer = setTimeout(() => finish(new Error('Formül 5 saniyede çizilemedi.')), 5000);
    worker.onerror = () => finish(new Error('Formül çizimi başarısız oldu.'));
    worker.onmessage = ({ data }: MessageEvent<{ svg?: string; error?: string }>) => {
      if (data.error || !data.svg) return finish(new Error(data.error || 'Çizim üretilemedi.'));
      const svg = DOMPurify.sanitize(data.svg, {
        USE_PROFILES: { svg: true, svgFilters: true },
        FORBID_TAGS: ['script', 'foreignObject', 'a', 'image'],
        ADD_TAGS: ['use'],
        ADD_ATTR: ['xlink:href'],
      });
      const parsed = new DOMParser().parseFromString(svg, 'image/svg+xml');
      for (const element of parsed.querySelectorAll('[href], [xlink\\:href]')) {
        for (const attr of ['href', 'xlink:href']) {
          const reference = element.getAttribute(attr);
          if (reference && !/^#[\w:.-]+$/.test(reference)) element.removeAttribute(attr);
        }
      }
      finish(undefined, new XMLSerializer().serializeToString(parsed.documentElement));
    };
    worker.postMessage({ latex, display });
  });
}

export async function mathPNG(svg: string, scale = 2, transparent = false): Promise<string> {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const width = Math.ceil(image.naturalWidth * scale),
      height = Math.ceil(image.naturalHeight * scale);
    if (width > 16384 || height > 16384 || width * height > 32_000_000)
      throw new Error('PNG için formül çok büyük. SVG kullanın.');
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, width);
    canvas.height = Math.max(1, height);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Görsel üretilemedi.');
    if (!transparent) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, width, height);
    }
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL('image/png').split(',')[1];
  } finally {
    URL.revokeObjectURL(url);
  }
}
