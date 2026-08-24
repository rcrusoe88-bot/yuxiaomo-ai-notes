import Link from 'next/link';
import { categories, getAllNotes } from '../lib/notes';
import { getAllProjects, getAllProducts } from '../lib/showcase';
import { site } from '../lib/site';
import SiteHeader from '../components/SiteHeader';
import ShowcaseCard from '../components/ShowcaseCard';
import Particles from '../components/Particles';
import RotatingWord from '../components/RotatingWord';

export default function HomePage() {
  const notes = getAllNotes();
  const projects = getAllProjects();
  const products = getAllProducts();
  return <main>
    <SiteHeader />
    <section className="hero">
      <Particles className="hero-particles" />
      <div className="hero-grid" />
      <div className="hero-content">
        <p className="eyebrow"><span />REALITY ENGINE / AI BUILDER / 2026</p>
        <h1><span className="hero-title-script">我是余小莫</span><br /><em>让 AI 落地</em></h1>
        <p className="hero-sentence">生物制药工艺开发 · 公众号「信使引擎」主理人 · 把 <RotatingWord /> 连成闭环。</p>
        <a className="scroll-link" href="#work">看看我在做什么 ↘</a>
      </div>
      <p className="hero-caption"><span>01</span>用 AI Skill 打通公众号创作，用代码造物料 ERP。</p>
    </section>
    <section className="intro-strip">这里没有标准答案，只有正在发生的工作。</section>

    <section className="showcase-section" id="work">
      <div className="section-heading"><div><p className="eyebrow"><span />FROM IDEAS TO REAL TOOLS</p><h2>我的作品</h2></div></div>
      <div className="showcase-stack deck">{projects.map(item => <ShowcaseCard key={item.slug} item={item} />)}</div>
    </section>

    <section className="showcase-section" id="products">
      <div className="section-heading"><div><p className="eyebrow"><span />BUILDING IN PUBLIC</p><h2>我的产品</h2></div></div>
      <div className="showcase-stack">{products.map(item => <ShowcaseCard key={item.slug} item={item} />)}</div>
      <p className="showcase-note">更多产品正在建设中，会持续在这里更新。</p>
    </section>

    <section className="notes-section" id="notes">
      <div className="section-heading"><div><p className="eyebrow"><span />NOTES BY TOOL</p><h2>我的笔记</h2></div></div>
      <div className="notes-stack">{Object.entries(categories).map(([slug, category]) => <Link className={`category-card ${category.tone}`} href={`/notes/${slug}`} key={slug}><div className="app-icon">{category.name === 'Codex' ? 'C>' : category.name === 'Claude' ? '✦' : category.name === 'Reasonix' ? 'R/' : 'W.'}</div><div className="category-copy"><p>{category.index} / {category.label}</p><h3>{category.name}</h3><span>{category.description}</span></div><i>↗</i></Link>)}</div>
    </section>

    <section className="recent-section">
      <div className="section-heading"><div><p className="eyebrow"><span />RECENTLY PUBLISHED</p><h2>最近更新</h2></div></div>
      <div className="recent-list">{notes.slice(0, 4).map(note => <Link href={`/article/${note.slug}`} key={note.slug}><small>{note.date} / {categories[note.category].name}</small><strong>{note.title}</strong><i>↗</i></Link>)}</div>
    </section>

    <section className="about-section" id="about">
      <p className="eyebrow"><span />A LITTLE ABOUT ME</p>
      <h2>我相信，<br />把真实问题<br />交给 <em>AI</em> 拆解。</h2>
      <p>我是余小莫，一名生物制药工艺开发工程师。白天做 mRNA / LNP 工艺，业余用 AI Agent skill 把公众号「信使引擎」的创作流程做成闭环，也正用 AI 亲手搭建一套物料管理 ERP。这里记录我让 AI 落地的每一件真实作品。</p>
      <div className="contact-block">
        <a className="contact-item" href={site.github} target="_blank" rel="noreferrer"><small>GITHUB</small><strong>rcrusoe88-bot</strong><i>↗</i></a>
        <a className="contact-item" href={`mailto:${site.email}`}><small>EMAIL</small><strong>{site.email}</strong><i>↗</i></a>
        <a className="contact-item" href={site.wechat.url} target="_blank" rel="noreferrer"><small>WECHAT</small><strong>公众号 · 信使引擎</strong><i>↗</i></a>
      </div>
    </section>
    <footer>余小莫的个人站 <span>© 2026 · {site.tagline}</span></footer>
  </main>;
}
