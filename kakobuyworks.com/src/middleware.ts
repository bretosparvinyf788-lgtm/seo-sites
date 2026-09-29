import { defineMiddleware } from 'astro:middleware';

const SECURITY_HEADERS: Record<string, string> = {
  'strict-transport-security': 'max-age=63072000; includeSubDomains',
  'content-security-policy': "default-src 'self'; base-uri 'self'; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://cloudflareinsights.com; font-src 'self' data:; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: https:; object-src 'none'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests",
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY'
};

export const onRequest = defineMiddleware(async ({ request, url }, next) => {
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

  headers.set('x-kakobuyworks-build', '20260929-3');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
});
