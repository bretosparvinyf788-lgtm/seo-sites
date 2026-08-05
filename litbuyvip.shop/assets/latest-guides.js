(function(){
  'use strict';
  const ARTICLES=[
    {
      url:'/guides/litbuy-warehouse-queue-qc-storage-return-window-2026.html',
      copy:{
        en:{meta:'Warehouse control · August 5, 2026',title:'Manage a LitBuy Warehouse Queue Without Losing the Return Window',dek:'Coordinate QC evidence, seller deadlines, storage age and parcel compatibility before accepted items leave China.'},
        zh:{meta:'仓库管理 · 2026年8月5日',title:'管理 LitBuy 仓库队列，避免错过退换窗口',dek:'在商品离开中国前，协调 QC 证据、卖家时限、仓储时间和包裹兼容性。'},
        es:{meta:'Control de almacén · 5 agosto 2026',title:'Gestiona la cola del almacén LitBuy sin perder devoluciones',dek:'Coordina QC, plazos del vendedor, tiempo de almacenamiento y compatibilidad antes del envío.'},
        fr:{meta:'Gestion d’entrepôt · 5 août 2026',title:'Gérer la file d’entrepôt LitBuy sans perdre le délai de retour',dek:'Coordonnez QC, délais vendeur, durée de stockage et compatibilité avant l’expédition.'},
        de:{meta:'Lagerkontrolle · 5. August 2026',title:'LitBuy-Lagerbestand verwalten, ohne die Rückgabefrist zu verlieren',dek:'Koordinieren Sie QC, Verkäuferfristen, Lagerdauer und Paketkompatibilität vor dem Versand.'},
        pt:{meta:'Controle de armazém · 5 agosto 2026',title:'Gerencie a fila do armazém LitBuy sem perder a devolução',dek:'Coordene QC, prazos do vendedor, tempo de armazenamento e compatibilidade antes do envio.'},
        ja:{meta:'倉庫管理 · 2026年8月5日',title:'返品期限を逃さずLitBuy倉庫キューを管理する方法',dek:'QC、販売者期限、保管日数、荷物の適合性を発送前に管理する実践ガイド。'},
        ko:{meta:'창고 관리 · 2026년 8월 5일',title:'반품 기한을 놓치지 않는 LitBuy 창고 대기열 관리법',dek:'QC 자료, 판매자 기한, 보관 기간과 포장 호환성을 출고 전에 관리하는 안내서입니다.'},
        ar:{meta:'إدارة المستودع · 5 أغسطس 2026',title:'إدارة قائمة مستودع LitBuy دون فقدان مهلة الإرجاع',dek:'نسّق فحص الجودة ومواعيد البائع ومدة التخزين وتوافق الطرد قبل الشحن.'}
      }
    },
    {
      url:'/guides/litbuy-rehearsal-parcel-shipping-decision-2026.html',
      copy:{
        en:{meta:'Rehearsal parcel · August 3, 2026',title:'Use LitBuy Rehearsal Parcel Before Shipping',dek:'Turn QC evidence, packaging instructions and packed-parcel data into a smarter international shipping decision.'},
        zh:{meta:'预演包裹 · 2026年8月3日',title:'国际发货前使用 LitBuy 预演包裹',dek:'利用 QC 证据、包装要求和包裹数据，做出更合理的国际运输决策。'},
        es:{meta:'Paquete de ensayo · 3 agosto 2026',title:'Usa el paquete de ensayo LitBuy antes del envío',dek:'Convierte el QC, las instrucciones de embalaje y los datos del paquete en una mejor decisión de envío.'},
        fr:{meta:'Colis de répétition · 3 août 2026',title:'Utiliser le colis de répétition LitBuy avant l’envoi',dek:'Transformez le QC, les consignes d’emballage et les données du colis en meilleure décision d’expédition.'},
        de:{meta:'Probeverpackung · 3. August 2026',title:'LitBuy-Probeverpackung vor dem Versand nutzen',dek:'Nutzen Sie QC, Verpackungsanweisungen und Paketdaten für eine bessere Versandentscheidung.'},
        pt:{meta:'Pacote de ensaio · 3 agosto 2026',title:'Use o pacote de ensaio LitBuy antes do envio',dek:'Transforme QC, instruções de embalagem e dados do pacote em uma decisão de envio mais inteligente.'},
        ja:{meta:'リハーサル梱包 · 2026年8月3日',title:'発送前にLitBuyリハーサル梱包を使う方法',dek:'QC、梱包指示、実測データを国際配送の判断に活用する実践ガイド。'},
        ko:{meta:'리허설 포장 · 2026년 8월 3일',title:'국제 배송 전 LitBuy 리허설 포장 활용법',dek:'QC 자료, 포장 요청과 포장 데이터를 더 나은 배송 결정에 활용하는 안내서입니다.'},
        ar:{meta:'الطرد التجريبي · 3 أغسطس 2026',title:'استخدم طرد LitBuy التجريبي قبل الشحن',dek:'حوّل فحص الجودة وتعليمات التغليف وبيانات الطرد إلى قرار شحن دولي أفضل.'}
      }
    },
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
    grid.replaceChildren(...ARTICLES.slice(0,3).map(articleCard));
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