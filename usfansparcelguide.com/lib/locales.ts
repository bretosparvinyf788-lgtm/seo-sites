export const languages = [
 {code:'en',name:'English',locale:'en-US'},
 {code:'zh',name:'简体中文',locale:'zh-CN'},
 {code:'es',name:'Español',locale:'es-ES'},
 {code:'fr',name:'Français',locale:'fr-FR'},
 {code:'de',name:'Deutsch',locale:'de-DE'},
 {code:'it',name:'Italiano',locale:'it-IT'},
 {code:'pt',name:'Português',locale:'pt-PT'},
 {code:'nl',name:'Nederlands',locale:'nl-NL'},
 {code:'pl',name:'Polski',locale:'pl-PL'},
 {code:'sv',name:'Svenska',locale:'sv-SE'},
 {code:'da',name:'Dansk',locale:'da-DK'},
 {code:'no',name:'Norsk',locale:'nb-NO'},
 {code:'fi',name:'Suomi',locale:'fi-FI'},
 {code:'cs',name:'Čeština',locale:'cs-CZ'},
 {code:'ro',name:'Română',locale:'ro-RO'},
 {code:'hu',name:'Magyar',locale:'hu-HU'},
 {code:'el',name:'Ελληνικά',locale:'el-GR'},
 {code:'tr',name:'Türkçe',locale:'tr-TR'},
 {code:'ru',name:'Русский',locale:'ru-RU'},
 {code:'uk',name:'Українська',locale:'uk-UA'},
 {code:'ar',name:'العربية',locale:'ar-SA',rtl:true},
 {code:'he',name:'עברית',locale:'he-IL',rtl:true},
 {code:'ja',name:'日本語',locale:'ja-JP'},
 {code:'ko',name:'한국어',locale:'ko-KR'}
] as const;
export type Lang = typeof languages[number]['code'];
export const isLang=(value:string):value is Lang=>languages.some(l=>l.code===value);
export const language=(code:Lang)=>languages.find(l=>l.code===code)!;
export const isRTL=(code:Lang)=>code==='ar'||code==='he';
export const localeHref=(lang:Lang,path='/')=>lang==='en'?path:`/${lang}${path==='/'?'':path}`;
