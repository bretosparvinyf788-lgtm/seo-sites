import fs from 'node:fs';
import assert from 'node:assert/strict';
import {visualMatch,rankedVisualResults,titleVisualKind,indexVisualCandidate,resolveVisualQuery} from '../web/visual-core.js';
// Regression vectors captured from public KakobuyMake covers using pinned q8 CLIP and DINOv2.
const samples=JSON.parse(fs.readFileSync(new URL('./fixtures/visual-embeddings.json',import.meta.url)));
const pants=samples.filter(p=>p.cat===4);
for(const query of pants){
 const hits=samples.map(p=>({...p,similarity:visualMatch(query,p,p.title)})).filter(p=>p.similarity!==null);
 assert(hits.every(p=>p.cat===4),'Trousers query must exclude T-shirts and hoodies');
 assert.equal(rankedVisualResults(hits)[0]?.id,query.id,'Identical item must rank first');
 assert.equal(visualMatch(query,{...query,kind:'top',certain:true},'短袖T恤'),null,'Even identical colors/features cannot override category');
 assert.equal(visualMatch(query,{...query,certain:true},'连帽卫衣'),null,'Conflicting product title must be rejected');
}
assert.equal(titleVisualKind('内裤 boxer briefs'),'underwear');
assert.equal(titleVisualKind('男士短裤 shorts'),'pants');
assert.deepEqual(rankedVisualResults([]),[]);
console.log(JSON.stringify({realProductImages:samples.length,trousersQueries:pants.length,crossCategoryResults:0,identicalItemRank:'first',titleConflicts:'rejected'}));

const a=samples.find(p=>p.id==='4581'),b=samples.find(p=>p.id==='4579');
assert.equal(visualMatch(a,b,b.title),null,'Broadly similar shorts with different visual details must be rejected');
assert.equal(visualMatch(a,{...a,detail:undefined},a.title),null,'Missing visual detail must never fall back to broad category matching');
assert(!fs.readFileSync(new URL('../web/visual-search.js',import.meta.url),'utf8').includes('visual-kind'),'No category selector in upload UI');

const {gunzipSync}=await import('node:zlib');
const index=JSON.parse(gunzipSync(fs.readFileSync(new URL('../data/visual-index.json.gz',import.meta.url))));
assert.equal(index.source,'https://kakobuymake.com');
assert.equal(index.version,2);assert(index.total>4500);assert(index.indexed/index.total>.99,'Index must cover at least 99% of source products');
assert.equal(new Set(index.items.map(p=>p[0])).size,index.items.length);
for(const row of index.items){assert(row[3].startsWith('https://kakobuymake.com/uploads/'));const d=indexVisualCandidate(row);assert.equal(d.vector.length,512);assert.equal(d.detail.length,384)}
const query=samples.find(p=>p.id==='4581'),matches=index.items.map(row=>({id:row[0],similarity:visualMatch(query,indexVisualCandidate(row),row[1])})).filter(p=>p.similarity!==null);
assert.equal(rankedVisualResults(matches)[0]?.id,'4581','Indexed nearest match must be the original shorts');
console.log(JSON.stringify({indexed:index.indexed,total:index.total,queryMatches:matches.length,first:rankedVisualResults(matches)[0].id}));

assert(!fs.readFileSync(new URL('../web/visual-search.js',import.meta.url),'utf8').includes('scanVisualBatch'),'Search must use the full index rather than per-cover scanning');
assert(!fs.readFileSync(new URL('../web/visual-engine.js',import.meta.url),'utf8').includes('CLIPTextModel'),'Query must not download a text model');

// Regression: the user's clear pink shoe had text margin .006, so the old .015 gate rejected it.
const shoe=JSON.parse(fs.readFileSync(new URL('./fixtures/uncertain-shoe-query.json',import.meta.url)));
assert.equal(shoe.certain,false);
const resolved=resolveVisualQuery(shoe,index);assert(resolved?.confirmedByImages);assert.equal(resolved.kind,'shoes');
const shoeHits=index.items.filter(row=>row[5]===resolved.kind).map(row=>({id:row[0],kind:row[5],similarity:visualMatch(resolved,indexVisualCandidate(row),row[1])})).filter(p=>p.similarity!==null);
assert.equal(rankedVisualResults(shoeHits)[0]?.id,'4397');assert(shoeHits.every(p=>p.kind==='shoes'));
const vague={...shoe,vector:shoe.vector.map(()=>0),detail:shoe.detail.map(()=>0)};assert.equal(resolveVisualQuery(vague,index),null);
const conflicting={items:[index.items.find(p=>p[0]==='4397'),[...index.items.find(p=>p[0]==='4397')]]};conflicting.items[1][5]='pants';assert.equal(resolveVisualQuery(shoe,conflicting),null,'Ambiguous image neighbours must not select a random category');
console.log(JSON.stringify({uncertainShoe:'recovered',first:rankedVisualResults(shoeHits)[0]?.id,results:shoeHits.length,unrelatedTypes:0,conflictingNeighbours:'rejected'}));

assert(shoeHits.length>1,'Shoe search must return similar footwear as well as the closest item');
assert(shoeHits.some(p=>p.id==='3445'),'Similar basketball shoe listing must pass footwear thresholds');
assert(rankedVisualResults(shoeHits).length>1,'Similar shoe matches must remain visible after ranking');
console.log(JSON.stringify({similarShoeResults:rankedVisualResults(shoeHits).length,closest:rankedVisualResults(shoeHits)[0].id,similarBasketballShoeIncluded:rankedVisualResults(shoeHits).some(p=>p.id==='3445')}));

assert(rankedVisualResults(shoeHits).length>13,'Footwear must include a wider set of similar shoes');
assert(rankedVisualResults(shoeHits).length<=48,'Footwear results remain capped and paginated');

const expanded=[];
for(const kind of ['pants','top','hoodie']){
 const q=samples.find(p=>p.kind===kind&&p.certain);const results=index.items.map(row=>({id:row[0],kind:row[5],similarity:visualMatch(q,indexVisualCandidate(row),row[1])})).filter(p=>p.similarity!==null);const ranked=rankedVisualResults(results);
 assert(ranked.every(p=>p.kind===kind),'Broader search must retain product type');assert(ranked.length>1,'Other categories must also include similar products');assert(ranked.length<=48);assert.equal(ranked[0].id,q.id,'Same item remains first');expanded.push({kind,matches:ranked.length,first:ranked[0].id});
}
console.log(JSON.stringify({expandedCategories:expanded}));
