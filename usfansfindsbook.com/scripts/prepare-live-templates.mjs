import {mkdir,readFile,writeFile,rm} from 'node:fs/promises';
export async function prepareLiveTemplates(){
 const content=JSON.parse(await readFile('content.json','utf8'));
 const cats=['shoes','shirts','clothing','hoodies','pants','belts','bags','perfume','electronics','other'];
 for(const lang of Object.keys(content)){
  const root='dist/client/'+(lang==='en'?'':lang+'/');
  const dest=`dist/client/live-templates/${lang}`;await mkdir(dest,{recursive:true});
  for(const cat of ['all',...cats]){const path=root+(cat==='all'?'spreadsheet':`categories/${cat}`);await writeFile(`${dest}/${cat}.txt`,await readFile(`${path}/index.html`));/* Keep public HTML available when Functions is unavailable. */}
  // Pages still routes live requests through the Worker, while generated HTML
  // survives fail-open fallback. Templates are separate implementation assets.
  // Product HTML remains available to Pages static serving.
 }
}
