import Hub from './hub';
export const metadata={alternates:{canonical:"https://cssbuyfindshub.com/"}};
export default function Page(){return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"WebSite",name:"CSSBuy Finds Hub",url:"https://cssbuyfindshub.com",description:"Independent CSSBuy spreadsheet, product finds and QC guides"})}}/><Hub mode="home"/></>}
