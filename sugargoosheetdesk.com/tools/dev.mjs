import http from 'node:http';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {statSync} from 'node:fs';
const run=promisify(execFile);
globalThis.fetch=async(url,opts={})=>{const {stdout}=await run('curl',['--fail','-s','-L','--max-time','20',String(url)],{encoding:'buffer',maxBuffer:20*1024*1024});return new Response(stdout,{status:200});};
const ix=process.argv.indexOf('--port');const port=Number(ix>=0?process.argv[ix+1]:process.env.PORT||3000);
let stamp,app;
http.createServer(async(req,res)=>{try{if(req.url.startsWith('/__qa-mobile')){res.writeHead(200,{'content-type':'text/html'});const u=new URL(req.url,'http://local'),path=u.searchParams.get('path')||'/';res.end('<!doctype html><style>body{margin:0;background:#ddd}iframe{border:0;display:block;margin:16px auto;width:390px;height:844px}</style><iframe id=mobile src="'+path+'"></iframe>');return;}const now=statSync(new URL('../worker/index.js',import.meta.url)).mtimeMs;if(stamp!==now){app=(await import('../worker/index.js?v='+now)).default;stamp=now}const out=await app.fetch(new Request('http://'+req.headers.host+req.url,{method:req.method}),{},{});res.writeHead(out.status,Object.fromEntries(out.headers));res.end(Buffer.from(await out.arrayBuffer()));}catch(e){console.error(e);res.writeHead(500);res.end('Preview error');}}).listen(port,'0.0.0.0',()=>console.log('Sheetdesk preview on '+port));
