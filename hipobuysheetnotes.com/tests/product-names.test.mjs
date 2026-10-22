import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const client=fs.readFileSync('worker/client.js','utf8');
const block=client.slice(client.indexOf('  const productTypeTranslations='),client.indexOf('\n  }',client.indexOf('  function productName'))+5);
for(const lang of ['en','fr','de','zh','es','it','pt','pl','da','no','sv','ko']){
 const name=vm.runInNewContext(block+';productName',{state:{lang},baseLang:()=>lang});
 const source={id:'3146',title:'DJ-jump2-跨境热销cortiez刺绣工装休闲短裤'};
 const value=name(source);assert.ok(value.includes('3146'));assert.ok(value.toLowerCase().includes('cortiez'));
 if(lang==='en')assert.ok(!/[\u3400-\u9fff]/.test(value));
 assert.equal(source.title,'DJ-jump2-跨境热销cortiez刺绣工装休闲短裤');
 assert.equal(name({...source,titles:{[lang]:'Reviewed display name'}}),'Reviewed display name');
}
console.log('PASS: 12 display languages, source preservation, stable product IDs and curated title priority.');
