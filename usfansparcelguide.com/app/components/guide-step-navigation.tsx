'use client';
import { useEffect,useRef,useState } from 'react';
type Item={id:string;title:string};
export function GuideStepNavigation({items,previous,next,directory}:{items:Item[];previous:string;next:string;directory:string}){
 const [active,setActive]=useState(0);const nav=useRef<HTMLElement>(null);
 useEffect(()=>{
  const root=nav.current?.closest('article');const header=document.querySelector('.site-header');let frame=0;
  const update=()=>{const headerHeight=header?.getBoundingClientRect().height??78;const navHeight=nav.current?.getBoundingClientRect().height??64;root?.style.setProperty('--guide-header-height',`${headerHeight}px`);root?.style.setProperty('--guide-anchor-offset',`${headerHeight+navHeight+28}px`);const threshold=headerHeight+navHeight+28;let index=0;for(let i=0;i<items.length;i++){const section=document.getElementById(items[i].id);if(section&&section.getBoundingClientRect().top<=threshold)index=i;}setActive(index);};
  const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update);};
  const resize=new ResizeObserver(schedule);if(header)resize.observe(header);if(nav.current)resize.observe(nav.current);window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('hashchange',schedule);window.addEventListener('resize',schedule);update();
  return()=>{cancelAnimationFrame(frame);resize.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('hashchange',schedule);window.removeEventListener('resize',schedule);};
 },[items]);
 return <nav ref={nav} className="guide-sticky-nav" aria-label={directory}><a href="#beginner-directory" className="guide-directory-link">{directory}</a><label className="guide-step-picker"><span className="sr-only">{directory}</span><select value={items[active].id} onChange={e=>{const index=items.findIndex(i=>i.id===e.target.value);setActive(index);window.location.hash=e.target.value;}}>{items.map((item,i)=><option key={item.id} value={item.id}>{String(i+1).padStart(2,'0')} · {item.title}</option>)}</select></label><span className="guide-step-count" aria-live="polite">{String(active+1).padStart(2,'0')} / {items.length}</span><div className="guide-sticky-pager">{active>0?<a href={'#'+items[active-1].id} rel="prev">{previous}</a>:<span aria-disabled="true">{previous}</span>}{active<items.length-1?<a href={'#'+items[active+1].id} rel="next">{next}</a>:<span aria-disabled="true">{next}</span>}</div></nav>;
}
