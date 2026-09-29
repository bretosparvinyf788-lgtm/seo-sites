export const languages = {
  en: { label: 'English', short: 'EN' },
  de: { label: 'Deutsch', short: 'DE' },
  es: { label: 'Español', short: 'ES' },
  fr: { label: 'Français', short: 'FR' },
  it: { label: 'Italiano', short: 'IT' },
  pl: { label: 'Polski', short: 'PL' },
  pt: { label: 'Português', short: 'PT' },
  ro: { label: 'Română', short: 'RO' },
  sv: { label: 'Svenska', short: 'SV' },
  nl: { label: 'Nederlands', short: 'NL' },
  da: { label: 'Dansk', short: 'DA' },
  fi: { label: 'Suomi', short: 'FI' },
  el: { label: 'Ελληνικά', short: 'EL' },
  cs: { label: 'Čeština', short: 'CS' },
  hu: { label: 'Magyar', short: 'HU' },
  bg: { label: 'Български', short: 'BG' },
  sk: { label: 'Slovenčina', short: 'SK' },
  hr: { label: 'Hrvatski', short: 'HR' },
  sl: { label: 'Slovenščina', short: 'SL' },
  lt: { label: 'Lietuvių', short: 'LT' },
  lv: { label: 'Latviešu', short: 'LV' },
  et: { label: 'Eesti', short: 'ET' },
  ga: { label: 'Gaeilge', short: 'GA' },
  mt: { label: 'Malti', short: 'MT' },
  zh: { label: '中文', short: 'ZH' }
} as const;

export type Lang = keyof typeof languages;
export const languageOrder: readonly Lang[] = [
  'en', 'de', 'es', 'fr', 'it', 'pl', 'pt', 'ro', 'sv', 'nl', 'da', 'fi',
  'el', 'cs', 'hu', 'bg', 'sk', 'hr', 'sl', 'lt', 'lv', 'et', 'ga', 'mt', 'zh'
];
export const defaultLang: Lang = 'en';

type Copy = {
  nav: { home: string; spreadsheet: string; categories: string; faq: string };
  hero: { eyebrow: string; title: string; body: string; placeholder: string; search: string; browse: string };
  sections: { categories: string; categoriesBody: string; recent: string; recentBody: string; viewAll: string; details: string; sourceLive: string };
  listing: { title: string; body: string; sort: string; newest: string; priceLow: string; priceHigh: string; name: string; noResults: string; sourceError: string; previous: string; next: string };
  seo: { title: string; body: string; searchTitle: string; searchBody: string; photosTitle: string; photosBody: string; checkoutTitle: string; checkoutBody: string };
  faqTitle: string;
  faqIntro: string;
  faqs: Array<[string, string]>;
  product: { gallery: string; sourceRecord: string; openKakobuy: string; currentNotice: string; unavailable: string };
};

const en: Copy = {
  nav: { home: 'Home', spreadsheet: 'Spreadsheet', categories: 'Categories', faq: 'FAQ' },
  hero: { eyebrow: 'Live Kakobuy product catalog', title: 'Kakobuy Spreadsheet', body: 'Search seller listings, compare source photos and estimated prices, then open the selected marketplace item in Kakobuy.', placeholder: 'Try sneakers, hoodies, bags…', search: 'Search', browse: 'Browse the spreadsheet' },
  sections: { categories: 'Browse by category', categoriesBody: 'Explore the current categories published by the source catalog.', recent: 'Recently added listings', recentBody: 'Products, prices and images are read from public source listings.', viewAll: 'View all products', details: 'View details', sourceLive: 'Live source' },
  listing: { title: 'Kakobuy Spreadsheet', body: 'Browse the current public Kakobuy product catalog.', sort: 'Sort', newest: 'Newest', priceLow: 'Price: low to high', priceHigh: 'Price: high to low', name: 'Name', noResults: 'No matching source listings were found.', sourceError: 'The source catalog is temporarily unavailable. Please try again shortly.', previous: 'Previous', next: 'Next' },
  seo: { title: 'Compare seller listings before opening Kakobuy', body: 'This independent directory organizes public seller listings into a faster, mobile-friendly catalog. Product records remain on the source website and final price, stock and options should always be confirmed in Kakobuy.', searchTitle: 'Search products and categories', searchBody: 'Use a clear product, brand or category term to search the source catalog.', photosTitle: 'Review source photos', photosBody: 'Product galleries show only images published with the matching source listing.', checkoutTitle: 'Continue in Kakobuy', checkoutBody: 'Open the Kakobuy item page to check the latest seller information before ordering.' },
  faqTitle: 'Kakobuy Spreadsheet Frequently Asked Questions',
  faqIntro: 'Answers to common questions about product search, estimated prices, marketplace links and product information.',
  faqs: [
    ['What is the Kakobuy Spreadsheet?', 'The Kakobuy Spreadsheet is an independent, searchable directory of public seller listings. It organizes product titles, categories, estimated prices and source images so shoppers can compare items before continuing to Kakobuy.'],
    ['What is Kakobuy?', 'Kakobuy is a shopping-agent service that helps international buyers purchase products from Chinese marketplaces. After choosing an item, buyers can use Kakobuy for purchasing, warehouse processing and international parcel delivery.'],
    ['Which marketplaces are included?', 'Source records may include products from Weidian, Taobao, Tmall, 1688 and other Chinese marketplaces. The available marketplace and seller link depend on the information published with each source listing.'],
    ['How do I search for products?', 'Open the Spreadsheet page and search with a product name, brand or category. You can also browse the category pages to compare similar listings.'],
    ['Why are prices shown in US dollars?', 'Many source sellers price products in Chinese yuan. The spreadsheet displays an estimated US-dollar value to make comparison easier; exchange rates and seller prices can change, so confirm the final amount in Kakobuy.'],
    ['Why do some products have fewer images or options?', 'Images, styles, colours and size information come from the original marketplace listing. Some sellers publish a complete gallery while others provide only a main image or a short description.'],
    ['How do I open a product in Kakobuy?', 'Open the product detail page, review the source images and estimated price, then use the Kakobuy button to continue to the matching item page.'],
    ['What are quality-control (QC) photos?', 'QC photos are warehouse inspection images of an ordered item. They can help you review visible details such as shape, colour, material and sizing marks before international shipping.'],
    ['Does the displayed price include shipping and service fees?', 'No. The displayed amount is the source product price. Domestic delivery, international shipping, optional services and other charges are calculated separately.'],
    ['What should I verify before ordering?', 'Confirm the marketplace item, selected variant, current price, seller status and any shipping restrictions on the Kakobuy page before placing an order.']
  ],
  product: { gallery: 'Source gallery', sourceRecord: 'View source record', openKakobuy: 'Open in Kakobuy', currentNotice: 'Price, stock and options can change. Confirm the final details in Kakobuy.', unavailable: 'This source listing is unavailable.' }
};

