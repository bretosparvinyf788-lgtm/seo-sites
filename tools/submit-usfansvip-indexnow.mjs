const key = '92dce7afd2e3377f64fa9298e06fa864';
const host = 'usfansvip.store';
const urls = [
  'https://usfansvip.store/',
  'https://usfansvip.store/guides/',
  'https://usfansvip.store/guides/how-to-use-usfans-spreadsheet/',
  'https://usfansvip.store/guides/is-usfans-legit-buyer-verification-checklist/',
  'https://usfansvip.store/guides/usfans-vs-cnfans-vs-kakobuy-comparison/',
  'https://usfansvip.store/guides/usfans-coupons-shipping-discounts-real-savings/',
  'https://usfansvip.store/guides/usfans-parcel-tracking-statuses-delay-timeline/',
];

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urls,
  }),
});

console.log(JSON.stringify({ status: response.status, statusText: response.statusText, body: await response.text() }, null, 2));
if (!response.ok) process.exitCode = 1;
