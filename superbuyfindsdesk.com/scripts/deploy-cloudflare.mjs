import fs from 'node:fs/promises';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
if (!accountId || !token) throw new Error('CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required.');
const source = await fs.readFile(new URL('../worker/index.js', import.meta.url));
const form = new FormData();
form.append('metadata', new Blob([JSON.stringify({
  main_module: 'index.js',
  compatibility_date: '2026-11-15',
  keep_bindings: ['plain_text', 'secret_text'],
  observability: { enabled: true, logs: { enabled: true, invocation_logs: true }, traces: { enabled: true } }
})], { type: 'application/json' }));
form.append('index.js', new Blob([source], { type: 'application/javascript+module' }), 'index.js');
const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/superbuyfindsdesk-com`, {
  method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: form
});
const result = await response.json();
if (!response.ok || !result.success) {
  throw new Error(`Cloudflare deployment failed (${response.status}): ${JSON.stringify(result.errors)}`);
}
console.log(JSON.stringify({ worker: result.result.id, deployment: result.result.deployment_id, url: 'https://superbuyfindsdesk.com' }));
