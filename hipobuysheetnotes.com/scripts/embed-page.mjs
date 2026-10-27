import { readFile, writeFile } from 'node:fs/promises';
import {homeFallbackSource} from './home-fallbacks.mjs';
import {catalogFallbackSource} from './catalog-fallbacks.mjs';
const template = await readFile('worker/index.js', 'utf8');
const html = await readFile('worker/page.html', 'utf8');
const client = await readFile('worker/client.js', 'utf8');
const page = html.replace('__CLIENT_SCRIPT__', () => client.replace(/<\/script/gi, '<\\/script'));
await writeFile('src/lib/site-worker.js', homeFallbackSource(page,'Hipobuy Sheet Notes')+catalogFallbackSource(page,client,'Hipobuy Sheet Notes')+template.replace('__PAGE__', () => JSON.stringify(page)));
