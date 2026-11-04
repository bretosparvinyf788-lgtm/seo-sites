import {source,parseCatalog,products,hasNextCatalogPage} from '../../../lib/source';

export async function GET(req:Request){
 const q=new URL(req.url).searchParams;
 // Main-source category 1 is the complete directory, including categories 2–11.
 const category=Number(q.get('tid'));
 const tid=Number.isInteger(category)&&category>=2&&category<=11?category:1;
 const requestedPage=Number(q.get('page'));
 const page=Number.isSafeInteger(requestedPage)&&requestedPage>0?requestedPage:1;
 const search=(q.get('q')||'').trim().slice(0,100);
 const u=search?'https://kakobuymake.com/?m=home&c=Search&a=lists&keywords='+encodeURIComponent(search)+'&page='+page:`https://kakobuymake.com/?m=home&c=Lists&a=index&tid=${tid}&page=${page}`;
 try{
  const html=await source(u);
  const rows=parseCatalog(html,search||tid===1?0:tid).map(row=>{
   const known=products.find(p=>p.id===row.id);
   return {...row,tid:row.tid||known?.tid||0,english:known?.english};
  });
  if(!rows.length&&!/product|pagination|没有|暂无|no results/i.test(html))throw Error('Unexpected source response');
  return Response.json({rows,live:true,page,hasMore:hasNextCatalogPage(html,page,rows.length)});
 }catch{
  const matches=products.filter(p=>search?p.title.toLowerCase().includes(search.toLowerCase())||p.english?.toLowerCase().includes(search.toLowerCase()):tid===1||p.tid===tid).sort((a,b)=>Number(b.id)-Number(a.id));
  return Response.json({rows:matches.slice((page-1)*50,page*50),live:false,page,hasMore:matches.length>page*50,message:'Live source temporarily unavailable. Showing the last retrieved catalog.'});
 }
}
