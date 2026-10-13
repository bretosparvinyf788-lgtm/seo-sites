'use client';
import { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { Dialog,DialogContent,DialogTitle,DialogTrigger } from '@/components/ui/dialog';
import { t,type Lang } from '@/lib/content';
export type ScreenshotHotspot={n:number;x:number;y:number;w:number;h:number};
function Shot({src,title,hotspots}:{src:string;title:string;hotspots?:ScreenshotHotspot[]}){return <span className="annotated-shot"><img src={src} alt={title} loading="lazy"/>{hotspots?.map(p=><span key={p.n} aria-hidden="true" className="shot-hotspot" style={{left:p.x+'%',top:p.y+'%',width:p.w+'%',height:p.h+'%'}}><b>{p.n}</b></span>)}</span>;}
export function GuideScreenshot({desktop,mobile,lang,title,hotspots}:{desktop:string;mobile?:string;lang:Lang;title:string;hotspots?:ScreenshotHotspot[]}){
 const [view,setView]=useState<'desktop'|'mobile'>('desktop');const src=view==='mobile'&&mobile?mobile:desktop;
 return <div className="guide-screenshot">{mobile&&<div className="screenshot-tabs"><button aria-pressed={view==='desktop'} onClick={()=>setView('desktop')}>{t(lang,'Desktop','电脑端')}</button><button aria-pressed={view==='mobile'} onClick={()=>setView('mobile')}>{t(lang,'Mobile','手机端')}</button></div>}<Dialog><DialogTrigger asChild><button className="screenshot-open" aria-label={t(lang,'Enlarge the page image','放大页面配图')}><Shot src={src} title={title} hotspots={hotspots}/><span><ZoomIn size={17}/>{t(lang,'Enlarge the page image','放大页面配图')}</span></button></DialogTrigger><DialogContent className="guide-image-dialog"><DialogTitle>{title}</DialogTitle><div><Shot src={src} title={title} hotspots={hotspots}/></div></DialogContent></Dialog></div>;
}
