'use client';
import { useEffect,useState } from 'react';
import { X } from 'lucide-react';
import { beginnerActions,tourSelectors,type TourKey } from '@/lib/beginner-actions';
import { t,href,type Lang } from '@/lib/content';
export function PageTour({lang,tour}:{lang:Lang;tour:TourKey}){
 const [visible,setVisible]=useState(true);const action=beginnerActions.find(a=>a.key===tour)!;
 useEffect(()=>{
  if(!visible)return;
  const nodes:Element[]=[];let scrolled=false;
  function mark(){for(const selector of tourSelectors[tour]){const el=document.querySelector(selector);if(el&&!nodes.includes(el)){el.setAttribute('data-tour-highlight','true');nodes.push(el);}}if(nodes[0]&&!scrolled){nodes[0].scrollIntoView({block:'center',behavior:'instant'});scrolled=true;}}
  const frame=requestAnimationFrame(mark);const observer=new MutationObserver(mark);observer.observe(document.body,{childList:true,subtree:true});const timeout=setTimeout(()=>observer.disconnect(),20000);
  return()=>{cancelAnimationFrame(frame);clearTimeout(timeout);observer.disconnect();nodes.forEach(el=>el.removeAttribute('data-tour-highlight'));};
 },[tour,visible]);
 if(!visible)return null;
 return <div className="page-tour" role="region" aria-label={t(lang,'Page instructions','页面操作指引')}><div><strong>{t(lang,action.page[0],action.page[1])}</strong><p>{t(lang,action.steps[0][0],action.steps[0][1])}</p><a href={href(lang,'/guides/how-to-order')} target="_top">{t(lang,'Back to the beginner guide','返回新手指南')}</a></div><button onClick={()=>setVisible(false)} aria-label={t(lang,'Close instructions','关闭操作指引')}><X size={20}/></button></div>;
}
