import fs from 'node:fs';
import vm from 'node:vm';
const data=fs.readFileSync('src/data.js','utf8');
const context=vm.createContext({URL,URLSearchParams});
vm.runInContext(data+';this.parseCatalog=parseCatalog;this.parseDetail=parseDetail;this.title=title;',context);
const content=fs.readFileSync('src/content.js','utf8')+'\n'+fs.readFileSync('src/locales.js','utf8')+'\n'+fs.readFileSync('src/experience.js','utf8')+'\n'+fs.readFileSync('src/studio.js','utf8')+'\n'+fs.readFileSync('src/beginner.js','utf8')+'\n'+fs.readFileSync('src/site-faq.js','utf8');
vm.runInContext(content,context);
const selected=['2944','2939','2936','2935','2934','2933','2932','2931','2930','2929'];
const products=selected.map(id=>context.parseDetail(fs.readFileSync('fixtures/'+id+'.html','utf8'),id));
for(const p of products)if(!p.buy||!p.itemId)throw Error('Missing purchase link '+p.id);
let rates=JSON.parse(fs.readFileSync('fixtures/rates.json','utf8'));if(rates.base!=='USD'||!rates.date||!rates.rates.EUR)throw Error('Invalid rates');rates.rates.USD=1;
let assets={};for(const [route,file] of [['/logo.png','fixtures/logo.png'],['/favicon.png','fixtures/favicon.png']])assets[route]={type:'image/png',data:fs.readFileSync(file).toString('base64')};
for(const p of products){const path='fixtures/image-'+p.id+'.jpg';if(fs.existsSync(path))assets['/cover/'+p.id]={type:fs.readFileSync(path).toString('ascii',0,4)==='RIFF'?'image/webp':'image/jpeg',data:fs.readFileSync(path).toString('base64')};}
// These two unmodified images are the front/back reference photos for source item 2932.
for(const n of [0,1])assets['/reference/stussy-'+n+'.jpg']={type:'image/jpeg',data:fs.readFileSync('fixtures/qc-studio-'+n+'.jpg').toString('base64')};
for(const file of fs.readdirSync('fixtures/guide-shots').filter(f=>/\.(png|jpg)$/.test(f)))assets['/guide-shots/'+file]={type:file.endsWith('.png')?'image/png':'image/jpeg',data:fs.readFileSync('fixtures/guide-shots/'+file).toString('base64')};
const constants='const SNAPSHOT='+JSON.stringify(products)+';\nconst RATES='+JSON.stringify(rates)+';\nconst ASSETS='+JSON.stringify(assets)+';\n';
fs.writeFileSync('worker/index.js',constants+data+'\n'+content+'\nconst CSS='+JSON.stringify(fs.readFileSync('src/style.css','utf8'))+';\nconst CLIENT='+JSON.stringify('const TERMS='+JSON.stringify(vm.runInContext('TERMS',context))+';\n'+context.title.toString()+';\n'+fs.readFileSync('src/client.js','utf8'))+';\n'+fs.readFileSync('src/render.js','utf8')+'\n'+fs.readFileSync('src/server.js','utf8'));
fs.writeFileSync('fixtures/snapshot.json',JSON.stringify(products,null,2));
console.log('Assembled',products.length,'verified products, rate date',rates.date);