const overrides: Partial<Record<Lang, Partial<Copy>>> = {
  de: {
    nav: { home: 'Startseite', spreadsheet: 'Katalog', categories: 'Kategorien', faq: 'FAQ' },
    hero: { eyebrow: 'Live-Katalog von kakobuymake.com', title: 'Kakobuy Tabelle', body: 'Durchsuche Produkte, vergleiche Quellbilder und geschätzte Preise und öffne den ausgewählten Artikel anschließend in Kakobuy.', placeholder: 'Sneaker, Hoodies, Taschen…', search: 'Suchen', browse: 'Katalog durchsuchen' },
    sections: { categories: 'Nach Kategorie durchsuchen', categoriesBody: 'Entdecke die aktuellen Kategorien des Quellkatalogs.', recent: 'Kürzlich hinzugefügt', recentBody: 'Produkte, Preise und Bilder werden direkt von kakobuymake.com geladen.', viewAll: 'Alle Produkte anzeigen', details: 'Details anzeigen', sourceLive: 'Live-Quelle' },
    listing: { title: 'Kakobuy Tabelle', body: 'Durchsuche den aktuellen öffentlichen Katalog von kakobuymake.com.', sort: 'Sortieren', newest: 'Neueste', priceLow: 'Preis: aufsteigend', priceHigh: 'Preis: absteigend', name: 'Name', noResults: 'Keine passenden Produkte gefunden.', sourceError: 'Der Quellkatalog ist vorübergehend nicht verfügbar. Bitte versuche es später erneut.', previous: 'Zurück', next: 'Weiter' },
    seo: { title: 'Produkte vergleichen, bevor du Kakobuy öffnest', body: 'Dieser unabhängige Katalog ordnet öffentliche Verkäuferangebote. Endpreis, Bestand und Optionen müssen immer in Kakobuy bestätigt werden.', searchTitle: 'Produkte und Kategorien suchen', searchBody: 'Verwende einen eindeutigen Produkt-, Marken- oder Kategoriebegriff.', photosTitle: 'Quellbilder prüfen', photosBody: 'Galerien zeigen nur Bilder aus dem passenden Quellangebot.', checkoutTitle: 'In Kakobuy fortfahren', checkoutBody: 'Öffne vor der Bestellung die Kakobuy-Artikelseite und prüfe die aktuellen Angaben.' },
    faqTitle: 'Häufige Fragen zur Kakobuy Tabelle',
    faqs: [['Was ist diese Kakobuy Tabelle?', 'Sie ist ein unabhängiger Katalog für öffentliche Angebote von kakobuymake.com. Sie verkauft keine Produkte und verarbeitet keine Bestellungen.'], ['Woher stammen die Produkte?', 'Titel, Preise, Kategorien und Bilder werden beim Öffnen einer Seite von kakobuymake.com abgerufen.'], ['Sind die Preise garantiert?', 'Nein. Prüfe den aktuellen Preis, den Bestand und die gewählte Option in Kakobuy.'], ['Sind alle Produktbilder QC-Fotos?', 'Nein. Es werden die Bilder des Quellangebots angezeigt und nur dann als QC bezeichnet, wenn die Quelle sie so kennzeichnet.'], ['Wie kaufe ich einen Artikel?', 'Klicke auf die Produktkarte, um die passende Artikelseite direkt in Kakobuy zu öffnen.'], ['Warum kann ein Angebot verschwinden?', 'Der Quellkatalog oder das Verkäuferangebot kann geändert oder entfernt werden. Diese Website speichert keine separate Produktdatenbank.']],
    product: { gallery: 'Quellgalerie', sourceRecord: 'Quelle anzeigen', openKakobuy: 'In Kakobuy öffnen', currentNotice: 'Preis, Bestand und Optionen können sich ändern. Bestätige die Angaben in Kakobuy.', unavailable: 'Dieses Quellangebot ist nicht verfügbar.' }
  },
  es: {
    nav: { home: 'Inicio', spreadsheet: 'Catálogo', categories: 'Categorías', faq: 'Preguntas' },
    hero: { eyebrow: 'Catálogo en vivo de kakobuymake.com', title: 'Hoja de cálculo Kakobuy', body: 'Busca productos, compara fotos de origen y precios estimados y abre el artículo elegido en Kakobuy.', placeholder: 'Zapatillas, sudaderas, bolsos…', search: 'Buscar', browse: 'Explorar el catálogo' },
    sections: { categories: 'Explorar por categoría', categoriesBody: 'Consulta las categorías actuales del catálogo de origen.', recent: 'Productos añadidos recientemente', recentBody: 'Los productos, precios e imágenes se cargan directamente desde kakobuymake.com.', viewAll: 'Ver todos los productos', details: 'Ver detalles', sourceLive: 'Fuente en vivo' },
    listing: { title: 'Hoja de cálculo Kakobuy', body: 'Explora el catálogo público actual de kakobuymake.com.', sort: 'Ordenar', newest: 'Más recientes', priceLow: 'Precio: menor a mayor', priceHigh: 'Precio: mayor a menor', name: 'Nombre', noResults: 'No se encontraron productos coincidentes.', sourceError: 'El catálogo de origen no está disponible temporalmente. Inténtalo de nuevo en breve.', previous: 'Anterior', next: 'Siguiente' },
    seo: { title: 'Compara productos antes de abrir Kakobuy', body: 'Este catálogo independiente organiza anuncios públicos de vendedores. Confirma siempre en Kakobuy el precio final, las existencias y las opciones.', searchTitle: 'Buscar productos y categorías', searchBody: 'Utiliza un término claro de producto, marca o categoría.', photosTitle: 'Revisar fotos de origen', photosBody: 'Las galerías solo muestran imágenes publicadas con el anuncio de origen correspondiente.', checkoutTitle: 'Continuar en Kakobuy', checkoutBody: 'Abre la página del artículo en Kakobuy y comprueba la información actual antes de comprar.' },
    faqTitle: 'Preguntas frecuentes sobre la hoja Kakobuy',
    faqs: [['¿Qué es esta hoja de cálculo Kakobuy?', 'Es un catálogo independiente de anuncios públicos proporcionados por kakobuymake.com. No vende productos ni procesa pedidos.'], ['¿De dónde proceden los productos?', 'Los títulos, precios, categorías e imágenes se solicitan a kakobuymake.com al abrir una página.'], ['¿Los precios están garantizados?', 'No. Confirma el precio actual, las existencias y la opción seleccionada en Kakobuy.'], ['¿Todas las fotos son fotos QC?', 'No. Se muestran las imágenes del anuncio de origen y solo se llaman QC cuando la fuente las identifica así.'], ['¿Cómo compro un producto?', 'Haz clic en la tarjeta del producto para abrir directamente la página correspondiente en Kakobuy.'], ['¿Por qué puede desaparecer un producto?', 'El catálogo de origen o el anuncio del vendedor puede cambiar o eliminarse. El sitio no mantiene una base de datos de productos independiente.']],
    product: { gallery: 'Galería de origen', sourceRecord: 'Ver fuente', openKakobuy: 'Abrir en Kakobuy', currentNotice: 'El precio, las existencias y las opciones pueden cambiar. Confirma los datos en Kakobuy.', unavailable: 'Este anuncio de origen no está disponible.' }
  },
  fr: {
    nav: { home: 'Accueil', spreadsheet: 'Catalogue', categories: 'Catégories', faq: 'FAQ' },
    hero: { eyebrow: 'Catalogue en direct de kakobuymake.com', title: 'Tableur Kakobuy', body: 'Recherchez des produits, comparez les photos source et les prix estimés, puis ouvrez l’article sélectionné dans Kakobuy.', placeholder: 'Baskets, sweats, sacs…', search: 'Rechercher', browse: 'Voir le catalogue' },
    sections: { categories: 'Parcourir par catégorie', categoriesBody: 'Explorez les catégories actuelles du catalogue source.', recent: 'Ajouts récents', recentBody: 'Les produits, prix et images sont chargés directement depuis kakobuymake.com.', viewAll: 'Voir tous les produits', details: 'Voir les détails', sourceLive: 'Source en direct' },
    listing: { title: 'Tableur Kakobuy', body: 'Parcourez le catalogue public actuel de kakobuymake.com.', sort: 'Trier', newest: 'Plus récents', priceLow: 'Prix : croissant', priceHigh: 'Prix : décroissant', name: 'Nom', noResults: 'Aucun produit correspondant trouvé.', sourceError: 'Le catalogue source est temporairement indisponible. Réessayez prochainement.', previous: 'Précédent', next: 'Suivant' },
    seo: { title: 'Comparez les produits avant d’ouvrir Kakobuy', body: 'Ce catalogue indépendant organise des annonces publiques de vendeurs. Vérifiez toujours le prix final, le stock et les options dans Kakobuy.', searchTitle: 'Rechercher des produits et catégories', searchBody: 'Utilisez un terme clair de produit, de marque ou de catégorie.', photosTitle: 'Consulter les photos source', photosBody: 'Les galeries affichent uniquement les images publiées avec l’annonce source correspondante.', checkoutTitle: 'Continuer dans Kakobuy', checkoutBody: 'Ouvrez la page de l’article Kakobuy et vérifiez les informations actuelles avant de commander.' },
    faqTitle: 'Questions fréquentes sur le tableur Kakobuy',
    faqs: [['Qu’est-ce que ce tableur Kakobuy ?', 'Il s’agit d’un catalogue indépendant des annonces publiques fournies par kakobuymake.com. Il ne vend aucun produit et ne traite aucune commande.'], ['D’où viennent les produits ?', 'Les titres, prix, catégories et images sont demandés à kakobuymake.com lors de l’ouverture de la page.'], ['Les prix sont-ils garantis ?', 'Non. Vérifiez le prix actuel, le stock et l’option choisie dans Kakobuy.'], ['Toutes les photos sont-elles des photos QC ?', 'Non. Les images de l’annonce source sont affichées et ne sont appelées QC que si la source les identifie ainsi.'], ['Comment acheter un article ?', 'Cliquez sur la carte du produit pour ouvrir directement la page correspondante dans Kakobuy.'], ['Pourquoi un article peut-il disparaître ?', 'Le catalogue source ou l’annonce du vendeur peut être modifié ou supprimé. Le site ne conserve pas de base de données produit distincte.']],
    product: { gallery: 'Galerie source', sourceRecord: 'Voir la source', openKakobuy: 'Ouvrir dans Kakobuy', currentNotice: 'Le prix, le stock et les options peuvent changer. Confirmez les informations dans Kakobuy.', unavailable: 'Cette annonce source est indisponible.' }
  },
  it: {
    nav: { home: 'Home', spreadsheet: 'Catalogo', categories: 'Categorie', faq: 'FAQ' },
    hero: { eyebrow: 'Catalogo live da kakobuymake.com', title: 'Foglio Kakobuy', body: 'Cerca prodotti, confronta foto di origine e prezzi stimati, quindi apri l’articolo selezionato su Kakobuy.', placeholder: 'Sneaker, felpe, borse…', search: 'Cerca', browse: 'Sfoglia il catalogo' },
    sections: { categories: 'Sfoglia per categoria', categoriesBody: 'Esplora le categorie correnti del catalogo sorgente.', recent: 'Aggiunti di recente', recentBody: 'Prodotti, prezzi e immagini vengono caricati direttamente da kakobuymake.com.', viewAll: 'Vedi tutti i prodotti', details: 'Vedi dettagli', sourceLive: 'Fonte live' },
    listing: { title: 'Foglio Kakobuy', body: 'Sfoglia il catalogo pubblico corrente di kakobuymake.com.', sort: 'Ordina', newest: 'Più recenti', priceLow: 'Prezzo: crescente', priceHigh: 'Prezzo: decrescente', name: 'Nome', noResults: 'Nessun prodotto corrispondente trovato.', sourceError: 'Il catalogo sorgente non è temporaneamente disponibile. Riprova tra poco.', previous: 'Precedente', next: 'Successivo' },
    seo: { title: 'Confronta i prodotti prima di aprire Kakobuy', body: 'Questo catalogo indipendente organizza annunci pubblici dei venditori. Verifica sempre prezzo finale, disponibilità e opzioni in Kakobuy.', searchTitle: 'Cerca prodotti e categorie', searchBody: 'Usa un termine chiaro per prodotto, marchio o categoria.', photosTitle: 'Controlla le foto di origine', photosBody: 'Le gallerie mostrano solo le immagini pubblicate nell’annuncio sorgente corrispondente.', checkoutTitle: 'Continua su Kakobuy', checkoutBody: 'Apri la pagina dell’articolo su Kakobuy e controlla le informazioni aggiornate prima di ordinare.' },
    faqTitle: 'Domande frequenti sul foglio Kakobuy',
    faqs: [['Che cos’è questo foglio Kakobuy?', 'È un catalogo indipendente di annunci pubblici forniti da kakobuymake.com. Non vende prodotti e non elabora ordini.'], ['Da dove provengono i prodotti?', 'Titoli, prezzi, categorie e immagini vengono richiesti a kakobuymake.com quando si apre la pagina.'], ['I prezzi sono garantiti?', 'No. Conferma il prezzo attuale, la disponibilità e l’opzione scelta in Kakobuy.'], ['Tutte le foto sono foto QC?', 'No. Vengono mostrate le immagini dell’annuncio sorgente e sono chiamate QC solo quando la fonte le identifica così.'], ['Come acquisto un articolo?', 'Fai clic sulla scheda del prodotto per aprire direttamente la pagina corrispondente in Kakobuy.'], ['Perché un prodotto può scomparire?', 'Il catalogo sorgente o l’annuncio del venditore può essere modificato o rimosso. Il sito non mantiene un database prodotti separato.']],
    product: { gallery: 'Galleria sorgente', sourceRecord: 'Vedi fonte', openKakobuy: 'Apri in Kakobuy', currentNotice: 'Prezzo, disponibilità e opzioni possono cambiare. Conferma i dati in Kakobuy.', unavailable: 'Questo annuncio sorgente non è disponibile.' }
  },
  pl: {
    nav: { home: 'Start', spreadsheet: 'Katalog', categories: 'Kategorie', faq: 'FAQ' },
    hero: { eyebrow: 'Katalog na żywo z kakobuymake.com', title: 'Arkusz Kakobuy', body: 'Wyszukuj produkty, porównuj zdjęcia źródłowe i szacowane ceny, a następnie otwieraj wybrany produkt w Kakobuy.', placeholder: 'Buty, bluzy, torby…', search: 'Szukaj', browse: 'Przeglądaj katalog' },
    sections: { categories: 'Przeglądaj według kategorii', categoriesBody: 'Poznaj aktualne kategorie katalogu źródłowego.', recent: 'Ostatnio dodane produkty', recentBody: 'Produkty, ceny i obrazy są pobierane bezpośrednio z kakobuymake.com.', viewAll: 'Zobacz wszystkie produkty', details: 'Zobacz szczegóły', sourceLive: 'Źródło na żywo' },
    listing: { title: 'Arkusz Kakobuy', body: 'Przeglądaj aktualny publiczny katalog z kakobuymake.com.', sort: 'Sortuj', newest: 'Najnowsze', priceLow: 'Cena: rosnąco', priceHigh: 'Cena: malejąco', name: 'Nazwa', noResults: 'Nie znaleziono pasujących produktów.', sourceError: 'Katalog źródłowy jest chwilowo niedostępny. Spróbuj ponownie później.', previous: 'Poprzednia', next: 'Następna' },
    seo: { title: 'Porównaj produkty przed otwarciem Kakobuy', body: 'Ten niezależny katalog porządkuje publiczne oferty sprzedawców. Zawsze potwierdzaj ostateczną cenę, stan i opcje w Kakobuy.', searchTitle: 'Szukaj produktów i kategorii', searchBody: 'Użyj wyraźnej nazwy produktu, marki lub kategorii.', photosTitle: 'Sprawdź zdjęcia źródłowe', photosBody: 'Galerie pokazują tylko obrazy opublikowane w odpowiedniej ofercie źródłowej.', checkoutTitle: 'Kontynuuj w Kakobuy', checkoutBody: 'Przed zamówieniem otwórz stronę produktu Kakobuy i sprawdź aktualne informacje.' },
    faqTitle: 'Najczęstsze pytania o Arkusz Kakobuy',
    faqs: [['Czym jest ten Arkusz Kakobuy?', 'To niezależny katalog publicznych ofert dostarczanych przez kakobuymake.com. Nie sprzedaje produktów ani nie obsługuje zamówień.'], ['Skąd pochodzą produkty?', 'Tytuły, ceny, kategorie i obrazy są pobierane z kakobuymake.com podczas otwierania strony.'], ['Czy ceny są gwarantowane?', 'Nie. Potwierdź aktualną cenę, stan i wybraną opcję w Kakobuy.'], ['Czy wszystkie zdjęcia są zdjęciami QC?', 'Nie. Pokazywane są obrazy z oferty źródłowej i są nazywane QC tylko wtedy, gdy źródło tak je oznacza.'], ['Jak kupić produkt?', 'Kliknij kartę produktu, aby otworzyć bezpośrednio odpowiednią stronę w Kakobuy.'], ['Dlaczego produkt może zniknąć?', 'Katalog źródłowy lub oferta sprzedawcy może zostać zmieniona albo usunięta. Witryna nie utrzymuje osobnej bazy produktów.']],
    product: { gallery: 'Galeria źródłowa', sourceRecord: 'Zobacz źródło', openKakobuy: 'Otwórz w Kakobuy', currentNotice: 'Cena, stan i opcje mogą się zmienić. Potwierdź dane w Kakobuy.', unavailable: 'Ta oferta źródłowa jest niedostępna.' }
  },
  pt: {
    nav: { home: 'Início', spreadsheet: 'Catálogo', categories: 'Categorias', faq: 'FAQ' },
    hero: { eyebrow: 'Catálogo ao vivo de kakobuymake.com', title: 'Planilha Kakobuy', body: 'Pesquise produtos, compare fotos de origem e preços estimados e abra o item escolhido no Kakobuy.', placeholder: 'Tênis, moletons, bolsas…', search: 'Pesquisar', browse: 'Ver o catálogo' },
    sections: { categories: 'Explorar por categoria', categoriesBody: 'Explore as categorias atuais do catálogo de origem.', recent: 'Itens adicionados recentemente', recentBody: 'Produtos, preços e imagens são carregados diretamente de kakobuymake.com.', viewAll: 'Ver todos os produtos', details: 'Ver detalhes', sourceLive: 'Fonte ao vivo' },
    listing: { title: 'Planilha Kakobuy', body: 'Explore o catálogo público atual de kakobuymake.com.', sort: 'Ordenar', newest: 'Mais recentes', priceLow: 'Preço: menor para maior', priceHigh: 'Preço: maior para menor', name: 'Nome', noResults: 'Nenhum produto correspondente foi encontrado.', sourceError: 'O catálogo de origem está temporariamente indisponível. Tente novamente em breve.', previous: 'Anterior', next: 'Próxima' },
    seo: { title: 'Compare produtos antes de abrir o Kakobuy', body: 'Este catálogo independente organiza anúncios públicos de vendedores. Confirme sempre o preço final, estoque e opções no Kakobuy.', searchTitle: 'Pesquisar produtos e categorias', searchBody: 'Use um termo claro de produto, marca ou categoria.', photosTitle: 'Ver fotos de origem', photosBody: 'As galerias mostram apenas imagens publicadas no anúncio de origem correspondente.', checkoutTitle: 'Continuar no Kakobuy', checkoutBody: 'Abra a página do item no Kakobuy e confira as informações atuais antes de comprar.' },
    faqTitle: 'Perguntas frequentes sobre a Planilha Kakobuy',
    faqs: [['O que é esta Planilha Kakobuy?', 'É um catálogo independente de anúncios públicos fornecidos por kakobuymake.com. Não vende produtos nem processa pedidos.'], ['De onde vêm os produtos?', 'Títulos, preços, categorias e imagens são solicitados a kakobuymake.com quando a página é aberta.'], ['Os preços são garantidos?', 'Não. Confirme o preço atual, o estoque e a opção escolhida no Kakobuy.'], ['Todas as fotos são fotos QC?', 'Não. São exibidas as imagens do anúncio de origem e elas só são chamadas de QC quando a fonte as identifica assim.'], ['Como compro um item?', 'Clique no cartão do produto para abrir diretamente a página correspondente no Kakobuy.'], ['Por que um produto pode desaparecer?', 'O catálogo de origem ou anúncio do vendedor pode ser alterado ou removido. O site não mantém um banco de dados separado.']],
    product: { gallery: 'Galeria de origem', sourceRecord: 'Ver fonte', openKakobuy: 'Abrir no Kakobuy', currentNotice: 'Preço, estoque e opções podem mudar. Confirme os dados no Kakobuy.', unavailable: 'Este anúncio de origem não está disponível.' }
  },
  ro: {
    nav: { home: 'Acasă', spreadsheet: 'Catalog', categories: 'Categorii', faq: 'Întrebări' },
    hero: { eyebrow: 'Catalog live de pe kakobuymake.com', title: 'Tabel Kakobuy', body: 'Caută produse, compară fotografiile și prețurile estimate, apoi deschide articolul ales în Kakobuy.', placeholder: 'Încearcă adidași, hanorace, genți…', search: 'Caută', browse: 'Răsfoiește catalogul' },
    sections: { categories: 'Răsfoiește după categorie', categoriesBody: 'Explorează categoriile publicate în catalogul sursă.', recent: 'Produse adăugate recent', recentBody: 'Produsele, prețurile și imaginile sunt citite direct de pe kakobuymake.com.', viewAll: 'Vezi toate produsele', details: 'Vezi detalii', sourceLive: 'Sursă live' },
    listing: { title: 'Tabel Kakobuy', body: 'Răsfoiește catalogul public actual de pe kakobuymake.com.', sort: 'Sortează', newest: 'Cele mai noi', priceLow: 'Preț: crescător', priceHigh: 'Preț: descrescător', name: 'Nume', noResults: 'Nu au fost găsite produse potrivite.', sourceError: 'Catalogul sursă nu este disponibil momentan. Încearcă din nou în curând.', previous: 'Anterior', next: 'Următor' },
    seo: { title: 'Compară produsele înainte de a deschide Kakobuy', body: 'Acest catalog independent organizează listările publice. Verifică întotdeauna în Kakobuy prețul final, stocul și opțiunile.', searchTitle: 'Caută produse și categorii', searchBody: 'Folosește un nume clar de produs, marcă sau categorie.', photosTitle: 'Verifică fotografiile sursă', photosBody: 'Galeriile afișează numai imaginile publicate în listarea sursă.', checkoutTitle: 'Continuă în Kakobuy', checkoutBody: 'Deschide pagina produsului Kakobuy și verifică informațiile actuale înainte de comandă.' },
    faqTitle: 'Întrebări frecvente despre Tabelul Kakobuy',
    faqs: [['Ce este acest Tabel Kakobuy?', 'Este un catalog independent pentru listările publice furnizate de kakobuymake.com. Nu vinde produse și nu procesează comenzi.'], ['De unde provin produsele?', 'Titlurile, prețurile, categoriile și imaginile sunt solicitate de la kakobuymake.com când pagina este deschisă.'], ['Prețurile sunt garantate?', 'Nu. Confirmă prețul actual, stocul și opțiunea aleasă în Kakobuy.'], ['Toate fotografiile sunt QC?', 'Nu. Sunt afișate imaginile publicate în înregistrarea sursă și sunt numite QC numai când sursa le identifică astfel.'], ['Cum cumpăr un produs?', 'Apasă pe cardul produsului pentru a deschide direct pagina corespunzătoare în Kakobuy.'], ['De ce poate dispărea un produs?', 'Catalogul sursă sau listarea vânzătorului poate fi modificată ori eliminată. Site-ul nu păstrează o bază de date separată.']],
    product: { gallery: 'Galerie sursă', sourceRecord: 'Vezi sursa', openKakobuy: 'Deschide în Kakobuy', currentNotice: 'Prețul, stocul și opțiunile se pot schimba. Confirmă detaliile în Kakobuy.', unavailable: 'Această listare nu este disponibilă.' }
  },
  nl: {
    nav: { home: 'Home', spreadsheet: 'Catalogus', categories: 'Categorieën', faq: 'FAQ' },
    hero: { eyebrow: 'Live catalogus van kakobuymake.com', title: 'Kakobuy Spreadsheet', body: 'Zoek producten, vergelijk bronfoto’s en geschatte prijzen en open het gekozen artikel in Kakobuy.', placeholder: 'Sneakers, hoodies, tassen…', search: 'Zoeken', browse: 'Bekijk de catalogus' },
    sections: { categories: 'Bladeren op categorie', categoriesBody: 'Bekijk de huidige categorieën in de broncatalogus.', recent: 'Recent toegevoegde producten', recentBody: 'Producten, prijzen en afbeeldingen worden rechtstreeks van kakobuymake.com geladen.', viewAll: 'Alle producten bekijken', details: 'Details bekijken', sourceLive: 'Live bron' },
    listing: { title: 'Kakobuy Spreadsheet', body: 'Bekijk de huidige openbare catalogus van kakobuymake.com.', sort: 'Sorteren', newest: 'Nieuwste', priceLow: 'Prijs: laag naar hoog', priceHigh: 'Prijs: hoog naar laag', name: 'Naam', noResults: 'Geen overeenkomende producten gevonden.', sourceError: 'De broncatalogus is tijdelijk niet beschikbaar. Probeer het later opnieuw.', previous: 'Vorige', next: 'Volgende' },
    seo: { title: 'Vergelijk producten voordat je Kakobuy opent', body: 'Deze onafhankelijke catalogus ordent openbare verkopersadvertenties. Controleer de uiteindelijke prijs, voorraad en opties altijd in Kakobuy.', searchTitle: 'Producten en categorieën zoeken', searchBody: 'Gebruik een duidelijke product-, merk- of categorienaam.', photosTitle: 'Bronfoto’s bekijken', photosBody: 'Galerijen tonen alleen afbeeldingen uit de bijbehorende bronadvertentie.', checkoutTitle: 'Doorgaan in Kakobuy', checkoutBody: 'Open de Kakobuy-productpagina en controleer de actuele informatie voordat je bestelt.' },
    faqTitle: 'Veelgestelde vragen over de Kakobuy Spreadsheet',
    faqs: [['Wat is deze Kakobuy Spreadsheet?', 'Het is een onafhankelijke catalogus van openbare advertenties van kakobuymake.com. De site verkoopt geen producten en verwerkt geen bestellingen.'], ['Waar komen de producten vandaan?', 'Titels, prijzen, categorieën en afbeeldingen worden bij het openen van een pagina opgehaald van kakobuymake.com.'], ['Zijn de prijzen gegarandeerd?', 'Nee. Controleer de actuele prijs, voorraad en geselecteerde optie in Kakobuy.'], ['Zijn alle productfoto’s QC-foto’s?', 'Nee. We tonen de afbeeldingen van de bronadvertentie en noemen ze alleen QC als de bron ze zo aanduidt.'], ['Hoe koop ik een artikel?', 'Klik op de productkaart om de bijbehorende pagina direct in Kakobuy te openen.'], ['Waarom kan een product verdwijnen?', 'De broncatalogus of verkopersadvertentie kan worden gewijzigd of verwijderd. De site bewaart geen aparte productdatabase.']],
    product: { gallery: 'Brongalerij', sourceRecord: 'Bron bekijken', openKakobuy: 'Openen in Kakobuy', currentNotice: 'Prijs, voorraad en opties kunnen veranderen. Controleer de gegevens in Kakobuy.', unavailable: 'Deze bronadvertentie is niet beschikbaar.' }
  },
  sv: {
    nav: { home: 'Hem', spreadsheet: 'Katalog', categories: 'Kategorier', faq: 'FAQ' },
    hero: { eyebrow: 'Livekatalog från kakobuymake.com', title: 'Kakobuy Kalkylblad', body: 'Sök produkter, jämför källbilder och uppskattade priser och öppna sedan den valda varan i Kakobuy.', placeholder: 'Sneakers, hoodies, väskor…', search: 'Sök', browse: 'Bläddra i katalogen' },
    sections: { categories: 'Bläddra efter kategori', categoriesBody: 'Utforska de aktuella kategorierna i källkatalogen.', recent: 'Nyligen tillagda varor', recentBody: 'Produkter, priser och bilder hämtas direkt från kakobuymake.com.', viewAll: 'Visa alla produkter', details: 'Visa detaljer', sourceLive: 'Livekälla' },
    listing: { title: 'Kakobuy Kalkylblad', body: 'Bläddra i den aktuella offentliga katalogen från kakobuymake.com.', sort: 'Sortera', newest: 'Nyast', priceLow: 'Pris: lågt till högt', priceHigh: 'Pris: högt till lågt', name: 'Namn', noResults: 'Inga matchande produkter hittades.', sourceError: 'Källkatalogen är tillfälligt otillgänglig. Försök igen snart.', previous: 'Föregående', next: 'Nästa' },
    seo: { title: 'Jämför produkter innan du öppnar Kakobuy', body: 'Den här oberoende katalogen ordnar offentliga säljarannonser. Bekräfta alltid slutpris, lager och alternativ i Kakobuy.', searchTitle: 'Sök produkter och kategorier', searchBody: 'Använd ett tydligt produkt-, varumärkes- eller kategorinamn.', photosTitle: 'Granska källbilder', photosBody: 'Gallerier visar endast bilder från motsvarande källannons.', checkoutTitle: 'Fortsätt i Kakobuy', checkoutBody: 'Öppna Kakobuy-produktsidan och kontrollera aktuell information innan du beställer.' },
    faqTitle: 'Vanliga frågor om Kakobuy Kalkylblad',
    faqs: [['Vad är detta Kakobuy Kalkylblad?', 'Det är en oberoende katalog över offentliga annonser från kakobuymake.com. Den säljer inga produkter och behandlar inga beställningar.'], ['Varifrån kommer produkterna?', 'Titlar, priser, kategorier och bilder hämtas från kakobuymake.com när en sida öppnas.'], ['Är priserna garanterade?', 'Nej. Bekräfta aktuellt pris, lager och valt alternativ i Kakobuy.'], ['Är alla produktbilder QC-bilder?', 'Nej. Vi visar bilderna från källannonsen och kallar dem bara QC när källan identifierar dem så.'], ['Hur köper jag en vara?', 'Klicka på produktkortet för att öppna motsvarande sida direkt i Kakobuy.'], ['Varför kan en produkt försvinna?', 'Källkatalogen eller säljarannonsen kan ändras eller tas bort. Webbplatsen lagrar ingen separat produktdatabas.']],
    product: { gallery: 'Källgalleri', sourceRecord: 'Visa källa', openKakobuy: 'Öppna i Kakobuy', currentNotice: 'Pris, lager och alternativ kan ändras. Bekräfta uppgifterna i Kakobuy.', unavailable: 'Den här källannonsen är inte tillgänglig.' }
  },
  da: {
    nav: { home: 'Hjem', spreadsheet: 'Katalog', categories: 'Kategorier', faq: 'FAQ' },
    hero: { eyebrow: 'Livekatalog fra kakobuymake.com', title: 'Kakobuy-regneark', body: 'Søg efter produkter, sammenlign kildebilleder og estimerede priser, og åbn derefter varen i Kakobuy.', placeholder: 'Prøv sneakers, hættetrøjer, tasker…', search: 'Søg', browse: 'Gennemse kataloget' },
    sections: { categories: 'Gennemse efter kategori', categoriesBody: 'Udforsk de aktuelle kategorier i kildekataloget.', recent: 'Senest tilføjede varer', recentBody: 'Produkter, priser og billeder hentes direkte fra kakobuymake.com.', viewAll: 'Se alle produkter', details: 'Se detaljer', sourceLive: 'Livekilde' },
    listing: { title: 'Kakobuy-regneark', body: 'Gennemse det aktuelle offentlige katalog fra kakobuymake.com.', sort: 'Sortér', newest: 'Nyeste', priceLow: 'Pris: lav til høj', priceHigh: 'Pris: høj til lav', name: 'Navn', noResults: 'Der blev ikke fundet matchende varer.', sourceError: 'Kildekataloget er midlertidigt utilgængeligt. Prøv igen senere.', previous: 'Forrige', next: 'Næste' },
    seo: { title: 'Sammenlign varer, før du åbner Kakobuy', body: 'Dette uafhængige katalog organiserer offentlige sælgerannoncer. Bekræft altid endelig pris, lager og muligheder i Kakobuy.', searchTitle: 'Søg efter produkter og kategorier', searchBody: 'Brug et tydeligt produkt-, mærke- eller kategorinavn.', photosTitle: 'Se kildebilleder', photosBody: 'Gallerier viser kun billeder fra den tilsvarende kildeannonce.', checkoutTitle: 'Fortsæt i Kakobuy', checkoutBody: 'Åbn Kakobuy-varesiden, og tjek de nyeste oplysninger før bestilling.' },
    faqTitle: 'Ofte stillede spørgsmål om Kakobuy-regnearket',
    faqs: [['Hvad er dette Kakobuy-regneark?', 'Det er et uafhængigt katalog over offentlige annoncer fra kakobuymake.com. Det sælger ikke produkter og behandler ikke ordrer.'], ['Hvor kommer produkterne fra?', 'Titler, priser, kategorier og billeder hentes fra kakobuymake.com, når siden åbnes.'], ['Er priserne garanteret?', 'Nej. Bekræft den aktuelle pris, lagerstatus og valgte mulighed i Kakobuy.'], ['Er alle billeder QC-billeder?', 'Nej. Kun billeder fra kildeannoncen vises, og de kaldes kun QC, når kilden angiver det.'], ['Hvordan køber jeg en vare?', 'Klik på produktkortet for at åbne den tilsvarende side direkte i Kakobuy.'], ['Hvorfor kan en vare forsvinde?', 'Kildekataloget eller sælgerannoncen kan ændres eller fjernes. Webstedet gemmer ikke en separat produktdatabase.']],
    product: { gallery: 'Kildegalleri', sourceRecord: 'Se kilde', openKakobuy: 'Åbn i Kakobuy', currentNotice: 'Pris, lager og muligheder kan ændre sig. Bekræft detaljerne i Kakobuy.', unavailable: 'Denne kildeannonce er ikke tilgængelig.' }
  },
  fi: {
    nav: { home: 'Etusivu', spreadsheet: 'Luettelo', categories: 'Kategoriat', faq: 'UKK' },
    hero: { eyebrow: 'Reaaliaikainen luettelo kakobuymake.com-sivustolta', title: 'Kakobuy-taulukko', body: 'Etsi tuotteita, vertaa lähdekuvia ja arvioituja hintoja ja avaa valittu tuote Kakobuyssa.', placeholder: 'Kokeile lenkkareita, huppareita, laukkuja…', search: 'Hae', browse: 'Selaa luetteloa' },
    sections: { categories: 'Selaa kategorioittain', categoriesBody: 'Tutustu lähdeluettelon nykyisiin kategorioihin.', recent: 'Viimeksi lisätyt tuotteet', recentBody: 'Tuotteet, hinnat ja kuvat luetaan suoraan kakobuymake.com-sivustolta.', viewAll: 'Näytä kaikki tuotteet', details: 'Näytä tiedot', sourceLive: 'Reaaliaikainen lähde' },
    listing: { title: 'Kakobuy-taulukko', body: 'Selaa kakobuymake.com-sivuston julkista luetteloa.', sort: 'Lajittele', newest: 'Uusimmat', priceLow: 'Hinta: halvin ensin', priceHigh: 'Hinta: kallein ensin', name: 'Nimi', noResults: 'Vastaavia tuotteita ei löytynyt.', sourceError: 'Lähdeluettelo ei ole tilapäisesti käytettävissä. Yritä pian uudelleen.', previous: 'Edellinen', next: 'Seuraava' },
    seo: { title: 'Vertaa tuotteita ennen Kakobuyn avaamista', body: 'Tämä riippumaton luettelo järjestää julkiset myyjäilmoitukset. Tarkista lopullinen hinta, varasto ja vaihtoehdot Kakobuysta.', searchTitle: 'Hae tuotteita ja kategorioita', searchBody: 'Käytä selkeää tuotteen, tuotemerkin tai kategorian nimeä.', photosTitle: 'Tarkista lähdekuvat', photosBody: 'Galleriat näyttävät vain lähdeilmoituksessa julkaistut kuvat.', checkoutTitle: 'Jatka Kakobuyssa', checkoutBody: 'Avaa Kakobuy-tuotesivu ja tarkista uusimmat tiedot ennen tilaamista.' },
    faqTitle: 'Kakobuy-taulukon usein kysytyt kysymykset',
    faqs: [['Mikä tämä Kakobuy-taulukko on?', 'Se on kakobuymake.com-sivuston julkisten ilmoitusten riippumaton luettelo. Se ei myy tuotteita tai käsittele tilauksia.'], ['Mistä tuotteet tulevat?', 'Nimet, hinnat, kategoriat ja kuvat haetaan kakobuymake.com-sivustolta sivua avattaessa.'], ['Ovatko hinnat taattuja?', 'Eivät. Tarkista ajantasainen hinta, varasto ja valittu vaihtoehto Kakobuysta.'], ['Ovatko kaikki kuvat QC-kuvia?', 'Eivät. Näytämme lähdeilmoituksen kuvat ja kutsumme niitä QC-kuviksi vain, jos lähde tekee niin.'], ['Miten ostan tuotteen?', 'Napsauta tuotekorttia avataksesi vastaavan sivun suoraan Kakobuyssa.'], ['Miksi tuote voi kadota?', 'Lähdeluettelo tai myyjäilmoitus voi muuttua tai poistua. Sivusto ei ylläpidä erillistä tuotetietokantaa.']],
    product: { gallery: 'Lähdegalleria', sourceRecord: 'Näytä lähde', openKakobuy: 'Avaa Kakobuyssa', currentNotice: 'Hinta, varasto ja vaihtoehdot voivat muuttua. Tarkista tiedot Kakobuysta.', unavailable: 'Tämä lähdeilmoitus ei ole saatavilla.' }
  },
  el: {
    nav: { home: 'Αρχική', spreadsheet: 'Κατάλογος', categories: 'Κατηγορίες', faq: 'Συχνές ερωτήσεις' },
    hero: { eyebrow: 'Ζωντανός κατάλογος από το kakobuymake.com', title: 'Φύλλο Kakobuy', body: 'Αναζητήστε προϊόντα, συγκρίνετε φωτογραφίες και εκτιμώμενες τιμές και ανοίξτε το επιλεγμένο είδος στο Kakobuy.', placeholder: 'Δοκιμάστε αθλητικά, φούτερ, τσάντες…', search: 'Αναζήτηση', browse: 'Περιήγηση στον κατάλογο' },
    sections: { categories: 'Περιήγηση ανά κατηγορία', categoriesBody: 'Εξερευνήστε τις τρέχουσες κατηγορίες του πηγαίου καταλόγου.', recent: 'Πρόσφατες καταχωρίσεις', recentBody: 'Τα προϊόντα, οι τιμές και οι εικόνες διαβάζονται απευθείας από το kakobuymake.com.', viewAll: 'Όλα τα προϊόντα', details: 'Προβολή λεπτομερειών', sourceLive: 'Ζωντανή πηγή' },
    listing: { title: 'Φύλλο Kakobuy', body: 'Περιηγηθείτε στον δημόσιο κατάλογο του kakobuymake.com.', sort: 'Ταξινόμηση', newest: 'Νεότερα', priceLow: 'Τιμή: χαμηλή προς υψηλή', priceHigh: 'Τιμή: υψηλή προς χαμηλή', name: 'Όνομα', noResults: 'Δεν βρέθηκαν προϊόντα που να ταιριάζουν.', sourceError: 'Ο πηγαίος κατάλογος δεν είναι προσωρινά διαθέσιμος. Δοκιμάστε ξανά σύντομα.', previous: 'Προηγούμενο', next: 'Επόμενο' },
    seo: { title: 'Συγκρίνετε προϊόντα πριν ανοίξετε το Kakobuy', body: 'Αυτός ο ανεξάρτητος κατάλογος οργανώνει δημόσιες καταχωρίσεις πωλητών. Επιβεβαιώνετε πάντα την τελική τιμή, το απόθεμα και τις επιλογές στο Kakobuy.', searchTitle: 'Αναζήτηση προϊόντων και κατηγοριών', searchBody: 'Χρησιμοποιήστε σαφή όρο προϊόντος, μάρκας ή κατηγορίας.', photosTitle: 'Έλεγχος φωτογραφιών πηγής', photosBody: 'Οι συλλογές εμφανίζουν μόνο εικόνες της αντίστοιχης καταχώρισης.', checkoutTitle: 'Συνέχεια στο Kakobuy', checkoutBody: 'Ανοίξτε τη σελίδα προϊόντος στο Kakobuy και ελέγξτε τα στοιχεία πριν την παραγγελία.' },
    faqTitle: 'Συχνές ερωτήσεις για το Φύλλο Kakobuy',
    faqs: [['Τι είναι αυτό το Φύλλο Kakobuy;', 'Είναι ένας ανεξάρτητος κατάλογος δημόσιων καταχωρίσεων από το kakobuymake.com. Δεν πουλά προϊόντα και δεν επεξεργάζεται παραγγελίες.'], ['Από πού προέρχονται τα προϊόντα;', 'Οι τίτλοι, οι τιμές, οι κατηγορίες και οι εικόνες ζητούνται από το kakobuymake.com όταν ανοίγει η σελίδα.'], ['Οι τιμές είναι εγγυημένες;', 'Όχι. Επιβεβαιώστε την τρέχουσα τιμή, το απόθεμα και την επιλογή στο Kakobuy.'], ['Είναι όλες οι φωτογραφίες QC;', 'Όχι. Εμφανίζονται οι εικόνες της πηγής και χαρακτηρίζονται QC μόνο όταν το αναφέρει η πηγή.'], ['Πώς αγοράζω ένα προϊόν;', 'Πατήστε την κάρτα προϊόντος για να ανοίξετε απευθείας την αντίστοιχη σελίδα στο Kakobuy.'], ['Γιατί μπορεί να εξαφανιστεί ένα προϊόν;', 'Ο πηγαίος κατάλογος ή η καταχώριση πωλητή μπορεί να αλλάξει ή να αφαιρεθεί. Δεν διατηρείται ξεχωριστή βάση προϊόντων.']],
    product: { gallery: 'Συλλογή πηγής', sourceRecord: 'Προβολή πηγής', openKakobuy: 'Άνοιγμα στο Kakobuy', currentNotice: 'Η τιμή, το απόθεμα και οι επιλογές μπορεί να αλλάξουν. Επιβεβαιώστε τα στοιχεία στο Kakobuy.', unavailable: 'Αυτή η καταχώριση δεν είναι διαθέσιμη.' }
  },
  cs: {
    nav: { home: 'Domů', spreadsheet: 'Katalog', categories: 'Kategorie', faq: 'Časté dotazy' },
    hero: { eyebrow: 'Živý katalog z kakobuymake.com', title: 'Kakobuy tabulka', body: 'Vyhledávejte produkty, porovnávejte zdrojové fotografie a odhadované ceny a otevřete vybranou položku v Kakobuy.', placeholder: 'Zkuste tenisky, mikiny, tašky…', search: 'Hledat', browse: 'Procházet katalog' },
    sections: { categories: 'Procházet podle kategorie', categoriesBody: 'Prozkoumejte aktuální kategorie zdrojového katalogu.', recent: 'Nedávno přidané položky', recentBody: 'Produkty, ceny a obrázky se načítají přímo z kakobuymake.com.', viewAll: 'Zobrazit všechny produkty', details: 'Zobrazit podrobnosti', sourceLive: 'Živý zdroj' },
    listing: { title: 'Kakobuy tabulka', body: 'Procházejte aktuální veřejný katalog z kakobuymake.com.', sort: 'Seřadit', newest: 'Nejnovější', priceLow: 'Cena: od nejnižší', priceHigh: 'Cena: od nejvyšší', name: 'Název', noResults: 'Nebyly nalezeny žádné odpovídající položky.', sourceError: 'Zdrojový katalog je dočasně nedostupný. Zkuste to prosím později.', previous: 'Předchozí', next: 'Další' },
    seo: { title: 'Porovnejte položky před otevřením Kakobuy', body: 'Tento nezávislý katalog organizuje veřejné nabídky prodejců. Konečnou cenu, sklad a možnosti vždy ověřte v Kakobuy.', searchTitle: 'Hledat produkty a kategorie', searchBody: 'Použijte přesný název produktu, značky nebo kategorie.', photosTitle: 'Prohlédnout zdrojové fotografie', photosBody: 'Galerie zobrazují pouze obrázky zveřejněné u odpovídající nabídky.', checkoutTitle: 'Pokračovat v Kakobuy', checkoutBody: 'Před objednáním otevřete stránku položky v Kakobuy a ověřte aktuální informace.' },
    faqTitle: 'Časté dotazy ke Kakobuy tabulce',
    faqs: [['Co je tato Kakobuy tabulka?', 'Je to nezávislý katalog veřejných nabídek z kakobuymake.com. Neprodává produkty ani nezpracovává objednávky.'], ['Odkud produkty pocházejí?', 'Názvy, ceny, kategorie a obrázky se při otevření stránky načítají z kakobuymake.com.'], ['Jsou ceny zaručené?', 'Ne. Ověřte aktuální cenu, sklad a vybranou možnost v Kakobuy.'], ['Jsou všechny fotografie QC?', 'Ne. Zobrazují se obrázky ze zdrojové nabídky a jako QC jsou označeny jen tehdy, když to uvádí zdroj.'], ['Jak produkt koupím?', 'Kliknutím na kartu produktu otevřete příslušnou stránku přímo v Kakobuy.'], ['Proč může produkt zmizet?', 'Zdrojový katalog nebo nabídka prodejce se může změnit či být odstraněna. Web neuchovává samostatnou databázi produktů.']],
    product: { gallery: 'Zdrojová galerie', sourceRecord: 'Zobrazit zdroj', openKakobuy: 'Otevřít v Kakobuy', currentNotice: 'Cena, sklad a možnosti se mohou změnit. Potvrďte údaje v Kakobuy.', unavailable: 'Tato zdrojová nabídka není dostupná.' }
  },
  hu: {
    nav: { home: 'Kezdőlap', spreadsheet: 'Katalógus', categories: 'Kategóriák', faq: 'GYIK' },
    hero: { eyebrow: 'Élő katalógus a kakobuymake.com oldalról', title: 'Kakobuy táblázat', body: 'Keressen termékeket, hasonlítsa össze a forrásképeket és a becsült árakat, majd nyissa meg a kiválasztott terméket a Kakobuy oldalán.', placeholder: 'Próbálja: cipők, pulóverek, táskák…', search: 'Keresés', browse: 'Katalógus böngészése' },
    sections: { categories: 'Böngészés kategória szerint', categoriesBody: 'Fedezze fel a forráskatalógus aktuális kategóriáit.', recent: 'Legutóbb hozzáadott termékek', recentBody: 'A termékek, árak és képek közvetlenül a kakobuymake.com oldalról érkeznek.', viewAll: 'Összes termék', details: 'Részletek', sourceLive: 'Élő forrás' },
    listing: { title: 'Kakobuy táblázat', body: 'Böngéssze a kakobuymake.com aktuális nyilvános katalógusát.', sort: 'Rendezés', newest: 'Legújabb', priceLow: 'Ár: növekvő', priceHigh: 'Ár: csökkenő', name: 'Név', noResults: 'Nem található megfelelő termék.', sourceError: 'A forráskatalógus átmenetileg nem érhető el. Próbálja újra később.', previous: 'Előző', next: 'Következő' },
    seo: { title: 'Hasonlítsa össze a termékeket a Kakobuy megnyitása előtt', body: 'Ez a független katalógus nyilvános eladói ajánlatokat rendez. A végleges árat, készletet és opciókat mindig a Kakobuy oldalán ellenőrizze.', searchTitle: 'Termékek és kategóriák keresése', searchBody: 'Használjon pontos termék-, márka- vagy kategórianevet.', photosTitle: 'Forrásképek áttekintése', photosBody: 'A galériák csak a megfelelő forrásbejegyzés képeit jelenítik meg.', checkoutTitle: 'Tovább a Kakobuy oldalára', checkoutBody: 'Rendelés előtt nyissa meg a Kakobuy termékoldalát és ellenőrizze a legfrissebb adatokat.' },
    faqTitle: 'Kakobuy táblázat – gyakori kérdések',
    faqs: [['Mi ez a Kakobuy táblázat?', 'A kakobuymake.com nyilvános ajánlatainak független katalógusa. Nem értékesít termékeket és nem kezel rendeléseket.'], ['Honnan származnak a termékek?', 'A címek, árak, kategóriák és képek az oldal megnyitásakor a kakobuymake.com oldalról töltődnek be.'], ['Garantáltak az árak?', 'Nem. Ellenőrizze az aktuális árat, készletet és kiválasztott opciót a Kakobuy oldalán.'], ['Minden fénykép QC-kép?', 'Nem. A forrásajánlat képei jelennek meg, és csak akkor nevezzük őket QC-nek, ha a forrás így jelöli.'], ['Hogyan vásárolhatok terméket?', 'Kattintson a termékkártyára a megfelelő Kakobuy-oldal közvetlen megnyitásához.'], ['Miért tűnhet el egy termék?', 'A forráskatalógus vagy az eladói ajánlat módosulhat vagy eltávolítható. Az oldal nem tart fenn külön termékadatbázist.']],
    product: { gallery: 'Forrásgaléria', sourceRecord: 'Forrás megtekintése', openKakobuy: 'Megnyitás a Kakobuy oldalán', currentNotice: 'Az ár, a készlet és az opciók változhatnak. Ellenőrizze az adatokat a Kakobuy oldalán.', unavailable: 'Ez a forrásbejegyzés nem érhető el.' }
  },
  bg: {
    nav: { home: 'Начало', spreadsheet: 'Каталог', categories: 'Категории', faq: 'Въпроси' },
    hero: { eyebrow: 'Каталог на живо от kakobuymake.com', title: 'Kakobuy таблица', body: 'Търсете продукти, сравнявайте снимки и прогнозни цени и отворете избрания артикул в Kakobuy.', placeholder: 'Опитайте маратонки, суичъри, чанти…', search: 'Търсене', browse: 'Разгледайте каталога' },
    sections: { categories: 'Преглед по категории', categoriesBody: 'Разгледайте текущите категории в каталога източник.', recent: 'Наскоро добавени продукти', recentBody: 'Продуктите, цените и изображенията се зареждат директно от kakobuymake.com.', viewAll: 'Всички продукти', details: 'Подробности', sourceLive: 'Източник на живо' },
    listing: { title: 'Kakobuy таблица', body: 'Разгледайте текущия публичен каталог от kakobuymake.com.', sort: 'Сортиране', newest: 'Най-нови', priceLow: 'Цена: възходящо', priceHigh: 'Цена: низходящо', name: 'Име', noResults: 'Не са намерени подходящи продукти.', sourceError: 'Каталогът източник временно не е достъпен. Опитайте отново скоро.', previous: 'Предишна', next: 'Следваща' },
    seo: { title: 'Сравнете продуктите, преди да отворите Kakobuy', body: 'Този независим каталог организира публични обяви на продавачи. Винаги проверявайте крайната цена, наличността и опциите в Kakobuy.', searchTitle: 'Търсене на продукти и категории', searchBody: 'Използвайте ясно име на продукт, марка или категория.', photosTitle: 'Преглед на снимките от източника', photosBody: 'Галериите показват само изображенията от съответната обява.', checkoutTitle: 'Продължете в Kakobuy', checkoutBody: 'Отворете страницата на артикула в Kakobuy и проверете актуалните данни преди поръчка.' },
    faqTitle: 'Често задавани въпроси за Kakobuy таблицата',
    faqs: [['Какво представлява тази Kakobuy таблица?', 'Това е независим каталог на публични обяви от kakobuymake.com. Той не продава продукти и не обработва поръчки.'], ['Откъде идват продуктите?', 'Заглавията, цените, категориите и изображенията се зареждат от kakobuymake.com при отваряне на страницата.'], ['Гарантирани ли са цените?', 'Не. Проверете текущата цена, наличността и избраната опция в Kakobuy.'], ['Всички снимки ли са QC?', 'Не. Показват се изображенията от източника и се наричат QC само когато източникът ги обозначава така.'], ['Как да купя продукт?', 'Щракнете върху продуктовата карта, за да отворите директно съответната страница в Kakobuy.'], ['Защо даден продукт може да изчезне?', 'Каталогът източник или обявата на продавача може да бъде променена или премахната. Сайтът не поддържа отделна продуктова база.']],
    product: { gallery: 'Галерия от източника', sourceRecord: 'Вижте източника', openKakobuy: 'Отвори в Kakobuy', currentNotice: 'Цената, наличността и опциите може да се променят. Потвърдете данните в Kakobuy.', unavailable: 'Тази обява не е достъпна.' }
  },
  sk: {
    nav: { home: 'Domov', spreadsheet: 'Katalóg', categories: 'Kategórie', faq: 'Časté otázky' },
    hero: { eyebrow: 'Živý katalóg z kakobuymake.com', title: 'Kakobuy tabuľka', body: 'Vyhľadávajte produkty, porovnávajte zdrojové fotografie a odhadované ceny a otvorte vybranú položku v Kakobuy.', placeholder: 'Skúste tenisky, mikiny, tašky…', search: 'Hľadať', browse: 'Prehľadávať katalóg' },
    sections: { categories: 'Prehľadávať podľa kategórie', categoriesBody: 'Preskúmajte aktuálne kategórie zdrojového katalógu.', recent: 'Nedávno pridané položky', recentBody: 'Produkty, ceny a obrázky sa načítavajú priamo z kakobuymake.com.', viewAll: 'Zobraziť všetky produkty', details: 'Zobraziť podrobnosti', sourceLive: 'Živý zdroj' },
    listing: { title: 'Kakobuy tabuľka', body: 'Prehľadávajte aktuálny verejný katalóg z kakobuymake.com.', sort: 'Zoradiť', newest: 'Najnovšie', priceLow: 'Cena: od najnižšej', priceHigh: 'Cena: od najvyššej', name: 'Názov', noResults: 'Nenašli sa žiadne zodpovedajúce položky.', sourceError: 'Zdrojový katalóg je dočasne nedostupný. Skúste to neskôr.', previous: 'Predchádzajúca', next: 'Ďalšia' },
    seo: { title: 'Porovnajte položky pred otvorením Kakobuy', body: 'Tento nezávislý katalóg organizuje verejné ponuky predajcov. Konečnú cenu, sklad a možnosti vždy potvrďte v Kakobuy.', searchTitle: 'Hľadať produkty a kategórie', searchBody: 'Použite jasný názov produktu, značky alebo kategórie.', photosTitle: 'Prezrieť zdrojové fotografie', photosBody: 'Galérie zobrazujú iba obrázky z príslušnej zdrojovej ponuky.', checkoutTitle: 'Pokračovať v Kakobuy', checkoutBody: 'Pred objednaním otvorte stránku položky Kakobuy a skontrolujte aktuálne informácie.' },
    faqTitle: 'Časté otázky ku Kakobuy tabuľke',
    faqs: [['Čo je táto Kakobuy tabuľka?', 'Je to nezávislý katalóg verejných ponúk z kakobuymake.com. Nepredáva produkty ani nespracúva objednávky.'], ['Odkiaľ pochádzajú produkty?', 'Názvy, ceny, kategórie a obrázky sa pri otvorení stránky načítajú z kakobuymake.com.'], ['Sú ceny zaručené?', 'Nie. Overte aktuálnu cenu, sklad a vybranú možnosť v Kakobuy.'], ['Sú všetky fotografie QC?', 'Nie. Zobrazujú sa obrázky zo zdrojovej ponuky a ako QC sa označujú iba vtedy, keď to uvádza zdroj.'], ['Ako si kúpim produkt?', 'Kliknite na kartu produktu a otvoríte príslušnú stránku priamo v Kakobuy.'], ['Prečo môže produkt zmiznúť?', 'Zdrojový katalóg alebo ponuka predajcu sa môže zmeniť alebo odstrániť. Web neuchováva samostatnú databázu produktov.']],
    product: { gallery: 'Zdrojová galéria', sourceRecord: 'Zobraziť zdroj', openKakobuy: 'Otvoriť v Kakobuy', currentNotice: 'Cena, sklad a možnosti sa môžu zmeniť. Potvrďte údaje v Kakobuy.', unavailable: 'Táto zdrojová ponuka nie je dostupná.' }
  },
  hr: {
    nav: { home: 'Početna', spreadsheet: 'Katalog', categories: 'Kategorije', faq: 'Česta pitanja' },
    hero: { eyebrow: 'Katalog uživo s kakobuymake.com', title: 'Kakobuy tablica', body: 'Pretražite proizvode, usporedite izvorne fotografije i procijenjene cijene te otvorite odabrani proizvod u Kakobuyu.', placeholder: 'Isprobajte tenisice, hudice, torbe…', search: 'Pretraži', browse: 'Pregledaj katalog' },
    sections: { categories: 'Pregled po kategoriji', categoriesBody: 'Istražite trenutačne kategorije izvornog kataloga.', recent: 'Nedavno dodani proizvodi', recentBody: 'Proizvodi, cijene i slike čitaju se izravno s kakobuymake.com.', viewAll: 'Prikaži sve proizvode', details: 'Prikaži detalje', sourceLive: 'Izvor uživo' },
    listing: { title: 'Kakobuy tablica', body: 'Pregledajte trenutačni javni katalog s kakobuymake.com.', sort: 'Sortiraj', newest: 'Najnovije', priceLow: 'Cijena: niža prema višoj', priceHigh: 'Cijena: viša prema nižoj', name: 'Naziv', noResults: 'Nisu pronađeni odgovarajući proizvodi.', sourceError: 'Izvorni katalog trenutačno nije dostupan. Pokušajte uskoro ponovno.', previous: 'Prethodno', next: 'Sljedeće' },
    seo: { title: 'Usporedite proizvode prije otvaranja Kakobuya', body: 'Ovaj neovisni katalog organizira javne oglase prodavača. Konačnu cijenu, zalihu i opcije uvijek provjerite u Kakobuyu.', searchTitle: 'Pretražite proizvode i kategorije', searchBody: 'Upotrijebite jasan naziv proizvoda, robne marke ili kategorije.', photosTitle: 'Pregledajte izvorne fotografije', photosBody: 'Galerije prikazuju samo slike objavljene uz odgovarajući izvorni oglas.', checkoutTitle: 'Nastavite u Kakobuyu', checkoutBody: 'Otvorite Kakobuy stranicu proizvoda i provjerite najnovije podatke prije naručivanja.' },
    faqTitle: 'Česta pitanja o Kakobuy tablici',
    faqs: [['Što je ova Kakobuy tablica?', 'To je neovisni katalog javnih oglasa s kakobuymake.com. Ne prodaje proizvode i ne obrađuje narudžbe.'], ['Odakle dolaze proizvodi?', 'Naslovi, cijene, kategorije i slike učitavaju se s kakobuymake.com kada se stranica otvori.'], ['Jesu li cijene zajamčene?', 'Ne. Provjerite trenutačnu cijenu, zalihu i odabranu opciju u Kakobuyu.'], ['Jesu li sve fotografije QC?', 'Ne. Prikazuju se slike izvornog oglasa i nazivaju se QC samo kada ih izvor tako označi.'], ['Kako kupiti proizvod?', 'Kliknite karticu proizvoda kako biste izravno otvorili odgovarajuću stranicu u Kakobuyu.'], ['Zašto proizvod može nestati?', 'Izvorni katalog ili oglas prodavača može se promijeniti ili ukloniti. Stranica ne održava zasebnu bazu proizvoda.']],
    product: { gallery: 'Izvorna galerija', sourceRecord: 'Prikaži izvor', openKakobuy: 'Otvori u Kakobuyu', currentNotice: 'Cijena, zaliha i opcije mogu se promijeniti. Potvrdite podatke u Kakobuyu.', unavailable: 'Ovaj izvorni oglas nije dostupan.' }
  },
  sl: {
    nav: { home: 'Domov', spreadsheet: 'Katalog', categories: 'Kategorije', faq: 'Pogosta vprašanja' },
    hero: { eyebrow: 'Katalog v živo s kakobuymake.com', title: 'Kakobuy preglednica', body: 'Poiščite izdelke, primerjajte izvorne fotografije in ocenjene cene ter odprite izbrani izdelek v Kakobuyu.', placeholder: 'Poskusite superge, puloverje, torbe…', search: 'Išči', browse: 'Prebrskaj katalog' },
    sections: { categories: 'Brskaj po kategorijah', categoriesBody: 'Raziščite trenutne kategorije izvornega kataloga.', recent: 'Nedavno dodani izdelki', recentBody: 'Izdelki, cene in slike se berejo neposredno s kakobuymake.com.', viewAll: 'Prikaži vse izdelke', details: 'Prikaži podrobnosti', sourceLive: 'Vir v živo' },
    listing: { title: 'Kakobuy preglednica', body: 'Prebrskajte trenutni javni katalog s kakobuymake.com.', sort: 'Razvrsti', newest: 'Najnovejše', priceLow: 'Cena: od nižje do višje', priceHigh: 'Cena: od višje do nižje', name: 'Ime', noResults: 'Ni bilo najdenih ustreznih izdelkov.', sourceError: 'Izvorni katalog trenutno ni na voljo. Poskusite znova pozneje.', previous: 'Prejšnja', next: 'Naslednja' },
    seo: { title: 'Primerjajte izdelke pred odprtjem Kakobuya', body: 'Ta neodvisni katalog ureja javne ponudbe prodajalcev. Končno ceno, zalogo in možnosti vedno preverite v Kakobuyu.', searchTitle: 'Iščite izdelke in kategorije', searchBody: 'Uporabite jasno ime izdelka, blagovne znamke ali kategorije.', photosTitle: 'Preglejte izvorne fotografije', photosBody: 'Galerije prikazujejo samo slike ustrezne izvorne ponudbe.', checkoutTitle: 'Nadaljujte v Kakobuyu', checkoutBody: 'Pred naročilom odprite stran izdelka Kakobuy in preverite najnovejše informacije.' },
    faqTitle: 'Pogosta vprašanja o Kakobuy preglednici',
    faqs: [['Kaj je ta Kakobuy preglednica?', 'To je neodvisni katalog javnih ponudb s kakobuymake.com. Ne prodaja izdelkov in ne obdeluje naročil.'], ['Od kod prihajajo izdelki?', 'Naslovi, cene, kategorije in slike se ob odprtju strani naložijo s kakobuymake.com.'], ['Ali so cene zagotovljene?', 'Ne. Trenutno ceno, zalogo in izbrano možnost preverite v Kakobuyu.'], ['Ali so vse fotografije QC?', 'Ne. Prikazane so slike izvorne ponudbe in kot QC se označijo le, če jih tako označi vir.'], ['Kako kupim izdelek?', 'Kliknite kartico izdelka, da neposredno odprete ustrezno stran v Kakobuyu.'], ['Zakaj lahko izdelek izgine?', 'Izvorni katalog ali ponudba prodajalca se lahko spremeni ali odstrani. Stran ne vzdržuje ločene baze izdelkov.']],
    product: { gallery: 'Izvorna galerija', sourceRecord: 'Prikaži vir', openKakobuy: 'Odpri v Kakobuyu', currentNotice: 'Cena, zaloga in možnosti se lahko spremenijo. Podatke potrdite v Kakobuyu.', unavailable: 'Ta izvorna ponudba ni na voljo.' }
  },
  lt: {
    nav: { home: 'Pradžia', spreadsheet: 'Katalogas', categories: 'Kategorijos', faq: 'DUK' },
    hero: { eyebrow: 'Tiesioginis katalogas iš kakobuymake.com', title: 'Kakobuy lentelė', body: 'Ieškokite produktų, palyginkite šaltinio nuotraukas ir numatomas kainas, tada atidarykite pasirinktą prekę Kakobuy.', placeholder: 'Ieškokite sportbačių, džemperių, rankinių…', search: 'Ieškoti', browse: 'Naršyti katalogą' },
    sections: { categories: 'Naršyti pagal kategoriją', categoriesBody: 'Peržiūrėkite dabartines šaltinio katalogo kategorijas.', recent: 'Neseniai pridėtos prekės', recentBody: 'Produktai, kainos ir vaizdai skaitomi tiesiogiai iš kakobuymake.com.', viewAll: 'Visi produktai', details: 'Peržiūrėti informaciją', sourceLive: 'Tiesioginis šaltinis' },
    listing: { title: 'Kakobuy lentelė', body: 'Naršykite dabartinį viešą kakobuymake.com katalogą.', sort: 'Rūšiuoti', newest: 'Naujausi', priceLow: 'Kaina: nuo mažos iki didelės', priceHigh: 'Kaina: nuo didelės iki mažos', name: 'Pavadinimas', noResults: 'Atitinkančių prekių nerasta.', sourceError: 'Šaltinio katalogas laikinai nepasiekiamas. Bandykite dar kartą vėliau.', previous: 'Ankstesnis', next: 'Kitas' },
    seo: { title: 'Palyginkite prekes prieš atidarydami Kakobuy', body: 'Šis nepriklausomas katalogas tvarko viešus pardavėjų skelbimus. Galutinę kainą, likutį ir parinktis visada patikrinkite Kakobuy.', searchTitle: 'Ieškoti produktų ir kategorijų', searchBody: 'Naudokite aiškų produkto, prekės ženklo ar kategorijos pavadinimą.', photosTitle: 'Peržiūrėti šaltinio nuotraukas', photosBody: 'Galerijose rodomi tik atitinkamo šaltinio skelbimo vaizdai.', checkoutTitle: 'Tęsti Kakobuy', checkoutBody: 'Prieš užsakydami atidarykite Kakobuy prekės puslapį ir patikrinkite naujausią informaciją.' },
    faqTitle: 'Kakobuy lentelės DUK',
    faqs: [['Kas yra ši Kakobuy lentelė?', 'Tai nepriklausomas viešų kakobuymake.com skelbimų katalogas. Jis neparduoda produktų ir netvarko užsakymų.'], ['Iš kur gaunami produktai?', 'Pavadinimai, kainos, kategorijos ir vaizdai įkeliami iš kakobuymake.com atidarius puslapį.'], ['Ar kainos garantuotos?', 'Ne. Patikrinkite dabartinę kainą, likutį ir pasirinktą variantą Kakobuy.'], ['Ar visos nuotraukos yra QC?', 'Ne. Rodomi šaltinio skelbimo vaizdai ir jie vadinami QC tik tada, kai taip nurodo šaltinis.'], ['Kaip nusipirkti produktą?', 'Spustelėkite produkto kortelę, kad tiesiogiai atidarytumėte atitinkamą Kakobuy puslapį.'], ['Kodėl produktas gali dingti?', 'Šaltinio katalogas arba pardavėjo skelbimas gali būti pakeistas ar pašalintas. Svetainė neturi atskiros produktų duomenų bazės.']],
    product: { gallery: 'Šaltinio galerija', sourceRecord: 'Peržiūrėti šaltinį', openKakobuy: 'Atidaryti Kakobuy', currentNotice: 'Kaina, likutis ir parinktys gali keistis. Patvirtinkite informaciją Kakobuy.', unavailable: 'Šis šaltinio skelbimas nepasiekiamas.' }
  },
  lv: {
    nav: { home: 'Sākums', spreadsheet: 'Katalogs', categories: 'Kategorijas', faq: 'BUJ' },
    hero: { eyebrow: 'Tiešraides katalogs no kakobuymake.com', title: 'Kakobuy tabula', body: 'Meklējiet produktus, salīdziniet avota attēlus un aptuvenās cenas, pēc tam atveriet izvēlēto preci Kakobuy.', placeholder: 'Meklējiet sporta apavus, jakas, somas…', search: 'Meklēt', browse: 'Pārlūkot katalogu' },
    sections: { categories: 'Pārlūkot pēc kategorijas', categoriesBody: 'Izpētiet avota kataloga pašreizējās kategorijas.', recent: 'Nesen pievienotās preces', recentBody: 'Produkti, cenas un attēli tiek lasīti tieši no kakobuymake.com.', viewAll: 'Skatīt visus produktus', details: 'Skatīt informāciju', sourceLive: 'Tiešais avots' },
    listing: { title: 'Kakobuy tabula', body: 'Pārlūkojiet pašreizējo publisko kakobuymake.com katalogu.', sort: 'Kārtot', newest: 'Jaunākie', priceLow: 'Cena: no zemākās', priceHigh: 'Cena: no augstākās', name: 'Nosaukums', noResults: 'Atbilstošas preces netika atrastas.', sourceError: 'Avota katalogs īslaicīgi nav pieejams. Mēģiniet vēlreiz vēlāk.', previous: 'Iepriekšējā', next: 'Nākamā' },
    seo: { title: 'Salīdziniet preces pirms Kakobuy atvēršanas', body: 'Šis neatkarīgais katalogs apkopo publiskus pārdevēju sludinājumus. Gala cenu, krājumus un opcijas vienmēr pārbaudiet Kakobuy.', searchTitle: 'Meklēt produktus un kategorijas', searchBody: 'Izmantojiet skaidru produkta, zīmola vai kategorijas nosaukumu.', photosTitle: 'Apskatīt avota attēlus', photosBody: 'Galerijās redzami tikai attiecīgā avota sludinājuma attēli.', checkoutTitle: 'Turpināt Kakobuy', checkoutBody: 'Pirms pasūtīšanas atveriet Kakobuy preces lapu un pārbaudiet aktuālo informāciju.' },
    faqTitle: 'Kakobuy tabulas biežāk uzdotie jautājumi',
    faqs: [['Kas ir šī Kakobuy tabula?', 'Tas ir neatkarīgs kakobuymake.com publisko sludinājumu katalogs. Tas nepārdod produktus un neapstrādā pasūtījumus.'], ['No kurienes nāk produkti?', 'Nosaukumi, cenas, kategorijas un attēli tiek ielādēti no kakobuymake.com, atverot lapu.'], ['Vai cenas ir garantētas?', 'Nē. Pārbaudiet aktuālo cenu, krājumus un izvēlēto opciju Kakobuy.'], ['Vai visi attēli ir QC?', 'Nē. Tiek rādīti avota sludinājuma attēli un tie tiek saukti par QC tikai tad, ja avots tos tā apzīmē.'], ['Kā iegādāties produktu?', 'Noklikšķiniet uz produkta kartītes, lai tieši atvērtu attiecīgo Kakobuy lapu.'], ['Kāpēc produkts var pazust?', 'Avota katalogs vai pārdevēja sludinājums var tikt mainīts vai noņemts. Vietne neuztur atsevišķu produktu datubāzi.']],
    product: { gallery: 'Avota galerija', sourceRecord: 'Skatīt avotu', openKakobuy: 'Atvērt Kakobuy', currentNotice: 'Cena, krājumi un opcijas var mainīties. Pārbaudiet informāciju Kakobuy.', unavailable: 'Šis avota sludinājums nav pieejams.' }
  },
  et: {
    nav: { home: 'Avaleht', spreadsheet: 'Kataloog', categories: 'Kategooriad', faq: 'KKK' },
    hero: { eyebrow: 'Reaalajas kataloog saidilt kakobuymake.com', title: 'Kakobuy tabel', body: 'Otsige tooteid, võrrelge lähtepilte ja hinnangulisi hindu ning avage valitud toode Kakobuys.', placeholder: 'Proovige tosse, pusasid, kotte…', search: 'Otsi', browse: 'Sirvi kataloogi' },
    sections: { categories: 'Sirvi kategooria järgi', categoriesBody: 'Tutvuge lähtekataloogi praeguste kategooriatega.', recent: 'Hiljuti lisatud tooted', recentBody: 'Tooted, hinnad ja pildid loetakse otse saidilt kakobuymake.com.', viewAll: 'Kuva kõik tooted', details: 'Kuva üksikasjad', sourceLive: 'Reaalajas allikas' },
    listing: { title: 'Kakobuy tabel', body: 'Sirvige kakobuymake.com praegust avalikku kataloogi.', sort: 'Sorteeri', newest: 'Uusimad', priceLow: 'Hind: madalamast kõrgemani', priceHigh: 'Hind: kõrgemast madalamani', name: 'Nimi', noResults: 'Sobivaid tooteid ei leitud.', sourceError: 'Lähtekataloog pole ajutiselt saadaval. Proovige varsti uuesti.', previous: 'Eelmine', next: 'Järgmine' },
    seo: { title: 'Võrrelge tooteid enne Kakobuy avamist', body: 'See sõltumatu kataloog korrastab avalikke müüjapakkumisi. Kontrollige lõplikku hinda, laoseisu ja valikuid alati Kakobuys.', searchTitle: 'Otsi tooteid ja kategooriaid', searchBody: 'Kasutage selget toote, kaubamärgi või kategooria nime.', photosTitle: 'Vaata lähtepilte', photosBody: 'Galeriid näitavad ainult vastava lähtepakkumise pilte.', checkoutTitle: 'Jätka Kakobuys', checkoutBody: 'Enne tellimist avage Kakobuy tooteleht ja kontrollige uusimat teavet.' },
    faqTitle: 'Kakobuy tabeli korduma kippuvad küsimused',
    faqs: [['Mis on see Kakobuy tabel?', 'See on kakobuymake.com avalike pakkumiste sõltumatu kataloog. See ei müü tooteid ega töötle tellimusi.'], ['Kust tooted pärinevad?', 'Pealkirjad, hinnad, kategooriad ja pildid laaditakse lehe avamisel saidilt kakobuymake.com.'], ['Kas hinnad on garanteeritud?', 'Ei. Kontrollige Kakobuys kehtivat hinda, laoseisu ja valitud varianti.'], ['Kas kõik fotod on QC-fotod?', 'Ei. Kuvatakse lähtepakkumise pildid ja neid nimetatakse QC-ks ainult siis, kui allikas nii märgib.'], ['Kuidas toodet osta?', 'Klõpsake tootekaardil, et avada vastav leht otse Kakobuys.'], ['Miks võib toode kaduda?', 'Lähtekataloog või müüja pakkumine võib muutuda või eemalduda. Sait ei halda eraldi tooteandmebaasi.']],
    product: { gallery: 'Lähtegalerii', sourceRecord: 'Vaata allikat', openKakobuy: 'Ava Kakobuys', currentNotice: 'Hind, laoseis ja valikud võivad muutuda. Kontrollige andmeid Kakobuys.', unavailable: 'See lähtepakkumine pole saadaval.' }
  },
  ga: {
    nav: { home: 'Baile', spreadsheet: 'Catalóg', categories: 'Catagóirí', faq: 'CCanna' },
    hero: { eyebrow: 'Catalóg beo ó kakobuymake.com', title: 'Scarbhileog Kakobuy', body: 'Cuardaigh táirgí, déan comparáid idir grianghraif foinse agus praghsanna measta, ansin oscail an mhír roghnaithe in Kakobuy.', placeholder: 'Bain triail as bróga, cochaill, málaí…', search: 'Cuardaigh', browse: 'Brabhsáil an catalóg' },
    sections: { categories: 'Brabhsáil de réir catagóire', categoriesBody: 'Déan iniúchadh ar chatagóirí reatha na catalóige foinse.', recent: 'Míreanna a cuireadh leis le déanaí', recentBody: 'Léitear táirgí, praghsanna agus íomhánna go díreach ó kakobuymake.com.', viewAll: 'Féach ar gach táirge', details: 'Féach sonraí', sourceLive: 'Foinse bheo' },
    listing: { title: 'Scarbhileog Kakobuy', body: 'Brabhsáil catalóg phoiblí reatha kakobuymake.com.', sort: 'Sórtáil', newest: 'Is nuaí', priceLow: 'Praghas: íseal go hard', priceHigh: 'Praghas: ard go híseal', name: 'Ainm', noResults: 'Níor aimsíodh aon táirgí meaitseála.', sourceError: 'Níl an chatalóg foinse ar fáil faoi láthair. Bain triail eile as ar ball.', previous: 'Roimhe', next: 'Ar aghaidh' },
    seo: { title: 'Déan comparáid idir míreanna sula n-osclaítear Kakobuy', body: 'Eagraíonn an chatalóg neamhspleách seo liostaí poiblí díoltóirí. Deimhnigh an praghas deiridh, an stoc agus na roghanna in Kakobuy i gcónaí.', searchTitle: 'Cuardaigh táirgí agus catagóirí', searchBody: 'Úsáid ainm soiléir táirge, branda nó catagóire.', photosTitle: 'Athbhreithnigh grianghraif foinse', photosBody: 'Ní thaispeánann gailearaithe ach na híomhánna ón liostú foinse comhfhreagrach.', checkoutTitle: 'Lean ar aghaidh in Kakobuy', checkoutBody: 'Oscail leathanach na míre in Kakobuy agus seiceáil an t-eolas is déanaí sula n-ordaíonn tú.' },
    faqTitle: 'Ceisteanna coitianta faoi Scarbhileog Kakobuy',
    faqs: [['Cad é Scarbhileog Kakobuy?', 'Is catalóg neamhspleách í de liostaí poiblí ó kakobuymake.com. Ní dhíolann sí táirgí agus ní phróiseálann sí orduithe.'], ['Cad as a dtagann na táirgí?', 'Lódáiltear teidil, praghsanna, catagóirí agus íomhánna ó kakobuymake.com nuair a osclaítear an leathanach.'], ['An bhfuil na praghsanna ráthaithe?', 'Níl. Deimhnigh an praghas reatha, an stoc agus an rogha in Kakobuy.'], ['An grianghraif QC iad na grianghraif go léir?', 'Ní hea. Taispeántar íomhánna an liostaithe foinse agus ní thugtar QC orthu ach nuair a aithníonn an fhoinse mar sin iad.'], ['Conas a cheannaím táirge?', 'Cliceáil ar chárta an táirge chun an leathanach comhfhreagrach a oscailt go díreach in Kakobuy.'], ['Cén fáth a bhféadfadh táirge imeacht?', 'Féadfar an chatalóg foinse nó liostú an díoltóra a athrú nó a bhaint. Ní choinníonn an suíomh bunachar sonraí táirgí ar leith.']],
    product: { gallery: 'Gailearaí foinse', sourceRecord: 'Féach ar an bhfoinse', openKakobuy: 'Oscail in Kakobuy', currentNotice: 'D’fhéadfadh praghas, stoc agus roghanna athrú. Deimhnigh na sonraí in Kakobuy.', unavailable: 'Níl an liostú foinse seo ar fáil.' }
  },
  mt: {
    nav: { home: 'Paġna ewlenija', spreadsheet: 'Katalgu', categories: 'Kategoriji', faq: 'Mistoqsijiet' },
    hero: { eyebrow: 'Katalgu dirett minn kakobuymake.com', title: 'Spreadsheet ta’ Kakobuy', body: 'Fittex prodotti, qabbel ritratti tas-sors u prezzijiet stmati, imbagħad iftaħ l-oġġett magħżul f’Kakobuy.', placeholder: 'Ipprova żraben, hoodies, basktijiet…', search: 'Fittex', browse: 'Ibbrawżja l-katalgu' },
    sections: { categories: 'Ibbrawżja skont il-kategorija', categoriesBody: 'Esplora l-kategoriji attwali tal-katalgu tas-sors.', recent: 'Oġġetti miżjuda reċentement', recentBody: 'Il-prodotti, il-prezzijiet u l-istampi jinqraw direttament minn kakobuymake.com.', viewAll: 'Ara l-prodotti kollha', details: 'Ara d-dettalji', sourceLive: 'Sors dirett' },
    listing: { title: 'Spreadsheet ta’ Kakobuy', body: 'Ibbrawżja l-katalgu pubbliku attwali minn kakobuymake.com.', sort: 'Issortja', newest: 'L-aktar ġodda', priceLow: 'Prezz: baxx għal għoli', priceHigh: 'Prezz: għoli għal baxx', name: 'Isem', noResults: 'Ma nstabu l-ebda prodotti li jaqblu.', sourceError: 'Il-katalgu tas-sors mhux disponibbli temporanjament. Erġa’ pprova dalwaqt.', previous: 'Preċedenti', next: 'Li jmiss' },
    seo: { title: 'Qabbel l-oġġetti qabel tiftaħ Kakobuy', body: 'Dan il-katalgu indipendenti jorganizza listi pubbliċi ta’ bejjiegħa. Dejjem ikkonferma l-prezz finali, l-istokk u l-għażliet f’Kakobuy.', searchTitle: 'Fittex prodotti u kategoriji', searchBody: 'Uża isem ċar ta’ prodott, marka jew kategorija.', photosTitle: 'Ara r-ritratti tas-sors', photosBody: 'Il-galleriji juru biss l-istampi ppubblikati mal-lista tas-sors korrispondenti.', checkoutTitle: 'Kompli f’Kakobuy', checkoutBody: 'Iftaħ il-paġna tal-oġġett f’Kakobuy u ċċekkja l-aħħar informazzjoni qabel tordna.' },
    faqTitle: 'Mistoqsijiet frekwenti dwar Spreadsheet ta’ Kakobuy',
    faqs: [['X’inhu dan l-iSpreadsheet ta’ Kakobuy?', 'Huwa katalgu indipendenti ta’ listi pubbliċi minn kakobuymake.com. Ma jbigħx prodotti u ma jipproċessax ordnijiet.'], ['Minn fejn jiġu l-prodotti?', 'It-titli, il-prezzijiet, il-kategoriji u l-istampi jitgħabbew minn kakobuymake.com meta tinfetaħ il-paġna.'], ['Il-prezzijiet huma garantiti?', 'Le. Ikkonferma l-prezz attwali, l-istokk u l-għażla f’Kakobuy.'], ['Ir-ritratti kollha huma QC?', 'Le. Jintwerew l-istampi tal-lista tas-sors u jissejħu QC biss meta s-sors jidentifikahom hekk.'], ['Kif nixtri prodott?', 'Ikklikkja l-karta tal-prodott biex tiftaħ direttament il-paġna korrispondenti f’Kakobuy.'], ['Għaliex prodott jista’ jisparixxi?', 'Il-katalgu tas-sors jew il-lista tal-bejjiegħ jistgħu jinbidlu jew jitneħħew. Is-sit ma jżommx database separata tal-prodotti.']],
    product: { gallery: 'Gallerija tas-sors', sourceRecord: 'Ara s-sors', openKakobuy: 'Iftaħ f’Kakobuy', currentNotice: 'Il-prezz, l-istokk u l-għażliet jistgħu jinbidlu. Ikkonferma d-dettalji f’Kakobuy.', unavailable: 'Din il-lista tas-sors mhix disponibbli.' }
  },
  zh: { nav: { home: '首页', spreadsheet: '商品表', categories: '分类', faq: '常见问题' }, hero: { eyebrow: '实时 Kakobuy 商品目录', title: 'Kakobuy 商品表', body: '搜索商品，比较来源图片和参考价格，然后前往 Kakobuy 查看并下单。', placeholder: '搜索鞋子、卫衣、包袋…', search: '搜索', browse: '浏览全部商品' }, sections: { categories: '按分类浏览', categoriesBody: '分类实时读取自来源商品库。', recent: '最新商品', recentBody: '商品、价格和图片均来自公开来源商品记录。', viewAll: '查看全部商品', details: '查看详情', sourceLive: '实时来源' }, listing: { title: 'Kakobuy 商品表', body: '浏览当前公开的 Kakobuy 商品目录。', sort: '排序', newest: '最新', priceLow: '价格从低到高', priceHigh: '价格从高到低', name: '名称', noResults: '没有找到匹配商品。', sourceError: '来源商品库暂时无法访问，请稍后再试。', previous: '上一页', next: '下一页' }, seo: { title: '前往 Kakobuy 前先比较商品', body: '本站是独立商品浏览页面，不销售商品。所有商品记录来自来源网站，价格、库存和规格请以 Kakobuy 页面为准。', searchTitle: '搜索商品和分类', searchBody: '使用明确的商品名、品牌或分类词搜索来源商品库。', photosTitle: '查看来源图片', photosBody: '商品图库只展示来源商品记录中公开的图片。', checkoutTitle: '前往 Kakobuy', checkoutBody: '下单前请在 Kakobuy 页面确认最新卖家信息。' }, faqTitle: 'Kakobuy 电子表格常见问题解答', faqIntro: '解答有关产品搜索、预估价格、市场链接和产品信息的常见问题。', faqs: [ ['Kakobuy 电子表格是什么？', 'Kakobuy 电子表格是一个可搜索的独立商品目录，整理公开卖家商品的标题、分类、预估价格和来源图片，方便用户在前往 Kakobuy 前进行比较。'], ['Kakobuy 是什么？', 'Kakobuy 是一家代购服务平台，帮助国际买家从中国电商平台购买商品，并提供采购、入库处理和国际包裹运输等服务。'], ['电子表格包含哪些市场？', '来源商品可能来自微店、淘宝、天猫、1688 及其他中国电商平台。每件商品显示的市场和卖家链接，以来源记录公开的信息为准。'], ['我该如何搜索产品？', '打开“商品表”页面，输入产品名称、品牌或商品分类进行搜索；也可以进入分类页面浏览并比较相似商品。'], ['为什么价格以美元显示？', '中国电商卖家通常以人民币标价。电子表格显示预估美元价格，方便比较不同商品；汇率和卖家价格可能变化，请在 Kakobuy 确认最终金额。'], ['为什么有些产品的图片或选项较少？', '图片、款式、颜色和尺码信息均来自原始市场商品页面。有些卖家提供完整图库和多种选项，另一些卖家可能只发布主图或简短说明。'], ['如何在 Kakobuy 中打开商品？', '打开本站商品详情页，查看来源图片和预估价格，然后点击 Kakobuy 按钮进入对应商品页面。'], ['什么是质检（QC）照片？', '质检照片是商品入库后拍摄的检查图片，可帮助查看商品的形状、颜色、材质和尺码标记等可见细节。实际订单的 QC 照片可能与来源参考图片不同。'], ['显示的价格包含国际运费和服务费吗？', '不包含。页面显示的是来源商品价格，国内运费、国际运费、可选服务和其他费用需要另外计算。'], ['下单前应该确认哪些信息？', '请在 Kakobuy 页面确认商品来源、所选规格、实时价格、卖家状态以及可能存在的运输限制。'] ], product: { gallery: '来源图片', sourceRecord: '查看来源记录', openKakobuy: '前往 Kakobuy', currentNotice: '价格、库存和规格可能变化，请在 Kakobuy 确认。', unavailable: '该来源商品暂时不可用。' } }
};

