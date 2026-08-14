import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { guides, mainSite } from "../../site-data";

export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.excerpt, alternates: { canonical: `/guides/${slug}` } };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();
  return <main className="article-page">
    <header className="article-top"><Link href="/" className="brand brand-on-dark"><img className="brand-logo" src="/usfans-logo.png" alt="USFans"/><span className="vip">VIP</span></Link><Link href="/guides" className="back-link"><ArrowLeft size={16}/> All buyer guides</Link></header>
    <article>
      <div className="article-hero"><p>{guide.tag} · {guide.updated} · {guide.readTime}</p><h1>{guide.title}</h1><span>{guide.excerpt}</span></div>
      <div className="article-layout"><aside><p>IN THIS GUIDE</p>{guide.sections.map((section,i)=><a href={`#section-${i+1}`} key={section.heading}><span>0{i+1}</span>{section.heading}</a>)}</aside><div className="article-copy">{guide.sections.map((section,i)=><section id={`section-${i+1}`} key={section.heading}><p className="section-number">0{i+1}</p><h2>{section.heading}</h2>{section.paragraphs.map((p,j)=><p key={j}>{p}</p>)}{section.bullets&&<ul>{section.bullets.map(item=><li key={item}><CheckCircle2 size={18}/><span>{item}</span></li>)}</ul>}</section>)}<div className="article-cta"><p>Continue with current product finds</p><h3>Use the guide while the live listing is open.</h3><a href={mainSite} target="_blank" rel="noreferrer">Open spreadsheet <ArrowRight size={17}/></a></div></div></div>
    </article>
    <footer className="article-footer"><p>This independent guide is educational and does not guarantee seller quality, authenticity, customs outcomes or delivery times.</p><Link href="/">USFansVIP.store</Link></footer>
  </main>;
}
