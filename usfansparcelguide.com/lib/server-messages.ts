import translations from './translations.json';
import type { Lang } from './locales';
export const getMessages=(lang:Lang)=>(translations as Record<string,Record<string,string>>)[lang]||{};
