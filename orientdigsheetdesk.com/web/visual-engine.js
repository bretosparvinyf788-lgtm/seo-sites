import {VISUAL_KINDS,normalized,classifyVisual} from './visual-core.js?v=__VISUAL_REVISION__';
let ready;
async function loadEngine(){
 if(!ready)ready=(async()=>{
  const tf=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/transformers.min.js');
  tf.env.allowLocalModels=false;
  tf.env.backends.onnx.wasm.numThreads=1;
  tf.env.backends.onnx.wasm.proxy=false;
  const model='Xenova/clip-vit-base-patch32';
  const [processor,vision,detailProcessor,detailModel]=await Promise.all([
   tf.AutoProcessor.from_pretrained(model),
   tf.CLIPVisionModelWithProjection.from_pretrained(model,{dtype:'q8',device:'wasm'}),
   tf.AutoProcessor.from_pretrained('Xenova/dinov2-small'),
   tf.AutoModel.from_pretrained('Xenova/dinov2-small',{dtype:'q8',device:'wasm'})
  ]);
  return {tf,processor,vision,detailProcessor,detailModel};
 })().catch(e=>{ready=null;throw e});
 return ready;
}
self.onmessage=async({data:{id,blob,prototypes}})=>{
 try{const {tf,processor,vision,detailProcessor,detailModel}=await loadEngine();
  if(!blob){self.postMessage({id,result:{ready:true}});return}
  const image=await tf.RawImage.fromBlob(blob);
  const inputs=await processor(image),output=await vision(inputs);
  const vector=normalized(output.image_embeds.data);
  const details=await detailModel(await detailProcessor(image));
  const detail=normalized(details.last_hidden_state.data.slice(0,details.last_hidden_state.dims[2]));
  self.postMessage({id,result:{vector,detail,...classifyVisual(vector,prototypes)}});
 }catch(e){self.postMessage({id,error:String(e.message||e).slice(0,200)})}
};