const detailPurchaseDirections: Record<Lang, string> = {
  en: 'Open the product detail page, review the source images and price, then use the single Kakobuy button to continue.',
  de: 'Öffne die Produktdetailseite, prüfe Quellbilder und Preis und fahre dann über die einzige Kakobuy-Schaltfläche fort.',
  es: 'Abre la página de detalles, revisa las imágenes y el precio de origen y continúa con el único botón de Kakobuy.',
  fr: 'Ouvrez la fiche produit, vérifiez les images et le prix source, puis continuez avec l’unique bouton Kakobuy.',
  it: 'Apri la pagina dei dettagli, controlla immagini e prezzo di origine, quindi continua con l’unico pulsante Kakobuy.',
  pl: 'Otwórz stronę produktu, sprawdź zdjęcia i cenę źródłową, a następnie użyj jedynego przycisku Kakobuy.',
  pt: 'Abra a página de detalhes, confira as imagens e o preço de origem e continue pelo único botão do Kakobuy.',
  ro: 'Deschide pagina produsului, verifică imaginile și prețul sursă, apoi continuă folosind singurul buton Kakobuy.',
  sv: 'Öppna produktsidan, kontrollera källbilderna och priset och fortsätt sedan med den enda Kakobuy-knappen.',
  nl: 'Open de productdetailpagina, controleer de bronafbeeldingen en prijs en ga verder via de enige Kakobuy-knop.',
  da: 'Åbn produktsiden, kontrollér kildebillederne og prisen, og fortsæt derefter med den eneste Kakobuy-knap.',
  fi: 'Avaa tuotetietosivu, tarkista lähdekuvat ja hinta ja jatka ainoalla Kakobuy-painikkeella.',
  el: 'Ανοίξτε τη σελίδα λεπτομερειών, ελέγξτε τις εικόνες και την τιμή προέλευσης και συνεχίστε με το μοναδικό κουμπί Kakobuy.',
  cs: 'Otevřete detail produktu, zkontrolujte zdrojové obrázky a cenu a pokračujte jediným tlačítkem Kakobuy.',
  hu: 'Nyissa meg a termék részleteit, ellenőrizze a forrásképeket és az árat, majd folytassa az egyetlen Kakobuy gombbal.',
  bg: 'Отворете продуктовата страница, проверете снимките и цената от източника и продължете с единствения бутон Kakobuy.',
  sk: 'Otvorte detail produktu, skontrolujte zdrojové obrázky a cenu a pokračujte jediným tlačidlom Kakobuy.',
  hr: 'Otvorite stranicu proizvoda, provjerite izvorne slike i cijenu, zatim nastavite jedinim gumbom Kakobuy.',
  sl: 'Odprite podrobnosti izdelka, preverite izvorne slike in ceno ter nadaljujte z edinim gumbom Kakobuy.',
  lt: 'Atidarykite produkto puslapį, patikrinkite šaltinio vaizdus ir kainą, tada tęskite vieninteliu Kakobuy mygtuku.',
  lv: 'Atveriet produkta informācijas lapu, pārbaudiet avota attēlus un cenu un turpiniet ar vienīgo Kakobuy pogu.',
  et: 'Avage toote üksikasjade leht, kontrollige lähtepilte ja hinda ning jätkake ainsa Kakobuy nupuga.',
  ga: 'Oscail leathanach sonraí an táirge, seiceáil na híomhánna agus an praghas foinse, ansin lean ar aghaidh leis an aon chnaipe Kakobuy.',
  mt: 'Iftaħ il-paġna tad-dettalji, iċċekkja l-istampi u l-prezz tas-sors, imbagħad kompli bl-unika buttuna Kakobuy.',
  zh: '打开本站商品详情页，查看来源图片和价格，然后点击唯一的 Kakobuy 按钮继续。'
};

