import { copyFile } from 'node:fs/promises';

const source = new URL('../dist/server/entry.mjs', import.meta.url);
const target = new URL('../dist/server/index.js', import.meta.url);

await copyFile(source, target);
console.log('Created dist/server/index.js compatibility entry.');
