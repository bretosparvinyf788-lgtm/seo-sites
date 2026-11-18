// Shared by the UI and the inference worker. Source category IDs are KakobuyMake IDs.
export const VISUAL_KINDS=[
 {id:'pants',category:'6',label:'Pants / shorts',prompts:['a product photo of trousers or jeans','a product photo of shorts or sweatpants']},
 {id:'top',category:'3',label:'T-shirts / shirts',prompts:['a product photo of a t-shirt','a product photo of a shirt or polo shirt']},
 {id:'hoodie',category:'5',label:'Hoodies / sweatshirts',prompts:['a product photo of a hoodie','a product photo of a sweatshirt']},
 {id:'outerwear',category:'4',label:'Jackets / coats',prompts:['a product photo of a jacket or coat','a product photo of a down jacket']},
 {id:'shoes',category:'2',label:'Shoes / slippers',prompts:['a product photo of sneakers or shoes','a product photo of slippers or sandals']},
 {id:'belt',category:'7',label:'Belts',prompts:['a product photo of a leather belt']},
 {id:'bag',category:'8',label:'Bags',prompts:['a product photo of a handbag or backpack']},
 {id:'perfume',category:'9',label:'Perfume',prompts:['a product photo of a perfume bottle']},
 {id:'electronics',category:'10',label:'Electronics',prompts:['a product photo of headphones or earbuds','a product photo of electronic devices']},
 {id:'underwear',category:'6',label:'Underwear',prompts:['a product photo of underwear or boxer briefs']},
 {id:'accessories',category:'11',label:'Accessories',prompts:['a product photo of a hat or cap','a product photo of a watch or jewelry','a product photo of socks']},
 {id:'unknown',category:null,label:'Other / unclear',prompts:['a photo of a person wearing a complete outfit','a photo of a landscape, food, furniture or an unrelated object']}
];
export function normalized(v){const n=Math.hypot(...v);if(!n||!Number.isFinite(n))throw Error('invalid-embedding');return Array.from(v,x=>x/n)}
export function cosine(a,b){return a.reduce((sum,v,i)=>sum+v*b[i],0)}
export function classifyVisual(vector,prototypes){const scored=VISUAL_KINDS.map(k=>({id:k.id,score:Math.max(...prototypes.filter(p=>p.kind===k.id).map(p=>cosine(vector,p.vector)))})).sort((a,b)=>b.score-a.score);const best=scored[0],margin=best.score-scored[1].score;return {kind:best.id,confidence:best.score,margin,certain:best.id!=='unknown'&&best.score>=.20&&margin>=.015}}
export function titleVisualKind(title){const s=title.toLowerCase();if(/内裤|底裤|underwear|boxer/.test(s))return 'underwear';if(/卫衣|连帽衫|hoodie|sweatshirt/.test(s))return 'hoodie';if(/短裤|长裤|牛仔裤|休闲裤|运动裤|裤子|\b(jeans|trousers|pants|shorts)\b/.test(s))return 'pants';if(/腰带|皮带|\bbelt\b/.test(s))return 'belt';if(/香水|perfume/.test(s))return 'perfume';if(/衬衫|短袖|t恤|t-shirt|\btshirt\b|\bpolo\b/.test(s))return 'top';if(/夹克|外套|羽绒|大衣|\b(jacket|coat)\b/.test(s))return 'outerwear';return null}
export function visualMatch(query,candidate,title){if(!query.kind||candidate.kind!==query.kind)return null;const titled=titleVisualKind(title);if(titled&&titled!==query.kind)return null;if(!query.detail||!candidate.detail)return null;const semantic=cosine(query.vector,candidate.vector),detail=cosine(query.detail,candidate.detail);if(semantic<.70||detail<.65||(!candidate.certain&&detail<.94&&!(semantic>=.90&&detail>=.88)))return null;return detail*.7+semantic*.3}
export function rankedVisualResults(results){if(!results.length)return [];const sorted=[...results].sort((a,b)=>b.similarity-a.similarity),floor=Math.max(.665,sorted[0].similarity-.30);return sorted.filter(p=>p.similarity>=floor).slice(0,48)}

export function indexVisualCandidate(row){const unpack=value=>{const bytes=Uint8Array.from(atob(value),c=>c.charCodeAt(0));return normalized(new Int8Array(bytes.buffer))};return {kind:row[5],certain:row[6],vector:unpack(row[7]),detail:unpack(row[8])}}

// A low text-label margin must not discard an otherwise strong image match.
// Resolve ambiguous categories from independent image neighbours, requiring a clear lead across types.
export function resolveVisualQuery(query,index){
 if(query.certain)return query;
 if(!query.detail||!query.vector)return null;
 const bestByKind=new Map();
 for(const row of index.items){if(row[5]==='unknown')continue;const candidate=indexVisualCandidate(row),semantic=cosine(query.vector,candidate.vector),detail=cosine(query.detail,candidate.detail);if(semantic<.88||detail<.86)continue;const score=.7*detail+.3*semantic;if(score>(bestByKind.get(candidate.kind)||0))bestByKind.set(candidate.kind,score)}
 const ranked=[...bestByKind].sort((a,b)=>b[1]-a[1]);
 if(!ranked.length||ranked[0][1]<.89||ranked.length>1&&ranked[0][1]-ranked[1][1]<.06)return null;
 return {...query,kind:ranked[0][0],certain:true,confirmedByImages:true};
}
