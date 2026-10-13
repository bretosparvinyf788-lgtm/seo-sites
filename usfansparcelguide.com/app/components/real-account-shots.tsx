import { t,type Lang } from '@/lib/content';
import { GuideScreenshot,type ScreenshotHotspot } from './guide-screenshot';
type Kind='warehouse'|'address'|'route'|'shipping';
const notes={
 warehouse:['Live capture: empty warehouse. QC photos and parcel submission require stored items.','真实截图：当前仓库为空。商品入库后才能打开质检照片和包裹提交页面。'],
 address:['Live capture: blank shipping address form. No address was saved.','真实截图：空白收货地址表单。本次没有填写或保存地址。'],
 route:['Live capture: shipping estimate (United States, 1,000 g), not a parcel submission. Packing and declaration screens remain unavailable without stored items.','真实截图：美国、1,000克的运费估算，并非包裹提交页。当前没有入库商品，尚无法截取打包与申报页面。'],
 shipping:['Live capture: Parcel and Payment Pending. No payable parcel exists, so the shipping payment form is unavailable. No payment was made.','真实截图：Parcel 包裹列表与 Payment Pending 待付款筛选。当前没有待付款包裹，无法打开国际运费支付表单；本次没有付款。']
} as const;
const shots:Record<Kind,{file:string;path:string;hotspots:ScreenshotHotspot[]}[]>={
 warehouse:[{file:'warehouse-empty.jpg',path:'My Warehouse → Warehouse',hotspots:[{n:1,x:4.2,y:46,w:15,h:6},{n:2,x:21,y:25.5,w:74,h:5},{n:3,x:28,y:39,w:62,h:25}]}],
 shipping:[{file:'parcel-entry.jpg',path:'My Parcel → Parcel → All Parcel',hotspots:[{n:1,x:3.9,y:49.8,w:15,h:5.5},{n:2,x:20,y:23.5,w:7.2,h:4.2},{n:3,x:20.2,y:29.3,w:73,h:4.5}]},{file:'parcel-pending.jpg',path:'Parcel → Payment Pending',hotspots:[{n:1,x:29.5,y:23.5,w:10,h:4.2},{n:2,x:20.2,y:29.3,w:44,h:4.5},{n:3,x:28,y:43,w:63,h:23}]}],
 address:[{file:'address-entry.jpg',path:'User Center → Shipping Address → Add Shipping Address',hotspots:[{n:1,x:4,y:11,w:15,h:6},{n:2,x:36,y:11,w:11,h:4.5},{n:3,x:20,y:16.5,w:14,h:4.5}]},{file:'address-form.jpg',path:'Add Shipping Address',hotspots:[{n:1,x:23,y:20,w:57,h:5.5},{n:2,x:23,y:26.5,w:57,h:5.5},{n:3,x:23,y:33,w:57,h:12},{n:4,x:71.2,y:57,w:9,h:4.6}]}],
 route:[{file:'route-estimate.jpg',path:'Estimation → By Weight → United States → 1000 g → Inquire',hotspots:[{n:1,x:4,y:34,w:44,h:4.5},{n:2,x:4,y:40.5,w:22,h:5},{n:3,x:50,y:47,w:7.3,h:5}]},{file:'route-results.jpg',path:'Price / Transit Time → Details',hotspots:[{n:1,x:5,y:10,w:17,h:5},{n:2,x:22,y:22,w:17,h:15},{n:3,x:44,y:22,w:18,h:9},{n:4,x:65,y:20,w:28,h:19}]}]
};
// Exact English control labels match the photographed interface in every locale.
const controls:Record<string,string[]>={
 'parcel-entry.jpg':['Parcel','All Parcel','Product Name/Package Number · Start Date · End Date · Search'],
 'parcel-pending.jpg':['Payment Pending','Product Name/Package Number','Parcel'],
 'warehouse-empty.jpg':['Warehouse','Product Name/Order Number · Start Date · End Date · Search','Warehouse'],
 'address-entry.jpg':['User Center','Shipping Address','Add Shipping Address'],
 'address-form.jpg':['First Name · Last Name','Country','Street address · Zip Code · Phone No.','Confirm'],
 'route-estimate.jpg':['From USFans to','Weight(g)','Inquire'],
 'route-results.jpg':['Price · Transit Time','Shipping Fee','Transit Time','Details']
};
export function RealAccountShots({kind,lang}:{kind:Kind;lang:Lang}){return <div className="real-product-shots"><p className="real-shot-note">{t(lang,notes[kind][0],notes[kind][1])}</p>{shots[kind].map(shot=><section key={shot.file}><h3>{shot.path}</h3><GuideScreenshot desktop={'/guide-platform/'+shot.file} lang={lang} title={shot.path} hotspots={shot.hotspots}/><ol className="shot-instructions">{controls[shot.file].map((label,i)=><li key={i}><b>{i+1}</b><span>{label}</span></li>)}</ol></section>)}<figcaption>USFans · 2026-10-12</figcaption></div>;}