const faqExtras: Record<Lang, Array<[string, string]>> = {
  en: [
    ['Is Kakobuy Works an official Kakobuy website?', 'No. Kakobuy Works is an independent product research directory and is not operated by Kakobuy.'],
    ['What should I verify before ordering?', 'Confirm the marketplace item, selected variant, live price, seller status and any shipping restrictions on the Kakobuy page.'],
    ['Does the displayed price include shipping and service fees?', 'No. The displayed amount is a source product price. International shipping, optional services and other charges are calculated separately.'],
    ['Can reference photos guarantee the item I receive?', 'No. Reference photos help with research, but your item may come from another batch. Review the QC photos for your own warehouse order.']
  ],
  de: [
    ['Ist Kakobuy Works eine offizielle Kakobuy-Website?', 'Nein. Kakobuy Works ist ein unabhängiger Produktkatalog und wird nicht von Kakobuy betrieben.'],
    ['Was sollte ich vor der Bestellung prüfen?', 'Prüfe den Marktplatzartikel, die gewählte Variante, den aktuellen Preis, den Verkäuferstatus und mögliche Versandbeschränkungen in Kakobuy.'],
    ['Enthält der angezeigte Preis Versand- und Servicegebühren?', 'Nein. Angezeigt wird der Quellpreis des Produkts. Internationaler Versand, optionale Leistungen und weitere Gebühren werden separat berechnet.'],
    ['Garantieren Referenzfotos den Artikel, den ich erhalte?', 'Nein. Referenzfotos helfen bei der Auswahl, aber dein Artikel kann aus einer anderen Charge stammen. Prüfe die QC-Fotos deiner eigenen Lagerbestellung.']
  ],
  es: [
    ['¿Kakobuy Works es un sitio web oficial de Kakobuy?', 'No. Kakobuy Works es un directorio independiente de investigación de productos y no está operado por Kakobuy.'],
    ['¿Qué debo comprobar antes de comprar?', 'Confirma el artículo, la variante elegida, el precio actual, el estado del vendedor y las restricciones de envío en Kakobuy.'],
    ['¿El precio mostrado incluye envío y tarifas de servicio?', 'No. Es el precio del producto en la fuente. El envío internacional, los servicios opcionales y otros cargos se calculan por separado.'],
    ['¿Las fotos de referencia garantizan el artículo que recibiré?', 'No. Sirven para investigar, pero tu artículo puede ser de otro lote. Revisa las fotos QC de tu propio pedido en el almacén.']
  ],
  fr: [
    ['Kakobuy Works est-il un site officiel de Kakobuy ?', 'Non. Kakobuy Works est un répertoire indépendant de recherche de produits et n’est pas exploité par Kakobuy.'],
    ['Que dois-je vérifier avant de commander ?', 'Confirmez l’article, la variante choisie, le prix actuel, le statut du vendeur et les restrictions d’expédition dans Kakobuy.'],
    ['Le prix affiché comprend-il l’expédition et les frais de service ?', 'Non. Il s’agit du prix source du produit. L’expédition internationale, les services optionnels et les autres frais sont calculés séparément.'],
    ['Les photos de référence garantissent-elles l’article reçu ?', 'Non. Elles aident à la recherche, mais votre article peut provenir d’un autre lot. Examinez les photos QC de votre propre commande en entrepôt.']
  ],
  it: [
    ['Kakobuy Works è un sito ufficiale di Kakobuy?', 'No. Kakobuy Works è una directory indipendente per la ricerca di prodotti e non è gestita da Kakobuy.'],
    ['Cosa devo verificare prima di ordinare?', 'Controlla l’articolo, la variante scelta, il prezzo attuale, lo stato del venditore e le restrizioni di spedizione su Kakobuy.'],
    ['Il prezzo mostrato include spedizione e costi di servizio?', 'No. È il prezzo del prodotto alla fonte. Spedizione internazionale, servizi opzionali e altri costi vengono calcolati separatamente.'],
    ['Le foto di riferimento garantiscono l’articolo che riceverò?', 'No. Aiutano nella ricerca, ma l’articolo può provenire da un lotto diverso. Controlla le foto QC del tuo ordine in magazzino.']
  ],
  pl: [
    ['Czy Kakobuy Works jest oficjalną stroną Kakobuy?', 'Nie. Kakobuy Works to niezależny katalog do wyszukiwania produktów, nieprowadzony przez Kakobuy.'],
    ['Co sprawdzić przed zamówieniem?', 'Potwierdź produkt, wybrany wariant, aktualną cenę, status sprzedawcy i ograniczenia wysyłki na stronie Kakobuy.'],
    ['Czy wyświetlana cena obejmuje wysyłkę i opłaty za usługi?', 'Nie. To cena produktu ze źródła. Wysyłka międzynarodowa, usługi opcjonalne i inne opłaty są obliczane oddzielnie.'],
    ['Czy zdjęcia referencyjne gwarantują otrzymany produkt?', 'Nie. Pomagają w wyborze, ale produkt może pochodzić z innej partii. Sprawdź zdjęcia QC własnego zamówienia w magazynie.']
  ],
  pt: [
    ['O Kakobuy Works é um site oficial da Kakobuy?', 'Não. O Kakobuy Works é um diretório independente de pesquisa de produtos e não é operado pela Kakobuy.'],
    ['O que devo verificar antes de comprar?', 'Confirme o item, a variante escolhida, o preço atual, a situação do vendedor e as restrições de envio no Kakobuy.'],
    ['O preço exibido inclui frete e taxas de serviço?', 'Não. Ele representa o preço do produto na origem. Frete internacional, serviços opcionais e outras cobranças são calculados separadamente.'],
    ['As fotos de referência garantem o item que vou receber?', 'Não. Elas ajudam na pesquisa, mas seu item pode ser de outro lote. Confira as fotos QC do seu próprio pedido no armazém.']
  ],
  ro: [
    ['Kakobuy Works este un site oficial Kakobuy?', 'Nu. Kakobuy Works este un catalog independent pentru cercetarea produselor și nu este administrat de Kakobuy.'],
    ['Ce trebuie să verific înainte de comandă?', 'Confirmă produsul, varianta aleasă, prețul actual, starea vânzătorului și restricțiile de livrare în Kakobuy.'],
    ['Prețul afișat include transportul și taxele de serviciu?', 'Nu. Este prețul produsului din sursă. Transportul internațional, serviciile opționale și alte taxe se calculează separat.'],
    ['Fotografiile de referință garantează produsul primit?', 'Nu. Ele ajută la cercetare, dar produsul poate proveni din alt lot. Verifică fotografiile QC ale propriei comenzi din depozit.']
  ],
  sv: [
    ['Är Kakobuy Works en officiell Kakobuy-webbplats?', 'Nej. Kakobuy Works är en oberoende katalog för produktundersökning och drivs inte av Kakobuy.'],
    ['Vad bör jag kontrollera före beställning?', 'Bekräfta marknadsplatsens artikel, vald variant, aktuellt pris, säljarstatus och leveransbegränsningar i Kakobuy.'],
    ['Ingår frakt och serviceavgifter i det visade priset?', 'Nej. Det är produktens källpris. Internationell frakt, tillvalstjänster och andra avgifter beräknas separat.'],
    ['Garanterar referensbilderna varan jag får?', 'Nej. De hjälper vid undersökningen, men din vara kan komma från en annan batch. Granska QC-bilderna för din egen lagerorder.']
  ],
  nl: [
    ['Is Kakobuy Works een officiële Kakobuy-website?', 'Nee. Kakobuy Works is een onafhankelijke productcatalogus en wordt niet door Kakobuy beheerd.'],
    ['Wat moet ik vóór het bestellen controleren?', 'Controleer het artikel, de gekozen variant, de actuele prijs, de verkoper en eventuele verzendbeperkingen in Kakobuy.'],
    ['Zijn verzending en servicekosten inbegrepen in de getoonde prijs?', 'Nee. Dit is de bronprijs van het product. Internationale verzending, optionele diensten en andere kosten worden apart berekend.'],
    ['Garanderen referentiefoto’s het artikel dat ik ontvang?', 'Nee. Ze helpen bij onderzoek, maar je artikel kan uit een andere partij komen. Bekijk de QC-foto’s van je eigen magazijnbestelling.']
  ],
  da: [
    ['Er Kakobuy Works en officiel Kakobuy-hjemmeside?', 'Nej. Kakobuy Works er et uafhængigt produktkatalog og drives ikke af Kakobuy.'],
    ['Hvad skal jeg kontrollere før bestilling?', 'Bekræft varen, den valgte variant, den aktuelle pris, sælgerstatus og eventuelle forsendelsesbegrænsninger i Kakobuy.'],
    ['Indeholder den viste pris fragt og servicegebyrer?', 'Nej. Det er produktets kildepris. International fragt, valgfrie tjenester og andre gebyrer beregnes separat.'],
    ['Garanterer referencefotos den vare, jeg modtager?', 'Nej. De hjælper med research, men din vare kan komme fra et andet parti. Gennemgå QC-fotos for din egen lagerordre.']
  ],
  fi: [
    ['Onko Kakobuy Works Kakobuyn virallinen sivusto?', 'Ei. Kakobuy Works on itsenäinen tuotehakemisto, eikä Kakobuy ylläpidä sitä.'],
    ['Mitä minun tulee tarkistaa ennen tilaamista?', 'Vahvista tuote, valittu vaihtoehto, ajantasainen hinta, myyjän tila ja toimitusrajoitukset Kakobuyssa.'],
    ['Sisältääkö näytetty hinta toimituksen ja palvelumaksut?', 'Ei. Se on tuotteen lähdehinta. Kansainvälinen toimitus, valinnaiset palvelut ja muut maksut lasketaan erikseen.'],
    ['Takaavatko viitekuvat saamani tuotteen?', 'Eivät. Ne auttavat tutkimuksessa, mutta tuote voi olla eri erästä. Tarkista oman varastotilauksesi QC-kuvat.']
  ],
  el: [
    ['Είναι το Kakobuy Works επίσημος ιστότοπος της Kakobuy;', 'Όχι. Το Kakobuy Works είναι ανεξάρτητος κατάλογος έρευνας προϊόντων και δεν λειτουργεί από την Kakobuy.'],
    ['Τι πρέπει να ελέγξω πριν από την παραγγελία;', 'Επιβεβαιώστε το προϊόν, την επιλεγμένη παραλλαγή, την τρέχουσα τιμή, την κατάσταση του πωλητή και τους περιορισμούς αποστολής στο Kakobuy.'],
    ['Η τιμή περιλαμβάνει μεταφορικά και τέλη υπηρεσίας;', 'Όχι. Είναι η τιμή πηγής του προϊόντος. Η διεθνής αποστολή, οι προαιρετικές υπηρεσίες και άλλες χρεώσεις υπολογίζονται χωριστά.'],
    ['Οι φωτογραφίες αναφοράς εγγυώνται το προϊόν που θα λάβω;', 'Όχι. Βοηθούν στην έρευνα, αλλά το προϊόν μπορεί να προέρχεται από άλλη παρτίδα. Ελέγξτε τις φωτογραφίες QC της δικής σας παραγγελίας.']
  ],
  cs: [
    ['Je Kakobuy Works oficiální web Kakobuy?', 'Ne. Kakobuy Works je nezávislý katalog pro vyhledávání produktů a neprovozuje jej Kakobuy.'],
    ['Co mám zkontrolovat před objednávkou?', 'V Kakobuy ověřte položku, vybranou variantu, aktuální cenu, stav prodejce a případná omezení dopravy.'],
    ['Zahrnuje zobrazená cena dopravu a servisní poplatky?', 'Ne. Jde o zdrojovou cenu produktu. Mezinárodní doprava, volitelné služby a další poplatky se počítají zvlášť.'],
    ['Zaručují referenční fotografie produkt, který obdržím?', 'Ne. Pomáhají při výběru, ale produkt může pocházet z jiné série. Zkontrolujte QC fotografie vlastní skladové objednávky.']
  ],
  hu: [
    ['A Kakobuy Works hivatalos Kakobuy weboldal?', 'Nem. A Kakobuy Works független termékkutató katalógus, és nem a Kakobuy üzemelteti.'],
    ['Mit ellenőrizzek rendelés előtt?', 'Ellenőrizze a piactéri terméket, a kiválasztott változatot, az aktuális árat, az eladó állapotát és a szállítási korlátozásokat a Kakobuyban.'],
    ['A megjelenített ár tartalmazza a szállítást és a szolgáltatási díjakat?', 'Nem. Ez a termék forrására. A nemzetközi szállítás, a választható szolgáltatások és más díjak külön kerülnek kiszámításra.'],
    ['A referenciafotók garantálják a kapott terméket?', 'Nem. Segítik a kutatást, de a termék más gyártási tételből származhat. Ellenőrizze saját raktári rendelésének QC-fotóit.']
  ],
  bg: [
    ['Kakobuy Works официален сайт на Kakobuy ли е?', 'Не. Kakobuy Works е независим каталог за проучване на продукти и не се управлява от Kakobuy.'],
    ['Какво да проверя преди поръчка?', 'Потвърдете продукта, избрания вариант, текущата цена, статуса на продавача и ограниченията за доставка в Kakobuy.'],
    ['Показаната цена включва ли доставка и такси за услуги?', 'Не. Това е изходната цена на продукта. Международната доставка, допълнителните услуги и другите такси се изчисляват отделно.'],
    ['Референтните снимки гарантират ли получения продукт?', 'Не. Те помагат при проучването, но продуктът може да е от друга партида. Проверете QC снимките на собствената си складова поръчка.']
  ],
  sk: [
    ['Je Kakobuy Works oficiálna stránka Kakobuy?', 'Nie. Kakobuy Works je nezávislý katalóg na vyhľadávanie produktov a neprevádzkuje ho Kakobuy.'],
    ['Čo mám skontrolovať pred objednávkou?', 'V Kakobuy overte položku, zvolený variant, aktuálnu cenu, stav predajcu a prípadné obmedzenia dopravy.'],
    ['Zahŕňa zobrazená cena dopravu a servisné poplatky?', 'Nie. Ide o zdrojovú cenu produktu. Medzinárodná doprava, voliteľné služby a ďalšie poplatky sa počítajú samostatne.'],
    ['Zaručujú referenčné fotografie produkt, ktorý dostanem?', 'Nie. Pomáhajú pri výbere, ale produkt môže byť z inej série. Skontrolujte QC fotografie vlastnej skladovej objednávky.']
  ],
  hr: [
    ['Je li Kakobuy Works službena Kakobuy stranica?', 'Ne. Kakobuy Works je neovisan katalog za istraživanje proizvoda i njime ne upravlja Kakobuy.'],
    ['Što trebam provjeriti prije narudžbe?', 'U Kakobuyu potvrdite proizvod, odabranu varijantu, trenutnu cijenu, status prodavača i ograničenja dostave.'],
    ['Uključuje li prikazana cijena dostavu i naknade za usluge?', 'Ne. To je izvorna cijena proizvoda. Međunarodna dostava, dodatne usluge i druge naknade izračunavaju se zasebno.'],
    ['Jamče li referentne fotografije proizvod koji ću dobiti?', 'Ne. Pomažu pri istraživanju, ali proizvod može biti iz druge serije. Pregledajte QC fotografije vlastite skladišne narudžbe.']
  ],
  sl: [
    ['Je Kakobuy Works uradna stran Kakobuy?', 'Ne. Kakobuy Works je neodvisen katalog za raziskovanje izdelkov in ga ne upravlja Kakobuy.'],
    ['Kaj moram preveriti pred naročilom?', 'V Kakobuyu potrdite izdelek, izbrano različico, trenutno ceno, stanje prodajalca in omejitve dostave.'],
    ['Ali prikazana cena vključuje dostavo in storitvene stroške?', 'Ne. Gre za izvorno ceno izdelka. Mednarodna dostava, izbirne storitve in drugi stroški se izračunajo posebej.'],
    ['Ali referenčne fotografije zagotavljajo izdelek, ki ga prejmem?', 'Ne. Pomagajo pri raziskovanju, vendar je izdelek lahko iz druge serije. Preglejte QC fotografije svojega skladiščnega naročila.']
  ],
  lt: [
    ['Ar Kakobuy Works yra oficiali Kakobuy svetainė?', 'Ne. Kakobuy Works yra nepriklausomas produktų paieškos katalogas, kurio nevaldo Kakobuy.'],
    ['Ką patikrinti prieš užsakant?', 'Kakobuy puslapyje patvirtinkite prekę, pasirinktą variantą, dabartinę kainą, pardavėjo būseną ir siuntimo apribojimus.'],
    ['Ar rodoma kaina apima siuntimą ir paslaugų mokesčius?', 'Ne. Tai šaltinio produkto kaina. Tarptautinis siuntimas, papildomos paslaugos ir kiti mokesčiai skaičiuojami atskirai.'],
    ['Ar nuotraukos garantuoja prekę, kurią gausiu?', 'Ne. Jos padeda renkantis, tačiau prekė gali būti iš kitos partijos. Peržiūrėkite savo sandėlio užsakymo QC nuotraukas.']
  ],
  lv: [
    ['Vai Kakobuy Works ir oficiāla Kakobuy vietne?', 'Nē. Kakobuy Works ir neatkarīgs produktu izpētes katalogs, ko nepārvalda Kakobuy.'],
    ['Kas jāpārbauda pirms pasūtīšanas?', 'Kakobuy lapā pārbaudiet preci, izvēlēto variantu, aktuālo cenu, pārdevēja statusu un piegādes ierobežojumus.'],
    ['Vai norādītajā cenā ir iekļauta piegāde un pakalpojumu maksa?', 'Nē. Tā ir produkta avota cena. Starptautiskā piegāde, izvēles pakalpojumi un citas maksas tiek aprēķinātas atsevišķi.'],
    ['Vai atsauces fotoattēli garantē saņemto preci?', 'Nē. Tie palīdz izpētē, bet prece var būt no citas partijas. Pārbaudiet sava noliktavas pasūtījuma QC fotoattēlus.']
  ],
  et: [
    ['Kas Kakobuy Works on Kakobuy ametlik veebisait?', 'Ei. Kakobuy Works on sõltumatu tooteotsingu kataloog ja seda ei halda Kakobuy.'],
    ['Mida peaksin enne tellimist kontrollima?', 'Kinnitage Kakobuys toode, valitud variant, praegune hind, müüja olek ja tarnepiirangud.'],
    ['Kas kuvatud hind sisaldab saatmist ja teenustasusid?', 'Ei. See on toote lähtehind. Rahvusvaheline saatmine, valikulised teenused ja muud tasud arvutatakse eraldi.'],
    ['Kas võrdlusfotod garanteerivad saadava toote?', 'Ei. Need aitavad uurimisel, kuid toode võib pärineda teisest partiist. Vaadake üle oma laotellimuse QC-fotod.']
  ],
  ga: [
    ['An suíomh oifigiúil Kakobuy é Kakobuy Works?', 'Ní hea. Is eolaire neamhspleách taighde táirgí é Kakobuy Works agus ní Kakobuy a oibríonn é.'],
    ['Cad ba cheart dom a sheiceáil roimh ordú?', 'Deimhnigh an táirge, an leagan roghnaithe, an praghas reatha, stádas an díoltóra agus srianta seolta in Kakobuy.'],
    ['An bhfuil seoladh agus táillí seirbhíse sa phraghas ar taispeáint?', 'Níl. Is é praghas foinse an táirge é. Ríomhtar seoladh idirnáisiúnta, seirbhísí roghnacha agus táillí eile ar leithligh.'],
    ['An ráthaíonn grianghraif thagartha an táirge a gheobhaidh mé?', 'Ní ráthaíonn. Cabhraíonn siad le taighde, ach d’fhéadfadh do tháirge teacht ó bhaisc eile. Seiceáil grianghraif QC d’ordaithe féin sa stóras.']
  ],
  mt: [
    ['Kakobuy Works huwa sit uffiċjali ta’ Kakobuy?', 'Le. Kakobuy Works huwa direttorju indipendenti għar-riċerka tal-prodotti u mhuwiex immexxi minn Kakobuy.'],
    ['X’għandi nivverifika qabel nordna?', 'Ikkonferma l-prodott, il-varjant magħżul, il-prezz attwali, l-istatus tal-bejjiegħ u r-restrizzjonijiet tat-tbaħħir f’Kakobuy.'],
    ['Il-prezz muri jinkludi t-tbaħħir u t-tariffi tas-servizz?', 'Le. Dan huwa l-prezz tal-prodott mis-sors. It-tbaħħir internazzjonali, servizzi fakultattivi u tariffi oħra jiġu kkalkulati separatament.'],
    ['Ir-ritratti ta’ referenza jiggarantixxu l-prodott li nirċievi?', 'Le. Jgħinu fir-riċerka, iżda l-prodott jista’ jkun minn lott ieħor. Ara r-ritratti QC tal-ordni tiegħek fil-maħżen.']
  ],
  zh: [
    ['Kakobuy Works 是 Kakobuy 官方网站吗？', '不是。Kakobuy Works 是独立的商品研究目录，并非由 Kakobuy 官方运营。'],
    ['下单前应该确认哪些信息？', '请在 Kakobuy 页面确认商品来源、所选规格、实时价格、卖家状态以及可能存在的运输限制。'],
    ['页面价格包含国际运费和服务费吗？', '不包含。页面显示的是来源商品价格，国际运费、可选服务及其他费用需要另外计算。'],
    ['参考图片能保证我收到的商品完全一样吗？', '不能。参考图片用于辅助选购，但实际商品可能来自不同批次，请以自己订单入库后的 QC 图片为准。']
  ]
};

