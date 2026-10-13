import handler from 'vinext/server/fetch-handler';
export default {
 fetch(request:Request,env:Cloudflare.Env,ctx:ExecutionContext){
  const url=new URL(request.url);
  if(url.protocol==='http:' || url.hostname==='www.usfansparcelguide.com'){
   url.protocol='https:';if(url.hostname==='www.usfansparcelguide.com')url.hostname='usfansparcelguide.com';
   return Response.redirect(url.href,301);
  }
  return handler.fetch(request,env,ctx);
 }
};
