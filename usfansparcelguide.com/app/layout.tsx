import type { Metadata } from 'next';
import { language, isLang, isRTL } from '@/lib/locales';
import './globals.css';
export const metadata:Metadata={title:'USFans Spreadsheet — Finds, Photos & Buying Guides',description:'Browse USFans finds by category, compare reference photos and save your shortlist. An independent product-discovery catalog.',robots:{index:true,follow:true},icons:{icon:'/favicon.png',shortcut:'/favicon.png'}};
export default async function RootLayout({children,params}:{children:React.ReactNode;params:Promise<{slug?:string[]}>}){
 const first=(await params)?.slug?.[0];const lang=first&&isLang(first)?first:'en';
 return <html lang={language(lang).locale} dir={isRTL(lang)?'rtl':'ltr'}><head><script async src="https://www.googletagmanager.com/gtag/js?id=G-SKZ3SM2V0G"/><script dangerouslySetInnerHTML={{__html:"window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-SKZ3SM2V0G');"}}/></head><body className="antialiased">{children}</body></html>;
}
