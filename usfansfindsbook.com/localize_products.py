import json,pathlib,re
R=pathlib.Path(__file__).parent
# Each display title describes the source listing, without translating brand names.
labels={
'shorts':['Shorts','Shorts','Pantalones cortos','Short','Calções','短裤'],
'sneakers':['Sneakers','Sneaker','Zapatillas','Baskets','Sapatilhas','运动鞋'],
'footwear':['Footwear','Schuhe','Calzado','Chaussures','Calçado','鞋履'],
'bag':['Bag','Tasche','Bolso','Sac','Mala','包袋'],
'jersey':['Football jerseys','Fußballtrikots','Camisetas de fútbol','Maillots de football','Camisolas de futebol','足球球衣'],
'set':['Clothing set','Bekleidungsset','Conjunto de ropa','Ensemble de vêtements','Conjunto de roupa','服饰套装'],
'mixed':['Mixed-brand clothing sets','Bekleidungssets verschiedener Marken','Conjuntos de varias marcas','Ensembles de plusieurs marques','Conjuntos de várias marcas','多品牌服饰套装'],
'graphic':['Graphic top','Oberteil mit Motiv','Camiseta estampada','Haut imprimé','Camisola estampada','印花上衣'],
'shirt':['T-shirt','T-Shirt','Camiseta','T-shirt','T-shirt','T恤'],
'hoodie':['Hoodie','Kapuzenpullover','Sudadera con capucha','Sweat à capuche','Sweatshirt com capuz','连帽衫'],
'ziphoodie':['Zip-up hoodie','Kapuzenjacke','Sudadera con cremallera','Sweat zippé à capuche','Sweatshirt com fecho','拉链连帽衫'],
'cap':['Cap','Kappe','Gorra','Casquette','Boné','帽子'],
'sportshirt':['Training T-shirt','Trainingsshirt','Camiseta de entrenamiento','T-shirt de sport','T-shirt de treino','运动训练T恤'],
'denim':['Denim jacket','Jeansjacke','Chaqueta vaquera','Veste en jean','Casaco de ganga','牛仔夹克'],
'bomber':['Corduroy bomber jacket','Cord-Bomberjacke','Chaqueta bomber de pana','Blouson en velours côtelé','Casaco bomber de bombazina','灯芯绒飞行夹克'],
'cardigan':['Knit cardigan','Strickjacke','Cárdigan de punto','Gilet en maille','Casaco de malha','针织开衫'],
'jacket':['Jacket','Jacke','Chaqueta','Veste','Casaco','夹克'],
'washed':['Washed graphic shorts','Verwaschene Shorts mit Motiv','Pantalones cortos lavados estampados','Short délavé imprimé','Calções lavados estampados','水洗印花短裤'],
'underwear':['Boxer briefs','Boxershorts','Calzoncillos bóxer','Boxers','Boxers','平角内裤'],
'pants':['Trousers','Hose','Pantalones','Pantalon','Calças','长裤'],
'belt':['Belt','Gürtel','Cinturón','Ceinture','Cinto','腰带'],
'checkbelt':['Check-pattern belt','Gürtel mit Karomuster','Cinturón de cuadros','Ceinture à carreaux','Cinto aos quadrados','格纹腰带'],
'backpack':['Backpack','Rucksack','Mochila','Sac à dos','Mochila','双肩背包'],
'travelbag':['Travel bag','Reisetasche','Bolsa de viaje','Sac de voyage','Saco de viagem','旅行包'],
'hobobag':['Quilted hobo bag','Gesteppte Hobo-Tasche','Bolso hobo acolchado','Sac hobo matelassé','Mala hobo acolchoada','绗缝腋下包'],
'perfume':['Perfume','Parfüm','Perfume','Parfum','Perfume','香水'],
'watch':['Smartwatch','Smartwatch','Reloj inteligente','Montre connectée','Relógio inteligente','智能手表'],
'speaker':['Portable Bluetooth speaker','Tragbarer Bluetooth-Lautsprecher','Altavoz Bluetooth portátil','Enceinte Bluetooth portable','Coluna Bluetooth portátil','便携蓝牙音箱'],
'headphones':['Headphones','Kopfhörer','Auriculares','Casque audio','Auscultadores','头戴式耳机'],
'charger':['Wireless charger set','Kabelloses Ladegerät-Set','Juego de cargadores inalámbricos','Ensemble de chargeurs sans fil','Conjunto de carregadores sem fios','无线充电器套装'],
'socks':['Sports socks','Sportsocken','Calcetines deportivos','Chaussettes de sport','Meias de desporto','运动袜'],
'glasses':['Glasses','Brille','Gafas','Lunettes','Óculos','眼镜'],
'sunglasses':['Sunglasses','Sonnenbrille','Gafas de sol','Lunettes de soleil','Óculos de sol','太阳镜'],
'bracelet':['Bracelet','Armband','Pulsera','Bracelet','Pulseira','手链']}
M={
'2662':('AMI','shorts','pants'),'2661':('Louis Vuitton','sneakers','shoes'),'2660':('Jacquemus','bag','bags'),'2659':('Dior','footwear','shoes'),'2658':('','jersey','shirts'),'2657':('AMIRI','set','clothing'),'2654':('','mixed','clothing'),'2653':('Chrome Hearts','graphic','shirts'),'2652':('Lacoste','shorts','pants'),'2651':('Palm Angels','shirt','shirts'),'2650':('Carhartt','hoodie','hoodies'),'2649':('Louis Vuitton','shirt','shirts'),'2648':('Burberry / Moschino / AMI','shirt','shirts'),'2647':('Prada','cap','other'),'2646':('Gucci','cap','other'),'2645':('Maison Margiela','shirt','shirts'),'2643':('Essentials','shorts','pants'),
'3203':('','sneakers','shoes'),'3202':('Gel-NYC','sneakers','shoes'),'3048':('Air Max 1','sneakers','shoes'),'3044':('Cloudtilt','sneakers','shoes'),'3187':('Gymshark','sportshirt','shirts'),'3006':('Stockholm','shirt','shirts'),'2955':('Burberry','shirt','shirts'),'2950':('Patagonia','shirt','shirts'),'3012':('Balenciaga','denim','clothing'),'3010':('Polo Ralph Lauren','bomber','clothing'),'3005':('Etonic','cardigan','clothing'),'3001':('The North Face','jacket','clothing'),'3199':('','ziphoodie','hoodies'),'2994':('AMIRI','hoodie','hoodies'),'2967':('Represent','hoodie','hoodies'),'2915':('Comme des Garçons PLAY','hoodie','hoodies'),'3205':('','washed','pants'),'3156':('Hanes','underwear','pants'),'3003':('Ralph Lauren','pants','pants'),'2987':('Gallery Dept.','pants','pants'),'2909':('Chanel','belt','belts'),'2899':('Louis Vuitton','belt','belts'),'2709':('AMIRI','belt','belts'),'2366':('Burberry','checkbelt','belts'),'3163':('N.C.B','backpack','bags'),'2964':('Carhartt','bag','bags'),'2910':('The North Face','backpack','bags'),'2797':('Miu Miu','hobobag','bags'),'2380':('Amouage Lineage','perfume','perfume'),'1518':('Dior Sauvage','perfume','perfume'),'381':('Chanel','perfume','perfume'),'235':('Gucci','perfume','perfume'),'1059':('Apple Watch Ultra 2','watch','electronics'),'1004':('JBL Pulse 5','speaker','electronics'),'624':('Beats Studio Pro3','headphones','electronics'),'3008':('Apple MagSafe','charger','electronics'),'3118':('','socks','other'),'2984':('Ray-Ban','sunglasses','other'),'2981':('Lacoste','bracelet','other'),'2978':('Miu Miu','sunglasses','other')}
P=json.loads((R/'catalog.json').read_text());langs=['en','de','es','fr','pt','zh'];P=[p for p in P if p['id'] not in ['2656','2655','2644','2955','3118','2978']]
qc_allow={'2662':[1,2,3],'2661':[1,2,3],'2660':[1,2,3],'2658':[1,2,3],'2657':[1,2,3],'2651':[1,2,3],'2649':[1,2,3,4],'2648':[1,2,3],'2647':[1,2,3],'2646':[1,2,3],'2645':[1,2,3],'2643':[1,2,3]}
qc_allow.update({k:[1,2,3] for k in ['3006','2950','3010','3005','3001','2994','2915','3003','2987','2909','2709','2366','2964','2797','1004','624','3008','2978']})
qc_allow['3156']=[3,4]
seller_galleries={'3203','3202','3187','3012','3199','3205','2910','2380','1518'}
for p in P:
 brand,typ,cat=M[p['id']];p['original_title']=p.get('original_title',p['title']);p['category']=cat;p['titles']={l:(brand+' — ' if brand else '')+labels[typ][i] for i,l in enumerate(langs)};p['title']=p['titles']['en'];p['recorded_at']='2026-10-09' if 'source_images' in p else '2026-10-05'
 if p['id'] in qc_allow:
  original=p.get('all_images',p['images']);p['all_images']=original;p['qc_images']=[original[i] for i in qc_allow[p['id']] if i<len(original)];p['images']=[original[0]];p['qc_evidence']='Visual review of source-record photos: measuring surfaces and corresponding product features. Historical references; not USFans order verification.'
 p.setdefault('qc_images',[])
 if not p['qc_images'] and p['id'] not in seller_galleries:
  p['all_images']=p.get('all_images',p['images']);p['images']=[p['image']]
 if not p.get('item_id') and p.get('market'):p['item_id']=re.search('itemID=(\\d+)',p['market'])[1]
(R/'catalog.json').write_text(json.dumps(P,ensure_ascii=False,indent=2));print('Localized',len(P),'QC products',sum(bool(p['qc_images']) for p in P))
