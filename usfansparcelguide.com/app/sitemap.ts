import type { MetadataRoute } from 'next';
import { categories, SITE } from '@/lib/catalog';
import { guides, href } from '@/lib/content';
import { languages } from '@/lib/locales';
export default function sitemap():MetadataRoute.Sitemap {const paths=['/','/catalog','/categories','/updates',...categories.map(c=>`/category/${c.slug}`),...guides.map(g=>`/guides/${g.slug}`)];return paths.flatMap(path=>languages.map(lang=>({url:SITE+href(lang.code,path),alternates:{languages:Object.fromEntries(languages.map(l=>[l.locale,SITE+href(l.code,path)]))}})));}
