import type { APIRoute } from 'astro';
import { languageOrder } from '../../../../lib/i18n';
import { getCategories, getProductPage } from '../../../../lib/source';
import { sitemapUrlEntry } from '../../../../lib/sitemap';

export const GET: APIRoute = async ({ params }) => {
  const id = params.id || '';
  const page = Number.parseInt(params.page || '', 10);
  if (!/^\d+$/.test(id) || !Number.isInteger(page) || page < 1) return new Response(null, { status: 404 });

  try {
    const categories = await getCategories();
    if (!categories.some((category) => category.id === id && id !== '1')) return new Response(null, { status: 404 });
    const result = await getProductPage({ categoryId: id, page });
    if (page > result.totalPages || result.products.length === 0) return new Response(null, { status: 404 });

    const urls = result.products.flatMap((product) =>
      languageOrder.map((lang) => sitemapUrlEntry(lang, `product/${product.id}/`))
    );
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`;
    return new Response(body, {
      headers: {
        'content-type': 'application/xml; charset=utf-8',
        'cache-control': 'public, max-age=21600, s-maxage=21600'
      }
    });
  } catch {
    return new Response(null, { status: 503, headers: { 'retry-after': '300' } });
  }
};
