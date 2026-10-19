import fs from 'node:fs';
import vm from 'node:vm';
const localeFiles=['data.js','content.js','notes.js','retention.js','sheet.js'];
const extraLocales=Object.fromEntries(['nl','sv','da','no','fi','cs','ru','uk','ro','hu','el','tr','ja','ko','ar','he'].map(locale=>[locale,JSON.parse(fs.readFileSync('src/locales/'+locale+'.json','utf8'))]));
const localeExtension='const EXTRA_LOCALES='+JSON.stringify(extraLocales)+';\n'+fs.readFileSync('src/locale-extension.js','utf8');
const faqExtension='const FAQ_DESIGN='+JSON.stringify(JSON.parse(fs.readFileSync('src/faq.json','utf8')))+';\nfor(const [locale,copy]of Object.entries(FAQ_DESIGN)){if(!LOCALES[locale]||copy.items.length!==10||copy.groups.length!==5)throw Error("Invalid FAQ locale");FAQ[locale]=copy.items;UI[locale].faqTitle=copy.title;}';
const beginnerExtension='const BEGINNER='+JSON.stringify(JSON.parse(fs.readFileSync('src/beginner.json','utf8')))+';\n';
const context=vm.createContext({URL,URLSearchParams});for(const file of localeFiles)vm.runInContext(fs.readFileSync('src/'+file,'utf8'),context);vm.runInContext(localeExtension+'\n'+faqExtension+'\n'+beginnerExtension,context);
const titleCode='const TERMS='+JSON.stringify(vm.runInContext('TERMS',context))+';\n'+vm.runInContext('title',context).toString()+';\n';
const snapshot=JSON.parse(fs.readFileSync('fixtures/snapshot.json')),archive=JSON.parse(fs.readFileSync('fixtures/selection-archive.json')),rates=JSON.parse(fs.readFileSync('fixtures/rates.json'));rates.rates.USD=1;
const assets={},references={};
function add(route,file){const b=fs.readFileSync(file),head=b.toString('ascii',0,4),type=head==='RIFF'?'image/webp':b[0]===137?'image/png':head.startsWith('GIF')?'image/gif':'image/jpeg';assets[route]={type,data:b.toString('base64')}}
for(const [route,file]of [['/logo.png','logo.png'],['/favicon.png','favicon.png'],['/reference/0.jpg','qc-studio-1.jpg'],['/reference/1.jpg','qc-studio-0.jpg']])add(route,'fixtures/'+file);
for(const file of fs.readdirSync('fixtures/guide-shots').filter(f=>/\.(png|jpg)$/.test(f)))add('/guide-images/'+file,'fixtures/guide-shots/'+file);
for(const p of [...snapshot,...archive]){if(!/^https:\/\/litbuy\.com\/product\/2\/\d+\?inviteCode=7N6D4Y6EE$/.test(p.buy))throw Error('Invalid affiliate target');add('/cover/'+p.id,'fixtures/image-'+p.id+'.jpg')}
for(const p of snapshot){references[p.id]=p.photos.map((src,i)=>{const route='/reference/'+p.id+'/'+i;add(route,'fixtures/'+(p.referenceDir||'batch-20261014')+'/qc-'+p.id+'-'+i+'.jpg');return route})}
let code='const SNAPSHOT='+JSON.stringify(snapshot)+';\nconst ARCHIVE='+JSON.stringify(archive)+';\nconst REFERENCE_ROUTES='+JSON.stringify(references)+';\nconst RATES='+JSON.stringify(rates)+';\nconst ASSETS='+JSON.stringify(assets)+';\n';
for(const file of ['data.js','content.js','notes.js','retention.js','sheet.js'])code+=fs.readFileSync('src/'+file,'utf8')+'\n';
code+=localeExtension+'\n'+faqExtension+'\n'+beginnerExtension+'\n';
code+='const CSS='+JSON.stringify(fs.readFileSync('src/style.css','utf8'))+';\nconst CLIENT='+JSON.stringify(titleCode+fs.readFileSync('src/client.js','utf8')+'\n'+fs.readFileSync('src/retention-client.js','utf8'))+';\n';
for(const file of ['render.js','beginner.js','server.js'])code+=fs.readFileSync('src/'+file,'utf8')+'\n';
fs.mkdirSync('worker',{recursive:true});fs.writeFileSync('worker/index.js',code);console.log('Assembled QC Notes:',snapshot.length,'new source products,',archive.length,'previous selection items retained for bookmarks,',Object.values(references).flat().length,'local references.');
