'use client';

import { useEffect, useRef, useState } from 'react';

const palette = ['var(--coral)', 'var(--lime)', 'var(--yellow)', 'var(--blue)'];

export default function GooeyNav({ items, initialActiveIndex = 0 }) {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const effectRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const updateEffectPosition = element => {
    if (!containerRef.current || !effectRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const target = element.getBoundingClientRect();
    Object.assign(effectRef.current.style, {
      left: `${target.left - container.left}px`,
      top: `${target.top - container.top}px`,
      width: `${target.width}px`,
      height: `${target.height}px`
    });
  };

  const burst = element => {
    for (let index = 0; index < 12; index += 1) {
      const particle = document.createElement('span');
      const angle = (Math.PI * 2 * index) / 12 + (Math.random() - 0.5) * 0.35;
      const distance = 24 + Math.random() * 36;
      particle.className = 'gooey-particle';
      particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
      particle.style.setProperty('--color', palette[Math.floor(Math.random() * palette.length)]);
      particle.style.setProperty('--delay', `${Math.random() * 90}ms`);
      element.appendChild(particle);
      window.setTimeout(() => particle.remove(), 650);
    }
  };

  const selectItem = (element, index) => {
    if (activeIndex === index) return;
    setActiveIndex(index);
    updateEffectPosition(element);
    if (effectRef.current) burst(effectRef.current);
  };

  useEffect(() => {
    const activeItem = navRef.current?.querySelectorAll('li')[activeIndex];
    if (!activeItem) return undefined;
    updateEffectPosition(activeItem);
    const observer = new ResizeObserver(() => updateEffectPosition(activeItem));
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [activeIndex]);

  return <div className="gooey-nav-container" ref={containerRef}>
    <nav aria-label="主页导航">
      <ul ref={navRef}>
        {items.map((item, index) => <li key={item.href} className={activeIndex === index ? 'active' : ''}>
          <a href={item.href} onClick={event => selectItem(event.currentTarget.parentElement, index)}>{item.label}</a>
        </li>)}
      </ul>
    </nav>
    <span className="gooey-effect" ref={effectRef} aria-hidden="true" />
  </div>;
}
