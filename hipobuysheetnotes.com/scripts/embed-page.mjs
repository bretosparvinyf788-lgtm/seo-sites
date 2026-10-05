import { readFile, writeFile } from 'node:fs/promises';
const template = await readFile('worker/index.js', 'utf8');
const html = await readFile('worker/page.html', 'utf8');
const client = await readFile('worker/client.js', 'utf8');
const page = html.replace('__CLIENT_SCRIPT__', client.replace(/<\/script/gi, '<\\/script'));
await writeFile('src/lib/site-worker.js', template.replace('__PAGE__', JSON.stringify(page)));
