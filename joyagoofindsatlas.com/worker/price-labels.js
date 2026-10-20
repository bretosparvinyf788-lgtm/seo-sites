const PRICE_STATUS={
 en:['Price pending','The source has no valid reference price for this item. Confirm the current price on Joyagoo before ordering.'],
 zh:['价格待更新','源站暂未提供这件商品的有效参考价格。下单前请前往 Joyagoo 确认当前价格。'],
 de:['Preis ausstehend','Die Quelle liefert keinen gültigen Richtpreis für diesen Artikel. Prüfe den aktuellen Preis vor der Bestellung auf Joyagoo.'],
 fr:['Prix en attente','La source ne fournit pas de prix indicatif valide pour cet article. Vérifiez le prix actuel sur Joyagoo avant de commander.'],
 es:['Precio pendiente','La fuente no proporciona un precio orientativo válido para este artículo. Confirma el precio actual en Joyagoo antes de pedir.'],
 it:['Prezzo da aggiornare','La fonte non fornisce un prezzo indicativo valido per questo articolo. Verifica il prezzo attuale su Joyagoo prima di ordinare.'],
 pt:['Preço por atualizar','A fonte não fornece um preço indicativo válido para este artigo. Confirma o preço atual na Joyagoo antes de encomendar.'],
 pl:['Cena oczekuje','Źródło nie podaje prawidłowej ceny orientacyjnej tego produktu. Przed zamówieniem sprawdź aktualną cenę w Joyagoo.'],
 nl:['Prijs volgt','De bron geeft geen geldige richtprijs voor dit artikel. Controleer de actuele prijs op Joyagoo voordat je bestelt.'],
 sv:['Pris inväntas','Källan saknar ett giltigt riktpris för denna vara. Bekräfta aktuellt pris på Joyagoo före beställning.'],
 da:['Pris afventes','Kilden har ingen gyldig vejledende pris for denne vare. Bekræft den aktuelle pris på Joyagoo før bestilling.'],
 no:['Pris avventes','Kilden har ingen gyldig veiledende pris for denne varen. Bekreft gjeldende pris på Joyagoo før bestilling.'],
 fi:['Hinta odottaa','Lähde ei tarjoa tuotteelle kelvollista viitehintaa. Vahvista nykyinen hinta Joyagoossa ennen tilaamista.'],
 cs:['Cena se aktualizuje','Zdroj neposkytuje platnou orientační cenu tohoto produktu. Před objednáním ověřte aktuální cenu na Joyagoo.'],
 ro:['Preț în așteptare','Sursa nu oferă un preț orientativ valid pentru acest articol. Confirmă prețul actual pe Joyagoo înainte de comandă.'],
 hu:['Ár frissítés alatt','A forrás nem ad érvényes tájékoztató árat ehhez a termékhez. Rendelés előtt ellenőrizd az aktuális árat a Joyagoón.'],
 ru:['Цена ожидается','Источник не предоставляет действительную ориентировочную цену этого товара. Перед заказом уточните актуальную цену на Joyagoo.'],
 uk:['Ціна очікується','Джерело не надає дійсної орієнтовної ціни цього товару. Перед замовленням перевірте актуальну ціну на Joyagoo.'],
 tr:['Fiyat bekleniyor','Kaynak bu ürün için geçerli bir referans fiyatı sunmuyor. Siparişten önce güncel fiyatı Joyagoo’da doğrulayın.'],
 el:['Αναμένεται τιμή','Η πηγή δεν παρέχει έγκυρη ενδεικτική τιμή για αυτό το προϊόν. Επιβεβαιώστε την τρέχουσα τιμή στο Joyagoo πριν παραγγείλετε.'],
 ja:['価格更新待ち','情報元にこの商品の有効な参考価格がありません。注文前に Joyagoo で現在の価格を確認してください。'],
 ko:['가격 업데이트 대기','원본에 이 상품의 유효한 참고 가격이 없습니다. 주문 전에 Joyagoo에서 현재 가격을 확인하세요.'],
 ar:['السعر قيد التحديث','لا يوفر المصدر سعراً مرجعياً صالحاً لهذا المنتج. أكد السعر الحالي على Joyagoo قبل الطلب.'],
 he:['המחיר ממתין לעדכון','המקור אינו מספק מחיר ייחוס תקף למוצר הזה. אשרו את המחיר העדכני ב־Joyagoo לפני הזמנה.']
};
for(const code of Object.keys(LANGS)){
 if(!PRICE_STATUS[code])throw Error('Missing price status: '+code);
 [UI[code].priceUnavailable,UI[code].priceUnavailableNote]=PRICE_STATUS[code];
}
function hasUsdPrice(p){return Number.isFinite(Number(p.price))&&Number(p.price)>0;}
function hasPrice(p){return hasUsdPrice(p)||(Number.isFinite(p.priceCny)&&p.priceCny>0);}
