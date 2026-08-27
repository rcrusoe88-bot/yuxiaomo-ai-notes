import localFont from 'next/font/local';
import './globals.css';
import './hero-enhancements.css';
import { site, absoluteFileUrl } from '../lib/site';
import ClickSpark from '../components/ClickSpark/ClickSpark';
import WaterWakeCursor from '../components/WaterWakeCursor/WaterWakeCursor';

export const metadata = {
  metadataBase: new URL(site.website),
  title: {
    default: '余小莫的AI笔记',
    template: '%s · 余小莫的AI笔记'
  },
  description: '生物制药工艺开发工程师。公众号「信使引擎」主理人，用 AI Skill 打通公众号创作闭环，用代码搭建物料管理 ERP。',
  keywords: ['余小莫', 'AI Agent', 'AI Skill', '公众号创作', '公众号', '信使引擎', '生物制药', '工艺开发', 'mRNA', 'LNP', '物料管理', 'ERP', 'Codex'],
  alternates: { canonical: site.website },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: '余小莫的AI笔记',
    title: '余小莫的AI笔记',
    description: '生物制药工艺开发工程师。公众号「信使引擎」主理人，用 AI Skill 打通公众号创作闭环，用代码搭建物料管理 ERP。',
    url: site.website,
    images: [{ url: absoluteFileUrl('/og.png'), width: 1200, height: 630, alt: '余小莫的AI笔记' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: '余小莫的AI笔记',
    description: '生物制药工艺开发工程师。公众号「信使引擎」主理人，用 AI Skill 打通公众号创作闭环，用代码搭建物料管理 ERP。',
    images: [absoluteFileUrl('/og.png')]
  },
  robots: { index: true, follow: true },
  applicationName: '余小莫的AI笔记',
  appleWebApp: { title: '余小莫的AI笔记', capable: true, statusBarStyle: 'default' }
};

const zhengkai = localFont({
  src: './fonts/Hanchan-Zhengkai-Big5.ttf',
  weight: '400',
  variable: '--font-zhengkai',
  display: 'swap'
});

const pretesto = localFont({
  src: './fonts/PreTesto-Italic.ttf',
  weight: '200 700',
  variable: '--font-pretesto',
  display: 'swap'
});

export default function RootLayout({ children }) {
  return <html lang="zh-CN" className={`${pretesto.variable} ${zhengkai.variable}`}><body suppressHydrationWarning><ClickSpark sparkColor="#A35C8F" sparkSize={18} sparkRadius={34} sparkCount={12} duration={520} extraScale={1.05}><WaterWakeCursor />{children}</ClickSpark></body></html>;
}
