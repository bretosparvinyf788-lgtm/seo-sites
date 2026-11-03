import { cp, rm, mkdir, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true});
await build({entryPoints:['worker.mjs'],outfile:'dist/_worker.js',bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true});
await writeFile('dist/_routes.json',JSON.stringify({version:1,include:['/*'],exclude:[]}));
await writeFile('dist/_headers','/guide/*\n  Cache-Control: public, max-age=86400\n/qc-repairs/*\n  Cache-Control: public, max-age=86400\n/favicon*\n  Cache-Control: public, max-age=86400\n');
console.log('Built Cloudflare Pages application in dist/');
