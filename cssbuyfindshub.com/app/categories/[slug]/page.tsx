import Hub from '../../hub';import {cats} from '../../../lib/source';import {notFound} from 'next/navigation';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return {alternates:{canonical:'https://cssbuyfindshub.com/categories/'+slug},title:`CSSBuy ${cats.find(c=>c.slug===slug)?.name||'Finds'} Spreadsheet | Finds Hub`}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const cat=cats.find(c=>c.slug===slug);if(!cat)notFound();return <Hub mode="catalog" category={cat!.id}/>}
