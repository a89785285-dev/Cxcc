// Generate Android/PWA PNG icons from the checked-in vector source.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const source = path.join(root, 'resources', 'icon.svg');
const resources = path.join(root, 'resources');
const icons = path.join(root, 'assets', 'icons');

async function main() {
  if (!fs.existsSync(source)) throw new Error('Missing resources/icon.svg');
  fs.mkdirSync(resources, { recursive: true });
  fs.mkdirSync(icons, { recursive: true });

  const svg = fs.readFileSync(source);
  await sharp(svg).resize(1024, 1024).png().toFile(path.join(resources, 'icon.png'));
  await sharp(svg).resize(192, 192).png().toFile(path.join(icons, 'icon-192.png'));
  await sharp(svg).resize(512, 512).png().toFile(path.join(icons, 'icon-512.png'));
  // The artwork stays inside the maskable safe area.
  await sharp(svg).resize(512, 512).png().toFile(path.join(icons, 'icon-maskable-512.png'));
  console.log('Generated Android and PWA icons.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
