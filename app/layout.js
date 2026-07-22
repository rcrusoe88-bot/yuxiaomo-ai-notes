import './globals.css';
import './hero-enhancements.css';

export const metadata = {
  title: '余小莫的 AI 笔记',
  description: '记录思考、实验、作品与灵感。'
};

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body suppressHydrationWarning>{children}</body></html>;
}
