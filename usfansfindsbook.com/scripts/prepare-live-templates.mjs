import {mkdir,readFile,writeFile,rm} from 'node:fs/promises';
export async function prepareLiveTemplates(){
 const content=JSON.parse(await readFile('content.json','utf8'));
 const cats=['shoes','shirts','clothing','hoodies','pants','belts','bags','perfume','electronics','other'];
 for(const lang of Object.keys(content)){
  const root='dist/client/'+(lang==='en'?'':lang+'/');
  const dest=`dist/client/live-templates/${lang}`;await mkdir(dest,{recursive:true});
  for(const cat of ['all',...cats]){const path=root+(cat==='all'?'spreadsheet':`categories/${cat}`);await writeFile(`${dest}/${cat}.txt`,await readFile(`${path}/index.html`));await rm(path,{recursive:true,force:true});}
  // Existing asset paths bypass the Worker on native Sites. Keep all product
  // and paginated catalog URLs dynamic; templates remain private implementation assets.
  await rm(root+'products',{recursive:true,force:true});
 }
}
