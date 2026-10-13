import {cp,rm,writeFile,readdir,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
await rm('cloudflare-output',{recursive:true,force:true});
await cp('dist/client','cloudflare-output',{recursive:true});
await cp('dist/server','cloudflare-output/_worker.js',{recursive:true});
await rm('cloudflare-output/_worker.js/wrangler.json',{force:true});
await rm('cloudflare-output/_worker.js/vinext-externals.json',{force:true});
await writeFile('cloudflare-output/_routes.json',JSON.stringify({version:1,include:['/*'],exclude:['/sitemap.xml','/robots.txt','/_next/*','/guide-platform/*','/favicon.png','/favicon.svg','/usfans-logo.webp']},null,2));
const hashes={};
for(const root of ['app','lib','components','public','vendor','worker.ts','vite.config.ts','next.config.ts','postcss.config.mjs','package.json']) await hashFiles(root);
await writeFile('cloudflare-output/source-hashes.json',JSON.stringify(hashes,null,2));
async function hashFiles(name){let entries;try{entries=await readdir(name,{withFileTypes:true});}catch{hashes[name]=createHash('sha256').update(await readFile(name)).digest('hex');return;}for(const entry of entries){if(entry.isDirectory())await hashFiles(path.join(name,entry.name));else hashes[path.join(name,entry.name)]=createHash('sha256').update(await readFile(path.join(name,entry.name))).digest('hex');}}
console.log('Prepared Pages advanced-mode Worker and static assets.');
