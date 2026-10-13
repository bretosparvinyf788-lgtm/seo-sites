import snapshot from './rates-snapshot.json';
import { currencies, type ExchangeRates } from './currencies';
export async function getExchangeRates():Promise<ExchangeRates>{
 const url='https://open.er-api.com/v6/latest/USD';
 try{
  const cache=typeof caches!=='undefined'?await caches.open('usfans-currency-v1'):null;
  const cached=await cache?.match(url);
  if(cached)return await cached.json() as ExchangeRates;
  const response=await fetch(url,{signal:AbortSignal.timeout(5000),next:{revalidate:86400}} as RequestInit);
  if(!response.ok)throw new Error('Exchange rate provider unavailable');
  const data=await response.json() as {result:string;time_last_update_utc:string;rates:Record<string,number>};
  if(data.result!=='success'||currencies.some(c=>!Number.isFinite(data.rates[c])||data.rates[c]<=0))throw new Error('Invalid rates');
  const result:ExchangeRates={date:data.time_last_update_utc,rates:Object.fromEntries(currencies.map(c=>[c,data.rates[c]]))};
  if(cache)await cache.put(url,new Response(JSON.stringify(result),{headers:{'Content-Type':'application/json','Cache-Control':'public, max-age=86400'}}));
  return result;
 }catch{return snapshot;}
}
