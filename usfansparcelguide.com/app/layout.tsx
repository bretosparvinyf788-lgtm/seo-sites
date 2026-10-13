import type { Metadata } from 'next';
import { language, isLang, isRTL } from '@/lib/locales';
import './globals.css';
export const metadata:Metadata={title:'USFans Spreadsheet — Finds, Photos & Buying Guides',description:'Browse USFans finds by category, compare reference photos and save your shortlist. An independent product-discovery catalog.',robots:{index:true,follow:true},icons:{icon:'/favicon.png',shortcut:'/favicon.png'}};
export default async function RootLayout({children,params}:{children:React.ReactNode;params:Promise<{slug?:string[]}>}){
 const first=(await params)?.slug?.[0];const lang=first&&isLang(first)?first:'en';
 return <html lang={language(lang).locale} dir={isRTL(lang)?'rtl':'ltr'}><body className="antialiased">{children}</body></html>;
}
