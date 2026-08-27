// 全站共享的导航 / 身份 / 联系信息。改这里即可全局生效。
export const navItems = [
  { label: '首页', href: '/', index: 0 },
  { label: '作品', href: '/#work', index: 1 },
  { label: '产品', href: '/#products', index: 2 },
  { label: '笔记', href: '/#notes', index: 3 },
  { label: '关于', href: '/#about', index: 4 }
];

// 依据当前页面路径计算导航高亮项（0 = 首页）。
export const navIndexForPath = (path = '/') => {
  if (path.startsWith('/work')) return 1;
  if (path.startsWith('/products')) return 2;
  if (path.startsWith('/notes') || path.startsWith('/article')) return 3;
  if (path.startsWith('/about')) return 4;
  return 0;
};

export const site = {
  author: '余小莫',
  brand: { zh: '余小莫', en: 'REALITY ENGINE' },
  role: '生物制药工艺开发工程师',
  tagline: '用 AI 把真实的工艺、内容与系统做成闭环。',
  email: 'rcrusoe88@gmail.com',
  github: 'https://github.com/rcrusoe88-bot/yuxiaomo-ai-notes',
  wechat: {
    name: '信使引擎',
    url: 'https://mp.weixin.qq.com/cgi-bin/home?t=home/index&token=389300524&lang=zh_CN#tab=sent-panel'
  },
  website: 'https://rcrusoe88-bot.github.io/yuxiaomo-ai-notes/'
};

export const projectsIndex = '01'; // 作品区编号
export const productsIndex = '02'; // 产品区编号

// GitHub Pages basePath 决策（与 next.config.mjs 保持一致）
const pageBase = () => (process.env.GH_PAGES === '1' ? '/yuxiaomo-ai-notes' : '');

// 返回带 basePath 前缀的根相对路径，例如 /og.png → /yuxiaomo-ai-notes/og.png。
// 用于 public/ 静态资源在 GitHub Pages 子路径下统一引用，避免 404。
export const withBase = (route = '/') => {
  const base = pageBase();
  const path = route.startsWith('/') ? route : `/${route}`;
  return base ? `${base}${path}` : path;
};

// 生成绝对 URL：路由相对路径 → 线上完整地址（带 basePath，统一尾斜杠）
export const absoluteUrl = (route = '/') => {
  const base = `https://rcrusoe88-bot.github.io${pageBase()}`;
  let path = route.startsWith('/') ? route : `/${route}`;
  if (path !== '/') path = path.replace(/\/+$/, '') + '/';
  return `${base}${path}`;
};

// 生成绝对文件 URL（如 sitemap.xml / og.png），不加尾斜杠
export const absoluteFileUrl = (route = '/') => {
  const base = `https://rcrusoe88-bot.github.io${pageBase()}`;
  const path = route.startsWith('/') ? route : `/${route}`;
  return `${base}${path}`;
};
