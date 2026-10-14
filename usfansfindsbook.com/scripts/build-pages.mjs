import {readFile,writeFile} from 'node:fs/promises';
import {bundledWorker} from './catalog-runtime.mjs';
let worker=await bundledWorker();
worker=worker.replace('const url=new URL(request.url);',`const url=new URL(request.url);
 if(url.hostname==='www.usfansfindsbook.com'){url.hostname='usfansfindsbook.com';url.protocol='https:';return Response.redirect(url.toString(),301);}`);
await writeFile('dist/client/_worker.js',worker);
await writeFile('dist/client/_routes.json',JSON.stringify({version:1,include:['/*'],exclude:[]}));

