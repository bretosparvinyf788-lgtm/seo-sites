import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'usfansvip.store');
const published = '2026-09-20';

const articles = [
  {
    slug: 'how-to-use-usfans-spreadsheet',
    label: 'Starter tutorial',
    title: 'How to Use the USFans Spreadsheet in 2026: A First-Order Tutorial',
    shortTitle: 'How to Use the USFans Spreadsheet in 2026',
    description: 'A step-by-step USFans spreadsheet tutorial for finding a product, checking variants, reading warehouse QC and planning a first international parcel.',
    intro: 'A first-order workflow that turns a promising spreadsheet row into a documented purchase, a useful warehouse inspection and a deliberate shipping decision.',
    accent: '#ff6533',
    related: ['is-usfans-legit-buyer-verification-checklist', 'usfans-spreadsheet-price-audit-before-payment', 'usfans-qc-photos-return-window'],
    sections: [
      {
        heading: 'Understand what the spreadsheet does—and what it cannot decide',
        paragraphs: [
          "A USFans spreadsheet is best treated as a discovery layer. It can place product leads, categories and direct destination pages in one browsable index, saving the time required to search several marketplaces from scratch. A row is an invitation to inspect a live listing, not a guarantee that the pictured item, displayed price or selected variation is still available. Inventory, seller terms, domestic delivery and product options can change after a spreadsheet entry is published.",
          "Keep the roles separate from the beginning. USFansVIP.store organizes finds and buyer education; it does not hold stock or process an order. The destination listing supplies the current commercial details, while the purchasing service communicates with the seller and receives the item at a warehouse. The buyer still chooses the exact version, checks the evidence and decides whether the parcel is ready for international shipping. That division prevents a useful index from being mistaken for a warranty.",
          "For a first order, success is not simply receiving any item with the same name. Success means that the product arriving at the warehouse matches a written record of the listing, variant, quantity, expected dimensions and acceptable visible condition. Build that record before payment, because later photos can only answer questions you remembered to define."
        ],
        note: 'Use the spreadsheet to find a lead. Use the live listing and your saved evidence to decide whether to buy.'
      },
      {
        heading: 'Search narrowly and create a three-item shortlist',
        paragraphs: [
          "Begin with a specific search phrase that combines the product type with the feature that matters most: running shoe plus size, bag plus material, jacket plus season, or cable plus connector. Broad brand-only searches create a long visual feed but do not help compare usable options. Category shortcuts are useful for orientation, yet a deliberate phrase makes it easier to notice when a listing does not actually describe the required model.",
          "Open several plausible results in separate tabs, then reduce them to a shortlist of three. For each candidate, record the seller page, product title, option range, visible sales information, current price range and any obvious restriction or minimum quantity. Do not select the cheapest headline immediately. A higher-looking listing may include the desired version while the lowest number belongs to a sample, accessory, smallest size or quantity tier.",
          "Remove any candidate whose options you cannot interpret confidently. Also remove pages with contradictory images and text unless the seller can clarify them before purchase. The shortlist should contain alternatives you would genuinely accept, not three near-duplicates chosen only to complete a table. If the preferred listing disappears, the comparison record helps you replace it without restarting from zero."
        ],
        bullets: ['Search by product plus one decisive feature.', 'Shortlist three genuinely acceptable listings.', 'Record the exact option that produced the visible price.', 'Reject ambiguity before it becomes warehouse inventory.']
      },
      {
        heading: 'Read the live listing from the option selector outward',
        paragraphs: [
          "The selected option is the center of the order. Click the exact color, size, model, pack count or specification and watch for changes to the price, gallery, availability and domestic delivery estimate. Save the original option wording as well as your translation. Two variations can look identical in English after automated translation while remaining distinct to the seller and agent.",
          "Then inspect the measurement chart and description images. Compare units carefully; a chart may use centimeters, Chinese sizing conventions or garment measurements rather than body measurements. For electronics, confirm connector, voltage and regional compatibility. For sets, count every included piece. For shoes and clothing, compare a known item measured flat instead of relying only on a familiar letter size.",
          "USFans currently supports sourcing from marketplaces including 1688, where wholesale structures such as minimum quantities and price tiers may matter. When a listing uses trade-order logic, confirm whether the minimum applies to the whole listing or to each variant. Record the physical unit count, not merely the number of packs placed in the cart. Recheck live service and listing terms before paying because policies and stock can change."
        ]
      },
      {
        heading: 'Build a pre-payment order record',
        paragraphs: [
          "Create one compact record for every item. Include the source URL, seller name, listing title, selected option in the original language, your interpretation, quantity, item price, domestic delivery, size chart, reference images and date checked. Add one sentence describing the expected item in plain language. If that sentence is difficult to write, the selection is probably not clear enough to purchase.",
          "Take screenshots after selecting the intended variation, not before. A generic gallery image may show a premium model while the active selection is a basic version. Capture any promises that affect the decision, such as included accessories, material description or seller dispatch time. Separate seller claims from your own expectation so a later disagreement can be explained precisely.",
          "Calculate a planning total rather than stopping at the item subtotal. Include Chinese domestic delivery, purchasing or service charges shown at checkout, optional inspection services, estimated international freight, packaging and a buffer for currency movement or destination charges. The exact freight usually becomes clearer after warehouse weighing, but an early range helps prevent an inexpensive find from becoming an unaffordable parcel."
        ],
        note: 'Your record should let another person identify the exact option without relying on memory or a product thumbnail.'
      },
      {
        heading: 'Place the order with instructions that trigger a pause',
        paragraphs: [
          "Order remarks work best when they define what must not happen without approval. State the selected model, size, color and quantity, then identify any substitution that requires contact. Short, operational instructions are better than a long description of your taste. For example, ask the agent to pause if the selected size is unavailable instead of allowing the seller to choose a nearby size.",
          "Do not use a remark to invent a specification the listing never offered. If you need customization, special packaging or a mixed wholesale batch, confirm feasibility and return conditions before payment. Save the final cart and payment summary beside the pre-payment record. This creates a timeline showing what was selected, what was charged and what the agent was asked to do.",
          "After payment, monitor procurement status and seller dispatch rather than assuming silence means progress. A purchasing delay, an out-of-stock message and domestic tracking are different events. Respond quickly when the agent asks for a decision, but compare the request with the saved record first. A fast answer is valuable only when it preserves the intended order."
        ]
      },
      {
        heading: 'Review warehouse QC against the saved specification',
        paragraphs: [
          "When the item reaches the warehouse, confirm identity before judging small cosmetic details. Match the order number, selected option, visible label, color, size and quantity. USFans public product information currently describes three to seven free high-definition inspection photographs. Treat those images as visible evidence, not as certification of authenticity, composition, durability or hidden construction.",
          "Inspect category-specific risks next. For clothing, examine measurements, print placement, seams and stains. For footwear, compare both shoes, size labels, sole shape and visible glue. For bags, check hardware, panels, straps and major alignment. For electronics, confirm the ordered model and connector, while recognizing that a routine photograph may not prove performance. Ask for clarification or additional evidence when the decisive feature is not visible, subject to current service options.",
          "Choose one documented outcome: approve, request clarification, exchange or return. USFans pages currently state a five-day application period after warehouse arrival for dissatisfied buyers, with the agent negotiating with the seller. Treat that as an action window rather than a guaranteed refund. Seller rules, product condition and customization can affect eligibility, so check the live policy and act promptly."
        ],
        bullets: ['Check identity, option and count first.', 'Compare measurements and visible features second.', 'Do not infer hidden quality from attractive photos.', 'Record one clear warehouse decision before shipping.']
      },
      {
        heading: 'Consolidate only after weight, dimensions and restrictions are known',
        paragraphs: [
          "A first parcel becomes easier to plan once every included item has a warehouse weight and usable dimensions. Compare actual weight with the route’s volumetric calculation, because a light but bulky box may be charged at a higher dimensional weight. Review route eligibility for every product; batteries, liquids, magnets, branded goods and other sensitive categories may limit the available lines.",
          "Consolidation can reduce repeated base charges, but waiting indefinitely has costs. USFans public guidance currently describes ninety days of free storage. Use that period as a planning boundary, not a reason to postpone decisions until the final week. Set a parcel cutoff, keep a calendar for each arrival and leave time to resolve inspection issues before storage or return deadlines become urgent.",
          "Before submission, reconcile the parcel manifest, delivery address, route, declared information, packaging requests, insurance or compensation terms and estimated charge. Save the submitted version. After dispatch, keep the international tracking number and carrier handoff details with the order record. Your first order is now a reusable template for the next one."
        ]
      },
      {
        heading: 'Use a repeatable first-order checklist',
        paragraphs: [
          "A good tutorial becomes valuable when it can be repeated without rereading every paragraph. Turn this workflow into seven gates: discover, shortlist, verify the listing, record the order, monitor procurement, inspect the warehouse evidence and audit the parcel. Do not advance through a gate while a decision-critical field is blank. The small delay before payment is usually easier to manage than a correction after international dispatch.",
          "For the first order, choose a modest, non-urgent item whose size and visible features can be checked from photographs. Avoid building a large mixed parcel solely to make shipping appear economical. The purpose of the test is to learn the interface, communication rhythm, inspection quality and route selection with limited exposure. A successful small order produces evidence about the process, not a promise that every future seller or route will behave identically.",
          "Finally, refresh all live information when you return to an old spreadsheet entry. Prices, options, coupons, service fees and routes can change. Keep the method stable while allowing the commercial details to move. That is the safest way to use an evolving USFans spreadsheet in 2026."
        ],
        bullets: ['Discover a specific lead.', 'Verify the exact live option.', 'Save evidence before payment.', 'Review warehouse QC against that evidence.', 'Ship only after a full parcel audit.']
      }
    ]
  },
  {
    slug: 'is-usfans-legit-buyer-verification-checklist',
    label: 'Buyer safety',
    title: 'Is USFans Legit in 2026? A Buyer Verification Checklist',
    shortTitle: 'Is USFans Legit? A Buyer Verification Checklist',
    description: 'Evaluate whether USFans is right for your order with a practical checklist for domains, fees, payment, warehouse QC, returns, support and shipping evidence.',
    intro: 'A fact-based way to answer the legitimacy question without treating one review, one screenshot or one successful parcel as universal proof.',
    accent: '#19a974',
    related: ['how-to-use-usfans-spreadsheet', 'evidence-first-usfans-buying-workflow', 'usfans-qc-photos-return-window'],
    sections: [
      {
        heading: 'Replace the yes-or-no question with a verification standard',
        paragraphs: [
          "People searching “is USFans legit” usually want to know several different things at once: whether the website is the intended service, whether payments and account access are handled predictably, whether purchased goods reach a warehouse, whether inspection evidence is useful, and whether international parcels can be traced. A single yes or no cannot answer all of those questions for every seller, product and destination.",
          "Separate platform risk from seller risk and shipping risk. An agent may complete its purchasing and warehouse tasks while a marketplace seller sends the wrong variation. A seller may dispatch the right product while a route experiences customs or carrier delays. Reviews often collapse these events into one verdict, which makes them emotionally persuasive but operationally weak.",
          "Use a verification standard you can repeat. Confirm the domain and published service information, map the fee flow, protect the account, test support, document one small order and preserve the warehouse and tracking evidence. The goal is not to prove that nothing can go wrong. It is to discover whether the process is transparent enough for you to detect, explain and limit a problem."
        ],
        note: 'Legitimacy is not the same as suitability. A functioning service can still be a poor fit for a particular product, route, budget or deadline.'
      },
      {
        heading: 'Confirm the domain, identity and current policy pages',
        paragraphs: [
          "Start from the address bar rather than a social-media button. Check the spelling of the domain, the secure connection and the destination of any payment or login page. Saved bookmarks reduce the risk of returning through an imitation link. If a spreadsheet or community post opens a purchasing page, compare the domain with the service you intended to use before entering account details.",
          "Read the current help, fee, shipping, privacy and after-sales information. Look for a coherent explanation of the buying flow: payment, procurement, domestic delivery, warehouse inspection, storage, parcel submission and international tracking. Record the date because service details change. Missing perfection is not the test; the test is whether the process, charges and responsibilities are described clearly enough to plan an order.",
          "USFans public pages currently describe purchasing from Chinese marketplaces, warehouse inspection photographs, a time-limited return application after warehouse arrival and a free-storage period. Those published features should be verified on the live service when you order. A third-party article can explain how to use a policy, but only the current official interface and terms can establish what applies to a specific transaction."
        ]
      },
      {
        heading: 'Trace every charge before funding the account',
        paragraphs: [
          "A legitimate-looking product price is not a complete cost statement. Map the full payment path: item price, Chinese domestic delivery, service or purchasing charges, exchange-rate treatment, optional warehouse services, packaging, international freight and possible destination tax. Note whether an amount is a final charge, a refundable shipping deposit or an estimate that may be adjusted after weighing.",
          "Compare the order summary with the live listing before payment. The chosen variation, quantity and seller delivery cost should match the record you created. If the displayed amount changes, identify which field changed rather than assuming the platform added a hidden fee. Some differences come from a new option, quantity tier or seller freight; others may be service charges that should be visible in the checkout explanation.",
          "Fund only the amount needed for a controlled first test. Avoid keeping a large unused balance until you understand withdrawal rules, currency conversion and refund timing. Save receipts, transaction identifiers and screenshots without exposing them publicly. These records help support locate the payment while keeping account credentials private."
        ],
        bullets: ['Identify every stage where money can be added or adjusted.', 'Distinguish an estimate from a final charge.', 'Record the selected option and checkout total together.', 'Use a modest test amount before scaling.']
      },
      {
        heading: 'Protect the account and test support safely',
        paragraphs: [
          "Use a unique password and enable any available security controls. Never send a password, one-time code or full payment credential to a seller, influencer or support account. Contact support through the authenticated service or a channel listed on the official site. A person who approaches you first and requests remote access, a private transfer or an off-platform recovery fee should be treated as a separate risk.",
          "Before placing a complex order, ask support one concise, non-urgent question whose answer you can verify in the published workflow. Judge the response by whether it addresses the exact account or service issue, distinguishes seller decisions from platform decisions and provides a traceable next step. Speed matters less than a clear answer tied to the order stage.",
          "Keep conversations in the order record when possible. If another channel is required, save the case number, time and summary. Do not publish another person’s details or your own sensitive account data when requesting community advice. A redacted timeline is more useful than an emotional screenshot because it shows what happened without creating a new security problem."
        ]
      },
      {
        heading: 'Run a small order that produces visible evidence',
        paragraphs: [
          "Choose a low-complexity product with a clear option, modest value and features that can be checked visually. Avoid a customized item, a deadline-sensitive gift or a route-restricted product for the first test. Save the source page, selected variant, quantity, price, measurement chart and one decisive inspection requirement before payment.",
          "Monitor the transition from purchase to seller dispatch and warehouse arrival. Each state should have a reasonable explanation in the service flow. A delay is not automatically fraud, but an unexplained state deserves a dated support question. Record when the status changed and what evidence appeared, rather than repeatedly refreshing and relying on memory.",
          "At the warehouse, compare the photographs with the saved specification. USFans public product information currently describes three to seven free high-definition inspection images. Confirm that the set actually shows the features needed for your item. Photographs can establish visible identity, quantity, color, labels and condition; they cannot establish authenticity, long-term durability or every hidden component."
        ],
        note: 'A test order should teach you how the process handles ordinary evidence and communication, not maximize the number of items shipped.'
      },
      {
        heading: 'Evaluate returns and problem handling before shipping',
        paragraphs: [
          "Problem handling is a stronger signal than a perfect promotional page. Review the return application window, seller eligibility, domestic return cost and evidence requirements before approving the warehouse item. USFans product pages currently state that a dissatisfied buyer can apply for a return within five days after warehouse arrival and that the agent negotiates with the seller. Verify the live rule for the actual order.",
          "If something is wrong, describe the mismatch in testable terms. Pair the selected option and listing evidence with the warehouse image that shows the problem. “Ordered black size L; warehouse label shows blue size M” is actionable. “Looks fake” or “not good” may express a concern but does not identify the remedy or the evidence needed.",
          "Do not submit international shipping while a material dispute is unresolved. Once an item leaves the warehouse, ordinary seller returns are much harder or impossible. Keep the response, outcome and any refund ledger entry. A service that shows the status of a return and the movement of funds gives you more useful evidence than a vague promise in a private chat."
        ]
      },
      {
        heading: 'Separate shipping uncertainty from platform evidence',
        paragraphs: [
          "International delivery involves warehouse packing, line selection, carrier handoff, export movement, import processing and last-mile delivery. A tracking gap can occur between physical handoffs and data scans. Evaluate whether the parcel has a recorded manifest, submitted address, route, charge, tracking number and carrier trail before concluding that one quiet period defines the entire service.",
          "Read the current route restrictions, delivery estimate, insurance or compensation terms and excluded items. Estimates are ranges rather than appointments. Customs decisions and local carrier performance may sit outside the agent’s direct control, while accurate submission data and documented handoff remain part of the evidence you should expect.",
          "For a first parcel, choose a route whose rules you understand rather than the lowest headline price. Save the final weight, dimensions, packaging choices and declared information. When the parcel arrives, compare the actual timeline and condition with the plan. That result informs your next order far better than an anonymous claim that every route is always fast or always unsafe."
        ]
      },
      {
        heading: 'Score the decision and recognize genuine warning signs',
        paragraphs: [
          "Create a simple scorecard with six rows: identity, fee transparency, account security, purchasing evidence, warehouse control and shipping traceability. Mark each as verified, unclear or unacceptable. One unclear item can trigger a support question; an unacceptable item involving payment destination, credential requests or missing order evidence should stop the transaction.",
          "Warning signs include lookalike domains, requests for passwords or one-time codes, pressure to pay privately, guarantees that ignore customs and seller variation, refusal to provide an order record, and demands for extra money without an identifiable charge. Another warning is a promise that warehouse photos prove authenticity. They do not; they show only what is visible in the images.",
          "Your conclusion should be proportional: suitable for a small test, suitable only for certain categories, not suitable for the required deadline, or stop until a specific issue is resolved. Reassess the live terms for every significant order. This checklist cannot remove risk, but it converts “is USFans legit?” into evidence you can inspect before committing more money."
        ],
        bullets: ['Verify the exact domain and payment destination.', 'Map charges and refund movement.', 'Test the process with a controlled order.', 'Require warehouse and tracking evidence.', 'Stop when a security-critical fact is unclear.']
      }
    ]
  },
  {
    slug: 'usfans-vs-cnfans-vs-kakobuy-comparison',
    label: 'Agent comparison',
    title: 'USFans vs CNFans vs Kakobuy: Fees, QC, Storage and Shipping Compared',
    shortTitle: 'USFans vs CNFans vs Kakobuy',
    description: 'Compare USFans, CNFans and Kakobuy with a repeatable live-quote method covering fees, exchange rates, QC, storage, shipping routes and support.',
    intro: 'A neutral comparison framework that uses the same test cart and destination instead of relying on outdated headline prices or referral claims.',
    accent: '#2778ff',
    related: ['usfans-coupons-shipping-discounts-real-savings', 'usfans-shipping-cost-volumetric-weight-customs', 'usfans-parcel-submission-audit-address-route-packaging'],
    sections: [
      {
        heading: 'Compare an order scenario, not three brand names',
        paragraphs: [
          "A useful USFans vs CNFans vs Kakobuy comparison begins with one specific order. Agent costs and available routes depend on the marketplace, product category, parcel weight, dimensions and destination. A platform that looks inexpensive for a single light garment may not remain cheapest for a bulky mixed parcel. A service with many routes may still offer only a few lines for batteries, liquids or another restricted category.",
          "Define a test scenario before opening the calculators: the same three product links, exact variants, quantities, destination country, expected warehouse weight, approximate dimensions and packaging request. Use a non-sensitive, ordinary product set so restrictions do not dominate the result. Record the date and currency because fees, exchange rates, coupons and route lists move.",
          "This guide does not declare a permanent winner. Instead, it shows how to collect comparable evidence from the live USFans, CNFans and Kakobuy interfaces. That distinction matters: a table copied from an old review may be precise yet wrong for today’s checkout. Your own synchronized quote is narrower but much more useful."
        ],
        note: 'The comparison unit is one identical cart, one destination and one date—not the marketing headline on each homepage.'
      },
      {
        heading: 'Normalize the product and purchasing cost',
        paragraphs: [
          "Start with the source listing price in its original currency. Confirm that every platform is resolving the same marketplace page and exact option. If one interface defaults to a different color, pack count or quantity tier, the results are not comparable. Add Chinese domestic shipping and any visible purchasing or service charge before conversion.",
          "Exchange-rate treatment can create more difference than a small service percentage. Record the platform currency amount, the underlying source-currency subtotal and the amount your payment method would charge at the same moment. Do not mix a wallet balance purchased earlier with a new card quote unless you also record the original funding cost.",
          "If one agent cannot buy the selected listing or requires manual processing, note that as an availability or workflow difference rather than forcing a numerical tie. A low quoted cost has little value if the intended product cannot be purchased with clear instructions. The output of this stage should be a landed-at-warehouse estimate, excluding international freight but including the cost required to make the same items arrive there."
        ],
        bullets: ['Lock identical source URLs and variants.', 'Include seller domestic delivery.', 'Record service charges and exchange-rate effects.', 'Separate unavailable listings from price comparisons.']
      },
      {
        heading: 'Compare QC evidence as a decision tool',
        paragraphs: [
          "Quality control should be compared by usefulness, not by the largest advertised photo count. Define the evidence the cart requires: labels and measurements for clothing, both sides and size tags for shoes, hardware and strap attachment for bags, or connectors and model identifiers for electronics. Then check what standard photographs each service provides and what additional views cost.",
          "USFans public product information currently describes three to seven free high-definition inspection photos. Confirm the live offering and compare it with current CNFans and Kakobuy policies at the time of the test. Record image resolution, turnaround, the ability to request a measurement or close-up, and whether comments stay attached to the order.",
          "No agent photograph proves authenticity, material composition, hidden construction or long-term performance. The best QC workflow is the one that reveals the visible facts needed for an approve, clarify, exchange or return decision. Score each platform against that requirement. Extra decorative images should not outweigh one missing measurement that determines whether the item is usable."
        ]
      },
      {
        heading: 'Measure return, exchange and storage constraints',
        paragraphs: [
          "A warehouse is valuable because it creates a decision point before international shipment. Compare how each agent presents the seller return window, who pays domestic return freight, how exchanges are requested and what evidence the case requires. A headline promise is less useful than an order screen that clearly shows the deadline and current status.",
          "USFans product pages currently state a five-day application period after warehouse arrival for dissatisfied buyers, with the agent negotiating with the seller. Its public guidance also describes ninety days of free storage. Verify both live because eligibility and duration can change. Collect the equivalent current policy for CNFans and Kakobuy, noting whether different item types or seller terms alter it.",
          "Storage should be compared against your consolidation plan. A long period has value only if you track arrival dates and resolve QC promptly. Record free days, paid extensions, disposal rules and whether returned or pending items continue to consume time. Score deadline visibility as well as duration; a clearly displayed shorter window may be easier to manage than a longer one hidden across several pages."
        ]
      },
      {
        heading: 'Build comparable international shipping quotes',
        paragraphs: [
          "Shipping calculators need the same inputs. Use identical destination, actual weight, length, width and height. Select the same broad packaging assumption, such as retaining or removing product boxes, and note whether the quote includes fuel, handling or remote-area adjustments. If a calculator omits a field, mark the limitation rather than inventing a number.",
          "For every eligible route, record estimated delivery range, chargeable-weight formula, minimum billing increment, restrictions, tracking level and compensation terms. Do not compare one platform’s fastest premium line with another platform’s slowest economy line. Create route groups with roughly similar service and protection, then compare within each group.",
          "A quote before packing is still an estimate. Dimensional weight may change when the warehouse consolidates the parcel. Ask whether the shipping deposit is adjusted after measurement and how any difference returns to the balance or payment method. The comparison should show an expected range and the source of uncertainty, not a falsely exact final amount."
        ],
        note: 'Use actual and volumetric inputs from the same parcel model. A route name alone does not make two services equivalent.'
      },
      {
        heading: 'Include coupons without letting them control the result',
        paragraphs: [
          "Coupons belong in a separate column because they may be temporary, new-user only, route-specific or capped. Calculate the baseline quote first. Then verify the coupon’s eligibility, minimum spend, maximum reduction, currency, expiry and whether it applies before or after another charge. A percentage without a cap or eligible base cannot be compared.",
          "Apply a discount to the same shipping scenario on the same date. If one offer is not available to your account, do not count it. Referral advertising often highlights the largest possible number, while the test parcel may receive a much smaller absolute reduction. Record the amount actually accepted by checkout.",
          "Also calculate the repeat-order view without a welcome offer. A platform that wins only once may still be the right choice for a test, but it should not be labeled the permanent cheapest. Separate first-order value from normal operating cost so the decision remains honest."
        ]
      },
      {
        heading: 'Score support and workflow with one controlled task',
        paragraphs: [
          "Operational friction has a cost even when it does not appear in the invoice. Use the same small task on all three services: locate an order, explain one variant ambiguity, request one measurable QC detail, or clarify a route restriction. Record how easy it is to submit the request, whether the reply addresses the exact question and whether the answer remains attached to the order.",
          "Do not manufacture a dispute or overload support for a comparison. The goal is to observe the normal interface and communication path. Consider notification clarity, translation quality, status history, deadline visibility and whether a decision can be made without moving to an unverified private channel.",
          "A slower but complete response may be more useful than a fast generic answer. Score resolution rather than response time alone. If a platform requires repeated explanation, estimate the time cost and the risk of a misunderstood instruction. Buyers placing complex batches may weight this factor more heavily than buyers submitting a single standard item."
        ]
      },
      {
        heading: 'Choose with a weighted decision matrix',
        paragraphs: [
          "Create columns for USFans, CNFans and Kakobuy, then rows for warehouse-arrival cost, exchange-rate effect, QC usefulness, return control, storage, route fit, expected shipping, protection terms and support. Give each row a weight based on the order. For a low-value garment, shipping efficiency may dominate. For a complex 1688 batch, instructions and variant evidence may matter more.",
          "Score only what you verified on the same date. Use notes for unknowns instead of turning missing information into an average number. Multiply each score by its weight and review the result, but keep any stop conditions outside the arithmetic. An unacceptable payment destination, prohibited product or unavailable route should end that option even if its total score is high.",
          "Save the matrix as a snapshot and rebuild it for a materially different parcel. The honest answer to USFans vs CNFans vs Kakobuy is often “best for this cart under these conditions.” That conclusion is more actionable than a universal ranking and more resilient when fees, coupons or routes change.",
          "Keep the raw quotes with the scorecard so you can see whether a later change comes from the platform, the parcel model or your own priorities. A transparent runner-up is also useful: if the preferred route becomes unavailable, you already know which verified alternative to revisit."
        ],
        bullets: ['Use one synchronized test cart.', 'Verify policies in the live interfaces.', 'Compare equivalent routes and evidence.', 'Weight the factors that matter to the actual order.', 'Recalculate when the parcel or date changes.']
      }
    ]
  },
  {
    slug: 'usfans-coupons-shipping-discounts-real-savings',
    label: 'Coupons and savings',
    title: 'USFans Coupons and Shipping Discounts: How to Measure Real Savings',
    shortTitle: 'USFans Coupons and Shipping Discounts',
    description: 'Measure a USFans coupon or shipping discount against the real parcel total, including caps, eligibility, volumetric weight, fees and currency conversion.',
    intro: 'A coupon-checking method that separates an eye-catching percentage from the amount actually removed from your payable parcel total.',
    accent: '#f4aa00',
    related: ['usfans-vs-cnfans-vs-kakobuy-comparison', 'usfans-shipping-cost-volumetric-weight-customs', 'usfans-spreadsheet-price-audit-before-payment'],
    sections: [
      {
        heading: 'Define savings as an amount removed from a real baseline',
        paragraphs: [
          "A USFans coupon is valuable only when it reduces a charge you would otherwise pay for the same order. Start with a baseline transaction: identical products, destination, parcel weight, dimensions, route, packaging and payment currency. Record the payable total before entering a code. Without that baseline, a discount badge can be confused with a lower product option, a different route or an estimate that would have changed anyway.",
          "Keep product discounts, service credits and international shipping coupons in separate rows. They may apply to different bases and become available at different stages. A product code cannot be assumed to reduce freight, and a shipping allowance may not affect purchasing charges or domestic delivery. Label the charge being reduced before calculating the percentage.",
          "The basic result is simple: verified baseline minus verified discounted total. The harder work is making sure the two totals represent the same transaction. Take dated screenshots of both summaries, but never expose account identifiers or payment details. Your goal is an auditable savings number, not proof that a promotional headline exists."
        ],
        note: 'Real savings = the same payable transaction before the code minus after the code.'
      },
      {
        heading: 'Read every eligibility condition',
        paragraphs: [
          "Check who can use the offer. It may be limited to new users, a referral campaign, a country, an account tier or one use per person. Then check the eligible charge, minimum spend, maximum reduction, supported routes, currency and expiry time. “Ten percent off” is incomplete until you know ten percent of what and up to which cap.",
          "Confirm whether the threshold is measured before or after other discounts. If the cart barely meets a minimum, a seller price change or removed item may make the code invalid. For a shipping coupon, determine whether the threshold uses the estimated deposit or the final chargeable freight after packing.",
          "Do not create multiple accounts or misstate information to bypass restrictions. Apart from violating terms, that behavior can complicate identity checks, balances and parcel ownership. Count only offers legitimately available to the account that will place the order. A code that the checkout rejects has zero value in the comparison, regardless of how widely it is advertised."
        ],
        bullets: ['Account and region eligibility', 'Eligible charge and route', 'Minimum spend and maximum reduction', 'Expiry time and usage limit', 'Combination rules with other offers']
      },
      {
        heading: 'Calculate percentage coupons with caps correctly',
        paragraphs: [
          "For a percentage coupon, multiply the eligible base by the stated rate, then take the smaller of that result and the maximum discount. Suppose a parcel has an eligible shipping charge of 420 units, a ten-percent offer and a cap of 25. Ten percent would be 42, but the real reduction is 25. The effective discount on eligible freight is therefore about six percent, not ten.",
          "If only part of the parcel charge is eligible, use that smaller base. Surcharges, insurance, handling or remote-area fees may be excluded. Record the exact fields that changed after applying the code. When the interface shows only one final number, compare the detailed quote or ask support which charge received the reduction.",
          "A fixed-value voucher can be easier to model, but currency still matters. Check whether the voucher is denominated in account currency, source currency or destination currency and how conversion is handled. Avoid comparing a converted promotional face value with the actual reduction shown at checkout."
        ]
      },
      {
        heading: 'Do not let the coupon hide volumetric shipping cost',
        paragraphs: [
          "International freight may use the greater of actual and volumetric weight. A light parcel with large dimensions can therefore cost more than its scale weight suggests. Calculate or estimate both before deciding that a coupon makes the shipment economical. The divisor and rounding method depend on the route, so use the live calculator’s current rule.",
          "Packaging changes can save more than a voucher. Removing unnecessary boxes, using appropriate compression or separating a restricted item may reduce chargeable volume or unlock a better route. These choices also have tradeoffs: protective packaging can prevent damage, and removing retail boxes may be undesirable. Compare the expected monetary effect and the condition risk rather than automatically choosing the smallest parcel.",
          "Apply the coupon after building the realistic parcel model. If the discount encourages you to add low-priority items that increase a billing increment or push the box into a higher volumetric tier, the total payable amount can rise. The correct question is not “How much did the coupon remove?” but “Is the final parcel better value than the planned parcel without promotion?”"
        ],
        note: 'A smaller, well-packed parcel can create a larger saving than a percentage code applied to an oversized box.'
      },
      {
        heading: 'Include exchange rates, fees and refund behavior',
        paragraphs: [
          "A discount can be offset by payment processing or exchange-rate spread. Record the account-currency price and the amount charged by the payment method. If you already hold a wallet balance, use the original funding cost for an honest comparison. Otherwise the analysis treats earlier conversion as free.",
          "Check whether a cancelled order returns the coupon, its discounted value, or only the cash portion. Also check what happens when the final shipping charge is lower than the deposit. A refund to platform balance is not identical to a refund to the original payment method if you do not plan another order.",
          "Keep promotional credit separate from withdrawable funds in your ledger. If a credit expires, its value depends on whether you can use it for a planned purchase before that date. Do not count a future coupon at full face value merely because it appears in the account."
        ]
      },
      {
        heading: 'Compare route-specific offers on equivalent service',
        paragraphs: [
          "A shipping code may apply only to selected lines. Compare the discounted eligible route with an undiscounted alternative that offers similar tracking, estimated delivery, restrictions and compensation. A cheaper economy route is not automatically a better deal if it cannot carry the product or does not meet the buyer’s timing and protection needs.",
          "List at least three numbers: the best suitable baseline route, the discounted route before the coupon, and the discounted route after the coupon. If the eligible route remains more expensive than another suitable line, the promotion did not create the lowest practical cost. It may still offer faster service or stronger protection, but label that as a service choice.",
          "Route names and conditions change, so record the quote date. Estimates are not delivery guarantees. The comparison should tolerate adjustments after warehouse packing and final measurement. Use a range where needed rather than presenting a temporary calculator output as a permanent price."
        ]
      },
      {
        heading: 'Build a simple coupon ledger',
        paragraphs: [
          "Use one row per offer with columns for source, code, eligible account, eligible charge, rate, cap, minimum, expiry, route restriction, baseline, discounted total and verified savings. Add a status such as available, tested, used, expired or rejected. This prevents the same voucher from being counted in several future parcels.",
          "For a parcel, create a second calculation that removes the coupon. This normal-cost view is useful for repeat ordering. Add the verified savings to any packaging reduction, but do not combine them into one percentage unless they share the same baseline. Clear labels make the ledger easier to audit.",
          "After payment, replace estimated savings with the amount on the final invoice. If freight is adjusted, recalculate. Over several parcels, track the average verified saving rather than the largest advertised offer. That history shows whether promotions materially affect your buying plan or merely change which button receives attention."
        ],
        bullets: ['Capture the unchanged baseline.', 'Record every eligibility rule.', 'Use the lower of percentage result and cap.', 'Compare equivalent routes.', 'Replace estimates with final invoice values.']
      },
      {
        heading: 'Recognize discount traps and use a stop rule',
        paragraphs: [
          "Urgency is the most common promotional trap. An expiry timer can push a buyer to skip option checks, QC decisions or route research. Set a stop rule before opening the coupon page: no purchase solely to avoid losing a discount, no extra item unless it was already planned, and no route change unless the new line remains suitable.",
          "Another trap is treating a referral claim as account credit. Confirm the code inside the live checkout and inspect the actual reduction. Do not share credentials or one-time codes with someone offering to activate a private discount. A legitimate promotion should not require control of the account.",
          "The best use of a USFans coupon is modest: it improves a transaction that already passes the product, cost, QC and shipping checks. If the transaction fails those checks without the offer, the discount should not rescue it. Measured this way, coupons become a useful line in the budget instead of the reason for taking an avoidable risk.",
          "Before confirming payment, read the final summary once without looking at the crossed-out promotional number. Ask whether the exact products, route and total still fit the original plan. Save the accepted code and invoice together, then set any unused offer aside. This last check prevents a promotion from changing the order after the analysis was completed and gives you a clean baseline for the next parcel."
        ]
      }
    ]
  },
  {
    slug: 'usfans-parcel-tracking-statuses-delay-timeline',
    label: 'Parcel tracking',
    title: 'USFans Parcel Tracking Statuses: A Delay Escalation Timeline',
    shortTitle: 'USFans Parcel Tracking Statuses and Delays',
    description: 'Decode USFans parcel tracking from seller dispatch to last-mile delivery and use an evidence-based timeline for quiet scans, customs holds and delays.',
    intro: 'A stage-by-stage tracking guide for deciding when a quiet status is normal, when to collect evidence and when to escalate with a precise question.',
    accent: '#7b4ee8',
    related: ['usfans-parcel-submission-audit-address-route-packaging', 'usfans-warehouse-calendar-90-day-consolidation', 'usfans-shipping-cost-volumetric-weight-customs'],
    sections: [
      {
        heading: 'First identify which journey you are tracking',
        paragraphs: [
          "A USFans order can produce two separate tracking journeys. The first is Chinese domestic movement from the marketplace seller to the warehouse. The second begins after parcel submission and covers the international route to the delivery address. Confusing them leads to premature escalation: a seller tracking number cannot explain an export flight, and an international number may not exist while goods are still being consolidated.",
          "Create a timeline with columns for order number, seller dispatch, warehouse arrival, QC decision, parcel submission, packing, international handoff, export, import processing and last-mile delivery. Use timestamps from the account and carriers, but label the source. A status displayed by the agent may summarize a carrier event rather than represent a new physical scan.",
          "Tracking is evidence of reported movement, not a live GPS map. Systems update at different speeds, scans can arrive in batches and partners may use different numbers. The useful question is whether the current status fits the expected stage and whether the evidence required for the next stage exists."
        ],
        note: 'Before asking where the parcel is, name the journey: seller to warehouse or warehouse to destination.'
      },
      {
        heading: 'Read seller-to-warehouse statuses in order',
        paragraphs: [
          "After payment, the agent may still be purchasing or waiting for the seller to accept the order. “Purchased” does not necessarily mean the seller has handed a package to a carrier. When domestic tracking appears, save the number and dispatch time. Watch for carrier acceptance rather than treating label creation as physical movement.",
          "A quiet domestic status can mean the seller has not handed over the item, the first scan is delayed or the number was entered before pickup. Compare the seller’s stated dispatch estimate with elapsed business days. If the order passes that window, ask whether the seller has shipped and whether the tracking number has a carrier acceptance scan.",
          "Warehouse arrival is not always the same as stock-in completion. The facility may need to identify, weigh and photograph the item before it appears as available inventory. Keep separate timestamps for carrier delivery and warehouse processing. Escalate a gap with the order number, domestic tracking, delivery scan and elapsed business days rather than a general request to hurry."
        ]
      },
      {
        heading: 'Do not mistake warehouse work for international transit',
        paragraphs: [
          "Once items are in storage, they do not move internationally until the buyer submits a parcel and completes the required charge. QC clarification, returns, consolidation, packaging changes and route review can all hold the parcel before dispatch. The inventory screen and parcel screen describe different objects, so record the parcel identifier created at submission.",
          "Packing and measurement can alter the final chargeable weight. A shipping deposit may be adjusted after the warehouse confirms dimensions. If payment or address confirmation is pending, the parcel may remain in a preparation status without a carrier scan. Review the submission summary for an action required from the buyer before escalating.",
          "When the parcel is marked shipped, look for a route name, international tracking number and handoff date. Some lines first move through a logistics consolidator before a public carrier recognizes the number. Save the route estimate and tracking instructions shown at purchase; they establish which early statuses are expected."
        ],
        bullets: ['Inventory received is not parcel submitted.', 'Parcel submitted is not carrier accepted.', 'A tracking number can exist before its first scan.', 'Record each handoff separately.']
      },
      {
        heading: 'Interpret first-mile and line-haul gaps',
        paragraphs: [
          "The first international events may describe electronic information, warehouse departure, logistics-provider receipt or movement to an export hub. “Shipment information received” usually indicates that data was created; it does not alone prove a flight or border crossing. Wait for a physical acceptance or departure event before measuring transit from the carrier’s custody.",
          "Line-haul movement can be quiet because consolidated freight travels between export and import scans. Weekend schedules, capacity, weather and data exchange can lengthen the gap. Compare elapsed business days with the route’s current estimate, but remember that an estimate covers the whole journey and is not a promised scan interval.",
          "Avoid opening repeated tickets during an ordinary silent segment. Instead, set a review date. If there is still no new event, collect the parcel number, tracking number, last physical scan, route, submission date and destination. Ask whether the parcel has physically handed off, whether another tracking number exists and whether the silence remains within the route’s normal process."
        ]
      },
      {
        heading: 'Separate customs processing from a customs problem',
        paragraphs: [
          "Import processing may appear as arrival at destination, presented to customs, clearance in progress, information requested, duties due or released. A normal clearance status can remain unchanged while authorities and carriers exchange data. Do not assume every mention of customs means seizure or rejection.",
          "An actionable event usually requests documents, payment or clarification through an official carrier or authority channel. Verify the sender and tracking number before following a payment link. Use the carrier’s official site or contact path rather than a message that pressures immediate private payment. Provide only the information necessary for the legitimate shipment.",
          "If the status explicitly shows a hold, exception or return, ask the carrier what party must act and what deadline applies. Then inform agent support with the same evidence. Customs decisions depend on destination law, declaration and product category, so a generic article cannot predict the outcome. Precise documents and a dated timeline are more useful than speculation."
        ],
        note: '“In customs” describes a stage. “Documents required by a verified carrier” describes an action.'
      },
      {
        heading: 'Follow the last-mile handoff',
        paragraphs: [
          "After release, the parcel may receive a local tracking number. Search the event history for a partner-carrier reference and keep both numbers. The international line may stop updating while the local carrier becomes the authoritative source. Address corrections, pickup-point notices and delivery attempts usually belong with that carrier.",
          "A “delivered” scan requires prompt local checks. Confirm the address, safe place, household members, reception desk and pickup point. Save any delivery photograph or signature information. If the parcel is missing, contact the last-mile carrier quickly and request a case number, then notify the agent according to the route’s current compensation procedure.",
          "Document package condition before opening when damage is visible. Photograph the label, every side of the parcel and the internal packaging, then compare contents with the warehouse manifest. A complete record helps distinguish transit damage, missing parcel contents and an earlier warehouse mismatch."
        ]
      },
      {
        heading: 'Use a four-level delay escalation timeline',
        paragraphs: [
          "Level one is observation: the status fits the stage and remains within the published estimate. Record it and set a review date. Level two is clarification: a milestone is missing or the elapsed business days approach the expected range. Ask one precise question through the appropriate agent or carrier channel.",
          "Level three is investigation: the route estimate has passed, a physical exception appears, or different systems conflict. Provide the parcel identifier, both tracking numbers, last physical event, destination and dates. Request the current physical custodian, any alternate number and the investigation reference. Level four is claim review: loss, confirmed damage or another covered outcome appears possible. Read the route’s current compensation terms and submit evidence before its deadline.",
          "These levels are not fixed universal day counts because routes and destinations differ. Build the dates from the live estimate and business calendar shown for the actual shipment. Escalation should become more specific as evidence accumulates, not merely louder as anxiety increases."
        ],
        bullets: ['Observe and set a review date.', 'Clarify one missing milestone.', 'Request an investigation with complete identifiers.', 'Submit a supported claim within the live deadline.']
      },
      {
        heading: 'Prepare an evidence pack before contacting support',
        paragraphs: [
          "Keep the parcel number, international and local tracking numbers, route, destination, submitted address summary, shipment date, last physical scan and screenshots in one folder. Add a short chronological table. Redact full addresses and account details when sharing outside authenticated support.",
          "Write the question so it can be answered operationally: “Parcel P123, route X, last physical scan was carrier acceptance on September 3; no movement for seven business days. Has it entered line haul, and is there an alternate tracking number?” This is more useful than “Where is my package?” because it identifies the missing fact.",
          "After resolution, record the answer and final delivery date. Over time, your own route history reveals typical silent periods and helps set realistic review dates. It cannot guarantee the next parcel, but it improves decisions about deadlines and route selection. The aim of USFans parcel tracking is not constant motion on screen; it is a traceable chain of custody with timely action when that chain breaks.",
          "Close the record only after checking delivery against the parcel manifest and photographing any damage or shortage. Note which tracking source produced the most useful updates and how long each stage actually took. That post-delivery review turns a stressful series of status messages into route evidence you can use when choosing packaging, timing and shipping service for a future order. Keep delivery expectations conservative when an item is needed for an event; no tracking timeline turns an estimate into a guaranteed arrival date, especially across public holidays and customs peaks."
        ]
      }
    ]
  }
];

