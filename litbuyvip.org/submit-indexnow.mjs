import { readFile } from "node:fs/promises";

const host = "litbuyvip.org";
const key = "04f59b88edb1ef06168792c86e49e813";
const sitemap = await readFile(new URL("./sitemap.xml", import.meta.url), "utf8");
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList,
  }),
});

if (!response.ok) {
  throw new Error(`IndexNow submission failed: ${response.status} ${await response.text()}`);
}

console.log(`Submitted ${urlList.length} URLs to IndexNow (${response.status}).`);
