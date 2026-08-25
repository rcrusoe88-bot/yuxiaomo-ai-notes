'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import GooeyNav from './GooeyNav';
import { navItems, navIndexForPath } from '../lib/site';

const sectionMap = { work: 1, products: 2, notes: 3, about: 4 };
const sectionIds = Object.keys(sectionMap);

export default function SiteHeader({ showNav = true }) {
  const pathname = usePathname();
  const [scrollActive, setScrollActive] = useState(0);

  useEffect(() => {
    if (!showNav) return undefined;
    if (pathname !== '/') { setScrollActive(0); return undefined; }
    // 用滚动位置 + 触发线判断当前区块；回到顶部时重置为首页。
    const onScroll = () => {
      const trigger = window.scrollY + window.innerHeight * 0.4;
      let active = 0;
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= trigger) active = sectionMap[id];
      }
      setScrollActive(active);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname, showNav]);

  const activeIndex = pathname === '/' ? scrollActive : navIndexForPath(pathname);
  const handleSelect = index => setScrollActive(index);

  return <header className="site-header">
    <Link className="brand" href="/"><span className="brand-dot" />余小莫 <i>REALITY ENGINE</i></Link>
    {showNav && <GooeyNav items={navItems} initialActiveIndex={activeIndex} activeIndex={activeIndex} onSelect={handleSelect} />}
  </header>;
}