const existing = [
  ['usfans-1688-batch-buying-moq-variants-warehouse-evidence', '1688 sourcing', 'USFans 1688 Batch Buying: MOQ, Variants and Warehouse Evidence', 'Control minimum quantities, mixed variants, seller instructions and warehouse inspection evidence.', 'September 8, 2026'],
  ['usfans-parcel-submission-audit-address-route-packaging', 'Parcel operations', 'USFans Parcel Submission Audit: Address, Route and Packaging', 'Check the item manifest, address, route eligibility, packing remarks, deposit and tracking handoff.', 'August 28, 2026'],
  ['usfans-warehouse-calendar-90-day-consolidation', 'Warehouse planning', 'USFans Warehouse Calendar: Plan 90 Days of Arrivals and Consolidation', 'Manage staggered arrivals, inspection decisions, free storage and a disciplined parcel cutoff.', 'August 27, 2026'],
  ['usfans-spreadsheet-price-audit-before-payment', 'Price planning', 'USFans Spreadsheet Price Audit: Calculate the Real Order Cost', 'Check variant prices, domestic shipping, minimum quantities, conversion and freight exposure.', 'August 21, 2026'],
  ['usfans-restricted-items-route-check-before-buying', 'Restricted items', 'USFans Restricted Items: Check the Exit Route Before You Buy', 'Identify product restrictions, seller limitations and parcel conflicts before payment.', 'August 18, 2026'],
  ['evidence-first-usfans-buying-workflow', 'Buying workflow', 'The Evidence-First USFans Buying Workflow', 'Turn a spreadsheet lead into a documented order, warehouse inspection and reversible decision.', 'August 14, 2026'],
  ['usfans-qc-photos-return-window', 'QC and returns', 'How to Read USFans QC Photos Before the 5-Day Return Window Closes', 'Use category-aware inspection to choose approve, clarify, exchange or return.', 'August 14, 2026'],
  ['usfans-shipping-cost-volumetric-weight-customs', 'Shipping planning', 'USFans Shipping Cost Planning: Volumetric Weight, Consolidation and Customs Risk', 'Compare chargeable weight, packaging, route filters and customs exposure.', 'August 14, 2026']
];

