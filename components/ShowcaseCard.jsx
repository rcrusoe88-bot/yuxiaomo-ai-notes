import Link from 'next/link';

// 作品与产品共用卡片。item 来自 lib/showcase.js。
export default function ShowcaseCard({ item }) {
  const base = item.kind === 'products' ? '/products' : '/work';
  return <Link className={`showcase-card ${item.tone}`} href={`${base}/${item.slug}`}>
    <div className="showcase-meta"><span>{item.index}</span><small>{item.status}</small></div>
    <h3>{item.title}</h3>
    <p>{item.summary}</p>
    <div className="showcase-foot"><span>{item.tags.slice(0, 3).join(' · ')}</span><i>↗</i></div>
  </Link>;
}
