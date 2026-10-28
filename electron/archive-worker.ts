import { parentPort, workerData } from 'node:worker_threads';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { inside } from './files.js';
import { readArchive } from './archive.js';
async function main() {
  const { file, destination } = workerData as { file: string; destination?: string };
  const info = await fs.stat(file);
  if (info.size > 100 * 1024 * 1024)
    throw new Error('ZIP dosyası 100 MiB sıkıştırılmış boyut sınırını aşıyor.');
  const { data, list, total } = readArchive(new Uint8Array(await fs.readFile(file)), !!destination);
  if (destination) {
    const root = await fs.realpath(destination);
    for (const [name, contents] of Object.entries(data)) {
      const target = path.resolve(root, name.replaceAll('\\', '/'));
      if (!inside(root, target)) throw new Error('ACCESS_DENIED');
      await fs.mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
      if (!inside(root, await fs.realpath(path.dirname(target)))) throw new Error('ACCESS_DENIED');
      await fs.writeFile(target, contents, { flag: 'wx', mode: 0o600 });
    }
  }
  parentPort!.postMessage({ list, total });
}
void main().catch((error) => parentPort!.postMessage({ error: error.message }));