const escapeHTML = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const strip = value => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const wordCount = value => (strip(value).match(/[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*/g) || []).length;

function coverSVG(article) {
  const words = article.shortTitle.split(' ');
  const midpoint = Math.ceil(words.length / 2);
  const line1 = escapeHTML(words.slice(0, midpoint).join(' '));
  const line2 = escapeHTML(words.slice(midpoint).join(' '));
  const illustrations = {
    'how-to-use-usfans-spreadsheet': '<path d="M760 122h292c27 0 49 22 49 49v328c0 27-22 49-49 49H760c-27 0-49-22-49-49V171c0-27 22-49 49-49Z" fill="#fff" stroke="#211f36" stroke-width="8"/><rect x="770" y="190" width="272" height="38" rx="12" fill="' + article.accent + '"/><rect x="770" y="258" width="112" height="112" rx="22" fill="#ffd960" stroke="#211f36" stroke-width="6"/><path d="m800 316 29 29 61-71" fill="none" stroke="#211f36" stroke-linecap="round" stroke-linejoin="round" stroke-width="14"/><rect x="910" y="258" width="132" height="18" rx="9" fill="#211f36"/><rect x="910" y="294" width="101" height="14" rx="7" fill="' + article.accent + '"/><rect x="910" y="328" width="118" height="14" rx="7" fill="#cfc8e8"/><path d="M790 440h232" stroke="#211f36" stroke-width="10" stroke-linecap="round"/><circle cx="820" cy="440" r="22" fill="' + article.accent + '" stroke="#211f36" stroke-width="6"/><circle cx="991" cy="440" r="22" fill="#ffd960" stroke="#211f36" stroke-width="6"/>',
    'is-usfans-legit-buyer-verification-checklist': '<path d="M900 125 1080 195v137c0 111-76 185-180 222-104-37-180-111-180-222V195l180-70Z" fill="#fff" stroke="#211f36" stroke-width="9"/><path d="M900 177 1026 226v104c0 75-48 130-126 164-78-34-126-89-126-164V226l126-49Z" fill="' + article.accent + '" opacity=".22"/><path d="m824 327 54 55 108-132" fill="none" stroke="' + article.accent + '" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="1061" cy="491" r="42" fill="#ffd960" stroke="#211f36" stroke-width="8"/>',
    'usfans-vs-cnfans-vs-kakobuy-comparison': '<path d="M735 505h360" stroke="#211f36" stroke-width="10" stroke-linecap="round"/><rect x="755" y="272" width="88" height="233" rx="18" fill="' + article.accent + '" stroke="#211f36" stroke-width="8"/><rect x="871" y="190" width="88" height="315" rx="18" fill="#ffd960" stroke="#211f36" stroke-width="8"/><rect x="987" y="329" width="88" height="176" rx="18" fill="#fff" stroke="#211f36" stroke-width="8"/><circle cx="799" cy="236" r="35" fill="#fff" stroke="#211f36" stroke-width="8"/><circle cx="915" cy="154" r="35" fill="' + article.accent + '" stroke="#211f36" stroke-width="8"/><circle cx="1031" cy="293" r="35" fill="#ffd960" stroke="#211f36" stroke-width="8"/>',
    'usfans-coupons-shipping-discounts-real-savings': '<path d="M744 217c36 0 66-29 66-66h270v112c-43 0-78 35-78 78s35 78 78 78v112H810c0-36-30-66-66-66V217Z" fill="#fff" stroke="#211f36" stroke-width="9"/><circle cx="865" cy="286" r="33" fill="' + article.accent + '" stroke="#211f36" stroke-width="8"/><circle cx="969" cy="414" r="33" fill="#ffd960" stroke="#211f36" stroke-width="8"/><path d="m984 253-134 194" stroke="#211f36" stroke-width="17" stroke-linecap="round"/><path d="M746 341h58M1022 341h57" stroke="' + article.accent + '" stroke-width="9" stroke-dasharray="12 10"/>',
    'usfans-parcel-tracking-statuses-delay-timeline': '<path d="M743 470c66-26 70-129 147-139 86-11 72 101 160 86" fill="none" stroke="' + article.accent + '" stroke-width="14" stroke-dasharray="18 14" stroke-linecap="round"/><circle cx="743" cy="470" r="28" fill="#ffd960" stroke="#211f36" stroke-width="8"/><circle cx="1050" cy="417" r="28" fill="' + article.accent + '" stroke="#211f36" stroke-width="8"/><path d="M805 207h174v128H805z" fill="#fff" stroke="#211f36" stroke-width="8"/><path d="M979 250h53l56 62v23H979z" fill="#ffd960" stroke="#211f36" stroke-width="8"/><circle cx="852" cy="354" r="28" fill="#fff" stroke="#211f36" stroke-width="8"/><circle cx="1027" cy="354" r="28" fill="#fff" stroke="#211f36" stroke-width="8"/><path d="M848 251h91" stroke="' + article.accent + '" stroke-width="16" stroke-linecap="round"/>'
  };
  return '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">' +
    '<title id="title">' + escapeHTML(article.shortTitle) + '</title><desc id="desc">' + escapeHTML(article.label) + ' guide cover</desc>' +
    '<rect width="1200" height="675" rx="36" fill="#fff8ec"/><circle cx="1010" cy="102" r="255" fill="' + article.accent + '" opacity=".16"/>' +
    illustrations[article.slug] +
    '<text x="72" y="96" font-family="Arial,sans-serif" font-size="24" font-weight="900" fill="' + article.accent + '" letter-spacing="3">' + escapeHTML(article.label.toUpperCase()) + ' · 2026</text>' +
    '<text x="72" y="205" font-family="Arial,sans-serif" font-size="62" font-weight="900" fill="#211f36">' + line1 + '</text>' +
    '<text x="72" y="280" font-family="Arial,sans-serif" font-size="62" font-weight="900" fill="#211f36">' + line2 + '</text>' +
    '<text x="72" y="400" font-family="Arial,sans-serif" font-size="25" font-weight="700" fill="#615e70">Evidence before payment. Control before shipping.</text>' +
    '<rect x="72" y="482" width="330" height="72" rx="22" fill="' + article.accent + '" stroke="#211f36" stroke-width="6"/><text x="102" y="528" font-family="Arial,sans-serif" font-size="24" font-weight="900" fill="#fff">USFANSVIP.STORE</text>' +
    '</svg>';
}

function sectionHTML(section, index) {
  const number = String(index + 1).padStart(2, '0');
  const paragraphs = section.paragraphs.map(p => '<p>' + escapeHTML(p) + '</p>').join('');
  const note = section.note ? '<div class="note"><strong>Working rule:</strong> ' + escapeHTML(section.note) + '</div>' : '';
  const bullets = section.bullets ? '<ul>' + section.bullets.map(item => '<li>' + escapeHTML(item) + '</li>').join('') + '</ul>' : '';
  return '<section id="section-' + (index + 1) + '"><span class="num">' + number + '</span><h2>' + escapeHTML(section.heading) + '</h2>' + paragraphs + note + bullets + '</section>';
}

function articleHTML(article) {
  const sections = article.sections.map(sectionHTML).join('');
  const count = wordCount(sections);
  const toc = article.sections.map((section, index) => '<a href="#section-' + (index + 1) + '"><b>' + String(index + 1).padStart(2, '0') + '</b><span>' + escapeHTML(section.heading) + '</span></a>').join('');
  const related = article.related.map(slug => {
    const item = articles.find(entry => entry.slug === slug);
    const old = existing.find(entry => entry[0] === slug);
    const label = item ? item.label : old[1];
    const title = item ? item.shortTitle : old[2];
    return '<a href="/guides/' + slug + '/"><small>' + escapeHTML(label) + '</small>' + escapeHTML(title) + ' →</a>';
  }).join('');
  const canonical = 'https://usfansvip.store/guides/' + article.slug + '/';
  const image = 'https://usfansvip.store/assets/guides/' + article.slug + '.svg';
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image,
    datePublished: published,
    dateModified: published,
    wordCount: count,
    mainEntityOfPage: canonical,
    author: { '@type': 'Organization', name: 'USFansVIP.store Editorial Desk' },
    publisher: { '@type': 'Organization', name: 'USFansVIP.store', logo: { '@type': 'ImageObject', url: 'https://usfansvip.store/usfans-logo.png' } }
  });
  return '<!doctype html><html lang="en"><head>' +
    '<script async src="https://www.googletagmanager.com/gtag/js?id=G-4T8DSVP0L9"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","G-4T8DSVP0L9");</script>' +
    '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="index,follow,max-image-preview:large">' +
    '<title>' + escapeHTML(article.title) + ' | USFansVIP.store</title><meta name="description" content="' + escapeHTML(article.description) + '">' +
    '<link rel="canonical" href="' + canonical + '"><link rel="icon" type="image/png" href="/favicon.png"><link rel="stylesheet" href="/assets/guide.css">' +
    '<meta property="og:type" content="article"><meta property="og:title" content="' + escapeHTML(article.title) + '"><meta property="og:description" content="' + escapeHTML(article.description) + '"><meta property="og:url" content="' + canonical + '"><meta property="og:image" content="' + image + '">' +
    '<meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">' + schema + '</script></head><body>' +
    '<header class="top"><a class="brand" href="/"><img src="/usfans-logo.png" alt="USFans" width="538" height="119"><span class="vip">VIP</span></a><a class="back" href="/guides/">← All Buyer Guides</a></header>' +
    '<main><section class="hero"><small>' + escapeHTML(article.label) + ' · September 20, 2026 · ' + Math.max(8, Math.ceil(count / 210)) + ' min read</small><h1>' + escapeHTML(article.title) + '</h1><p>' + escapeHTML(article.intro) + '</p></section>' +
    '<figure class="cover"><img src="/assets/guides/' + article.slug + '.svg" alt="' + escapeHTML(article.shortTitle) + ' guide cover" width="1200" height="675" fetchpriority="high"></figure>' +
    '<div class="article-wrap"><aside class="toc"><small>IN THIS GUIDE</small>' + toc + '</aside><article class="copy">' + sections + '</article></div>' +
    '<section class="related"><h2>Continue the buyer workflow</h2><div class="related-grid">' + related + '</div></section></main>' +
    '<footer class="footer"><span>Independent buyer education. Verify live prices, options and service terms before payment.</span><a href="/">USFansVIP.store</a></footer>' +
    '<script>document.addEventListener("click",function(e){var a=e.target.closest("a");if(!a)return;gtag("event","guide_navigation_click",{link_url:a.href,link_text:a.textContent.trim().replace(/\\s+/g," ").slice(0,100)})});</script></body></html>';
}

