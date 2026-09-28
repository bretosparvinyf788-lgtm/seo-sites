import type { APIRoute } from 'astro';
import { languageOrder } from '../../lib/i18n';
import { getCategories, getProductPage } from '../../lib/source';
import { guides } from '../../lib/guides';
import { SITE_LASTMOD, sitemapUrlEntry } from '../../lib/sitemap';

export const GET: APIRoute = async () => {
  const staticRoutes = ['', 'spreadsheet/', 'categories/', 'guides/', 'faq/'];
  let categoryRoutes: string[] = [];
  try {
    const categories = (await getCategories()).filter((category) => category.id !== '1');
    const totals = await Promise.all(categories.map(async (category) => {
      const result = await getProductPage({ categoryId: category.id, page: 1 });
      return { id: category.id, totalPages: result.totalPages };
    }));
    categoryRoutes = totals.flatMap(({ id, totalPages }) =>
      Array.from({ length: totalPages }, (_, index) =>
        index === 0 ? `category/${id}/` : `category/${id}/?page=${index + 1}`
      )
    );
  } catch {
    // Static routes remain discoverable during a temporary source outage.
  }

  const urls = languageOrder.flatMap((lang) =>
    [...staticRoutes, ...categoryRoutes].map((route) => sitemapUrlEntry(lang, route, SITE_LASTMOD))
  );
  urls.push(...languageOrder.flatMap((lang) => guides.map((guide) => sitemapUrlEntry(lang, `guides/${guide.slug}/`, guide.date))));
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`;
  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=3600'
    }
  });
};
