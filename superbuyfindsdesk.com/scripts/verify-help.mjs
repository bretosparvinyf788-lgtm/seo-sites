import assert from 'node:assert/strict';
import fs from 'node:fs';
import {LANGS} from '../src/content.js';
import {HELP,getHelpContent} from '../src/help-locales.js';
assert.equal(Object.keys(HELP).length,24);
for(const [language] of LANGS){
 const h=getHelpContent(language);
 assert.equal(h.steps.length,10,language+' guide steps');assert.equal(h.faq.length,12,language+' FAQs');assert.equal(h.groups.length,3,language+' groups');assert.equal(h.meta.length,8,language+' supporting labels');
 const strings=[...h.meta,...h.groups,...h.steps.flat(),...h.faq.flat()];
 for(const value of strings)assert.equal(typeof value,'string');
 assert(strings.every(value=>value.trim().length>0),language+' missing copy');
 assert(new Set(h.faq.map(([question])=>question)).size===12,language+' duplicate questions');
 h.faq.forEach(([question,answer])=>{assert(answer.split(/\n\n+/).length>=2,language+' detailed paragraphs: '+question);assert(answer.length>=150,language+' short answer: '+question)});
 assert(h.faq[8][1].includes('8dcUtX')&&h.faq[8][1].includes('EOEwZz'),language+' referral codes changed');
 if(language!=='en'){
  h.steps.forEach((step,i)=>step.forEach((value,j)=>assert.notEqual(value,HELP.en.steps[i][j],language+' untranslated guide '+i)));
  h.faq.forEach((entry,i)=>entry.forEach((value,j)=>assert.notEqual(value,HELP.en.faq[i][j],language+' untranslated FAQ '+i)));
  h.groups.forEach((value,i)=>assert.notEqual(value,HELP.en.groups[i],language+' untranslated group'));
 }
}
assert.throws(()=>getHelpContent('missing'),/Missing help translation/);
const app=fs.readFileSync('src/app.js','utf8');assert(app.includes('getHelpContent(lang)'));assert(!app.includes('zh()?f[3]:f[1]'));assert(!app.includes('zh()?s[3]:s[0]'));
const worker=(await import('../worker/index.js')).default;
const response=await worker.fetch(new Request('https://qa.invalid/help-locales.js'),{},{});assert.equal(response.status,200);const module=await response.text();assert(module.includes("from '/content.js?v="));const js=await(await worker.fetch(new Request('https://qa.invalid/app.js'),{},{})).text();assert(js.includes("from '/help-locales.js?v="));
console.log('Verified 24 complete help locales: 240 guide steps, 288 question/answer pairs, 72 FAQ category labels, all supporting copy and versioned delivery.');
