import Link from 'next/link';
import { categories, getNotesByCategory } from '../../../lib/notes';

export function generateStaticParams() { return Object.keys(categories).map(category => ({ category })); }

export default async function CategoryPage({ params }) {
  const { category: categorySlug } = await params;
  const category = categories[categorySlug];
  const notes = getNotesByCategory(categorySlug);
  return <main className="archive"><Link className="back-link" href="/">← 返回首页</Link><p className="eyebrow"><span />{category.label}</p><h1>{category.name} 笔记</h1><p className="archive-intro">{category.description}</p><div className="article-list">{notes.map((note, index) => <Link href={`/article/${note.slug}`} key={note.slug}><small>{String(index + 1).padStart(2, '0')} / {note.date} / {note.readingTime} MIN</small><strong>{note.title}</strong><p>{note.summary}</p><i>↗</i></Link>)}</div></main>;
}
