import type { APIRoute } from 'astro';
import { getCategories, getProductPage } from '../lib/source';
import { SITE, SITE_LASTMOD, xml } from '../lib/sitemap';

export const GET: APIRoute = async () => {
  let sitemapUrls = [`${SITE}/sitemaps/static.xml`];
  try {
    const categories = (await getCategories()).filter((category) => category.id !== '1');
    const totals = await Promise.all(categories.map(async (category) => {
      const result = await getProductPage({ categoryId: category.id, page: 1 });
      return { id: category.id, totalPages: result.totalPages };
    }));
    sitemapUrls = [
      ...sitemapUrls,
      ...totals.flatMap(({ id, totalPages }) =>
        Array.from({ length: totalPages }, (_, index) => `${SITE}/sitemaps/category/${id}/${index + 1}.xml`)
      )
    ];
  } catch {
    // Keep the static sitemap available if the live source is temporarily unavailable.
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapUrls.map((url) => `<sitemap><loc>${xml(url)}</loc><lastmod>${SITE_LASTMOD}</lastmod></sitemap>`).join('')}</sitemapindex>`;
  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=3600'
    }
  });
};
