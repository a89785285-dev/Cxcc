// Copies the existing web game into Capacitor's webDir without changing gameplay files.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'www');
const items = ['index.html', 'manifest.json', 'service-worker.js', 'css', 'js', 'assets'];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const item of items) {
  const source = path.join(root, item);
  if (!fs.existsSync(source)) {
    throw new Error(`Required project item is missing: ${item}`);
  }
  fs.cpSync(source, path.join(out, item), { recursive: true });
}

console.log('Web build ready:', fs.readdirSync(out).join(', '));
