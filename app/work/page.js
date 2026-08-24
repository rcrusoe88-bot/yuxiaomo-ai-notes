import Link from 'next/link';
import { getAllProjects } from '../../lib/showcase';
import ShowcaseCard from '../../components/ShowcaseCard';
import SiteHeader from '../../components/SiteHeader';

export default function WorkIndexPage() {
  const projects = getAllProjects();
  return <main className="archive">
    <SiteHeader />
    <Link className="back-link" href="/#work">← 回到首页</Link>
    <p className="eyebrow"><span />WORK</p>
    <h1>作品</h1>
    <p className="archive-intro">围绕「现实引擎」公众号创作链路，用 AI Agent Skill 打通的每一环。</p>
    <div className="showcase-stack">{projects.map(item => <ShowcaseCard key={item.slug} item={item} />)}</div>
  </main>;
}
