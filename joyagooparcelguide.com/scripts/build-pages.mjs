import fs from 'node:fs';
import './assemble.mjs';
const {default:worker}=await import('../worker/index.js');
fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist',{recursive:true});
fs.copyFileSync('worker/index.js','dist/_worker.js');
for(const path of ['/robots.txt','/sitemap.xml']){
 const response=await worker.fetch(new Request('https://joyagooparcelguide.com'+path),{},{});
 if(!response.ok)throw new Error('Cannot build crawler file: '+path);
 fs.writeFileSync('dist'+path,await response.text());
}
fs.writeFileSync('dist/_routes.json',JSON.stringify({version:1,include:['/*'],exclude:['/robots.txt','/sitemap.xml']}));
fs.writeFileSync('dist/_headers','/robots.txt\n  Content-Type: text/plain; charset=utf-8\n  Cache-Control: public, max-age=300\n/sitemap.xml\n  Content-Type: application/xml; charset=utf-8\n  Cache-Control: public, max-age=300\n');
console.log('Cloudflare Pages ready: Worker, static robots.txt and sitemap.xml');
