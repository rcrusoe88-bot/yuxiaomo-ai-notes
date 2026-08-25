export const dynamic = 'force-static';

import { getAllProjects, getAllProducts } from '../lib/showcase';
import { categories, getAllNotes } from '../lib/notes';
import { absoluteUrl } from '../lib/site';

export default function sitemap() {
  const now = new Date().toISOString().slice(0, 10);
  const work = getAllProjects().map(item => ({ url: absoluteUrl(`/work/${item.slug}`), lastModified: now, changeFrequency: 'monthly', priority: 0.7 }));
  const products = getAllProducts().map(item => ({ url: absoluteUrl(`/products/${item.slug}`), lastModified: now, changeFrequency: 'monthly', priority: 0.7 }));
  const noteCategories = Object.keys(categories).map(category => ({ url: absoluteUrl(`/notes/${category}`), lastModified: now, changeFrequency: 'monthly', priority: 0.6 }));
  const notes = getAllNotes().map(item => ({ url: absoluteUrl(`/article/${item.category}/${item.slug}`), lastModified: item.date, changeFrequency: 'monthly', priority: 0.6 }));

  return [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/work'), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/products'), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...work,
    ...products,
    ...noteCategories,
    ...notes
  ];
}
