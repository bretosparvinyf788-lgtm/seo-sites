import {readFile,writeFile} from 'node:fs/promises';
const products=JSON.parse(await readFile('catalog.json','utf8'));
let worker=await readFile('worker.js','utf8');
worker=worker.replace("import {productIds} from './product-ids.js';",`const productIds=${JSON.stringify(products.map(p=>p.id))};`);
worker=worker.replace('const url=new URL(request.url);',`const url=new URL(request.url);
 if(url.hostname==='www.usfansfindsbook.com'){url.hostname='usfansfindsbook.com';url.protocol='https:';return Response.redirect(url.toString(),301);}`);
await writeFile('dist/client/_worker.js',worker);
await writeFile('dist/client/_routes.json',JSON.stringify({version:1,include:['/*'],exclude:[]}));
