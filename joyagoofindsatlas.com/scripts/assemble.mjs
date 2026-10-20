import fs from 'node:fs';
import {createHash} from 'node:crypto';
const read=f=>fs.readFileSync(new URL('../worker/'+f,import.meta.url),'utf8');
const logo=read('logo.js').replace('export default ','const LOGO=');
const assetVersion=createHash('sha256').update(read('style.css')+read('client.js')+read('guide-screenshots.json')).digest('hex').slice(0,12);
const output=[logo,'const GUIDE_SCREENSHOTS='+read('guide-screenshots.json')+';','const ASSET_VERSION='+JSON.stringify(assetVersion)+';','const CSS='+JSON.stringify(read('style.css'))+';','const CLIENT='+JSON.stringify(read('client.js'))+';',read('site-config.js'),read('data.js'),read('currency.js'),read('content.js'),read('locales-extra.js'),read('faq-content.js'),read('price-labels.js'),read('guide.js'),read('guide-detail.js'),read('render.js'),read('routes.js')].join('\n');
fs.writeFileSync(new URL('../worker/index.js',import.meta.url),output);
