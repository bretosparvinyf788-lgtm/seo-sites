import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['scripts/assemble.mjs'],{stdio:'inherit'});
const out='dist';fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
let code=fs.readFileSync('worker/index.js','utf8');
const begin=code.indexOf('const ASSETS=')+'const ASSETS='.length,end=code.indexOf(';\n',begin);
if(begin<13||end<begin)throw Error('Asset manifest not found');
const assets=JSON.parse(code.slice(begin,end)),metadata={};let headers='';
for(const [route,asset]of Object.entries(assets)){
 const dest=path.join(out,route.slice(1));fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,Buffer.from(asset.data,'base64'));metadata[route]={type:asset.type};
 headers+=route+'\n  Content-Type: '+asset.type+'\n  Cache-Control: public, max-age=86400\n  X-Content-Type-Options: nosniff\n\n';
}
code=code.slice(0,begin)+JSON.stringify(metadata)+code.slice(end);
fs.writeFileSync(out+'/_worker.js',code);fs.writeFileSync(out+'/_headers',headers);
fs.writeFileSync(out+'/_routes.json',JSON.stringify({version:1,include:['/*'],exclude:['/cover/*','/reference/*','/guide-images/*','/logo.png','/favicon.png']}));
console.log('Cloudflare Pages:',Object.keys(assets).length,'original static assets; worker',Buffer.byteLength(code),'bytes.');
import {writeCrawlerAssets} from './crawler-assets.mjs';

await writeCrawlerAssets({out:'dist',worker:'dist/_worker.js',origin:'https://litbuyqcnotes.com'});

await import('./prepare-indexnow.mjs');
