import fs from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
await fs.mkdir('release', { recursive: true });
const lock = JSON.parse(await fs.readFile('package-lock.json', 'utf8'));
const packages = Object.entries(lock.packages)
  .filter(([name]) => name)
  .map(([location, item]) => {
    const name = item.name || location.split('node_modules/').at(-1);
    return {
      type: 'library',
      name,
      version: item.version,
      'bom-ref': `${name}@${item.version}:${location}`,
      properties: [
        { name: 'npm:development', value: String(!!item.dev) },
        { name: 'npm:license', value: String(item.license || 'See package license') },
        { name: 'npm:location', value: location },
      ],
      ...(item.integrity?.startsWith('sha512-')
        ? {
            hashes: [
              {
                alg: 'SHA-512',
                content: Buffer.from(item.integrity.slice(7), 'base64').toString('hex'),
              },
            ],
          }
        : {}),
    };
  });
await fs.writeFile(
  'release/sbom.json',
  JSON.stringify(
    {
      bomFormat: 'CycloneDX',
      specVersion: '1.6',
      serialNumber: `urn:uuid:${randomUUID()}`,
      version: 1,
      metadata: {
        timestamp: new Date().toISOString(),
        component: { type: 'application', name: 'Folio', version: lock.version },
      },
      components: packages,
    },
    null,
    2,
  ),
);
const licenses = [];
for (const [location, item] of Object.entries(lock.packages)) {
  if (!location) continue;
  const files = await fs.readdir(location).catch(() => []),
    filename = files.find((file) => /^(?:licen[sc]e|copying|ofl)(?:\.[\w-]+)?$/i.test(file));
  licenses.push(
    `\n${'='.repeat(72)}\n${item.name || location.split('node_modules/').at(-1)} ${item.version} — ${item.license || 'See below'}\n${'='.repeat(72)}\n${filename ? await fs.readFile(location + '/' + filename, 'utf8') : 'Refer to the dependency package for its complete license.'}`,
  );
}
await fs.writeFile('release/THIRD_PARTY_LICENSES.txt', licenses.join('\n'));
await fs.mkdir('build', { recursive: true });
await fs.writeFile('build/THIRD_PARTY_LICENSES.txt', licenses.join('\n'));
const files = (await fs.readdir('release')).filter(
  (file) =>
    /\.(dmg|zip|exe|AppImage|deb|json|txt|yml|blockmap)$/.test(file) &&
    file !== 'builder-debug.yml',
);
const checksums = [];
for (const file of files)
  checksums.push(
    `${createHash('sha256')
      .update(await fs.readFile('release/' + file))
      .digest('hex')}  ${file}`,
  );
await fs.writeFile('release/SHA256SUMS', checksums.join('\n') + '\n');