const qcLabels: Record<Lang, [string, string, string]> = {
  en: ['Available QC photo references', 'Review the source reference photos before opening Kakobuy. Your own warehouse QC photos may differ.', 'reference photos'],
  de: ['Verfügbare QC-Fotoreferenzen', 'Prüfe die Referenzbilder der Quelle, bevor du Kakobuy öffnest. Deine eigenen Lager-QC-Fotos können abweichen.', 'Referenzfotos'],
  es: ['Referencias de fotos QC disponibles', 'Revisa las fotos de referencia de origen antes de abrir Kakobuy. Tus propias fotos QC del almacén pueden ser diferentes.', 'fotos de referencia'],
  fr: ['Références photo QC disponibles', 'Consultez les photos de référence source avant d’ouvrir Kakobuy. Vos propres photos QC d’entrepôt peuvent différer.', 'photos de référence'],
  it: ['Riferimenti fotografici QC disponibili', 'Controlla le foto di riferimento della fonte prima di aprire Kakobuy. Le tue foto QC di magazzino potrebbero essere diverse.', 'foto di riferimento'],
  pl: ['Dostępne zdjęcia referencyjne QC', 'Sprawdź zdjęcia źródłowe przed otwarciem Kakobuy. Twoje własne zdjęcia QC z magazynu mogą się różnić.', 'zdjęć referencyjnych'],
  pt: ['Referências de fotos QC disponíveis', 'Confira as fotos de referência da origem antes de abrir o Kakobuy. Suas próprias fotos QC do armazém podem ser diferentes.', 'fotos de referência'],
  ro: ['Referințe foto QC disponibile', 'Verifică fotografiile de referință înainte de a deschide Kakobuy. Fotografiile tale QC din depozit pot fi diferite.', 'fotografii de referință'],
  sv: ['Tillgängliga QC-fotoreferenser', 'Granska källans referensbilder innan du öppnar Kakobuy. Dina egna QC-bilder från lagret kan skilja sig.', 'referensbilder'],
  nl: ['Beschikbare QC-fotoreferenties', 'Bekijk de bronfoto’s voordat je Kakobuy opent. Je eigen QC-foto’s uit het magazijn kunnen afwijken.', 'referentiefoto’s'],
  da: ['Tilgængelige QC-fotoreferencer', 'Gennemgå kildens referencebilleder, før du åbner Kakobuy. Dine egne QC-billeder fra lageret kan afvige.', 'referencebilleder'],
  fi: ['Saatavilla olevat QC-kuvaviitteet', 'Tarkista lähteen viitekuvat ennen Kakobuyn avaamista. Omat varaston QC-kuvasi voivat poiketa.', 'viitekuvaa'],
  el: ['Διαθέσιμες φωτογραφίες αναφοράς QC', 'Ελέγξτε τις φωτογραφίες αναφοράς πριν ανοίξετε το Kakobuy. Οι δικές σας φωτογραφίες QC αποθήκης ενδέχεται να διαφέρουν.', 'φωτογραφίες αναφοράς'],
  cs: ['Dostupné referenční QC fotografie', 'Před otevřením Kakobuy si prohlédněte zdrojové fotografie. Vaše vlastní skladové QC fotografie se mohou lišit.', 'referenčních fotografií'],
  hu: ['Elérhető QC fotóreferenciák', 'A Kakobuy megnyitása előtt tekintse át a forrás referenciaképeit. A saját raktári QC-fotók eltérhetnek.', 'referenciafotó'],
  bg: ['Налични референтни QC снимки', 'Прегледайте снимките от източника, преди да отворите Kakobuy. Вашите складови QC снимки може да се различават.', 'референтни снимки'],
  sk: ['Dostupné referenčné QC fotografie', 'Pred otvorením Kakobuy si prezrite zdrojové fotografie. Vaše vlastné skladové QC fotografie sa môžu líšiť.', 'referenčných fotografií'],
  hr: ['Dostupne referentne QC fotografije', 'Pregledajte izvorne fotografije prije otvaranja Kakobuya. Vaše skladišne QC fotografije mogu se razlikovati.', 'referentnih fotografija'],
  sl: ['Razpoložljive referenčne QC fotografije', 'Pred odprtjem Kakobuya preglejte izvorne fotografije. Vaše skladiščne QC fotografije se lahko razlikujejo.', 'referenčnih fotografij'],
  lt: ['Galimos QC nuotraukų nuorodos', 'Prieš atidarydami Kakobuy peržiūrėkite šaltinio nuotraukas. Jūsų sandėlio QC nuotraukos gali skirtis.', 'šaltinio nuotraukos'],
  lv: ['Pieejamās QC foto atsauces', 'Pirms Kakobuy atvēršanas apskatiet avota atsauces fotoattēlus. Jūsu noliktavas QC fotoattēli var atšķirties.', 'atsauces fotoattēli'],
  et: ['Saadaolevad QC-fotoviited', 'Enne Kakobuy avamist vaadake üle lähtefotod. Teie enda lao QC-fotod võivad erineda.', 'võrdlusfotot'],
  ga: ['Tagairtí grianghraf QC atá ar fáil', 'Déan athbhreithniú ar na grianghraif foinse sula n-osclaíonn tú Kakobuy. D’fhéadfadh do ghrianghraif QC stórais a bheith difriúil.', 'grianghraf tagartha'],
  mt: ['Referenzi tar-ritratti QC disponibbli', 'Ara r-ritratti ta’ referenza tas-sors qabel tiftaħ Kakobuy. Ir-ritratti QC tal-maħżen tiegħek jistgħu jkunu differenti.', 'ritratti ta’ referenza'],
  zh: ['可用 QC 图片参考', '前往 Kakobuy 前可先查看来源参考图片；实际入库后生成的个人仓库 QC 照片可能不同。', '张参考图片']
};

