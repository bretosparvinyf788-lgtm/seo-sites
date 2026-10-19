// Every additional locale supplies its own complete UI, product terms and FAQs.
for(const [locale,copy] of Object.entries(EXTRA_LOCALES)){
 if(copy.ui.length!==KEYS.length||copy.retention.length!==RETENTION_KEYS.length||copy.categories.length!==10||copy.terms.length!==23||copy.checks.length!==4||copy.faq.length!==10||copy.notes.length!==11||copy.sheet.length!==Object.keys(SHEET.en).length)throw Error('Incomplete locale: '+locale);
 LOCALES[locale]=copy.name;
 UI[locale]=Object.fromEntries(KEYS.map((key,i)=>[key,copy.ui[i]]));
 CAT[locale]=copy.categories;TERMS[locale]=copy.terms;
 RETENTION[locale]=Object.fromEntries(RETENTION_KEYS.map((key,i)=>[key,copy.retention[i]]));
 REVIEW_CHECKS[locale]=copy.checks;
 SHEET[locale]=Object.fromEntries(Object.keys(SHEET.en).map((key,i)=>[key,copy.sheet[i]]));
 FAQ[locale]=copy.faq;
 const t=UI[locale],r=RETENTION[locale],n=copy.notes;
 NOTES[locale]={intro:n[0],curated:t.collection,inspect:r.review,inspectIntro:r.reviewIntro,front:t.gallery,back:t.gallery,checkTitle:r.progress,checks:copy.checks,guideTitle:t.guideTitle,steps:[],emptySaved:n[1],reference:n[2],refDate:n[3],detail:n[4],close:n[5],sourceFailure:n[6],sourceFallback:n[7],notFound:n[8],savedLocal:n[9],galleryFailure:n[10],guideIntro:t.guideIntro};
}
