import fs from 'node:fs';
import './assemble.mjs';
fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist',{recursive:true});
fs.copyFileSync('worker/index.js','dist/_worker.js');
fs.writeFileSync('dist/_routes.json',JSON.stringify({version:1,include:['/*'],exclude:[]}));
console.log('Cloudflare Pages build ready: dist/_worker.js');
import {writeCrawlerAssets} from './crawler-assets.mjs';

await writeCrawlerAssets({out:'dist',worker:'dist/_worker.js',origin:'https://joyagoofindsatlas.com'});

await import('./prepare-indexnow.mjs');

import {writeStaticFallbacks} from "./static-fallbacks.mjs";
await writeStaticFallbacks({"out": "dist", "worker": "dist/_worker.js", "origin": "https://joyagoofindsatlas.com"});
