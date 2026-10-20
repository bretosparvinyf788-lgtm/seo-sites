const CURRENCIES='USD EUR GBP CNY CAD AUD NZD CHF JPY HKD SGD KRW TWD NOK SEK DKK ISK PLN CZK HUF RON TRY RUB UAH ILS AED SAR QAR KWD BHD OMR INR IDR MYR THB PHP VND BRL MXN CLP COP PEN ARS ZAR EGP MAD'.split(' ');
function normalizeRates(data,provider){
 let date;
 if(provider==='exchangerate-api'){
  if(data.result!=='success'||data.base_code!=='USD'||!Number.isFinite(data.time_last_update_unix))throw Error('Invalid rate feed');
  date=new Date(data.time_last_update_unix*1000).toISOString().slice(0,10);
 }else{
  if(data.base!=='USD'||!/^\d{4}-\d{2}-\d{2}$/.test(data.date))throw Error('Invalid rate feed');
  date=data.date;
 }
 const rates={USD:1};
 for(const code of CURRENCIES){const rate=data.rates?.[code];if(typeof rate==='number'&&Number.isFinite(rate)&&rate>0)rates[code]=rate}
 if(!rates.EUR||!rates.CNY)throw Error('Incomplete rate feed');
 return {base:'USD',date,rates,provider};
}
async function exchangeRates(request,ctx){
 const cacheKey=new Request(new URL('/api/rates?version=3',request.url));let cache;
 try{cache=caches.default;const hit=await cache.match(cacheKey);if(hit)return hit}catch{}
 const sources=[['exchangerate-api','https://open.er-api.com/v6/latest/USD',6000],['frankfurter','https://api.frankfurter.dev/v1/latest?base=USD',4000]];
 for(const [provider,url,timeout]of sources){try{
  const upstream=await fetch(url,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(timeout)});if(!upstream.ok)throw Error('Rate feed unavailable');
  const data=normalizeRates(await upstream.json(),provider);
  const response=Response.json(data,{headers:{'cache-control':'public, max-age=3600','x-content-type-options':'nosniff'}});
  if(cache&&ctx)ctx.waitUntil(cache.put(cacheKey,response.clone()).catch(()=>{}));
  return response;
 }catch{}}
 return Response.json({error:'Rates unavailable'},{status:503,headers:{'cache-control':'no-store'}});
}
