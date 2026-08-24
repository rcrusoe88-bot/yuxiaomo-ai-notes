import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// 作品与产品统一内容模型。目录：content/projects、content/products。
// 每个 MDX 的 front matter：
//   title       展示标题
//   summary     卡片一句话
//   description 详情页长描述（可留空，正文作为补充）
//   repo        GitHub 仓库 full name，如 rcrusoe88-bot/wechat-article-html
//   status      状态文案：已完成 / 开发中 / 建设中…
//   tags        标签数组
//   index       序号，如 01
//   tone        主题色：coral / blue / lime / yellow
//   year        年份
const roots = {
  projects: path.join(process.cwd(), 'content', 'projects'),
  products: path.join(process.cwd(), 'content', 'products')
};

const readItem = (kind, fileName) => {
  const source = fs.readFileSync(path.join(roots[kind], fileName), 'utf8');
  const { data, content } = matter(source);
  return {
    kind,
    slug: fileName.replace(/\.mdx$/, ''),
    title: data.title,
    summary: data.summary,
    description: data.description || '',
    repo: data.repo || '',
    status: data.status || '',
    tags: data.tags || [],
    index: data.index || '',
    tone: data.tone || 'coral',
    year: data.year || '',
    source
  };
};

export const getAll = kind => {
  const root = roots[kind];
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root)
    .filter(file => file.endsWith('.mdx'))
    .map(file => readItem(kind, file))
    .sort((a, b) => (a.index || '99').localeCompare(b.index || '99'));
};

export const getBySlug = (kind, slug) => getAll(kind).find(item => item.slug === slug);

export const getAllProjects = () => getAll('projects');
export const getProjectBySlug = slug => getBySlug('projects', slug);
export const getAllProducts = () => getAll('products');
export const getProductBySlug = slug => getBySlug('products', slug);
