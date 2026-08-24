'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import GooeyNav from './GooeyNav';
import { navItems, navIndexForPath } from '../lib/site';

const sectionMap = { work: 1, products: 2, notes: 3, about: 4 };
const sectionIds = Object.keys(sectionMap);

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrollActive, setScrollActive] = useState(0);

  useEffect(() => {
    if (pathname !== '/') { setScrollActive(0); return undefined; }
    const targets = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    if (!targets.length) return undefined;
    const observer = new IntersectionObserver(entries => {
      let activeId = null;
      for (const entry of entries) {
        if (entry.isIntersecting) activeId = entry.target.id;
      }
      if (activeId) setScrollActive(sectionMap[activeId]);
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });
    targets.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  const activeIndex = pathname === '/' ? scrollActive : navIndexForPath(pathname);
  const handleSelect = index => setScrollActive(index);

  return <header className="site-header">
    <Link className="brand" href="/"><span className="brand-dot" />余小莫 <i>REALITY ENGINE</i></Link>
    <GooeyNav items={navItems} initialActiveIndex={activeIndex} activeIndex={activeIndex} onSelect={handleSelect} />
  </header>;
}
