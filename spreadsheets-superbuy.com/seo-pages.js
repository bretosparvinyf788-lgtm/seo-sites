(function(){
  const codes={en:'',zh:'zh-CN','zh-hant':'zh-TW',fr:'fr',de:'de',es:'es',it:'it',pt:'pt',nl:'nl',pl:'pl',cs:'cs',ro:'ro'};
  window.setLanguage=function(lang){
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
})();
