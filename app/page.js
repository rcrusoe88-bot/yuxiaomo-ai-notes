import Link from 'next/link';
import { categories, getAllNotes } from '../lib/notes';
import GooeyNav from '../components/GooeyNav';
import Particles from '../components/Particles';
import RotatingWord from '../components/RotatingWord';

export default function HomePage() {
  const notes = getAllNotes();
  return <main>
    <header className="site-header"><Link className="brand" href="/"><span className="brand-dot" />余小莫 <i>AI NOTES</i></Link><GooeyNav items={[{ label: '首页', href: '/' }, { label: '笔记', href: '#notes' }, { label: '关于我', href: '#about' }]} /></header>
    <section className="hero"><Particles className="hero-particles" /><div className="hero-grid" /><div className="hero-content"><p className="eyebrow"><span />PERSONAL FIELD NOTES / 2026</p><h1><span className="hero-title-script">余小莫的</span><br /><em>AI 笔记</em></h1><p className="hero-sentence">持续记录 <RotatingWord /> 与 AI 共创的每一刻。</p><a className="scroll-link" href="#notes">向下翻阅 ↘</a></div><p className="hero-caption"><span>01</span>一种更诚实的学习方法：边做，边留下痕迹。</p></section>
    <section className="intro-strip">这里没有标准答案，只有正在发生的工作。</section>
    <section className="notes-section" id="notes"><div className="section-heading"><div><p className="eyebrow"><span />NOTES BY TOOL</p><h2>我的笔记</h2></div></div><div className="notes-stack">{Object.entries(categories).map(([slug, category]) => <Link className={`category-card ${category.tone}`} href={`/notes/${slug}`} key={slug}><div className="app-icon">{category.name === 'Codex' ? 'C>' : category.name === 'Claude' ? '✦' : category.name === 'Reasonix' ? 'R/' : 'W.'}</div><div className="category-copy"><p>{category.index} / {category.label}</p><h3>{category.name}</h3><span>{category.description}</span></div><i>↗</i></Link>)}</div></section>
    <section className="recent-section"><div className="section-heading"><div><p className="eyebrow"><span />RECENTLY PUBLISHED</p><h2>最近更新</h2></div></div><div className="recent-list">{notes.slice(0, 4).map(note => <Link href={`/article/${note.slug}`} key={note.slug}><small>{note.date} / {categories[note.category].name}</small><strong>{note.title}</strong><i>↗</i></Link>)}</div></section>
    <section className="about-section" id="about"><p className="eyebrow"><span />A LITTLE ABOUT ME</p><h2>我相信，<br />好奇心是最好的<br /><em>提示词。</em></h2><p>我是余小莫，关注 AI 如何进入真实的创作和工作。这里会分享那些让我停下来反复琢磨的工具、方法与作品。</p></section>
    <footer>余小莫的 AI 笔记 <span>© 2026</span></footer>
  </main>;
}
