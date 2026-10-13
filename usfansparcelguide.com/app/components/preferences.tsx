'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Globe, Coins } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { languages, language, isLang, isRTL, localeHref, type Lang } from '@/lib/locales';
import { currencies, isCurrency, type Currency, type ExchangeRates } from '@/lib/currencies';
import { t } from '@/lib/content';
import { installMessages } from '@/lib/i18n-store';
type Preferences={currency:Currency;setCurrency:(currency:Currency)=>void;format:(usd:number)=>string;rates:ExchangeRates;lang:Lang};
const CurrencyContext=createContext<Preferences|null>(null);
export function CurrencyProvider({lang,rates,messages,children}:{lang:Lang;rates:ExchangeRates;messages:Record<string,string>;children:ReactNode}){
 installMessages(lang,messages);
 const [currency,setSelected]=useState<Currency>('USD');
 useEffect(()=>{try{const saved=localStorage.getItem('usfans-currency');if(saved&&isCurrency(saved))setSelected(saved);}catch{}},[]);
 useEffect(()=>{document.documentElement.lang=language(lang).locale;document.documentElement.dir=isRTL(lang)?'rtl':'ltr';},[lang]);
 function setCurrency(value:Currency){setSelected(value);try{localStorage.setItem('usfans-currency',value);}catch{}}
 function format(usd:number){return new Intl.NumberFormat(language(lang).locale,{style:'currency',currency,currencyDisplay:'code',maximumFractionDigits:['JPY','KRW'].includes(currency)?0:2}).format(usd*(rates.rates[currency]||1));}
 return <CurrencyContext.Provider value={{currency,setCurrency,format,rates,lang}}>{children}</CurrencyContext.Provider>;
}
export function useCurrency(){const value=useContext(CurrencyContext);if(!value)throw new Error('CurrencyProvider required');return value;}
export function CurrencyPrice({usd}:{usd:number}){const {format,currency}=useCurrency();return <span className="converted-price" data-currency={currency}>{currency!=='USD'&&<span className="approximate-price">≈ </span>}{format(usd)}</span>;}
export function LocaleControls({lang,path}:{lang:Lang;path:string}){
 const {currency,setCurrency}=useCurrency();
 function selectLanguage(value:string){if(!isLang(value))return;const query=new URLSearchParams(window.location.search);query.delete('lang');const q=query.toString();window.location.assign(localeHref(value,path)+(q?'?'+q:'')+window.location.hash);}
 return <div className="locale-controls">
 <Select value={lang} onValueChange={selectLanguage}><SelectTrigger className="locale-trigger" aria-label={t(lang,'Language','语言')}><Globe size={16}/><span className="locale-code">{lang.toUpperCase()}</span><span className="sr-only"><SelectValue/></span></SelectTrigger><SelectContent position="popper" className="locale-options" dir="ltr">{languages.map(l=><SelectItem value={l.code} key={l.code}><span lang={l.locale}>{l.name}</span><span className="option-code">{l.code.toUpperCase()}</span></SelectItem>)}</SelectContent></Select>
 <Select value={currency} onValueChange={v=>{if(isCurrency(v))setCurrency(v);}}><SelectTrigger className="currency-trigger" aria-label={t(lang,'Display currency','显示货币')}><Coins size={16}/><SelectValue/></SelectTrigger><SelectContent position="popper" align="end" sideOffset={6} collisionPadding={12} className="currency-options" dir="ltr">{currencies.map(c=><SelectItem value={c} key={c}>{c}</SelectItem>)}</SelectContent></Select>
 </div>;
}
