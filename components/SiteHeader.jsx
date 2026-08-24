'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GooeyNav from './GooeyNav';
import { navItems, navIndexForPath } from '../lib/site';

export default function SiteHeader() {
  const pathname = usePathname();
  const activeIndex = navIndexForPath(pathname);
  return <header className="site-header">
    <Link className="brand" href="/"><span className="brand-dot" />余小莫 <i>REALITY ENGINE</i></Link>
    <GooeyNav items={navItems} initialActiveIndex={activeIndex} />
  </header>;
}
