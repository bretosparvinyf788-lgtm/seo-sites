import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const {origin,key,output}=JSON.parse(fs.readFileSync(path.join(root,'indexnow.json'),'utf8'));
const xml=fs.readFileSync(path.join(root,output,'sitemap.xml'),'utf8');
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('&apos;',"'");
if(!/<urlset\b/.test(xml))throw new Error('Expected a URL sitemap');
const urlList=[...new Set([...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(m=>decode(m[1].trim())))];
if(!urlList.length||urlList.some(value=>{const u=new URL(value);return u.origin!==origin||u.username||u.password||u.hash;}))throw new Error('Invalid or cross-host sitemap URL');
if(!process.argv.includes('--submit')){console.log(JSON.stringify({host:new URL(origin).hostname,urls:urlList.length,mode:'dry-run'}));process.exit(0);}
const headers={'user-agent':'Mozilla/5.0 (compatible; IndexNowSubmission/1.0)'};
const keyLocation=origin+'/'+key+'.txt';
const proof=await fetch(keyLocation,{headers,signal:AbortSignal.timeout(30000)});
if(!proof.ok||(await proof.text()).trim()!==key)throw new Error('Live IndexNow ownership file not verified');
for(let offset=0;offset<urlList.length;offset+=10000){
 const batch=urlList.slice(offset,offset+10000);
 const response=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{...headers,'content-type':'application/json; charset=utf-8'},body:JSON.stringify({host:new URL(origin).hostname,key,keyLocation,urlList:batch}),signal:AbortSignal.timeout(30000)});
 if(![200,202].includes(response.status))throw new Error('IndexNow submission failed: '+response.status+' '+await response.text());
 console.log(JSON.stringify({host:new URL(origin).hostname,urls:batch.length,status:response.status,message:response.status===202?'received; ownership validation pending':'received'}));
}
