import sharp from 'sharp';
import fs from 'node:fs/promises';
await fs.mkdir('build/Folio.iconset', { recursive: true });
for (const size of [16, 32, 128, 256, 512]) {
  await sharp('build/icon.svg')
    .resize(size, size)
    .png()
    .toFile(`build/Folio.iconset/icon_${size}x${size}.png`);
  await sharp('build/icon.svg')
    .resize(size * 2, size * 2)
    .png()
    .toFile(`build/Folio.iconset/icon_${size}x${size}@2x.png`);
}
await sharp('build/icon.svg').resize(1024, 1024).png().toFile('build/icon.png');
// PNG-compressed ICO images are supported by current Windows icon loaders.
const images = await Promise.all(
  [16, 32, 48, 64, 128, 256].map((size) =>
    sharp('build/icon.svg').resize(size, size).png().toBuffer(),
  ),
);
const header = Buffer.alloc(6 + images.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((image, i) => {
  const size = [16, 32, 48, 64, 128, 256][i],
    position = 6 + i * 16;
  header[position] = size === 256 ? 0 : size;
  header[position + 1] = size === 256 ? 0 : size;
  header.writeUInt16LE(1, position + 4);
  header.writeUInt16LE(32, position + 6);
  header.writeUInt32LE(image.length, position + 8);
  header.writeUInt32LE(offset, position + 12);
  offset += image.length;
});
await fs.writeFile('build/icon.ico', Buffer.concat([header, ...images]));
