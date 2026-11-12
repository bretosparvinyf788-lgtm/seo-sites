import assert from 'node:assert/strict';
import fs from 'node:fs';
import app from '../worker/index.js';
const catalog=JSON.parse(fs.readFileSync('tools/catalog-full.json','utf8'));
const data=JSON.parse(fs.readFileSync('tools/main-qc.json','utf8'));
const assets=JSON.parse(fs.readFileSync('tools/assets.json','utf8'));
const items=Object.values(catalog).flatMap(c=>c.items),aids=new Set(items.map(p=>p.aid));
assert.equal(aids.size,items.length);assert.deepEqual(new Set(Object.keys(data.items)),aids);
assert(!Object.values(data.items).some(p=>p.status==='error'),'all main-site listings must be checked successfully');
globalThis.fetch=async()=>{throw Error('Source offline during complete snapshot verification');};
let photos=0,withQc=0,missing=0;
for(const aid of [...aids,'7894400057']){
 const mainAid=aid==='7894400057'?'4232':aid,p=data.items[mainAid];
 assert(p,'every route has a corresponding main-site entry');
 const response=await app.fetch(new Request('https://desk.test/product/'+aid),{},{});assert.equal(response.status,200,aid);
 const html=await response.text();assert(!html.includes('undefined'),'complete rendered data for '+aid);
 const actual=[...(html.split('<div class="qc-grid">')[1]?.split('</div>')[0]||'').matchAll(/<img src="([^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&'));
 const expected=p.qc.map(u=>assets[u]?'/asset/'+assets[u].key:'/image?url='+encodeURIComponent(u));
 assert.deepEqual(actual,expected,'exact main-site QC correspondence for '+aid);
 assert(!html.includes('款式不完全匹配')&&!html.includes('could not be reliably matched'));
 for(const u of p.qc){const url=new URL(u);assert.equal(url.origin,'https://kakobuymake.com');assert(url.pathname.startsWith('/uploads/'));}
 if(aid!=='7894400057'){photos+=p.qc.length;if(p.qc.length)withQc++;else missing++;}
}
console.log(JSON.stringify({checked:items.length,withQc,sourceWithoutQc:missing,totalQcImages:photos,sampleMainAid:'4232',allRenderedMappingsVerified:true}));
