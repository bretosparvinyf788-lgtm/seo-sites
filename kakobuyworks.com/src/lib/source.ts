import { load } from 'cheerio';

const runtimeEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
const SOURCE_SITE = (runtimeEnv?.SOURCE_SITE || (typeof process !== 'undefined' ? process.env.SOURCE_SITE : undefined) || 'https://kakobuymake.com').replace(/\/$/, '');

// The source-wide catalog currently contains one live item without a category.
// Keep it discoverable under Other Stuff without copying its product data.
const CATEGORY_FALLBACK_IDS: Record<string, string[]> = { '11': ['609'] };
const SOURCE_CACHE_TTL = 30 * 60 * 1000;
const SOURCE_STALE_TTL = 7 * 24 * 60 * 60 * 1000;
const SOURCE_REQUEST_TIMEOUT = 8_000;
const sourceCache = new Map<string, { expires: number; html: string }>();
const sourceRequests = new Map<string, Promise<string>>();

export class SourceNotFoundError extends Error {
  constructor(message = 'Source returned 404') {
    super(message);
    this.name = 'SourceNotFoundError';
  }
}

export class SourceUnavailableError extends Error {
  constructor(message = 'Source is temporarily unavailable', options?: ErrorOptions) {
    super(message, options);
    this.name = 'SourceUnavailableError';
  }
}

export type SourceProduct = {
  id: string;
  title: string;
  price: number | null;
  priceLabel: string;
  image: string;
  sourceUrl: string;
};

export type SourceCategory = {
  id: string;
  name: string;
};

export type SourceProductDetail = SourceProduct & {
  category: string;
  gallery: string[];
  kakobuyUrl: string;
  marketplaceId: string | null;
};

export type SourceProductPage = {
  products: SourceProduct[];
  page: number;
  totalPages: number;
  totalProducts: number;
};

function absoluteUrl(value?: string | null) {
  if (!value) return '';
  try {
    return new URL(value, `${SOURCE_SITE}/`).href;
  } catch {
    return '';
  }
}

async function fetchSource(path: string) {
  const cached = sourceCache.get(path);
  if (cached && cached.expires > Date.now()) return cached.html;
  const pending = sourceRequests.get(path);
  if (pending) return pending;

  const request = (async () => {
    const sourceUrl = `${SOURCE_SITE}${path}`;
    const edgeCache = (globalThis as typeof globalThis & {
      caches?: CacheStorage & { default?: Cache };
    }).caches?.default;
    const cacheRequest = new Request(sourceUrl, { method: 'GET' });
    let staleHtml = '';

    try {
      if (edgeCache) {
        const cachedResponse = await edgeCache.match(cacheRequest);
        if (cachedResponse) {
          staleHtml = await cachedResponse.text();
          const fetchedAt = Number(cachedResponse.headers.get('x-source-fetched-at') || 0);
          if (staleHtml && fetchedAt && Date.now() - fetchedAt < SOURCE_CACHE_TTL) {
            sourceCache.set(path, { expires: Date.now() + SOURCE_CACHE_TTL, html: staleHtml });
            return staleHtml;
          }
        }
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), SOURCE_REQUEST_TIMEOUT);
      try {
        const response = await fetch(sourceUrl, {
          headers: {
            Accept: 'text/html,application/xhtml+xml',
            'User-Agent': 'kakobuyworks.com/1.0 (+https://kakobuyworks.com)'
          },
          signal: controller.signal
        });
        if (response.status === 404) throw new SourceNotFoundError();
        if (!response.ok) throw new SourceUnavailableError(`Source returned ${response.status}`);
        const html = await response.text();
        sourceCache.set(path, { expires: Date.now() + SOURCE_CACHE_TTL, html });
        if (edgeCache) {
          const cacheResponse = new Response(html, {
            headers: {
              'content-type': 'text/html; charset=utf-8',
              'cache-control': `public, max-age=${SOURCE_STALE_TTL / 1000}`,
              'x-source-fetched-at': String(Date.now())
            }
          });
          // Cache persistence must never delay the page response. A slow cache
          // write at a cold edge location previously allowed requests to reach
          // Cloudflare's origin timeout even after the source HTML had loaded.
          void edgeCache.put(cacheRequest, cacheResponse).catch((error) => {
            console.error('SOURCE_CACHE_WRITE_ERROR', error);
          });
        }
        return html;
      } catch (error) {
        if (error instanceof SourceNotFoundError) throw error;
        if (staleHtml) {
          sourceCache.set(path, { expires: Date.now() + SOURCE_CACHE_TTL, html: staleHtml });
          return staleHtml;
        }
        if (error instanceof SourceUnavailableError) throw error;
        throw new SourceUnavailableError('Source request failed', { cause: error });
      } finally {
        clearTimeout(timeout);
      }
    } finally {
      sourceRequests.delete(path);
    }
  })();
  sourceRequests.set(path, request);
  return request;
}

