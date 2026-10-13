import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const hashes=JSON.parse(await readFile('cloudflare-output/source-hashes.json','utf8'));
for(const [file,expected]of Object.entries(hashes)){if(createHash('sha256').update(await readFile(file)).digest('hex')!==expected)throw new Error(`${file} changed: run npm run build and commit the refreshed pages directory.`);}
await stat('cloudflare-output/_worker.js/index.js');await stat('cloudflare-output/_next/static');
console.log(`Verified ${Object.keys(hashes).length} source files and deployment output.`);
