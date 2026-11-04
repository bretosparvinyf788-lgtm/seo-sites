import Hub from '../../hub';
import {products,details,source,parseItem} from '../../../lib/source';
import {notFound} from 'next/navigation';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const p=products.find(p=>p.id===id);return {title:`${p?.english||p?.title||'Product details'} | CSSBuy Finds Hub`,alternates:{canonical:'https://cssbuyfindshub.com/products/'+id}}}
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!/^\d{1,10}$/.test(id))notFound();let item:any=details.find(d=>d.id===id);if(!item){try{item=parseItem(await source('https://kakobuymake.com/?m=home&c=View&a=index&aid='+id),id);}catch{const p=products.find(p=>p.id===id);if(p)item={...p,images:[p.image],agent:''};}}return <Hub mode="product" productId={id} initialItem={item}/>}
