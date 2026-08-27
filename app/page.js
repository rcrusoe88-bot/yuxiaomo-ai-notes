import Link from 'next/link';
import { categories, getAllNotes } from '../lib/notes';
import { getAllProjects, getAllProducts } from '../lib/showcase';
import { site, withBase } from '../lib/site';
import SiteHeader from '../components/SiteHeader';
import ShowcaseCard from '../components/ShowcaseCard';
import Particles from '../components/Particles';
import ParticleText from '../components/ParticleText/ParticleText';
import TextType from '../components/TextType/TextType';
import CursorGrid from '../components/CursorGrid/CursorGrid';
import FolderGroup from '../components/FolderGroup/FolderGroup';

const heroLines = [
  '生物制药工艺开发 · 公众号「信使引擎」主理人 · 把 工艺 连成闭环。',
  '生物制药工艺开发 · 公众号「信使引擎」主理人 · 把 内容 连成闭环。',
  '生物制药工艺开发 · 公众号「信使引擎」主理人 · 把 系统 连成闭环。',
  '生物制药工艺开发 · 公众号「信使引擎」主理人 · 把 创作 连成闭环。'
];

// 每个文件夹右侧插图。图片来自桌面「卡片」文件夹，1-10 按主题语义映射：
// 作品 5 张 + 产品 1 张 + 笔记分类 4 张，恰好一一对应。
const showcaseImages = {
  'wechat-article-html': '/cards/6.png',
  'wechat-cover-design': '/cards/3.png',
  'wechat-title-summary': '/cards/2.png',
  'mrna-cmc-web-search': '/cards/4.png',
  'ppt-requirements-discovery': '/cards/9.png',
  'wsj-erp-system': '/cards/1.png'
};

const noteImages = {
  codex: '/cards/7.png',
  claude: '/cards/8.png',
  reasonix: '/cards/10.png',
  workbuddy: '/cards/5.png'
};

const paperBadge = text => <span className="folder-paper-badge">{text}</span>;

export default function HomePage() {
  const notes = getAllNotes();
  const projects = getAllProjects();
  const products = getAllProducts();

  const projectPapers = projects.slice(0, 3).map(p => paperBadge(p.index));
  const productPapers = products.slice(0, 3).map(p => paperBadge(p.index));
  const notePapers = Object.entries(categories).slice(0, 3).map(([slug, category]) =>
    paperBadge(category.name === 'Codex' ? 'C>' : category.name === 'Claude' ? '✦' : 'R/')
  );

  return <main>
    <SiteHeader />
    <section className="hero">
    <Particles className="hero-particles" />
    <div className="hero-grid" />
    <CursorGrid
      className="hero-cursor-grid"
      cellSize={70}
      color="#A35C8F"
      radius={170}
      falloff="smooth"
      holdTime={420}
      fadeDuration={900}
      lineWidth={1.4}
      maxOpacity={0.95}
      fillOpacity={0.12}
      gridOpacity={0.05}
      cellRadius={4}
      clickPulse
      pulseSpeed={560}
    />
    <div className="hero-content">
      <p className="eyebrow"><span />REALITY ENGINE / AI BUILDER / 2026</p>
      <h1 className="sr-only">余小莫的AI笔记</h1>
      <ParticleText
        className="hero-particle-title"
        text="余小莫的AI笔记"
        particleSize={2.6}
        density={5}
        color="#1a1c1a"
        highlightColor="#e55c45"
        scatter={200}
        gatherDuration={1800}
        stagger={260}
        pointerRepel={55}
        repelRadius={160}
        idleDrift={0.8}
       trigger="hover"
        fontSize="clamp(44px, 11vw, 150px)"
       fontWeight={900}
        glow
      />
      <TextType
        as="p"
        className="hero-sentence"
        text={heroLines}
        typingSpeed={72}
        deletingSpeed={26}
        pauseDuration={1600}
        showCursor
        cursorCharacter="|"
        startOnVisible
        loop
      />
      <a className="scroll-link" href="#work">看看我在做什么 ↘</a>
    </div>
    <p className="hero-caption"><span>01</span>用 AI Skill 打通公众号创作，用代码造物料 ERP。</p>
  </section>
  <section className="intro-strip">这里没有标准答案，只有正在发生的工作。</section>

    <section className="showcase-section" id="work">
      <div className="section-heading"><div><p className="eyebrow"><span />FROM IDEAS TO REAL TOOLS</p><h2>我的作品</h2></div></div>
      <div className="folder-group-list">
        <FolderGroup
          color="#e55c45"
          index="01"
          title="我的作品"
          note="公众号创作链路与工艺研究 Skill，把想法做成能直接落地的工具。"
          meta="共 5 项"
          papers={projectPapers}
        >
          {projects.map(item => <ShowcaseCard key={item.slug} item={item} image={withBase(showcaseImages[item.slug] || '/cards/1.png')} />)}
        </FolderGroup>
      </div>
    </section>

    <section className="showcase-section" id="products">
      <div className="section-heading"><div><p className="eyebrow"><span />BUILDING IN PUBLIC</p><h2>我的产品</h2></div></div>
      <div className="folder-group-list">
        <FolderGroup
          color="#71afe0"
          index="02"
          title="我的产品"
          note="正在用 AI 亲手搭建的物料管理 ERP，持续在真实环境里打磨。"
          meta="共 1 项"
          papers={productPapers}
        >
          {products.map(item => <ShowcaseCard key={item.slug} item={item} image={withBase(showcaseImages[item.slug] || '/cards/1.png')} />)}
        </FolderGroup>
      </div>
      <p className="showcase-note">更多产品正在建设中，会持续在这里更新。</p>
    </section>

    <section className="notes-section" id="notes">
      <div className="section-heading"><div><p className="eyebrow"><span />NOTES BY TOOL</p><h2>我的笔记</h2></div></div>
      <div className="folder-group-list">
        <FolderGroup
          color="#d8fa48"
          index="03"
          title="我的笔记"
          note="按 AI 工具整理的创作与思考记录，从方法到真实落地的过程。"
          meta="共 4 个分类"
          papers={notePapers}
        >
          {Object.entries(categories).map(([slug, category]) => (
            <Link className={`category-card ${category.tone}`} href={`/notes/${slug}`}>
              <div className="category-card__main">
                <div className="app-icon">{category.name === 'Codex' ? 'C>' : category.name === 'Claude' ? '✦' : category.name === 'Reasonix' ? 'R/' : 'W.'}</div>
                <div className="category-copy"><p>{category.index} / {category.label}</p><h3>{category.name}</h3><span>{category.description}</span></div>
                <i>↗</i>
              </div>
              <div className="category-card__media"><img src={withBase(noteImages[slug] || '/cards/7.png')} alt={`${category.name} 笔记封面`} loading="lazy" /></div>
            </Link>
          ))}
        </FolderGroup>
      </div>
    </section>

    <section className="recent-section">
      <div className="section-heading"><div><p className="eyebrow"><span />RECENTLY PUBLISHED</p><h2>最近更新</h2></div></div>
      <div className="recent-list">{notes.slice(0, 4).map(note => <Link href={`/article/${note.category}/${note.slug}`} key={`${note.category}-${note.slug}`}><small>{note.date} / {categories[note.category].name}</small><strong>{note.title}</strong><i>↗</i></Link>)}</div>
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
