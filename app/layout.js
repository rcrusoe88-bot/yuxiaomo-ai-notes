import './globals.css';
import './hero-enhancements.css';

export const metadata = {
  title: '余小莫 · 让 AI 落地',
  description: '生物制药工艺开发工程师。公众号「现实引擎」主理人，用 AI Skill 打通公众号创作闭环，用代码搭建物料管理 ERP。'
};

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body suppressHydrationWarning>{children}</body></html>;
}
