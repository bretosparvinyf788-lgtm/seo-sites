export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === 'www.cssbuyvip.shop') {
      url.hostname = 'cssbuyvip.shop';
      return Response.redirect(url.toString(), 301);
    }

    // Keep a single indexable guide archive. The old blog index had the same
    // purpose as /guides/ and split crawl signals between two collections.
    if (url.pathname === '/blog' || url.pathname === '/blog/' || url.pathname === '/blog/index.html') {
      return Response.redirect(new URL('/guides/', url.origin).toString(), 301);
    }

    // Cloudflare serves this legacy file on a clean URL. Redirect the .html
    // variant explicitly so redirects, canonicals, internal links and sitemap
    // all agree on one permanent address.
    if (url.pathname === '/blog/2026-07-10-cssbuy-transaction-safe-haul-planning.html') {
      return Response.redirect(
        new URL('/blog/2026-07-10-cssbuy-transaction-safe-haul-planning', url.origin).toString(),
        301
      );
    }

    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    if (response.ok && /\.(?:css|js|svg|png|jpg|jpeg|webp)$/i.test(url.pathname)) {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (response.ok && (url.pathname.endsWith('/') || url.pathname.endsWith('.html'))) {
      headers.set('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
      headers.set('X-Robots-Tag', 'index, follow');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
