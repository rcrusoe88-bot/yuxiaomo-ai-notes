import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getAllProjects, getProjectBySlug } from '../../../lib/showcase';
import SiteHeader from '../../../components/SiteHeader';

export function generateStaticParams() { return getAllProjects().map(item => ({ slug: item.slug })); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = getProjectBySlug(slug);
  return { title: item ? item.title : '作品不存在' };
}

const Callout = ({ children }) => <aside className="callout">{children}</aside>;

export default async function WorkPage({ params }) {
  const { slug } = await params;
  const item = getProjectBySlug(slug);
  if (!item) return <main className="archive"><h1>作品不存在</h1></main>;
  const { content } = await compileMDX({ source: item.source, options: { parseFrontmatter: true, mdxOptions: { remarkPlugins: [remarkGfm] } }, components: { Callout } });
  return <main className="article-page project-page">
    <SiteHeader />
    <Link className="back-link" href="/#work">← 回到作品</Link>
    <p className="article-meta">WORK / {item.index} / {item.year} / {item.status.toUpperCase()}</p>
    <h1>{item.title}</h1>
    <p className="article-lede">{item.summary}</p>
    <article className="prose">{content}</article>
    {item.repo ? <a className="repo-link" href={`https://github.com/${item.repo}`} target="_blank" rel="noreferrer">查看源码 ↗</a> : null}
  </main>;
}
