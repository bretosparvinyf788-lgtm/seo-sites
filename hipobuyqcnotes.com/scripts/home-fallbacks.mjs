// Render crawlable home content from the same translated dictionaries as the UI.
export function homeFallbackSource(page,siteName){
 const data=JSON.parse(page.match(/const DATA=(\{[\s\S]*?\});/)[1]);
 const bases={'en-GB':'en','en-AU':'en','en-NZ':'en','en-CA':'en','pt-BR':'pt','es-MX':'es','de-CH':'de'};
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const homes={};
 for(const lang of Object.keys(data.languages)){
  const t=data.copy[bases[lang]||lang]||data.copy.en;
  const faq=(t.faq||[]).filter(x=>Array.isArray(x)&&typeof x[0]==='string'&&typeof x[1]==='string');
  const main='<main class="shell"><h1>'+esc(t.title)+'</h1><p>'+esc(t.intro)+'</p><nav aria-label="'+esc(t.nav[0])+'"><a href="/products?lang='+lang+'">'+esc(t.browse)+'</a> · <a href="/categories?lang='+lang+'">'+esc(t.categories)+'</a></nav><h2>'+esc(t.guideTitle)+'</h2>'+t.guide.map(p=>'<p>'+esc(p)+'</p>').join('')+'<section id="faq"><h2>'+esc(t.faqTitle)+'</h2>'+faq.map(([q,a])=>'<article><h3>'+esc(q)+'</h3><p>'+esc(a)+'</p></article>').join('')+'</section></main>';
  homes[lang]={html:'<div id="app">'+main+'</div>',title:esc(t.title+' | '+siteName),description:esc(t.intro)};
 }
 return 'const HOME_FALLBACKS='+JSON.stringify(homes)+';\n'+String(function renderHomeFallback(html,lang){const h=HOME_FALLBACKS[lang]||HOME_FALLBACKS.en;return html.replace('<div id="app"></div>',h.html).replace(/<title>[\s\S]*?<\/title>/i,'<title>'+h.title+'</title>').replace(/<meta name="description" content="[^"]*"\s*\/?\s*>/i,'<meta name="description" content="'+h.description+'">').replace(/<html lang="[^"]*"/i,'<html lang="'+(HOME_FALLBACKS[lang]?lang:'en')+'"');})+'\n';
}
