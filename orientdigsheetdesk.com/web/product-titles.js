// Localized display names are composed from source-backed type, brand/model and attributes.
// They are concise catalog labels, not a word-for-word translation of seller advertising.
const PRODUCT_TITLE_TYPES=[
 ['underwear',/内裤|内衣|文胸|底裤|\b(?:underwear|boxers?|briefs|bra)\b/i],
 ['tracksuits',/运动套装|\btracksuits?\b/i],['sets',/套装|\bsets?\b/i],
 ['shorts',/短裤|中裤|五分裤|\b(?:shorts|sweatshorts)\b/i],['pants',/长裤|裤子|牛仔裤|休闲裤|卫裤|运动裤|\b(?:pants|trousers|jeans|joggers)\b/i],
 ['hoodies',/卫衣|帽衫|连帽衫|\b(?:hoodies?|sweatshirts?)\b/i],['polo-shirts',/polo(?:衫)?/i],['t-shirts',/T恤|\bt[ -]?shirts?\b|\btees?\b/i],['shirts',/衬衫|\bshirts?\b/i],
 ['down-jackets',/羽绒|棉服|棉衣|\b(?:puffer|down jackets?)\b/i],['trench-coats',/风衣|大衣|\b(?:trench coats?|overcoats?)\b/i],['jackets',/夹克|外套|\bjackets?\b/i],['sweaters',/毛衣|针织|\b(?:sweaters?|knitwear|cardigans?)\b/i],['skirts',/裙|\bskirts?\b/i],
 ['belts',/皮带|腰带|\bbelts?\b/i],['bags',/背包|包袋|手袋|钱包|包包|挎包|\b(?:bags?|backpacks?|wallets?)\b/i],['perfume',/香水|\bperfumes?\b/i],
 ['boots',/靴|\bboots?\b/i],['sandals',/拖鞋|凉鞋|\b(?:slippers?|sandals?|slides?)\b/i],['sneakers',/鞋|\b(?:sneakers?|shoes?|trainers?)\b/i],
 ['hats',/帽|\b(?:hats?|caps?|beanies?)\b/i],['watches',/手表|腕表|\bwatches?\b/i],['eyewear',/眼镜|墨镜|\b(?:sunglasses|eyewear)\b/i],['jewelry',/项链|手链|戒指|耳环|\b(?:necklace|bracelet|jewelry|rings?)\b/i],['scarves',/围巾|\b(?:scarves|scarf)\b/i],['headphones',/耳机|\b(?:headphones|earbuds)\b/i],['tops',/服饰|服装|衣服/i]
];
const PRODUCT_TITLE_FEATURES=[/刺绣|\bembroider\w*/i,/印花|印图|\b(?:print\w*|graphic)\b/i,/拉链|\bzip\w*/i,/牛仔|\bdenim\b/i,/纯棉|棉质|\bcotton\b/i,/条纹|\bstrip\w*/i,/格纹|格子|\b(?:checkered|checked|plaid)\b/i,/宽松|\b(?:loose|oversiz\w*)\b/i,/黑色|\bblack\b/i,/白色|\bwhite\b/i,/蓝色|\bblue\b/i,/红色|\bred\b/i,/粉色|粉红|\bpink\b/i,/绿色|\bgreen\b/i,/灰色|\bgr[ae]y\b/i,/篮球|\bbasketball\b/i,/长袖|\blong[ -]sleeve\w*/i,/短袖|\bshort[ -]sleeve\w*/i,/速干|\bquick[ -]dry\w*/i,/针织|\bknit\w*/i];
const PRODUCT_TITLE_FALLBACK=['shoes','t-shirts','tops','hoodies','pants','belts','bags','perfume','electronics','misc'];
const PRODUCT_BRAND_NAMES={'耐克':'Nike','阿迪达斯':'Adidas','新百伦':'New Balance','卡哈特':'Carhartt','始祖鸟':"Arc'teryx",'拉夫劳伦':'Ralph Lauren','斯图西':'Stussy','亚瑟士':'Asics','彪马':'Puma','匡威':'Converse','万斯':'Vans','北面':'The North Face','巴黎世家':'Balenciaga','乔丹':'Jordan','科比':'Kobe'};
function localizedProductTitle(p,language,dictionary){
 const original=String(p.title||'').trim();if(p.translations?.[language])return p.translations[language];
 if(language==='zh')return original;
 const chinese=/[\u3400-\u9fff]/.test(original);if(language==='en'&&!chinese)return original;
 const labels=dictionary.categoryLabels||{},features=dictionary.productTitleFeatures||[];
 const type=PRODUCT_TITLE_TYPES.find(([,pattern])=>pattern.test(original));
 const key=type?.[0]||PRODUCT_TITLE_FALLBACK[p.cat]||'misc';let noun=labels[key]||dictionary.cat?.[p.cat]||labels.misc||'Product';if(key==='sets'&&/T恤|t[ -]?shirts?/i.test(original)&&/短裤|shorts/i.test(original))noun+=' ('+(labels['t-shirts']||'T-Shirts')+' + '+(labels.shorts||'Shorts')+')';
 const attributes=PRODUCT_TITLE_FEATURES.map((pattern,i)=>pattern.test(original)?features[i]:null).filter(Boolean).slice(0,4);
 let identity=original;for(const [cn,en]of Object.entries(PRODUCT_BRAND_NAMES))identity=identity.replaceAll(cn,' '+en+' ');
 for(const [,pattern]of PRODUCT_TITLE_TYPES)identity=identity.replace(new RegExp(pattern.source,'gi'),' ');
 for(const pattern of PRODUCT_TITLE_FEATURES)identity=identity.replace(new RegExp(pattern.source,'gi'),' ');
 identity=identity.replace(/\b(?:high[ -]quality|quality|fashion|fashionable|casual|classic|new|latest|summer|winter|autumn|spring|men'?s?|women'?s?|unisex|styles?|colors?|collection|collections|version|versions|leather|light|dark|drawstring|reversible|with|and|of|for|the|fit|wide|patterned|embellished|texture|set|short|sleeve|long|waterproof)\b/gi,' ');
 identity=identity.replace(/[\u3400-\u9fff]+/g,' ').replace(/\b(?:OMGBUY|OMGBU)\b/gi,' ').replace(/[^A-Za-z0-9&+.'’\- ]/g,' ').replace(/(?:^|\s)[\-+.]+(?=\s|$)/g,' ').replace(/\s+/g,' ').replace(/^[-. ]+|[-. ]+$/g,'').trim();
 if(identity==='product')identity='';
 // Avoid presenting a pile of seller stock markers as a readable name.
 if(identity.length>85)identity=identity.slice(0,85).replace(/\s+\S*$/,'');
 return [identity,noun].filter(Boolean).join(' ')+(attributes.length?' · '+attributes.join(', '):'');
}
