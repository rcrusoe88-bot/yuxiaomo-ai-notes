import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';

export default function NotFound() {
  return <main className="archive">
    <SiteHeader />
    <p className="eyebrow"><span />404 / NOT FOUND</p>
    <h1>这一页，<br />还没被造出来。</h1>
    <p className="archive-intro">你访问的内容不存在，或还在建设中。回到首页，看看我已经做实的东西。</p>
    <Link className="scroll-link" href="/">回到首页 ↘</Link>
  </main>;
}
