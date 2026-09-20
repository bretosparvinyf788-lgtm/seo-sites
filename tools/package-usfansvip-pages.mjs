import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'usfansvip.store');
const special = new Set(['_headers', '_redirects']);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (!special.has(entry.name)) files.push(path);
  }
  return files;
}

const records = [];
for (const path of (await walk(root)).sort()) {
  const buffer = await readFile(path);
  const webPath = '/' + relative(root, path).split(sep).join('/');
  records.push({
    path,
    webPath,
    hash: createHash('md5').update(buffer).digest('hex'),
    size: buffer.length,
    contentType: mimeTypes[extname(path).toLowerCase()] || 'application/octet-stream',
  });
}

if (process.argv[2] === 'manifest') {
  console.log(JSON.stringify({
    manifest: Object.fromEntries(records.map(record => [record.webPath, record.hash])),
    files: records.map(({ webPath, hash, size, contentType }) => ({ webPath, hash, size, contentType })),
  }));
} else if (process.argv[2] === 'assets') {
  const wanted = new Set(process.argv.slice(3));
  const assets = [];
  for (const record of records.filter(item => wanted.has(item.hash))) {
    assets.push({
      key: record.hash,
      value: (await readFile(record.path)).toString('base64'),
      metadata: { contentType: record.contentType },
      base64: true,
    });
  }
  console.log(JSON.stringify(assets));
} else {
  throw new Error('Use: manifest | assets <hash...>');
}
