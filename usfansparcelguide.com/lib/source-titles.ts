import { t, type Lang } from './content';
const chinese:Record<string,string>={
 'What Is the Shopping Agent Service?':'什么是代购服务？',
 'How to Do My Shopping?':'如何开始购物？',
 'Do You Help Me with Quality Checks?':'是否提供质量检查？',
 'How to check logistics information after the package was sent out?':'包裹发出后如何查看物流？',
 'Inspection Scopes of USFans Shopping Agent Service':'USFans 代购服务的质检范围',
 'USFans Detailed Photo':'USFans 详细照片服务',
 'Shipping Fee Estimation':'运费预估',
 'Actual Weight and Volumetric Weight':'实重与体积重量',
 'Estimated Billing Weight and Actual Billing Weight':'预估计费重量与实际计费重量',
 'Why should I combine delivery?':'为什么要合并运输？',
 'How Does the Shopping Agent Service Charge?':'代购服务如何收费？',
 'How long can the goods be stored in the USFans warehouse?':'商品能在 USFans 仓库保存多久？',
 "Why hasn't the tracking been updated since the parcel was shipped?":'包裹发出后为什么物流没有更新？'
};
export const sourceTitle=(title:string,lang:Lang)=>t(lang,title,chinese[title]||title);
