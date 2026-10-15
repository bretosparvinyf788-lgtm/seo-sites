import fs from 'node:fs';
import assert from 'node:assert/strict';
const source=fs.readFileSync('dist/_worker.js','utf8');
const mod=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
assert.equal(typeof mod.default?.fetch,'function');
const routes=JSON.parse(fs.readFileSync('dist/_routes.json','utf8'));
assert.deepEqual(routes,{version:1,include:['/*'],exclude:[]});
console.log('Pages artifact exports default.fetch and handles all routes');
