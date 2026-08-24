export const dynamic = 'force-static';

export default function manifest() {
  const base = process.env.GH_PAGES === '1' ? '/yuxiaomo-ai-notes' : '';
  return {
    name: '余小莫 · 让 AI 落地',
    short_name: '余小莫',
    description: '生物制药工艺开发工程师。公众号「信使引擎」主理人，用 AI Skill 打通公众号创作闭环，用代码搭建物料管理 ERP。',
    start_url: `${base}/`,
    scope: `${base}/`,
    display: 'standalone',
    background_color: '#f5f2e9',
    theme_color: '#f5f2e9',
    icons: [{ src: `${base}/icon.svg`, sizes: 'any', type: 'image/svg+xml' }]
  };
}
