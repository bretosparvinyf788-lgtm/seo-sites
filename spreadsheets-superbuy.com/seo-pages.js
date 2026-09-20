(function(){
  const codes={en:'',zh:'zh-CN','zh-hant':'zh-TW',fr:'fr',de:'de',es:'es',it:'it',pt:'pt',nl:'nl',pl:'pl',cs:'cs',ro:'ro'};
  function track(name,params){
    if(typeof window.gtag==='function')window.gtag('event',name,params||{});
  }
  window.setLanguage=function(lang){
    track('language_change',{language:lang,page_path:location.pathname});
    localStorage.setItem('ss-language',lang);
    const code=codes[lang]||'';
    document.cookie='googtrans=/en/'+code+';path=/';
    document.cookie='googtrans=/en/'+code+';path=/;domain='+location.hostname;
    location.reload();
  };
  window.googleTranslateElementInit=function(){
    if(!window.google||!google.translate)return;
    new google.translate.TranslateElement({pageLanguage:'en',includedLanguages:'zh-CN,zh-TW,fr,de,es,it,pt,nl,pl,cs,ro',autoDisplay:false},'google_translate_element');
  };
  document.addEventListener('DOMContentLoaded',function(){
    const select=document.querySelector('.language-picker select');
    if(select)select.value=localStorage.getItem('ss-language')||'en';
  });
  document.addEventListener('click',function(event){
    const link=event.target.closest('a');
    if(!link)return;
    const href=link.href||'';
    if(href.includes('kakobuymake.com')){
      track('spreadsheet_click',{link_url:href,placement:location.pathname});
    }else if(href.includes('/guides/')){
      track('guide_open',{link_url:href,article_slug:href.split('/').pop()||'index',placement:location.pathname});
    }
  });
})();