export function getQcCopy(lang: Lang) {
  const [title, body, photos] = qcLabels[lang];
  return { title, body, photos, listing: 'Kakobuy Spreadsheet listing' };
}

export function isLang(value?: string): value is Lang {
  return Boolean(value && value in languages);
}

export function getCopy(lang: Lang): Copy {
  const partial = overrides[lang] || {};
  const baseFaqs = (partial.faqs || en.faqs).map(([question, answer]) => [question, answer] as [string, string]);
  const purchaseIndex = lang === 'en' || lang === 'zh' ? 6 : 4;
  if (baseFaqs[purchaseIndex]) baseFaqs[purchaseIndex][1] = detailPurchaseDirections[lang];
  const faqs = [...baseFaqs, ...faqExtras[lang].map(([question, answer]) => [question, answer] as [string, string])].slice(0, 10);
  const copy: Copy = {
    ...en,
    ...partial,
    nav: { ...en.nav, ...(partial.nav || {}) },
    hero: { ...en.hero, ...(partial.hero || {}) },
    sections: { ...en.sections, ...(partial.sections || {}) },
    listing: { ...en.listing, ...(partial.listing || {}) },
    seo: { ...en.seo, ...(partial.seo || {}) },
    faqIntro: partial.faqIntro || partial.seo?.body || en.faqIntro,
    product: { ...en.product, ...(partial.product || {}) },
    faqs
  };
  // Keep the internal upstream private in visitor-facing copy while preserving
  // fully localized wording and the existing live data integration.
  return JSON.parse(JSON.stringify(copy).replaceAll('kakobuymake.com', 'Kakobuy Works')) as Copy;
}
