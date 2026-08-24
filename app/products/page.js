import Link from 'next/link';
import { getAllProducts } from '../../lib/showcase';
import ShowcaseCard from '../../components/ShowcaseCard';
import SiteHeader from '../../components/SiteHeader';

export default function ProductsIndexPage() {
  const products = getAllProducts();
  return <main className="archive">
    <SiteHeader />
    <Link className="back-link" href="/#products">← 回到首页</Link>
    <p className="eyebrow"><span />PRODUCTS</p>
    <h1>产品</h1>
    <p className="archive-intro">用 AI 亲手做出来的东西，从物料管理 ERP 开始。正在建设中。</p>
    <div className="showcase-stack">{products.map(item => <ShowcaseCard key={item.slug} item={item} />)}</div>
  </main>;
}
