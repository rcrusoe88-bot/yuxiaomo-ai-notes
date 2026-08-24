import './globals.css';
import './hero-enhancements.css';
import { site } from '../lib/site';

export const metadata = {
  metadataBase: new URL(site.website),
  title: {
    default: '余小莫 · 让 AI 落地',
    template: '%s · 余小莫'
  },
  description: '生物制药工艺开发工程师。公众号「现实引擎」主理人，用 AI Skill 打通公众号创作闭环，用代码搭建物料管理 ERP。',
  keywords: ['余小莫', 'AI Agent', 'AI Skill', '公众号创作', '公众号', '现实引擎', '生物制药', '工艺开发', 'mRNA', 'LNP', '物料管理', 'ERP', 'Codex'],
  alternates: { canonical: site.website },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: '余小莫 · 让 AI 落地',
    title: '余小莫 · 让 AI 落地',
    description: '生物制药工艺开发工程师。公众号「现实引擎」主理人，用 AI Skill 打通公众号创作闭环，用代码搭建物料管理 ERP。',
    url: site.website
  },
  twitter: {
    card: 'summary',
    title: '余小莫 · 让 AI 落地',
    description: '生物制药工艺开发工程师。公众号「现实引擎」主理人，用 AI Skill 打通公众号创作闭环，用代码搭建物料管理 ERP。'
  },
  robots: { index: true, follow: true },
  applicationName: '余小莫 · 让 AI 落地',
  appleWebApp: { title: '余小莫 · 让 AI 落地', capable: true, statusBarStyle: 'default' }
};

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body suppressHydrationWarning>{children}</body></html>;
}
