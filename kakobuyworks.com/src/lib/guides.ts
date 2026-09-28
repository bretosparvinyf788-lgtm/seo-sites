import { guideTranslations } from './guide-translations.generated.ts';
import type { Lang } from './i18n';

export type Guide = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  date: string;
  readingTime: string;
  cover: string;
  coverAlt: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  articleHtml: string;
};

export const guides: Guide[] = [
  {
    slug: 'how-to-use-kakobuy-spreadsheet',
    title: 'How to Use a Kakobuy Spreadsheet: Search, Compare and Verify Product Links',
    description: 'A practical Kakobuy spreadsheet guide for finding products, comparing listings, checking source photos and opening the correct seller link in Kakobuy.',
    excerpt: 'Learn a repeatable way to search thousands of Kakobuy product links, compare listings and verify the final item before ordering.',
    date: '2026-09-24',
    readingTime: '11 min read',
    cover: '/images/guides/kakobuy-spreadsheet-guide-v2.webp',
    coverAlt: 'Desktop product catalog with search and filters for researching Kakobuy listings',
    primaryKeyword: 'Kakobuy spreadsheet',
    secondaryKeywords: ['Kakobuy product links', 'Kakobuy finds', 'Kakobuy spreadsheet guide', 'Weidian Kakobuy links'],
    articleHtml: `
      <p>A Kakobuy spreadsheet is most useful when you treat it as a product-discovery system, not as a promise that every listing is current or suitable. A well-organized catalog turns thousands of public marketplace records into searchable categories, readable product cards and dedicated detail pages. It helps you move from a broad idea such as “black running shoes” to a specific seller listing without opening dozens of unrelated marketplace pages. The spreadsheet is the research layer. Kakobuy remains the place where you confirm the live item, option, price and order details.</p>
      <p>This distinction matters because seller listings change. A product can gain or lose options, an image can be replaced, a price can move, and a listing can disappear. A useful workflow therefore has two stages: use the spreadsheet to narrow the field, then verify the selected item again in Kakobuy. The guide below explains how to do that efficiently, how to compare similar records and how to avoid the common mistakes that turn a quick search into an expensive correction.</p>

      <h2>Start with the product, not a vague trend</h2>
      <p>Broad searches create noisy results. “Shoes,” “clothes” or “bag” may return hundreds of items that share little beyond a category. Begin with the item type and one or two characteristics that would change your decision. Useful combinations include a silhouette, material, color, season or use case. “Low-top leather sneakers,” “heavyweight zip hoodie,” “small crossbody bag” and “straight-leg sweatpants” are more productive than a brand name alone. Clear language also helps when seller titles are inconsistent or translated automatically.</p>
      <p>If you already have a marketplace item ID, search the number before using descriptive words. IDs are more precise than titles and can help you reconnect with a product whose name has changed. If the ID does not return a match, search the item type and compare the images. Do not assume two similar names point to the same seller page. Product titles are labels for browsing; the underlying marketplace link is the record that ultimately matters.</p>

      <h2>Use categories to build a sensible shortlist</h2>
      <p>Categories are valuable when you are exploring rather than looking for one exact item. Open the most specific relevant category and scan a complete page before changing filters. This makes price ranges, recurring photos and repeated product names easier to notice. It also helps you recognize whether a result is genuinely unusual or simply one of many near-identical listings. On a large Kakobuy spreadsheet, pagination is not an inconvenience; it is the structure that keeps thousands of product records usable on desktop and mobile.</p>
      <p>Create a shortlist of three to five candidates instead of choosing the first attractive card. Open each candidate in its own detail page and compare the same fields in the same order: title, recorded price, source gallery, marketplace ID and available QC references. A consistent comparison is much more reliable than switching attention between a low price on one item, a better image on another and a familiar title on a third.</p>

      <h2>Understand what the displayed price means</h2>
      <p>The price shown in a spreadsheet is a recorded or converted item price from the source listing. It is useful for comparison, but it is not a guaranteed checkout total. Marketplace sellers can price variants differently. A card may show the lowest option, a deposit, an accessory or a base configuration. Currency conversion also changes over time. Treat the visible amount as an early estimate and verify the selected option after the seller link opens in Kakobuy.</p>
      <p>When two visually similar products have a large price gap, investigate rather than assuming the cheaper one is a bargain. Compare the option list, quantity, material description, included pieces and image set. The difference may reflect a different version or an incomplete package. The spreadsheet should help you notice the gap; it cannot explain every seller-level pricing rule. Your final check should always use the live product and the exact option you intend to submit.</p>

      <h2>Read the source gallery before using the buy button</h2>
      <p>A product card is a fast visual index. The detail gallery contains the information needed for a real comparison. Look for multiple angles, close views, size charts, option images and packaging information. Repeated marketing images provide less evidence than a varied gallery. If only one image is available, treat the listing as lower-information and compare it with alternatives before proceeding. The absence of extra images is not proof of a problem, but it increases uncertainty.</p>
      <p>Source photos and warehouse QC photos are not the same. Source photos are published with the seller record. QC photos document an inspected item associated with a warehouse process or an earlier order. Some product pages may contain only source references. A careful spreadsheet should say what the images represent rather than labeling every picture as QC. Use the gallery to identify the product, then use any clearly marked QC references to inspect visible details.</p>

      <h2>Check the marketplace identity and product path</h2>
      <p>Before leaving the spreadsheet, note the marketplace and item ID. Weidian, Taobao and 1688 listings can use different page formats, but each valid record should resolve to a specific source item. A dedicated product page is useful because it preserves this context while giving you one controlled action: continue to Kakobuy. This is safer than a crowded card with several external buttons whose destinations are difficult to compare.</p>
      <p>After the item opens in Kakobuy, confirm that the visible title, main image and source identity still correspond with the spreadsheet detail page. Small wording differences can be normal, especially after translation. A completely different image, unrelated option set or unexpected product type is a reason to stop and search again. Never rely on the browser tab title alone; compare the visual record and the product options.</p>

      <h2>Use QC references as evidence, not a guarantee</h2>
      <p>Existing QC references can show how a product has appeared in a real inspection context. They may reveal proportions, color, stitching, print alignment or packaging that the seller gallery does not show clearly. They are useful for deciding whether a listing deserves further attention. They do not guarantee that your order will be identical, because sellers can update batches and individual items can vary.</p>
      <p>When a product page has several QC images, compare them as a set. One favorable angle cannot answer every question, and one poorly lit photo may exaggerate a color difference. Write down the two or three details that matter most to you before opening the images. This prevents endless zooming without a decision rule. If a critical area is not visible, plan to request or review the inspection images for your own item after it reaches the warehouse.</p>

      <h2>Recognize stale, incomplete and misleading results</h2>
      <p>A working spreadsheet should update from its source, but temporary failures still happen. An empty category, missing image or unavailable detail page may reflect a source outage rather than a permanent deletion. Refresh once, try the source record later and avoid repeatedly submitting the same order. If the Kakobuy destination returns an unavailable item or a different seller listing, treat the spreadsheet entry as stale for the moment.</p>
      <p>Be cautious with pages that promise that every item is verified, authentic, in stock or risk-free. A directory can organize public information; it cannot control seller inventory or international delivery. Strong research pages disclose limits, distinguish estimates from final values and encourage users to confirm current information. Those signs are more useful than inflated item counts or broad quality claims.</p>

      <h2>Build a repeatable comparison routine</h2>
      <p>A simple routine saves time. First, define the item and the details that matter. Second, search the spreadsheet and open the closest category. Third, shortlist several products. Fourth, compare price, source photos, IDs and QC references. Fifth, open the best candidate in Kakobuy and verify its current options. Sixth, save the product identity with your order notes so you can reconnect the spreadsheet record, the seller listing and your warehouse inspection later.</p>
      <p>Do not open twenty tabs without a method. More results do not automatically create a better choice. A shortlist of comparable products produces a clearer decision than a large collection of unrelated possibilities. If no candidate meets your requirements, change one search term at a time. Switching the item type, color, fit and material simultaneously makes it impossible to understand why the results improved or became worse.</p>

      <h2>Common Kakobuy spreadsheet mistakes</h2>
      <ul>
        <li>Choosing a product from the thumbnail without opening its detail page.</li>
        <li>Assuming the displayed price applies to every size, color or configuration.</li>
        <li>Treating seller images as warehouse QC photos.</li>
        <li>Ignoring the marketplace item ID when comparing similar titles.</li>
        <li>Opening an external link before checking the gallery and product context.</li>
        <li>Expecting an old QC set to guarantee the appearance of a new order.</li>
        <li>Continuing when the Kakobuy page no longer matches the selected listing.</li>
      </ul>

      <h2>A final checklist before continuing to Kakobuy</h2>
      <p>Confirm that the product type, main image and marketplace identity match your shortlist. Review the complete source gallery. Read the recorded price as an estimate and identify any variant-level differences. Check whether the page contains source references, QC references or both. Note unanswered questions that must be resolved after warehouse arrival. Then open the product in Kakobuy and confirm the current seller data one final time.</p>
      <p>The best Kakobuy spreadsheet is not the one with the loudest claim or the largest number in its headline. It is the one that helps you find a relevant record, understand what information is available and move to the correct next step without hiding uncertainty. Search carefully, compare consistently and use the spreadsheet as a decision tool. That approach scales from one product to a complete haul without turning the catalog into guesswork.</p>
    `
  },
  {
    slug: 'how-to-read-kakobuy-qc-photos',
    title: 'How to Read Kakobuy QC Photos Before You Approve an Item',
    description: 'Learn how to review Kakobuy QC photos, separate warehouse inspection images from seller photos and make a consistent approve-or-question decision.',
    excerpt: 'A category-by-category QC photo checklist for checking visible details without confusing source images with your own warehouse inspection.',
    date: '2026-09-23',
    readingTime: '12 min read',
    cover: '/images/guides/kakobuy-qc-photos-guide-v2.webp',
    coverAlt: 'Warehouse inspection desk with product photos, checklist and magnifying glass',
    primaryKeyword: 'Kakobuy QC photos',
    secondaryKeywords: ['Kakobuy QC finder', 'Kakobuy inspection photos', 'how to check QC photos', 'Kakobuy warehouse QC'],
    articleHtml: `
      <p>Kakobuy QC photos are most useful when you review them with a short, repeatable checklist. The purpose is not to turn one photograph into a complete quality guarantee. It is to compare the item that reached the warehouse with the product and option you intended to order, identify visible concerns, and decide whether you have enough information to continue. A disciplined review is faster and more accurate than zooming into every pixel without knowing what would change your decision.</p>
      <p>The first step is understanding what kind of image you are viewing. Seller photos describe a listing. Warehouse inspection photos document an item after arrival. A spreadsheet product page may display source images as references and may also show previously available QC images. Your own order can differ from both. Look for clear labeling, keep the product ID connected to the image set and avoid assuming that every gallery is a fresh inspection of your item.</p>

      <h2>Separate seller photos, reference QC and your order photos</h2>
      <p>Seller photos are usually composed to present the product. They may use controlled lighting, selected samples or close cropping. They are valuable for understanding the intended design, available colors and option structure. They do not prove what arrived at a warehouse. Reference QC photos are more practical because they show an inspected example, but they may come from another order, an earlier batch or a different option.</p>
      <p>Your own warehouse photos have the highest relevance to your decision. Match the order number, selected variant and visible item details before judging quality. If a spreadsheet provides reference images, use them to prepare questions and learn which angles matter. Once your order arrives, compare the new inspection set with the source record rather than treating the older QC set as a promise.</p>

      <h2>Verify identity before inspecting small details</h2>
      <p>Start with the obvious checks: product type, color family, selected size or configuration, quantity and major design features. A perfect close-up of stitching is irrelevant if the warehouse received the wrong color. Compare the main image, option name and marketplace ID with the product page you originally selected. If the item includes multiple pieces, count them before looking at finish quality.</p>
      <p>Then check whether the photos cover the complete item. A useful baseline often includes front, back, both sides, labels or size markings, and any area that distinguishes one option from another. The exact set depends on the category. If a decision-critical view is absent, identify that gap directly. Asking for one purposeful additional photo is more useful than requesting a vague “better QC.”</p>

      <h2>Account for lighting, angle and camera distance</h2>
      <p>Warehouse lighting can shift color, especially with black fabric, pale neutrals, reflective materials and saturated reds or blues. A single photo may make an item look warmer, cooler or shinier than it is. Compare color across several images and use neutral objects in the frame as rough references. If every photo has the same strong color cast, the difference may come from lighting rather than the product.</p>
      <p>Angle also changes proportions. Wide-angle phone cameras can exaggerate edges, make shoes look longer or distort a bag near the frame. Look for centered views with the camera roughly parallel to the item. Use close photos for surface details and wider photos for shape. Do not evaluate overall symmetry from a heavily angled image, and do not evaluate small construction details from a distant overview.</p>

      <h2>How to check shoes</h2>
      <p>For shoes, begin with the pair as a pair. Compare length, toe shape, heel height, panel placement and the way each shoe sits on a flat surface. Check that the color and material correspond with the chosen option. Review the lateral and medial sides separately; a single side view can hide a difference on the opposite shoe. If size information matters, look for the box label and internal size marking when available.</p>
      <p>Next, inspect visible assembly points such as sole edges, panel joins, lace hardware and heel alignment. Minor variations are common in mass-produced goods, so decide in advance which issues are material to you. A loose thread that can be trimmed is different from a major shape mismatch. Photos cannot prove comfort, durability or material composition, so keep the conclusion limited to what the images actually show.</p>

      <h2>How to check clothing</h2>
      <p>For T-shirts, hoodies, jackets and trousers, confirm size markings and the selected color first. Look at the garment laid reasonably flat. Compare sleeve or leg lengths, seam direction, pocket position, closures and visible print placement. Fabric folds can create false asymmetry, so use more than one view before deciding that a panel is misaligned. If measurements are provided, compare them with the size chart and with a garment you already own.</p>
      <p>Printed and embroidered areas deserve a clear, straight photo. Check whether the design is centered relative to seams and whether the visible edges look complete. For zippers, buttons and drawcords, confirm the expected pieces are present. A photograph can show appearance and rough construction, but it cannot reliably prove fabric weight or how a garment will fit your body. Measurements are more useful than a size label alone.</p>

      <h2>How to check bags, belts and accessories</h2>
      <p>For bags, review overall shape before focusing on details. Check front, back, base, handles, straps, closures and interior when available. Confirm that removable pieces shown in the selected option are included. Look at the bag on a flat surface to judge whether it holds a consistent form. Shipping and storage can create temporary creases, so distinguish soft deformation from a structural mismatch.</p>
      <p>For belts and small accessories, verify dimensions, color, closure style and included pieces. Close photographs can reveal scratches or obvious surface marks, but reflective hardware often shows warehouse lights and camera shapes. Compare the same area across several angles before classifying a reflection as damage. If exact length matters, request or inspect a measurement rather than estimating from the frame.</p>

      <h2>Electronics, liquids and specialized items need extra caution</h2>
      <p>Standard QC images are limited for electronics. They may show the exterior, included accessories and visible condition, but they do not automatically confirm battery health, internal components, long-term performance or compatibility. If a service offers functional testing, understand what was actually tested and what was not. A powered-on screen is evidence of that moment, not a comprehensive technical inspection.</p>
      <p>Liquids, fragrances and other restricted or sensitive items can introduce packaging and shipping constraints that a photo cannot resolve. Check the current warehouse and shipping rules before treating the item as ready for international dispatch. The spreadsheet can help you identify the listing, while Kakobuy’s current interface and service information should be used for operational decisions.</p>

      <h2>Use measurements correctly</h2>
      <p>A ruler or measurement line is helpful only when you know what endpoints were used. Clothing width may be measured flat, while a circumference value represents something different. Shoe insole length, outsole length and labeled size are not interchangeable. Bag dimensions can exclude handles or include external pockets depending on the seller. Read the measurement label and compare like with like.</p>
      <p>Allow for small measurement variation caused by fabric tension, camera angle and manual placement. If one dimension is essential, ask for a clear measurement along a defined line. Save the expected value in your order notes so the review is not based on memory. A measurement should answer a decision question, not simply add another number to the page.</p>

      <h2>Decide whether to approve, question or pause</h2>
      <p>After reviewing the full set, group findings into three levels. First are identity problems: wrong item, option, quantity or size. Second are material visible concerns that would make you reject or exchange the item. Third are minor observations that do not change your decision. This prevents small imperfections from receiving the same weight as a wrong product and helps you communicate clearly if follow-up is needed.</p>
      <p>If the evidence is incomplete, pause and request the specific missing view rather than making an unsupported approval. If the concern is visible, describe its location and the image in which it appears. Neutral, precise language is easier to act on than a broad statement that the item “looks bad.” Remember that the available remedy, timing and seller response can vary; confirm the current process inside your order interface.</p>

      <h2>Common QC review mistakes</h2>
      <ul>
        <li>Assuming reference QC photos belong to the item currently in your warehouse.</li>
        <li>Inspecting tiny details before confirming color, size, option and quantity.</li>
        <li>Judging color from one image under strong warehouse lighting.</li>
        <li>Evaluating symmetry from a tilted or wide-angle photograph.</li>
        <li>Expecting photos to prove comfort, material composition or long-term durability.</li>
        <li>Requesting extra images without naming the missing angle or measurement.</li>
        <li>Treating every small visible variation as equal to a wrong-item problem.</li>
      </ul>

      <h2>A practical Kakobuy QC checklist</h2>
      <p>Confirm the marketplace item and selected option. Count every included piece. Review front, back, sides and decision-critical close-ups. Compare color across multiple images. Check size markings and relevant measurements. Separate lighting effects from consistent visible differences. Write down any missing evidence. Classify each concern by whether it changes your decision, then approve, question or pause based on that list.</p>
      <p>Good QC review is not about finding certainty that photographs cannot provide. It is about reducing avoidable mistakes with the evidence available. Keep seller photos, reference QC and your own warehouse inspection clearly separated. Focus on identity first, visible condition second and optional fine details last. That method makes a Kakobuy QC photo set easier to understand and turns inspection into a repeatable decision rather than a reaction to one image.</p>
    `
  },
  {
    slug: 'kakobuy-shipping-cost-parcel-planning',
    title: 'Kakobuy Shipping Cost Guide: Weight, Volume and Smarter Parcel Planning',
    description: 'Understand the variables behind Kakobuy shipping cost, estimate a parcel before checkout and compare packing choices without relying on a fixed quote.',
    excerpt: 'Plan a Kakobuy parcel using item weight, package volume, destination and current shipping-line rules instead of guessing from product price.',
    date: '2026-09-22',
    readingTime: '12 min read',
    cover: '/images/guides/kakobuy-shipping-cost-guide-v2.webp',
    coverAlt: 'Parcel on a digital scale with measuring tape for international shipping planning',
    primaryKeyword: 'Kakobuy shipping cost',
    secondaryKeywords: ['Kakobuy shipping calculator', 'Kakobuy parcel weight', 'Kakobuy shipping guide', 'Kakobuy rehearsal packing'],
    articleHtml: `
      <p>Kakobuy shipping cost cannot be estimated accurately from the product price alone. International parcel pricing depends on the packed weight, package dimensions, destination, available transport line and current rules for the item type. A low-cost product can be expensive to ship if it is bulky, while several compact items may share a parcel efficiently. The useful goal is not to guess one perfect number before purchase. It is to understand the variables, build a reasonable range and verify the final quote after the items reach the warehouse.</p>
      <p>A spreadsheet helps at the product-discovery stage by showing the recorded item price, images and category. Shipping information becomes clearer later, when actual items can be weighed and packed. This guide explains how to connect those stages, how to compare actual and volumetric weight, and how to make packing decisions without treating an early estimate as a guarantee.</p>

      <h2>Separate item price from international shipping</h2>
      <p>The amount shown on a product card normally represents the source item, not the complete delivered cost. Your eventual total may include the selected item option, domestic delivery to the warehouse, optional services, packing choices, international freight and destination-related charges. The exact structure can change, so use the current Kakobuy order and parcel pages for final values. A spreadsheet price is best used to compare products at the same research stage.</p>
      <p>Keep two running totals: merchandise and logistics. This prevents a cheap-looking cart from hiding a costly parcel. Record the selected variant and quantity, because a larger size, reinforced version or bundled set may weigh more than the base listing. When a seller page shows several options under one card price, do not calculate shipping until you know which version you are actually considering.</p>

      <h2>Actual weight and volumetric weight</h2>
      <p>Actual weight is what the packed parcel weighs on a scale. Volumetric weight is a pricing measurement based on the space a parcel occupies. Some shipping lines compare the two and charge using the greater value under their current formula. This is why a large, light box can cost more than a smaller parcel with the same scale weight. The divisor and calculation rules vary by line and can change, so do not apply one internet formula to every option.</p>
      <p>Before warehouse packing, both figures are estimates. Seller descriptions may omit packaging weight, and the final box dimensions depend on how items fit together. Once the warehouse provides measured weight and dimensions, use those values in the current calculator or line-selection interface. If a line prices by volume, reducing empty space may matter more than removing a few grams.</p>

      <h2>Build a pre-purchase estimate from categories</h2>
      <p>You can still plan before ordering. Group items as dense, soft or bulky. Shoes with boxes, structured bags and protective electronics packaging often occupy more space than folded clothing. Hoodies and jackets may compress but still add meaningful weight. Belts, small accessories and thin T-shirts are usually easier to combine, though actual materials and packaging vary. The categories provide planning clues, not fixed weights.</p>
      <p>Use a range rather than a single estimate. Start with the product’s likely item weight, add a packaging allowance and consider whether the item keeps a rigid retail box. For a multi-item haul, create a low estimate and a cautious estimate. If the project is only affordable under the lowest number, the plan has little room for measurement changes. A useful budget survives the cautious scenario.</p>

      <h2>Why packaging choices change the quote</h2>
      <p>Outer cartons, shoe boxes, presentation boxes, protective material and empty space all affect parcel weight or dimensions. Removing retail packaging may reduce the charge, but it can also reduce protection or eliminate something you want to keep. The right decision depends on the item. Soft clothing may tolerate compact packing, while fragile, structured or collectible goods may need more support.</p>
      <p>Do not request the smallest possible parcel without considering damage risk. Instead, decide which packaging is essential, optional or unwanted. Keep protection around fragile areas, and remove only packaging that does not serve your goal. If the platform offers a packing preview or rehearsal-style service, use the resulting measurements to compare shipping lines with better information.</p>

      <h2>Combining items versus splitting parcels</h2>
      <p>Combining items can spread fixed packaging weight across a larger order and may create a better rate per item. It also creates a heavier or more valuable parcel and may reduce the number of suitable shipping lines. Splitting can make each package easier to handle and may separate restricted categories, but it repeats base charges and packaging. There is no universal rule that one large parcel is always cheaper.</p>
      <p>Compare at least two scenarios when the order is substantial: one combined parcel and a logical split. A logical split groups items by size, fragility or shipping restrictions rather than dividing randomly. Use the measured weight and dimensions for each proposed package. If the platform does not show an exact alternative before submission, keep the decision conservative and avoid assuming that a theoretical split will receive the same rate.</p>

      <h2>Shipping lines are not interchangeable</h2>
      <p>Available lines can differ by destination, parcel size, weight limits, tracking, delivery method and accepted product type. The cheapest visible line may not accept the parcel after its contents and dimensions are considered. A faster line may apply a volumetric formula that changes the ranking. Always compare the options shown for the actual packed parcel rather than relying on a route mentioned in an older guide.</p>
      <p>Read the current line notes. Look for size limits, restricted-item rules, tracking scope, compensation terms and whether remote-area fees may apply. Transit estimates are ranges, not appointment times. Customs processing, carrier handoffs, weather and seasonal volume can change delivery. Choose a line based on the parcel and your tolerance for time, tracking detail and cost.</p>

      <h2>Restricted and sensitive items</h2>
      <p>Batteries, electronics, liquids, fragrances, aerosols, magnets and other sensitive categories may have fewer available routes. Packaging or declaration requirements can also differ. A product being available in the source catalog does not mean every international line will accept it. Check current restrictions before placing a time-sensitive order, especially when the cart mixes ordinary clothing with a sensitive item.</p>
      <p>If one restricted item removes several otherwise suitable lines, compare a separate parcel for that item. Do not misdescribe contents to obtain a cheaper option. Accurate information is important for carrier handling and customs processing. When the rule is unclear, use the current platform guidance or support channel rather than relying on an old spreadsheet note.</p>

      <h2>Customs, taxes and destination costs</h2>
      <p>Destination charges depend on local law, declared information, parcel contents and the carrier’s procedures. A shipping quote does not necessarily include every tax, duty, brokerage or handling fee that may be collected later. Rules can change and different destinations apply different thresholds. No spreadsheet can guarantee that a parcel will avoid inspection or additional charges.</p>
      <p>Build a destination allowance into the cautious budget and verify local requirements yourself. Keep order records, product descriptions and shipping documents organized. If you are unsure whether an item is permitted, resolve that question before shipping. A lower freight quote is not useful if the parcel does not comply with the destination or carrier rules.</p>

      <h2>Calculate landed cost by item</h2>
      <p>After receiving the final parcel quote, allocate shipping back to the items. A simple equal split can be misleading when one bulky product drives most of the package volume. Use weight, volume or a reasonable combination to estimate each item’s share. Add the source price, domestic cost, services and allocated international shipping. This gives you an estimated landed cost that is more useful than the product card price alone.</p>
      <p>This calculation improves future decisions. You may learn that compact accessories remain economical while boxed footwear changes sharply after freight. Save the result with the item category and packing choice. Over several parcels, your own records become more relevant than generic estimates because they reflect your destination, preferred lines and tolerance for packaging removal.</p>

      <h2>A practical parcel-planning workflow</h2>
      <ol>
        <li>Shortlist products in the spreadsheet and verify the exact options in Kakobuy.</li>
        <li>Estimate merchandise and logistics separately using low and cautious ranges.</li>
        <li>Identify bulky, fragile or restricted items before submitting orders.</li>
        <li>Review QC and confirm which products should enter the parcel.</li>
        <li>Choose essential protection and decide which optional packaging can be removed.</li>
        <li>Use the warehouse weight and dimensions to compare current shipping lines.</li>
        <li>Compare a combined parcel with a logical split when the difference could be material.</li>
        <li>Add a destination-cost allowance and calculate estimated landed cost.</li>
      </ol>

      <h2>Common Kakobuy shipping estimate mistakes</h2>
      <ul>
        <li>Treating the product price as the delivered total.</li>
        <li>Using a single guessed weight instead of a realistic range.</li>
        <li>Ignoring box dimensions when a line may charge by volumetric weight.</li>
        <li>Removing all packaging without considering protection.</li>
        <li>Assuming one large parcel is always cheaper than two smaller parcels.</li>
        <li>Choosing a line from an old guide instead of the current parcel options.</li>
        <li>Forgetting that destination charges may fall outside the freight quote.</li>
      </ul>

      <h2>Final planning checklist</h2>
      <p>Confirm the exact items and options. Mark which products are bulky, fragile or sensitive. Keep a cautious merchandise and shipping budget. After warehouse arrival, review QC before paying for international freight. Use measured weight and dimensions, compare only lines currently offered for the parcel and read their restrictions. Decide whether packaging removal or a parcel split provides a real benefit, then keep room for destination-related costs.</p>
      <p>A Kakobuy shipping calculator is most useful after the parcel data is known. Before that point, good planning is about ranges and tradeoffs. Treat the spreadsheet as the discovery layer, warehouse measurements as the logistics evidence and the live shipping interface as the final quote. That sequence will not remove every variable, but it will replace guesswork with a repeatable process and make the true cost of each product easier to understand.</p>
    `
  }
];

