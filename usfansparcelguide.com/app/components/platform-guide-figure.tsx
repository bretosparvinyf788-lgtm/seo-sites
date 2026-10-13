import { Check,CreditCard } from 'lucide-react';
import { type Product } from '@/lib/catalog';
import { t,type Lang } from '@/lib/content';
import { completionSteps } from '@/lib/beginner-completion';
import { GuideScreenshot } from './guide-screenshot';
import { RealProductShots } from './real-product-shots';
import { RealAccountShots } from './real-account-shots';
type Step=typeof completionSteps[number];
const screenshotFiles:Record<string,[string,string?]>={confirm:['/guide-platform/confirm-desktop.jpg','/guide-platform/confirm-mobile.jpg'],payment:['/guide-platform/payment-desktop.jpg','/guide-platform/payment-mobile.jpg'],purchase:['/guide-platform/purchasing.png'],tracking:['/guide-platform/tracking.png'],received:['/guide-platform/received-desktop.webp','/guide-platform/received-mobile.jpg']};
export function PlatformGuideFigure({step,product,lang}:{step:Step;product?:Product;lang:Lang}){
 if(step.kind==='options')return <RealProductShots lang={lang}/>;
 if(step.kind==='warehouse'||step.kind==='address'||step.kind==='route'||step.kind==='shipping')return <RealAccountShots kind={step.kind} lang={lang}/>;
 const files=screenshotFiles[step.kind];if(files)return <><GuideScreenshot desktop={files[0]} mobile={files[1]} lang={lang} title={t(lang,step.page[0],step.page[1])}/><figcaption>{t(lang,'USFans published interface example. Its products, amounts and account details are examples, not your order. Follow the current screen in your own account.','USFans 公开的界面示例，图中商品、金额与账户资料不代表你的订单。请以自己账户当前页面为准。')}</figcaption></>;
 const panels:Record<string,[string,string][]>={options:[['Color / version','颜色 / 版本'],['Size / measurements','尺码 / 尺寸表'],['Quantity','数量'],['Total · Buy now / Add To Cart','总价 · 立即购买 / 加入购物车']],warehouse:[['User Center · Warehouse','用户中心 · 仓库'],['Find your paid order’s item','找到已付款订单对应的商品'],['Open your own warehouse photos','打开自己订单的入库照片'],['Check color, size label and condition','核对颜色、尺码标与状态']],address:[['Select checked stored items','勾选已检查的入库商品'],['Recipient · Country','收件人 · 国家'],['Street address · Postcode · Phone','街道地址 · 邮编 · 电话'],['Review the selected items and address','复核所选商品与地址']],route:[['Available routes for your goods','当前商品可用的线路'],['Weight and item restrictions','重量与商品限制'],['Packing services and remarks','打包服务与备注'],['Declaration · Review · Submit','申报 · 复核 · 提交']],shipping:[['My Parcel · Your parcel number','我的包裹 · 你的包裹编号'],['Payment Pending · Payment action','待付款 · 对应付款入口'],['Route · Quote · Displayed fees','线路 · 运费报价 · 页面显示的费用'],['Pay · Return and check status','支付 · 返回检查状态']]};
 const Icon=CreditCard;
 return <><div className="platform-operation-diagram"><div className="platform-diagram-heading"><Icon size={26}/><strong>{t(lang,'Operation map','操作位置示意')}</strong></div><ol>{panels[step.kind].map(([en,zh],i)=><li key={en}><b>{i+1}</b><span>{t(lang,en,zh)}</span><Check size={17}/></li>)}</ol></div><figcaption>{t(lang,'Operation map, not a personal account screenshot. Complete these actions in your USFans account; the fields and available options may vary.','操作顺序示意，并非个人账户截图。请在 USFans 账户中完成操作，字段与可用选项可能不同。')}</figcaption></>;
}
