import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { load } from 'cheerio';
import { guides, guideUi } from '../src/lib/guides.ts';

const targets = {
  de: 'de', es: 'es', fr: 'fr', it: 'it', pl: 'pl', pt: 'pt', ro: 'ro', sv: 'sv', nl: 'nl', da: 'da',
  fi: 'fi', el: 'el', cs: 'cs', hu: 'hu', bg: 'bg', sk: 'sk', hr: 'hr', sl: 'sl', lt: 'lt', lv: 'lv',
  et: 'et', ga: 'ga', mt: 'mt', zh: 'zh-CN'
};

const cacheDir = new URL('../.translation-cache/', import.meta.url);
const cacheUrl = new URL('guide-translations.json', cacheDir);
await mkdir(cacheDir, { recursive: true });

let cache = {};
try { cache = JSON.parse(await readFile(cacheUrl, 'utf8')); } catch {}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestTranslation(text, target, attempt = 1) {
  const body = new URLSearchParams({ client: 'gtx', sl: 'en', tl: target, dt: 't', q: text });
  try {
    const response = await fetch('https://translate.googleapis.com/translate_a/single', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body,
      signal: AbortSignal.timeout(30000)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    return payload[0].map((part) => part[0]).join('');
  } catch (error) {
    if (attempt >= 4) throw error;
    await sleep(800 * attempt);
    return requestTranslation(text, target, attempt + 1);
  }
}

function makeChunks(texts, maxLength = 4300) {
  const chunks = [];
  let current = [];
  let length = 0;
  texts.forEach((text, index) => {
    const marker = `__KWBSEG${String(index).padStart(4, '0')}__`;
    const addition = `${marker}\n${text.trim()}\n`;
    if (current.length && length + addition.length > maxLength) {
      chunks.push(current);
      current = [];
      length = 0;
    }
    current.push({ index, marker, addition });
    length += addition.length;
  });
  if (current.length) chunks.push(current);
  return chunks;
}

async function translateTexts(texts, target) {
  const output = Array(texts.length);
  const chunks = makeChunks(texts);
  await Promise.all(chunks.map(async (chunk) => {
    const translated = await requestTranslation(chunk.map((item) => item.addition).join(''), target);
    for (let position = 0; position < chunk.length; position += 1) {
      const item = chunk[position];
      const next = chunk[position + 1];
      const start = translated.indexOf(item.marker);
      const end = next ? translated.indexOf(next.marker) : translated.length;
      if (start < 0 || end < 0) throw new Error(`Translation marker missing for ${target}: ${item.marker}`);
      output[item.index] = translated.slice(start + item.marker.length, end).trim();
    }
  }));
  return output;
}

function articleTextNodes(html) {
  const $ = load(html, null, false);
  const nodes = [];
  $('*').contents().each((_, node) => {
    if (node.type === 'text' && node.data.trim()) nodes.push(node);
  });
  return { $, nodes };
}

async function translateGuide(guide, target) {
  const { $, nodes } = articleTextNodes(guide.articleHtml);
  const fixed = [guide.title, guide.description, guide.excerpt, guide.readingTime, guide.coverAlt, guide.primaryKeyword, ...guide.secondaryKeywords];
  const translated = await translateTexts([...fixed, ...nodes.map((node) => node.data.trim())], target);
  const secondaryStart = 6;
  const secondaryEnd = secondaryStart + guide.secondaryKeywords.length;
  nodes.forEach((node, index) => { node.data = translated[secondaryEnd + index]; });
  return {
    title: translated[0],
    description: translated[1],
    excerpt: translated[2],
    readingTime: translated[3],
    coverAlt: translated[4],
    primaryKeyword: translated[5],
    secondaryKeywords: translated.slice(secondaryStart, secondaryEnd),
    articleHtml: $.html()
  };
}

const uiSeed = {
  ...guideUi.en,
  continueReading: 'Continue reading',
  home: 'Home',
  notFoundTitle: 'Guide not found',
  notFoundBody: 'The requested guide is unavailable.'
};

async function translateLocale(lang, target) {
  const uiKeys = Object.keys(uiSeed);
  const uiValues = await translateTexts(Object.values(uiSeed), target);
  const ui = Object.fromEntries(uiKeys.map((key, index) => [key, uiValues[index]]));
  const localizedGuides = {};
  for (const guide of guides) {
    localizedGuides[guide.slug] = await translateGuide(guide, target);
  }
  return { ui, guides: localizedGuides };
}

const pending = Object.entries(targets).filter(([lang]) => !cache[lang]);
for (let offset = 0; offset < pending.length; offset += 4) {
  const group = pending.slice(offset, offset + 4);
  const translated = await Promise.all(group.map(async ([lang, target]) => [lang, await translateLocale(lang, target)]));
  for (const [lang, value] of translated) {
    cache[lang] = value;
    console.log(`Translated ${lang} (${Object.keys(cache).length}/${Object.keys(targets).length})`);
  }
  await writeFile(cacheUrl, `${JSON.stringify(cache, null, 2)}\n`);
}

const languageEntries = Object.entries(cache);
const midpoint = Math.ceil(languageEntries.length / 2);
const parts = [
  Object.fromEntries(languageEntries.slice(0, midpoint)),
  Object.fromEntries(languageEntries.slice(midpoint))
];

await Promise.all(parts.map((part, index) => {
  const output = `// Generated by scripts/generate-guide-translations.mjs.\nexport const guideTranslationsPart${index + 1} = ${JSON.stringify(part, null, 2)} as const;\n`;
  return writeFile(new URL(`../src/lib/guide-translations.generated.part${index + 1}.ts`, import.meta.url), output);
}));

const indexOutput = `// Generated by scripts/generate-guide-translations.mjs.\nimport { guideTranslationsPart1 } from './guide-translations.generated.part1.ts';\nimport { guideTranslationsPart2 } from './guide-translations.generated.part2.ts';\n\nexport const guideTranslations = { ...guideTranslationsPart1, ...guideTranslationsPart2 } as const;\n`;
await writeFile(new URL('../src/lib/guide-translations.generated.ts', import.meta.url), indexOutput);
console.log('Wrote split guide translation modules');
