import fs from 'node:fs';
import './assemble.mjs';
import {writeCrawlerAssets} from './crawler-assets.mjs';
fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist',{recursive:true});
fs.copyFileSync('worker/index.js','dist/_worker.js');
fs.writeFileSync('dist/_routes.json',JSON.stringify({version:1,include:['/*'],exclude:[]}));
await writeCrawlerAssets({out:'dist',worker:'dist/_worker.js',origin:'https://joyagooparcelguide.com'});
console.log('Cloudflare Pages ready: Worker and validated static crawler assets');
