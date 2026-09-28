const ALLOWED_LANGUAGES=new Set(["de","es","fr","it","pl","pt","ro","sv","nl","da","fi","el","cs","hu","bg","sk","hr","sl","lt","lv","et","ga","mt","zh"]);

function json(payload,status=200){
 return new Response(JSON.stringify(payload),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"}})
}
function groupsFor(items){
 const groups=[];let current=[],size=0;
 items.forEach(item=>{const next=item.text.length+12;if(current.length&&(current.length>=18||size+next>2400)){groups.push(current);current=[];size=0}current.push(item);size+=next});
 if(current.length)groups.push(current);return groups
}
function translatedText(result){return String(result?.translated_text||result?.response||"").trim()}
async function translateGroup(env,group,target){
 const numbered=group.map((item,index)=>"["+index+"] "+item.text).join("\n"),result=await env.AI.run("@cf/meta/m2m100-1.2b",{text:numbered,source_lang:"en",target_lang:target}),output=translatedText(result),found=new Map();
 for(const match of output.matchAll(/\[(\d+)\]\s*([\s\S]*?)(?=\s*\[\d+\]\s*|$)/g))found.set(Number(match[1]),match[2].trim());
 if(group.every((_,index)=>found.get(index)))return group.map((item,index)=>({index:item.index,text:found.get(index)}));
 return Promise.all(group.map(async item=>{const one=await env.AI.run("@cf/meta/m2m100-1.2b",{text:item.text,source_lang:"en",target_lang:target});return{index:item.index,text:translatedText(one)}}))
}

export async function onRequestGet(context){return json({ok:true,service:"native-site-translation",ai:Boolean(context.env.AI)})}

export async function onRequestPost(context){
 const origin=context.request.headers.get("origin");if(origin){try{const host=new URL(origin).hostname;if(host!=="kakobuyfins.pro"&&!host.endsWith(".kakobuyfins-pro.pages.dev"))return json({error:"Origin not allowed"},403)}catch{return json({error:"Invalid origin"},403)}}
 if(!context.env.AI)return json({error:"Translation service unavailable"},503);
 let body;try{body=await context.request.json()}catch{return json({error:"Invalid JSON"},400)}
 const target=String(body?.target||"").toLowerCase()==="zh-cn"?"zh":String(body?.target||"").toLowerCase();if(!ALLOWED_LANGUAGES.has(target))return json({error:"Unsupported target language"},400);
 if(!Array.isArray(body?.texts)||!body.texts.length||body.texts.length>80)return json({error:"Provide 1 to 80 text items"},400);
 const texts=body.texts.map(value=>String(value||"").trim());if(texts.some(text=>!text||text.length>1600)||texts.reduce((sum,text)=>sum+text.length,0)>16000)return json({error:"Translation payload is too large"},413);
 try{const output=new Array(texts.length),groups=groupsFor(texts.map((text,index)=>({text,index})));const translated=await Promise.all(groups.map(group=>translateGroup(context.env,group,target)));translated.flat().forEach(item=>{output[item.index]=item.text});return json({target,translations:output})}catch(error){return json({error:"Translation failed",detail:String(error?.message||error).slice(0,180)},502)}
}
