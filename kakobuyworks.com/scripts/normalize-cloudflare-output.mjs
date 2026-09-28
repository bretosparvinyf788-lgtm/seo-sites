import { cp, copyFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const dist = new URL('../dist/', import.meta.url);
const client = new URL('../dist/client/', import.meta.url);
const serverEntry = new URL('../dist/server/entry.mjs', import.meta.url);
const compatibilityEntry = new URL('../dist/server/index.js', import.meta.url);
const pagesWorker = new URL('../dist/_worker.js', import.meta.url);

// Astro 7 emits a Workers-style server directory. Cloudflare Pages advanced
// mode instead expects one module Worker named `_worker.js` in the configured
// output directory, with public assets beside it.
await build({
  entryPoints: [fileURLToPath(serverEntry)],
  outfile: fileURLToPath(pagesWorker),
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  conditions: ['workerd', 'worker', 'browser'],
  external: ['cloudflare:workers'],
  target: 'es2022'
});

for (const entry of await readdir(client, { withFileTypes: true })) {
  await cp(new URL(entry.name, client), new URL(entry.name, dist), {
    recursive: entry.isDirectory(),
    force: true
  });
}

await copyFile(serverEntry, compatibilityEntry);
console.log('Created Cloudflare Pages advanced-mode worker and promoted client assets.');
