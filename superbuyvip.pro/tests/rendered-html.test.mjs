import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta = /name=["']codex-preview["']/i;
const canonicalLink = /<link(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']https:\/\/superbuyvip\.pro\/["'])[^>]*>/i;

test("renders production SEO metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.doesNotMatch(html, developmentPreviewMeta);
  assert.match(html, canonicalLink);
});

test("publishes the August 27 guide across every discovery surface", async () => {
  const article = await readFile(new URL("../public/guides/superbuy-1688-buying-risk-playbook/index.html", import.meta.url), "utf8");
  const archive = await readFile(new URL("../public/guides/index.html", import.meta.url), "utf8");
  const homepage = await readFile(new URL("../superbuyvip-pro-single-file.html", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");

  assert.match(article, /PUBLISHED 2026-08-27/);
  assert.match(article, /Buying from 1688 Through Superbuy Without Guessing/);
  const articleBody = article.match(/<article class="article">([\s\S]*?)<\/article>/)?.[1] ?? "";
  assert.doesNotMatch(articleBody, /<a\b/i);
  const wordCount = articleBody
    .replace(/<[^>]+>/g, " ")
    .replace(/&[#A-Za-z0-9]+;/g, " ")
    .match(/[A-Za-z0-9’'-]+/g)?.length ?? 0;
  assert.ok(wordCount >= 1500 && wordCount <= 1800, `article word count ${wordCount}`);

  const latestGuides = homepage.match(/<div class="guide-list">([\s\S]*?)<\/div><div class="all-guides-bar">/)?.[1] ?? "";
  assert.equal((latestGuides.match(/<article\b/g) ?? []).length, 3);
  assert.match(latestGuides, /superbuy-1688-buying-risk-playbook/);
  assert.equal((archive.match(/<main class="archive">([\s\S]*?)<\/main>/)?.[1].match(/<article\b/g) ?? []).length, 5);
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 7);
});
