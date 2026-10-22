import fs from 'node:fs';
export async function writeCrawlerAssets({out,worker,origin}) {
  const app=(await import('data:text/javascript;base64,'+fs.readFileSync(worker).toString('base64'))).default;
  const paths=['/robots.txt','/sitemap.xml'];
  const files=[];
  for (const path of paths) {
    const response=await app.fetch(new Request(origin+path),{},{waitUntil(){}});
    if(response.status!==200)throw new Error('Crawler asset failed: '+path+' '+response.status);
    const body=await response.text();
    if(path==='/robots.txt'&&(!body.includes('Sitemap: '+origin+'/sitemap.xml')||/Disallow:\s*\/\s*(?:\n|$)/i.test(body)))throw new Error('Invalid production robots.txt');
    if(path==='/sitemap.xml'&&(!body.includes('http://www.sitemaps.org/schemas/sitemap/0.9')||body.includes('.chatgpt.site')||body.includes('.pages.dev')))throw new Error('Invalid production sitemap.xml');
    files.push([path,body]);
  }
  for(const [path,body] of files)fs.writeFileSync(out+path,body);
  // The catalog index must not wait for the upstream store on every crawler request.
  const catalog=fs.readFileSync(new URL('../catalog-sitemap.xml',import.meta.url),'utf8');
  if(!catalog.includes('<sitemapindex')||!catalog.includes(origin+'/sitemaps/products-'))throw new Error('Invalid catalog sitemap snapshot');
  fs.mkdirSync(out+'/sitemaps',{recursive:true});
  fs.writeFileSync(out+'/sitemaps/catalog.xml',catalog);
  paths.push('/sitemaps/catalog.xml');
  const routeFile=out+'/_routes.json',routes=JSON.parse(fs.readFileSync(routeFile,'utf8'));
  routes.exclude=[...new Set([...routes.exclude,...paths])];
  fs.writeFileSync(routeFile,JSON.stringify(routes,null,2)+'\n');
  const headerFile=out+'/_headers';
  const headers=fs.existsSync(headerFile)?fs.readFileSync(headerFile,'utf8'):'';
  fs.writeFileSync(headerFile,headers.replace(/\n?\/(?:robots\.txt|sitemap\.xml|sitemaps\/catalog\.xml)\n(?:[ \t]+[^\n]*\n)*/g,'')+'\n/robots.txt\n  Content-Type: text/plain; charset=utf-8\n  Cache-Control: public, max-age=300\n/sitemap.xml\n  Content-Type: application/xml; charset=utf-8\n  Cache-Control: public, max-age=300\n/sitemaps/catalog.xml\n  Content-Type: application/xml; charset=utf-8\n  Cache-Control: public, max-age=300\n');
}
