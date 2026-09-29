import { defineMiddleware } from 'astro:middleware';

const SECURITY_HEADERS: Record<string, string> = {
  'strict-transport-security': 'max-age=63072000; includeSubDomains',
  'content-security-policy': "default-src 'self'; base-uri 'self'; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://cloudflareinsights.com; font-src 'self' data:; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: https:; object-src 'none'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests",
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY'
};

export const onRequest = defineMiddleware(async ({ request, url, locals }, next) => {
  const edgeCache = (globalThis as typeof globalThis & {
    caches?: CacheStorage & { default?: Cache };
  }).caches?.default;
  const canCachePage = request.method === 'GET'
    && !url.pathname.includes('/search/')
    && !url.pathname.includes('.');
  const cacheKeyUrl = new URL(url);
  cacheKeyUrl.searchParams.set('__kw_cache', '20260929-1');
  const cacheKey = new Request(cacheKeyUrl, { method: 'GET' });

  if (edgeCache && canCachePage) {
    const cached = await edgeCache.match(cacheKey);
    if (cached) {
      const headers = new Headers(cached.headers);
      headers.set('x-kakobuyworks-cache', 'HIT');
      return new Response(cached.body, { status: cached.status, statusText: cached.statusText, headers });
    }
  }

  const response = await next();
  const headers = new Headers(response.headers);

  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);

  const contentType = headers.get('content-type') || '';
  if (response.status >= 500 || url.pathname.includes('/search/')) {
    headers.set('cache-control', 'no-store');
  } else if ((request.method === 'GET' || request.method === 'HEAD') && response.status === 200 && contentType.includes('text/html')) {
    headers.set('cache-control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400');
  } else if (response.status >= 300 && response.status < 400) {
    headers.set('cache-control', 'public, max-age=3600, s-maxage=86400');
  }

  if (canCachePage) headers.set('x-kakobuyworks-cache', 'MISS');
  const shouldCachePage = Boolean(
    edgeCache
    && canCachePage
    && response.status === 200
    && contentType.includes('text/html')
  );

  // Do not tee the live response stream into Cache API. Cloudflare can finish
  // the cache write while the client branch fails, which turns a successful
  // cold page render into an HTTP 500. Buffer the small HTML response once and
  // give the client and cache independent bodies instead.
  const responseBody = shouldCachePage ? await response.arrayBuffer() : response.body;
  const finalResponse = new Response(
    responseBody instanceof ArrayBuffer ? responseBody.slice(0) : responseBody,
    {
      status: response.status,
      statusText: response.statusText,
      headers
    }
  );

  if (edgeCache && shouldCachePage && responseBody instanceof ArrayBuffer) {
    const cacheResponse = new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
    const cacheWrite = edgeCache.put(cacheKey, cacheResponse).catch((error) => {
      console.error('PAGE_CACHE_WRITE_ERROR', error);
    });
    const executionContext = (locals as typeof locals & {
      runtime?: { ctx?: { waitUntil?: (promise: Promise<unknown>) => void } };
    }).runtime?.ctx;

    if (executionContext?.waitUntil) executionContext.waitUntil(cacheWrite);
    else void cacheWrite;
  }

  return finalResponse;
});
