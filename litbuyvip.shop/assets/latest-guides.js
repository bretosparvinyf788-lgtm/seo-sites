(function(){
  'use strict';
  const ARTICLES=[
    {
      url:'/guides/litbuy-total-cost-budget-before-buying-2026.html',
      copy:{
        en:{meta:'Cost control · August 14, 2026',title:'Build a LitBuy Total-Cost Budget Before You Buy',dek:'Use product cost, QC evidence, freight scenarios and parcel planning to decide whether a cheap domestic listing still makes sense after shipping.'},
        zh:{meta:'成本控制 · 2026年8月14日',title:'购买前建立 LitBuy 总成本预算',dek:'结合商品价格、QC 证据、运费场景和包裹规划，判断低价商品在国际运输后是否仍然划算。'},
        es:{meta:'Control de costes · 14 agosto 2026',title:'Crea un presupuesto total de LitBuy antes de comprar',dek:'Combina precio, QC, escenarios de envío y planificación del paquete para saber si una oferta sigue siendo rentable.'},
        fr:{meta:'Maîtrise des coûts · 14 août 2026',title:'Construire un budget LitBuy complet avant l’achat',dek:'Combinez prix, QC, scénarios de fret et structure du colis pour vérifier si une bonne affaire reste vraiment rentable.'},
        de:{meta:'Kostenkontrolle · 14. August 2026',title:'LitBuy-Gesamtkosten vor dem Kauf planen',dek:'Verbinden Sie Produktpreis, QC, Frachtszenarien und Paketplanung, um echte Gesamtkosten vor dem Versand einzuschätzen.'},
        pt:{meta:'Controle de custos · 14 agosto 2026',title:'Monte um orçamento total da LitBuy antes de comprar',dek:'Use preço, QC, cenários de frete e planejamento do pacote para saber se uma oferta ainda compensa após o envio.'},
        ja:{meta:'コスト管理 · 2026年8月14日',title:'購入前にLitBuyの総コスト予算を作る方法',dek:'商品価格、QC、送料シナリオ、梱包計画を使い、海外発送後も本当に割安かを判断します。'},
        ko:{meta:'비용 관리 · 2026년 8월 14일',title:'구매 전에 LitBuy 총비용 예산 세우기',dek:'상품 가격, QC, 운임 시나리오와 포장 계획을 이용해 해외 배송 후에도 실제로 저렴한지 판단합니다.'},
        ar:{meta:'ضبط التكلفة · 14 أغسطس 2026',title:'ابنِ ميزانية التكلفة الكاملة في LitBuy قبل الشراء',dek:'استخدم سعر المنتج وفحص الجودة وسيناريوهات الشحن وتخطيط الطرد لمعرفة إن كانت الصفقة ما تزال مجدية بعد الشحن.'}
      }
    },
    {
      url:'/guides/litbuy-parcel-consolidation-split-or-combine-2026.html',
      copy:{
        en:{meta:'Parcel strategy · August 12, 2026',title:'Split or Consolidate a LitBuy Parcel?',dek:'Use QC, route compatibility, packaging needs and live freight comparisons to decide when one box is efficient and when two are smarter.'},
        zh:{meta:'包裹策略 · 2026年8月12日',title:'LitBuy 包裹应该合包还是拆分？',dek:'结合 QC、线路兼容性、包装需求和实时运费比较，判断什么时候合包更划算，什么时候拆分更合理。'},
        es:{meta:'Estrategia de paquete · 12 agosto 2026',title:'¿Dividir o consolidar un paquete LitBuy?',dek:'Usa QC, compatibilidad de ruta, embalaje y comparaciones de envío para decidir entre uno o varios paquetes.'},
        fr:{meta:'Stratégie colis · 12 août 2026',title:'Faut-il séparer ou consolider un colis LitBuy ?',dek:'Utilisez le QC, la compatibilité des lignes, l’emballage et les estimations de fret pour choisir la meilleure structure.'},
        de:{meta:'Paketstrategie · 12. August 2026',title:'LitBuy-Paket teilen oder zusammenfassen?',dek:'Nutzen Sie QC, Routenkompatibilität, Verpackung und Frachtvergleiche, um die beste Paketstruktur zu wählen.'},
        pt:{meta:'Estratégia de pacote · 12 agosto 2026',title:'Dividir ou consolidar um pacote LitBuy?',dek:'Use QC, compatibilidade de rota, embalagem e comparações de frete para escolher a melhor estrutura.'},
        ja:{meta:'荷物戦略 · 2026年8月12日',title:'LitBuy荷物は分割か同梱か？',dek:'QC、配送互換性、梱包条件、送料比較から、1箱と複数箱のどちらが合理的か判断します。'},
        ko:{meta:'포장 전략 · 2026년 8월 12일',title:'LitBuy 배송은 합배송할까 분할할까?',dek:'QC, 배송 경로 호환성, 포장 요구와 운임 비교를 이용해 한 박스와 분할 배송 중 더 나은 선택을 판단합니다.'},
        ar:{meta:'استراتيجية الطرد · 12 أغسطس 2026',title:'هل تقسّم طرد LitBuy أم تجمعه؟',dek:'استخدم فحص الجودة وتوافق المسار والتغليف ومقارنة الشحن لاختيار هيكل الطرد الأفضل.'}
      }
    },
    {
      url:'/guides/litbuy-route-first-buying-shipping-restrictions-2026.html',
      copy:{
        en:{meta:'Route planning · August 7, 2026',title:'Build a Route-First LitBuy Haul Before You Buy',dek:'Screen shipping restrictions, packaging, QC evidence and parcel compatibility before a low domestic price becomes an awkward shipment.'},
        zh:{meta:'线路规划 · 2026年8月7日',title:'购买前先规划 LitBuy 国际运输线路',dek:'在低价商品进入仓库前，先检查运输限制、包装、QC 证据和包裹兼容性。'},
        es:{meta:'Planificación de ruta · 7 agosto 2026',title:'Planifica la ruta de tu compra LitBuy antes de comprar',dek:'Revisa restricciones, embalaje, QC y compatibilidad antes de que un precio bajo se convierta en un envío difícil.'},
        fr:{meta:'Planification de ligne · 7 août 2026',title:'Planifier la route LitBuy avant l’achat',dek:'Vérifiez restrictions, emballage, QC et compatibilité avant qu’un prix bas ne devienne un envoi compliqué.'},
        de:{meta:'Routenplanung · 7. August 2026',title:'LitBuy-Versandroute vor dem Kauf planen',dek:'Prüfen Sie Einschränkungen, Verpackung, QC und Paketkompatibilität, bevor ein günstiger Einkauf teuer wird.'},
        pt:{meta:'Planejamento de rota · 7 agosto 2026',title:'Planeje a rota LitBuy antes da compra',dek:'Verifique restrições, embalagem, QC e compatibilidade antes que um preço baixo vire um envio difícil.'},
        ja:{meta:'配送ルート設計 · 2026年8月7日',title:'購入前にLitBuyの配送ルートを設計する方法',dek:'低価格の商品が扱いにくい荷物になる前に、制限・梱包・QC・同梱適合性を確認します。'},
        ko:{meta:'배송 경로 계획 · 2026년 8월 7일',title:'구매 전에 LitBuy 배송 경로부터 설계하기',dek:'저렴한 상품이 까다로운 국제 배송이 되기 전에 제한, 포장, QC, 합배송 호환성을 점검합니다.'},
        ar:{meta:'تخطيط مسار الشحن · 7 أغسطس 2026',title:'خطط لمسار شحن LitBuy قبل الشراء',dek:'افحص القيود والتغليف وفحص الجودة وتوافق الطرد قبل أن يتحول السعر المنخفض إلى شحنة معقدة.'}
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