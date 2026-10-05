import { readFile, writeFile, rm, mkdir, cp } from 'node:fs/promises';
// Pages advanced mode needs a Module Worker at the output root.
const handler = await readFile('src/lib/site-worker.js', 'utf8');
await rm('.wrangler/deploy/config.json', { force: true });
await rm('dist/server', { recursive: true, force: true });
await cp('dist/client', 'dist', { recursive: true });
await rm('dist/client', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await writeFile('dist/_worker.js', handler);
await writeFile('dist/_routes.json', JSON.stringify({version:1,include:['/*'],exclude:[]},null,2)+'\n');
console.log('Cloudflare Pages ready: dist/_worker.js');
