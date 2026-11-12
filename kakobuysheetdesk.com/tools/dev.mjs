import http from 'node:http';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile);
globalThis.fetch=async(url,opts={})=>{const {stdout}=await run('curl',['-s','-L','--max-time','25',String(url)],{encoding:'buffer',maxBuffer:20*1024*1024}); return new Response(stdout,{status:200});};
import app from '../worker/index.js';
const port=Number(process.argv[process.argv.indexOf('--port')+1]||process.env.PORT||3000);
http.createServer(async(req,res)=>{try{if(req.url.startsWith('/__qa-mobile')){res.writeHead(200,{'content-type':'text/html'});res.end('<!doctype html><style>body{margin:0;background:#ddd}iframe{border:0;display:block;margin:16px auto;width:390px;height:844px}</style><iframe id=mobile src="/?lang='+new URL(req.url,'http://local').searchParams.get('lang')+'"></iframe>');return;}const url='http://'+req.headers.host+req.url;const out=await app.fetch(new Request(url,{method:req.method}),{},{});res.writeHead(out.status,Object.fromEntries(out.headers));res.end(Buffer.from(await out.arrayBuffer()));}catch(e){console.error(e);res.writeHead(500);res.end('Preview error');}}).listen(port,'0.0.0.0',()=>console.log('Sheetdesk preview on '+port));
