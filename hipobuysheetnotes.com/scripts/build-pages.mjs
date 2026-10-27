import {catalogFallbackSource} from './catalog-fallbacks.mjs';
import {homeFallbackSource} from './home-fallbacks.mjs';
import fs from 'node:fs';
import {writeCrawlerAssets} from './crawler-assets.mjs';
// Package the standalone production Worker directly, without an unused Astro build.
const template=fs.readFileSync('worker/index.js','utf8');
const page=fs.readFileSync('worker/page.html','utf8').replace('__CLIENT_SCRIPT__',()=>fs.readFileSync('worker/client.js','utf8').replace(/<\/script/gi,'<\\/script'));
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/_worker.js',homeFallbackSource(page,'Hipobuy Sheet Notes')+catalogFallbackSource(page,fs.readFileSync('worker/client.js','utf8'),'Hipobuy Sheet Notes')+template.replace('__PAGE__',()=>JSON.stringify(page)));
fs.writeFileSync('dist/_routes.json',JSON.stringify({version:1,include:['/*'],exclude:[]}));
await writeCrawlerAssets({out:'dist',worker:'dist/_worker.js',origin:'https://hipobuysheetnotes.com'});
console.log('Built production Worker and independent static crawler assets.');

await import('./prepare-indexnow.mjs');
