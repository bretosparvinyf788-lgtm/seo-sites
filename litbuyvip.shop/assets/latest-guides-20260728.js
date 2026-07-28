(function(){
  'use strict';
  const ARTICLE_URL='/guides/litbuy-reverse-purchasing-workflow-2026.html';
  const COPY={
    en:{meta:'Workflow · July 28, 2026',title:'LitBuy Reverse Purchasing: Product Link to Parcel',dek:'A practical low-risk workflow for sourcing, warehouse QC, consolidation and international shipping.',read:'Read guide ↗',all:'View all articles ↗'},
    zh:{meta:'反向代购 · 2026年7月28日',title:'LitBuy 反向代购：从商品链接到国际包裹',dek:'从选品、仓库 QC、合包到国际运输的低风险实操流程。',read:'阅读英文指南 ↗',all:'查看全部文章 ↗'},
    es:{meta:'Compra inversa · 28 julio 2026',title:'Compra inversa con LitBuy: del enlace al paquete',dek:'Flujo práctico para compra, QC de almacén, consolidación y envío internacional.',read:'Leer guía en inglés ↗',all:'Ver todos los artículos ↗'},
    fr:{meta:'Achat inversé · 28 juillet 2026',title:'Achat inversé LitBuy : du lien au colis',dek:'Méthode pratique pour l’achat, le QC, la consolidation et l’expédition internationale.',read:'Lire le guide en anglais ↗',all:'Voir tous les articles ↗'},
    de:{meta:'Reverse Purchasing · 28. Juli 2026',title:'LitBuy Reverse Purchasing: vom Link zum Paket',dek:'Praktischer Ablauf für Einkauf, Lager-QC, Konsolidierung und internationalen Versand.',read:'Englischen Ratgeber lesen ↗',all:'Alle Artikel anzeigen ↗'},
    pt:{meta:'Compra reversa · 28 julho 2026',title:'Compra reversa LitBuy: do link ao pacote',dek:'Fluxo prático para compra, QC, consolidação e envio internacional.',read:'Ler guia em inglês ↗',all:'Ver todos os artigos ↗'},
    ja:{meta:'代理購入 · 2026年7月28日',title:'LitBuy代理購入：商品リンクから国際配送まで',dek:'仕入れ、倉庫QC、同梱、国際発送を低リスクで進める実用フロー。',read:'英語ガイドを読む ↗',all:'すべての記事を見る ↗'},
    ko:{meta:'역구매 · 2026년 7월 28일',title:'LitBuy 역구매: 상품 링크부터 국제 배송까지',dek:'구매, 창고 QC, 합배송, 국제 배송을 위한 실용적인 저위험 절차입니다.',read:'영문 가이드 읽기 ↗',all:'전체 글 보기 ↗'},
    ar:{meta:'الشراء العكسي · 28 يوليو 2026',title:'الشراء العكسي عبر LitBuy: من الرابط إلى الطرد',dek:'مسار عملي للشراء وفحص المستودع وتجميع المنتجات والشحن الدولي.',read:'قراءة الدليل بالإنجليزية ↗',all:'عرض جميع المقالات ↗'}
  };
  function lang(){
    const v=document.querySelector('.langSelect')?.value || document.documentElement.lang || 'en';
    const short=v.toLowerCase().split('-')[0];
    return COPY[v]?v:(COPY[short]?short:'en');
  }
  function newCard(){
    const t=COPY[lang()];
    const card=document.createElement('article');
    card.className='guide feature litbuy-latest-guide';
    card.innerHTML='<div><span class="meta"></span><h3></h3><p></p></div><a class="text-link" href="'+ARTICLE_URL+'"></a>';
    card.querySelector('.meta').textContent=t.meta;
    card.querySelector('h3').textContent=t.title;
    card.querySelector('p').textContent=t.dek;
    card.querySelector('a').textContent=t.read;
    return card;
  }
  function rebuild(){
    const grid=document.querySelector('#guides .guides');
    if(!grid) return;
    const existing=[...grid.querySelectorAll('article.guide:not(.litbuy-latest-guide)')];
    const qc=existing.find(x=>x.querySelector('[data-guide="qc"]'));
    const shipping=existing.find(x=>x.querySelector('[data-guide="shipping"]'));
    if(!qc||!shipping) return;
    qc.classList.remove('feature');
    shipping.classList.remove('feature');
    grid.replaceChildren(newCard(),qc,shipping);
    const oldBtn=document.getElementById('allGuidesBtn');
    if(oldBtn && !oldBtn.dataset.litbuyAllGuides){
      const btn=oldBtn.cloneNode(true);
      btn.dataset.litbuyAllGuides='1';
      btn.textContent=COPY[lang()].all;
      btn.addEventListener('click',function(){window.location.assign('/guides/');});
      oldBtn.replaceWith(btn);
    }else if(oldBtn){
      oldBtn.textContent=COPY[lang()].all;
    }
  }
  function run(){setTimeout(rebuild,0)}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',rebuild,{once:true});
  else rebuild();
  document.querySelectorAll('.langSelect').forEach(function(select){select.addEventListener('change',run);});
})();
