(function(){
  'use strict';
  const ARTICLES=[
    {
      url:'/guides/litbuy-parcel-planning-chargeable-weight-2026.html',
      copy:{
        en:{meta:'Parcel planning · July 30, 2026',title:'Plan a LitBuy Parcel Before Checkout',dek:'Control chargeable weight, route risk, warehouse decisions and consolidation before low prices become a costly box.'},
        zh:{meta:'包裹规划 · 2026年7月30日',title:'下单前规划 LitBuy 国际包裹',dek:'在低价商品变成高额运费前，控制计费重量、线路风险、仓库决策与合包方式。'},
        es:{meta:'Planificación · 30 julio 2026',title:'Planifica tu paquete LitBuy antes de comprar',dek:'Controla el peso facturable, el riesgo de ruta, las decisiones de almacén y la consolidación.'},
        fr:{meta:'Planification · 30 juillet 2026',title:'Planifier un colis LitBuy avant l’achat',dek:'Maîtrisez le poids facturable, les risques de ligne, les décisions d’entrepôt et la consolidation.'},
        de:{meta:'Paketplanung · 30. Juli 2026',title:'LitBuy-Paket vor dem Kauf planen',dek:'Kontrollieren Sie Abrechnungsgewicht, Versandrisiken, Lagerentscheidungen und Konsolidierung.'},
        pt:{meta:'Planejamento · 30 julho 2026',title:'Planeje o pacote LitBuy antes da compra',dek:'Controle peso faturável, risco de rota, decisões no armazém e consolidação.'},
        ja:{meta:'荷物設計 · 2026年7月30日',title:'購入前にLitBuy荷物を設計する方法',dek:'課金重量、配送リスク、倉庫判断、同梱を事前に管理する実践ガイド。'},
        ko:{meta:'포장 계획 · 2026년 7월 30일',title:'결제 전에 LitBuy 국제 배송 상자 설계하기',dek:'청구 중량, 배송 경로 위험, 창고 판단과 합배송을 미리 관리하는 실전 가이드입니다.'},
        ar:{meta:'تخطيط الطرد · 30 يوليو 2026',title:'خطط لطرد LitBuy قبل الشراء',dek:'تحكم في الوزن المحاسبي ومخاطر المسار وقرارات المستودع وتجميع المنتجات.'}
      }
    },
    {
      url:'/guides/litbuy-reverse-purchasing-workflow-2026.html',
      copy:{
        en:{meta:'Workflow · July 28, 2026',title:'LitBuy Reverse Purchasing: Product Link to Parcel',dek:'A practical low-risk workflow for sourcing, warehouse QC, consolidation and international shipping.'},
        zh:{meta:'反向代购 · 2026年7月28日',title:'LitBuy 反向代购：从商品链接到国际包裹',dek:'从选品、仓库 QC、合包到国际运输的低风险实操流程。'},
        es:{meta:'Compra inversa · 28 julio 2026',title:'Compra inversa con LitBuy: del enlace al paquete',dek:'Flujo práctico para compra, QC de almacén, consolidación y envío internacional.'},
        fr:{meta:'Achat inversé · 28 juillet 2026',title:'Achat inversé LitBuy : du lien au colis',dek:'Méthode pratique pour l’achat, le QC, la consolidation et l’expédition internationale.'},
        de:{meta:'Reverse Purchasing · 28. Juli 2026',title:'LitBuy Reverse Purchasing: vom Link zum Paket',dek:'Praktischer Ablauf für Einkauf, Lager-QC, Konsolidierung und internationalen Versand.'},
        pt:{meta:'Compra reversa · 28 julho 2026',title:'Compra reversa LitBuy: do link ao pacote',dek:'Fluxo prático para compra, QC, consolidação e envio internacional.'},
        ja:{meta:'代理購入 · 2026年7月28日',title:'LitBuy代理購入：商品リンクから国際配送まで',dek:'仕入れ、倉庫QC、同梱、国際発送を低リスクで進める実用フロー。'},
        ko:{meta:'역구매 · 2026년 7월 28일',title:'LitBuy 역구매: 상품 링크부터 국제 배송까지',dek:'구매, 창고 QC, 합배송, 국제 배송을 위한 실용적인 저위험 절차입니다.'},
        ar:{meta:'الشراء العكسي · 28 يوليو 2026',title:'الشراء العكسي عبر LitBuy: من الرابط إلى الطرد',dek:'مسار عملي للشراء وفحص المستودع وتجميع المنتجات والشحن الدولي.'}
      }
    }
  ];
  const UI={
    en:{read:'Read guide ↗',all:'View all articles ↗'},
    zh:{read:'阅读英文指南 ↗',all:'查看全部文章 ↗'},
    es:{read:'Leer guía en inglés ↗',all:'Ver todos los artículos ↗'},
    fr:{read:'Lire le guide en anglais ↗',all:'Voir tous les articles ↗'},
    de:{read:'Englischen Ratgeber lesen ↗',all:'Alle Artikel anzeigen ↗'},
    pt:{read:'Ler guia em inglês ↗',all:'Ver todos os artigos ↗'},
    ja:{read:'英語ガイドを読む ↗',all:'すべての記事を見る ↗'},
    ko:{read:'영문 가이드 읽기 ↗',all:'전체 글 보기 ↗'},
    ar:{read:'قراءة الدليل بالإنجليزية ↗',all:'عرض جميع المقالات ↗'}
  };
  function lang(){
    const value=document.querySelector('.langSelect')?.value || document.documentElement.lang || 'en';
    const short=value.toLowerCase().split('-')[0];
    return UI[value]?value:(UI[short]?short:'en');
  }
  function articleCard(article,index){
    const language=lang();
    const text=article.copy[language] || article.copy.en;
    const card=document.createElement('article');
    card.className='guide litbuy-latest-guide'+(index===0?' feature':'');
    card.innerHTML='<div><span class="meta"></span><h3></h3><p></p></div><a class="text-link"></a>';
    card.querySelector('.meta').textContent=text.meta;
    card.querySelector('h3').textContent=text.title;
    card.querySelector('p').textContent=text.dek;
    const link=card.querySelector('a');
    link.href=article.url;
    link.textContent=UI[language].read;
    return card;
  }
  function rebuild(){
    const grid=document.querySelector('#guides .guides');
    if(!grid) return;
    const original=[...grid.querySelectorAll('article.guide:not(.litbuy-latest-guide)')];
    const qc=original.find(function(card){return card.querySelector('[data-guide="qc"]');});
    if(!qc) return;
    qc.classList.remove('feature');
    grid.replaceChildren(articleCard(ARTICLES[0],0),articleCard(ARTICLES[1],1),qc);
    const button=document.getElementById('allGuidesBtn');
    if(button && !button.dataset.litbuyAllGuides){
      const replacement=button.cloneNode(true);
      replacement.dataset.litbuyAllGuides='1';
      replacement.textContent=UI[lang()].all;
      replacement.addEventListener('click',function(){window.location.assign('/guides/');});
      button.replaceWith(replacement);
    }else if(button){
      button.textContent=UI[lang()].all;
    }
  }
  function rerender(){setTimeout(rebuild,0);}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',rebuild,{once:true});
  else rebuild();
  document.querySelectorAll('.langSelect').forEach(function(select){select.addEventListener('change',rerender);});
})();