function parseProducts(html: string): SourceProduct[] {
  const $ = load(html);
  const products: SourceProduct[] = [];
  const seen = new Set<string>();

  $('a.product-card[href*="aid="]').each((_, element) => {
    const card = $(element);
    const href = card.attr('href') || '';
    const id = href.match(/[?&]aid=(\d+)/)?.[1];
    if (!id || seen.has(id)) return;

    const title = card.find('.product-title').first().text().replace(/\s+/g, ' ').trim()
      || card.find('img').first().attr('alt')?.trim()
      || '';
    const priceLabel = card.find('.price').first().text().replace(/\s+/g, ' ').trim();
    const parsedPrice = Number.parseFloat(priceLabel.replace(/[^\d.]/g, ''));
    const image = absoluteUrl(card.find('img').first().attr('data-src') || card.find('img').first().attr('src'));
    if (!title || !image) return;

    seen.add(id);
    products.push({
      id,
      title,
      price: Number.isFinite(parsedPrice) ? parsedPrice : null,
      priceLabel: priceLabel || '—',
      image,
      sourceUrl: absoluteUrl(href)
    });
  });

  return products;
}

function parseCatalogTotals(html: string, productCount: number) {
  const match = html.match(/共\s*<strong>(\d+)<\/strong>页\s*<strong>(\d+)<\/strong>条/i);
  const totalPages = Number.parseInt(match?.[1] || '', 10);
  const totalProducts = Number.parseInt(match?.[2] || '', 10);
  return {
    totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : (productCount > 0 ? 1 : 0),
    totalProducts: Number.isFinite(totalProducts) && totalProducts >= 0 ? totalProducts : productCount
  };
}

export async function getCategories(): Promise<SourceCategory[]> {
  const html = await fetchSource('/');
  const $ = load(html);
  const categories: SourceCategory[] = [];
  const seen = new Set<string>();

  $('a[href*="c=Lists"][href*="tid="]').each((_, element) => {
    const href = $(element).attr('href') || '';
    const id = href.match(/[?&]tid=(\d+)/)?.[1];
    const name = $(element).clone().find('img').remove().end().text().replace(/\s+/g, ' ').trim();
    if (!id || !name || seen.has(id)) return;
    seen.add(id);
    categories.push({ id, name });
  });

  return categories;
}

export async function getProductPage(options: {
  categoryId?: string;
  query?: string;
  page?: number;
  sort?: string;
} = {}): Promise<SourceProductPage> {
  const page = Math.max(1, options.page || 1);
  const params = new URLSearchParams();

  if (options.query) {
    params.set('m', 'home');
    params.set('c', 'Search');
    params.set('a', 'lists');
    params.set('keywords', options.query.trim());
  } else {
    params.set('m', 'home');
    params.set('c', 'Lists');
    params.set('a', 'index');
    params.set('tid', options.categoryId || '1');
  }
  if (page > 1) params.set('page', String(page));

  const html = await fetchSource(`/?${params.toString()}`);
  const products = parseProducts(html);
  const totals = parseCatalogTotals(html, products.length);
  const fallbackIds = !options.query && options.categoryId ? (CATEGORY_FALLBACK_IDS[options.categoryId] || []) : [];
  totals.totalProducts += fallbackIds.length;
  if (fallbackIds.length && page === totals.totalPages) {
    const sourceIds = new Set(products.map((product) => product.id));
    const fallbackProducts = (await Promise.all(fallbackIds.map((id) => getProduct(id)))).filter((product): product is SourceProductDetail => Boolean(product));
    for (const product of fallbackProducts) {
      if (!sourceIds.has(product.id)) products.push(product);
    }
  }
  if (options.sort === 'price-asc') products.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  if (options.sort === 'price-desc') products.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
  if (options.sort === 'name') products.sort((a, b) => a.title.localeCompare(b.title));
  return { products, page, ...totals };
}

export async function getProducts(options: {
  categoryId?: string;
  query?: string;
  page?: number;
  sort?: string;
} = {}): Promise<SourceProduct[]> {
  return (await getProductPage(options)).products;
}

export async function getProduct(id: string): Promise<SourceProductDetail | null> {
  if (!/^\d+$/.test(id)) return null;
  const path = `/?m=home&c=View&a=index&aid=${encodeURIComponent(id)}`;
  const html = await fetchSource(path);
  const $ = load(html);
  const title = $('main.product-detail h1.product-title').first().text().replace(/\s+/g, ' ').trim();
  if (!title) return null;

  const priceLabel = $('main.product-detail .current-price').first().text().replace(/\s+/g, ' ').trim();
  const parsedPrice = Number.parseFloat(priceLabel.replace(/[^\d.]/g, ''));
  const gallery = Array.from(new Set(
    $('main.product-detail .thumbnail, main.product-detail #mainImage')
      .map((_, image) => absoluteUrl($(image).attr('src')))
      .get()
      .filter(Boolean)
  ));
  const kakobuyUrl = $('main.product-detail a')
    .filter((_, link) => /kakobuy link/i.test($(link).text()))
    .first()
    .attr('href') || '';
  const marketplaceId = kakobuyUrl.match(/itemID%3D(\d+)/i)?.[1]
    || kakobuyUrl.match(/itemID=(\d+)/i)?.[1]
    || null;
  const category = $('main.product-detail .product-breadcrumb span').first().text().replace(/\s+/g, ' ').trim();
  const image = gallery[0] || '';

  return {
    id,
    title,
    price: Number.isFinite(parsedPrice) ? parsedPrice : null,
    priceLabel: priceLabel || '—',
    image,
    sourceUrl: `${SOURCE_SITE}${path}`,
    category,
    gallery,
    kakobuyUrl: absoluteUrl(kakobuyUrl),
    marketplaceId
  };
}

export const sourceSite = SOURCE_SITE;
