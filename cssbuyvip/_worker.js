export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === 'www.cssbuyvip.shop') {
      url.hostname = 'cssbuyvip.shop';
      return Response.redirect(url.toString(), 301);
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
