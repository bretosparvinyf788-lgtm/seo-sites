import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const outputs={
  'hipobuysheetnotes.com':'dist','hipobuyqcnotes.com':'dist',
  'litbuysheetbook.com':'dist','litbuyqcnotes.com':'dist',
  'joyagoofindsatlas.com':'dist','joyagooparcelguide.com':'dist',
  'usfansparcelguide.com':'cloudflare-output','usfansfindsbook.com':'dist/client'
};
let total=0;
for(const [domain,out] of Object.entries(outputs)){
  const root=path.resolve(domain,out),sitemap=await fs.readFile(path.join(root,'sitemap.xml'),'utf8');
  const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1].replaceAll('&amp;','&')));
  const paths=new Set(urls.map(u=>u.pathname));
  assert(paths.size>=10,domain+' core routes');
  for(const pathname of paths){
    const html=await fs.readFile(path.join(root,pathname.replace(/^\//,'').replace(/\/$/,'')||'.','index.html'),'utf8');
    assert.match(html,/<h1[\s>]/i,domain+pathname+' H1');
    assert.match(html,/rel=["']canonical["']/i,domain+pathname+' canonical');
    assert(!/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html),domain+pathname+' public robots');
    const canonical=html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1];
    assert(canonical?.startsWith('https://'+domain+'/'),domain+pathname+' production canonical');
    total++;
  }
  const routes=JSON.parse(await fs.readFile(path.join(root,'_routes.json'),'utf8'));
  assert(routes.exclude.includes('/*.css'),domain+' CSS bypasses Functions');
  assert(routes.exclude.includes('/*.js'),domain+' JS bypasses Functions');
  assert(!routes.exclude.includes('/*'),domain+' live API routing remains active');
  console.log(domain+': '+paths.size+' sitemap paths have indexable static HTML');
}
console.log('PASS '+total+' static fallback checks across eight sites.');
