(()=>{
const words={en:{date:'Reference rate date',saved:'Saved reference rate',unavailable:'Exchange rates unavailable; prices are shown in USD.',base:'Catalog prices in USD',notice:'Display conversion only. Confirm the final amount on USFans.'},de:{date:'Datum des Referenzkurses',saved:'Gespeicherter Referenzkurs',unavailable:'Wechselkurse nicht verfügbar; Preise in USD.',base:'Katalogpreise in USD',notice:'Nur Anzeigeumrechnung. Endbetrag bei USFans prüfen.'},es:{date:'Fecha del tipo de referencia',saved:'Tipo de referencia guardado',unavailable:'Cambio no disponible; precios en USD.',base:'Precios del catálogo en USD',notice:'Conversión orientativa. Confirma el importe final en USFans.'},fr:{date:'Date du taux de référence',saved:'Taux de référence enregistré',unavailable:'Taux indisponibles ; prix affichés en USD.',base:'Prix du catalogue en USD',notice:'Conversion indicative. Vérifiez le montant final sur USFans.'},pt:{date:'Data da taxa de referência',saved:'Taxa de referência guardada',unavailable:'Câmbio indisponível; preços em USD.',base:'Preços do catálogo em USD',notice:'Conversão indicativa. Confirme o valor final no USFans.'},zh:{date:'参考汇率日期',saved:'已保存的参考汇率',unavailable:'汇率暂不可用，价格已回退至美元。',base:'目录原始价格：美元',notice:'换算仅供展示，最终支付金额请以 USFans 为准。'}};
const lang=document.documentElement.lang,config=JSON.parse(document.getElementById('localeConfig').textContent),w=config.words||words[lang]||words.en;
const quotes=[...document.querySelectorAll('[data-currency]')].map(b=>b.dataset.currency).filter(c=>c!=='USD');
let data={rates:{USD:1},dates:{}},wanted=config.currency,currency='USD';
try{if(localStorage.getItem('findsbook-language')===lang)wanted=localStorage.getItem('findsbook-currency')||wanted;localStorage.setItem('findsbook-language',lang);localStorage.setItem('findsbook-currency',wanted)}catch{}
const fresh=date=>{const ms=Date.parse(date);return Number.isFinite(ms)&&ms<=Date.now()+86400000&&Date.now()-ms<=7*86400000};
const available=c=>c==='USD'||Number.isFinite(data.rates[c])&&data.rates[c]>0&&fresh(data.dates[c]);
function draw(){currency=available(wanted)?wanted:'USD';document.getElementById('currencyLabel').textContent=currency;
const format=n=>new Intl.NumberFormat(lang,{style:'currency',currency}).format(n*data.rates[currency]);
document.querySelectorAll('[data-price]').forEach(el=>el.textContent=format(Number(el.dataset.price)));
document.querySelectorAll('[data-budget-usd]').forEach(el=>el.textContent='≤ '+format(Number(el.dataset.budgetUsd)));
document.querySelectorAll('[data-currency]').forEach(b=>{b.disabled=false;b.setAttribute('aria-pressed',String(b.dataset.currency===currency))});
document.querySelectorAll('[data-fx-status]').forEach(el=>el.textContent=(currency!==wanted?w.unavailable:currency==='USD'?w.base:w.date+': '+data.dates[currency]+' · Frankfurter')+' '+w.notice)}
function accept(d){if(!d||!d.rates||!d.dates)return;for(const c of quotes)if(Number.isFinite(d.rates[c])&&d.rates[c]>0&&fresh(d.dates[c])&&(!data.dates[c]||d.dates[c]>=data.dates[c])){data.rates[c]=d.rates[c];data.dates[c]=d.dates[c]}draw()}
document.addEventListener('findsbook:prices',draw);
document.querySelectorAll('[data-currency]').forEach(b=>b.addEventListener('click',()=>{wanted=b.dataset.currency;try{localStorage.setItem('findsbook-currency',wanted)}catch{}draw();b.closest('details').open=false}));
try{accept(JSON.parse(localStorage.getItem('findsbook-fx-v2')||'null'))}catch{}draw();
(async()=>{try{const r=await fetch('/fx-rates.json',{cache:'no-cache'});if(r.ok)accept(await r.json())}catch{}
const ac=new AbortController(),timer=setTimeout(()=>ac.abort(),8000);
try{const r=await fetch('https://api.frankfurter.dev/v2/rates?base=USD&quotes='+quotes.join(','),{signal:ac.signal});if(!r.ok)throw Error();const rows=await r.json(),next={rates:{USD:1},dates:{}};if(!Array.isArray(rows))throw Error();for(const row of rows)if(row.base==='USD'&&quotes.includes(row.quote)){next.rates[row.quote]=row.rate;next.dates[row.quote]=row.date}accept(next);try{localStorage.setItem('findsbook-fx-v2',JSON.stringify(data))}catch{}}catch{draw()}finally{clearTimeout(timer)}})();
})();
