import json,pathlib
r=pathlib.Path('/workspace/sites/kakobuysheetdesk.com');d=json.load(open(r/'tools/content.json'))
rows={
'zh-CN':'鞋履与拖鞋|T恤|时尚服装|连帽卫衣|裤子|腰带|包袋|香水|电子产品|其他好物',
'de':'Schuhe & Hausschuhe|T-Shirts|Bekleidung|Hoodies|Hosen|Gürtel|Taschen|Parfüm|Elektronik|Weitere Funde',
'fr':'Chaussures & chaussons|T-shirts|Vêtements|Sweats à capuche|Pantalons|Ceintures|Sacs|Parfums|Électronique|Autres trouvailles',
'es':'Calzado y zapatillas|Camisetas|Ropa|Sudaderas|Pantalones|Cinturones|Bolsos|Perfumes|Electrónica|Otros productos',
'it':'Scarpe e pantofole|T-shirt|Abbigliamento|Felpe|Pantaloni|Cinture|Borse|Profumi|Elettronica|Altri prodotti',
'pt':'Calçados e chinelos|Camisetas|Roupas|Moletons|Calças|Cintos|Bolsas|Perfumes|Eletrônicos|Outros produtos',
'nl':'Schoenen & pantoffels|T-shirts|Kleding|Hoodies|Broeken|Riemen|Tassen|Parfum|Elektronica|Overige producten',
'pl':'Buty i kapcie|Koszulki|Odzież|Bluzy z kapturem|Spodnie|Paski|Torby|Perfumy|Elektronika|Inne produkty',
'sv':'Skor & tofflor|T-shirts|Kläder|Huvtröjor|Byxor|Bälten|Väskor|Parfym|Elektronik|Övriga fynd',
'da':'Sko og hjemmesko|T-shirts|Tøj|Hættetrøjer|Bukser|Bælter|Tasker|Parfume|Elektronik|Øvrige fund',
'no':'Sko og tøfler|T-skjorter|Klær|Hettegensere|Bukser|Belter|Vesker|Parfyme|Elektronikk|Andre funn',
'fi':'Kengät ja tossut|T-paidat|Vaatteet|Hupparit|Housut|Vyöt|Laukut|Hajuvedet|Elektroniikka|Muut löydöt',
'cs':'Boty a pantofle|Trička|Oblečení|Mikiny|Kalhoty|Pásky|Tašky|Parfémy|Elektronika|Další produkty',
'ro':'Încălțăminte|Tricouri|Îmbrăcăminte|Hanorace|Pantaloni|Curele|Genți|Parfumuri|Electronice|Alte produse',
'hu':'Cipők és papucsok|Pólók|Ruházat|Kapucnis pulóverek|Nadrágok|Övek|Táskák|Parfümök|Elektronika|Egyéb termékek',
'el':'Παπούτσια και παντόφλες|Μπλουζάκια|Ρούχα|Φούτερ|Παντελόνια|Ζώνες|Τσάντες|Αρώματα|Ηλεκτρονικά|Άλλα προϊόντα',
'bg':'Обувки и чехли|Тениски|Облекло|Суитшърти|Панталони|Колани|Чанти|Парфюми|Електроника|Други продукти',
'uk':'Взуття й капці|Футболки|Одяг|Худі|Штани|Ремені|Сумки|Парфуми|Електроніка|Інші знахідки',
'ru':'Обувь и тапочки|Футболки|Одежда|Худи|Брюки|Ремни|Сумки|Парфюмерия|Электроника|Другие товары',
'ar':'الأحذية والنعال|القمصان|الملابس|السترات بغطاء رأس|السراويل|الأحزمة|الحقائب|العطور|الإلكترونيات|منتجات أخرى',
'tr':'Ayakkabı ve terlik|Tişörtler|Giyim|Kapüşonlular|Pantolonlar|Kemerler|Çantalar|Parfüm|Elektronik|Diğer ürünler',
'ja':'靴・スリッパ|Tシャツ|衣類|パーカー|パンツ|ベルト|バッグ|香水|電子機器|その他',
'ko':'신발·슬리퍼|티셔츠|의류|후디|바지|벨트|가방|향수|전자제품|기타 상품'
}
for code,row in rows.items():
 d[code]['categories']=row.split('|');d[code]['shortCategories']=row.split('|');d[code]['productTypes']=row.split('|')
json.dump(d,open(r/'tools/content.json','w'),ensure_ascii=False)
