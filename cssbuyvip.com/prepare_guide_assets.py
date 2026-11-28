from PIL import Image,ImageDraw
from pathlib import Path
import json,shutil
root=Path(__file__).parent;r=root/'dist';out=r/'assets/guide';out.mkdir(parents=True,exist_ok=True)
base=Path('/opt/codex/downloads/6e872cef-31a4-44d5-ae35-bb130760fdc8')
files={2:'69ab5a74-8daf-419e-b803-a434a027f372',3:'e715c612-7d7d-4f54-af34-9a517fd61d42',5:'c4ee68cf-d1ca-4bf4-90e2-93753c4c350c',6:'353a52d0-408f-4cd4-ac0d-15992d00209c',7:'81f640bc-d9c0-421d-bc8a-7929b95a8770',8:'516fbecc-f4e9-44ec-b19e-e625b297cfe5',10:'5a3be677-60ec-4a19-a12f-bb6ef3ae321d',11:'1d5c1b9f-247d-4cdb-80bf-6cdfbbdcb254',12:'1034a83e-a94c-435a-b813-93099f9b2b4c'}
g=json.loads((r/'guide.json').read_text());provenance=[]
for n,f in files.items():
 s=g['steps'][n-1];im=Image.open(base/f).convert('RGB');rects=[]
 if n==10:
  # Hide example address values while keeping field names and controls legible.
  rects=[(302,288,490,309),(368,328,492,344),(368,352,450,368),(368,377,435,394),(368,401,450,419),(368,426,437,444),(368,451,483,467)]
  d=ImageDraw.Draw(im)
  for box in rects:d.rounded_rectangle(box,radius=3,fill='#dce3d8')
 name=f'official-step-{n}.webp';im.save(out/name,quality=92);provenance.append({'step':n,'source':s['image'],'local':'/assets/guide/'+name,'width':im.width,'height':im.height,'masks':rects,'kind':'Official historical desktop screenshot' if n not in [6,7] else 'Official process diagram'})
 s['sourceImage']=s['image'];s['image']='/assets/guide/'+name
shutil.copy2(base/'bda4b029-ab6d-4955-83ea-dcebf8107a2d',r/'assets/cssbuy-logo.svg')
# These official images are process diagrams, not populated order screens.
fix={
2:('Copy the original marketplace link','复制原始商品链接','The official example shows copying an item URL from the browser address bar on a marketplace. It is an example from another marketplace, not the current Weidian item. Paste your own Weidian item URL into CSSBuy’s search field.','官方示例展示从浏览器地址栏复制电商商品 URL，图中为其他平台示例，并非当前微店商品。将自己准确的微店商品 URL 粘贴到 CSSBuy 搜索框。'),
5:('Review the item-order confirmation','核对商品订单确认页','Locate Confirm Purchase at the top and the item row below it. Recheck options, quantity, services and total before the Submit To Buy button. This confirmation screen is not a payment receipt.','找到顶部 Confirm Purchase 及其下商品行，在 Submit To Buy 前核对规格、数量、服务及总额。这是订单确认页，不是付款成功凭证。'),
6:('Understand the seller-purchase stage','了解卖家采购阶段','This is CSSBuy’s process diagram: an item is selected, purchased and delivered by the seller. It does not show an actual order status. Read progress from your own purchase-order record.','这是 CSSBuy 官方流程示意图，展示选品、采购和卖家配送，不是实际订单状态。应在自己的采购订单记录查看进度。'),
7:('Understand the warehouse-inspection stage','了解仓库检查阶段','This official process diagram places inspection before parcel submission. It is not a QC photo or proof of your unit being inspected. Open your own stored item to inspect the actual photos.','官方流程图说明入库检查在提交包裹之前。这不是 QC 实拍，也不能证明自己的商品已检查。应打开自己的入库商品查看实际照片。'),
11:('Review parcel services and the total','核对包裹服务和总额','The historical example shows Choose Packaging on the left and a fee summary with Submit To Ship on the right. Review each selected service and the payable total before continuing. It does not show a successful payment.','历史示例左侧为 Choose Packaging，右侧为费用汇总及 Submit To Ship。继续前核对所选服务及应付总额，图片不表示已付款。')}
for n,v in fix.items():
 s=g['steps'][n-1];s.update(imageTitle=v[0],imageTitleZh=v[1],imageAction=v[2],imageActionZh=v[3])
# Reuse the verified shipping-address illustration for the address step itself.
s=g['steps'][8];s.update(image='/assets/guide/official-step-10.webp',width=1116,height=750,imageTitle='Verify the selected delivery address',imageTitleZh='核对已选收件地址',imageAction='Find Shipping Address and the Select Your Address area. Confirm the recipient destination, postcode and contact fields on your own form, then check Select Shipping Method below. Example personal values have been concealed.',imageActionZh='找到 Shipping Address 与 Select Your Address 区域，在自己的表单核对收件目的地、邮编及联系方式，再查看下方 Select Shipping Method。图中演示个人资料已遮挡。')
g['illustration_checked']=True;g['phone_captures_complete']=False
(r/'guide.json').write_text(json.dumps(g,ensure_ascii=False,indent=2));(root/'guide-asset-sources.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2))
for h in r.rglob('*.html'):
 s=h.read_text().replace('https://assets.cssbuy.com/static/icon/logo.svg','/assets/cssbuy-logo.svg');h.write_text(s)
print('9 local official assets; address values precisely concealed; illustration captions reconciled')