for (const article of articles) {
  const target = join(root, 'guides', article.slug);
  await mkdir(target, { recursive: true });
  await writeFile(join(target, 'index.html'), articleHTML(article));
}

await mkdir(join(root, 'assets', 'guides'), { recursive: true });
for (const article of articles) {
  await writeFile(join(root, 'assets', 'guides', article.slug + '.svg'), coverSVG(article));
}

const allCards = [
  ...articles.map(article => [article.slug, article.label, article.title, article.description, 'September 20, 2026']),
  ...existing
];
const cards = allCards.map((entry, index) => '<a class="guide-card" href="/guides/' + entry[0] + '/"><strong>' + String(index + 1).padStart(2, '0') + '</strong><div><small>' + escapeHTML(entry[1]) + ' · ' + entry[4] + '</small><h2>' + escapeHTML(entry[2]) + '</h2><p>' + escapeHTML(entry[3]) + '</p></div><span>→</span></a>').join('');
const itemList = allCards.map((entry, index) => ({ '@type': 'ListItem', position: index + 1, url: 'https://usfansvip.store/guides/' + entry[0] + '/' }));
const collectionSchema = JSON.stringify({ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'USFans Buyer Guides', url: 'https://usfansvip.store/guides/', mainEntity: { '@type': 'ItemList', numberOfItems: allCards.length, itemListElement: itemList } });
const indexHTML = '<!doctype html><html lang="en"><head><script async src="https://www.googletagmanager.com/gtag/js?id=G-4T8DSVP0L9"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","G-4T8DSVP0L9");</script>' +
  '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>USFans Guides 2026: Spreadsheet, QC, Shipping & Coupons</title><meta name="description" content="Read 13 independent USFans guides for spreadsheet use, buyer checks, QC, coupons, agent comparisons, warehouse planning, shipping and parcel tracking.">' +
  '<link rel="canonical" href="https://usfansvip.store/guides/"><link rel="icon" type="image/png" href="/favicon.png"><meta name="robots" content="index,follow,max-image-preview:large">' +
  '<meta property="og:type" content="website"><meta property="og:title" content="USFans Guides 2026: Spreadsheet, QC, Shipping & Coupons"><meta property="og:description" content="Thirteen practical USFans buyer guides, newest first."><meta property="og:url" content="https://usfansvip.store/guides/"><script type="application/ld+json">' + collectionSchema + '</script>' +
  '<style>:root{--ink:#211f36;--purple:#6942e9;--orange:#ff6533;--yellow:#ffd960;--cream:#fff8ec;--muted:#615e70}*{box-sizing:border-box}body{margin:0;background:var(--cream);color:var(--ink);font-family:Inter,Arial,sans-serif}a{color:inherit;text-decoration:none}.top{min-height:76px;background:#17152a;color:#fff;padding:12px 5vw;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{display:flex;align-items:center;gap:10px;background:#fff;border-radius:15px;padding:8px 12px}.brand img{width:145px;height:auto}.vip{background:var(--yellow);color:var(--ink);border-radius:999px;padding:5px 7px;font-size:9px;font-weight:950}.back{font-size:11px;font-weight:900}.hero{padding:76px max(5vw,22px);background:var(--purple);color:#fff}.hero small{color:var(--yellow);font-weight:950;letter-spacing:.08em}.hero h1{max-width:1080px;margin:25px 0;font-size:clamp(43px,6.6vw,92px);line-height:.92;letter-spacing:-.055em}.hero p{max-width:800px;margin:0;color:#e7e2fb;font-size:15px;line-height:1.75}.wrap{max-width:1240px;margin:auto;padding:60px 22px 90px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.guide-card{min-height:340px;padding:24px;border:2px solid var(--ink);border-radius:23px;background:#fff;box-shadow:0 6px 0 var(--ink);display:flex;flex-direction:column;transition:.2s}.guide-card:hover{transform:translateY(-5px);box-shadow:0 11px 0 var(--orange)}.guide-card>strong{font-size:40px;color:var(--purple)}.guide-card small{display:block;margin-top:22px;font-size:9px;font-weight:950;color:var(--orange);text-transform:uppercase}.guide-card h2{font-size:25px;line-height:1.08;margin:9px 0 12px}.guide-card p{font-size:12px;line-height:1.62;color:var(--muted);margin:0}.guide-card>span{margin-top:auto;padding-top:20px;font-size:26px;color:var(--purple)}.footer{padding:30px 5vw;background:#17152a;color:#aaa7ba;display:flex;justify-content:space-between;gap:24px;font-size:10px}.footer a{color:#fff;font-weight:900}@media(max-width:900px){.wrap{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:650px){.top{min-height:66px;padding:9px 14px}.brand img{width:110px}.back{font-size:9px}.hero{padding:55px 16px}.hero h1{font-size:clamp(39px,12vw,61px)}.hero p{font-size:13px}.wrap{grid-template-columns:1fr;padding:38px 14px 65px}.guide-card{min-height:0}.footer{flex-direction:column}}</style></head><body>' +
  '<header class="top"><a class="brand" href="/"><img src="/usfans-logo.png" alt="USFans" width="538" height="119"><span class="vip">VIP</span></a><a class="back" href="/">← Back to homepage</a></header><main><section class="hero"><small>USFANSVIP / BUYER LIBRARY</small><h1>USFans guides for the decisions between “found it” and “shipped it.”</h1><p>Thirteen independent guides covering spreadsheet use, verification, agent comparison, coupons, tracking, 1688 sourcing, QC, warehouse timing and international shipping. Newest first.</p></section><section class="wrap">' + cards + '</section></main><footer class="footer"><span>Independent buyer education. Verify live prices, options and service terms before payment.</span><a href="/">USFansVIP.store</a></footer>' +
  '<script>document.addEventListener("click",function(e){var a=e.target.closest(".guide-card");if(a)gtag("event","guide_open",{link_url:a.href,guide_title:a.querySelector("h2").textContent})});</script></body></html>';
await writeFile(join(root, 'guides', 'index.html'), indexHTML);

console.log(JSON.stringify(articles.map(article => {
  const html = article.sections.map(sectionHTML).join('');
  return { slug: article.slug, words: wordCount(html) };
}), null, 2));
