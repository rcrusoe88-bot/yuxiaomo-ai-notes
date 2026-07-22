import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { categories, getAllNotes, getNoteBySlug } from '../../../lib/notes';

export function generateStaticParams() { return getAllNotes().map(note => ({ slug: note.slug })); }

export async function generateMetadata({ params }) { const { slug } = await params; const note = getNoteBySlug(slug); return { title: note ? `${note.title} | 余小莫的 AI 笔记` : '文章不存在' }; }

const Callout = ({ children }) => <aside className="callout">{children}</aside>;

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return <main className="archive"><h1>文章不存在</h1></main>;
  const { content } = await compileMDX({ source: note.source, options: { parseFrontmatter: true, mdxOptions: { remarkPlugins: [remarkGfm] } }, components: { Callout } });
  return <main className="article-page"><Link className="back-link" href={`/notes/${note.category}`}>← 回到笔记列表</Link><p className="article-meta">{categories[note.category].name.toUpperCase()} / {note.date} / {note.readingTime} MIN READ</p><h1>{note.title}</h1><p className="article-lede">{note.summary}</p><article className="prose">{content}</article></main>;
}
