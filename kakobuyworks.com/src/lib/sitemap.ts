import { languageOrder, type Lang } from './i18n';

export const SITE = 'https://kakobuyworks.com';
export const SITE_LASTMOD = '2026-09-28';

export const xml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

export function localizedUrl(lang: Lang, route: string) {
  return `${SITE}/${lang}/${route}`;
}

export function sitemapUrlEntry(lang: Lang, route: string, lastmod?: string) {
  const alternates = languageOrder
    .map((alternateLang) => `<xhtml:link rel="alternate" hreflang="${alternateLang === 'zh' ? 'zh-CN' : alternateLang}" href="${xml(localizedUrl(alternateLang, route))}"/>`)
    .join('');
  const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${xml(localizedUrl('en', route))}"/>`;
  return `<url><loc>${xml(localizedUrl(lang, route))}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${alternates}${xDefault}</url>`;
}
