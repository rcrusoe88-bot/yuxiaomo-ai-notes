import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { categories, getAllNotes, getNoteByCategorySlug } from '../../../../lib/notes';
import { withBasePaths } from '../../../../lib/site';

export function generateStaticParams() { return getAllNotes().map(note => ({ category: note.category, slug: note.slug })); }

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const note = getNoteByCategorySlug(category, slug);
  if (!note) return { title: '文章不存在' };
  return {
    title: note.title,
    description: note.summary,
    openGraph: { title: note.title, description: note.summary, type: 'article' }
  };
}

const Callout = ({ children }) => <aside className="callout">{children}</aside>;

export default async function ArticlePage({ params }) {
  const { category, slug } = await params;
  const note = getNoteByCategorySlug(category, slug);
  if (!note) return <main className="archive"><h1>文章不存在</h1></main>;
  const { content } = await compileMDX({ source: withBasePaths(note.source), options: { parseFrontmatter: true, mdxOptions: { remarkPlugins: [remarkGfm] } }, components: { Callout } });
  return <main className="article-page"><Link className="back-link" href={`/notes/${note.category}`}>← 回到笔记列表</Link><p className="article-meta">{categories[note.category].name.toUpperCase()} / {note.date} / {note.readingTime} MIN READ</p><h1>{note.title}</h1><p className="article-lede">{note.summary}</p><article className="prose">{content}</article></main>;
}
