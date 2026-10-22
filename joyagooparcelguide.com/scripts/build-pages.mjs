import fs from 'node:fs';
import './assemble.mjs';
fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist',{recursive:true});
fs.copyFileSync('worker/index.js','dist/_worker.js');
fs.writeFileSync('dist/_routes.json',JSON.stringify({version:1,include:['/*'],exclude:[]}));
console.log('Cloudflare Pages ready: dist/_worker.js');
