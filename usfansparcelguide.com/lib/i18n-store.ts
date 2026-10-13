import type { Lang } from './locales';
const dictionaries:Partial<Record<Lang,Readonly<Record<string,string>>>>={};
export function installMessages(lang:Lang,messages:Record<string,string>){dictionaries[lang]=messages;}
export function translate(lang:Lang,en:string,zh:string){return lang==='en'?en:lang==='zh'?zh:dictionaries[lang]?.[en]||en;}