export const guideBySlug = new Map(guides.map((guide) => [guide.slug, guide]));

export type GuideUi = {
  nav: string;
  kicker: string;
  title: string;
  body: string;
  all: string;
  read: string;
  back: string;
  updated: string;
  keywords: string;
  continueReading: string;
  home: string;
  notFoundTitle: string;
  notFoundBody: string;
};

export const guideUi = {
  en: {
    nav: 'Guides',
    kicker: 'Buyer guides',
    title: 'Kakobuy guides for smarter product research',
    body: 'Practical guides for spreadsheet search, QC photo review and parcel planning.',
    all: 'View all guides',
    read: 'Read guide',
    back: 'All guides',
    updated: 'Updated',
    keywords: 'Topics covered',
    continueReading: 'Continue reading',
    home: 'Home',
    notFoundTitle: 'Guide not found',
    notFoundBody: 'The requested guide is unavailable.'
  }
} satisfies Record<'en', GuideUi>;

type GuideLocaleBundle = {
  ui: GuideUi;
  guides: Record<string, Partial<Guide>>;
};

const translations = guideTranslations as unknown as Partial<Record<Lang, GuideLocaleBundle>>;

export function getGuideUi(lang: string): GuideUi {
  return translations[lang as Lang]?.ui || guideUi.en;
}

export function localizeGuide(guide: Guide, lang: Lang): Guide {
  if (lang === 'en') return guide;
  return { ...guide, ...(translations[lang]?.guides[guide.slug] || {}) };
}

export function getLocalizedGuides(lang: Lang): Guide[] {
  return guides.map((guide) => localizeGuide(guide, lang));
}

export function getLocalizedGuide(slug: string, lang: Lang): Guide | undefined {
  const guide = guideBySlug.get(slug);
  return guide ? localizeGuide(guide, lang) : undefined;
}

export function guideWordCount(guide: Guide) {
  return guide.articleHtml.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
}
