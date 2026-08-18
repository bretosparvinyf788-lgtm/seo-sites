import fs from "node:fs/promises";
import path from "node:path";

const sources = [
  "https://kakobuymake.com/uploads/allimg/20260429/1-260429140632106.webp",
  "https://kakobuymake.com/uploads/allimg/20260429/1-26042914010K31.webp",
  "https://kakobuymake.com/uploads/allimg/20260429/1-26042913514TL.webp",
  "https://kakobuymake.com/uploads/allimg/20260429/1-26042913500S13.webp",
  "https://kakobuymake.com/uploads/allimg/20260429/1-260429134R95S.webp",
  "https://kakobuymake.com/uploads/allimg/20260428/1-26042Q61251159.webp",
  "https://kakobuymake.com/uploads/allimg/20260428/1-26042Q61101214.webp",
  "https://kakobuymake.com/uploads/allimg/20260428/1-26042Q55925C1.webp",
  "https://kakobuymake.com/uploads/allimg/20260428/1-26042Q5442A05.webp",
  "https://kakobuymake.com/uploads/allimg/20260428/1-26042Q53IC16.webp"
];

const outputDirectory = path.resolve("public/products");
await fs.mkdir(outputDirectory, { recursive: true });

for (const [index, source] of sources.entries()) {
  const response = await fetch(source);
  if (!response.ok) throw new Error(`Unable to download product ${index + 1}: ${response.status}`);
  const filename = `product-${String(index + 1).padStart(2, "0")}.webp`;
  await fs.writeFile(path.join(outputDirectory, filename), Buffer.from(await response.arrayBuffer()));
}

console.log(`Saved ${sources.length} product images to ${outputDirectory}`);
