// Product data remains in the catalog. D1 stores only each visitor's selections.
import {productIds} from './product-ids.js';
import {serveLivePage,serveSavedProducts,validProductId,getLiveProduct} from './source-catalog.js';
const validIds=new Set(productIds);
const cookieName='__Host-findsbook';
function json(body,status=200,cookie){const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};if(cookie)headers['Set-Cookie']=cookie;return new Response(JSON.stringify(body),{status,headers})}
async function visitor(request){const value=request.headers.get('Cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1);const token=/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(value||'')?value:crypto.randomUUID();const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));return {key:Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join(''),cookie:value===token?undefined:`${cookieName}=${token}; Path=/; Max-Age=15552000; HttpOnly; Secure; SameSite=Lax`}}
async function readList(db,key){const {results}=await db.prepare('SELECT product, saved_at, viewed_at FROM visitor_finds WHERE visitor = ?').bind(key).all();const rows=results.filter(r=>validProductId(r.product));return {saved:rows.filter(r=>r.saved_at!==null).sort((a,b)=>b.saved_at-a.saved_at).slice(0,60).map(r=>r.product),recent:rows.filter(r=>r.viewed_at!==null).sort((a,b)=>b.viewed_at-a.viewed_at).slice(0,12).map(r=>r.product)}}
export default {async fetch(request,env,ctx){
 const url=new URL(request.url);
 if(url.pathname==='/api/products')return serveSavedProducts(request,ctx);
 const live=await serveLivePage(request,env,ctx);if(live)return live;
 if(url.pathname!=='/api/finds')return env.ASSETS.fetch(request);
 if(!['GET','POST'].includes(request.method))return json({error:'Method not allowed'},405);
 if(request.headers.get('Sec-Fetch-Site')==='cross-site')return json({error:'Forbidden'},403);
 if(request.method==='POST'&&request.headers.get('Origin')!==url.origin)return json({error:'Forbidden'},403);
 try{
  const {key,cookie}=await visitor(request);
  if(request.method==='POST'){
   if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'JSON required'},415);
   // Small bounded request body; never buffer an unlimited stream.
   const reader=request.body?.getReader();if(!reader)return json({error:'Missing body'},400);let size=0,parts=[];
   for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>1024){await reader.cancel();return json({error:'Body too large'},413)}parts.push(value)}
   const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length}
   let data;try{data=JSON.parse(new TextDecoder().decode(bytes))}catch{return json({error:'Invalid JSON'},400)}
   if(!data||!['save','unsave','view','clear-recent'].includes(data.action))return json({error:'Invalid action'},400);
   if(data.action!=='clear-recent'){
    if(!validProductId(data.id))return json({error:'Unknown product'},400);
    if(data.action!=='unsave'&&!validIds.has(data.id))try{await getLiveProduct(data.id,ctx)}catch{return json({error:'Product unavailable'},503)}
   }
   const at=Date.now();
   if(data.action==='save')await env.DB.prepare('INSERT INTO visitor_finds (visitor, product, saved_at) VALUES (?, ?, ?) ON CONFLICT(visitor, product) DO UPDATE SET saved_at = excluded.saved_at').bind(key,data.id,at).run();
   if(data.action==='view')await env.DB.prepare('INSERT INTO visitor_finds (visitor, product, viewed_at) VALUES (?, ?, ?) ON CONFLICT(visitor, product) DO UPDATE SET viewed_at = excluded.viewed_at').bind(key,data.id,at).run();
   if(data.action==='unsave')await env.DB.batch([env.DB.prepare('UPDATE visitor_finds SET saved_at = NULL WHERE visitor = ? AND product = ?').bind(key,data.id),env.DB.prepare('DELETE FROM visitor_finds WHERE visitor = ? AND saved_at IS NULL AND viewed_at IS NULL').bind(key)]);
   if(data.action==='clear-recent')await env.DB.batch([env.DB.prepare('UPDATE visitor_finds SET viewed_at = NULL WHERE visitor = ?').bind(key),env.DB.prepare('DELETE FROM visitor_finds WHERE visitor = ? AND saved_at IS NULL AND viewed_at IS NULL').bind(key)]);
  }
  return json(await readList(env.DB,key),200,cookie);
 }catch(error){console.error(JSON.stringify({event:'finds_list_error',message:error instanceof Error?error.message:'unknown'}));return json({error:'List unavailable'},503)}
}};
