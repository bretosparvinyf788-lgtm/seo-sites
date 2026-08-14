import type { MetadataRoute } from "next";
import { guides } from "./site-data";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://usfansvip.store";
  return [{ url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }, { url: `${base}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: .8 }, ...guides.map(g=>({ url:`${base}/guides/${g.slug}`, lastModified:new Date(), changeFrequency:"monthly" as const, priority:.7 }))];
}
