import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { guides } from "../site-data";

export const metadata = {
  title: "USFans Buyer Guides",
  description: "Practical USFans spreadsheet, QC inspection and international shipping guides for cross-border buyers.",
};

export default function GuidesPage() {
  return <main className="guide-index">
    <header className="article-top"><Link href="/" className="brand brand-on-dark"><img className="brand-logo" src="/usfans-logo.png" alt="USFans"/><span className="vip">VIP</span></Link><Link href="/" className="back-link"><ArrowLeft size={16}/> Back to directory</Link></header>
    <section className="guide-index-hero"><p>USFANSVIP / BUYER LIBRARY</p><h1>Guides for the decisions between “found it” and “shipped it.”</h1><span>Independent, practical explanations for product verification, warehouse QC and international shipping planning.</span></section>
    <section className="guide-index-list">{guides.map((g,i)=><Link href={`/guides/${g.slug}`} className="guide-row" key={g.slug}><b>0{i+1}</b><div><p>{g.tag} · {g.updated}</p><h2>{g.title}</h2><span>{g.excerpt}</span></div><ArrowRight/></Link>)}</section>
    <footer className="article-footer"><p>Independent buyer education. Always verify live prices, options and service terms on the destination page.</p><Link href="/">USFansVIP.store</Link></footer>
  </main>;
}
