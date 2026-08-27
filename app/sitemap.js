export const dynamic = 'force-static';

import { getAllProjects, getAllProducts } from '../lib/showcase';
import { categories, getAllNotes } from '../lib/notes';
import { absoluteUrl } from '../lib/site';

export default function sitemap() {
  // 列表页不写 lastModified：写构建日期会让搜索引擎误判全站每日更新。
  // 首页取最新文章日期，详情页用各自的真实日期。
  const notes = getAllNotes();
  const latestNoteDate = notes[0]?.date;
  const work = getAllProjects().map(item => ({ url: absoluteUrl(`/work/${item.slug}`), changeFrequency: 'monthly', priority: 0.7 }));
  const products = getAllProducts().map(item => ({ url: absoluteUrl(`/products/${item.slug}`), changeFrequency: 'monthly', priority: 0.7 }));
  const noteCategories = Object.keys(categories).map(category => ({ url: absoluteUrl(`/notes/${category}`), changeFrequency: 'monthly', priority: 0.6 }));
  const noteUrls = notes.map(item => ({ url: absoluteUrl(`/article/${item.category}/${item.slug}`), lastModified: item.date, changeFrequency: 'monthly', priority: 0.6 }));

  return [
    { url: absoluteUrl('/'), lastModified: latestNoteDate, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/work'), changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/products'), changeFrequency: 'monthly', priority: 0.8 },
    ...work,
    ...products,
    ...noteCategories,
    ...noteUrls
  ];
}
