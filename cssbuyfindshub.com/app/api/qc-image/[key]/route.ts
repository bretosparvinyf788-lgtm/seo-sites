import {qcRetouch} from '../../../qc-retouch';
export async function GET(request:Request,{params}:{params:Promise<{key:string}>}){
 const {key}=await params;const src=qcRetouch[key];if(!src)return new Response('Image not found',{status:404});
 try{
  const upstream=await fetch(src,{signal:AbortSignal.timeout(12000)});if(!upstream.ok)throw new Error('Source image unavailable');
  const reader=upstream.body!.getReader();const chunks:Uint8Array[]=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>10000000){await reader.cancel();throw new Error('Image too large');}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
  // Detect WebP image dimensions, so the original photograph is never distorted.
  const v=new DataView(bytes.buffer);let width=1000,height=750;
  const tag=String.fromCharCode(...bytes.slice(12,16));
  if(tag==='VP8 '&&bytes.length>30){width=v.getUint16(26,true)&16383;height=v.getUint16(28,true)&16383;}
  if(tag==='VP8X'&&bytes.length>30){width=1+bytes[24]+(bytes[25]<<8)+(bytes[26]<<16);height=1+bytes[27]+(bytes[28]<<8)+(bytes[29]<<16);}
  if(tag==='VP8L'&&bytes.length>25){const bits=v.getUint32(21,true);width=(bits&16383)+1;height=((bits>>14)&16383)+1;}
  const patchResponse=await fetch(new URL(key==='3618-5'?'/qc-patches/heel.png':'/qc-patches/background.png',request.url));if(!patchResponse.ok)throw new Error('Background asset unavailable');const patchData='data:image/png;base64,'+Buffer.from(await patchResponse.arrayBuffer()).toString('base64');
  const original='data:'+((upstream.headers.get('content-type')||'image/webp').split(';')[0])+';base64,'+Buffer.from(bytes).toString('base64');
  const x=width*.85,patchHeight=height*.247;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>Original QC photograph with background corner cleanup</title><defs><filter id="edge" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${width*.004}"/></filter><mask id="corner"><rect x="${x}" y="${-height*.035}" width="${width*.2}" height="${patchHeight+height*.035}" fill="white" filter="url(#edge)"/></mask></defs><image href="${original}" width="${width}" height="${height}"/><image href="${patchData}" width="${width}" height="${height}" preserveAspectRatio="none" mask="url(#corner)"/></svg>`;
  return new Response(svg,{headers:{'Content-Type':'image/svg+xml','Cache-Control':'public, max-age=86400','X-Content-Type-Options':'nosniff'}});
 }catch{return Response.redirect(src,302);}
}
