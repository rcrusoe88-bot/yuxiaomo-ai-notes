import Link from 'next/link';
import { categories, getNotesByCategory } from '../../../lib/notes';
import SiteHeader from '../../../components/SiteHeader';

export function generateStaticParams() { return Object.keys(categories).map(category => ({ category })); }

export async function generateMetadata({ params }) {
  const { category } = await params;
  const categoryMeta = categories[category];
  return { title: categoryMeta ? `${categoryMeta.name} 笔记` : '笔记' };
}

export default async function CategoryPage({ params }) {
  const { category: categorySlug } = await params;
  const category = categories[categorySlug];
  const notes = getNotesByCategory(categorySlug);
  return <main className="archive"><SiteHeader showNav={false} /><Link className="back-link" href="/#notes">← 回到笔记</Link><p className="eyebrow"><span />{category.label}</p><h1>{category.name} 笔记</h1><p className="archive-intro">{category.description}</p><div className="article-list">{notes.map((note, index) => <Link href={`/article/${note.category}/${note.slug}`} key={`${note.category}-${note.slug}`}><small>{String(index + 1).padStart(2, '0')} / {note.date} / {note.readingTime} MIN</small><strong>{note.title}</strong><p>{note.summary}</p><i>↗</i></Link>)}</div></main>;
}
